// Phone Talk mode: the shared voice loop wired to the phone gateway.
import { askJarvis, speakJarvis, transcribeMobileAudio } from './client'
import { TalkMode } from '../lib/talk'

export const phoneTalk = new TalkMode({ transcribe: transcribeMobileAudio, ask: askJarvis, speak: speakJarvis }, true)

const wakeKey = 'mrmak.mobile.talk.wake'
export function savedWake() { try { return localStorage.getItem(wakeKey) !== 'off' } catch { return true } }
export function saveWake(value: boolean) { try { localStorage.setItem(wakeKey, value ? 'on' : 'off') } catch { /* This visit only. */ } phoneTalk.setWake(value) }
phoneTalk.setWake(savedWake())
