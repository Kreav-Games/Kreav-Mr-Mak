import type { ClassId, PartCat, Rarity } from '../core/types';
import { CLASSES } from './classes';

export type Personality = 'brawler' | 'counter' | 'evasive' | 'tank' | 'combo' | 'tactical';
export const PERSONALITY_LABEL: Record<Personality, string> = {
  brawler: 'Aggressive brawler', counter: 'Defensive counterfighter', evasive: 'Fast evasive fighter',
  tank: 'Heavy tank', combo: 'Combo specialist', tactical: 'Tactical opponent',
};

export interface Opponent {
  id: string; name: string; handler: string; cls: ClassId; pers: Personality; league: number;
  rarity: Rarity; plv: number; diff: number; parts: Partial<Record<PartCat, string>>;
  paint: { primary: string; secondary: string; accent: string; glow: string }; decal: number;
  boss?: { sig: string[]; phases: number; title: string }; rival?: boolean; bio: string;
}

export const LEAGUES = [
  { id: 0, name: 'Underground Fights', short: 'Underground', arena: 'pit', minLevel: 1, purse: 320, color: '#A9B3BF', belt: 'Pit King Belt' },
  { id: 1, name: 'Local League', short: 'Local', arena: 'scrap', minLevel: 4, purse: 650, color: '#5BD16A', belt: 'Regional Belt' },
  { id: 2, name: 'Professional Circuit', short: 'Pro', arena: 'neon', minLevel: 8, purse: 1200, color: '#3FA2FF', belt: 'Circuit Belt' },
  { id: 3, name: 'Elite Championship', short: 'Elite', arena: 'stadium', minLevel: 12, purse: 2100, color: '#B65CFF', belt: 'Elite Belt' },
  { id: 4, name: 'World Championship', short: 'World', arena: 'future', minLevel: 16, purse: 3600, color: '#FFB12E', belt: 'World Title Belt' },
];

const O = (o: Omit<Opponent, 'parts' | 'decal'> & { parts?: Partial<Record<PartCat, string>>; decal?: number }): Opponent => {
  const base = { ...CLASSES[o.cls].starter } as Partial<Record<PartCat, string>>;
  return { decal: (o.name.length * 7) % 6, ...o, parts: { ...base, ...(o.parts || {}) } };
};

export const OPPONENTS: Opponent[] = [
  // League 0 — Underground pit
  O({ id: 'scrapjack', name: 'SCRAPJACK', handler: 'Dusty Malone', cls: 'boxer', pers: 'brawler', league: 0, rarity: 0, plv: 1, diff: 0.12, paint: { primary: '#8A7A5A', secondary: '#3A352C', accent: '#C9A04A', glow: '#FFC24A' }, bio: 'Built from forklift parts. Swings first, thinks never.' }),
  O({ id: 'rivet', name: 'RIVET', handler: 'Big Lou Okafor', cls: 'bruiser', pers: 'tank', league: 0, rarity: 0, plv: 1, diff: 0.16, paint: { primary: '#6B6F73', secondary: '#2D2F31', accent: '#D95A3A', glow: '#FF6A3D' }, bio: 'A demolition bot that learned to take punishment.' }),
  O({ id: 'tinsoldier', name: 'TIN SOLDIER', handler: 'Marco Bell', cls: 'boxer', pers: 'counter', league: 0, rarity: 0, plv: 2, diff: 0.2, paint: { primary: '#B8C3CC', secondary: '#3A4350', accent: '#C83A3A', glow: '#FF4F4F' }, bio: 'Old parade bot. Waits for your mistake.' }),
  O({ id: 'gutterbolt', name: 'GUTTERBOLT', handler: 'Sasha "Wire" Petrova', cls: 'assassin', pers: 'evasive', league: 0, rarity: 0, plv: 2, diff: 0.24, paint: { primary: '#3E4A3A', secondary: '#1C221B', accent: '#9CFF6A', glow: '#9CFF6A' }, bio: 'Slips punches like a sewer rat. Annoying to pin down.' }),
  O({ id: 'vanta1', name: 'VANTA Mk I', handler: 'Kira Vos', cls: 'boxer', pers: 'combo', league: 0, rarity: 1, plv: 2, diff: 0.3, rival: true, paint: { primary: '#15161C', secondary: '#2A2B35', accent: '#E03A5A', glow: '#FF3A6A' }, parts: { head: 'h_mono' }, bio: 'Your rival. Kira Vos has been chasing the same belts as you since day one.' }),
  O({ id: 'rustjaw', name: 'RUSTJAW', handler: 'The Foreman', cls: 'bruiser', pers: 'brawler', league: 0, rarity: 1, plv: 3, diff: 0.32, boss: { sig: ['junkThrow'], phases: 2, title: 'King of the Pit' }, paint: { primary: '#8C4A2A', secondary: '#3A2A20', accent: '#E8B23A', glow: '#FF7A2A' }, parts: { hand: 'k_mace' }, bio: 'Undefeated in the pit for six years. Throws scrap when cornered.' }),
  // League 1 — Local League, scrapyard
  O({ id: 'dustdevil', name: 'DUST DEVIL', handler: 'Rosa Quintero', cls: 'assassin', pers: 'evasive', league: 1, rarity: 1, plv: 3, diff: 0.34, paint: { primary: '#C9A877', secondary: '#4A3A28', accent: '#E85A2A', glow: '#FFB04A' }, bio: 'A desert racer turned fighter. Never where you aim.' }),
  O({ id: 'bulldozer', name: 'BULLDOZER', handler: 'Hank Reyes', cls: 'tank', pers: 'tank', league: 1, rarity: 1, plv: 3, diff: 0.36, paint: { primary: '#E8B23A', secondary: '#2C2A26', accent: '#1C1C1C', glow: '#FFD84A' }, bio: 'Construction chassis. Pushes you into the fence and keeps pushing.' }),
  O({ id: 'sparkplug', name: 'SPARKPLUG', handler: 'Dr. Ines Kahale', cls: 'engineer', pers: 'tactical', league: 1, rarity: 1, plv: 4, diff: 0.4, paint: { primary: '#E6E1D6', secondary: '#2D3A40', accent: '#2EE6C5', glow: '#2EE6C5' }, parts: { weapon: 'w_shock' }, bio: 'University project with a mean shock jab.' }),
  O({ id: 'hank', name: 'HAYMAKER', handler: 'Jo "Two-Tons" Brandt', cls: 'bruiser', pers: 'brawler', league: 1, rarity: 1, plv: 4, diff: 0.42, paint: { primary: '#7A2A2A', secondary: '#2A1A1A', accent: '#F2E2C2', glow: '#FF5A3A' }, bio: 'One punch. That is the whole plan, and it usually works.' }),
  O({ id: 'vanta2', name: 'VANTA Mk II', handler: 'Kira Vos', cls: 'boxer', pers: 'combo', league: 1, rarity: 2, plv: 4, diff: 0.46, rival: true, paint: { primary: '#15161C', secondary: '#2A2B35', accent: '#E03A5A', glow: '#FF3A6A' }, parts: { head: 'h_mono', hand: 'k_arc' }, bio: 'Rebuilt after your last meeting. Kira wants a rematch.' }),
  O({ id: 'magnetar', name: 'MAGNETAR', handler: 'Viktor Hale', cls: 'engineer', pers: 'tactical', league: 1, rarity: 2, plv: 5, diff: 0.48, boss: { sig: ['magPulse', 'teslaArc'], phases: 2, title: 'Lord of the Scrapyard' }, paint: { primary: '#2A3550', secondary: '#151A28', accent: '#6AA8FF', glow: '#6AC8FF' }, parts: { core: 'c_ion', torso: 't_dynamo' }, bio: 'Magnetic field generator in a fighting frame. Pulls scrap and opponents alike.' }),
  // League 2 — Pro Circuit, neon arena
  O({ id: 'neonfang', name: 'NEON FANG', handler: 'Akira Doumbia', cls: 'assassin', pers: 'combo', league: 2, rarity: 2, plv: 5, diff: 0.5, paint: { primary: '#1A1A2A', secondary: '#0E0E16', accent: '#FF3AC8', glow: '#FF3AC8' }, parts: { weapon: 'w_saw' }, bio: 'Street-fight favorite with six-hit strings.' }),
  O({ id: 'chromefist', name: 'CHROMEFIST', handler: 'Lena Sorensen', cls: 'boxer', pers: 'counter', league: 2, rarity: 2, plv: 5, diff: 0.54, paint: { primary: '#C8D0D8', secondary: '#4A525A', accent: '#3FA2FF', glow: '#4FD8FF' }, parts: { hydraulics: 'y_mag' }, bio: 'Mirror-polished counterpuncher. Punishes every whiff.' }),
  O({ id: 'gridlock', name: 'GRIDLOCK', handler: 'Omar Haddad', cls: 'tank', pers: 'tactical', league: 2, rarity: 2, plv: 6, diff: 0.56, paint: { primary: '#3A4A5A', secondary: '#1A222A', accent: '#FFD84A', glow: '#FFD84A' }, parts: { torso: 't_bastion', plating: 'p_react' }, bio: 'Traffic-control tank. Cuts off the ring methodically.' }),
  O({ id: 'voltviper', name: 'VOLT VIPER', handler: 'Mei Lin Zhou', cls: 'engineer', pers: 'evasive', league: 2, rarity: 2, plv: 6, diff: 0.58, paint: { primary: '#1E3A2E', secondary: '#0E1A14', accent: '#9CFF3A', glow: '#9CFF3A' }, parts: { fore: 'f_coil' }, bio: 'Keeps distance and zaps from range.' }),
  O({ id: 'vanta3', name: 'VANTA Mk III', handler: 'Kira Vos', cls: 'assassin', pers: 'combo', league: 2, rarity: 3, plv: 6, diff: 0.62, rival: true, paint: { primary: '#15161C', secondary: '#2A2B35', accent: '#E03A5A', glow: '#FF3A6A' }, parts: { head: 'h_mono', weapon: 'w_saw' }, bio: 'Kira switched to an assassin frame just to beat you.' }),
  O({ id: 'hammerfall', name: 'HAMMERFALL', handler: 'Gunnar Eklund', cls: 'tank', pers: 'tank', league: 2, rarity: 3, plv: 7, diff: 0.64, boss: { sig: ['quakeSlam', 'pistonRam'], phases: 2, title: 'The Neon Colossus' }, paint: { primary: '#5A5A64', secondary: '#24242A', accent: '#FF8A2A', glow: '#FF8A2A' }, parts: { torso: 't_bastion', weapon: 'w_ram' }, bio: 'Three tons of pile-driver. Its slams shake the whole arena.' }),
  // League 3 — Elite, stadium
  O({ id: 'atlas', name: 'ATLAS PRIME', handler: 'Celeste Moreau', cls: 'bruiser', pers: 'tactical', league: 3, rarity: 3, plv: 7, diff: 0.66, paint: { primary: '#E8E2D0', secondary: '#3A3A3A', accent: '#D4AF37', glow: '#FFE08A' }, parts: { core: 'c_plasma', hydraulics: 'y_over' }, bio: 'A corporate flagship. Expensive, precise, relentless.' }),
  O({ id: 'razorwire', name: 'RAZORWIRE', handler: 'Dex Kowalski', cls: 'assassin', pers: 'combo', league: 3, rarity: 3, plv: 8, diff: 0.7, paint: { primary: '#3A3A44', secondary: '#16161C', accent: '#FF2A2A', glow: '#FF2A2A' }, parts: { weapon: 'w_saw', hand: 'k_talon' }, bio: 'Barbed edges everywhere. Bleeds opponents dry.' }),
  O({ id: 'arclight', name: 'ARCLIGHT', handler: 'Prof. Anika Rao', cls: 'engineer', pers: 'counter', league: 3, rarity: 3, plv: 8, diff: 0.72, paint: { primary: '#F2F4F8', secondary: '#2A3A5A', accent: '#4F8CFF', glow: '#8AB8FF' }, parts: { core: 'c_ion', weapon: 'w_rocket', head: 'h_crown' }, bio: 'Calculates your next move before you make it.' }),
  O({ id: 'juggernaut', name: 'JUGGERNAUT', handler: 'Tomasz Wolak', cls: 'tank', pers: 'brawler', league: 3, rarity: 3, plv: 8, diff: 0.73, paint: { primary: '#2A3A2A', secondary: '#121812', accent: '#C83A3A', glow: '#FF4A3A' }, parts: { torso: 't_bastion', weapon: 'w_flame' }, bio: 'Walks through punches like rain.' }),
  O({ id: 'vanta4', name: 'VANTA Mk IV', handler: 'Kira Vos', cls: 'boxer', pers: 'combo', league: 3, rarity: 4, plv: 8, diff: 0.76, rival: true, paint: { primary: '#15161C', secondary: '#2A2B35', accent: '#E03A5A', glow: '#FF3A6A' }, parts: { head: 'h_mono', hand: 'k_arc', core: 'c_ion', hydraulics: 'y_mag' }, bio: 'Back to boxing, with a championship-grade core.' }),
  O({ id: 'spectre', name: 'SPECTRE-X', handler: 'Unknown', cls: 'assassin', pers: 'evasive', league: 3, rarity: 4, plv: 9, diff: 0.78, boss: { sig: ['phantomDash', 'blinkStrike'], phases: 3, title: 'The Phantom Champion' }, paint: { primary: '#E6E8F0', secondary: '#1A1A24', accent: '#7A5CFF', glow: '#B8A4FF' }, parts: { head: 'h_blade', core: 'c_void' }, bio: 'No one knows who built it. It teleports between blows.' }),
  // League 4 — World, future arena
  O({ id: 'obsidian', name: 'OBSIDIAN', handler: 'Malik Okonkwo', cls: 'boxer', pers: 'counter', league: 4, rarity: 4, plv: 9, diff: 0.8, paint: { primary: '#111114', secondary: '#26262C', accent: '#FFB12E', glow: '#FFB12E' }, parts: { hydraulics: 'y_mag', core: 'c_ion', head: 'h_mono' }, bio: 'Black glass and perfect defense.' }),
  O({ id: 'supernova', name: 'SUPERNOVA', handler: 'Ivy Castellanos', cls: 'engineer', pers: 'tactical', league: 4, rarity: 4, plv: 9, diff: 0.82, paint: { primary: '#FFF0D8', secondary: '#3A2A1A', accent: '#FF7A1A', glow: '#FFB04A' }, parts: { core: 'c_void', weapon: 'w_rocket', torso: 't_dynamo' }, bio: 'Burns brighter every round.' }),
  O({ id: 'warlord', name: 'WARLORD', handler: 'General Stavros', cls: 'bruiser', pers: 'brawler', league: 4, rarity: 4, plv: 10, diff: 0.84, paint: { primary: '#4A3A2A', secondary: '#1E1812', accent: '#E8C547', glow: '#FF5A2A' }, parts: { hydraulics: 'y_over', core: 'c_plasma', weapon: 'w_ram' }, bio: 'A military prototype that never stopped fighting.' }),
  O({ id: 'helix', name: 'HELIX', handler: 'Nadia Farouk', cls: 'assassin', pers: 'evasive', league: 4, rarity: 4, plv: 10, diff: 0.86, paint: { primary: '#2AE6B4', secondary: '#0E2A24', accent: '#FFFFFF', glow: '#7CFFEA' }, parts: { head: 'h_blade', weapon: 'w_saw', core: 'c_ion' }, bio: 'Spirals around opponents in a double-helix dance.' }),
  O({ id: 'vanta5', name: 'VANTA OMEGA', handler: 'Kira Vos', cls: 'boxer', pers: 'combo', league: 4, rarity: 5, plv: 10, diff: 0.9, rival: true, paint: { primary: '#0A0A0E', secondary: '#24242C', accent: '#FF2A5A', glow: '#FF2A5A' }, parts: { head: 'h_crown', hand: 'k_arc', core: 'c_void', hydraulics: 'y_mag', torso: 't_striker' }, bio: 'The final form of your oldest rival. Win this and Kira finally respects you.' }),
  O({ id: 'omega', name: 'OMEGA TITAN', handler: 'Helios Dynamics', cls: 'tank', pers: 'tactical', league: 4, rarity: 5, plv: 10, diff: 0.92, boss: { sig: ['missileBarrage', 'quakeSlam', 'magPulse'], phases: 3, title: 'World Champion' }, paint: { primary: '#D8DCE4', secondary: '#20242C', accent: '#FFB12E', glow: '#FFD06A' }, parts: { torso: 't_bastion', core: 'c_void', plating: 'p_ceram', head: 'h_crown', weapon: 'w_rocket', cooling: 'o_cryo' }, bio: 'The reigning world champion. Three combat modes, never beaten.' }),
];
export const OPP_BY_ID: Record<string, Opponent> = Object.fromEntries(OPPONENTS.map(o => [o.id, o]));
export const leagueOpponents = (l: number) => OPPONENTS.filter(o => o.league === l && !o.boss);
export const leagueBoss = (l: number) => OPPONENTS.find(o => o.league === l && o.boss)!;

export const DUMMY: Opponent = O({ id: 'dummy', name: 'TRAINING BOT', handler: 'Gym', cls: 'boxer', pers: 'counter', league: 0, rarity: 0, plv: 1, diff: 0, paint: { primary: '#E8C547', secondary: '#2A2A2A', accent: '#1A1A1A', glow: '#FFD84A' }, bio: 'Sparring partner.' });

export interface Challenge { id: string; name: string; desc: string; league: number; opp: string; mods: ChallengeMods; reward: { credits: number; rarity: Rarity } }
export interface ChallengeMods { dmg?: number; heat?: number; playerHp?: number; enemyHp?: number; speed?: number; rounds?: number; noBlock?: boolean; enemyDiff?: number }
export const CHALLENGES: Challenge[] = [
  { id: 'ch_glass', name: 'Glass Cannons', desc: 'Everyone deals double damage. One clean combo ends it.', league: 0, opp: 'gutterbolt', mods: { dmg: 2 }, reward: { credits: 700, rarity: 2 } },
  { id: 'ch_heat', name: 'Heatwave', desc: 'Heat builds twice as fast. Manage your cooling or burn out.', league: 1, opp: 'hank', mods: { heat: 2 }, reward: { credits: 1100, rarity: 2 } },
  { id: 'ch_underdog', name: 'Underdog', desc: 'You start at 55% health against a full-health opponent.', league: 1, opp: 'bulldozer', mods: { playerHp: 0.55 }, reward: { credits: 1300, rarity: 3 } },
  { id: 'ch_overclock', name: 'Overclock', desc: 'Both robots run 30% faster. Pure reflexes.', league: 2, opp: 'neonfang', mods: { speed: 1.3 }, reward: { credits: 1800, rarity: 3 } },
  { id: 'ch_noguard', name: 'No Guard', desc: 'Blocking is disabled. Dodge or get hit.', league: 2, opp: 'chromefist', mods: { noBlock: true }, reward: { credits: 2200, rarity: 3 } },
  { id: 'ch_marathon', name: 'Iron Marathon', desc: 'One long 3-minute round against a hardened tank with 150% health.', league: 3, opp: 'juggernaut', mods: { rounds: 1, enemyHp: 1.5 }, reward: { credits: 3200, rarity: 4 } },
  { id: 'ch_nightmare', name: 'Nightmare Mode', desc: 'Your rival at maximum aggression and reaction speed.', league: 4, opp: 'vanta5', mods: { enemyDiff: 1, dmg: 1.2 }, reward: { credits: 6000, rarity: 5 } },
];

export const DAILY_TEMPLATES = [
  { id: 'd_win2', text: 'Win 2 fights', key: 'wins', n: 2, reward: 600 },
  { id: 'd_hits', text: 'Land 60 hits', key: 'hits', n: 60, reward: 500 },
  { id: 'd_counter', text: 'Land 6 counterattacks', key: 'counters', n: 6, reward: 650 },
  { id: 'd_pblock', text: 'Perfect-block 5 attacks', key: 'perfectBlocks', n: 5, reward: 650 },
  { id: 'd_ko', text: 'Win a fight by knockout', key: 'kos', n: 1, reward: 700 },
  { id: 'd_dmg', text: 'Deal 4,000 damage', key: 'dmgDealt', n: 4000, reward: 600 },
  { id: 'd_kd', text: 'Score 3 knockdowns', key: 'knockdownsDealt', n: 3, reward: 650 },
  { id: 'd_special', text: 'Land 3 special moves', key: 'specials', n: 3, reward: 600 },
  { id: 'd_head', text: 'Land 25 head shots', key: 'headHits', n: 25, reward: 550 },
  { id: 'd_pdodge', text: 'Perfect-dodge 4 attacks', key: 'perfectDodges', n: 4, reward: 650 },
];
