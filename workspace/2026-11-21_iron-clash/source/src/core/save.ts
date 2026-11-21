import type { ClassId, PartItem, Profile, Rarity, RobotFrame, SlotId, LifetimeStats } from './types';
import { CLASSES } from '../data/classes';
import { SLOTS } from '../data/parts';

const KEY = 'ironClash.save.v1';
export const SAVE_VERSION = 1;

const emptyStats = (): LifetimeStats => ({
  fights: 0, wins: 0, losses: 0, kos: 0, tkos: 0, decisions: 0, knockdownsDealt: 0, knockdownsTaken: 0,
  dmgDealt: 0, dmgTaken: 0, hits: 0, headHits: 0, counters: 0, perfectBlocks: 0, perfectDodges: 0,
  bestCombo: 0, finishers: 0, specials: 0, playSeconds: 0, partsFound: 0, tournamentsWon: 0, classWins: {},
});

export function newProfile(): Profile {
  const p: Profile = {
    v: SAVE_VERSION, name: 'Rookie', credits: 1500, xp: 0, level: 1, rankPts: 0,
    mats: { scrap: 6, alloy: 0, circuits: 0, quantum: 0 }, parts: [], robots: [], activeRobot: '',
    career: { league: 0, beaten: [], belts: [] }, challengesDone: [], tournament: null, trophies: [],
    shop: { seed: 1, refreshAt: 0, bought: [] }, daily: { date: '', list: [] }, stats: emptyStats(),
    settings: { master: 0.8, music: 0.5, sfx: 0.9, quality: isMobile() ? 'medium' : 'high', sens: 1, invertY: false, shake: true, touch: 'auto', showHints: true },
    tutorialDone: false, nextUid: 1,
  };
  const r = addRobot(p, 'boxer', 'IRONHEART');
  p.activeRobot = r.id;
  // A couple of spare parts so the garage has something to try on day one.
  addPart(p, 'a_titan', 0); addPart(p, 'k_mace', 0); addPart(p, 'h_dome', 0);
  return p;
}

export function isMobile() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && innerWidth < 1100);
}

export function addPart(p: Profile, def: string, rarity: Rarity, level = 1): PartItem {
  const it: PartItem = { uid: 'p' + (p.nextUid++), def, rarity, level, cond: 100 };
  p.parts.push(it);
  return it;
}

export function addRobot(p: Profile, cls: ClassId, name?: string): RobotFrame {
  const c = CLASSES[cls];
  const lo: Partial<Record<SlotId, string>> = {};
  for (const s of SLOTS) {
    const def = c.starter[s.cat];
    if (!def) continue;
    lo[s.id] = addPart(p, def, 0).uid;
  }
  const r: RobotFrame = {
    id: 'r' + (p.nextUid++), name: name || c.name.toUpperCase() + '-' + (p.robots.length + 1), cls, level: 1, xp: 0,
    skills: {}, builds: [lo, { ...lo }, { ...lo }], activeBuild: 0,
    paint: { ...c.frame }, slotPaint: {}, decal: p.robots.length % 6,
  };
  p.robots.push(r);
  return r;
}

export const activeRobot = (p: Profile) => p.robots.find(r => r.id === p.activeRobot) || p.robots[0];

/** Parts not used by any build of any robot. */
export function partInUse(p: Profile, uid: string) {
  return p.robots.some(r => r.builds.some(b => Object.values(b).includes(uid)));
}

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Profile;
    if (!p || p.v !== SAVE_VERSION || !Array.isArray(p.robots) || !p.robots.length) return null;
    const fresh = newProfile();
    // Fill in fields added later, keep everything the player owns.
    for (const k of Object.keys(fresh) as (keyof Profile)[]) if ((p as any)[k] === undefined) (p as any)[k] = (fresh as any)[k];
    p.stats = { ...fresh.stats, ...p.stats };
    p.settings = { ...fresh.settings, ...p.settings };
    p.mats = { ...fresh.mats, ...p.mats };
    return p;
  } catch { return null; }
}
export function saveProfile(p: Profile) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* storage unavailable */ }
}
export function wipeProfile() { try { localStorage.removeItem(KEY); } catch { /* ignore */ } }

export const xpForPlayer = (l: number) => Math.round(220 * Math.pow(l, 1.45));
export const xpForRobot = (l: number) => Math.round(160 * Math.pow(l, 1.35));
export const MAX_PLAYER_LEVEL = 30;
export const MAX_ROBOT_LEVEL = 20;

/** Adds XP; returns levels gained. */
export function givePlayerXp(p: Profile, n: number): number {
  let gained = 0; p.xp += n;
  while (p.level < MAX_PLAYER_LEVEL && p.xp >= xpForPlayer(p.level)) { p.xp -= xpForPlayer(p.level); p.level++; gained++; }
  return gained;
}
export function giveRobotXp(r: RobotFrame, n: number): number {
  let gained = 0; r.xp += n;
  while (r.level < MAX_ROBOT_LEVEL && r.xp >= xpForRobot(r.level)) { r.xp -= xpForRobot(r.level); r.level++; gained++; }
  return gained;
}
export const skillPointsLeft = (r: RobotFrame) => (r.level - 1) - Object.values(r.skills).reduce((a, b) => a + b, 0);
