import test from 'node:test';
import assert from 'node:assert/strict';
import { Sim } from '../shared/sim.js';
import { WorldMap, sanitizeWorld } from '../shared/world.js';
import { HOME } from './fixtures.js';

const seeded = (s = 1) => () => ((s = (s * 16807) % 2147483647) / 2147483647);

test('furniture blocks the grid and zone levels grow away from the hearth', () => {
  const m = new WorldMap(HOME);
  assert.equal(m.walkable(0, -1.2), false, 'sofa blocks');
  assert.equal(m.walkable(0, 1), true);
  assert.equal(m.walkable(-3, 0), false, 'outside the floor');
  assert.equal(m.inside(2.5, 0), true, 'doorway joins zones');
  assert.ok(m.zoneLevel(m.zoneById.get('yard')) > m.zoneLevel(m.zoneById.get('hall')));
  assert.ok(m.isHazard(5.8, 0), 'stairs are a hazard');
});

test('A* walks around the sofa instead of through it', () => {
  const m = new WorldMap(HOME);
  const from = { x: 0, z: -1.9 }; const to = { x: 0, z: 0 };
  assert.equal(m.clearLine(from, to), false);
  const path = m.path(from, to);
  assert.ok(path && path.length >= 1);
  let prev = from;
  for (const p of [...path, to]) { assert.ok(m.clearLine(prev, p) || m.walkable(p.x, p.z)); prev = p; }
});

test('enemies spawn on scanned floor, never in furniture, and reach a player around it', () => {
  const sim = new Sim({ rng: seeded(3), world: HOME });
  const p = sim.join('host', { name: 'Host', cls: 'warrior' });
  sim.handle('host', { t: 'accept', id: 'q1' });
  for (let i = 0; i < 200; i++) sim.step(0.05);
  assert.ok(sim.enemies.size > 0);
  for (const e of sim.enemies.values()) assert.ok(sim.map.walkable(e.x, e.z), `${e.x},${e.z}`);
  // Put an imp behind the sofa and the player in front: it must path around.
  const imp = sim.spawnEnemy('imp', 1, { x: 0, z: -1.85 });
  p.x = 0; p.z = 0.2; p.hp = 1e6; p.maxHp = 1e6;
  for (let i = 0; i < 400; i++) { sim.step(0.05); assert.ok(sim.map.walkable(imp.x, imp.z) || i === 0); }
  assert.ok(Math.hypot(imp.x - p.x, imp.z - p.z) < 1.6, 'imp reached the player');
});

test('seated avatars (host or guest) cannot walk through the sofa; walking bodies are never blocked', () => {
  const sim = new Sim({ rng: seeded(5), world: HOME });
  const g = sim.join('guest', { name: 'Guest', cls: 'mage', mode: 'twin' });
  const h = sim.join('host', { name: 'Host', cls: 'cleric', mode: 'body' });
  const a = sim.join('seated', { name: 'Seated', cls: 'ranger' });
  a.x = 0; a.z = -0.6; a.lastMoveAt = 0.9;
  g.x = 0; g.z = -0.6; h.x = 0; h.z = -0.6;
  sim.time = 1; g.lastMoveAt = 0.9; h.lastMoveAt = 0.9;
  sim.handle('guest', { t: 'move', x: 0, z: -0.8 });
  sim.handle('host', { t: 'move', x: 0, z: -0.8 });
  sim.handle('seated', { t: 'move', x: 0, z: -0.8 });
  assert.equal(a.z, -0.6, 'seated host avatar is blocked too');
  assert.equal(g.z, -0.6);
  assert.equal(h.z, -0.8);
});

test('NPCs stand on walkable floor at the hearth; sanitize rejects junk', () => {
  const sim = new Sim({ world: HOME });
  for (const n of sim.npcs) assert.ok(sim.map.walkable(n.x, n.z));
  assert.equal(sanitizeWorld({ zones: [] }), null);
  assert.equal(sanitizeWorld({ zones: [{ floor: [[0, 0], [1, 0]] }] }), null);
  const s = sanitizeWorld(HOME);
  assert.equal(s.zones.length, 3);
  assert.equal(s.links.length, 2);
});
