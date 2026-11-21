import { emptyInput, type InputFrame } from '../core/types';

type Btn = 'light' | 'heavy' | 'block' | 'dodge' | 'special' | 'taunt' | 'ab1' | 'ab2' | 'ab3' | 'ab4';

/** Collects keyboard, mouse and touch into InputFrames. */
export class Input {
  private keys = new Set<string>();
  private pressed = new Set<Btn | 'pause'>();
  private held = new Set<Btn>();
  private camDX = 0; private camDY = 0;
  private joy = { id: -1, ox: 0, oy: 0, x: 0, y: 0 };
  private camTouch = { id: -1, x: 0, y: 0 };
  touchRoot: HTMLElement | null = null;
  enabled = false; touchVisible = false;
  sens = 1; invertY = false;
  onPause: (() => void) | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    addEventListener('keydown', e => {
      if (!this.enabled) return;
      if (e.repeat) return;
      const k = e.code; this.keys.add(k);
      const map: Record<string, Btn> = { KeyJ: 'light', KeyK: 'heavy', Space: 'dodge', ShiftLeft: 'block', ShiftRight: 'block', KeyQ: 'special', KeyE: 'taunt', Digit1: 'ab1', Digit2: 'ab2', Digit3: 'ab3', Digit4: 'ab4', KeyL: 'block' };
      const b = map[k]; if (b) { this.pressed.add(b); this.held.add(b); e.preventDefault(); }
      if (k === 'Escape' || k === 'KeyP') { this.onPause?.(); }
    });
    addEventListener('keyup', e => {
      this.keys.delete(e.code);
      const map: Record<string, Btn> = { KeyJ: 'light', KeyK: 'heavy', ShiftLeft: 'block', ShiftRight: 'block', KeyL: 'block' };
      const b = map[e.code]; if (b) this.held.delete(b);
    });
    addEventListener('blur', () => { this.keys.clear(); this.held.clear(); });
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    canvas.addEventListener('mousedown', e => {
      if (!this.enabled) return;
      if (e.button === 0) { this.pressed.add('light'); this.held.add('light'); }
      if (e.button === 2) { this.pressed.add('heavy'); this.held.add('heavy'); }
      if (e.button === 1) { this.pressed.add('block'); this.held.add('block'); }
      if (document.pointerLockElement !== canvas && !this.touchVisible) { try { (canvas.requestPointerLock() as any)?.catch?.(() => { }); } catch { /* not available */ } }
    });
    addEventListener('mouseup', e => {
      if (e.button === 0) this.held.delete('light');
      if (e.button === 2) this.held.delete('heavy');
      if (e.button === 1) this.held.delete('block');
    });
    addEventListener('mousemove', e => {
      if (!this.enabled) return;
      if (document.pointerLockElement === canvas) { this.camDX += e.movementX; this.camDY += e.movementY; }
    });
  }

  /** Builds the on-screen touch layout. */
  buildTouch(parent: HTMLElement, labels: { ab: string[] }) {
    this.destroyTouch();
    const root = document.createElement('div'); root.id = 'touch';
    root.innerHTML = `
      <div class="joyzone"><div class="joybase"><div class="joyknob"></div></div><span class="tz-hint">MOVE</span></div>
      <div class="tbtns">
        <button class="tb tb-light" data-b="light"><b>PUNCH</b></button>
        <button class="tb tb-heavy" data-b="heavy"><b>HEAVY</b><i>hold</i></button>
        <button class="tb tb-block" data-b="block"><b>BLOCK</b></button>
        <button class="tb tb-dodge" data-b="dodge"><b>DODGE</b></button>
        <button class="tb tb-special" data-b="special"><b>SPECIAL</b></button>
      </div>
      <div class="tabil">
        ${labels.ab.map((l, i) => `<button class="tb tb-ab" data-b="ab${i + 1}" data-ab="${i}"><b>${l}</b><span class="cdv"></span></button>`).join('')}
        <button class="tb tb-ab tb-taunt" data-b="taunt"><b>TAUNT</b></button>
      </div>`;
    parent.appendChild(root); this.touchRoot = root; this.touchVisible = true;
    const base = root.querySelector('.joybase') as HTMLElement, knob = root.querySelector('.joyknob') as HTMLElement, zone = root.querySelector('.joyzone') as HTMLElement;
    zone.addEventListener('pointerdown', e => {
      e.preventDefault(); if (this.joy.id !== -1) return;
      zone.setPointerCapture(e.pointerId); const r = zone.getBoundingClientRect();
      this.joy = { id: e.pointerId, ox: e.clientX, oy: e.clientY, x: 0, y: 0 };
      base.style.left = (e.clientX - r.left) + 'px'; base.style.top = (e.clientY - r.top) + 'px'; base.classList.add('on');
    });
    zone.addEventListener('pointermove', e => {
      if (e.pointerId !== this.joy.id) return;
      let dx = e.clientX - this.joy.ox, dy = e.clientY - this.joy.oy; const l = Math.hypot(dx, dy), max = 46;
      if (l > max) { dx = dx / l * max; dy = dy / l * max; }
      this.joy.x = dx / max; this.joy.y = dy / max; knob.style.transform = `translate(${dx}px,${dy}px)`;
    });
    const endJoy = (e: PointerEvent) => { if (e.pointerId !== this.joy.id) return; this.joy = { id: -1, ox: 0, oy: 0, x: 0, y: 0 }; knob.style.transform = ''; base.classList.remove('on'); };
    zone.addEventListener('pointerup', endJoy); zone.addEventListener('pointercancel', endJoy);
    root.querySelectorAll<HTMLElement>('[data-b]').forEach(el => {
      const b = el.dataset.b as Btn;
      el.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); this.pressed.add(b); this.held.add(b); el.classList.add('down'); try { el.setPointerCapture(e.pointerId); } catch { /* ignore */ } });
      const up = (e: Event) => { e.preventDefault(); this.held.delete(b); el.classList.remove('down'); };
      el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('lostpointercapture', up);
    });
    // Camera drag on the canvas area for touch
    this.canvas.addEventListener('pointerdown', this.camDown);
    this.canvas.addEventListener('pointermove', this.camMove);
    this.canvas.addEventListener('pointerup', this.camUp);
  }
  private camDown = (e: PointerEvent) => { if (e.pointerType !== 'touch' || this.camTouch.id !== -1) return; this.camTouch = { id: e.pointerId, x: e.clientX, y: e.clientY }; };
  private camMove = (e: PointerEvent) => { if (e.pointerId !== this.camTouch.id) return; this.camDX += (e.clientX - this.camTouch.x) * 1.4; this.camDY += (e.clientY - this.camTouch.y) * 1.4; this.camTouch.x = e.clientX; this.camTouch.y = e.clientY; };
  private camUp = (e: PointerEvent) => { if (e.pointerId === this.camTouch.id) this.camTouch.id = -1; };

  destroyTouch() {
    this.touchRoot?.remove(); this.touchRoot = null; this.touchVisible = false;
    this.canvas.removeEventListener('pointerdown', this.camDown); this.canvas.removeEventListener('pointermove', this.camMove); this.canvas.removeEventListener('pointerup', this.camUp);
  }
  /** Update cooldown overlays on touch ability buttons. */
  setTouchCooldowns(vals: (number | null)[], special: number, finisher: boolean) {
    if (!this.touchRoot) return;
    this.touchRoot.querySelectorAll<HTMLElement>('[data-ab]').forEach(el => {
      const v = vals[Number(el.dataset.ab)];
      el.classList.toggle('locked', v === null);
      (el.querySelector('.cdv') as HTMLElement).style.height = v ? `${Math.round(v * 100)}%` : '0';
    });
    const sp = this.touchRoot.querySelector('.tb-special') as HTMLElement;
    sp.classList.toggle('ready', special >= 100 || finisher); sp.classList.toggle('finisher', finisher);
    sp.style.setProperty('--fill', `${Math.round(Math.min(100, special))}%`);
    (sp.querySelector('b') as HTMLElement).textContent = finisher ? 'FINISH' : 'SPECIAL';
  }

  frame(): InputFrame {
    const f = emptyInput();
    const k = this.keys;
    let mx = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
    let mz = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0);
    if (this.joy.id !== -1) { mx = this.joy.x; mz = -this.joy.y; const l = Math.hypot(mx, mz); if (l < 0.18) { mx = 0; mz = 0; } }
    f.mx = mx; f.mz = mz;
    const p = this.pressed;
    f.light = p.has('light'); f.heavy = p.has('heavy'); f.dodge = p.has('dodge'); f.special = p.has('special'); f.taunt = p.has('taunt');
    f.ab1 = p.has('ab1'); f.ab2 = p.has('ab2'); f.ab3 = p.has('ab3'); f.ab4 = p.has('ab4');
    f.block = this.held.has('block'); f.heavyHeld = this.held.has('heavy');
    f.mash = p.size > 0;
    this.pressed.clear();
    return f;
  }
  camera() { const d = { dx: this.camDX * 0.0035 * this.sens, dy: this.camDY * 0.0025 * this.sens * (this.invertY ? -1 : 1) }; this.camDX = 0; this.camDY = 0; return d; }
  reset() { this.pressed.clear(); this.held.clear(); this.keys.clear(); this.camDX = 0; this.camDY = 0; }
  releaseLock() { if (document.pointerLockElement) document.exitPointerLock(); }
}
