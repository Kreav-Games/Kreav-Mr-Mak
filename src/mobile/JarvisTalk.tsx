import { useState, useSyncExternalStore } from 'react'
import { Icon } from '../desktop/Icons'
import { talkLabels } from '../lib/talk'
import { phoneTalk, saveWake } from './talk'

// The Jarvis button in the phone header and its conversation sheet.
export function JarvisButton({ connected }: { connected: boolean }) {
  const talk = useSyncExternalStore(phoneTalk.subscribe, phoneTalk.snapshot)
  const active = !['off', 'error'].includes(talk.status)
  return <button className={`mobile-icon mobile-jarvis-button ${active ? 'active' : ''} is-${talk.status}`} aria-label={active ? talkLabels[talk.status] : 'Talk to Jarvis'} title={talkLabels[talk.status]} aria-pressed={active} disabled={!connected && !active} onClick={() => phoneTalk.tap()}>
    <Icon name="mic" size={19} />
  </button>
}

export function JarvisSheet() {
  const talk = useSyncExternalStore(phoneTalk.subscribe, phoneTalk.snapshot)
  const [open, setOpen] = useState(true)
  const active = !['off', 'error'].includes(talk.status)
  if (!active && !talk.error) return null
  const last = talk.lines.slice(-4)
  return <section className={`mobile-jarvis is-${talk.status}`} aria-label="Jarvis">
    <header>
      <button className="mobile-jarvis-orb" aria-label={talkLabels[talk.status]} onClick={() => phoneTalk.tap()}><span style={{ transform: `scale(${1 + Math.min(talk.level * 6, 0.6)})` }} /></button>
      <div><strong>Jarvis</strong><small role="status">{talkLabels[talk.status]}</small></div>
      <label className="mobile-jarvis-wake"><input type="checkbox" checked={talk.wake} onChange={event => saveWake(event.target.checked)} />Hey Jarvis</label>
      <button className="mobile-icon" aria-label={open ? 'Hide Jarvis conversation' : 'Show Jarvis conversation'} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'chats'} size={16} /></button>
      <button className="mobile-jarvis-stop" onClick={() => phoneTalk.stop()} disabled={!active}>Stop</button>
    </header>
    {talk.error && <p className="mobile-error" role="alert">{talk.error}<button className="mobile-icon" aria-label="Dismiss Jarvis error" onClick={() => phoneTalk.dismissError()}><Icon name="close" size={15} /></button></p>}
    {open && last.length > 0 && <div className="mobile-jarvis-lines">{last.map(line => <p key={line.at + line.role} className={line.role}><span>{line.role === 'user' ? 'You' : 'Jarvis'}</span>{line.text}</p>)}</div>}
    {open && !last.length && <p className="mobile-jarvis-hint">Speak now, or say “Hey Jarvis” later. Keep this page open; the screen stays on while Jarvis listens.</p>}
  </section>
}
