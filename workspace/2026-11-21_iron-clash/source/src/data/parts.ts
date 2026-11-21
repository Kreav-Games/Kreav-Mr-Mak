import type { ClassId, PartCat, Rarity, SlotId, StatBlock } from '../core/types';

export const RARITIES = [
  { name: 'Common', color: '#A9B3BF', mult: 1.0, sell: 1, upMat: 'scrap' },
  { name: 'Uncommon', color: '#5BD16A', mult: 1.1, sell: 1.6, upMat: 'scrap' },
  { name: 'Rare', color: '#3FA2FF', mult: 1.22, sell: 2.6, upMat: 'alloy' },
  { name: 'Epic', color: '#B65CFF', mult: 1.36, sell: 4.2, upMat: 'alloy' },
  { name: 'Legendary', color: '#FFB12E', mult: 1.52, sell: 7, upMat: 'circuits' },
  { name: 'Mythic', color: '#FF4F6D', mult: 1.72, sell: 12, upMat: 'quantum' },
] as const;
export const rarityName = (r: Rarity) => RARITIES[r].name;
export const MAX_PART_LEVEL = 10;

export const SLOTS: { id: SlotId; cat: PartCat; name: string; zone: 'head' | 'torso' | 'arms' | 'legs' }[] = [
  { id: 'head', cat: 'head', name: 'Head', zone: 'head' },
  { id: 'torso', cat: 'torso', name: 'Torso', zone: 'torso' },
  { id: 'armL', cat: 'arm', name: 'Left Arm', zone: 'arms' },
  { id: 'armR', cat: 'arm', name: 'Right Arm', zone: 'arms' },
  { id: 'foreL', cat: 'fore', name: 'Left Forearm', zone: 'arms' },
  { id: 'foreR', cat: 'fore', name: 'Right Forearm', zone: 'arms' },
  { id: 'handL', cat: 'hand', name: 'Left Hand', zone: 'arms' },
  { id: 'handR', cat: 'hand', name: 'Right Hand', zone: 'arms' },
  { id: 'legs', cat: 'legs', name: 'Legs', zone: 'legs' },
  { id: 'feet', cat: 'feet', name: 'Feet', zone: 'legs' },
  { id: 'core', cat: 'core', name: 'Power Core', zone: 'torso' },
  { id: 'plating', cat: 'plating', name: 'Armor Plating', zone: 'torso' },
  { id: 'hydraulics', cat: 'hydraulics', name: 'Hydraulics', zone: 'arms' },
  { id: 'cooling', cat: 'cooling', name: 'Cooling', zone: 'torso' },
  { id: 'weapon', cat: 'weapon', name: 'Weapon Mount', zone: 'arms' },
];
export const slotCat = (s: SlotId) => SLOTS.find(x => x.id === s)!.cat;

export interface PartDef {
  id: string; name: string; cat: PartCat; style: string; desc: string;
  base: Partial<StatBlock>; cls?: ClassId; unlock: number; price: number; maxRarity?: Rarity;
}

const P = (id: string, name: string, cat: PartCat, style: string, unlock: number, price: number, base: Partial<StatBlock>, desc: string, cls?: ClassId): PartDef =>
  ({ id, name, cat, style, unlock, price, base, desc, cls });

export const PARTS: PartDef[] = [
  // Heads
  P('h_visor', 'Sentinel Visor', 'head', 'visor', 1, 300, { hp: 110, armor: 10, weight: 45, crit: 3, energy: -6, durability: 8 }, 'Balanced sensor head with a wide optic band.'),
  P('h_dome', 'Bulwark Dome', 'head', 'dome', 1, 380, { hp: 160, armor: 18, weight: 70, energy: -5, durability: 12 }, 'Thick armored dome that shrugs off hooks.', 'tank'),
  P('h_blade', 'Raptor Crest', 'head', 'blade', 4, 650, { hp: 90, armor: 6, weight: 32, crit: 7, atkSpd: 8, energy: -8, durability: 6 }, 'Light targeting head. Finds weak points.', 'assassin'),
  P('h_mono', 'Cyclops Optic', 'head', 'mono', 7, 900, { hp: 120, armor: 12, weight: 50, crit: 5, power: 6, energy: -9, durability: 9 }, 'Single high-gain lens tuned for counter timing.', 'boxer'),
  P('h_crown', 'Regent Crown', 'head', 'crown', 12, 1600, { hp: 140, armor: 14, weight: 55, crit: 6, power: 8, energy: -12, durability: 10 }, 'Champion-grade head unit with tactical processors.', 'engineer'),
  // Torsos
  P('t_striker', 'Striker Chassis', 'torso', 'boxer', 1, 500, { hp: 300, armor: 30, weight: 160, power: 18, atkSpd: 16, energy: -14, heat: 10, durability: 20 }, 'V-shaped boxing frame built for rotation.', 'boxer'),
  P('t_behemoth', 'Behemoth Hull', 'torso', 'heavy', 1, 620, { hp: 420, armor: 46, weight: 240, power: 22, energy: -16, heat: 12, durability: 28 }, 'Barrel hull packed with ablative mass.', 'bruiser'),
  P('t_wraith', 'Wraith Frame', 'torso', 'sleek', 5, 900, { hp: 240, armor: 20, weight: 110, atkSpd: 24, moveSpd: 14, crit: 4, energy: -12, heat: 8, durability: 16 }, 'Minimal skeletal frame. Fast and fragile.', 'assassin'),
  P('t_bastion', 'Bastion Block', 'torso', 'block', 8, 1300, { hp: 500, armor: 60, weight: 300, power: 16, energy: -18, heat: 14, durability: 34 }, 'Fortress torso with interlocking slabs.', 'tank'),
  P('t_dynamo', 'Dynamo Frame', 'torso', 'reactor', 10, 1500, { hp: 320, armor: 32, weight: 170, power: 14, energy: 30, cooling: 10, heat: 8, durability: 20 }, 'Open reactor cage that feeds power to every limb.', 'engineer'),
  // Upper arms
  P('a_piston', 'Hydra Piston Arm', 'arm', 'piston', 1, 260, { hp: 70, armor: 6, weight: 45, power: 14, atkSpd: 8, energy: -5, heat: 5, durability: 8 }, 'Twin exposed pistons for snappy extension.', 'boxer'),
  P('a_titan', 'Titan Bicep', 'arm', 'heavy', 1, 300, { hp: 95, armor: 10, weight: 65, power: 20, atkSpd: -4, energy: -6, heat: 7, durability: 10 }, 'Massive servo block. Slow, crushing swings.', 'bruiser'),
  P('a_whip', 'Whip Strut', 'arm', 'light', 3, 420, { hp: 55, armor: 4, weight: 28, power: 9, atkSpd: 16, energy: -4, heat: 4, durability: 6 }, 'Carbon strut arm. Lightning quick.', 'assassin'),
  P('a_servo', 'Servo Coil Arm', 'arm', 'cable', 6, 640, { hp: 80, armor: 8, weight: 48, power: 13, atkSpd: 10, energy: -2, heat: 3, cooling: 4, durability: 9 }, 'Coil-wrapped arm with efficient motors.', 'engineer'),
  // Forearms
  P('f_gauntlet', 'Brawler Gauntlet', 'fore', 'gauntlet', 1, 240, { hp: 60, armor: 8, weight: 40, power: 12, atkSpd: 6, energy: -4, heat: 4, durability: 8 }, 'Tapered gauntlet that protects the guard.', 'boxer'),
  P('f_ram', 'Ram Forearm', 'fore', 'ram', 2, 330, { hp: 75, armor: 10, weight: 58, power: 18, atkSpd: -2, energy: -5, heat: 6, durability: 10 }, 'Hydraulic ram adds weight behind every blow.', 'bruiser'),
  P('f_edge', 'Edge Forearm', 'fore', 'blade', 5, 560, { hp: 50, armor: 5, weight: 30, power: 10, atkSpd: 12, crit: 3, energy: -4, heat: 3, durability: 6 }, 'Bladed fins that slice through guards.', 'assassin'),
  P('f_coil', 'Tesla Coil Forearm', 'fore', 'coil', 8, 780, { hp: 62, armor: 7, weight: 42, power: 12, atkSpd: 8, energy: 4, cooling: 3, heat: 2, durability: 8 }, 'Energy coils that power gadget arms.', 'engineer'),
  // Hands
  P('k_fist', 'Iron Fist', 'hand', 'fist', 1, 180, { hp: 25, armor: 4, weight: 18, power: 10, atkSpd: 4, durability: 6 }, 'Solid steel fist. Reliable.'),
  P('k_mace', 'Wrecker Mitt', 'hand', 'mace', 3, 360, { hp: 30, armor: 5, weight: 30, power: 16, atkSpd: -4, durability: 8 }, 'Studded wrecking ball of a hand.', 'bruiser'),
  P('k_talon', 'Talon Grip', 'hand', 'claw', 6, 520, { hp: 20, armor: 3, weight: 14, power: 9, atkSpd: 8, crit: 4, durability: 5 }, 'Razor talons for critical tears.', 'assassin'),
  P('k_arc', 'Arc Knuckle', 'hand', 'knuckle', 9, 700, { hp: 26, armor: 4, weight: 20, power: 12, atkSpd: 6, crit: 2, energy: -3, durability: 6 }, 'Charged knuckle bar. Sparks on contact.', 'boxer'),
  // Legs
  P('l_strider', 'Strider Legs', 'legs', 'strider', 1, 420, { hp: 180, armor: 18, weight: 130, moveSpd: 70, energy: -8, durability: 16 }, 'All-round legs with armored knees.'),
  P('l_pillar', 'Pillar Legs', 'legs', 'column', 1, 480, { hp: 240, armor: 28, weight: 190, moveSpd: 48, power: 8, energy: -9, durability: 22 }, 'Load-bearing columns. Planted and stable.', 'tank'),
  P('l_sprint', 'Sprinter Legs', 'legs', 'sprint', 4, 700, { hp: 140, armor: 10, weight: 90, moveSpd: 96, energy: -10, durability: 12 }, 'Spring-loaded legs for darting footwork.', 'assassin'),
  P('l_servo', 'Servo Legs', 'legs', 'servo', 7, 860, { hp: 190, armor: 20, weight: 120, moveSpd: 78, energy: -4, cooling: 6, durability: 16 }, 'Efficient servo legs with integrated cooling.', 'engineer'),
  // Feet
  P('ft_anchor', 'Anchor Plates', 'feet', 'plate', 1, 200, { hp: 50, armor: 8, weight: 50, moveSpd: 6, power: 4, durability: 8 }, 'Wide plates that root a heavy stance.'),
  P('ft_talon', 'Talon Feet', 'feet', 'talon', 3, 340, { hp: 36, armor: 4, weight: 26, moveSpd: 18, durability: 5 }, 'Clawed feet that grip for quick pivots.', 'assassin'),
  P('ft_mag', 'Mag Boots', 'feet', 'boot', 7, 620, { hp: 60, armor: 10, weight: 45, moveSpd: 12, power: 6, durability: 9 }, 'Magnetic soles. Transfer power from the floor.', 'boxer'),
  // Cores
  P('c_fusion', 'Fusion Cell', 'core', 'fusion', 1, 500, { energy: 150, heat: 10, hp: 40, weight: 40, durability: 10 }, 'Stable fusion cell. Steady stamina.'),
  P('c_plasma', 'Plasma Heart', 'core', 'plasma', 4, 900, { energy: 175, heat: 22, power: 12, hp: 40, weight: 46, durability: 10 }, 'Runs hot but hits hard.', 'bruiser'),
  P('c_ion', 'Ion Furnace', 'core', 'ion', 8, 1300, { energy: 205, heat: 14, atkSpd: 8, hp: 40, weight: 44, durability: 10 }, 'High-output core for long combos.', 'boxer'),
  P('c_void', 'Singularity Core', 'core', 'void', 14, 2600, { energy: 240, heat: 12, power: 10, crit: 3, hp: 50, weight: 50, durability: 12 }, 'Experimental core bending energy around itself.', 'engineer'),
  // Plating
  P('p_steel', 'Steel Plates', 'plating', 'steel', 1, 300, { armor: 40, hp: 60, weight: 80, durability: 14 }, 'Classic welded steel armor.'),
  P('p_comp', 'Composite Weave', 'plating', 'composite', 4, 640, { armor: 32, hp: 50, weight: 40, moveSpd: 6, durability: 12 }, 'Layered composite: protective and light.', 'assassin'),
  P('p_react', 'Reactive Armor', 'plating', 'reactive', 7, 980, { armor: 58, hp: 70, weight: 110, power: 4, durability: 18 }, 'Explosive bricks that punish attackers.', 'tank'),
  P('p_ceram', 'Ceramic Shell', 'plating', 'ceramic', 10, 1250, { armor: 50, hp: 80, weight: 60, cooling: 8, durability: 10 }, 'Heat-resistant ceramic shell.', 'engineer'),
  // Hydraulics
  P('y_hx', 'HX-100 Hydraulics', 'hydraulics', 'standard', 1, 260, { power: 10, atkSpd: 10, moveSpd: 6, heat: 6, weight: 30, durability: 8 }, 'Standard industrial hydraulics.'),
  P('y_over', 'Overpressure Rig', 'hydraulics', 'over', 5, 720, { power: 22, atkSpd: 4, heat: 16, weight: 40, durability: 8 }, 'Dangerously high pressure. Brutal force.', 'bruiser'),
  P('y_mag', 'Maglev Actuators', 'hydraulics', 'mag', 9, 1200, { power: 12, atkSpd: 20, moveSpd: 14, heat: 8, energy: -6, weight: 26, durability: 8 }, 'Frictionless magnetic actuators.', 'boxer'),
  // Cooling
  P('o_fan', 'Fan Array', 'cooling', 'fan', 1, 220, { cooling: 40, weight: 26, energy: -4, durability: 6 }, 'Twin turbine fans on the back.'),
  P('o_cryo', 'Cryo Loop', 'cooling', 'cryo', 5, 640, { cooling: 70, weight: 34, energy: -8, durability: 8 }, 'Liquid nitrogen loop. Superb heat control.', 'engineer'),
  P('o_fins', 'Heat Sink Fins', 'cooling', 'fins', 3, 400, { cooling: 52, armor: 8, weight: 40, durability: 10 }, 'Passive fins that double as back armor.', 'tank'),
  // Weapons
  P('w_ram', 'Piston Ram', 'weapon', 'piston', 2, 600, { power: 10, weight: 40, heat: 8, durability: 8 }, 'Ability 3: a piston-driven blow with huge knockback.', 'bruiser'),
  P('w_shock', 'Shock Knuckles', 'weapon', 'shock', 4, 820, { power: 6, energy: -8, weight: 18, durability: 6 }, 'Ability 3: an electrified jab that stuns.', 'boxer'),
  P('w_saw', 'Buzz Saw', 'weapon', 'saw', 6, 980, { power: 8, crit: 3, weight: 30, heat: 6, durability: 6 }, 'Ability 3: a saw slash that shreds armor over time.', 'assassin'),
  P('w_flame', 'Flame Vents', 'weapon', 'flame', 9, 1300, { power: 6, heat: 12, weight: 28, durability: 6 }, 'Ability 3: a flame burst that overheats the opponent.', 'tank'),
  P('w_rocket', 'Rocket Fist', 'weapon', 'rocket', 12, 1800, { power: 10, weight: 34, heat: 10, durability: 6 }, 'Ability 3: launches your fist across the ring.', 'engineer'),
];
export const PART_BY_ID: Record<string, PartDef> = Object.fromEntries(PARTS.map(p => [p.id, p]));
export const partsInCat = (c: PartCat) => PARTS.filter(p => p.cat === c);

export const UPGRADE = {
  credits: (level: number, r: Rarity) => Math.round((120 + level * level * 60) * (1 + r * 0.5)),
  mats: (level: number, r: Rarity) => ({ mat: RARITIES[r].upMat as 'scrap' | 'alloy' | 'circuits' | 'quantum', n: Math.ceil((1 + level) * (r >= 4 ? 0.6 : 1.5)) }),
};
export const levelMult = (lv: number) => 1 + (lv - 1) * 0.06;
export const condMult = (cond: number) => (cond >= 60 ? 1 : 0.82 + cond / 60 * 0.18);
export const sellPrice = (def: PartDef, r: Rarity, lv: number) => Math.round(def.price * 0.25 * RARITIES[r].sell * (1 + (lv - 1) * 0.15));
export const repairCost = (def: PartDef, r: Rarity, cond: number) => Math.round((100 - cond) * (2 + def.price / 400) * (1 + r * 0.3));
