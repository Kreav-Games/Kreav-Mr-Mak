// All sound is synthesized with the Web Audio API: no audio files are loaded.
export class Audio {
  ctx: AudioContext | null = null;
  private master!: GainNode; private sfxG!: GainNode; private musicG!: GainNode; private crowdG!: GainNode;
  private noise!: AudioBuffer;
  private crowdLevel = 0.15; private crowdTarget = 0.15;
  private crowdSrc: AudioBufferSourceNode | null = null; private crowdFilter!: BiquadFilterNode;
  private track: 'menu' | 'fight' | null = null; private nextNote = 0; private step = 0;
  vol = { master: 0.8, music: 0.5, sfx: 0.9 };

  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    try {
      const C = (window.AudioContext || (window as any).webkitAudioContext);
      this.ctx = new C();
    } catch { this.ctx = null; return; }
    const c = this.ctx!;
    this.master = c.createGain(); this.master.connect(c.destination);
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(this.master);
    this.sfxG = c.createGain(); this.sfxG.connect(comp);
    this.musicG = c.createGain(); this.musicG.connect(comp);
    this.crowdG = c.createGain(); this.crowdG.connect(comp); this.crowdG.gain.value = 0;
    const len = c.sampleRate * 2; this.noise = c.createBuffer(1, len, c.sampleRate);
    const d = this.noise.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.applyVolumes();
    window.setInterval(() => this.schedule(), 50);
  }
  setVolumes(master: number, music: number, sfx: number) { this.vol = { master, music, sfx }; this.applyVolumes(); }
  private applyVolumes() { if (!this.ctx) return; this.master.gain.value = this.vol.master; this.musicG.gain.value = this.vol.music * 0.35; this.sfxG.gain.value = this.vol.sfx; }

  private env(g: GainNode, t: number, a: number, peak: number, dec: number) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); }
  private osc(type: OscillatorType, f: number, t: number, dur: number, peak: number, out: AudioNode, f2?: number, a = 0.005) {
    const c = this.ctx!; const o = c.createOscillator(); const g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
    this.env(g, t, a, peak, dur); o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + a + 0.05);
  }
  private nz(t: number, dur: number, peak: number, type: BiquadFilterType, f: number, out: AudioNode, q = 1, f2?: number, a = 0.003) {
    const c = this.ctx!; const s = c.createBufferSource(); s.buffer = this.noise; s.playbackRate.value = 0.8 + Math.random() * 0.4;
    const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q; if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    const g = c.createGain(); this.env(g, t, a, peak, dur); s.connect(fl); fl.connect(g); g.connect(out); s.start(t, Math.random()); s.stop(t + dur + a + 0.05);
  }
  private metalRing(t: number, base: number, peak: number, dur: number) {
    for (const r of [1, 2.76, 5.4, 8.93]) this.osc('sine', base * r * (0.98 + Math.random() * 0.04), t, dur / Math.sqrt(r), peak / r, this.sfxG);
  }

  sfx(name: string, vol = 1) {
    if (!this.ctx) return; const t = this.ctx.currentTime + 0.005; const o = this.sfxG; const v = vol;
    switch (name) {
      case 'whoosh': this.nz(t, 0.18, 0.25 * v, 'bandpass', 600, o, 1.2, 2400, 0.04); break;
      case 'whiff': this.nz(t, 0.22, 0.18 * v, 'bandpass', 1400, o, 2, 400, 0.03); break;
      case 'impact': this.nz(t, 0.12, 0.7 * v, 'lowpass', 2600, o, 1); this.osc('sine', 140, t, 0.16, 0.6 * v, o, 60); this.metalRing(t, 380 + Math.random() * 120, 0.12 * v, 0.35); break;
      case 'impactHeavy': this.nz(t, 0.25, 0.9 * v, 'lowpass', 1800, o, 1); this.osc('sine', 90, t, 0.4, 0.9 * v, o, 38); this.osc('square', 60, t, 0.12, 0.25 * v, o, 30); this.metalRing(t, 220 + Math.random() * 80, 0.18 * v, 0.7); break;
      case 'block': this.nz(t, 0.09, 0.5 * v, 'bandpass', 900, o, 2); this.osc('triangle', 180, t, 0.1, 0.4 * v, o, 120); this.metalRing(t, 520, 0.06 * v, 0.2); break;
      case 'parry': this.metalRing(t, 880, 0.3 * v, 0.9); this.osc('sine', 1760, t, 0.4, 0.15 * v, o); this.nz(t, 0.06, 0.4 * v, 'highpass', 3000, o); break;
      case 'guard': this.nz(t, 0.08, 0.12 * v, 'bandpass', 500, o, 3); break;
      case 'dodge': this.nz(t, 0.25, 0.3 * v, 'bandpass', 900, o, 1, 300, 0.02); this.nz(t, 0.3, 0.12 * v, 'highpass', 4000, o); break;
      case 'step': this.osc('sine', 70, t, 0.12, 0.35 * v, o, 40); this.nz(t, 0.06, 0.12 * v, 'bandpass', 600, o, 4); this.metalRing(t, 300, 0.02 * v, 0.1); break;
      case 'hydraulic': this.nz(t, 0.4, 0.22 * v, 'bandpass', 2200, o, 6, 900, 0.05); this.osc('sawtooth', 55, t, 0.35, 0.08 * v, o, 80); break;
      case 'stagger': this.osc('sawtooth', 220, t, 0.4, 0.12 * v, o, 90); break;
      case 'knockdown': this.osc('sine', 60, t, 0.8, 1 * v, o, 25); this.nz(t, 0.6, 0.8 * v, 'lowpass', 900, o); this.metalRing(t, 150, 0.2 * v, 1.2); break;
      case 'shutdown': this.osc('sawtooth', 440, t, 1.4, 0.25 * v, o, 30, 0.01); this.osc('square', 220, t + 0.1, 1.2, 0.1 * v, o, 20); break;
      case 'crit': this.osc('square', 1200, t, 0.08, 0.15 * v, o); this.osc('square', 900, t + 0.1, 0.08, 0.15 * v, o); this.osc('square', 1200, t + 0.2, 0.08, 0.15 * v, o); break;
      case 'special': this.osc('sawtooth', 110, t, 0.6, 0.3 * v, o, 440); this.nz(t, 0.6, 0.3 * v, 'bandpass', 400, o, 2, 3000, 0.1); break;
      case 'charge': this.osc('triangle', 300, t, 0.3, 0.2 * v, o, 900); break;
      case 'buff': this.osc('sine', 440, t, 0.3, 0.2 * v, o, 880); this.osc('sine', 660, t + 0.06, 0.3, 0.15 * v, o, 1320); break;
      case 'blink': this.osc('sine', 1600, t, 0.15, 0.2 * v, o, 300); this.nz(t, 0.15, 0.2 * v, 'highpass', 2000, o); break;
      case 'steam': this.nz(t, 1.2, 0.35 * v, 'highpass', 1800, o, 0.7, undefined, 0.05); break;
      case 'slam': this.osc('sine', 50, t, 0.9, 1 * v, o, 20); this.nz(t, 0.7, 0.8 * v, 'lowpass', 600, o); break;
      case 'wall': this.nz(t, 0.3, 0.8 * v, 'lowpass', 1400, o); this.metalRing(t, 120, 0.3 * v, 1); break;
      case 'break': this.metalRing(t, 300, 0.35 * v, 0.6); this.nz(t, 0.2, 0.6 * v, 'bandpass', 1200, o, 1); break;
      case 'alarm': for (let i = 0; i < 3; i++) this.osc('square', 880, t + i * 0.22, 0.12, 0.12 * v, o); break;
      case 'fireburst': this.nz(t, 1, 0.6 * v, 'lowpass', 900, o, 0.8, 300, 0.05); break;
      case 'pickup': this.osc('sine', 660, t, 0.12, 0.25 * v, o); this.osc('sine', 990, t + 0.08, 0.2, 0.25 * v, o); break;
      case 'roar': this.osc('sawtooth', 80, t, 1.2, 0.4 * v, o, 50, 0.1); this.nz(t, 1.2, 0.4 * v, 'lowpass', 500, o, 1, 200, 0.1); break;
      case 'bell': for (const k of [0, 0.35, 0.7]) this.metalRing(t + k, 640, 0.35 * v, 1.2); break;
      case 'click': this.osc('square', 1400, t, 0.03, 0.08 * v, o); break;
      case 'select': this.osc('triangle', 660, t, 0.08, 0.15 * v, o); this.osc('triangle', 990, t + 0.05, 0.1, 0.12 * v, o); break;
      case 'equip': this.nz(t, 0.15, 0.3 * v, 'bandpass', 1500, o, 3); this.metalRing(t, 700, 0.1 * v, 0.4); this.osc('sine', 120, t, 0.2, 0.3 * v, o, 60); break;
      case 'upgrade': [523, 659, 784, 1046].forEach((f, i) => this.osc('triangle', f, t + i * 0.07, 0.25, 0.18 * v, o)); break;
      case 'coins': [1320, 1760].forEach((f, i) => this.osc('square', f, t + i * 0.06, 0.1, 0.07 * v, o)); break;
      case 'error': this.osc('sawtooth', 160, t, 0.2, 0.12 * v, o); break;
      case 'victory': [392, 523, 659, 784, 1046].forEach((f, i) => { this.osc('sawtooth', f, t + i * 0.12, 0.5, 0.12 * v, o); this.osc('triangle', f / 2, t + i * 0.12, 0.6, 0.15 * v, o); }); break;
      case 'defeat': [392, 330, 262, 196].forEach((f, i) => this.osc('sawtooth', f, t + i * 0.25, 0.6, 0.12 * v, o)); break;
    }
  }

  /** Crowd bed level 0..1 and a cheer swell on demand. */
  crowd(on: boolean) {
    if (!this.ctx) return;
    if (on && !this.crowdSrc) {
      const c = this.ctx; const s = c.createBufferSource(); s.buffer = this.noise; s.loop = true;
      this.crowdFilter = c.createBiquadFilter(); this.crowdFilter.type = 'bandpass'; this.crowdFilter.frequency.value = 700; this.crowdFilter.Q.value = 0.6;
      s.connect(this.crowdFilter); this.crowdFilter.connect(this.crowdG); s.start(); this.crowdSrc = s;
    } else if (!on && this.crowdSrc) { this.crowdSrc.stop(); this.crowdSrc = null; this.crowdG.gain.value = 0; }
  }
  cheer(level: number) { this.crowdTarget = Math.min(1, Math.max(this.crowdTarget, level)); }
  tickCrowd(dt: number) {
    if (!this.ctx || !this.crowdSrc) return;
    this.crowdLevel += (this.crowdTarget - this.crowdLevel) * Math.min(1, dt * 4);
    this.crowdTarget = Math.max(0.12, this.crowdTarget - dt * 0.25);
    this.crowdG.gain.value = this.crowdLevel * 0.35 * this.vol.sfx;
    this.crowdFilter.frequency.value = 500 + this.crowdLevel * 900;
  }

  /* ---------- music: a small step sequencer ---------- */
  music(track: 'menu' | 'fight' | null) {
    if (this.track === track) return; this.track = track; this.step = 0;
    if (this.ctx) this.nextNote = this.ctx.currentTime + 0.1;
  }
  private schedule() {
    if (!this.ctx || !this.track) return;
    const fight = this.track === 'fight';
    const bpm = fight ? 128 : 96; const stepDur = 60 / bpm / 4;
    const roots = fight ? [41.2, 41.2, 49, 36.7] : [55, 43.65, 49, 41.2]; // E1.. / A1..
    while (this.nextNote < this.ctx.currentTime + 0.2) {
      const t = this.nextNote, s = this.step % 16, bar = Math.floor(this.step / 16) % 4;
      const root = roots[bar]; const o = this.musicG;
      if (fight) {
        if (s % 4 === 0) { this.osc('sine', 120, t, 0.18, 0.9, o, 40); }
        if (s === 4 || s === 12) this.nz(t, 0.14, 0.5, 'bandpass', 1800, o, 0.8);
        if (s % 2 === 1) this.nz(t, 0.04, 0.18, 'highpass', 7000, o);
        if ([0, 3, 6, 8, 10, 11, 14].includes(s)) this.osc('sawtooth', root * 2, t, stepDur * 0.9, 0.22, o, root * 2 * 0.99);
        if (s % 4 === 2) this.osc('square', root * 8 * [1, 1.189, 1.5, 1.335][(s / 4 | 0) % 4], t, stepDur * 0.7, 0.05, o);
      } else {
        if (s === 0 || s === 10) this.osc('sine', 100, t, 0.25, 0.6, o, 45);
        if (s === 8) this.nz(t, 0.2, 0.25, 'bandpass', 1400, o, 0.7);
        if (s % 2 === 0) this.nz(t, 0.03, 0.07, 'highpass', 8000, o);
        if (s === 0 || s === 7) this.osc('triangle', root * 2, t, stepDur * 5, 0.25, o);
        if (s % 3 === 0) this.osc('sine', root * 8 * [1, 1.189, 1.498, 1.782][s % 4], t, stepDur * 2, 0.05, o);
      }
      this.nextNote += stepDur; this.step++;
    }
  }
}
export const audio = new Audio();
