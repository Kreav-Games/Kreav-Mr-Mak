import type { InputFrame } from '../core/types';
import { emptyInput } from '../core/types';
import type { Fighter } from './fighter';
import type { Opponent, Personality } from '../data/opponents';
import { MOVES } from '../data/moves';

interface Traits { aggr: number; block: number; dodge: number; heavy: number; combo: number; keep: number; counter: number; ability: number }
const TRAITS: Record<Personality, Traits> = {
  brawler: { aggr: 0.85, block: 0.25, dodge: 0.1, heavy: 0.45, combo: 3, keep: 1.8, counter: 0.25, ability: 0.5 },
  counter: { aggr: 0.35, block: 0.65, dodge: 0.25, heavy: 0.3, combo: 2, keep: 2.4, counter: 0.8, ability: 0.4 },
  evasive: { aggr: 0.5, block: 0.2, dodge: 0.6, heavy: 0.2, combo: 3, keep: 2.8, counter: 0.45, ability: 0.5 },
  tank: { aggr: 0.6, block: 0.5, dodge: 0.05, heavy: 0.6, combo: 2, keep: 1.9, counter: 0.3, ability: 0.5 },
  combo: { aggr: 0.75, block: 0.35, dodge: 0.3, heavy: 0.25, combo: 5, keep: 2.0, counter: 0.45, ability: 0.5 },
  tactical: { aggr: 0.5, block: 0.45, dodge: 0.35, heavy: 0.35, combo: 3, keep: 2.3, counter: 0.6, ability: 0.8 },
};

/** Produces an InputFrame each tick for an AI-controlled fighter. */
export class AIController {
  private t: Traits; private think = 0; private plan: 'approach' | 'retreat' | 'circle' | 'hold' = 'approach';
  private planT = 0; private strafe = 1; private strafeT = 0; private string = 0; private stringGap = 0;
  private blockHold = 0; private heavyHold = 0; private reactT = 0; private watchingMove: object | null = null; private reacted = false;
  private playerBlocks = 0; private playerAttacks = 0; private playerDodges = 0;
  private diff: number; private sigCd = 3;
  constructor(private me: Fighter, private def: Opponent, diffOverride?: number) {
    this.t = { ...TRAITS[def.pers] };
    this.diff = diffOverride ?? def.diff;
  }
  get reaction() { return 0.5 - 0.36 * this.diff; }

  update(dt: number): InputFrame {
    const me = this.me, op = me.opp, inp = emptyInput();
    if (!me.alive || me.state === 'victory') return inp;
    if (me.state === 'down') { inp.mash = Math.random() < 0.08 + this.diff * 0.25; return inp; }
    this.think -= dt; this.planT -= dt; this.strafeT -= dt; this.stringGap -= dt;
    // Boss phase escalation
    if (this.def.boss) {
      const frac = me.hp / me.stats.maxHp;
      const phases = this.def.boss.phases;
      const ph = phases >= 3 ? (frac < 0.33 ? 2 : frac < 0.66 ? 1 : 0) : (frac < 0.5 ? 1 : 0);
      if (ph > me.bossPhase) {
        me.bossPhase = ph;
        this.t.aggr = Math.min(1, this.t.aggr + 0.15); this.diff = Math.min(1, this.diff + 0.06);
        me.buffs.ironwill = 2.5; me.special = 100;
        me.env.announce(`${this.def.name} — PHASE ${ph + 1}`, ph === phases - 1 ? 'It is getting desperate' : 'Systems overclocked', '#FF3A3A');
        me.env.sfx('roar'); me.env.burst('ring', me.pos.clone(), 3); me.env.shake(0.4);
      }
    }
    // Track the player's habits for adaptation
    if (op.state === 'block') this.playerBlocks += dt; if (op.state === 'attack') this.playerAttacks += dt; if (op.state === 'dodge') this.playerDodges += dt;
    const dist = me.distTo(op);
    // Holding heavy for charge
    if (this.heavyHold > 0) { this.heavyHold -= dt; inp.heavyHeld = true; }
    // Reactive defense
    if (op.state === 'attack' && op.move && op.move.dmg > 0) {
      if (this.watchingMove !== op.move) { this.watchingMove = op.move; this.reactT = this.reaction * (0.7 + Math.random() * 0.6); this.reacted = false; }
      this.reactT -= dt;
      const threat = op.move.projectile ? true : dist < (op.move.aoe || op.move.reach) + 0.6;
      if (!this.reacted && this.reactT <= 0 && threat && op.phase === 'windup' && me.canAct) {
        this.reacted = true;
        const skill = 0.3 + 0.7 * this.diff;
        const unblockable = op.move.unblockable || op.move.guardBreak || (op.move.chargeable && op.charge > 0.5);
        const r = Math.random();
        if (r < this.t.dodge * skill * (unblockable ? 1.6 : 1) || (op.move.projectile && r < 0.6 * skill)) { inp.dodge = true; inp.mx = Math.random() < 0.5 ? -1 : 1; inp.mz = -0.3; return inp; }
        if (!unblockable && r < (this.t.dodge + this.t.block) * skill) this.blockHold = 0.45 + Math.random() * 0.3;
      }
    } else this.watchingMove = null;
    if (this.blockHold > 0) {
      this.blockHold -= dt; inp.block = true;
      if (me.counterWindow > 0 && Math.random() < this.t.counter) { inp.block = false; this.blockHold = 0; inp.light = true; }
      inp.mz = dist > this.t.keep + 0.5 ? 0.4 : 0;
      return inp;
    }
    if (!me.canAct) return inp;
    // Counter window after a parry or perfect dodge
    if (me.counterWindow > 0 && Math.random() < 0.6 + this.t.counter * 0.4) { if (dist < 2.4) { inp.light = Math.random() < 0.6; inp.heavy = !inp.light; } else inp.mz = 1; return inp; }
    // Punish a vulnerable opponent
    if ((op.vulnerable || op.state === 'getup') && dist < 2.6) {
      if (me.finisherReady && Math.random() < 0.5 + this.diff * 0.5) { inp.special = true; return inp; }
      if (me.special >= 100 && Math.random() < 0.6) { inp.special = true; return inp; }
      if (op.state !== 'getup') { inp.heavy = true; this.heavyHold = 0.1; return inp; }
    }
    // Heat and stamina management
    if (me.heat > 78) {
      if (me.abilityReady(3)) { inp.ab4 = true; return inp; }
      this.plan = 'retreat'; this.planT = 1.2;
    }
    if (me.stamina < me.stats.staminaMax * 0.22) { this.plan = Math.random() < 0.5 ? 'retreat' : 'circle'; this.planT = 1; }
    if (this.think <= 0) {
      this.think = 0.12 + (1 - this.diff) * 0.22 + Math.random() * 0.1;
      // Boss signatures and abilities
      this.sigCd -= this.think;
      if (this.def.boss && this.sigCd <= 0 && Math.random() < 0.35 + me.bossPhase * 0.15) {
        const sigs = this.def.boss.sig.slice(0, 1 + me.bossPhase);
        const pick = sigs[Math.floor(Math.random() * sigs.length)];
        const mv = MOVES[pick];
        const range = mv.projectile ? 12 : (mv.aoe || mv.reach) + (mv.effect === 'teleport' ? 0 : 0.2);
        if (dist <= range && (!mv.projectile || dist > 3)) { this.sigCd = 4.5 - me.bossPhase * 1.2; me.startMove(pick); return inp; }
      }
      if (me.special >= 100 && dist < 2.8 && Math.random() < 0.25 + this.diff * 0.3) { inp.special = true; return inp; }
      if (Math.random() < this.t.ability * 0.25) {
        const slots = [0, 1, 2].filter(i => me.abilityReady(i));
        if (slots.length) {
          const i = slots[Math.floor(Math.random() * slots.length)];
          const id = me.abilityIds()[i]!; const mv = MOVES[id];
          const range = mv.projectile ? 12 : mv.aoe || mv.reach;
          if (mv.dmg === 0 || dist <= range + 0.2) { (inp as any)[`ab${i + 1}`] = true; return inp; }
        }
      }
      // Choose to open a string of attacks
      const playerTurtles = this.playerBlocks > this.playerAttacks * 1.5 + 2;
      const aggr = this.t.aggr * (0.7 + this.diff * 0.5) * (me.stamina / me.stats.staminaMax > 0.4 ? 1 : 0.5);
      if (dist < 2.3 && this.string <= 0 && Math.random() < aggr * 0.7) {
        this.string = 1 + Math.floor(Math.random() * this.t.combo);
        this.stringGap = 0;
        if (playerTurtles && Math.random() < 0.45) { inp.heavy = true; this.heavyHold = 0.65; this.string = 0; return inp; }
      }
      // movement plan
      if (this.planT <= 0) {
        const r = Math.random();
        this.plan = dist > this.t.keep + 0.3 ? 'approach' : dist < this.t.keep - 0.6 && r > this.t.aggr ? 'retreat' : r < 0.55 ? 'circle' : 'hold';
        if (dist > this.t.keep + 0.3 && r < this.t.aggr) this.plan = 'approach';
        this.planT = 0.6 + Math.random() * 1.2;
      }
      if (this.strafeT <= 0) { this.strafe = Math.random() < 0.5 ? -1 : 1; this.strafeT = 1 + Math.random() * 2; }
    }
    // Execute strings
    if (this.string > 0 && this.stringGap <= 0) {
      if (dist > 2.35) { inp.mz = 1; }
      else {
        const heavy = Math.random() < this.t.heavy * 0.5 || (this.string === 1 && Math.random() < this.t.heavy);
        if (heavy) {
          inp.heavy = true;
          const r = Math.random(); inp.mz = r < 0.3 ? 1 : r < 0.45 ? -1 : 0; inp.mx = r > 0.75 ? (Math.random() < 0.5 ? -1 : 1) : 0;
          if (Math.random() < 0.25 + this.diff * 0.2) this.heavyHold = 0.3 + Math.random() * 0.5;
        } else inp.light = true;
        this.string--; this.stringGap = 0.16 + (1 - this.diff) * 0.2;
        return inp;
      }
    }
    switch (this.plan) {
      case 'approach': inp.mz = dist > 1.75 ? 1 : 0; inp.mx = this.strafe * 0.3; break;
      case 'retreat': inp.mz = -0.8; inp.mx = this.strafe * 0.6; break;
      case 'circle': inp.mx = this.strafe; inp.mz = dist > this.t.keep ? 0.5 : dist < this.t.keep - 0.5 ? -0.4 : 0; break;
      case 'hold': inp.mz = dist > this.t.keep + 0.4 ? 0.5 : 0; if (Math.random() < this.t.block * 0.05) this.blockHold = 0.5; break;
    }
    if (Math.random() < 0.004 && dist > 4) inp.taunt = true;
    return inp;
  }
}
