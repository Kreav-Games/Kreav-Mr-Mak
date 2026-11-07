// Game data shared by the client and the server: classes, abilities, enemies,
// items, quests and the formulas that turn levels and gear into numbers.
// Distances are metres in arena space (the floor the player placed in AR).

export const TICK_RATE = 20; // simulation steps per second
export const MAX_LEVEL = 20;
export const BAG_SIZE = 20;
export const ARENA_RADIUS = 3; // default playable radius in metres

export const RARITIES = [
  { id: 'poor', name: 'Poor', color: '#9d9d9d', budget: 0.6, weight: 18 },
  { id: 'common', name: 'Common', color: '#ffffff', budget: 1.0, weight: 40 },
  { id: 'uncommon', name: 'Uncommon', color: '#1eff00', budget: 1.35, weight: 26 },
  { id: 'rare', name: 'Rare', color: '#0070dd', budget: 1.75, weight: 11 },
  { id: 'epic', name: 'Epic', color: '#a335ee', budget: 2.3, weight: 4 },
  { id: 'legendary', name: 'Legendary', color: '#ff8000', budget: 3.0, weight: 1 },
];
export const rarityById = Object.fromEntries(RARITIES.map((r) => [r.id, r]));

export const SLOTS = ['head', 'shoulders', 'chest', 'hands', 'legs', 'feet', 'weapon', 'trinket'];
export const SLOT_NAMES = {
  head: 'Head', shoulders: 'Shoulders', chest: 'Chest', hands: 'Hands',
  legs: 'Legs', feet: 'Feet', weapon: 'Weapon', trinket: 'Trinket',
};
// Share of an item's stat budget by slot.
const SLOT_WEIGHT = { head: 1, shoulders: 0.8, chest: 1.1, hands: 0.7, legs: 1, feet: 0.7, weapon: 1.4, trinket: 0.8 };
// Armour value per budget point by armour type.
const ARMOR_PER_POINT = { plate: 6, mail: 4, leather: 3, cloth: 1.5 };

export const STAT_NAMES = {
  str: 'Strength', agi: 'Agility', int: 'Intellect', spi: 'Spirit', sta: 'Stamina', armor: 'Armor',
};

// ---------------------------------------------------------------- Classes ---

export const CLASSES = {
  warrior: {
    id: 'warrior', name: 'Warrior', role: 'Tank', color: '#c79c6e',
    armor: 'plate', weapon: 'Sword', mainStat: 'str', resource: 'rage',
    blurb: 'Stands in front. Builds rage by hitting and being hit; holds enemy attention.',
    base: { str: 12, agi: 6, int: 2, spi: 2, sta: 12 },
    perLevel: { str: 2, agi: 1, int: 0, spi: 0, sta: 2 },
    abilities: ['strike', 'cleave', 'taunt', 'shieldWall'],
  },
  mage: {
    id: 'mage', name: 'Mage', role: 'Ranged damage', color: '#69ccf0',
    armor: 'cloth', weapon: 'Staff', mainStat: 'int', resource: 'mana',
    blurb: 'Fragile, deadly at range. Frost Nova roots everything near you.',
    base: { str: 2, agi: 3, int: 14, spi: 8, sta: 7 },
    perLevel: { str: 0, agi: 0, int: 2, spi: 1, sta: 1 },
    abilities: ['fireball', 'frostNova', 'arcaneMissiles', 'manaShield'],
  },
  ranger: {
    id: 'ranger', name: 'Ranger', role: 'Ranged damage', color: '#abd473',
    armor: 'mail', weapon: 'Bow', mainStat: 'agi', resource: 'focus',
    blurb: 'Steady damage from range. Focus refills on its own; traps slow enemies.',
    base: { str: 4, agi: 13, int: 4, spi: 4, sta: 9 },
    perLevel: { str: 0, agi: 2, int: 0, spi: 0, sta: 2 },
    abilities: ['aimedShot', 'multiShot', 'frostTrap', 'mendWounds'],
  },
  cleric: {
    id: 'cleric', name: 'Cleric', role: 'Healer', color: '#f0ebe0',
    armor: 'cloth', weapon: 'Mace', mainStat: 'int', resource: 'mana',
    blurb: 'Keeps the party alive. Tap an ally (or nobody, for yourself) and heal.',
    base: { str: 4, agi: 3, int: 12, spi: 12, sta: 9 },
    perLevel: { str: 0, agi: 0, int: 2, spi: 1, sta: 1 },
    abilities: ['smite', 'heal', 'renew', 'holyNova'],
  },
};

export const RESOURCES = {
  rage: { name: 'Rage', color: '#c41e3a', max: () => 100, regen: -1, start: 0 },
  mana: { name: 'Mana', color: '#2f6fe0', max: (s) => 60 + s.int * 8, regen: 0, start: 1 },
  focus: { name: 'Focus', color: '#d8a03a', max: () => 100, regen: 8, start: 1 },
};

// target: 'enemy' needs a hostile target; 'ally' heals the target ally or self;
// 'self' acts around the caster. power multiplies the class main-stat damage.
export const ABILITIES = {
  // Warrior
  strike: { name: 'Heroic Strike', icon: '⚔', cost: 0, cd: 1.5, range: 2.2, target: 'enemy', power: 1.2, gain: 12,
    desc: 'A heavy melee blow. Generates rage.' },
  cleave: { name: 'Cleave', icon: '🌀', cost: 25, cd: 5, radius: 2.4, target: 'self', power: 1.0, threat: 2,
    desc: 'Hits every enemy within 2.4 m.' },
  taunt: { name: 'Taunt', icon: '📣', cost: 0, cd: 8, range: 6, target: 'enemy', taunt: true, power: 0.3,
    desc: 'Forces the target and enemies near it to attack you.' },
  shieldWall: { name: 'Shield Wall', icon: '🛡', cost: 15, cd: 20, target: 'self', buff: { id: 'shieldWall', dur: 6, dr: 0.5 },
    desc: 'Take 50% less damage for 6 s.' },
  // Mage
  fireball: { name: 'Fireball', icon: '🔥', cost: 12, cd: 1.6, range: 9, target: 'enemy', power: 1.6, projectile: 'fire',
    desc: 'Hurls a ball of fire.' },
  frostNova: { name: 'Frost Nova', icon: '❄', cost: 20, cd: 12, radius: 3, target: 'self', power: 0.5,
    debuff: { id: 'root', dur: 4 }, desc: 'Damages and roots enemies within 3 m for 4 s.' },
  arcaneMissiles: { name: 'Arcane Missiles', icon: '✨', cost: 25, cd: 6, range: 9, target: 'enemy', power: 2.6, projectile: 'arcane',
    desc: 'A volley of arcane bolts.' },
  manaShield: { name: 'Mana Shield', icon: '🔮', cost: 30, cd: 18, target: 'self', buff: { id: 'absorb', dur: 10, absorbMul: 2.5 },
    desc: 'Absorbs damage for 10 s.' },
  // Ranger
  aimedShot: { name: 'Aimed Shot', icon: '🏹', cost: 15, cd: 1.5, range: 10, target: 'enemy', power: 1.5, projectile: 'arrow',
    desc: 'A precise arrow.' },
  multiShot: { name: 'Multi-Shot', icon: '🎯', cost: 35, cd: 6, range: 10, target: 'enemy', power: 1.1, chain: 3, projectile: 'arrow',
    desc: 'Hits the target and two enemies near it.' },
  frostTrap: { name: 'Frost Trap', icon: '🧊', cost: 25, cd: 14, radius: 2.5, target: 'self', power: 0.2,
    debuff: { id: 'slow', dur: 6, mul: 0.4 }, desc: 'Slows enemies within 2.5 m by 60% for 6 s.' },
  mendWounds: { name: 'Mend Wounds', icon: '🌿', cost: 30, cd: 15, range: 8, target: 'ally', heal: 0.8,
    hot: { dur: 6, mul: 1.6 }, desc: 'Heals you or an ally over 6 s.' },
  // Cleric
  smite: { name: 'Smite', icon: '☀', cost: 8, cd: 1.6, range: 8, target: 'enemy', power: 1.1, projectile: 'holy',
    desc: 'Strikes an enemy with light.' },
  heal: { name: 'Heal', icon: '✚', cost: 18, cd: 1.6, range: 9, target: 'ally', heal: 2.2,
    desc: 'Heals the targeted ally, or you.' },
  renew: { name: 'Renew', icon: '💫', cost: 15, cd: 4, range: 9, target: 'ally', hot: { dur: 9, mul: 2.4 },
    desc: 'Heals the target over 9 s.' },
  holyNova: { name: 'Holy Nova', icon: '🌟', cost: 30, cd: 8, radius: 4, target: 'self', power: 0.6, heal: 1.0,
    desc: 'Damages enemies and heals allies within 4 m.' },
};

// ---------------------------------------------------------------- Enemies ---

export const ENEMIES = {
  imp: {
    name: 'Rift Imp', hp: 45, dmg: 6, speed: 0.55, range: 1.0, attackCd: 2.2, windup: 0.9,
    aoe: 0.9, aggro: 5, xp: 40, gold: [1, 4], scale: 0.5, color: '#e0482f', loot: 0.35,
  },
  wisp: {
    name: 'Void Wisp', hp: 30, dmg: 8, speed: 0.7, range: 4.5, attackCd: 3.0, windup: 1.2,
    aoe: 0.8, aggro: 6, xp: 45, gold: [1, 5], scale: 0.4, color: '#8a5cff', loot: 0.35, ranged: true,
  },
  hound: {
    name: 'Shade Hound', hp: 70, dmg: 9, speed: 0.85, range: 1.1, attackCd: 2.0, windup: 0.7,
    aoe: 1.0, aggro: 6, xp: 60, gold: [2, 6], scale: 0.55, color: '#4b4b63', loot: 0.4,
  },
  warden: {
    name: 'Rift Warden', hp: 420, dmg: 18, speed: 0.45, range: 1.6, attackCd: 3.2, windup: 1.4,
    aoe: 1.8, aggro: 8, xp: 300, gold: [20, 35], scale: 0.9, color: '#3fb6a8', loot: 1, elite: true, minRarity: 'uncommon',
  },
  colossus: {
    name: 'Rift Colossus', hp: 1800, dmg: 26, speed: 0.35, range: 2.4, attackCd: 3.5, windup: 1.6,
    aoe: 2.6, aggro: 12, xp: 1200, gold: [80, 120], scale: 1.4, color: '#b0743a', loot: 2, boss: true, minRarity: 'rare',
    summon: { type: 'imp', every: 12, count: 2 },
  },
};

// Pick-up objects that appear on the floor while a quest needs them.
export const PICKUPS = {
  shard: { name: 'Rift Shard', color: '#7ef9ff' },
  ember: { name: 'Hearth Ember', color: '#ffb347' },
};

// ----------------------------------------------------------------- Quests ---

// Kill credit is shared by everyone in the room (the room is the party).
export const QUESTS = [
  {
    id: 'q1', name: 'A Breach at Home', level: 1, giver: 'keeper',
    text: 'Something tore a hole between our world and yours, right here on your floor. Imps are already slipping through. Thin them out.',
    objectives: [{ kind: 'kill', target: 'imp', count: 5 }],
    reward: { xp: 200, gold: 15, item: { slot: 'chest', rarity: 'uncommon' } },
  },
  {
    id: 'q2', name: 'Shards Underfoot', level: 2, giver: 'keeper', requires: 'q1',
    text: 'The breach sheds shards of raw rift. Walk your room and gather them before the wisps feed on them.',
    objectives: [{ kind: 'collect', target: 'shard', count: 4 }, { kind: 'kill', target: 'wisp', count: 3 }],
    reward: { xp: 350, gold: 25, item: { slot: 'weapon', rarity: 'uncommon' } },
  },
  {
    id: 'q3', name: 'Hounds of the Hall', level: 3, giver: 'keeper', requires: 'q2',
    text: 'Shade hounds hunt by sound. Stay on your feet, step out of their lunges, and put them down.',
    objectives: [{ kind: 'kill', target: 'hound', count: 4 }],
    reward: { xp: 500, gold: 35, item: { slot: 'legs', rarity: 'rare' } },
  },
  {
    id: 'q4', name: 'The Warden', level: 4, giver: 'keeper', requires: 'q3',
    text: 'A Warden guards the breach from the other side. It hits hard and its slam covers a wide circle. Bring friends if you can.',
    objectives: [{ kind: 'kill', target: 'warden', count: 1 }],
    reward: { xp: 900, gold: 60, item: { slot: 'head', rarity: 'rare' } },
  },
  {
    id: 'q5', name: 'Embers of the Hearth', level: 5, giver: 'keeper', requires: 'q4',
    text: 'To close the breach I need the warmth of a home. Embers have scattered across your room. Bring me five.',
    objectives: [{ kind: 'collect', target: 'ember', count: 5 }, { kind: 'kill', target: 'any', count: 8 }],
    reward: { xp: 1100, gold: 70, item: { slot: 'shoulders', rarity: 'rare' } },
  },
  {
    id: 'q6', name: 'Close the Rift', level: 6, giver: 'keeper', requires: 'q5', group: true,
    text: 'The Colossus is coming through. When it falls, the rift closes. This is a fight for a full party.',
    objectives: [{ kind: 'kill', target: 'colossus', count: 1 }],
    reward: { xp: 2500, gold: 200, item: { slot: 'weapon', rarity: 'epic' } },
  },
  {
    id: 'd1', name: 'Daily: Keep the Peace', level: 1, giver: 'keeper', requires: 'q1', repeatable: true,
    text: 'The breach never fully sleeps. Clear out whatever wanders in.',
    objectives: [{ kind: 'kill', target: 'any', count: 10 }],
    reward: { xp: 300, gold: 20, item: { slot: 'random', rarity: 'uncommon' } },
  },
];
export const questById = Object.fromEntries(QUESTS.map((q) => [q.id, q]));

// ----------------------------------------------------------------- Vendor ---

export const VENDOR = [
  { id: 'hpPotion', name: 'Healing Draught', price: 5, icon: '🧪', desc: 'Restores 40% health.', use: { heal: 0.4 } },
  { id: 'mpPotion', name: 'Mana Draught', price: 5, icon: '💧', desc: 'Restores 50% mana.', use: { mana: 0.5 } },
];

// --------------------------------------------------------------- Formulas ---

export const xpForLevel = (level) => Math.round(150 * Math.pow(level, 1.6));

export function computeStats(cls, level, equipment) {
  const c = CLASSES[cls];
  const s = { armor: 0 };
  for (const k of Object.keys(c.base)) s[k] = c.base[k] + c.perLevel[k] * (level - 1);
  for (const slot of SLOTS) {
    const item = equipment?.[slot];
    if (!item) continue;
    for (const [k, v] of Object.entries(item.stats)) s[k] = (s[k] || 0) + v;
  }
  const res = RESOURCES[c.resource];
  return {
    ...s,
    maxHp: Math.round(60 + level * 18 + s.sta * 9),
    maxRes: Math.round(res.max(s)),
    power: s[c.mainStat],
    // armour reduction: diminishing, capped at 60%
    dr: Math.min(0.6, s.armor / (s.armor + 200 + level * 20)),
    ilvl: averageItemLevel(equipment),
  };
}

export function averageItemLevel(equipment) {
  const items = SLOTS.map((slot) => equipment?.[slot]).filter(Boolean);
  if (!items.length) return 0;
  return Math.round(items.reduce((a, it) => a + it.ilvl, 0) / items.length);
}

export const abilityDamage = (power, mul, level) => (8 + level * 2.5 + power * 1.1) * mul;
export const enemyLevelScale = (level) => 1 + (level - 1) * 0.22;

// ------------------------------------------------------------------ Items ---

const NAMES = {
  plate: { head: 'Greathelm', shoulders: 'Pauldrons', chest: 'Breastplate', hands: 'Gauntlets', legs: 'Legplates', feet: 'Sabatons' },
  mail: { head: 'Coif', shoulders: 'Mantle', chest: 'Hauberk', hands: 'Grips', legs: 'Chausses', feet: 'Treads' },
  leather: { head: 'Hood', shoulders: 'Spaulders', chest: 'Jerkin', hands: 'Gloves', legs: 'Breeches', feet: 'Boots' },
  cloth: { head: 'Cowl', shoulders: 'Amice', chest: 'Robe', hands: 'Handwraps', legs: 'Leggings', feet: 'Slippers' },
};
const TRINKETS = ['Charm', 'Idol', 'Talisman', 'Locket', 'Rune'];
const PREFIXES = ['Rift-Touched', 'Hearthbound', 'Gloaming', 'Shardforged', 'Wardens\'', 'Emberlit', 'Hollow', 'Starward', 'Ashen', 'Duskwoven'];
const SUFFIXES = {
  str: ['of the Bear', 'of Might', 'of the Bulwark'],
  agi: ['of the Falcon', 'of the Fox', 'of Swiftness'],
  int: ['of the Owl', 'of Insight', 'of the Arcane'],
  spi: ['of Grace', 'of the Hearth', 'of Renewal'],
  sta: ['of the Mountain', 'of Endurance', 'of the Oak'],
};
const LEGENDARY = ['Riftbreaker', 'Hearthguard', 'Doorwarden\'s Oath', 'Last Light', 'Thresholdfang'];

let itemSeq = 0;
const uid = () => `i${Date.now().toString(36)}${(itemSeq++).toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;

export function rollRarity(rng = Math.random, min = 'poor') {
  const minIdx = RARITIES.findIndex((r) => r.id === min);
  const pool = RARITIES.slice(minIdx);
  const total = pool.reduce((a, r) => a + r.weight, 0);
  let roll = rng() * total;
  for (const r of pool) { roll -= r.weight; if (roll <= 0) return r.id; }
  return pool[pool.length - 1].id;
}

// Create an item for a class. The stat budget grows with item level and rarity;
// the class main stat and stamina take most of it.
export function makeItem({ cls, level, slot, rarity, rng = Math.random }) {
  const c = CLASSES[cls];
  if (!slot || slot === 'random') slot = SLOTS[Math.floor(rng() * SLOTS.length)];
  const r = rarityById[rarity] || rarityById.common;
  const ilvl = Math.max(1, level + (rarity === 'epic' ? 3 : rarity === 'legendary' ? 6 : 0));
  const budget = (4 + ilvl * 2.2) * r.budget * SLOT_WEIGHT[slot];
  const second = rng() < 0.5 ? 'sta' : (rng() < 0.5 ? 'spi' : c.mainStat === 'str' ? 'agi' : 'sta');
  const stats = {};
  if (rarity === 'poor') {
    stats.sta = Math.max(1, Math.round(budget * 0.5));
  } else {
    stats[c.mainStat] = Math.max(1, Math.round(budget * 0.55));
    stats[second] = (stats[second] || 0) + Math.max(1, Math.round(budget * 0.35));
  }
  if (slot !== 'weapon' && slot !== 'trinket') stats.armor = Math.round(budget * ARMOR_PER_POINT[c.armor]);
  let base;
  if (slot === 'weapon') base = c.weapon;
  else if (slot === 'trinket') base = TRINKETS[Math.floor(rng() * TRINKETS.length)];
  else base = NAMES[c.armor][slot];
  let name;
  if (rarity === 'legendary') name = LEGENDARY[Math.floor(rng() * LEGENDARY.length)];
  else if (rarity === 'poor') name = `Frayed ${base}`;
  else {
    const pre = rarity === 'common' ? '' : `${PREFIXES[Math.floor(rng() * PREFIXES.length)]} `;
    const suf = rarity === 'common' ? '' : ` ${SUFFIXES[c.mainStat][Math.floor(rng() * 3)]}`;
    name = `${pre}${base}${suf}`;
  }
  return {
    id: uid(), kind: 'gear', name, slot, rarity, ilvl, cls, armorType: slot === 'weapon' || slot === 'trinket' ? null : c.armor,
    stats, value: Math.max(1, Math.round(ilvl * r.budget * 1.5)),
  };
}

export function makeConsumable(id) {
  const v = VENDOR.find((x) => x.id === id);
  return { id: uid(), kind: 'consumable', vendorId: id, name: v.name, icon: v.icon, rarity: 'common', value: 1, stack: 1 };
}

export function starterEquipment(cls) {
  const eq = {};
  for (const slot of ['chest', 'legs', 'weapon']) eq[slot] = makeItem({ cls, level: 1, slot, rarity: 'common', rng: () => 0.5 });
  return eq;
}

// Score used to compare items in tooltips ("upgrade" arrows).
export function itemScore(item, cls) {
  if (!item) return 0;
  const main = CLASSES[cls].mainStat;
  const s = item.stats || {};
  return (s[main] || 0) * 2 + (s.sta || 0) * 1.5 + (s.spi || 0) * (main === 'int' ? 1 : 0.3) + (s.armor || 0) * 0.05;
}
