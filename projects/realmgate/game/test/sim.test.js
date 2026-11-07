import test from 'node:test';
import assert from 'node:assert/strict';
import { Sim } from '../shared/sim.js';
import { CLASSES, QUESTS, makeItem, computeStats } from '../shared/data.js';

function seeded(seed = 1) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}
const run = (sim, secs) => { for (let i = 0; i < secs * 20; i++) sim.step(0.05); };

test('every class joins with stats, starter gear and abilities', () => {
  const sim = new Sim({ rng: seeded() });
  for (const cls of Object.keys(CLASSES)) {
    const p = sim.join(cls, { name: cls, cls });
    assert.ok(p.maxHp > 0 && p.stats.power > 0);
    assert.ok(p.equipment.chest && p.equipment.weapon);
  }
});

test('accepting the first quest spawns imps and killing them completes it', () => {
  const sim = new Sim({ rng: seeded(7) });
  const p = sim.join('a', { name: 'A', cls: 'mage' });
  sim.handle('a', { t: 'accept', id: 'q1' });
  assert.equal(p.quests.q1.state, 'active');
  let guard = 0;
  while (p.quests.q1.state === 'active' && guard++ < 4000) {
    sim.step(0.05);
    p.hp = p.maxHp; p.res = p.maxRes; // keep the test about the quest loop
    const imp = [...sim.enemies.values()].find((e) => e.alive);
    if (imp) {
      p.x = imp.x; p.z = imp.z - 2; // stand in range
      sim.handle('a', { t: 'cast', ability: 'fireball', target: imp.id });
    }
  }
  assert.equal(p.quests.q1.state, 'done');
  p.x = 0; p.z = 1;
  const bag = p.bag.length;
  sim.handle('a', { t: 'turnin', id: 'q1' });
  assert.equal(p.quests.q1.state, 'complete');
  assert.equal(p.bag.length, bag + 1);
  assert.ok(sim.snapshot('a', []).me.available.includes('q2'));
});

test('stepping out of a telegraph avoids the hit', () => {
  const sim = new Sim({ rng: seeded(3) });
  const p = sim.join('a', { name: 'A', cls: 'warrior' });
  const e = sim.spawnEnemy('warden', 4, { x: 0, z: 2.5 });
  p.x = 0; p.z = 1.2;
  let telegraphed = false;
  for (let i = 0; i < 200 && !telegraphed; i++) { sim.step(0.05); telegraphed = !!e.windup; }
  assert.ok(telegraphed);
  const hp = p.hp;
  p.x = 3; p.z = -1; // walk away in real life
  run(sim, 2);
  assert.equal(p.hp >= hp, true);
});

test('equipping gear changes stats and armour type is class-bound', () => {
  const sim = new Sim({ rng: seeded(5) });
  const p = sim.join('a', { name: 'A', cls: 'warrior' });
  const before = p.stats.str;
  p.bag.push(makeItem({ cls: 'warrior', level: 5, slot: 'head', rarity: 'epic', rng: seeded(2) }));
  sim.handle('a', { t: 'equip', index: p.bag.length - 1 });
  assert.ok(p.stats.str > before);
  p.bag.push(makeItem({ cls: 'mage', level: 5, slot: 'hands', rarity: 'rare' }));
  sim.handle('a', { t: 'equip', index: p.bag.length - 1 });
  assert.equal(p.equipment.hands, undefined);
});

test('kills credit the whole room and level-ups raise health', () => {
  const sim = new Sim({ rng: seeded(9) });
  const a = sim.join('a', { name: 'A', cls: 'ranger' });
  const b = sim.join('b', { name: 'B', cls: 'cleric' });
  const hp1 = a.maxHp;
  for (let i = 0; i < 12; i++) {
    const e = sim.spawnEnemy('hound', 3, { x: a.x, z: a.z - 3 });
    sim.killEnemy(e);
  }
  assert.ok(a.level > 1 && b.level > 1);
  assert.ok(a.maxHp > hp1);
});

test('saves round-trip through join', () => {
  const sim = new Sim({ rng: seeded(4) });
  const p = sim.join('a', { name: 'A', cls: 'cleric' });
  p.gold = 99; sim.giveXp(p, 5000);
  const save = sim.saveOf('a');
  const sim2 = new Sim();
  const q = sim2.join('z', { name: 'A', cls: 'cleric', save: JSON.parse(JSON.stringify(save)) });
  assert.equal(q.gold, 99);
  assert.equal(q.level, p.level);
  assert.deepEqual(computeStats('cleric', q.level, q.equipment).maxHp, q.maxHp);
});

test('quest data is consistent', () => {
  const ids = new Set(QUESTS.map((q) => q.id));
  for (const q of QUESTS) if (q.requires) assert.ok(ids.has(q.requires), q.id);
});
