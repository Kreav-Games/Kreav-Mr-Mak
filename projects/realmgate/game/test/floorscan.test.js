import test from 'node:test';
import assert from 'node:assert/strict';
import { CELL, HERO_SCALE, cellKey, zoneFromCells, buildWorld, scaleWorld } from '../shared/floorscan.js';
import { WorldMap, sanitizeWorld } from '../shared/world.js';
import { Sim } from '../shared/sim.js';

// Paint a 4 x 3 m living room except a sofa (2 x 0.8 m), then a hallway beyond it.
function paint(x0, x1, z0, z1, skip = () => false) {
  const keys = new Set();
  for (let x = x0 + CELL / 2; x < x1; x += CELL) for (let z = z0 + CELL / 2; z < z1; z += CELL) if (!skip(x, z)) keys.add(cellKey(x, z));
  return keys;
}

test('painted floor becomes a zone; the unpainted sofa becomes an obstacle', () => {
  const sofa = (x, z) => x > -1 && x < 1 && z > -1.4 && z < -0.6;
  const room = zoneFromCells(paint(-2, 2, -1.6, 1.4, sofa), { id: 'living', name: 'Living room' });
  const hall = zoneFromCells(paint(2, 5, -0.4, 0.4), { id: 'hall', name: 'Hallway', kind: 'hall' });
  const world = buildWorld([room, hall]);
  assert.equal(world.links.length, 1);
  assert.equal(world.hearth.zone, 'living');
  const m = new WorldMap(sanitizeWorld(world));
  assert.equal(m.walkable(0, -1), false, 'sofa');
  assert.equal(m.walkable(0, 0.5), true);
  assert.equal(m.walkable(3.5, 0), true, 'hallway');
  assert.ok(m.path({ x: 0, z: -1.5 }, { x: 0, z: 0.5 }), 'path around the sofa');
});

test('a world from a scan runs in the simulation with seated avatars', () => {
  const room = zoneFromCells(paint(-2, 2, -1.6, 1.4), { id: 'living', name: 'Living room' });
  const sim = new Sim({ world: sanitizeWorld(buildWorld([room])) });
  const p = sim.join('a', { name: 'A', cls: 'ranger' });
  assert.equal(p.mode, 'avatar');
  assert.ok(sim.map.walkable(p.x, p.z));
  assert.throws(() => zoneFromCells(new Set(['0,0']), { id: 'x', name: 'x' }));
});

test('hero scale: the scanned room plays 2.5x larger and keeps furniture in place', () => {
  const room = zoneFromCells(paint(-2, 2, -1.6, 1.4, (x, z) => x > -1 && x < 1 && z > -1.4 && z < -0.6), { id: 'living', name: 'Living room' });
  const big = scaleWorld(buildWorld([room]), 1 / HERO_SCALE);
  const m = new WorldMap(sanitizeWorld(big));
  assert.equal(m.walkable(0, -1 / HERO_SCALE), false, 'sofa, scaled');
  assert.equal(m.walkable(0, 0.5 / HERO_SCALE), true);
  assert.equal(m.walkable(1.9 / HERO_SCALE, 0), true, 'room edge, scaled');
});
