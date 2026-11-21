import type { PartItem, Profile, Rarity, Zone, Materials } from './types';
import { PARTS, PART_BY_ID, RARITIES, SLOTS, MAX_PART_LEVEL, UPGRADE } from '../data/parts';
import { LEAGUES, OPPONENTS, OPP_BY_ID, CHALLENGES, DAILY_TEMPLATES, leagueOpponents, leagueBoss } from '../data/opponents';
import { addPart, activeRobot, givePlayerXp, giveRobotXp } from './save';
import { robotItems } from './stats';

export function rng(seed: number) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }

export type FightKind = 'career' | 'boss' | 'tournament' | 'challenge' | 'quick' | 'tutorial' | 'rival';
export interface FightContext { kind: FightKind; league: number; oppId: string; challengeId?: string; bonus?: { text: string; key: keyof FightResult; n: number } }
export interface FightResult {
  win: boolean; method: 'KO' | 'TKO' | 'Decision' | 'Finisher'; rounds: number; time: number;
  dmgDealt: number; dmgTaken: number; hits: number; attempts: number; headHits: number; counters: number;
  perfectBlocks: number; perfectDodges: number; bestCombo: number; knockdownsDealt: number; knockdownsTaken: number;
  specials: number; zoneTaken: Record<Zone, number>; ctx: FightContext;
}
export interface Rewards {
  credits: number; xp: number; robotXp: number; mats: Partial<Materials>; parts: PartItem[]; rank: number; grade: string;
  levelUps: number; robotLevelUps: number; belt?: string; notes: string[]; bonusHit: boolean;
}

export function rollRarity(league: number, r: () => number, boost = 0): Rarity {
  const w = [
    [60, 30, 9, 1, 0, 0], [35, 38, 20, 6, 1, 0], [15, 32, 33, 16, 4, 0], [5, 18, 35, 28, 12, 2], [0, 8, 28, 36, 22, 6],
  ][Math.max(0, Math.min(4, league))];
  let x = r() * 100; let i = 0;
  for (; i < 6; i++) { x -= w[i]; if (x <= 0) break; }
  return Math.min(5, i + boost) as Rarity;
}
export function randomDef(maxUnlock: number, r: () => number) {
  const pool = PARTS.filter(p => p.unlock <= maxUnlock);
  return pool[Math.floor(r() * pool.length)];
}

export function grade(res: FightResult): string {
  if (!res.win) return res.dmgDealt > res.dmgTaken * 0.7 ? 'C' : 'D';
  let s = 0;
  s += Math.min(40, (res.dmgDealt / Math.max(1, res.dmgTaken)) * 12);
  s += res.attempts ? (res.hits / res.attempts) * 20 : 0;
  s += res.method === 'KO' || res.method === 'Finisher' ? 20 : res.method === 'TKO' ? 15 : 5;
  s += Math.min(10, res.counters * 2 + res.perfectBlocks + res.perfectDodges);
  s += res.time < 60 ? 10 : res.time < 150 ? 5 : 0;
  return s >= 85 ? 'S' : s >= 68 ? 'A' : s >= 50 ? 'B' : 'C';
}

/** Applies all post-fight progression to the profile and returns what was earned. */
export function settleFight(p: Profile, res: FightResult): Rewards {
  const r = rng(Date.now() & 0xffffffff);
  const ctx = res.ctx; const lg = LEAGUES[Math.min(4, ctx.league)];
  const g = grade(res);
  const gMult = { S: 1.4, A: 1.2, B: 1.05, C: 0.9, D: 0.75 }[g] || 1;
  const notes: string[] = [];
  let credits = 0, xp = 0, rxp = 0; const parts: PartItem[] = []; const mats: Partial<Materials> = {};
  const addMat = (k: keyof Materials, n: number) => { mats[k] = (mats[k] || 0) + n; p.mats[k] += n; };
  let bonusHit = false;
  if (ctx.kind === 'tutorial') {
    credits = 500; xp = 120; rxp = 80; addMat('scrap', 4);
  } else {
    const purse = lg.purse * (ctx.kind === 'boss' ? 2.5 : ctx.kind === 'quick' ? 0.6 : 1);
    credits = Math.round((res.win ? purse : purse * 0.3) * gMult);
    xp = Math.round((res.win ? 120 : 50) * (1 + ctx.league * 0.6) * gMult * (ctx.kind === 'boss' ? 2 : 1));
    rxp = Math.round(xp * 0.9);
    if (ctx.bonus && res.win && (res[ctx.bonus.key] as number) >= ctx.bonus.n) { bonusHit = true; credits += Math.round(purse * 0.4); notes.push('Contract bonus earned: ' + ctx.bonus.text); }
    addMat('scrap', res.win ? 2 + Math.floor(r() * 3) : 1);
    if (ctx.league >= 1 && res.win) addMat('alloy', 1 + Math.floor(r() * (1 + ctx.league)));
    if (ctx.league >= 3 && res.win && r() < 0.6) addMat('circuits', 1 + Math.floor(r() * 2));
    if (ctx.league >= 4 && res.win && r() < 0.35) addMat('quantum', 1);
    // Component drops
    const dropChance = res.win ? (ctx.kind === 'boss' ? 1 : 0.55 + (g === 'S' ? 0.25 : 0)) : 0.12;
    if (r() < dropChance) {
      const boost = ctx.kind === 'boss' ? 1 : 0;
      let rar = rollRarity(ctx.league, r, boost);
      if (ctx.kind === 'boss') rar = Math.max(rar, Math.min(5, ctx.league + 1)) as Rarity;
      const def = randomDef(p.level + 4, r);
      parts.push(addPart(p, def.id, rar));
    }
    if (ctx.kind === 'challenge' && res.win) {
      const ch = CHALLENGES.find(c => c.id === ctx.challengeId)!;
      if (!p.challengesDone.includes(ch.id)) { p.challengesDone.push(ch.id); credits += ch.reward.credits; parts.push(addPart(p, randomDef(p.level + 6, r).id, ch.reward.rarity)); notes.push('Challenge complete! Bonus prize awarded.'); }
    }
  }
  // Career bookkeeping
  let belt: string | undefined;
  if (res.win && (ctx.kind === 'career' || ctx.kind === 'boss' || ctx.kind === 'rival')) {
    if (!p.career.beaten.includes(ctx.oppId)) p.career.beaten.push(ctx.oppId);
    if (ctx.kind === 'boss' && !p.career.belts.includes(ctx.league)) {
      p.career.belts.push(ctx.league); belt = lg.belt;
      const legendary = addPart(p, randomDef(30, r).id, Math.min(5, 3 + Math.floor(ctx.league / 2)) as Rarity, 1);
      parts.push(legendary);
      if (ctx.league === 4) { parts.push(addPart(p, 'c_void', 5, 3)); notes.push('You are the WORLD CHAMPION. A mythic Singularity Core joins your collection.'); }
      if (p.career.league < 4) { p.career.league = ctx.league + 1; notes.push(`${LEAGUES[ctx.league + 1].name} unlocked.`); }
    }
  }
  // Rank
  const rank = ctx.kind === 'tutorial' ? 0 : res.win ? 20 + ctx.league * 15 + (ctx.kind === 'boss' ? 40 : 0) : -8;
  p.rankPts = Math.max(0, p.rankPts + rank);
  // Wear and tear on parts by zone damage taken
  const robot = activeRobot(p);
  const items = robotItems(robot, p.parts);
  for (const s of SLOTS) {
    const it = items[s.id]; if (!it) continue;
    const dur = PART_BY_ID[it.def].base.durability || 8;
    const taken = res.zoneTaken[s.zone] || 0;
    const loss = Math.min(35, taken / (12 + dur * 1.2));
    it.cond = Math.max(0, Math.round(it.cond - loss));
  }
  // Apply
  p.credits += credits;
  const levelUps = givePlayerXp(p, xp);
  const robotLevelUps = giveRobotXp(robot, rxp);
  if (levelUps) { const bonus = levelUps * 300; p.credits += bonus; notes.push(`Player level ${p.level}! +${bonus} credits.`); }
  if (robotLevelUps) notes.push(`${robot.name} reached level ${robot.level}. New skill point${robotLevelUps > 1 ? 's' : ''} available.`);
  // Lifetime stats
  const st = p.stats;
  if (ctx.kind !== 'tutorial') {
    st.fights++; if (res.win) { st.wins++; st.classWins[robot.cls] = (st.classWins[robot.cls] || 0) + 1; } else st.losses++;
    if (res.win && (res.method === 'KO' || res.method === 'Finisher')) st.kos++;
    if (res.win && res.method === 'TKO') st.tkos++;
    if (res.win && res.method === 'Decision') st.decisions++;
    if (res.method === 'Finisher' && res.win) st.finishers++;
  }
  st.knockdownsDealt += res.knockdownsDealt; st.knockdownsTaken += res.knockdownsTaken;
  st.dmgDealt += Math.round(res.dmgDealt); st.dmgTaken += Math.round(res.dmgTaken);
  st.hits += res.hits; st.headHits += res.headHits; st.counters += res.counters; st.perfectBlocks += res.perfectBlocks; st.perfectDodges += res.perfectDodges;
  st.bestCombo = Math.max(st.bestCombo, res.bestCombo); st.specials += res.specials; st.partsFound += parts.length;
  // Daily challenge progress
  ensureDaily(p);
  for (const d of p.daily.list) {
    if (d.done) continue;
    const t = DAILY_TEMPLATES.find(x => x.id === d.id)!;
    const add = t.key === 'wins' ? (res.win ? 1 : 0) : t.key === 'kos' ? (res.win && (res.method === 'KO' || res.method === 'Finisher') ? 1 : 0) : ((res as any)[t.key] || 0);
    d.progress = Math.min(t.n, d.progress + add);
    if (d.progress >= t.n) { d.done = true; notes.push('Daily challenge complete: ' + t.text); }
  }
  return { credits, xp, robotXp: rxp, mats, parts, rank, grade: g, levelUps, robotLevelUps, belt, notes, bonusHit };
}

export function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
export function ensureDaily(p: Profile) {
  const k = todayKey();
  if (p.daily.date === k && p.daily.list.length) return;
  const seed = k.split('-').reduce((a, b) => a * 37 + Number(b), 7);
  const r = rng(seed);
  const pool = DAILY_TEMPLATES.slice();
  const list = [];
  for (let i = 0; i < 3; i++) { const t = pool.splice(Math.floor(r() * pool.length), 1)[0]; list.push({ id: t.id, progress: 0, done: false, claimed: false }); }
  p.daily = { date: k, list };
}

/* ---------------- Shop ---------------- */
export interface ShopItem { key: string; kind: 'part' | 'mat'; def?: string; rarity?: Rarity; mat?: keyof Materials; qty?: number; price: number }
export function partPrice(def: string, r: Rarity) { return Math.round(PART_BY_ID[def].price * [1, 1.8, 3.2, 5.5, 9, 15][r]); }
export function shopStock(p: Profile): ShopItem[] {
  const r = rng(p.shop.seed * 7919 + p.level * 31);
  const items: ShopItem[] = [];
  const maxR = Math.min(4, Math.floor(p.level / 4) + 1);
  const pool = PARTS.filter(d => d.unlock <= p.level + 1);
  for (let i = 0; i < 8; i++) {
    const def = pool[Math.floor(r() * pool.length)];
    const rar = Math.min(maxR, rollRarity(Math.min(4, Math.floor(p.level / 5)), r)) as Rarity;
    items.push({ key: `s${i}`, kind: 'part', def: def.id, rarity: rar, price: partPrice(def.id, rar) });
  }
  items.push({ key: 'm1', kind: 'mat', mat: 'scrap', qty: 10, price: 400 });
  items.push({ key: 'm2', kind: 'mat', mat: 'alloy', qty: 5, price: 900 });
  if (p.level >= 8) items.push({ key: 'm3', kind: 'mat', mat: 'circuits', qty: 3, price: 1800 });
  if (p.level >= 15) items.push({ key: 'm4', kind: 'mat', mat: 'quantum', qty: 1, price: 4000 });
  return items;
}
export const SHOP_REFRESH_COST = 150;

/* ---------------- Upgrades ---------------- */
export function upgradeInfo(it: PartItem) {
  if (it.level >= MAX_PART_LEVEL) return null;
  const c = UPGRADE.credits(it.level, it.rarity); const m = UPGRADE.mats(it.level, it.rarity);
  return { credits: c, mat: m.mat, n: m.n };
}
export const MAT_LABEL: Record<keyof Materials, string> = { scrap: 'Scrap', alloy: 'Alloy', circuits: 'Nanocircuits', quantum: 'Quantum Cells' };
export const MAT_COLOR: Record<keyof Materials, string> = { scrap: '#A9B3BF', alloy: '#5BC8FF', circuits: '#B65CFF', quantum: '#FF4F6D' };
/** Materials gained when scrapping a part. */
export function salvage(it: PartItem): { mat: keyof Materials; n: number } {
  const mat = (RARITIES[it.rarity].upMat) as keyof Materials;
  return { mat, n: 1 + Math.floor(it.level / 3) + (it.rarity >= 2 ? 1 : 0) };
}

/* ---------------- Tournament ---------------- */
export function tournamentEntry(tier: number) { return 250 * (tier + 1); }
export function tournamentPrize(tier: number) { return 2200 * (tier + 1) * (tier + 1) * 0.6 + 1500; }
export function newTournament(p: Profile, tier: number) {
  const r = rng(Date.now() & 0xfffffff);
  const pool = OPPONENTS.filter(o => !o.boss && (o.league === tier || o.league === tier - 1)).map(o => o.id);
  const picks: string[] = [];
  while (picks.length < 7 && pool.length) picks.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  while (picks.length < 7) picks.push(leagueOpponents(tier)[picks.length % 5].id);
  const bracket = ['player', ...picks];
  // shuffle
  for (let i = bracket.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [bracket[i], bracket[j]] = [bracket[j], bracket[i]]; }
  p.tournament = { tier, bracket, round: 0, alive: bracket.slice(), results: [] };
}
/** Pairs for the current round, from the alive list. */
export function roundPairs(alive: string[]): [string, string][] { const out: [string, string][] = []; for (let i = 0; i < alive.length; i += 2) out.push([alive[i], alive[i + 1]]); return out; }
export function playerOpponentInRound(p: Profile): string | null {
  const t = p.tournament; if (!t || !t.alive.includes('player')) return null;
  const pair = roundPairs(t.alive).find(pr => pr.includes('player'));
  return pair ? (pair[0] === 'player' ? pair[1] : pair[0]) : null;
}
/** Resolves the round after the player's fight. Returns true if tournament ended. */
export function advanceTournament(p: Profile, playerWon: boolean): { ended: boolean; champion: boolean } {
  const t = p.tournament!; const r = rng(Date.now() & 0xfffff);
  const next: string[] = [];
  for (const [a, b] of roundPairs(t.alive)) {
    let w: string;
    if (a === 'player' || b === 'player') w = playerWon ? 'player' : (a === 'player' ? b : a);
    else { const da = OPP_BY_ID[a].diff + r() * 0.35, db = OPP_BY_ID[b].diff + r() * 0.35; w = da >= db ? a : b; }
    t.results.push({ a, b, w }); next.push(w);
  }
  t.alive = next; t.round++;
  if (!playerWon) return { ended: true, champion: false };
  if (next.length === 1) { p.stats.tournamentsWon++; if (!p.trophies.includes(t.tier)) p.trophies.push(t.tier); return { ended: true, champion: true }; }
  return { ended: false, champion: false };
}
export const ROUND_NAMES = ['Quarterfinal', 'Semifinal', 'Final'];

/* ---------------- Ranking ---------------- */
export function leaderboard(p: Profile) {
  const rows = OPPONENTS.map(o => ({ id: o.id, name: o.name, pts: Math.round(150 + o.league * 420 + o.diff * 400 + (o.boss ? 260 : 0)), league: o.league, player: false }));
  rows.push({ id: 'player', name: activeRobot(p).name + ' (You)', pts: p.rankPts, league: p.career.league, player: true });
  rows.sort((a, b) => b.pts - a.pts);
  return rows;
}

/* ---------------- Career contracts ---------------- */
const BONUSES: { text: string; key: keyof FightResult; n: number }[] = [
  { text: 'Win by knockdowns: score 2', key: 'knockdownsDealt', n: 2 },
  { text: 'Land 4 counters', key: 'counters', n: 4 },
  { text: 'Land 20 head shots', key: 'headHits', n: 20 },
  { text: 'Hit a 6-hit combo', key: 'bestCombo', n: 6 },
  { text: 'Perfect-block 3 attacks', key: 'perfectBlocks', n: 3 },
  { text: 'Land 2 special moves', key: 'specials', n: 2 },
];
export function contractFor(oppId: string) {
  const o = OPP_BY_ID[oppId];
  const b = BONUSES[(oppId.length * 3 + o.league) % BONUSES.length];
  return { purse: LEAGUES[o.league].purse * (o.boss ? 2.5 : 1), bonus: b };
}
export function leagueProgress(p: Profile, league: number) {
  const opps = leagueOpponents(league);
  const beaten = opps.filter(o => p.career.beaten.includes(o.id)).length;
  const boss = leagueBoss(league);
  return { beaten, total: opps.length, bossUnlocked: beaten >= 4, bossBeaten: p.career.beaten.includes(boss.id), boss };
}
