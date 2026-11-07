// Tiny synthesized sound cues (no audio files yet).
let ctx = null;
const TONES = {
  hit: [[320, 0.05, 'square', 0.05]],
  hurt: [[140, 0.12, 'sawtooth', 0.08]],
  warn: [[880, 0.06, 'triangle', 0.06], [660, 0.06, 'triangle', 0.06]],
  loot: [[660, 0.06, 'sine', 0.08], [990, 0.08, 'sine', 0.08]],
  quest: [[523, 0.1, 'triangle', 0.08], [659, 0.1, 'triangle', 0.08], [784, 0.16, 'triangle', 0.08]],
  level: [[523, 0.1, 'sine', 0.1], [659, 0.1, 'sine', 0.1], [784, 0.1, 'sine', 0.1], [1046, 0.3, 'sine', 0.1]],
  portal: [[200, 0.4, 'sine', 0.1], [300, 0.4, 'sine', 0.08]],
  die: [[300, 0.2, 'sawtooth', 0.08], [180, 0.4, 'sawtooth', 0.08]],
};

export function sfx(name) {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    let t = ctx.currentTime;
    for (const [freq, dur, type, vol] of TONES[name] || []) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + dur);
      t += dur * 0.8;
    }
  } catch { /* audio is optional */ }
}
