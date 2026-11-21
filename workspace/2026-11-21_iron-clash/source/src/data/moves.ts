import type { Zone } from '../core/types';

export type Anim = 'jab' | 'cross' | 'hookL' | 'hookR' | 'upperR' | 'upperL' | 'heavyR' | 'kickL' | 'slam' | 'shootR' | 'shootB'
  | 'lunge' | 'taunt' | 'vent' | 'buff' | 'spin' | 'finisher' | 'leap';
export type Effect = 'shock' | 'bleed' | 'burn' | 'shield' | 'ironwill' | 'phase' | 'counter' | 'fortress' | 'purge' | 'teleport' | 'blink';

export interface MoveDef {
  id: string; name: string; anim: Anim; hand: 'L' | 'R' | 'B' | 'F';
  startup: number; active: number; recovery: number;
  dmg: number; stam: number; heat: number; reach: number; zone: Zone;
  kb: number; poise: number; stun?: number; guardBreak?: boolean; knockdown?: boolean;
  kind: 'light' | 'heavy' | 'ability' | 'special' | 'boss' | 'finisher';
  lunge: number; chargeable?: boolean; unblockable?: boolean;
  projectile?: { speed: number; range: number; size: number; color: string; count?: number };
  aoe?: number; effect?: Effect; seq?: string[]; seqSpeed?: number; buffTime?: number; cd?: number;
}

const M = (o: Partial<MoveDef> & Pick<MoveDef, 'id' | 'name' | 'anim'>): MoveDef => ({
  hand: 'R', startup: 0.2, active: 0.1, recovery: 0.3, dmg: 0, stam: 0, heat: 0, reach: 2.1, zone: 'torso', kb: 0.2, poise: 10, kind: 'light', lunge: 0.1, ...o,
});

export const MOVES: Record<string, MoveDef> = {};
const add = (m: MoveDef) => { MOVES[m.id] = m; };

// Core strikes
add(M({ id: 'jab', name: 'Jab', anim: 'jab', hand: 'L', startup: 0.12, active: 0.08, recovery: 0.2, dmg: 28, stam: 6, heat: 3, reach: 2.15, zone: 'head', kb: 0.12, poise: 8, lunge: 0.15 }));
add(M({ id: 'cross', name: 'Cross', anim: 'cross', hand: 'R', startup: 0.15, active: 0.08, recovery: 0.26, dmg: 38, stam: 9, heat: 4, reach: 2.2, zone: 'torso', kb: 0.2, poise: 12, lunge: 0.25 }));
add(M({ id: 'hookL', name: 'Left Hook', anim: 'hookL', hand: 'L', startup: 0.2, active: 0.1, recovery: 0.32, dmg: 48, stam: 12, heat: 6, reach: 1.95, zone: 'head', kb: 0.3, poise: 18, lunge: 0.15 }));
add(M({ id: 'hookR', name: 'Right Hook', anim: 'hookR', hand: 'R', startup: 0.22, active: 0.1, recovery: 0.34, dmg: 50, stam: 12, heat: 6, reach: 1.95, zone: 'head', kb: 0.3, poise: 18, lunge: 0.15, kind: 'heavy' }));
add(M({ id: 'upperR', name: 'Uppercut', anim: 'upperR', hand: 'R', startup: 0.26, active: 0.1, recovery: 0.38, dmg: 56, stam: 14, heat: 7, reach: 1.85, zone: 'head', kb: 0.45, poise: 26, lunge: 0.2 }));
add(M({ id: 'upperH', name: 'Rising Uppercut', anim: 'upperR', hand: 'R', startup: 0.3, active: 0.1, recovery: 0.42, dmg: 62, stam: 16, heat: 9, reach: 1.9, zone: 'head', kb: 0.55, poise: 30, lunge: 0.25, kind: 'heavy', chargeable: true }));
add(M({ id: 'heavy', name: 'Heavy Straight', anim: 'heavyR', hand: 'R', startup: 0.36, active: 0.12, recovery: 0.48, dmg: 66, stam: 20, heat: 12, reach: 2.3, zone: 'torso', kb: 0.9, poise: 34, lunge: 0.45, kind: 'heavy', chargeable: true }));
add(M({ id: 'hookH', name: 'Power Hook', anim: 'hookR', hand: 'R', startup: 0.3, active: 0.1, recovery: 0.44, dmg: 60, stam: 16, heat: 9, reach: 2.0, zone: 'head', kb: 0.5, poise: 28, lunge: 0.2, kind: 'heavy', chargeable: true }));
add(M({ id: 'hookHL', name: 'Power Hook', anim: 'hookL', hand: 'L', startup: 0.3, active: 0.1, recovery: 0.44, dmg: 60, stam: 16, heat: 9, reach: 2.0, zone: 'head', kb: 0.5, poise: 28, lunge: 0.2, kind: 'heavy', chargeable: true }));
add(M({ id: 'kick', name: 'Low Kick', anim: 'kickL', hand: 'F', startup: 0.24, active: 0.1, recovery: 0.4, dmg: 42, stam: 12, heat: 6, reach: 2.05, zone: 'legs', kb: 0.15, poise: 16, lunge: 0.1, kind: 'heavy' }));
add(M({ id: 'counterPunch', name: 'Counter', anim: 'cross', hand: 'R', startup: 0.08, active: 0.08, recovery: 0.24, dmg: 52, stam: 6, heat: 3, reach: 2.3, zone: 'head', kb: 0.5, poise: 30, lunge: 0.35 }));
add(M({ id: 'taunt', name: 'Taunt', anim: 'taunt', hand: 'B', startup: 0.3, active: 0.6, recovery: 0.3, reach: 0, stam: 0, kind: 'ability', lunge: 0 }));

// Class abilities
add(M({ id: 'flurry', name: 'Flurry', anim: 'jab', kind: 'ability', seq: ['jab', 'cross', 'jab', 'cross', 'hookL'], seqSpeed: 1.6, stam: 18, heat: 10, cd: 8 }));
add(M({ id: 'counterStance', name: 'Counter Stance', anim: 'buff', kind: 'ability', effect: 'counter', buffTime: 1.4, startup: 0.1, active: 0.1, recovery: 0.1, cd: 12 }));
add(M({ id: 'haymaker', name: 'Haymaker', anim: 'heavyR', kind: 'ability', startup: 0.55, active: 0.14, recovery: 0.55, dmg: 110, stam: 24, heat: 16, reach: 2.4, zone: 'head', kb: 1.8, poise: 60, lunge: 0.6, guardBreak: true, cd: 9 }));
add(M({ id: 'ironWill', name: 'Iron Will', anim: 'buff', kind: 'ability', effect: 'ironwill', buffTime: 5, startup: 0.2, active: 0.1, recovery: 0.2, cd: 16 }));
add(M({ id: 'blinkStrike', name: 'Blink Strike', anim: 'lunge', kind: 'ability', effect: 'blink', startup: 0.12, active: 0.1, recovery: 0.3, dmg: 70, stam: 14, heat: 8, reach: 5.5, zone: 'head', kb: 0.4, poise: 26, lunge: 0, cd: 8 }));
add(M({ id: 'phaseShift', name: 'Phase Shift', anim: 'buff', kind: 'ability', effect: 'phase', buffTime: 1.5, startup: 0.05, active: 0.05, recovery: 0.05, cd: 14 }));
add(M({ id: 'seismicSlam', name: 'Seismic Slam', anim: 'slam', hand: 'B', kind: 'ability', startup: 0.5, active: 0.12, recovery: 0.6, dmg: 70, stam: 22, heat: 14, reach: 3.4, aoe: 3.4, zone: 'legs', kb: 1.2, poise: 50, knockdown: true, lunge: 0.1, cd: 10 }));
add(M({ id: 'fortress', name: 'Fortress', anim: 'buff', kind: 'ability', effect: 'fortress', buffTime: 6, startup: 0.2, active: 0.1, recovery: 0.2, cd: 16 }));
add(M({ id: 'shieldDrone', name: 'Shield Drone', anim: 'buff', kind: 'ability', effect: 'shield', buffTime: 8, startup: 0.2, active: 0.1, recovery: 0.2, cd: 12 }));
add(M({ id: 'teslaArc', name: 'Tesla Arc', anim: 'shootR', kind: 'ability', effect: 'shock', startup: 0.3, active: 0.1, recovery: 0.4, dmg: 40, stam: 14, heat: 12, reach: 12, zone: 'torso', kb: 0.2, poise: 20, stun: 0.9, lunge: 0, projectile: { speed: 22, range: 12, size: 0.35, color: '#7FE8FF' }, cd: 10 }));

// Weapon abilities (slot 3)
add(M({ id: 'pistonRam', name: 'Piston Ram', anim: 'heavyR', kind: 'ability', startup: 0.34, active: 0.12, recovery: 0.5, dmg: 78, stam: 18, heat: 14, reach: 2.4, zone: 'torso', kb: 2.6, poise: 45, lunge: 0.4, cd: 10 }));
add(M({ id: 'shockJab', name: 'Shock Jab', anim: 'jab', hand: 'L', kind: 'ability', effect: 'shock', startup: 0.14, active: 0.1, recovery: 0.3, dmg: 40, stam: 12, heat: 8, reach: 2.25, zone: 'head', kb: 0.2, poise: 20, stun: 1.0, lunge: 0.25, cd: 10 }));
add(M({ id: 'sawSlash', name: 'Saw Slash', anim: 'hookR', kind: 'ability', effect: 'bleed', startup: 0.22, active: 0.12, recovery: 0.38, dmg: 44, stam: 12, heat: 9, reach: 2.05, zone: 'torso', kb: 0.3, poise: 18, lunge: 0.2, cd: 10 }));
add(M({ id: 'flameBurst', name: 'Flame Burst', anim: 'shootB', hand: 'B', kind: 'ability', effect: 'burn', startup: 0.3, active: 0.4, recovery: 0.4, dmg: 34, stam: 12, heat: 18, reach: 2.8, zone: 'torso', kb: 0.4, poise: 14, lunge: 0, cd: 10 }));
add(M({ id: 'rocketFist', name: 'Rocket Fist', anim: 'shootR', kind: 'ability', startup: 0.34, active: 0.1, recovery: 0.5, dmg: 64, stam: 16, heat: 14, reach: 14, zone: 'torso', kb: 1.4, poise: 34, lunge: 0, projectile: { speed: 18, range: 14, size: 0.35, color: '#FF9A3D' }, cd: 11 }));
add(M({ id: 'purge', name: 'Coolant Purge', anim: 'vent', hand: 'B', kind: 'ability', effect: 'purge', startup: 0.15, active: 0.4, recovery: 0.2, reach: 0, cd: 20 }));

// Specials (Q, full meter)
add(M({ id: 'thunderRush', name: 'Thunder Rush', anim: 'jab', kind: 'special', seq: ['jab', 'cross', 'hookL', 'hookR', 'upperR'], seqSpeed: 1.7, unblockable: true }));
add(M({ id: 'wreckingBall', name: 'Wrecking Ball', anim: 'heavyR', kind: 'special', startup: 0.6, active: 0.16, recovery: 0.6, dmg: 170, reach: 2.6, zone: 'head', kb: 3.2, poise: 100, knockdown: true, unblockable: true, lunge: 0.9 }));
add(M({ id: 'shadowBarrage', name: 'Shadow Barrage', anim: 'lunge', kind: 'special', effect: 'blink', seq: ['jab', 'hookR', 'hookL', 'cross', 'upperR', 'hookR'], seqSpeed: 2.0, unblockable: true, reach: 6 }));
add(M({ id: 'meteorDrop', name: 'Meteor Drop', anim: 'leap', hand: 'B', kind: 'special', startup: 0.75, active: 0.14, recovery: 0.7, dmg: 150, reach: 3.8, aoe: 3.8, zone: 'head', kb: 2.0, poise: 100, knockdown: true, unblockable: true, lunge: 1.2 }));
add(M({ id: 'overloadBeam', name: 'Overload Beam', anim: 'shootB', hand: 'B', kind: 'special', effect: 'shock', startup: 0.5, active: 0.2, recovery: 0.5, dmg: 140, reach: 16, zone: 'torso', kb: 1.6, poise: 80, stun: 1.2, unblockable: true, lunge: 0, projectile: { speed: 30, range: 16, size: 0.7, color: '#7CFFEA' } }));
add(M({ id: 'finisher', name: 'Finisher', anim: 'finisher', kind: 'finisher', startup: 0.7, active: 0.15, recovery: 1.0, dmg: 9999, reach: 3, zone: 'head', kb: 3.5, poise: 999, knockdown: true, unblockable: true, lunge: 0.6 }));

// Boss signatures
add(M({ id: 'junkThrow', name: 'Junk Throw', anim: 'shootR', kind: 'boss', startup: 0.45, active: 0.1, recovery: 0.4, dmg: 55, reach: 12, zone: 'torso', kb: 0.8, poise: 30, lunge: 0, projectile: { speed: 15, range: 12, size: 0.5, color: '#8A6A4A' } }));
add(M({ id: 'magPulse', name: 'Magnetic Pulse', anim: 'vent', hand: 'B', kind: 'boss', effect: 'shock', startup: 0.6, active: 0.15, recovery: 0.5, dmg: 50, reach: 3.6, aoe: 3.6, zone: 'torso', kb: 1.4, poise: 40, stun: 1.0, unblockable: true, lunge: 0 }));
add(M({ id: 'quakeSlam', name: 'Quake Slam', anim: 'slam', hand: 'B', kind: 'boss', startup: 0.6, active: 0.14, recovery: 0.6, dmg: 80, reach: 4.2, aoe: 4.2, zone: 'legs', kb: 1.6, poise: 60, knockdown: true, lunge: 0.2 }));
add(M({ id: 'phantomDash', name: 'Phantom Dash', anim: 'lunge', kind: 'boss', effect: 'teleport', startup: 0.15, active: 0.1, recovery: 0.3, dmg: 64, reach: 9, zone: 'head', kb: 0.6, poise: 30, lunge: 0 }));
add(M({ id: 'missileBarrage', name: 'Missile Barrage', anim: 'shootB', hand: 'B', kind: 'boss', startup: 0.5, active: 0.5, recovery: 0.5, dmg: 34, reach: 16, zone: 'torso', kb: 0.6, poise: 20, lunge: 0, projectile: { speed: 14, range: 16, size: 0.3, color: '#FF5A3D', count: 4 } }));

export const LIGHT_CHAIN = ['jab', 'cross', 'hookL', 'upperR'];
export const WEAPON_MOVE: Record<string, string> = { piston: 'pistonRam', shock: 'shockJab', saw: 'sawSlash', flame: 'flameBurst', rocket: 'rocketFist' };
