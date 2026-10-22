/** Shared wolf mark for Workspace, Chats and the voice controls. `tone` is accepted for the template's call sites; the wolf has one tone. */
export default function MakLogo({ size = 64 }: { size?: number; animated?: boolean; tone?: 'pink' | 'black' }) {
  return <img className="mak-logo" src="/assets/wolf.png" width={size} height={size} alt="" aria-hidden="true" draggable={false} style={{ display: 'block', flexShrink: 0, objectFit: 'contain' }} />
}
