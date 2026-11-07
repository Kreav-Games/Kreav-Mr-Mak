// The authoritative game simulation. It runs on the server for multiplayer
// rooms and in the browser for solo play, behind the same message interface.
//
//   sim.join(id, hello)      -> adds a player from a saved character
//   sim.handle(id, msg)      -> applies a client command
//   sim.step(dt)             -> advances the world
//   sim.snapshot(id)         -> public world state + that player's private state
//   sim.saveOf(id)           -> the character blob the client keeps
//
// Positions are arena metres: x/z on the floor, the arena origin at the portal.

import {
  ABILITIES, ARENA_RADIUS, BAG_SIZE, CLASSES, ENEMIES, MAX_LEVEL, PICKUPS, QUESTS, RESOURCES, SLOTS, VENDOR,
  abilityDamage, computeStats, enemyLevelScale, makeConsumable, makeItem, questById, rarityById, rollRarity,
  starterEquipment, xpForLevel,
} from './data.js';
import { WorldMap } from './world.js';

const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const MOVE_SPEED_STICK = 1.6; // m/s when moving with the virtual stick
const MOVE_SPEED_MAX = 3.5; // m/s cap for walking in AR (tracking jumps are clamped)
const RESPAWN_TIME = 6;
const COMBAT_TIMEOUT = 5;

export class Sim {
  constructor({ arenaRadius = ARENA_RADIUS, rng = Math.random, world = null } = {}) {
    this.rng = rng;
    this.arenaRadius = arenaRadius;
    // A scanned world replaces the round arena: zones, furniture and doorways.
    this.map = world ? new WorldMap(world) : null;
    this.time = 0;
    this.players = new Map();
    this.enemies = new Map();
    this.pickups = new Map();
    this.loot = new Map();
    this.events = [];
    this.seq = 0;
    this.spawnTimer = 1;
    this.npcs = [
      { id: 'keeper', name: 'Ysolde, Keeper of the Threshold', kind: 'questgiver', x: 0, z: 0 },
      { id: 'vendor', name: 'Bram the Pedlar', kind: 'vendor', x: 0.9, z: 0.5 },
    ];
    if (this.map) {
      const h = this.map.hearth;
      const keeper = this.map.snap(h.x, h.z);
      const vendor = this.map.snap(h.x + 0.9, h.z + 0.5);
      Object.assign(this.npcs[0], keeper);
      Object.assign(this.npcs[1], vendor);
    }
  }

  // Where players appear and respawn.
  homePoint() {
    if (this.map) {
      const h = this.map.hearth;
      return this.map.snap(h.x + 0.3 * (this.rng() - 0.5), h.z + 1.0);
    }
    return { x: 0.6 * (this.rng() - 0.5), z: 1.2 };
  }

  nextId(prefix) { return `${prefix}${++this.seq}`; }
  emit(ev) { this.events.push({ t: this.time, ...ev }); }

  // ------------------------------------------------------------ players ---

  join(id, hello = {}) {
    const cls = CLASSES[hello.cls] ? hello.cls : 'warrior';
    const save = hello.save && hello.save.cls === cls ? hello.save : null;
    const p = {
      id, kind: 'player', name: String(hello.name || 'Adventurer').slice(0, 18), cls,
      level: clamp(save?.level || 1, 1, MAX_LEVEL), xp: save?.xp || 0, gold: save?.gold ?? 10,
      equipment: save?.equipment || starterEquipment(cls),
      bag: (save?.bag || [makeConsumable('hpPotion'), makeConsumable('hpPotion')]).slice(0, BAG_SIZE),
      quests: save?.quests || {}, // id -> { state: 'active'|'done'|'complete', progress: [] }
      ...this.homePoint(), facing: Math.PI, // 'avatar': a character steered with the stick while the player sits (the default).
      // 'body': the phone's position is the character (walk-around AR, opt-in).
      mode: hello.mode === 'body' || hello.mode === 'ar' ? 'body' : 'avatar',
      target: null, cds: {}, buffs: [], alive: true, respawnAt: 0, lastCombat: -99, gcd: 0,
      privateVersion: 1, sentVersion: 0,
    };
    this.recalc(p, true);
    this.players.set(id, p);
    this.emit({ type: 'join', id, name: p.name });
    return p;
  }

  leave(id) {
    const p = this.players.get(id);
    if (!p) return;
    this.players.delete(id);
    for (const e of this.enemies.values()) e.threat.delete(id);
    this.emit({ type: 'leave', id, name: p.name });
  }

  recalc(p, refill = false) {
    const st = computeStats(p.cls, p.level, p.equipment);
    const hpRatio = p.maxHp ? p.hp / p.maxHp : 1;
    const resRatio = p.maxRes ? p.res / p.maxRes : 1;
    p.stats = st;
    p.maxHp = st.maxHp;
    p.maxRes = st.maxRes;
    const res = RESOURCES[CLASSES[p.cls].resource];
    p.hp = refill ? p.maxHp : Math.round(p.maxHp * hpRatio);
    p.res = refill ? p.maxRes * res.start : p.maxRes * resRatio;
    p.privateVersion++;
  }

  saveOf(id) {
    const p = this.players.get(id);
    if (!p) return null;
    return { v: 1, name: p.name, cls: p.cls, level: p.level, xp: p.xp, gold: p.gold, equipment: p.equipment, bag: p.bag, quests: p.quests };
  }

  // ------------------------------------------------------------ commands ---

  handle(id, msg) {
    const p = this.players.get(id);
    if (!p || !msg || typeof msg !== 'object') return;
    switch (msg.t) {
      case 'move': return this.cmdMove(p, msg);
      case 'target': p.target = msg.id || null; return;
      case 'cast': return this.cmdCast(p, msg);
      case 'accept': return this.cmdAccept(p, msg.id);
      case 'turnin': return this.cmdTurnIn(p, msg.id);
      case 'abandon': delete p.quests[msg.id]; p.privateVersion++; return;
      case 'equip': return this.cmdEquip(p, msg.index);
      case 'unequip': return this.cmdUnequip(p, msg.slot);
      case 'use': return this.cmdUse(p, msg.index);
      case 'sell': return this.cmdSell(p, msg.index);
      case 'buy': return this.cmdBuy(p, msg.id);
      case 'loot': return this.cmdLoot(p, msg.id);
      case 'chat': this.emit({ type: 'chat', id: p.id, name: p.name, text: String(msg.text || '').slice(0, 140) }); return;
      default:
    }
  }

  // The client reports where it is: its body position in AR, or a stick
  // movement in preview and tabletop mode. Both are clamped by speed.
  cmdMove(p, msg) {
    if (!p.alive) return;
    if (hasDebuff(p, 'root')) return;
    if (typeof msg.facing === 'number') p.facing = msg.facing;
    let nx; let nz;
    if (typeof msg.x === 'number' && typeof msg.z === 'number') {
      nx = msg.x; nz = msg.z;
      const dt = Math.max(0.05, this.time - (p.lastMoveAt ?? this.time - 0.1));
      const d = Math.hypot(nx - p.x, nz - p.z);
      const maxD = MOVE_SPEED_MAX * dt + 0.25;
      if (d > maxD) { nx = p.x + ((nx - p.x) / d) * maxD; nz = p.z + ((nz - p.z) / d) * maxD; }
    } else if (typeof msg.dx === 'number' && typeof msg.dz === 'number') {
      const len = Math.hypot(msg.dx, msg.dz);
      if (len < 0.01) return;
      const k = Math.min(1, len) / len;
      const step = MOVE_SPEED_STICK * clamp(msg.dt || 0.05, 0, 0.2);
      nx = p.x + msg.dx * k * step; nz = p.z + msg.dz * k * step;
      p.facing = Math.atan2(msg.dx, msg.dz);
    } else return;
    if (this.map) {
      // Avatars collide with scanned walls and furniture. A walking player's
      // body is the truth: scans are imperfect, so never block it.
      if (p.mode === 'avatar' && !this.map.walkable(nx, nz) && this.map.walkable(p.x, p.z)) {
        if (this.map.walkable(nx, p.z)) nz = p.z;
        else if (this.map.walkable(p.x, nz)) nx = p.x;
        else return;
      }
    } else {
      const r = Math.hypot(nx, nz);
      const lim = this.arenaRadius + 1.5; // players may stand a little past the edge
      if (r > lim) { nx = (nx / r) * lim; nz = (nz / r) * lim; }
    }
    p.x = nx; p.z = nz; p.lastMoveAt = this.time;
    this.autoPickup(p);
  }

  cmdCast(p, msg) {
    if (!p.alive) return;
    const cls = CLASSES[p.cls];
    const abilityId = msg.ability;
    if (!cls.abilities.includes(abilityId)) return;
    const ab = ABILITIES[abilityId];
    if ((p.cds[abilityId] || 0) > this.time) return this.fail(p, 'Not ready yet');
    if (p.gcd > this.time) return;
    if (p.res < ab.cost) return this.fail(p, `Not enough ${RESOURCES[cls.resource].name.toLowerCase()}`);

    const targetId = msg.target ?? p.target;
    let target = null;
    if (ab.target === 'enemy') {
      target = this.enemies.get(targetId);
      if (!target || !target.alive) return this.fail(p, 'No enemy targeted');
      if (dist(p, target) > ab.range + target.radius) return this.fail(p, 'Out of range — step closer');
    } else if (ab.target === 'ally') {
      target = this.players.get(targetId);
      if (!target || !target.alive) target = p;
      if (target !== p && dist(p, target) > ab.range) return this.fail(p, 'Ally out of range');
    }

    p.res -= ab.cost;
    p.cds[abilityId] = this.time + ab.cd;
    p.gcd = this.time + 0.6;
    if (target && target !== p) p.facing = Math.atan2(target.x - p.x, target.z - p.z);
    this.emit({ type: 'cast', id: p.id, ability: abilityId, target: target?.id, projectile: ab.projectile });
    const power = p.stats.power;
    const lvl = p.level;
    const crit = () => this.rng() < 0.05 + (p.stats.agi || 0) / 1000;

    if (ab.target === 'enemy') {
      const hits = [target];
      if (ab.chain) {
        const others = [...this.enemies.values()].filter((e) => e.alive && e !== target)
          .sort((a, b) => dist(a, target) - dist(b, target)).slice(0, ab.chain - 1).filter((e) => dist(e, target) < 3);
        hits.push(...others);
      }
      for (const e of hits) {
        if (ab.power) this.damageEnemy(e, p, abilityDamage(power, ab.power, lvl), crit());
        if (ab.taunt) this.taunt(e, p);
      }
      if (ab.taunt) for (const e of this.enemies.values()) if (e.alive && dist(e, target) < 3) this.taunt(e, p);
      if (ab.gain && p.cls === 'warrior') p.res = Math.min(p.maxRes, p.res + ab.gain);
    } else if (ab.target === 'ally') {
      if (ab.heal) this.healPlayer(target, p, abilityDamage(power, ab.heal, lvl), crit());
      if (ab.hot) addBuff(target, { id: 'hot', until: this.time + ab.hot.dur, perSec: abilityDamage(power, ab.hot.mul, lvl) / ab.hot.dur, src: p.id });
    } else {
      if (ab.radius) {
        this.emit({ type: 'nova', id: p.id, ability: abilityId, radius: ab.radius, x: p.x, z: p.z });
        for (const e of this.enemies.values()) {
          if (!e.alive || dist(e, p) > ab.radius + e.radius) continue;
          if (ab.power) this.damageEnemy(e, p, abilityDamage(power, ab.power, lvl), crit(), ab.threat);
          if (ab.debuff) addBuff(e, { id: ab.debuff.id, until: this.time + ab.debuff.dur, mul: ab.debuff.mul });
        }
        if (ab.heal) for (const a of this.players.values()) if (a.alive && dist(a, p) <= ab.radius) this.healPlayer(a, p, abilityDamage(power, ab.heal, lvl), false);
      }
      if (ab.buff) {
        const b = { id: ab.buff.id, until: this.time + ab.buff.dur };
        if (ab.buff.dr) b.dr = ab.buff.dr;
        if (ab.buff.absorbMul) b.absorb = abilityDamage(power, ab.buff.absorbMul, lvl);
        addBuff(p, b);
        this.emit({ type: 'buff', id: p.id, buff: b.id });
      }
    }
    p.lastCombat = this.time;
  }

  fail(p, text) { this.emit({ type: 'error', to: p.id, text }); }

  cmdAccept(p, qid) {
    const q = questById[qid];
    if (!q || !this.questAvailable(p, q)) return;
    p.quests[qid] = { state: 'active', progress: q.objectives.map(() => 0) };
    p.privateVersion++;
    this.emit({ type: 'quest', to: p.id, text: `Quest accepted: ${q.name}` });
  }

  cmdTurnIn(p, qid) {
    const q = questById[qid];
    const st = p.quests[qid];
    if (!q || !st || st.state !== 'done') return;
    if (dist(p, this.npcs[0]) > 2.5) return this.fail(p, 'Walk back to the Keeper to turn in');
    const item = makeItem({ cls: p.cls, level: Math.max(p.level, q.level), slot: q.reward.item.slot, rarity: q.reward.item.rarity, rng: this.rng });
    if (p.bag.length >= BAG_SIZE) return this.fail(p, 'Your bags are full');
    p.bag.push(item);
    p.gold += q.reward.gold;
    st.state = q.repeatable ? 'repeat' : 'complete';
    if (q.repeatable) st.availableAt = Date.now() + 20 * 3600 * 1000;
    this.emit({ type: 'quest', to: p.id, text: `Quest complete: ${q.name}`, reward: { gold: q.reward.gold, item: item.name, rarity: item.rarity } });
    this.giveXp(p, q.reward.xp);
    p.privateVersion++;
  }

  questAvailable(p, q) {
    const st = p.quests[q.id];
    if (st && st.state === 'repeat' && q.repeatable && (st.availableAt || 0) <= Date.now()) return true;
    if (st) return false;
    if (q.requires && p.quests[q.requires]?.state !== 'complete') return false;
    return p.level >= q.level - 1;
  }

  cmdEquip(p, index) {
    const item = p.bag[index];
    if (!item || item.kind !== 'gear') return;
    if (item.cls && item.cls !== p.cls) return this.fail(p, `Only a ${CLASSES[item.cls].name} can use that`);
    const prev = p.equipment[item.slot];
    p.bag.splice(index, 1);
    if (prev) p.bag.push(prev);
    p.equipment[item.slot] = item;
    this.recalc(p);
    this.emit({ type: 'gear', id: p.id });
  }

  cmdUnequip(p, slot) {
    const item = p.equipment[slot];
    if (!item) return;
    if (p.bag.length >= BAG_SIZE) return this.fail(p, 'Your bags are full');
    delete p.equipment[slot];
    p.bag.push(item);
    this.recalc(p);
    this.emit({ type: 'gear', id: p.id });
  }

  cmdUse(p, index) {
    const item = p.bag[index];
    if (!item || item.kind !== 'consumable' || !p.alive) return;
    const v = VENDOR.find((x) => x.id === item.vendorId);
    if ((p.cds.potion || 0) > this.time) return this.fail(p, 'Potion not ready');
    p.cds.potion = this.time + 10;
    if (v.use.heal) this.healPlayer(p, p, p.maxHp * v.use.heal, false);
    if (v.use.mana && CLASSES[p.cls].resource === 'mana') p.res = Math.min(p.maxRes, p.res + p.maxRes * v.use.mana);
    p.bag.splice(index, 1);
    p.privateVersion++;
  }

  cmdSell(p, index) {
    const item = p.bag[index];
    if (!item) return;
    if (dist(p, this.npcs[1]) > 2.5) return this.fail(p, 'Walk to the pedlar to sell');
    p.bag.splice(index, 1);
    p.gold += item.value;
    p.privateVersion++;
  }

  cmdBuy(p, id) {
    const v = VENDOR.find((x) => x.id === id);
    if (!v) return;
    if (dist(p, this.npcs[1]) > 2.5) return this.fail(p, 'Walk to the pedlar to buy');
    if (p.gold < v.price) return this.fail(p, 'Not enough gold');
    if (p.bag.length >= BAG_SIZE) return this.fail(p, 'Your bags are full');
    p.gold -= v.price;
    p.bag.push(makeConsumable(id));
    p.privateVersion++;
  }

  // Loot bags on the floor belong to one player (personal loot): walk to it or
  // tap it within reach.
  cmdLoot(p, lootId) {
    const l = this.loot.get(lootId);
    if (!l || l.owner !== p.id) return;
    if (dist(p, l) > 1.5) return this.fail(p, 'Walk closer to the loot');
    this.takeLoot(p, l);
  }

  takeLoot(p, l) {
    if (l.item && p.bag.length >= BAG_SIZE) return this.fail(p, 'Your bags are full');
    if (l.item) p.bag.push(l.item);
    p.gold += l.gold || 0;
    this.loot.delete(l.id);
    this.emit({ type: 'looted', to: p.id, gold: l.gold, item: l.item?.name, rarity: l.item?.rarity });
    p.privateVersion++;
  }

  autoPickup(p) {
    for (const l of this.loot.values()) if (l.owner === p.id && dist(p, l) < 0.6) this.takeLoot(p, l);
    for (const k of this.pickups.values()) {
      if (dist(p, k) > 0.55) continue;
      if (!this.needsPickup(p, k.type)) continue;
      this.pickups.delete(k.id);
      this.progress(p, 'collect', k.type);
      this.emit({ type: 'pickup', id: p.id, kind: k.type, x: k.x, z: k.z });
    }
  }

  needsPickup(p, type) {
    for (const [qid, st] of Object.entries(p.quests)) {
      if (st.state !== 'active') continue;
      const q = questById[qid];
      if (q.objectives.some((o, i) => o.kind === 'collect' && o.target === type && st.progress[i] < o.count)) return true;
    }
    return false;
  }

  progress(p, kind, target) {
    for (const [qid, st] of Object.entries(p.quests)) {
      if (st.state !== 'active') continue;
      const q = questById[qid];
      let changed = false;
      q.objectives.forEach((o, i) => {
        if (o.kind !== kind) return;
        if (o.target !== target && !(o.target === 'any' && kind === 'kill')) return;
        if (st.progress[i] >= o.count) return;
        st.progress[i]++;
        changed = true;
      });
      if (changed) {
        p.privateVersion++;
        if (q.objectives.every((o, i) => st.progress[i] >= o.count)) {
          st.state = 'done';
          this.emit({ type: 'quest', to: p.id, text: `${q.name}: return to the Keeper` });
        }
      }
    }
  }

  // -------------------------------------------------------------- combat ---

  damageEnemy(e, src, amount, crit, threatMul = 1) {
    if (!e.alive) return;
    amount = Math.round(amount * (crit ? 2 : 1) * (0.9 + this.rng() * 0.2));
    e.hp -= amount;
    e.threat.set(src.id, (e.threat.get(src.id) || 0) + amount * threatMul * (src.cls === 'warrior' ? 2.5 : 1));
    e.lastHit = this.time;
    src.lastCombat = this.time;
    this.emit({ type: 'dmg', id: e.id, src: src.id, amount, crit });
    if (src.cls === 'warrior') src.res = Math.min(src.maxRes, src.res + amount * 0.08);
    if (e.hp <= 0) this.killEnemy(e);
  }

  taunt(e, p) {
    let top = 0;
    for (const v of e.threat.values()) top = Math.max(top, v);
    e.threat.set(p.id, top + 50);
    e.target = p.id;
  }

  killEnemy(e) {
    e.alive = false;
    e.hp = 0;
    e.diedAt = this.time;
    const def = ENEMIES[e.type];
    this.emit({ type: 'death', id: e.id, x: e.x, z: e.z });
    // Everyone in the room who fought it or stands near it gets credit.
    for (const p of this.players.values()) {
      const engaged = e.threat.has(p.id) || dist(p, e) < 8;
      if (!engaged) continue;
      const lvlDiff = e.level - p.level;
      const xp = Math.round(def.xp * enemyLevelScale(e.level) * clamp(1 + lvlDiff * 0.15, 0.2, 1.5));
      this.giveXp(p, xp);
      this.progress(p, 'kill', e.type);
      this.dropLoot(p, e, def);
    }
    if (def.boss) this.emit({ type: 'banner', text: 'The rift is closing! The Colossus has fallen.' });
  }

  dropLoot(p, e, def) {
    const gold = Math.round(def.gold[0] + this.rng() * (def.gold[1] - def.gold[0]));
    let item = null;
    let rolls = def.loot >= 1 ? def.loot : (this.rng() < def.loot ? 1 : 0);
    const items = [];
    while (rolls-- > 0) {
      const rarity = rollRarity(this.rng, def.minRarity || 'poor');
      items.push(makeItem({ cls: p.cls, level: e.level, slot: 'random', rarity, rng: this.rng }));
    }
    item = items.shift() || null;
    const drop = (it, g, k) => {
      const a = this.rng() * Math.PI * 2;
      const r = 0.25 + k * 0.3;
      const id = this.nextId('l');
      this.loot.set(id, { id, owner: p.id, x: e.x + Math.cos(a) * r, z: e.z + Math.sin(a) * r, gold: g, item: it, expires: this.time + 120 });
    };
    drop(item, gold, 0);
    items.forEach((it, k) => drop(it, 0, k + 1));
  }

  giveXp(p, xp) {
    if (p.level >= MAX_LEVEL) return;
    p.xp += xp;
    this.emit({ type: 'xp', to: p.id, amount: xp });
    while (p.level < MAX_LEVEL && p.xp >= xpForLevel(p.level)) {
      p.xp -= xpForLevel(p.level);
      p.level++;
      this.recalc(p, true);
      this.emit({ type: 'levelup', id: p.id, level: p.level });
    }
    p.privateVersion++;
  }

  healPlayer(t, src, amount, crit) {
    if (!t.alive) return;
    amount = Math.round(amount * (crit ? 1.5 : 1));
    const before = t.hp;
    t.hp = Math.min(t.maxHp, t.hp + amount);
    if (t.hp - before > 0) this.emit({ type: 'heal', id: t.id, src: src.id, amount: Math.round(t.hp - before), crit });
    // Healing draws attention from enemies fighting the healed player.
    for (const e of this.enemies.values()) if (e.alive && e.threat.has(t.id)) e.threat.set(src.id, (e.threat.get(src.id) || 0) + amount * 0.5);
  }

  damagePlayer(p, amount, src) {
    if (!p.alive) return;
    for (const b of p.buffs) if (b.dr) amount *= 1 - b.dr;
    amount *= 1 - p.stats.dr;
    amount = Math.round(amount * (0.9 + this.rng() * 0.2));
    const shield = p.buffs.find((b) => b.absorb > 0);
    if (shield) {
      const soak = Math.min(shield.absorb, amount);
      shield.absorb -= soak;
      amount -= soak;
      if (shield.absorb <= 0) p.buffs = p.buffs.filter((b) => b !== shield);
    }
    p.hp -= amount;
    p.lastCombat = this.time;
    if (p.cls === 'warrior') p.res = Math.min(p.maxRes, p.res + amount * 0.5);
    this.emit({ type: 'hurt', id: p.id, src: src?.id, amount });
    if (p.hp <= 0) {
      p.hp = 0;
      p.alive = false;
      p.respawnAt = this.time + RESPAWN_TIME;
      p.buffs = [];
      this.emit({ type: 'died', id: p.id, name: p.name });
      for (const e of this.enemies.values()) e.threat.delete(p.id);
    }
  }

  // ------------------------------------------------------------- spawning ---

  // Keep a population that matches what the players' quests need, scaled by
  // party size. Spawns happen away from players, inside the arena.
  wantedSpawns() {
    const want = { imp: 0, wisp: 0, hound: 0, warden: 0, colossus: 0 };
    const pick = { shard: 0, ember: 0 };
    let level = 1;
    const players = [...this.players.values()];
    for (const p of players) {
      level = Math.max(level, p.level);
      for (const [qid, st] of Object.entries(p.quests)) {
        if (st.state !== 'active') continue;
        const q = questById[qid];
        q.objectives.forEach((o, i) => {
          if (st.progress[i] >= o.count) return;
          if (o.kind === 'collect') pick[o.target] = Math.max(pick[o.target], 3);
          else if (o.target === 'warden' || o.target === 'colossus') want[o.target] = 1;
          else if (o.target === 'any') want.imp = Math.max(want.imp, 2);
          else if (want[o.target] !== undefined) want[o.target] = Math.max(want[o.target], 3);
        });
      }
    }
    if (players.length && Object.values(want).every((v) => v === 0)) want.imp = 2; // ambient
    const scale = 1 + (players.length - 1) * 0.5;
    for (const k of ['imp', 'wisp', 'hound']) want[k] = Math.round(want[k] * scale);
    return { want, pick, level };
  }

  spawnPoint(minFromPlayers = 1.6, opts = {}) {
    if (this.map) return this.worldSpawnPoint(minFromPlayers, opts);
    for (let tries = 0; tries < 20; tries++) {
      const a = this.rng() * Math.PI * 2;
      const r = this.arenaRadius * (0.45 + this.rng() * 0.55);
      const pt = { x: Math.cos(a) * r, z: Math.sin(a) * r };
      let ok = true;
      for (const p of this.players.values()) if (dist(p, pt) < minFromPlayers) ok = false;
      if (ok) return pt;
    }
    const a = this.rng() * Math.PI * 2;
    return { x: Math.cos(a) * this.arenaRadius, z: Math.sin(a) * this.arenaRadius };
  }

  // Spawn in the zones where players are and the zones next to them, so the
  // fight comes to the party instead of filling an empty bedroom.
  worldSpawnPoint(minFromPlayers, { nearFurniture = false } = {}) {
    const m = this.map;
    const active = new Set();
    for (const p of this.players.values()) {
      const z = m.zoneAt(p.x, p.z);
      if (!z) continue;
      active.add(z.id);
      for (const l of m.links) { if (l.a === z.id) active.add(l.b); if (l.b === z.id) active.add(l.a); }
    }
    const zones = active.size ? m.zones.filter((z) => active.has(z.id)) : null;
    const avoid = [...this.players.values()];
    return m.randomPoint(this.rng, { zones, avoid, minDist: minFromPlayers, nearFurniture })
      || m.snap(m.hearth.x, m.hearth.z);
  }

  spawnEnemy(type, level, at) {
    const def = ENEMIES[type];
    const pt = at || this.spawnPoint();
    if (this.map && !at) level += this.map.zoneLevel(this.map.zoneAt(pt.x, pt.z));
    const id = this.nextId('e');
    const partySize = Math.max(1, this.players.size);
    const hpMul = enemyLevelScale(level) * (def.elite || def.boss ? 1 + (partySize - 1) * 0.7 : 1);
    const e = {
      id, kind: 'enemy', type, name: def.name, level, x: pt.x, z: pt.z, facing: 0,
      hp: Math.round(def.hp * hpMul), maxHp: Math.round(def.hp * hpMul), alive: true,
      radius: def.scale * 0.5, threat: new Map(), target: null, attackAt: this.time + 1.5,
      windup: null, buffs: [], summonAt: this.time + (def.summon?.every || 0), spawnedAt: this.time,
    };
    this.enemies.set(id, e);
    this.emit({ type: 'spawn', id, enemy: type, x: e.x, z: e.z });
    return e;
  }

  updateSpawns(dt) {
    this.spawnTimer -= dt;
    if (this.spawnTimer > 0) return;
    this.spawnTimer = 2.5;
    if (!this.players.size) return;
    const { want, pick, level } = this.wantedSpawns();
    const alive = {};
    for (const e of this.enemies.values()) if (e.alive) alive[e.type] = (alive[e.type] || 0) + 1;
    for (const [type, n] of Object.entries(want)) {
      if ((alive[type] || 0) < n) {
        const lvl = type === 'warden' ? Math.max(4, level) : type === 'colossus' ? Math.max(6, level + 1) : Math.max(1, level - (this.rng() < 0.5 ? 1 : 0));
        this.spawnEnemy(type, lvl);
        if (ENEMIES[type].boss) this.emit({ type: 'banner', text: 'The Rift Colossus tears through!' });
        else if (ENEMIES[type].elite) this.emit({ type: 'banner', text: 'A Rift Warden emerges.' });
        break; // one spawn per wave keeps arrivals readable
      }
    }
    const have = {};
    for (const k of this.pickups.values()) have[k.type] = (have[k.type] || 0) + 1;
    for (const [type, n] of Object.entries(pick)) {
      if ((have[type] || 0) < n) {
        const pt = this.spawnPoint(1.0, { nearFurniture: true });
        const id = this.nextId('k');
        this.pickups.set(id, { id, type, name: PICKUPS[type].name, x: pt.x, z: pt.z });
      }
    }
    for (const [id, k] of this.pickups) if (!pick[k.type]) this.pickups.delete(id);
  }

  // --------------------------------------------------------------- AI ---

  updateEnemies(dt) {
    for (const [id, e] of this.enemies) {
      if (!e.alive) {
        if (this.time - e.diedAt > 4) this.enemies.delete(id);
        continue;
      }
      e.buffs = e.buffs.filter((b) => b.until > this.time);
      const def = ENEMIES[e.type];
      // choose target: highest threat, else nearest player within aggro range
      let target = null;
      let best = -1;
      for (const [pid, v] of e.threat) {
        const p = this.players.get(pid);
        if (p && p.alive && v > best) { best = v; target = p; }
      }
      if (!target) {
        let nd = def.aggro;
        for (const p of this.players.values()) {
          if (!p.alive) continue;
          const d = dist(p, e);
          if (d < nd) { nd = d; target = p; }
        }
        if (target) e.threat.set(target.id, 1);
      }
      e.target = target?.id || null;

      // Wind-up: the attack lands where the circle was drawn, so players can
      // physically step out of it.
      if (e.windup) {
        if (this.time >= e.windup.at) {
          for (const p of this.players.values()) {
            if (p.alive && dist(p, e.windup) <= e.windup.r) this.damagePlayer(p, def.dmg * enemyLevelScale(e.level), e);
          }
          this.emit({ type: 'slam', id: e.id, x: e.windup.x, z: e.windup.z, r: e.windup.r });
          e.windup = null;
          e.attackAt = this.time + def.attackCd;
        }
        continue;
      }
      if (!target) continue;

      if (def.summon && this.time >= e.summonAt) {
        e.summonAt = this.time + def.summon.every;
        for (let i = 0; i < def.summon.count; i++) {
          const a = this.rng() * Math.PI * 2;
          this.spawnEnemy(def.summon.type, Math.max(1, e.level - 2), { x: e.x + Math.cos(a) * 1.2, z: e.z + Math.sin(a) * 1.2 });
        }
      }

      const d = dist(e, target);
      e.facing = Math.atan2(target.x - e.x, target.z - e.z);
      const reach = def.range + e.radius;
      if (d > reach * 0.9) {
        if (hasDebuff(e, 'root')) continue;
        const slow = e.buffs.find((b) => b.id === 'slow');
        const sp = def.speed * (slow ? slow.mul : 1) * dt;
        const step = Math.min(sp, d - reach * 0.8);
        if (this.map) this.walkToward(e, target, step);
        else {
          e.x += ((target.x - e.x) / d) * step;
          e.z += ((target.z - e.z) / d) * step;
        }
      }
      if (d <= reach && this.time >= e.attackAt) {
        // Telegraph: melee lands on the enemy's front, ranged on the player.
        const tx = def.ranged ? target.x : e.x + Math.sin(e.facing) * (def.range * 0.6);
        const tz = def.ranged ? target.z : e.z + Math.cos(e.facing) * (def.range * 0.6);
        const r = def.aoe;
        // Safety for walking players: never ask a real body to dodge on stairs,
        // by the bath or the stove. Seated players' avatars have no such limit.
        if (this.map && target.mode === 'body' && (this.map.isHazard(tx, tz) || this.map.isHazard(target.x, target.z))) { e.attackAt = this.time + 0.5; continue; }
        e.windup = { x: tx, z: tz, r, at: this.time + def.windup, dur: def.windup };
        this.emit({ type: 'telegraph', id: e.id, x: tx, z: tz, r, dur: def.windup });
      }
      // Separation so a pack doesn't stack into one model.
      for (const o of this.enemies.values()) {
        if (o === e || !o.alive) continue;
        const dd = dist(e, o);
        const min = e.radius + o.radius;
        if (dd > 0.001 && dd < min) {
          const push = (min - dd) * 0.5;
          const nx = e.x + ((e.x - o.x) / dd) * push;
          const nz = e.z + ((e.z - o.z) / dd) * push;
          if (!this.map || this.map.walkable(nx, nz)) { e.x = nx; e.z = nz; }
        }
      }
    }
  }

  // Move an enemy toward a target around furniture: straight when the line is
  // clear, otherwise along an A* path that is refreshed twice a second.
  walkToward(e, target, step) {
    const m = this.map;
    let goal = target;
    if (!m.clearLine(e, target)) {
      if (!e.path || this.time >= e.pathAt || e.pathFor !== target.id) {
        e.path = m.path(e, target) || [];
        e.pathAt = this.time + 0.5;
        e.pathFor = target.id;
      }
      while (e.path.length && Math.hypot(e.path[0].x - e.x, e.path[0].z - e.z) < 0.12) e.path.shift();
      if (e.path.length) goal = e.path[0];
    } else e.path = null;
    const d = Math.hypot(goal.x - e.x, goal.z - e.z);
    if (d < 1e-4) return;
    const k = Math.min(step, d) / d;
    const nx = e.x + (goal.x - e.x) * k;
    const nz = e.z + (goal.z - e.z) * k;
    if (m.walkable(nx, nz) || !m.walkable(e.x, e.z)) { e.x = nx; e.z = nz; }
    if (goal !== target) e.facing = Math.atan2(goal.x - e.x, goal.z - e.z);
  }

  updatePlayers(dt) {
    for (const p of this.players.values()) {
      if (!p.alive) {
        if (this.time >= p.respawnAt) {
          p.alive = true;
          p.hp = Math.round(p.maxHp * 0.5);
          if (p.mode === 'avatar' || !this.map) Object.assign(p, this.homePoint());
          this.emit({ type: 'respawn', id: p.id });
        }
        continue;
      }
      p.buffs = p.buffs.filter((b) => b.until > this.time);
      for (const b of p.buffs) if (b.id === 'hot') p.hp = Math.min(p.maxHp, p.hp + b.perSec * dt);
      const res = RESOURCES[CLASSES[p.cls].resource];
      const outOfCombat = this.time - p.lastCombat > COMBAT_TIMEOUT;
      if (CLASSES[p.cls].resource === 'mana') p.res = Math.min(p.maxRes, p.res + (p.stats.spi * 0.12 + (outOfCombat ? p.maxRes * 0.04 : 0)) * dt);
      else if (res.regen > 0) p.res = Math.min(p.maxRes, p.res + res.regen * dt);
      else if (outOfCombat) p.res = Math.max(0, p.res - 3 * dt);
      if (outOfCombat) p.hp = Math.min(p.maxHp, p.hp + p.maxHp * 0.03 * dt);
      if (p.target && !this.enemies.get(p.target)?.alive && !this.players.has(p.target)) p.target = null;
    }
    for (const [id, l] of this.loot) if (l.expires < this.time) this.loot.delete(id);
  }

  step(dt) {
    this.time += dt;
    this.updatePlayers(dt);
    this.updateEnemies(dt);
    this.updateSpawns(dt);
  }

  // ------------------------------------------------------------ snapshots ---

  // Public state for everyone plus private state (bags, quests) for one player
  // when it has changed. Events addressed to a player go only to that player.
  snapshot(forId, events) {
    const r1 = (v) => Math.round(v * 100) / 100;
    const snap = {
      t: r1(this.time),
      players: [...this.players.values()].map((p) => ({
        id: p.id, name: p.name, cls: p.cls, level: p.level, x: r1(p.x), z: r1(p.z), f: r1(p.facing),
        hp: Math.round(p.hp), maxHp: p.maxHp, res: Math.round(p.res), maxRes: p.maxRes, alive: p.alive,
        target: p.target, buffs: p.buffs.map((b) => b.id),
        look: Object.fromEntries(SLOTS.map((s) => [s, p.equipment[s] ? p.equipment[s].rarity : null])),
      })),
      enemies: [...this.enemies.values()].map((e) => ({
        id: e.id, type: e.type, name: e.name, level: e.level, x: r1(e.x), z: r1(e.z), f: r1(e.facing),
        hp: Math.max(0, Math.round(e.hp)), maxHp: e.maxHp, alive: e.alive, target: e.target,
        wind: e.windup ? { x: r1(e.windup.x), z: r1(e.windup.z), r: e.windup.r, left: r1(e.windup.at - this.time), dur: e.windup.dur } : null,
        buffs: e.buffs.map((b) => b.id),
      })),
      pickups: [...this.pickups.values()].map((k) => ({ id: k.id, type: k.type, x: r1(k.x), z: r1(k.z) })),
      loot: [...this.loot.values()].filter((l) => l.owner === forId).map((l) => ({ id: l.id, x: r1(l.x), z: r1(l.z), rarity: l.item?.rarity || null })),
      npcs: this.npcs,
      arena: this.arenaRadius,
      events: (events || []).filter((ev) => !ev.to || ev.to === forId),
    };
    const p = this.players.get(forId);
    if (p && p.privateVersion !== p.sentVersion) {
      p.sentVersion = p.privateVersion;
      snap.me = {
        id: p.id, xp: p.xp, xpNext: xpForLevel(p.level), gold: p.gold, stats: p.stats, equipment: p.equipment, bag: p.bag,
        quests: p.quests,
        available: QUESTS.filter((q) => this.questAvailable(p, q)).map((q) => q.id),
      };
    }
    if (p) snap.cds = Object.fromEntries(Object.entries(p.cds).map(([k, v]) => [k, r1(Math.max(0, v - this.time))]));
    return snap;
  }

  drainEvents() {
    const ev = this.events;
    this.events = [];
    return ev;
  }
}

function hasDebuff(x, id) { return x.buffs.some((b) => b.id === id); }
function addBuff(x, b) {
  x.buffs = x.buffs.filter((o) => !(o.id === b.id && (!b.src || o.src === b.src)));
  x.buffs.push(b);
}

export { rarityById };
