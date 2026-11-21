import type { ClassId, FighterStats } from '../core/types';

type StatKey = 'maxHp' | 'dr' | 'dmgMult' | 'atkSpeed' | 'moveMult' | 'staminaMax' | 'staminaRegen' | 'heatGen' | 'heatDiss' | 'crit' | 'poiseMax' | 'counterMult' | 'specialGain' | 'blockEff' | 'dodgeCost' | 'specialMult' | 'cdMult';
export interface Mod { key: StatKey; mul?: number; add?: number }

export interface SkillNode { id: string; name: string; desc: string; tier: 1 | 2 | 3; max: number; req?: string; mods?: Mod[]; unlockB?: boolean }

export interface ClassDef {
  id: ClassId; name: string; tag: string; desc: string; color: string;
  mods: Mod[]; abilityA: string; abilityB: string; special: string;
  frame: { primary: string; secondary: string; accent: string; glow: string };
  starter: Record<string, string>; skills: SkillNode[]; price: number; unlock: number;
}

const S = (id: string, name: string, desc: string, tier: 1 | 2 | 3, max: number, mods?: Mod[], req?: string, unlockB?: boolean): SkillNode => ({ id, name, desc, tier, max, mods, req, unlockB });

export const CLASSES: Record<ClassId, ClassDef> = {
  boxer: {
    id: 'boxer', name: 'Boxer', tag: 'Speed and counters', color: '#3FA2FF', price: 0, unlock: 1,
    desc: 'Fast hands, long combinations and lethal counterpunches. Rewards timing.',
    mods: [{ key: 'atkSpeed', mul: 1.12 }, { key: 'counterMult', add: 0.3 }, { key: 'staminaRegen', mul: 1.1 }],
    abilityA: 'flurry', abilityB: 'counterStance', special: 'thunderRush',
    frame: { primary: '#2F6FD6', secondary: '#2A2F3A', accent: '#F2C14E', glow: '#4FD8FF' },
    starter: { head: 'h_visor', torso: 't_striker', arm: 'a_piston', fore: 'f_gauntlet', hand: 'k_fist', legs: 'l_strider', feet: 'ft_anchor', core: 'c_fusion', plating: 'p_steel', hydraulics: 'y_hx', cooling: 'o_fan' },
    skills: [
      S('bx_hands', 'Fast Hands', '+4% attack speed per rank.', 1, 3, [{ key: 'atkSpeed', mul: 1.04 }]),
      S('bx_lungs', 'Iron Lungs', '+8% stamina regeneration per rank.', 1, 3, [{ key: 'staminaRegen', mul: 1.08 }]),
      S('bx_counter', 'Counter Stance', 'Unlocks ability 2: a parry stance that answers the next hit with a counter.', 2, 1, undefined, 'bx_hands', true),
      S('bx_timing', 'Ring Timing', '+15% counter damage per rank.', 2, 3, [{ key: 'counterMult', add: 0.15 }], 'bx_lungs'),
      S('bx_rush', 'Thunder Rush+', '+12% special damage per rank.', 3, 3, [{ key: 'specialMult', mul: 1.12 }], 'bx_counter'),
      S('bx_champ', "Champion's Rhythm", '+5% damage and +2% crit per rank.', 3, 3, [{ key: 'dmgMult', mul: 1.05 }, { key: 'crit', add: 0.02 }], 'bx_timing'),
    ],
  },
  bruiser: {
    id: 'bruiser', name: 'Bruiser', tag: 'Power and health', color: '#FF6A3D', price: 2500, unlock: 3,
    desc: 'Heavy armor and devastating haymakers. Takes a punch to land a bigger one.',
    mods: [{ key: 'dmgMult', mul: 1.12 }, { key: 'maxHp', mul: 1.1 }, { key: 'poiseMax', mul: 1.15 }, { key: 'moveMult', mul: 0.95 }],
    abilityA: 'haymaker', abilityB: 'ironWill', special: 'wreckingBall',
    frame: { primary: '#C8432B', secondary: '#33302E', accent: '#E8B23A', glow: '#FF8A3D' },
    starter: { head: 'h_dome', torso: 't_behemoth', arm: 'a_titan', fore: 'f_ram', hand: 'k_mace', legs: 'l_strider', feet: 'ft_anchor', core: 'c_fusion', plating: 'p_steel', hydraulics: 'y_hx', cooling: 'o_fan' },
    skills: [
      S('br_mass', 'Dead Weight', '+5% health per rank.', 1, 3, [{ key: 'maxHp', mul: 1.05 }]),
      S('br_power', 'Sledge Arms', '+5% damage per rank.', 1, 3, [{ key: 'dmgMult', mul: 1.05 }]),
      S('br_will', 'Iron Will', 'Unlocks ability 2: shrug off stagger and take less damage for 5 seconds.', 2, 1, undefined, 'br_mass', true),
      S('br_poise', 'Unshakable', '+12% poise per rank.', 2, 3, [{ key: 'poiseMax', mul: 1.12 }], 'br_power'),
      S('br_wreck', 'Wrecking Ball+', '+12% special damage per rank.', 3, 3, [{ key: 'specialMult', mul: 1.12 }], 'br_will'),
      S('br_rage', 'Scrapyard Fury', '+2% damage reduction per rank.', 3, 3, [{ key: 'dr', add: 0.02 }], 'br_poise'),
    ],
  },
  assassin: {
    id: 'assassin', name: 'Assassin', tag: 'Evasion and crits', color: '#B65CFF', price: 4000, unlock: 5,
    desc: 'Darting footwork, slippery dodges and critical strikes from impossible angles.',
    mods: [{ key: 'moveMult', mul: 1.15 }, { key: 'crit', add: 0.06 }, { key: 'dodgeCost', mul: 0.7 }, { key: 'maxHp', mul: 0.9 }],
    abilityA: 'blinkStrike', abilityB: 'phaseShift', special: 'shadowBarrage',
    frame: { primary: '#2B2B36', secondary: '#121218', accent: '#B65CFF', glow: '#D27CFF' },
    starter: { head: 'h_blade', torso: 't_wraith', arm: 'a_whip', fore: 'f_edge', hand: 'k_talon', legs: 'l_sprint', feet: 'ft_talon', core: 'c_fusion', plating: 'p_comp', hydraulics: 'y_hx', cooling: 'o_fan' },
    skills: [
      S('as_feet', 'Ghost Step', '-8% dodge stamina cost per rank.', 1, 3, [{ key: 'dodgeCost', mul: 0.92 }]),
      S('as_crit', 'Weak Points', '+3% crit chance per rank.', 1, 3, [{ key: 'crit', add: 0.03 }]),
      S('as_phase', 'Phase Shift', 'Unlocks ability 2: become untouchable and fast for 1.5 seconds.', 2, 1, undefined, 'as_feet', true),
      S('as_speed', 'Overclock Servos', '+4% move speed per rank.', 2, 3, [{ key: 'moveMult', mul: 1.04 }], 'as_crit'),
      S('as_barrage', 'Shadow Barrage+', '+12% special damage per rank.', 3, 3, [{ key: 'specialMult', mul: 1.12 }], 'as_phase'),
      S('as_lethal', 'Lethal Precision', '+6% damage per rank.', 3, 3, [{ key: 'dmgMult', mul: 1.06 }], 'as_speed'),
    ],
  },
  tank: {
    id: 'tank', name: 'Tank', tag: 'Durability and force', color: '#5BD16A', price: 5500, unlock: 7,
    desc: 'A walking fortress. Slow, but nothing moves it and every blow lands like a car crash.',
    mods: [{ key: 'maxHp', mul: 1.15 }, { key: 'dr', add: 0.05 }, { key: 'moveMult', mul: 0.85 }, { key: 'atkSpeed', mul: 0.92 }, { key: 'poiseMax', mul: 1.35 }],
    abilityA: 'seismicSlam', abilityB: 'fortress', special: 'meteorDrop',
    frame: { primary: '#4E6B3A', secondary: '#2C3326', accent: '#E8C547', glow: '#9CFF6A' },
    starter: { head: 'h_dome', torso: 't_behemoth', arm: 'a_titan', fore: 'f_ram', hand: 'k_mace', legs: 'l_pillar', feet: 'ft_anchor', core: 'c_fusion', plating: 'p_steel', hydraulics: 'y_hx', cooling: 'o_fins' },
    skills: [
      S('tk_hull', 'Reinforced Hull', '+5% health per rank.', 1, 3, [{ key: 'maxHp', mul: 1.05 }]),
      S('tk_guard', 'Wall of Steel', '+8% block efficiency per rank.', 1, 3, [{ key: 'blockEff', add: 0.08 }]),
      S('tk_fort', 'Fortress', 'Unlocks ability 2: an absorb shield that soaks the next big hits.', 2, 1, undefined, 'tk_hull', true),
      S('tk_mass', 'Immovable', '+15% poise per rank.', 2, 3, [{ key: 'poiseMax', mul: 1.15 }], 'tk_guard'),
      S('tk_meteor', 'Meteor Drop+', '+12% special damage per rank.', 3, 3, [{ key: 'specialMult', mul: 1.12 }], 'tk_fort'),
      S('tk_crush', 'Crusher', '+6% damage per rank.', 3, 3, [{ key: 'dmgMult', mul: 1.06 }], 'tk_mass'),
    ],
  },
  engineer: {
    id: 'engineer', name: 'Engineer', tag: 'Gadgets and energy', color: '#2EE6C5', price: 7000, unlock: 9,
    desc: 'Overengineered energy systems, shields and electric gadgets. Outthinks the opponent.',
    mods: [{ key: 'staminaMax', mul: 1.15 }, { key: 'heatDiss', mul: 1.25 }, { key: 'specialGain', mul: 1.2 }, { key: 'cdMult', mul: 0.85 }],
    abilityA: 'shieldDrone', abilityB: 'teslaArc', special: 'overloadBeam',
    frame: { primary: '#D9D4C7', secondary: '#2D3A40', accent: '#2EE6C5', glow: '#2EE6C5' },
    starter: { head: 'h_visor', torso: 't_striker', arm: 'a_piston', fore: 'f_gauntlet', hand: 'k_fist', legs: 'l_strider', feet: 'ft_anchor', core: 'c_fusion', plating: 'p_steel', hydraulics: 'y_hx', cooling: 'o_fan' },
    skills: [
      S('en_cap', 'Capacitors', '+6% max stamina per rank.', 1, 3, [{ key: 'staminaMax', mul: 1.06 }]),
      S('en_cool', 'Heat Exchanger', '+10% cooling per rank.', 1, 3, [{ key: 'heatDiss', mul: 1.1 }]),
      S('en_tesla', 'Tesla Arc', 'Unlocks ability 2: a ranged electric arc that stuns.', 2, 1, undefined, 'en_cap', true),
      S('en_quick', 'Rapid Cycling', '-8% ability cooldowns per rank.', 2, 3, [{ key: 'cdMult', mul: 0.92 }], 'en_cool'),
      S('en_beam', 'Overload Beam+', '+12% special damage per rank.', 3, 3, [{ key: 'specialMult', mul: 1.12 }], 'en_tesla'),
      S('en_flux', 'Flux Dynamo', '+15% special meter gain per rank.', 3, 3, [{ key: 'specialGain', mul: 1.15 }], 'en_quick'),
    ],
  },
};
export const CLASS_IDS: ClassId[] = ['boxer', 'bruiser', 'assassin', 'tank', 'engineer'];

export function applyMods(s: FighterStats, mods: Mod[], times = 1) {
  for (const m of mods) for (let i = 0; i < times; i++) {
    const k = m.key as keyof FighterStats;
    if (m.mul !== undefined) (s[k] as number) *= m.mul;
    if (m.add !== undefined) (s[k] as number) += m.add;
  }
}
