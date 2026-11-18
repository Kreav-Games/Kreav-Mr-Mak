// The hands-free voice loop shared by the desktop and phone apps.
// Microphone → local Whisper → the Claude coordinator → local Kokoro voice.
// With the wake word on, Jarvis sleeps until he hears "Hey Jarvis", then
// stays awake for follow-ups until a pause or a goodbye.
import { detectWake, isGoodbye } from './wake'

export type TalkStatus = 'off' | 'starting' | 'sleeping' | 'listening' | 'hearing' | 'thinking' | 'speaking' | 'error'
export interface TalkLine { role: 'user' | 'assistant'; text: string; at: number }
export interface TalkState { status: TalkStatus; error: string; lines: TalkLine[]; level: number; wake: boolean }
export interface TalkAdapter {
  transcribe: (recording: { id: string; audio: Blob; seconds: number; createdAt: number }, signal: AbortSignal) => Promise<{ text: string }>
  ask: (text: string, conversation: string, signal: AbortSignal) => Promise<string>
  speak: (voice: string, text: string, signal: AbortSignal) => Promise<ArrayBuffer>
}

const SPEECH_LEVEL = 0.035      // RMS above this counts as speech
const START_MS = 180            // speech this long starts an utterance
const END_SILENCE_MS = 1100     // silence this long ends it
const MAX_UTTERANCE_MS = 45000  // hard stop for one request
const MAX_SLEEPING_MS = 15000   // longer chatter while asleep is not a wake phrase
const MIN_UTTERANCE_MS = 450    // shorter blips are ignored
const FOLLOW_UP_MS = 9000       // awake time after a reply before sleeping again

export const talkLabels: Record<TalkStatus, string> = {
  off: 'Talk to Jarvis', error: 'Talk to Jarvis', starting: 'Starting', sleeping: 'Say “Hey Jarvis”',
  listening: 'Listening', hearing: 'Hearing you', thinking: 'Thinking', speaking: 'Speaking · tap to interrupt',
}

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

export class TalkMode {
  state: TalkState = { status: 'off', error: '', lines: [], level: 0, wake: true }
  voice = 'bm_lewis'
  private listeners = new Set<() => void>()
  private stream: MediaStream | null = null
  private context: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private recorder: MediaRecorder | null = null
  private recorderStarted = 0
  private chunks: Blob[] = []
  private frame = 0
  private generation = 0
  private loud = 0
  private quietSince = 0
  private utteranceStart = 0
  private awakeUntil = 0
  private source: AudioBufferSourceNode | null = null
  private element: HTMLAudioElement | null = null
  private abort: AbortController | null = null
  private screenLock: { release: () => Promise<void> } | null = null
  constructor(private adapter: TalkAdapter, private keepScreenOn = false) {}
  subscribe = (callback: () => void) => { this.listeners.add(callback); return () => { this.listeners.delete(callback) } }
  snapshot = () => this.state
  private update(patch: Partial<TalkState>) { this.state = { ...this.state, ...patch }; this.listeners.forEach(listener => listener()) }
  private say(role: TalkLine['role'], text: string) { this.update({ lines: [...this.state.lines, { role, text, at: Date.now() }].slice(-40) }) }
  get active() { return !['off', 'error'].includes(this.state.status) }
  dismissError() { this.update({ error: '', status: this.active ? this.state.status : 'off' }) }
  setWake(wake: boolean) {
    this.update({ wake })
    if (!wake && this.state.status === 'sleeping') this.update({ status: 'listening' })
    if (wake && this.state.status === 'listening') this.awakeUntil = performance.now() + FOLLOW_UP_MS
  }

  // The button: start, interrupt a reply, wake a sleeping Jarvis, or stop.
  tap() {
    if (!this.active) { void this.start(); return }
    if (['speaking', 'thinking'].includes(this.state.status)) { this.interrupt(); return }
    if (this.state.status === 'sleeping') { this.chime(); this.awake(); return }
    this.stop()
  }

  async start() {
    if (this.active) return
    const generation = ++this.generation
    this.update({ status: 'starting', error: '' })
    try {
      // Created inside the tap, so phones allow its later playback.
      this.context = new AudioContext(); void this.context.resume().catch(() => {})
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } })
      if (generation !== this.generation) { this.release(); return }
      const source = this.context.createMediaStreamSource(this.stream)
      this.analyser = this.context.createAnalyser(); this.analyser.fftSize = 1024
      source.connect(this.analyser)
      if (this.keepScreenOn) void this.lockScreen()
      // Pressing the button counts as waking him; the wake word is for later.
      this.awake()
    } catch (error) {
      this.release()
      this.update({ status: 'error', error: error instanceof DOMException && error.name === 'NotAllowedError' ? `Microphone access was blocked (${error.message}). Allow it and try again.` : error instanceof Error ? error.message : String(error) })
    }
  }

  stop() {
    this.generation++
    this.abort?.abort(); this.abort = null
    this.silence()
    this.release()
    this.update({ status: 'off', level: 0 })
  }

  interrupt() {
    if (!['speaking', 'thinking'].includes(this.state.status)) return
    this.abort?.abort(); this.abort = null
    this.silence()
    this.generation++
    this.awake()
  }

  private silence() { try { this.source?.stop() } catch { /* Already stopped. */ } this.source = null; this.element?.pause(); this.element = null }

  private async lockScreen() {
    try { this.screenLock = await (navigator as Navigator & { wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> } }).wakeLock?.request('screen') ?? null } catch { /* Optional. */ }
  }

  private release() {
    cancelAnimationFrame(this.frame)
    if (this.recorder?.state === 'recording') { this.recorder.onstop = null; this.recorder.stop() }
    this.recorder = null
    this.stream?.getTracks().forEach(track => track.stop()); this.stream = null
    void this.context?.close().catch(() => {}); this.context = null; this.analyser = null
    void this.screenLock?.release().catch(() => {}); this.screenLock = null
  }

  // A soft two-note chime when Jarvis wakes.
  private chime() {
    const context = this.context
    if (!context) return
    const now = context.currentTime
    for (const [index, frequency] of [660, 990].entries()) {
      const tone = context.createOscillator(), gain = context.createGain()
      tone.frequency.value = frequency; tone.connect(gain); gain.connect(context.destination)
      const start = now + index * 0.11
      gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(0.12, start + 0.02); gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2)
      tone.start(start); tone.stop(start + 0.22)
    }
  }

  private awake() { this.awakeUntil = performance.now() + FOLLOW_UP_MS; this.listen('listening') }
  private sleep() { this.listen(this.state.wake ? 'sleeping' : 'listening') }

  private listen(mode: 'sleeping' | 'listening') {
    // Whenever he listens awake, give the user a full follow-up window.
    if (mode === 'listening') this.awakeUntil = Math.max(this.awakeUntil, performance.now() + FOLLOW_UP_MS)
    if (!this.analyser || !this.stream) return
    const generation = this.generation
    this.loud = 0; this.quietSince = 0; this.utteranceStart = 0
    let asleep = mode === 'sleeping'
    this.update({ status: mode })
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
      const status = this.state.status
      if (status === 'listening' || status === 'sleeping') {
        // No follow-up in time: back to waiting for the wake phrase.
        if (status === 'listening' && this.state.wake && now > this.awakeUntil) { asleep = true; this.update({ status: 'sleeping' }) }
        this.loud = speaking ? this.loud + elapsed : Math.max(0, this.loud - elapsed * 2)
        if (!this.recorder) this.record()
        if (this.loud >= START_MS) { asleep = this.state.status === 'sleeping'; this.utteranceStart = now - this.loud; this.quietSince = 0; this.update({ status: 'hearing' }) }
        // Keep only a short rolling pre-roll while waiting for speech.
        else if (this.recorder && now - this.recorderStarted > 8000) this.restartRecorder()
      } else if (status === 'hearing') {
        if (speaking) this.quietSince = 0
        else if (!this.quietSince) this.quietSince = now
        const limit = asleep ? MAX_SLEEPING_MS : MAX_UTTERANCE_MS
        if ((this.quietSince && now - this.quietSince > END_SILENCE_MS) || now - this.utteranceStart > limit) {
          void this.finish(generation, now - this.utteranceStart, asleep)
          return
        }
      }
      this.frame = requestAnimationFrame(tick)
    }
    this.frame = requestAnimationFrame(tick)
  }

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

  private async finish(generation: number, duration: number, asleep: boolean) {
    const recorder = this.recorder
    this.recorder = null
    const resume = () => { if (generation === this.generation) { if (asleep) this.sleep(); else this.listen('listening') } }
    if (!recorder) { resume(); return }
    const audio = await new Promise<Blob>(resolve => {
      recorder.onstop = () => resolve(new Blob(this.chunks, { type: recorder.mimeType || 'audio/webm' }))
      recorder.stop()
    })
    if (generation !== this.generation) return
    if (duration < MIN_UTTERANCE_MS) { resume(); return }
    // While asleep, transcription only checks for the wake phrase; nothing is shown or sent.
    this.update(asleep ? { status: 'sleeping', level: 0 } : { status: 'thinking', level: 0 })
    const controller = new AbortController(); this.abort = controller
    try {
      const { text } = await this.adapter.transcribe({ id: crypto.randomUUID(), audio, seconds: Math.round(duration / 1000), createdAt: Date.now() }, controller.signal)
      if (generation !== this.generation) return
      let request = text.trim()
      const wake = detectWake(request)
      if (asleep && !wake.woke) { resume(); return }
      if (wake.woke) {
        // "Hey Jarvis" also works while he is already awake; only the request is sent.
        if (asleep) this.chime()
        request = wake.command
        if (!/\w{2}/.test(request)) {
          // Just "Hey Jarvis": acknowledge and wait for the request.
          await this.speak('Yes, sir?', generation, controller.signal)
          if (generation === this.generation) this.awake()
          return
        }
        this.update({ status: 'thinking', level: 0 })
      }
      if (!request || /^\W*$/.test(request)) { this.awakeUntil = Math.max(this.awakeUntil, performance.now() + 3000); resume(); return }
      if (this.state.wake && isGoodbye(request)) {
        this.say('user', request)
        await this.speak('Very good, sir.', generation, controller.signal)
        if (generation === this.generation) this.sleep()
        return
      }
      this.say('user', request)
      const conversation = this.state.lines.slice(-12, -1).map(line => `${line.role === 'user' ? 'User' : 'Jarvis'}: ${line.text}`).join('\n')
      const reply = await this.adapter.ask(request, conversation, controller.signal)
      if (generation !== this.generation) return
      this.say('assistant', reply)
      await this.speak(reply, generation, controller.signal)
      if (generation === this.generation) this.awake()
    } catch (error) {
      if (generation !== this.generation || controller.signal.aborted) return
      if (!asleep) this.update({ error: error instanceof Error ? error.message : String(error) })
      resume()
    } finally { if (this.abort === controller) this.abort = null }
  }

  // Play one WAV reply. An <audio> element first: it uses the normal speakers
  // and works in the Windows app. Where it is blocked (the phone page allows no
  // blob URLs, phones block late playback), fall back to the Web Audio context
  // unlocked by the tap. Either way playback ends, so Jarvis never sticks on
  // "Speaking".
  private async play(audio: ArrayBuffer, generation: number, signal: AbortSignal) {
    const url = URL.createObjectURL(new Blob([audio], { type: 'audio/wav' }))
    const element = new Audio()
    this.element = element
    try {
      const played = await new Promise<boolean>(resolve => {
        let started = false
        element.onplaying = () => { started = true }
        element.onended = () => resolve(true)
        element.onerror = () => resolve(started)
        signal.addEventListener('abort', () => { element.pause(); resolve(true) }, { once: true })
        element.src = url
        element.play().catch(() => resolve(false))
      })
      if (played || generation !== this.generation || signal.aborted) return
    } finally { URL.revokeObjectURL(url); element.onended = element.onerror = element.onplaying = null; if (this.element === element) this.element = null }
    const context = this.context
    if (!context) return
    if (context.state !== 'running') await context.resume().catch(() => {})
    const buffer = await context.decodeAudioData(audio.slice(0))
    if (generation !== this.generation) return
    await new Promise<void>(resolve => {
      const source = context.createBufferSource(); source.buffer = buffer; source.connect(context.destination)
      // A suspended context never reports the end; stop waiting after the clip's length.
      const timer = setTimeout(resolve, buffer.duration * 1000 + 1500)
      source.onended = () => { clearTimeout(timer); resolve() }
      signal.addEventListener('abort', () => { clearTimeout(timer); resolve() }, { once: true })
      this.source = source; source.start()
    })
    this.source = null
  }

  private async speak(text: string, generation: number, signal: AbortSignal) {
    this.update({ status: 'speaking', level: 0 })
    const chunks = speechChunks(text)
    // Prepare the next chunk while the current one plays (one request at a time).
    let next = chunks.length ? this.adapter.speak(this.voice, chunks[0], signal) : null
    for (let index = 0; index < chunks.length && next; index++) {
      const audio = await next
      next = index + 1 < chunks.length ? this.adapter.speak(this.voice, chunks[index + 1], signal) : null
      next?.catch(() => {})
      if (generation !== this.generation) return
      await this.play(audio, generation, signal)
      if (generation !== this.generation) return
    }
  }
}
