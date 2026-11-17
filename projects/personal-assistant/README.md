# Personal Assistant

A Jarvis-style voice assistant for PC and phone, built into Mr. Mak.
Original persona and voice: no film character's name, likeness or cloned voice.

## Decisions

- **Brain:** Claude Code with the owner's Claude Max (5x) subscription. No API key.
- **Voice:** Kokoro `bm_lewis` (British man), free and local on the PC.
- **Hearing:** free local Whisper on the PC.
- **Phone:** the existing Mr. Mak phone app over Tailscale.
- **Memory:** `context/memory.md`, kept out of Git, editable by hand.

## Phase 1: free voice loop on the PC (done)

- Claude coordinator (`desktop/service/claude-coordinator.mjs`) replaces the
  Codex coordinator when Claude Code is installed. It runs `claude -p` with
  stream-json and reaches Mr. Mak's tools through a token-protected loopback
  MCP bridge (`coordinator-mcp.mjs`). Built-in Claude tools are disabled.
- `remember` and `recall` tools keep long-term memory.
- Talk mode (`src/desktop/talk.ts`): the Mak button listens hands-free, ends
  a request after about a second of silence, then transcribes it, asks Claude
  and speaks the reply with Lewis. Tap while it speaks to interrupt.
- Lewis added to the reading voices on desktop and phone.
- Settings: `voiceEngine` (`talk` or `live`), `talkVoice`,
  `coordinatorAgent` (`claude` or `codex`). `.env` can force the engine with
  `MRMAK_COORDINATOR_AGENT`.

Checked: a fake microphone in Chromium with the real Claude coordinator and
real Kokoro speech completed listen → think → speak. Whisper was stubbed in
that run because it is not installed in the test container.

## Phase 2 and 3: Jarvis on the phone, and "Hey Jarvis" (done)

- The assistant is named Jarvis (system prompt persona; UI labels).
- One shared voice loop (`src/lib/talk.ts`) drives desktop and phone.
- Wake word: while asleep, short speech bursts are transcribed locally and
  checked for "Hey Jarvis" or "Jarvis …" (`src/lib/wake.ts`, with common
  Whisper mishearings). Whisper gets "Jarvis" as a hotword. A chime plays on
  waking; a bare "Hey Jarvis" gets "Yes, sir?". He stays awake ~9 s for
  follow-ups; "That's all" or "Goodbye" sends him back to sleep.
- Phone: header microphone button and a Jarvis sheet; gateway routes
  `/mobile/api/talk/ask` and `/mobile/api/talk/speak`; replies play through
  Web Audio; the screen is kept on while he listens.

Checked: desktop slept after a goodbye, ignored chatter, woke on "Hey Jarvis"
and answered with real Claude and Kokoro; the phone answered "Hey Jarvis" with
"Yes, sir?" and then the follow-up. Whisper was stubbed in the container.

Possible upgrade: a dedicated wake-word model (openWakeWord ships a
"hey_jarvis" model) would use less CPU than transcribing speech while asleep.

## Phase 4: more abilities

Add one tool at a time and test each: web search, opening apps and files on
the PC, timers and reminders, calendar and email (through MCP connectors),
smart home. Consider a faster reply path for small talk.

## Acceptance checks

- Spoken request to spoken reply in under about 6 seconds on the owner's PC.
- Never claims an action finished before the tool result says so.
- Works with the PC's own microphone and from the phone.
