import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { RobotModel, JointName } from '../render/robotModel';
import { JOINTS } from '../render/robotModel';
import type { Anim } from '../data/moves';

type V = [number, number, number];
export interface Pose { j: Partial<Record<JointName, V>>; py?: number; rootX?: number }

const mirrorJ = (n: JointName): JointName => (n.endsWith('L') ? (n.slice(0, -1) + 'R') : n.endsWith('R') ? (n.slice(0, -1) + 'L') : n) as JointName;
export function mirror(p: Pose): Pose {
  const j: Partial<Record<JointName, V>> = {};
  for (const k in p.j) { const v = p.j[k as JointName]!; j[mirrorJ(k as JointName)] = [v[0], -v[1], -v[2]]; }
  return { j, py: p.py, rootX: p.rootX };
}

// Guard stance: orthodox, fists up by the chin.
export const GUARD: Pose = {
  j: {
    pelvis: [0, 0.18, 0], torso: [0.1, -0.16, 0], neck: [-0.06, -0.02, 0],
    shL: [-0.55, 0.32, -0.22], elL: [-2.05, 0, 0], wrL: [0.15, 0, 0],
    shR: [-0.5, -0.3, 0.22], elR: [-2.15, 0, 0], wrR: [0.15, 0, 0],
    hipL: [-0.32, 0, -0.06], knL: [0.5, 0, 0], anL: [-0.18, 0, 0],
    hipR: [0.12, 0, 0.06], knR: [0.4, 0, 0], anR: [-0.52, 0, 0],
  }, py: -0.07,
};
export const BLOCK: Pose = {
  j: { torso: [0.22, -0.05, 0], neck: [0.2, 0, 0], shL: [-1.0, 0.5, -0.1], elL: [-2.45, 0, 0], shR: [-1.0, -0.5, 0.1], elR: [-2.45, 0, 0], wrL: [0.3, 0, 0], wrR: [0.3, 0, 0] }, py: -0.12,
};

const P = (j: Pose['j'], py?: number, rootX?: number): Pose => ({ j, py, rootX });
// [windup, strike]
const ACTIONS: Record<Anim, [Pose, Pose]> = {
  jab: [P({ shL: [-0.75, 0.25, -0.15], elL: [-1.9, 0, 0], torso: [0.12, -0.05, 0] }), P({ shL: [-1.58, 0.14, -0.04], elL: [-0.12, 0, 0], wrL: [0, 0, 0], torso: [0.14, 0.32, 0], pelvis: [0, 0.3, 0] })],
  cross: [P({ shR: [-0.6, -0.2, 0.2], elR: [-2.1, 0, 0], torso: [0.1, 0.08, 0] }), P({ shR: [-1.58, -0.14, 0.04], elR: [-0.1, 0, 0], wrR: [0, 0, 0], torso: [0.18, -0.55, 0], pelvis: [0, -0.1, 0], hipR: [0.3, 0, 0.06], anR: [-0.7, 0, 0] })],
  hookL: [P({ shL: [-1.4, -0.55, 0], elL: [0, 0, 1.45], torso: [0.1, -0.4, 0] }), P({ shL: [-1.52, 0.6, 0], elL: [0, 0, 1.5], torso: [0.12, 0.5, 0], pelvis: [0, 0.4, 0] })],
  hookR: [P({ shR: [-1.4, 0.55, 0], elR: [0, 0, -1.45], torso: [0.1, 0.35, 0] }), P({ shR: [-1.52, -0.6, 0], elR: [0, 0, -1.5], torso: [0.12, -0.6, 0], pelvis: [0, -0.15, 0] })],
  upperR: [P({ shR: [-0.15, -0.1, 0.15], elR: [-1.75, 0, 0], torso: [0.32, -0.2, 0.1], neck: [0, 0, 0] }, -0.17), P({ shR: [-1.3, -0.12, 0.05], elR: [-1.75, 0, 0], torso: [-0.18, -0.45, 0], neck: [-0.2, 0, 0] }, -0.02)],
  upperL: [P({ shL: [-0.15, 0.1, -0.15], elL: [-1.75, 0, 0], torso: [0.32, 0.2, -0.1] }, -0.17), P({ shL: [-1.3, 0.12, -0.05], elL: [-1.75, 0, 0], torso: [-0.18, 0.45, 0] }, -0.02)],
  heavyR: [P({ shR: [-0.35, 0.4, 0.35], elR: [-2.25, 0, 0], torso: [0.0, 0.55, 0], pelvis: [0, 0.35, 0], shL: [-1.1, 0.2, -0.2], elL: [-1.6, 0, 0] }, -0.1), P({ shR: [-1.62, -0.22, 0.02], elR: [-0.05, 0, 0], torso: [0.28, -0.7, 0], pelvis: [0, -0.3, 0], hipR: [0.4, 0, 0.06], knL: [0.75, 0, 0], anR: [-0.8, 0, 0] }, -0.14)],
  kickL: [P({ hipL: [-0.75, 0, 0], knL: [1.5, 0, 0], anL: [0.2, 0, 0], torso: [-0.1, 0, 0] }), P({ hipL: [-1.35, 0.1, 0], knL: [0.15, 0, 0], anL: [0.3, 0, 0], torso: [-0.3, 0.1, 0], hipR: [0.1, 0, 0], knR: [0.5, 0, 0] })],
  slam: [P({ shL: [-2.9, 0, -0.2], elL: [-0.5, 0, 0], shR: [-2.9, 0, 0.2], elR: [-0.5, 0, 0], torso: [-0.28, 0, 0], neck: [-0.3, 0, 0] }, 0.02), P({ shL: [-0.9, 0.2, -0.1], elL: [-0.2, 0, 0], shR: [-0.9, -0.2, 0.1], elR: [-0.2, 0, 0], torso: [0.7, 0, 0], knL: [1.1, 0, 0], knR: [1.0, 0, 0], hipL: [-0.9, 0, 0], hipR: [-0.5, 0, 0] }, -0.38)],
  shootR: [P({ shR: [-1.0, -0.1, 0.2], elR: [-1.3, 0, 0], torso: [0.05, 0.2, 0] }), P({ shR: [-1.6, -0.1, 0], elR: [0, 0, 0], torso: [0.05, -0.35, 0] })],
  shootB: [P({ shL: [-1.0, 0.3, -0.2], elL: [-1.4, 0, 0], shR: [-1.0, -0.3, 0.2], elR: [-1.4, 0, 0], torso: [-0.1, 0, 0] }), P({ shL: [-1.57, 0.2, 0], elL: [0, 0, 0], shR: [-1.57, -0.2, 0], elR: [0, 0, 0], torso: [0.1, 0, 0] })],
  lunge: [P({ shR: [-0.6, -0.2, 0.2], elR: [-2.1, 0, 0], torso: [0.45, 0.1, 0] }, -0.16), P({ shR: [-1.6, -0.1, 0.04], elR: [-0.1, 0, 0], torso: [0.35, -0.55, 0], hipR: [0.4, 0, 0], knL: [0.8, 0, 0] }, -0.15)],
  taunt: [P({ shL: [-2.4, 0, -0.6], elL: [-0.8, 0, 0], shR: [-2.4, 0, 0.6], elR: [-0.8, 0, 0], torso: [-0.15, 0, 0], neck: [-0.2, 0, 0] }), P({ shL: [-2.8, 0, -0.5], elL: [-1.2, 0, 0], shR: [-2.8, 0, 0.5], elR: [-1.2, 0, 0], torso: [-0.25, 0, 0], neck: [-0.35, 0, 0] })],
  vent: [P({ shL: [0, 0, -0.9], elL: [-0.4, 0, 0], shR: [0, 0, 0.9], elR: [-0.4, 0, 0], torso: [-0.1, 0, 0] }), P({ shL: [-0.2, 0, -1.3], elL: [-0.2, 0, 0], shR: [-0.2, 0, 1.3], elR: [-0.2, 0, 0], torso: [-0.2, 0, 0], neck: [-0.3, 0, 0] })],
  buff: [P({ shL: [-1.0, 0.7, 0], elL: [-1.7, 0, 0], shR: [-1.0, -0.7, 0], elR: [-1.7, 0, 0], torso: [0.2, 0, 0] }, -0.14), P({ shL: [-0.3, 0, -0.7], elL: [-1.2, 0, 0], shR: [-0.3, 0, 0.7], elR: [-1.2, 0, 0], torso: [-0.2, 0, 0], neck: [-0.15, 0, 0] })],
  spin: [P({ torso: [0, 1.2, 0] }), P({ torso: [0, -1.2, 0], shR: [-1.5, 0.4, 0.4], elR: [-0.2, 0, 0] })],
  finisher: [P({ shR: [0.1, 0.2, 0.3], elR: [-1.9, 0, 0], torso: [0.55, 0.3, 0], knL: [1.2, 0, 0], knR: [1.1, 0, 0], hipL: [-0.9, 0, 0], hipR: [-0.6, 0, 0] }, -0.38), P({ shR: [-2.7, -0.1, 0.05], elR: [-0.6, 0, 0], torso: [-0.35, -0.5, 0], neck: [-0.3, 0, 0], hipL: [-0.2, 0, 0], knL: [0.2, 0, 0] }, 0.12)],
  leap: [P({ knL: [1.4, 0, 0], knR: [1.4, 0, 0], hipL: [-1.0, 0, 0], hipR: [-1.0, 0, 0], torso: [0.5, 0, 0], shL: [-2.6, 0, -0.3], shR: [-2.6, 0, 0.3] }, -0.42), P({ shL: [-0.7, 0, -0.2], elL: [-0.2, 0, 0], shR: [-0.7, 0, 0.2], elR: [-0.2, 0, 0], torso: [0.8, 0, 0], knL: [1.3, 0, 0], knR: [1.3, 0, 0], hipL: [-1.1, 0, 0], hipR: [-1.1, 0, 0] }, -0.45)],
};
const VICTORY: Pose = P({ shL: [-2.9, 0, -0.35], elL: [-0.3, 0, 0], shR: [-2.9, 0, 0.35], elR: [-0.3, 0, 0], torso: [-0.18, 0, 0], neck: [-0.35, 0, 0], hipL: [-0.05, 0, 0], knL: [0.1, 0, 0], hipR: [0.05, 0, 0], knR: [0.1, 0, 0], anL: [0, 0, 0], anR: [0, 0, 0], pelvis: [0, 0, 0] }, 0);
const DOWN: Pose = P({ shL: [-0.4, 0, -1.3], elL: [-0.5, 0, 0], shR: [-0.2, 0, 1.1], elR: [-0.9, 0, 0], torso: [-0.1, 0.1, 0.1], neck: [-0.4, 0.5, 0], hipL: [-0.3, 0, -0.2], knL: [0.6, 0, 0], hipR: [-0.1, 0, 0.15], knR: [0.2, 0, 0], anL: [0, 0, 0], anR: [0, 0, 0], pelvis: [0, 0, 0] }, 0.0, -1.48);
const STAGGER: Pose = P({ torso: [-0.3, 0.2, 0.15], neck: [-0.4, 0.3, 0], shL: [-0.3, 0.1, -0.5], elL: [-0.7, 0, 0], shR: [-0.25, -0.1, 0.5], elR: [-0.6, 0, 0], knL: [0.7, 0, 0], knR: [0.55, 0, 0] }, -0.12);
const STUN: Pose = P({ torso: [0.35, 0, 0.2], neck: [0.5, 0, 0.3], shL: [-0.1, 0, -0.3], elL: [-0.4, 0, 0], shR: [-0.1, 0, 0.3], elR: [-0.4, 0, 0], knL: [0.8, 0, 0], knR: [0.8, 0, 0] }, -0.16);

export type Phase = 'windup' | 'strike' | 'recover';

export class Animator {
  cur = {} as Record<JointName, Vector3>;
  private react = {} as Record<JointName, Vector3>;
  private py = 0; private rootX = 0; private reactPy = 0;
  walkPh = 0;
  constructor(public model: RobotModel) {
    for (const j of JOINTS) { this.cur[j] = new Vector3(); this.react[j] = new Vector3(); }
    this.snap(GUARD);
  }
  snap(p: Pose) { for (const j of JOINTS) { const v = p.j[j]; this.cur[j].set(v?.[0] || 0, v?.[1] || 0, v?.[2] || 0); } this.py = p.py || 0; this.rootX = p.rootX || 0; this.apply(); }

  /** Adds a decaying hit reaction offset. */
  hit(zone: 'head' | 'torso' | 'legs' | 'arms', side: number, strength: number) {
    const s = Math.min(1.6, strength);
    const add = (j: JointName, x: number, y: number, z: number) => this.react[j].addInPlaceFromFloats(x * s, y * s, z * s);
    if (zone === 'head') { add('neck', -0.6, side * 0.5, side * 0.3); add('torso', -0.35, side * 0.2, side * 0.2); }
    else if (zone === 'torso') { add('torso', 0.5, side * 0.15, 0); add('neck', 0.25, 0, 0); this.reactPy -= 0.06 * s; }
    else if (zone === 'legs') { add('knL', 0.5, 0, 0); add('knR', 0.3, 0, 0); this.reactPy -= 0.1 * s; add('torso', 0.1, 0, side * 0.25); }
    else { add('shL', 0.35, 0, -0.1); add('shR', 0.35, 0, 0.1); add('torso', -0.12, 0, 0); }
  }

  update(dt: number, o: {
    state: string; action?: Anim; phase?: Phase; phaseT?: number; charge?: number; blocking: boolean;
    moveFwd: number; moveSide: number; speed: number; mirrorAct?: boolean; t: number; downT?: number;
  }) {
    // Base pose
    let base: Pose = GUARD;
    const target = {} as Record<JointName, [number, number, number]>;
    for (const j of JOINTS) { const v = base.j[j]; target[j] = [v?.[0] || 0, v?.[1] || 0, v?.[2] || 0]; }
    let tpy = base.py || 0, trx = 0;
    const blend = (p: Pose, w: number) => {
      for (const k in p.j) { const v = p.j[k as JointName]!; const t = target[k as JointName]; t[0] += (v[0] - t[0]) * w; t[1] += (v[1] - t[1]) * w; t[2] += (v[2] - t[2]) * w; }
      if (p.py !== undefined) tpy += (p.py - tpy) * w;
      if (p.rootX !== undefined) trx += (p.rootX - trx) * w;
    };
    // breathing
    target.torso[0] += Math.sin(o.t * 2.2) * 0.025; target.shL[0] += Math.sin(o.t * 2.2) * 0.03; target.shR[0] += Math.sin(o.t * 2.2 + 0.4) * 0.03;
    // locomotion
    const sp = Math.min(1.4, o.speed);
    if (sp > 0.05 && ['idle', 'move', 'block', 'attack'].includes(o.state)) {
      this.walkPh += dt * (5 + sp * 5);
      const s1 = Math.sin(this.walkPh), c1 = Math.cos(this.walkPh);
      const fw = o.moveFwd, sd = o.moveSide;
      target.hipL[0] += -s1 * 0.5 * fw * sp; target.hipR[0] += s1 * 0.5 * fw * sp;
      target.hipL[2] += s1 * 0.22 * sd * sp; target.hipR[2] += s1 * 0.22 * sd * sp;
      target.knL[0] += Math.max(0, c1) * 0.6 * sp; target.knR[0] += Math.max(0, -c1) * 0.6 * sp;
      tpy -= Math.abs(s1) * 0.04 * sp;
      target.torso[2] += -s1 * 0.04 * sp;
    }
    if (o.blocking) blend(BLOCK, 1);
    if (o.state === 'attack' && o.action) {
      let [wp, sp2] = ACTIONS[o.action];
      if (o.mirrorAct) { wp = mirror(wp); sp2 = mirror(sp2); }
      if (o.phase === 'windup') { blend(wp, Math.min(1, (o.phaseT || 0) * 3 + 0.4)); if (o.charge) { target.torso[2] += Math.sin(o.t * 60) * 0.01 * o.charge; } }
      else if (o.phase === 'strike') blend(sp2, 1);
      else { const w = 1 - Math.min(1, o.phaseT || 0); blend(sp2, w * w); }
    }
    if (o.state === 'stagger') blend(STAGGER, 1);
    if (o.state === 'stun' || o.state === 'overheat') { blend(STUN, 1); target.neck[1] += Math.sin(o.t * 6) * 0.2; }
    if (o.state === 'down' || o.state === 'ko') blend(DOWN, 1);
    if (o.state === 'getup') { blend(DOWN, Math.max(0, 1 - (o.downT || 0) * 1.3)); }
    if (o.state === 'victory') { blend(VICTORY, 1); target.shL[1] += Math.sin(o.t * 3) * 0.15; target.shR[1] -= Math.sin(o.t * 3) * 0.15; }
    if (o.state === 'dodge') { target.torso[0] += 0.3; tpy -= 0.1; }
    // Ankles keep feet flat on the ground
    if (!['down', 'ko'].includes(o.state)) {
      target.anL[0] = -(target.hipL[0] + target.knL[0]) * 0.9 + (o.state === 'attack' && o.action === 'kickL' ? 0.4 : 0);
      target.anR[0] = -(target.hipR[0] + target.knR[0]) * 0.9;
    }
    // Smooth toward target
    const fast = o.state === 'attack' && o.phase === 'strike';
    const rate = fast ? 34 : o.state === 'down' ? 7 : o.state === 'dodge' ? 20 : 13;
    const k = 1 - Math.exp(-rate * dt);
    const rk = Math.exp(-7 * dt);
    for (const j of JOINTS) {
      const t = target[j], c = this.cur[j], r = this.react[j];
      c.x += (t[0] - c.x) * k; c.y += (t[1] - c.y) * k; c.z += (t[2] - c.z) * k;
      r.scaleInPlace(rk);
    }
    this.py += (tpy - this.py) * k; this.reactPy *= rk;
    this.rootX += (trx - this.rootX) * (1 - Math.exp(-(o.state === 'down' || o.state === 'ko' ? 5 : 6) * dt));
    this.apply();
  }

  private apply() {
    const m = this.model;
    for (const j of JOINTS) { const c = this.cur[j], r = this.react[j]; m.j[j].rotation.set(c.x + r.x, c.y + r.y, c.z + r.z); }
    m.j.pelvis.position.y = m.pelvisBaseY + this.py + this.reactPy;
    m.root.rotation.x = this.rootX;
    m.root.position.y = this.rootX < -0.3 ? Math.min(0.32, -this.rootX * 0.2) : 0;
  }
}
