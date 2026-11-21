// Shared, serialisable game types. Everything here is plain data so it can be
// saved locally and, later, sent over a network without conversion.

export type ClassId = 'boxer' | 'bruiser' | 'assassin' | 'tank' | 'engineer';
export type Rarity = 0 | 1 | 2 | 3 | 4 | 5;
export type SlotId =
  | 'head' | 'torso' | 'armL' | 'armR' | 'foreL' | 'foreR' | 'handL' | 'handR'
  | 'legs' | 'feet' | 'core' | 'plating' | 'hydraulics' | 'cooling' | 'weapon';
export type PartCat =
  | 'head' | 'torso' | 'arm' | 'fore' | 'hand' | 'legs' | 'feet'
  | 'core' | 'plating' | 'hydraulics' | 'cooling' | 'weapon';
export type Zone = 'head' | 'torso' | 'arms' | 'legs';

export interface StatBlock {
  hp: number; armor: number; weight: number; power: number; atkSpd: number;
  moveSpd: number; energy: number; heat: number; cooling: number; durability: number; crit: number;
}
export const STAT_KEYS: (keyof StatBlock)[] = ['hp', 'armor', 'weight', 'power', 'atkSpd', 'moveSpd', 'energy', 'heat', 'cooling', 'durability', 'crit'];
export const STAT_LABEL: Record<keyof StatBlock, string> = {
  hp: 'Health', armor: 'Armor', weight: 'Weight', power: 'Attack Power', atkSpd: 'Attack Speed', moveSpd: 'Move Speed',
  energy: 'Energy', heat: 'Heat Gen', cooling: 'Cooling', durability: 'Durability', crit: 'Crit %',
};
/** Stats where lower is better (for comparisons). */
export const LOWER_BETTER: (keyof StatBlock)[] = ['weight', 'heat'];

export interface PartItem { uid: string; def: string; rarity: Rarity; level: number; cond: number; }
export type Loadout = Partial<Record<SlotId, string>>; // slot -> part uid

export interface Paint { primary: string; secondary: string; accent: string; glow: string; }

export interface RobotFrame {
  id: string; name: string; cls: ClassId; level: number; xp: number;
  skills: Record<string, number>;
  builds: Loadout[]; activeBuild: number;
  paint: Paint; slotPaint: Partial<Record<SlotId, string>>; decal: number;
}

export interface Materials { scrap: number; alloy: number; circuits: number; quantum: number; }

export interface LifetimeStats {
  fights: number; wins: number; losses: number; kos: number; tkos: number; decisions: number;
  knockdownsDealt: number; knockdownsTaken: number; dmgDealt: number; dmgTaken: number;
  hits: number; headHits: number; counters: number; perfectBlocks: number; perfectDodges: number;
  bestCombo: number; finishers: number; specials: number; playSeconds: number; partsFound: number;
  tournamentsWon: number; classWins: Record<string, number>;
}

export interface DailyState { date: string; list: { id: string; progress: number; done: boolean; claimed: boolean }[]; }

export interface TournamentState {
  tier: number; bracket: string[]; // 8 fighter ids, 'player' included
  round: number; alive: string[]; results: { a: string; b: string; w: string }[];
}

export interface Profile {
  v: number; name: string; credits: number; xp: number; level: number; rankPts: number;
  mats: Materials; parts: PartItem[]; robots: RobotFrame[]; activeRobot: string;
  career: { league: number; beaten: string[]; belts: number[] };
  challengesDone: string[]; tournament: TournamentState | null; trophies: number[];
  shop: { seed: number; refreshAt: number; bought: string[] };
  daily: DailyState; stats: LifetimeStats;
  settings: Settings; tutorialDone: boolean; nextUid: number;
}

export interface Settings {
  master: number; music: number; sfx: number; quality: 'low' | 'medium' | 'high';
  sens: number; invertY: boolean; shake: boolean; touch: 'auto' | 'on' | 'off'; showHints: boolean;
}

/** Final numbers a fighter uses in combat, derived from a build. */
export interface FighterStats {
  maxHp: number; dr: number; dmgMult: number; atkSpeed: number; moveMult: number;
  staminaMax: number; staminaRegen: number; heatGen: number; heatDiss: number; crit: number;
  poiseMax: number; counterMult: number; specialGain: number; blockEff: number; dodgeCost: number;
  weight: number; abilityB: boolean; specialMult: number; cdMult: number; raw: StatBlock;
}

/** One tick of player or AI intent. Network-ready: plain booleans and numbers. */
export interface InputFrame {
  mx: number; mz: number; // strafe right / forward toward opponent, -1..1
  light: boolean; heavy: boolean; heavyHeld: boolean; block: boolean; dodge: boolean;
  special: boolean; taunt: boolean; ab1: boolean; ab2: boolean; ab3: boolean; ab4: boolean;
  mash: boolean;
}
export const emptyInput = (): InputFrame => ({ mx: 0, mz: 0, light: false, heavy: false, heavyHeld: false, block: false, dodge: false, special: false, taunt: false, ab1: false, ab2: false, ab3: false, ab4: false, mash: false });
