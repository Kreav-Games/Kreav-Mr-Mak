// Wake phrase detection on transcribed speech ("Hey Jarvis, open the game chat").
// Whisper sometimes spells the name differently, so close variants count too.
const NAME = String.raw`(?:jarvis(?:'s)?|jarvi|javis|jarvas|jarvus|jervis|jarvies)`
const GREETING = String.raw`(?:hey|hi|hello|okay|ok|yo|oi|right|alright)`
// "Hey Jarvis …" anywhere in the utterance, or "Jarvis …" at its start.
const anywhere = new RegExp(String.raw`(?:^|[\s,.!?])${GREETING}[\s,]+${NAME}\b[\s,.!?:;-]*`, 'i')
const atStart = new RegExp(String.raw`^\W*${NAME}\b[\s,.!?:;-]*`, 'i')
// Mishearings that are common words are accepted only after a greeting.
const misheard = new RegExp(String.raw`(?:^|[\s,.!?])${GREETING}[\s,]+(?:travis|harvest|service|jarvie)\b[\s,.!?:;-]*`, 'i')

export interface Wake { woke: boolean; command: string }

export function detectWake(text: string): Wake {
  const clean = text.trim()
  for (const pattern of [anywhere, atStart, misheard]) {
    const match = pattern.exec(clean)
    if (match) return { woke: true, command: clean.slice(match.index + match[0].length).trim().replace(/^[\s,.!?:;-]+/, '') }
  }
  return { woke: false, command: '' }
}

// A goodbye ends the conversation and puts the assistant back to sleep.
export function isGoodbye(text: string) {
  return /^\W*(?:that'?s all|that is all|thanks?,? that'?s all|goodbye|good night|bye|go to sleep|stand by|never ?mind)\W*(?:jarvis)?\W*$/i.test(text.trim())
}
