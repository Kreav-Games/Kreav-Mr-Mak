import type { ClassId, FighterStats, PartItem, RobotFrame, StatBlock, SlotId, Rarity } from './types';
import { LOWER_BETTER, STAT_KEYS } from './types';
import { PART_BY_ID, RARITIES, levelMult, condMult, SLOTS } from '../data/parts';
import { CLASSES, applyMods } from '../data/classes';
import type { Opponent } from '../data/opponents';

export const zeroStats = (): StatBlock => ({ hp: 0, armor: 0, weight: 0, power: 0, atkSpd: 0, moveSpd: 0, energy: 0, heat: 0, cooling: 0, durability: 0, crit: 0 });

/** Effective stats of one part instance. */
export function partStats(item: Pick<PartItem, 'def' | 'rarity' | 'level' | 'cond'>, cls?: ClassId): StatBlock {
  const def = PART_BY_ID[item.def];
  const out = zeroStats();
  if (!def) return out;
  const m = RARITIES[item.rarity].mult * levelMult(item.level) * condMult(item.cond);
  const aff = def.cls && def.cls === cls ? 1.08 : 1;
  for (const k of STAT_KEYS) {
    const v = def.base[k] || 0;
    if (!v) continue;
    const worse = LOWER_BETTER.includes(k) ? v > 0 : v < 0;
    out[k] = worse ? v / (1 + (m - 1) * 0.5) : v * m * aff;
  }
  return out;
}

export function sumStats(items: (Pick<PartItem, 'def' | 'rarity' | 'level' | 'cond'> | undefined)[], cls?: ClassId): StatBlock {
  const s = zeroStats();
  for (const it of items) { if (!it) continue; const p = partStats(it, cls); for (const k of STAT_KEYS) s[k] += p[k]; }
  return s;
}

export function derive(raw: StatBlock, cls: ClassId, skills: Record<string, number>): FighterStats {
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  const fs: FighterStats = {
    maxHp: (300 + raw.hp) * 1.7,
    dr: raw.armor / (raw.armor + 320),
    dmgMult: 0.6 + raw.power / 240,
    atkSpeed: clamp(0.72 + raw.atkSpd / 220, 0.7, 1.55),
    moveMult: clamp((0.55 + raw.moveSpd / 180) * (1.32 - raw.weight / 1500), 0.5, 1.6),
    staminaMax: 70 + Math.max(0, raw.energy) * 0.4,
    staminaRegen: 16 + Math.max(-10, raw.energy) * 0.1,
    heatGen: clamp(0.5 + raw.heat / 120, 0.4, 2),
    heatDiss: 2.5 + raw.cooling * 0.09,
    crit: raw.crit / 100,
    poiseMax: 90 + raw.armor * 0.15 + raw.weight * 0.03,
    counterMult: 1.5, specialGain: 1, blockEff: 0.8, dodgeCost: 1,
    weight: raw.weight, abilityB: false, specialMult: 1, cdMult: 1, raw,
  };
  const c = CLASSES[cls];
  applyMods(fs, c.mods);
  for (const node of c.skills) {
    const r = skills[node.id] || 0;
    if (!r) continue;
    if (node.unlockB) fs.abilityB = true;
    if (node.mods) applyMods(fs, node.mods, r);
  }
  fs.maxHp = Math.round(fs.maxHp);
  fs.dr = Math.min(0.6, fs.dr);
  fs.crit = Math.min(0.6, fs.crit);
  fs.blockEff = Math.min(0.95, fs.blockEff);
  return fs;
}

export function robotItems(robot: RobotFrame, parts: PartItem[]): Partial<Record<SlotId, PartItem>> {
  const lo = robot.builds[robot.activeBuild] || {};
  const out: Partial<Record<SlotId, PartItem>> = {};
  for (const s of SLOTS) { const uid = lo[s.id]; if (!uid) continue; const it = parts.find(p => p.uid === uid); if (it) out[s.id] = it; }
  return out;
}
export function robotStats(robot: RobotFrame, parts: PartItem[]): FighterStats {
  const items = robotItems(robot, parts);
  return derive(sumStats(Object.values(items), robot.cls), robot.cls, robot.skills);
}

/** Virtual part list for an AI opponent built from its definition. */
export function opponentItems(o: Opponent): Partial<Record<SlotId, PartItem>> {
  const out: Partial<Record<SlotId, PartItem>> = {};
  for (const s of SLOTS) {
    const def = o.parts[s.cat];
    if (!def) continue;
    out[s.id] = { uid: o.id + s.id, def, rarity: o.rarity as Rarity, level: o.plv, cond: 100 };
  }
  return out;
}
export function opponentStats(o: Opponent): FighterStats {
  const items = opponentItems(o);
  const skills: Record<string, number> = {};
  // Opponents get skill ranks scaled with their league.
  const ranks = Math.min(3, o.league);
  for (const n of CLASSES[o.cls].skills) skills[n.id] = n.unlockB ? (o.league >= 1 ? 1 : 0) : Math.max(0, ranks - (n.tier - 1));
  const fs = derive(sumStats(Object.values(items), o.cls), o.cls, skills);
  if (o.boss) { fs.maxHp = Math.round(fs.maxHp * 1.12); fs.poiseMax *= 1.2; }
  // Early opponents are softened so a fresh robot can win its first contracts.
  fs.maxHp = Math.round(fs.maxHp * [0.82, 0.92, 1, 1, 1][o.league]);
  return fs;
}

export function powerRating(fs: FighterStats): number {
  return Math.round(fs.maxHp * 0.08 + fs.dr * 300 + fs.dmgMult * 120 + fs.atkSpeed * 80 + fs.moveMult * 60 + fs.staminaMax * 0.3 + fs.heatDiss * 2 + fs.crit * 200);
}
