import type { Fighter } from '../combat/fighter';
import type { Zone } from '../core/types';
import { MOVES } from '../data/moves';
import { CLASSES } from '../data/classes';

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

export class Hud {
  root: HTMLElement;
  private el: Record<string, HTMLElement> = {};
  private trail = [1, 1];
  private annT = 0; private comboShown = 0;
  private pops: HTMLElement;
  constructor(parent: HTMLElement, a: Fighter, b: Fighter, touch: boolean, onPause: () => void) {
    const root = this.root = document.createElement('div'); root.id = 'hud';
    const side = (f: Fighter, k: string) => `
      <div class="hf hf-${k}">
        <div class="hf-name"><b>${esc(f.name)}</b><span style="color:${CLASSES[f.cls].color}">${CLASSES[f.cls].name}</span></div>
        <div class="hp"><i class="hp-trail"></i><i class="hp-fill"></i><span class="hp-num"></span></div>
        <div class="subbars">
          <div class="sb st"><i></i><label>STAMINA</label></div>
          <div class="sb ht"><i></i><label>HEAT</label></div>
        </div>
        <div class="sp"><i></i><label>SPECIAL</label></div>
        <div class="zones">${(['head', 'torso', 'arms', 'legs'] as Zone[]).map(z => `<span class="z z-${z}" title="${z}">${z[0].toUpperCase()}</span>`).join('')}</div>
        <div class="buffs"></div>
      </div>`;
    root.innerHTML = `
      <div class="hud-top">${side(a, 'a')}<div class="hud-mid"><div class="rnd">ROUND 1</div><div class="tmr">90</div><div class="pips"></div></div>${side(b, 'b')}</div>
      <div class="combo"><b>0</b><span>HIT COMBO</span></div>
      <div class="ann"><div class="ann-big"></div><div class="ann-sub"></div></div>
      <div class="pops"></div>
      <div class="tut" hidden></div>
      <button class="pausebtn" aria-label="Pause">II</button>
      ${touch ? '' : `<div class="abil">${a.abilityIds().map((id, i) => `<div class="ab" data-i="${i}"><kbd>${i + 1}</kbd><span>${id ? esc(MOVES[id].name) : '—'}</span><i></i></div>`).join('')}<div class="ab sp-ab"><kbd>Q</kbd><span>Special</span><i></i></div></div>
      <div class="keyhint">WASD move · LMB/J punch · RMB/K heavy (hold to charge) · Shift block · Space dodge · Q special · E taunt · 1–4 abilities · Esc pause · click to lock the mouse for camera</div>`}`;
    parent.appendChild(root);
    const q = (s: string) => root.querySelector(s) as HTMLElement;
    for (const k of ['a', 'b']) {
      this.el[k + 'hp'] = q(`.hf-${k} .hp-fill`); this.el[k + 'tr'] = q(`.hf-${k} .hp-trail`); this.el[k + 'num'] = q(`.hf-${k} .hp-num`);
      this.el[k + 'st'] = q(`.hf-${k} .st i`); this.el[k + 'ht'] = q(`.hf-${k} .ht i`); this.el[k + 'htw'] = q(`.hf-${k} .ht`); this.el[k + 'sp'] = q(`.hf-${k} .sp i`); this.el[k + 'spw'] = q(`.hf-${k} .sp`);
      this.el[k + 'bf'] = q(`.hf-${k} .buffs`);
      for (const z of ['head', 'torso', 'arms', 'legs']) this.el[k + z] = q(`.hf-${k} .z-${z}`);
    }
    this.el.rnd = q('.rnd'); this.el.tmr = q('.tmr'); this.el.pips = q('.pips'); this.el.combo = q('.combo'); this.el.comboN = q('.combo b');
    this.el.annB = q('.ann-big'); this.el.annS = q('.ann-sub'); this.el.ann = q('.ann'); this.el.tut = q('.tut');
    this.pops = q('.pops');
    q('.pausebtn').addEventListener('click', onPause);
  }

  update(dt: number, a: Fighter, b: Fighter, round: number, rounds: number, time: number, wins: [number, number]) {
    const sides: [string, Fighter, number][] = [['a', a, 0], ['b', b, 1]];
    for (const [k, f, i] of sides) {
      const fr = Math.max(0, f.hp / f.stats.maxHp);
      this.trail[i] = fr > this.trail[i] ? fr : this.trail[i] - Math.min(this.trail[i] - fr, dt * 0.35);
      this.el[k + 'hp'].style.width = (fr * 100).toFixed(1) + '%';
      this.el[k + 'tr'].style.width = (this.trail[i] * 100).toFixed(1) + '%';
      this.el[k + 'hp'].classList.toggle('low', fr < 0.25);
      this.el[k + 'num'].textContent = `${Math.ceil(f.hp)}`;
      this.el[k + 'st'].style.width = (f.stamina / f.stats.staminaMax * 100).toFixed(1) + '%';
      this.el[k + 'ht'].style.width = Math.min(100, f.heat).toFixed(1) + '%';
      this.el[k + 'htw'].classList.toggle('hot', f.heat > 75 || f.state === 'overheat');
      this.el[k + 'sp'].style.width = Math.min(100, f.special).toFixed(1) + '%';
      this.el[k + 'spw'].classList.toggle('full', f.special >= 100);
      for (const z of ['head', 'torso', 'arms', 'legs'] as Zone[]) {
        const zf = f.zone[z] / f.zoneMax[z];
        const el = this.el[k + z]; el.style.setProperty('--z', String(Math.max(0, zf)));
        el.classList.toggle('crit', zf <= 0); el.classList.toggle('warn', zf > 0 && zf < 0.4);
      }
      const bf: string[] = [];
      if (f.buffs.ironwill > 0) bf.push('IRON WILL'); if (f.buffs.phase > 0) bf.push('PHASE'); if (f.buffs.shieldHp > 0) bf.push('SHIELD'); if (f.buffs.counter > 0) bf.push('COUNTER STANCE');
      if (f.buffs.bleed > 0) bf.push('BLEEDING'); if (f.buffs.burn > 0) bf.push('BURNING'); if (f.state === 'overheat') bf.push('OVERHEATED'); if (f.counterWindow > 0) bf.push('COUNTER!');
      if (f.kd > 0) bf.push(`KD ${f.kd}/3`);
      const html = bf.map(x => `<span>${x}</span>`).join('');
      if (this.el[k + 'bf'].innerHTML !== html) this.el[k + 'bf'].innerHTML = html;
    }
    this.el.rnd.textContent = `ROUND ${round}${rounds > 1 ? ' / ' + rounds : ''}`;
    this.el.tmr.textContent = isFinite(time) ? String(Math.max(0, Math.ceil(time))) : '∞';
    this.el.tmr.classList.toggle('low', time < 10);
    const pips = `${'<i class="w"></i>'.repeat(wins[0])}${'<i></i>'.repeat(Math.max(0, Math.ceil(rounds / 2) - wins[0]))}<em></em>${'<i></i>'.repeat(Math.max(0, Math.ceil(rounds / 2) - wins[1]))}${'<i class="l"></i>'.repeat(wins[1])}`;
    if (this.el.pips.innerHTML !== pips) this.el.pips.innerHTML = pips;
    // combo
    if (a.combo >= 2) { if (this.comboShown !== a.combo) { this.comboShown = a.combo; this.el.comboN.textContent = String(a.combo); this.el.combo.classList.remove('bump'); void this.el.combo.offsetWidth; this.el.combo.classList.add('bump'); } this.el.combo.classList.add('on'); }
    else this.el.combo.classList.remove('on');
    // abilities
    const abs = this.root.querySelectorAll<HTMLElement>('.abil .ab[data-i]');
    abs.forEach(el => {
      const i = Number(el.dataset.i); const id = a.abilityIds()[i];
      const locked = !id || (i === 1 && !a.stats.abilityB);
      el.classList.toggle('locked', locked);
      const cd = id ? (a.cd[id] || 0) : 0; const max = id ? (MOVES[id].cd || 1) * a.stats.cdMult : 1;
      (el.querySelector('i') as HTMLElement).style.height = locked ? '100%' : `${Math.round(cd / max * 100)}%`;
    });
    const spab = this.root.querySelector('.sp-ab') as HTMLElement | null;
    if (spab) { spab.classList.toggle('ready', a.special >= 100 || a.finisherReady); (spab.querySelector('span') as HTMLElement).textContent = a.finisherReady ? 'FINISHER' : 'Special'; (spab.querySelector('i') as HTMLElement).style.height = `${100 - Math.min(100, a.special)}%`; }
    if (this.annT > 0) { this.annT -= dt; if (this.annT <= 0) this.el.ann.classList.remove('on'); }
  }

  announce(big: string, sub = '', color = '#FFB12E', time = 1.6) {
    if (!big) return;
    this.el.annB.textContent = big; this.el.annS.textContent = sub; this.el.annB.style.color = color;
    this.el.ann.classList.remove('on'); void this.el.ann.offsetWidth; this.el.ann.classList.add('on'); this.annT = time;
  }
  popup(text: string, x: number, y: number, color: string, big: boolean) {
    if (this.pops.childElementCount > 14) this.pops.firstElementChild?.remove();
    const d = document.createElement('div'); d.className = 'pop' + (big ? ' big' : ''); d.textContent = text; d.style.color = color;
    d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.setProperty('--dx', ((Math.random() - 0.5) * 50).toFixed(0) + 'px');
    this.pops.appendChild(d); setTimeout(() => d.remove(), 1100);
  }
  tutorial(html: string | null) { const t = this.el.tut; if (!html) { t.hidden = true; return; } t.hidden = false; t.innerHTML = html; }
  flash(color: string) { const f = document.createElement('div'); f.className = 'flash'; f.style.background = color; this.root.appendChild(f); setTimeout(() => f.remove(), 400); }
  dispose() { this.root.remove(); }
}
