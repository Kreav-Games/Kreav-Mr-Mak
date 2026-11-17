// Desktop Talk mode: the shared voice loop wired to the desktop service.
import { api, desktopState, speakTalkText, transcribeDesktopAudio } from './client'
import { TalkMode } from '../lib/talk'
import type { Operation } from './types'

export const talkMode = new TalkMode({
  transcribe: transcribeDesktopAudio,
  speak: speakTalkText,
  ask: async (text, conversation) => {
    const operation = await api<Operation>('/coordinator', { id: crypto.randomUUID(), text, conversation, selectedId: desktopState().selectedId })
    return operation.status === 'completed' ? operation.result || 'Done.' : operation.result || 'I could not complete that request.'
  },
})
