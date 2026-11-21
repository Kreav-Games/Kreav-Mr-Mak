import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { ClassId, FighterStats, InputFrame, Zone } from '../core/types';
import type { RobotModel } from '../render/robotModel';
import { Animator, type Phase } from './animator';
import { MOVES, LIGHT_CHAIN, WEAPON_MOVE, type MoveDef } from '../data/moves';
import { CLASSES } from '../data/classes';
import type { ChallengeMods } from '../data/opponents';

export type FState = 'idle' | 'attack' | 'block' | 'dodge' | 'stagger' | 'stun' | 'down' | 'getup' | 'ko' | 'overheat' | 'victory';

export interface CombatEnv {
  time: number; mods: ChallengeMods;
  sparks(pos: Vector3, power: number, color?: string): void;
  burst(kind: 'debris' | 'smoke' | 'steam' | 'dust' | 'shock' | 'fire' | 'ring', pos: Vector3, power?: number): void;
  sfx(name: string, vol?: number): void;
  shake(a: number): void; hitstop(t: number): void; slowmo(t: number, scale: number): void;
  popup(text: string, pos: Vector3, color: string, big?: boolean): void;
  announce(text: string, sub?: string, color?: string): void;
  projectile(owner: Fighter, move: MoveDef, mult: number): void;
  clamp(f: Fighter): boolean; // returns true if fighter hit the wall this frame
  crowd(level: number): void;
  onKO(loser: Fighter, method: 'KO' | 'TKO' | 'Finisher'): void;
}

export interface FightTally {
  dmgDealt: number; dmgTaken: number; hits: number; attempts: number; headHits: number; counters: number;
  perfectBlocks: number; perfectDodges: number; bestCombo: number; knockdownsDealt: number; knockdownsTaken: number; specials: number;
  zoneTaken: Record<Zone, number>;
}

export class Fighter {
  pos = new Vector3(); yaw = 0; kb = new Vector3(); walkVel = new Vector3();
  hp: number; zone: Record<Zone, number>; zoneMax: Record<Zone, number>;
  stamina: number; heat = 0; special = 0; poise: number;
  state: FState = 'idle'; stateT = 0;
  move: MoveDef | null = null; moveT = 0; phase: Phase = 'windup'; charge = 0; hitDone = false; moveMult = 1; mirrorAct = false;
  seq: string[] = []; seqSpeed = 1; seqRoot: MoveDef | null = null;
  chain = 0; chainT = 0; buffered: { kind: string; t: number } | null = null;
  blockT = 0; dodgeDir = new Vector3(); counterWindow = 0;
  buffs = { ironwill: 0, phase: 0, counter: 0, fortress: 0, shield: 0, shieldHp: 0, bleed: 0, burn: 0, armor: 0 };
  cd: Record<string, number> = {};
  kd = 0; combo = 0; comboT = 0; lastHitT = 99; downT = 0; mashBoost = 0;
  bossPhase = 0; blocksMade = 0; heavyHits = 0; dodges = 0;
  tally: FightTally;
  opp!: Fighter;
  anim: Animator;
  speedScale = 1;
  moveFwd = 0; moveSide = 0; t = 0;

  constructor(public name: string, public cls: ClassId, public stats: FighterStats, public model: RobotModel, public env: CombatEnv, public isPlayer: boolean, public weaponStyle?: string, hpScale = 1) {
    this.hp = stats.maxHp * hpScale;
    this.zoneMax = { head: stats.maxHp * 0.3, torso: stats.maxHp * 0.5, arms: stats.maxHp * 0.36, legs: stats.maxHp * 0.36 };
    this.zone = { ...this.zoneMax };
    this.stamina = stats.staminaMax; this.poise = stats.poiseMax;
    this.anim = new Animator(model);
    this.tally = { dmgDealt: 0, dmgTaken: 0, hits: 0, attempts: 0, headHits: 0, counters: 0, perfectBlocks: 0, perfectDodges: 0, bestCombo: 0, knockdownsDealt: 0, knockdownsTaken: 0, specials: 0, zoneTaken: { head: 0, torso: 0, arms: 0, legs: 0 } };
  }

  get alive() { return this.state !== 'ko'; }
  get canAct() { return this.state === 'idle' || this.state === 'block'; }
  get forward() { return new Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw)); }
  get right() { return new Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw)); }
  get vulnerable() { return this.state === 'stagger' || this.state === 'stun' || this.state === 'overheat'; }
  get finisherReady() { return this.opp && this.opp.hp > 0 && this.opp.hp <= this.opp.stats.maxHp * 0.15 && (this.opp.state === 'stagger' || this.opp.state === 'stun' || this.opp.state === 'overheat'); }
  zoneCrit(z: Zone) { return this.zone[z] <= 0; }
  distTo(o: Fighter) { return Math.hypot(o.pos.x - this.pos.x, o.pos.z - this.pos.z); }
  abilityIds(): [string, string, string | null, string] {
    const c = CLASSES[this.cls];
    return [c.abilityA, c.abilityB, this.weaponStyle ? WEAPON_MOVE[this.weaponStyle] : null, 'purge'];
  }
  abilityReady(i: number) {
    const id = this.abilityIds()[i]; if (!id) return false;
    if (i === 1 && !this.stats.abilityB) return false;
    return (this.cd[id] || 0) <= 0;
  }

  setState(s: FState) { this.state = s; this.stateT = 0; }

  /* ---------------- starting moves ---------------- */
  startMove(id: string, mult = 1, fromSeq = false): boolean {
    const m = MOVES[id]; if (!m) return false;
    if (!fromSeq) {
      if (m.stam > 0 && this.stamina < m.stam * 0.5) { if (this.isPlayer) this.env.popup('LOW STAMINA', this.headPos(), '#FFD84A'); return false; }
      if (m.cd) { if ((this.cd[id] || 0) > 0) return false; this.cd[id] = m.cd * this.stats.cdMult; }
      this.stamina = Math.max(0, this.stamina - m.stam);
      this.heat += m.heat * 1.5 * this.stats.heatGen * (this.env.mods.heat || 1);
    }
    if (m.seq && !fromSeq) {
      this.seq = m.seq.slice(); this.seqSpeed = m.seqSpeed || 1.4; this.seqRoot = m;
      if (m.kind === 'special') { this.tally.specials++; this.env.announce(m.name.toUpperCase(), undefined, '#4FD8FF'); this.env.sfx('special'); this.env.crowd(0.8); }
      if (m.effect === 'blink') this.blinkTo(1.7);
      return this.startMove(this.seq.shift()!, (m.kind === 'special' ? 1.35 * this.stats.specialMult : 0.8), true);
    }
    this.move = m; this.moveT = 0; this.phase = 'windup'; this.charge = 0; this.hitDone = false; this.moveMult = mult;
    this.mirrorAct = false;
    if (!fromSeq) { this.seq = []; this.seqRoot = null; }
    if (m.kind === 'special' && !fromSeq) { this.tally.specials++; this.env.announce(m.name.toUpperCase(), undefined, '#4FD8FF'); this.env.sfx('special'); this.env.crowd(0.8); this.moveMult = this.stats.specialMult; }
    if (m.kind === 'finisher') { this.env.announce('FINISH HIM', undefined, '#FF3A3A'); this.env.slowmo(1.1, 0.35); this.env.sfx('special'); }
    if (m.anim !== 'buff' && m.anim !== 'vent' && m.anim !== 'taunt') this.env.sfx('whoosh', 0.5);
    this.setState('attack');
    this.tally.attempts += m.dmg > 0 ? 1 : 0;
    return true;
  }
  private blinkTo(d: number) {
    const o = this.opp; const dir = this.pos.subtract(o.pos); dir.y = 0; const l = dir.length() || 1; dir.scaleInPlace(1 / l);
    this.env.burst('shock', this.pos.add(new Vector3(0, 1.4, 0)), 0.6);
    this.pos.copyFrom(o.pos.add(dir.scale(d)));
    this.env.burst('shock', this.pos.add(new Vector3(0, 1.4, 0)), 0.6);
    this.env.sfx('blink');
  }
  private teleportBeside() {
    const o = this.opp; const side = Math.random() < 0.5 ? -1 : 1;
    const r = o.right.scale(side * 1.5).add(o.forward.scale(0.6));
    this.env.burst('shock', this.pos.add(new Vector3(0, 1.4, 0)), 0.8);
    this.pos.copyFrom(o.pos.add(r)); this.env.clamp(this);
    this.env.burst('shock', this.pos.add(new Vector3(0, 1.4, 0)), 0.8); this.env.sfx('blink');
  }

  tryLight() {
    if (this.chainT <= 0) this.chain = 0;
    const id = LIGHT_CHAIN[this.chain % LIGHT_CHAIN.length];
    if (this.counterWindow > 0) { this.counterWindow = 0; return this.startMove('counterPunch', 1); }
    if (this.startMove(id)) { this.chain++; this.chainT = 0.9; return true; }
    return false;
  }
  tryHeavy(mx: number, mz: number) {
    let id = 'heavy';
    if (mz > 0.5) id = 'upperH'; else if (mz < -0.5) id = 'kick'; else if (Math.abs(mx) > 0.5) id = mx > 0 ? 'hookH' : 'hookHL';
    if (this.counterWindow > 0) this.counterWindow = Math.max(this.counterWindow, 0.25);
    return this.startMove(id);
  }
  trySpecial() {
    if (this.finisherReady) { this.special = Math.max(0, this.special - 20); return this.startMove('finisher'); }
    if (this.special < 100) { if (this.isPlayer) this.env.popup('SPECIAL NOT READY', this.headPos(), '#8FB8FF'); return false; }
    this.special = 0;
    return this.startMove(CLASSES[this.cls].special);
  }
  tryAbility(i: number) {
    const id = this.abilityIds()[i]; if (!id) return false;
    if (i === 1 && !this.stats.abilityB) { if (this.isPlayer) this.env.popup('LOCKED — SKILL TREE', this.headPos(), '#AAB'); return false; }
    if ((this.cd[id] || 0) > 0) return false;
    return this.startMove(id);
  }
  tryDodge(mx: number, mz: number) {
    const cost = 18 * this.stats.dodgeCost;
    if (this.stamina < cost) { if (this.isPlayer) this.env.popup('LOW STAMINA', this.headPos(), '#FFD84A'); return false; }
    this.stamina -= cost;
    let dir = this.forward.scale(mz).add(this.right.scale(mx));
    if (dir.lengthSquared() < 0.1) dir = this.forward.scale(-1);
    dir.normalize(); this.dodgeDir.copyFrom(dir);
    this.setState('dodge'); this.dodges++; this.env.sfx('dodge', 0.6);
    this.env.burst('dust', this.pos.clone(), 0.5);
    return true;
  }

  headPos() { return this.pos.add(new Vector3(0, 2.6, 0)); }
  chestPos() { return this.pos.add(new Vector3(0, 1.65, 0)); }

  /* ---------------- main update ---------------- */
  update(dt: number, inp: InputFrame) {
    this.t += dt; this.stateT += dt; this.lastHitT += dt;
    const st = this.stats;
    // resources
    const busy = this.state === 'attack' || this.state === 'block';
    this.stamina = Math.min(st.staminaMax, this.stamina + st.staminaRegen * dt * (busy ? 0.35 : 1) * (this.zoneCrit('torso') ? 0.75 : 1));
    const diss = st.heatDiss * (this.zoneCrit('torso') ? 0.6 : 1) * (this.state === 'overheat' ? 3 : 1);
    this.heat = Math.max(0, this.heat - diss * dt);
    for (const k in this.cd) this.cd[k] = Math.max(0, this.cd[k] - dt);
    for (const k of ['ironwill', 'phase', 'counter', 'fortress', 'shield', 'bleed', 'burn', 'armor'] as const) if (k !== 'shieldHp' as any) this.buffs[k] = Math.max(0, this.buffs[k] - dt);
    if (this.buffs.shield <= 0 && this.buffs.fortress <= 0) this.buffs.shieldHp = 0;
    if (this.buffs.bleed > 0 && this.hp > 1) { const d = this.stats.maxHp * 0.012 * dt; this.hp = Math.max(1, this.hp - d); this.tally.dmgTaken += d; this.opp.tally.dmgDealt += d; }
    if (this.buffs.burn > 0) this.heat += 14 * dt;
    if (this.lastHitT > 1.4) this.poise = Math.min(st.poiseMax * (this.zoneCrit('head') ? 0.65 : 1), this.poise + 40 * dt);
    this.counterWindow = Math.max(0, this.counterWindow - dt);
    this.chainT -= dt; this.comboT -= dt; if (this.comboT <= 0) this.combo = 0;
    if (this.buffered) { this.buffered.t -= dt; if (this.buffered.t <= 0) this.buffered = null; }
    // overheat
    if (this.heat >= 100 && this.alive && !['down', 'getup', 'overheat', 'victory', 'ko'].includes(this.state)) {
      this.heat = 100; this.move = null; this.setState('overheat'); this.env.announce(this.isPlayer ? 'OVERHEATED' : '', undefined, '#FF6A2A');
      this.env.popup('OVERHEAT', this.headPos(), '#FF7A2A', true); this.env.sfx('steam'); this.env.burst('steam', this.chestPos(), 1);
    }
    // buffered presses
    if (inp.light) this.buffered = { kind: 'light', t: 0.28 };
    if (inp.heavy) this.buffered = { kind: 'heavy', t: 0.28 };
    // facing
    const o = this.opp;
    const want = Math.atan2(o.pos.x - this.pos.x, o.pos.z - this.pos.z);
    let d = want - this.yaw; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
    const turn = (this.state === 'attack' ? 5 : ['down', 'ko', 'getup', 'victory'].includes(this.state) ? 0 : 12) * dt;
    this.yaw += Math.max(-turn, Math.min(turn, d));
    this.moveFwd = 0; this.moveSide = 0;
    let walkSpeed = 0;
    const mv = 2.7 * st.moveMult * (this.zoneCrit('legs') ? 0.68 : 1) * (this.env.mods.speed || 1) * (this.buffs.phase > 0 ? 1.5 : 1);

    switch (this.state) {
      case 'idle': case 'block': {
        const blocking = inp.block && !this.env.mods.noBlock;
        if (blocking && this.state !== 'block') { this.setState('block'); this.blockT = 0; this.env.sfx('guard', 0.35); }
        if (!blocking && this.state === 'block') this.setState('idle');
        if (this.state === 'block') this.blockT += dt;
        if (inp.dodge) { this.tryDodge(inp.mx, inp.mz); break; }
        if (inp.special) { if (this.trySpecial()) break; }
        if (inp.ab1 && this.tryAbility(0)) break;
        if (inp.ab2 && this.tryAbility(1)) break;
        if (inp.ab3 && this.tryAbility(2)) break;
        if (inp.ab4 && this.tryAbility(3)) break;
        if (inp.taunt && this.state === 'idle') { this.startMove('taunt'); break; }
        if (this.buffered && this.state === 'idle' || (this.buffered && this.state === 'block')) {
          const b = this.buffered!; this.buffered = null;
          if (b.kind === 'light' ? this.tryLight() : this.tryHeavy(inp.mx, inp.mz)) break;
        }
        const f = this.forward, r = this.right;
        const dir = f.scale(inp.mz).add(r.scale(inp.mx));
        const len = Math.min(1, dir.length());
        if (len > 0.05) {
          dir.normalize();
          walkSpeed = mv * len * (this.state === 'block' ? 0.45 : 1) * (inp.mz < -0.3 ? 0.85 : 1);
          this.walkVel.copyFrom(dir.scale(walkSpeed));
          this.moveFwd = inp.mz; this.moveSide = inp.mx;
        } else this.walkVel.setAll(0);
        break;
      }
      case 'attack': this.updateAttack(dt, inp); break;
      case 'dodge': {
        const k = this.stateT / 0.38;
        const sp = 9.5 * (1 - k) * (this.env.mods.speed || 1);
        this.walkVel.copyFrom(this.dodgeDir.scale(sp));
        if (this.stateT >= 0.38) { this.walkVel.setAll(0); this.setState('idle'); }
        break;
      }
      case 'stagger': this.walkVel.setAll(0); if (this.stateT > ((this as any)._stagT || 0.85)) this.setState('idle'); break;
      case 'stun': this.walkVel.setAll(0); if (this.stateT > (this as any)._stunT) this.setState('idle'); if (Math.random() < 0.15) this.env.sparks(this.headPos(), 0.3, '#7FE8FF'); break;
      case 'overheat': this.walkVel.setAll(0); if (Math.random() < 0.3) this.env.burst('steam', this.chestPos(), 0.4); if (this.stateT > 2.2 && this.heat < 70) this.setState('idle'); break;
      case 'down': {
        this.walkVel.setAll(0);
        if (inp.mash) this.mashBoost += 0.14;
        const need = (this.isPlayer ? 2.6 : 1.8 + Math.random() * 0.02) - this.mashBoost;
        if (this.stateT > Math.max(1.1, need) && this.hp > 0) { this.setState('getup'); this.downT = 0; this.env.sfx('hydraulic'); }
        break;
      }
      case 'getup': this.downT += dt; this.walkVel.setAll(0); if (this.stateT > 0.95) { this.setState('idle'); this.poise = st.poiseMax; } break;
      case 'ko': case 'victory': this.walkVel.setAll(0); break;
    }
    // integrate
    this.pos.addInPlace(this.walkVel.scale(dt)).addInPlace(this.kb.scale(dt));
    const kbSpeed = this.kb.length();
    this.kb.scaleInPlace(Math.exp(-5.5 * dt));
    // separation
    const dx = this.pos.x - o.pos.x, dz = this.pos.z - o.pos.z; const dist = Math.hypot(dx, dz);
    const minD = 1.35;
    if (dist < minD && dist > 0.001 && o.state !== 'down' && o.state !== 'ko' && this.state !== 'down') { const push = (minD - dist) / 2; this.pos.x += dx / dist * push; this.pos.z += dz / dist * push; }
    if (this.env.clamp(this) && kbSpeed > 2.6 && this.alive && this.state !== 'down') this.wallSlam(kbSpeed);
    // visuals
    this.model.root.position.x = this.pos.x; this.model.root.position.z = this.pos.z; this.model.root.rotation.y = this.yaw;
    const animSpeed = walkSpeed / 2.7;
    this.anim.update(dt, {
      state: this.state, action: this.move?.anim, phase: this.phase, phaseT: this.phaseProgress(), charge: this.charge, blocking: this.state === 'block',
      moveFwd: this.moveFwd, moveSide: this.moveSide, speed: animSpeed, mirrorAct: this.mirrorAct, t: this.t, downT: this.downT,
    });
    this.model.update(dt, this.heat / 100);
    for (const z of ['head', 'torso', 'arms', 'legs'] as Zone[]) this.model.setDamage(z, 1 - this.zone[z] / this.zoneMax[z]);
    if (this.zoneCrit('arms') && Math.random() < 0.04) this.env.sparks(this.model.zoneAnchor.arms.getAbsolutePosition(), 0.25);
    if (this.zoneCrit('legs') && Math.random() < 0.03) this.env.sparks(this.model.zoneAnchor.legs.getAbsolutePosition(), 0.25);
    if (this.hp < this.stats.maxHp * 0.3 && Math.random() < 0.06) this.env.burst('smoke', this.chestPos(), 0.3);
  }

  private phaseProgress() {
    const m = this.move; if (!m) return 0;
    const spd = this.speedMul();
    if (this.phase === 'windup') return this.moveT / (m.startup / spd);
    if (this.phase === 'strike') return 0;
    return (this.moveT - (m.startup + m.active) / spd - this.charge) / (m.recovery / spd);
  }
  private speedMul() {
    const base = this.stats.atkSpeed * (this.env.mods.speed || 1) * (this.zoneCrit('arms') ? 0.88 : 1);
    return base * (this.seqRoot ? this.seqSpeed : 1);
  }

  private updateAttack(dt: number, inp: InputFrame) {
    const m = this.move!; const spd = this.speedMul();
    const su = m.startup / spd, ac = m.active / spd, rc = m.recovery / spd;
    this.moveT += dt;
    // charge hold
    if (m.chargeable && this.isPlayerHolding(inp) && this.phase === 'windup' && this.moveT >= su && this.charge < 1) {
      this.charge = Math.min(1, this.charge + dt); this.moveT = su - 0.0001;
      if (Math.random() < 0.3) this.env.sparks(this.model.fist.R.getAbsolutePosition(), 0.15, '#FFC24A');
      if (this.charge >= 1 && !(this as any)._chargeAnn) { (this as any)._chargeAnn = true; this.env.popup('MAX CHARGE', this.headPos(), '#FFC24A'); this.env.sfx('charge'); }
      this.walkVel.setAll(0);
      return;
    }
    (this as any)._chargeAnn = false;
    // lunge forward during windup/strike
    const lungeT = su + ac;
    if (this.moveT < lungeT && m.lunge > 0) {
      const dist = this.distTo(this.opp);
      const sp = dist > 1.5 ? (m.lunge / lungeT) : 0;
      this.walkVel.copyFrom(this.forward.scale(sp));
    } else this.walkVel.setAll(0);
    if (this.phase === 'windup' && this.moveT >= su) {
      this.phase = 'strike';
      if (m.effect === 'teleport') this.teleportBeside();
      if (m.effect === 'blink' && !this.seqRoot) this.blinkTo(1.6);
      this.resolveStart(m);
    }
    if (this.phase === 'strike' && this.moveT >= su + ac) this.phase = 'recover';
    // chaining: allow next light in recovery
    if (this.phase === 'recover' && this.buffered && !this.seqRoot && m.kind === 'light' && this.moveT >= su + ac + rc * 0.3) {
      const b = this.buffered; this.buffered = null;
      this.move = null; this.setState('idle');
      if (b.kind === 'light') this.tryLight(); else this.tryHeavy(inp.mx, inp.mz);
      return;
    }
    if (this.moveT >= su + ac + rc + this.charge) {
      if (this.seq.length) { const next = this.seq.shift()!; this.startMove(next, this.moveMult, true); return; }
      this.seqRoot = null; this.move = null; this.setState('idle');
    }
  }
  private isPlayerHolding(inp: InputFrame) { return inp.heavyHeld; }

  /** Called once when a move reaches its active frames. */
  private resolveStart(m: MoveDef) {
    const o = this.opp;
    const chargeMult = 1 + this.charge * 0.9;
    if (m.effect && !m.dmg) { this.applyBuff(m); return; }
    if (m.projectile) { this.env.projectile(this, m, this.moveMult); return; }
    if (m.anim === 'slam' || m.anim === 'leap') { this.env.burst('ring', this.pos.add(this.forward.scale(1)), m.aoe || 3); this.env.shake(0.6); this.env.sfx('slam'); }
    if (m.effect === 'burn') this.env.burst('fire', this.model.fist.R.getAbsolutePosition(), 1);
    const dist = this.distTo(o);
    const toO = o.pos.subtract(this.pos); toO.y = 0; toO.normalize();
    const facing = Vector3.Dot(toO, this.forward);
    const inRange = m.aoe ? dist <= m.aoe : (dist <= m.reach + 0.15 && facing > 0.55);
    if (!inRange || !o.alive || o.state === 'down' || o.state === 'getup') { this.hitDone = true; if (m.dmg > 0) this.env.sfx('whiff', 0.3); return; }
    this.hitDone = true;
    o.receive(this, m, this.moveMult * chargeMult, this.charge);
  }

  private applyBuff(m: MoveDef) {
    const t = m.buffTime || 1;
    switch (m.effect) {
      case 'counter': this.buffs.counter = t; this.env.popup('COUNTER STANCE', this.headPos(), '#4FD8FF'); break;
      case 'ironwill': this.buffs.ironwill = t; this.env.popup('IRON WILL', this.headPos(), '#FF8A3D'); this.env.burst('ring', this.pos.clone(), 1.5); break;
      case 'phase': this.buffs.phase = t; this.env.popup('PHASE SHIFT', this.headPos(), '#D27CFF'); this.env.burst('shock', this.chestPos(), 0.7); break;
      case 'fortress': this.buffs.fortress = t; this.buffs.shieldHp = this.stats.maxHp * 0.18; this.env.popup('FORTRESS', this.headPos(), '#9CFF6A'); break;
      case 'shield': this.buffs.shield = t; this.buffs.shieldHp = this.stats.maxHp * 0.14; this.env.popup('SHIELD DRONE', this.headPos(), '#2EE6C5'); break;
      case 'purge': this.heat = Math.max(0, this.heat - 65); this.env.burst('steam', this.chestPos(), 1.4); this.env.sfx('steam'); this.env.popup('COOLANT PURGE', this.headPos(), '#7FE8FF'); break;
    }
    this.env.sfx('buff');
  }

  /* ---------------- taking hits ---------------- */
  receive(att: Fighter, m: MoveDef, mult: number, charge = 0): 'hit' | 'blocked' | 'parried' | 'dodged' | 'none' {
    if (!this.alive || this.state === 'down' || this.state === 'getup' || this.state === 'victory') return 'none';
    const hitPos = m.hand === 'L' ? att.model.fist.L.getAbsolutePosition() : m.hand === 'F' ? this.pos.add(new Vector3(0, 0.6, 0)) : m.projectile || m.aoe ? this.chestPos() : att.model.fist.R.getAbsolutePosition();
    // Dodge i-frames / phase
    if ((this.state === 'dodge' && this.stateT > 0.03 && this.stateT < 0.3) || this.buffs.phase > 0) {
      this.tally.perfectDodges++; this.counterWindow = 0.9;
      this.env.popup('PERFECT DODGE', this.headPos(), '#D27CFF', true); this.env.slowmo(0.35, 0.35); this.env.sfx('blink', 0.5);
      return 'dodged';
    }
    const toAtt = att.pos.subtract(this.pos); toAtt.y = 0; toAtt.normalize();
    const front = Vector3.Dot(toAtt, this.forward) > 0.3;
    const unblockable = m.unblockable || (m.guardBreak && true) || (m.chargeable && charge >= 0.6);
    // Counter stance auto-parry
    if (this.buffs.counter > 0 && front && m.kind !== 'finisher') {
      this.buffs.counter = 0; this.parry(att, hitPos);
      this.move = null; this.setState('idle'); this.startMove('counterPunch', 1.2);
      return 'parried';
    }
    if (this.state === 'block' && front && !unblockable && !this.env.mods.noBlock) {
      this.blocksMade++;
      if (this.blockT < 0.22) { this.parry(att, hitPos); return 'parried'; }
      const chip = m.dmg * att.stats.dmgMult * mult * (1 - this.stats.blockEff) * (1 - this.stats.dr);
      this.hp = Math.max(1, this.hp - chip); this.zone.arms -= chip * 1.2; this.tally.zoneTaken.arms += chip; this.tally.dmgTaken += chip; att.tally.dmgDealt += chip;
      this.stamina -= m.dmg * 0.4;
      this.env.sparks(hitPos, 0.4, '#FFE08A'); this.env.sfx('block'); this.env.shake(0.08);
      this.anim.hit('arms', 0, 0.7); this.kb.addInPlace(toAtt.scale(-m.kb * 2));
      att.special = Math.min(100, att.special + 2);
      if (this.stamina <= 0) { this.stamina = 0; this.env.popup('GUARD BROKEN', this.headPos(), '#FF5A3A', true); this.stagger(); this.env.sfx('break'); }
      return 'blocked';
    }
    if (this.state === 'block' && unblockable && front) this.env.popup('GUARD BREAK', this.headPos(), '#FF5A3A', true);
    // Damage
    let dmg = m.dmg * att.stats.dmgMult * mult * (this.env.mods.dmg || 1);
    const tags: string[] = [];
    if (m.kind === 'finisher') dmg = this.hp + 1;
    let crit = false, counter = false;
    if (att.counterWindow > 0 || m.id === 'counterPunch') { dmg *= att.stats.counterMult; counter = true; att.counterWindow = 0; att.tally.counters++; tags.push('COUNTER'); }
    if (Math.random() < att.stats.crit) { dmg *= 1.6; crit = true; tags.push('CRITICAL'); }
    if (this.vulnerable && m.kind !== 'finisher') dmg *= 1.15;
    const zone = m.zone;
    dmg *= zone === 'head' ? 1.15 : zone === 'legs' ? 0.85 : 1;
    if (att.combo >= 4) dmg *= Math.max(0.55, 1 - (att.combo - 3) * 0.08);
    if (m.kind !== 'finisher') {
      dmg *= 1 - this.stats.dr;
      if (this.buffs.ironwill > 0) dmg *= 0.6;
      if (this.state === 'overheat') dmg *= 1.25;
      if (this.buffs.shieldHp > 0) { const ab = Math.min(this.buffs.shieldHp, dmg * 0.8); this.buffs.shieldHp -= ab; dmg -= ab; this.env.burst('shock', this.chestPos(), 0.4); if (this.buffs.shieldHp <= 0) { this.buffs.shield = 0; this.buffs.fortress = 0; this.env.popup('SHIELD DOWN', this.headPos(), '#2EE6C5'); } }
    }
    dmg = Math.max(1, dmg);
    this.hp = Math.max(0, this.hp - dmg);
    this.zone[zone] -= dmg * 1.25;
    if (this.zone[zone] <= 0 && this.zone[zone] + dmg * 1.25 > 0) { this.env.popup(`${zone.toUpperCase()} CRITICAL`, this.headPos(), '#FF3A3A', true); this.env.burst('debris', hitPos, 1.2); this.env.sfx('crit'); }
    this.tally.zoneTaken[zone] += dmg; this.tally.dmgTaken += dmg; att.tally.dmgDealt += dmg; att.tally.hits++;
    if (zone === 'head') att.tally.headHits++;
    if (m.kind === 'heavy') att.heavyHits++;
    this.lastHitT = 0;
    att.combo++; att.comboT = 1.5; att.tally.bestCombo = Math.max(att.tally.bestCombo, att.combo);
    this.combo = 0;
    att.special = Math.min(100, att.special + dmg * 0.22 * att.stats.specialGain * (m.kind === 'special' ? 0 : 1));
    this.special = Math.min(100, this.special + dmg * 0.12 * this.stats.specialGain);
    // Effects
    if (m.effect === 'bleed') this.buffs.bleed = 4;
    if (m.effect === 'burn') { this.heat += 38; this.buffs.burn = 2.5; this.env.burst('fire', this.chestPos(), 0.8); }
    // Feedback
    const heavyish = m.kind !== 'light' || crit || counter;
    const power = Math.min(1.6, dmg / 45);
    this.env.sparks(hitPos, 0.5 + power * 0.8, crit ? '#FFFFFF' : undefined);
    if (heavyish) this.env.burst('debris', hitPos, power);
    this.env.sfx(heavyish ? 'impactHeavy' : 'impact', Math.min(1, 0.5 + power * 0.4));
    this.env.shake((heavyish ? 0.22 : 0.09) * (0.6 + power * 0.6));
    this.env.hitstop(heavyish ? 0.09 : 0.045);
    this.env.popup(`${Math.round(dmg)}${tags.length ? ' ' + tags.join(' ') : ''}`, hitPos, crit ? '#FFFFFF' : counter ? '#4FD8FF' : '#FFC24A', tags.length > 0);
    if (counter) this.env.crowd(0.5);
    const side = m.anim === 'hookL' ? 1 : m.anim === 'hookR' ? -1 : (Math.random() - 0.5);
    this.anim.hit(zone, side, 0.6 + power * 0.6);
    const kbDir = toAtt.scale(-1);
    this.kb.addInPlace(kbDir.scale(m.kb * 3.2 * (this.buffs.ironwill > 0 ? 0.4 : 1)));
    // Interrupt our attack on heavy hits unless armored
    const armored = this.buffs.ironwill > 0 || (this.move && this.move.kind === 'special');
    // Stun
    if (m.stun && !armored) { this.move = null; this.seq = []; this.seqRoot = null; (this as any)._stunT = m.stun; this.setState('stun'); this.env.sparks(this.headPos(), 0.6, '#7FE8FF'); }
    // KO?
    if (this.hp <= 0) {
      this.move = null; this.setState('ko');
      this.env.slowmo(1.4, 0.25); this.env.shake(0.9); this.env.burst('debris', hitPos, 2); this.env.burst('smoke', this.chestPos(), 1.5); this.env.sfx('shutdown');
      this.env.onKO(this, m.kind === 'finisher' ? 'Finisher' : 'KO');
      return 'hit';
    }
    // Poise / knockdown / stagger
    const poiseDmg = m.poise * (1 + charge * 0.8) * (armored ? 0.3 : 1);
    this.poise -= poiseDmg;
    const wasVuln = this.state === 'stagger';
    if (m.knockdown && !(this.buffs.ironwill > 0)) this.knockdown();
    else if (this.poise <= 0 && !armored) { if (wasVuln && m.kind !== 'light') this.knockdown(); else this.stagger(); }
    else if (heavyish && !armored && this.state === 'attack' && this.phase === 'windup') { this.move = null; this.seq = []; this.seqRoot = null; this.setState('idle'); this.env.popup('INTERRUPTED', this.headPos(), '#FFF'); }
    return 'hit';
  }

  private parry(att: Fighter, at: Vector3) {
    this.tally.perfectBlocks++; this.counterWindow = 1.0; this.special = Math.min(100, this.special + 8);
    att.move = null; att.seq = []; att.seqRoot = null; att.stagger(0.7);
    this.env.popup('PERFECT BLOCK', this.headPos(), '#4FD8FF', true); this.env.sparks(at, 1, '#9FE8FF'); this.env.sfx('parry'); this.env.hitstop(0.12); this.env.shake(0.15);
  }
  stagger(t = 0.85) {
    if (this.state === 'ko') return;
    this.move = null; this.seq = []; this.seqRoot = null; this.setState('stagger'); this.poise = this.stats.poiseMax * 0.6;
    (this as any)._stagT = t;
    this.env.sfx('stagger');
  }
  knockdown() {
    if (this.state === 'ko') return;
    this.move = null; this.seq = []; this.seqRoot = null;
    this.setState('down'); this.kd++; this.mashBoost = 0; this.poise = this.stats.poiseMax;
    this.tally.knockdownsTaken++; this.opp.tally.knockdownsDealt++;
    this.env.announce('KNOCKDOWN', this.isPlayer ? 'Tap any button to get up faster' : `${this.kd} of 3`, '#FFB12E');
    this.env.shake(0.5); this.env.sfx('knockdown'); this.env.crowd(1); this.env.burst('dust', this.pos.clone(), 1.5);
    this.kb.scaleInPlace(0.5);
    if (this.kd >= 3) { this.env.onKO(this, 'TKO'); }
  }
  private wallSlam(speed: number) {
    const dmg = this.stats.maxHp * 0.025 * Math.min(2, speed / 3);
    this.hp = Math.max(1, this.hp - dmg); this.tally.dmgTaken += dmg; this.opp.tally.dmgDealt += dmg; this.zone.torso -= dmg;
    this.kb.scaleInPlace(-0.35);
    this.env.popup(`WALL SLAM ${Math.round(dmg)}`, this.headPos(), '#FF9A3D', true); this.env.shake(0.35); this.env.sfx('wall');
    this.env.sparks(this.chestPos(), 1.2); this.env.burst('debris', this.chestPos(), 1); this.env.crowd(0.7);
    if (this.state !== 'stun' && this.state !== 'ko') this.stagger(0.6);
  }

  victory() { this.move = null; this.setState('victory'); }
  resetForRound(heal: number) {
    this.hp = Math.min(this.stats.maxHp, this.hp + this.stats.maxHp * heal);
    for (const z of Object.keys(this.zone) as Zone[]) this.zone[z] = Math.min(this.zoneMax[z], this.zone[z] + this.zoneMax[z] * heal * 1.5);
    this.stamina = this.stats.staminaMax; this.heat = 0; this.kd = 0; this.poise = this.stats.poiseMax; this.move = null; this.seq = []; this.seqRoot = null;
    this.kb.setAll(0); this.walkVel.setAll(0); this.setState('idle'); this.combo = 0; this.counterWindow = 0;
    for (const k in this.buffs) (this.buffs as any)[k] = 0;
  }
}
