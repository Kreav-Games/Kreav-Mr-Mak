// Talk mode: a free, hands-free voice loop.
// Microphone → local Whisper (/api/transcribe) → the Claude coordinator
// (/api/coordinator) → local Kokoro speech (/api/talk/speak) → listen again.
// Nothing here needs an API key; the PC does the speech work.
import { api, desktopState, speakTalkText, transcribeDesktopAudio } from './client'
import type { Operation } from './types'

export type TalkStatus = 'off' | 'starting' | 'listening' | 'hearing' | 'thinking' | 'speaking' | 'error'
export interface TalkLine { role: 'user' | 'assistant'; text: string; at: number }
export interface TalkState { status: TalkStatus; error: string; lines: TalkLine[]; level: number }

const SPEECH_LEVEL = 0.035      // RMS above this counts as speech
const START_MS = 180            // speech this long starts an utterance
const END_SILENCE_MS = 1100     // silence this long ends it
const MAX_UTTERANCE_MS = 45000  // hard stop for one request
const MIN_UTTERANCE_MS = 450    // shorter blips are ignored

// Split a reply into sentence groups the local voice can read (≤ 2000 chars each).
export function speechChunks(text: string, limit = 600): string[] {
  const clean = text.replace(/```[\s\S]*?```/g, ' ').replace(/[*_#`>|]/g, '').replace(/\]\([^)]*\)/g, ']').replace(/\s+/g, ' ').trim()
  if (!clean) return []
  const sentences = clean.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) || [clean]
  const chunks: string[] = []
  let current = ''
  for (const sentence of sentences) {
    for (let piece = sentence; piece; piece = piece.slice(limit)) {
      const part = piece.slice(0, limit)
      if (current && current.length + part.length > limit) { chunks.push(current.trim()); current = '' }
      current += part
      if (piece.length <= limit) break
    }
  }
  if (current.trim()) chunks.push(current.trim())
  return chunks
}

class TalkMode {
  state: TalkState = { status: 'off', error: '', lines: [], level: 0 }
  voice = 'bm_lewis'
  private listeners = new Set<() => void>()
  private stream: MediaStream | null = null
  private context: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private recorder: MediaRecorder | null = null
  private chunks: Blob[] = []
  private frame = 0
  private generation = 0
  private loud = 0
  private quietSince = 0
  private utteranceStart = 0
  private player = new Audio()
  private abort: AbortController | null = null
  subscribe = (callback: () => void) => { this.listeners.add(callback); return () => { this.listeners.delete(callback) } }
  snapshot = () => this.state
  private update(patch: Partial<TalkState>) { this.state = { ...this.state, ...patch }; this.listeners.forEach(listener => listener()) }
  private say(role: TalkLine['role'], text: string) { this.update({ lines: [...this.state.lines, { role, text, at: Date.now() }].slice(-40) }) }
  get active() { return !['off', 'error'].includes(this.state.status) }
  dismissError() { this.update({ error: '', status: this.active ? this.state.status : 'off' }) }

  async start() {
    if (this.active) return
    const generation = ++this.generation
    this.update({ status: 'starting', error: '' })
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } })
      if (generation !== this.generation) { this.release(); return }
      this.context = new AudioContext()
      const source = this.context.createMediaStreamSource(this.stream)
      this.analyser = this.context.createAnalyser(); this.analyser.fftSize = 1024
      source.connect(this.analyser)
      this.listen()
    } catch (error) {
      this.release()
      this.update({ status: 'error', error: error instanceof DOMException && error.name === 'NotAllowedError' ? `Microphone access was blocked (${error.message}). Allow it and try again.` : error instanceof Error ? error.message : String(error) })
    }
  }

  stop() {
    this.generation++
    this.abort?.abort(); this.abort = null
    this.player.pause(); this.player.removeAttribute('src')
    this.release()
    this.update({ status: 'off', level: 0 })
  }

  // Tap while Mak is speaking or thinking: stop that and listen again.
  interrupt() {
    if (!['speaking', 'thinking'].includes(this.state.status)) return
    this.abort?.abort(); this.abort = null
    this.player.pause(); this.player.removeAttribute('src')
    this.generation++
    this.listen()
  }

  private release() {
    cancelAnimationFrame(this.frame)
    if (this.recorder?.state === 'recording') { this.recorder.onstop = null; this.recorder.stop() }
    this.recorder = null
    this.stream?.getTracks().forEach(track => track.stop()); this.stream = null
    void this.context?.close().catch(() => {}); this.context = null; this.analyser = null
  }

  private listen() {
    if (!this.analyser || !this.stream) return
    const generation = this.generation
    this.loud = 0; this.quietSince = 0; this.utteranceStart = 0
    this.update({ status: 'listening' })
    const samples = new Float32Array(this.analyser.fftSize)
    let last = performance.now()
    const tick = (now: number) => {
      if (generation !== this.generation || !this.analyser) return
      const elapsed = now - last; last = now
      this.analyser.getFloatTimeDomainData(samples)
      let sum = 0
      for (const value of samples) sum += value * value
      const level = Math.sqrt(sum / samples.length)
      if (Math.abs(level - this.state.level) > 0.01) this.update({ level })
      const speaking = level > SPEECH_LEVEL
      if (this.state.status === 'listening') {
        this.loud = speaking ? this.loud + elapsed : Math.max(0, this.loud - elapsed * 2)
        if (!this.recorder) this.record()
        if (this.loud >= START_MS) { this.utteranceStart = now - this.loud; this.quietSince = 0; this.update({ status: 'hearing' }) }
        // Keep only a short rolling pre-roll while waiting for speech.
        else if (this.recorder && now - this.recorderStarted > 8000) this.restartRecorder()
      } else if (this.state.status === 'hearing') {
        if (speaking) this.quietSince = 0
        else if (!this.quietSince) this.quietSince = now
        if ((this.quietSince && now - this.quietSince > END_SILENCE_MS) || now - this.utteranceStart > MAX_UTTERANCE_MS) {
          const duration = now - this.utteranceStart
          void this.finish(generation, duration)
          return
        }
      }
      this.frame = requestAnimationFrame(tick)
    }
    this.frame = requestAnimationFrame(tick)
  }

  private recorderStarted = 0
  private record() {
    if (!this.stream) return
    const type = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find(item => MediaRecorder.isTypeSupported(item))
    this.recorder = new MediaRecorder(this.stream, type ? { mimeType: type } : undefined)
    this.chunks = []
    this.recorder.ondataavailable = event => { if (event.data.size) this.chunks.push(event.data) }
    this.recorder.start()
    this.recorderStarted = performance.now()
  }
  private restartRecorder() {
    if (this.recorder?.state === 'recording') { this.recorder.onstop = null; this.recorder.stop() }
    this.recorder = null; this.record()
  }

  private async finish(generation: number, duration: number) {
    const recorder = this.recorder
    this.recorder = null
    if (!recorder) { this.listen(); return }
    const audio = await new Promise<Blob>(resolve => {
      recorder.onstop = () => resolve(new Blob(this.chunks, { type: recorder.mimeType || 'audio/webm' }))
      recorder.stop()
    })
    if (generation !== this.generation) return
    if (duration < MIN_UTTERANCE_MS) { this.listen(); return }
    this.update({ status: 'thinking', level: 0 })
    const controller = new AbortController(); this.abort = controller
    try {
      const { text } = await transcribeDesktopAudio({ id: crypto.randomUUID(), audio, seconds: Math.round(duration / 1000), createdAt: Date.now() }, controller.signal)
      if (generation !== this.generation) return
      const heard = text.trim()
      if (!heard || /^\W*$/.test(heard)) { this.listen(); return }
      this.say('user', heard)
      const conversation = this.state.lines.slice(-12, -1).map(line => `${line.role === 'user' ? 'User' : 'Assistant'}: ${line.text}`).join('\n')
      const operation = await api<Operation>('/coordinator', { id: crypto.randomUUID(), text: heard, conversation, selectedId: desktopState().selectedId })
      if (generation !== this.generation) return
      const reply = operation.status === 'completed' ? operation.result || 'Done.' : operation.result || 'I could not complete that request.'
      this.say('assistant', reply)
      await this.speak(reply, generation, controller.signal)
      if (generation === this.generation) this.listen()
    } catch (error) {
      if (generation !== this.generation || controller.signal.aborted) return
      this.update({ error: error instanceof Error ? error.message : String(error) })
      this.listen()
    } finally { if (this.abort === controller) this.abort = null }
  }

  private async speak(text: string, generation: number, signal: AbortSignal) {
    this.update({ status: 'speaking' })
    const chunks = speechChunks(text)
    // Prepare the next chunk while the current one plays.
    let next = chunks.length ? speakTalkText(this.voice, chunks[0], signal) : null
    for (let index = 0; index < chunks.length && next; index++) {
      const audio = await next
      next = index + 1 < chunks.length ? speakTalkText(this.voice, chunks[index + 1], signal) : null
      next?.catch(() => {})
      if (generation !== this.generation) return
      const url = URL.createObjectURL(new Blob([audio], { type: 'audio/wav' }))
      try {
        await new Promise<void>((resolve, reject) => {
          this.player.onended = () => resolve()
          this.player.onerror = () => reject(new Error('Could not play the reply.'))
          signal.addEventListener('abort', () => resolve(), { once: true })
          this.player.src = url
          void this.player.play().catch(reject)
        })
      } finally { URL.revokeObjectURL(url) }
      if (generation !== this.generation) return
    }
  }
}

export const talkMode = new TalkMode()
