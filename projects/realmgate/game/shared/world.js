// Scanned worlds on the server: zone floors, furniture obstacles, a navigation
// grid for enemies, zone levels and spawn points.
//
// World format (produced by the Unity client from RoomPlan scans; metres, y up,
// Unity's left-handed frame, which equals the saved ARWorldMap's frame):
// {
//   v: 1, id, name,
//   hearth: { x, z, zone },                 // where the rift, Keeper and pedlar stand
//   zones: [{ id, name, kind, theme, floorY,
//             floor: [[x, z], ...],         // walkable outline (polygon)
//             walls: [{ a: [x, z], b: [x, z], h, t }],
//             openings: [{ kind, x, y, z, w, h, yaw }],
//             objects: [{ cat, x, y, z, w, h, d, yaw }] }],
//   links: [{ a, b, x, z, w }]              // doorways joining zones
// }

export const NAV_CELL = 0.2; // metres per navigation cell
const OBSTACLE_PAD = 0.15; // keep enemies this far from furniture
const HAZARDS = new Set(['stairs', 'bathtub', 'fireplace', 'stove', 'oven']);

export function pointInPolygon(x, z, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i];
    const [xj, zj] = poly[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

export function polygonArea(poly) {
  let a = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) a += (poly[j][0] + poly[i][0]) * (poly[j][1] - poly[i][1]);
  return Math.abs(a / 2);
}

// Is (x, z) inside an object's rotated footprint grown by `pad`?
function inFootprint(x, z, o, pad) {
  const c = Math.cos(o.yaw || 0);
  const s = Math.sin(o.yaw || 0);
  const dx = x - o.x;
  const dz = z - o.z;
  // rotate into the object's local frame (Unity yaw: clockwise seen from above)
  const lx = dx * c - dz * s;
  const lz = dx * s + dz * c;
  return Math.abs(lx) <= o.w / 2 + pad && Math.abs(lz) <= o.d / 2 + pad;
}

export class WorldMap {
  constructor(world) {
    this.world = world;
    this.zones = world.zones || [];
    this.zoneById = new Map(this.zones.map((z) => [z.id, z]));
    this.links = world.links || [];
    this.hearth = world.hearth || this.defaultHearth();
    this.levels = this.computeZoneLevels();
    this.buildGrid();
  }

  defaultHearth() {
    const z = this.zones[0];
    const c = centroid(z.floor);
    return { x: c[0], z: c[1], zone: z.id };
  }

  // Zone level grows with doorway hops from the hearth zone; outdoor zones are
  // the frontier and get a bonus.
  computeZoneLevels() {
    const levels = new Map();
    const start = this.hearth.zone || this.zones[0]?.id;
    const queue = [[start, 0]];
    const seen = new Set([start]);
    while (queue.length) {
      const [id, hops] = queue.shift();
      levels.set(id, hops);
      for (const l of this.links) {
        const next = l.a === id ? l.b : l.b === id ? l.a : null;
        if (next && !seen.has(next)) { seen.add(next); queue.push([next, hops + 1]); }
      }
    }
    for (const z of this.zones) {
      const hops = levels.has(z.id) ? levels.get(z.id) : 1;
      levels.set(z.id, hops * 2 + (z.kind === 'outdoor' ? 3 : 0));
    }
    return levels; // zone id -> level bonus
  }

  buildGrid() {
    let minX = Infinity; let minZ = Infinity; let maxX = -Infinity; let maxZ = -Infinity;
    for (const z of this.zones) for (const [x, y] of z.floor) {
      minX = Math.min(minX, x); minZ = Math.min(minZ, y); maxX = Math.max(maxX, x); maxZ = Math.max(maxZ, y);
    }
    if (!Number.isFinite(minX)) { minX = minZ = -1; maxX = maxZ = 1; }
    this.ox = minX - NAV_CELL; this.oz = minZ - NAV_CELL;
    this.w = Math.ceil((maxX - minX) / NAV_CELL) + 3;
    this.h = Math.ceil((maxZ - minZ) / NAV_CELL) + 3;
    this.walk = new Uint8Array(this.w * this.h); // 0 blocked, 1 walkable
    this.hazard = new Uint8Array(this.w * this.h); // 1 = keep spawns and telegraphs away
    this.zoneOf = new Int16Array(this.w * this.h).fill(-1);
    const objects = this.zones.flatMap((z) => z.objects || []);
    for (let gz = 0; gz < this.h; gz++) {
      for (let gx = 0; gx < this.w; gx++) {
        const x = this.ox + (gx + 0.5) * NAV_CELL;
        const z = this.oz + (gz + 0.5) * NAV_CELL;
        const idx = gz * this.w + gx;
        const zi = this.zones.findIndex((zone) => pointInPolygon(x, z, zone.floor));
        if (zi < 0 && !this.inDoorway(x, z)) continue;
        this.zoneOf[idx] = zi >= 0 ? zi : this.zoneAtDoor(x, z);
        let blocked = false;
        for (const o of objects) {
          if (inFootprint(x, z, o, OBSTACLE_PAD)) { blocked = true; if (HAZARDS.has(o.cat)) this.hazard[idx] = 1; }
          else if (HAZARDS.has(o.cat) && inFootprint(x, z, o, 0.6)) this.hazard[idx] = 1;
        }
        this.walk[idx] = blocked ? 0 : 1;
      }
    }
  }

  inDoorway(x, z) { return this.links.some((l) => Math.hypot(x - l.x, z - l.z) <= Math.max(0.45, (l.w || 0.9) / 2)); }
  zoneAtDoor(x, z) {
    const l = this.links.find((k) => Math.hypot(x - k.x, z - k.z) <= Math.max(0.45, (k.w || 0.9) / 2));
    return l ? this.zones.findIndex((zz) => zz.id === l.a) : -1;
  }

  cell(x, z) {
    const gx = Math.floor((x - this.ox) / NAV_CELL);
    const gz = Math.floor((z - this.oz) / NAV_CELL);
    if (gx < 0 || gz < 0 || gx >= this.w || gz >= this.h) return -1;
    return gz * this.w + gx;
  }

  center(idx) {
    return { x: this.ox + ((idx % this.w) + 0.5) * NAV_CELL, z: this.oz + (Math.floor(idx / this.w) + 0.5) * NAV_CELL };
  }

  walkable(x, z) { const c = this.cell(x, z); return c >= 0 && this.walk[c] === 1; }
  inside(x, z) { const c = this.cell(x, z); return c >= 0 && this.zoneOf[c] >= 0; }
  isHazard(x, z) { const c = this.cell(x, z); return c >= 0 && this.hazard[c] === 1; }

  zoneAt(x, z) {
    const c = this.cell(x, z);
    return c >= 0 && this.zoneOf[c] >= 0 ? this.zones[this.zoneOf[c]] : null;
  }

  zoneLevel(zone) { return zone ? this.levels.get(zone.id) || 0 : 0; }

  // Straight walk possible? Samples the segment every half cell.
  clearLine(a, b) {
    const d = Math.hypot(b.x - a.x, b.z - a.z);
    const n = Math.ceil(d / (NAV_CELL * 0.5));
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      if (!this.walkable(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t)) return false;
    }
    return true;
  }

  // A* over the grid (8-connected). Returns waypoints (arena metres), or null.
  path(from, to, maxNodes = 4000) {
    let s = this.cell(from.x, from.z);
    const g = this.nearestWalkable(this.cell(to.x, to.z));
    if (s < 0 || g < 0) return null;
    if (!this.walk[s]) s = this.nearestWalkable(s);
    if (s < 0) return null;
    const W = this.w;
    const cost = new Map([[s, 0]]);
    const prev = new Map();
    const open = [[this.heur(s, g), s]];
    let visited = 0;
    while (open.length && visited++ < maxNodes) {
      let bi = 0;
      for (let i = 1; i < open.length; i++) if (open[i][0] < open[bi][0]) bi = i;
      const [, cur] = open.splice(bi, 1)[0];
      if (cur === g) break;
      const cx = cur % W; const cz = Math.floor(cur / W);
      for (let dz = -1; dz <= 1; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dz) continue;
          const nx = cx + dx; const nz = cz + dz;
          if (nx < 0 || nz < 0 || nx >= W || nz >= this.h) continue;
          const n = nz * W + nx;
          if (!this.walk[n]) continue;
          if (dx && dz && (!this.walk[cz * W + nx] || !this.walk[nz * W + cx])) continue; // no corner cutting
          const c = cost.get(cur) + (dx && dz ? 1.414 : 1);
          if (c < (cost.get(n) ?? Infinity)) {
            cost.set(n, c);
            prev.set(n, cur);
            open.push([c + this.heur(n, g), n]);
          }
        }
      }
    }
    if (!prev.has(g) && s !== g) return null;
    const cells = [];
    for (let c = g; c !== undefined && c !== s; c = prev.get(c)) cells.push(c);
    cells.reverse();
    // Smooth: keep only the waypoints needed for straight segments.
    const pts = cells.map((c) => this.center(c));
    const out = [];
    let anchor = from;
    for (let i = 0; i < pts.length; i++) {
      const next = pts[i + 1];
      if (!next || !this.clearLine(anchor, next)) { out.push(pts[i]); anchor = pts[i]; }
    }
    return out;
  }

  heur(a, b) {
    const W = this.w;
    return Math.hypot((a % W) - (b % W), Math.floor(a / W) - Math.floor(b / W));
  }

  nearestWalkable(idx, maxR = 12) {
    if (idx < 0) return -1;
    if (this.walk[idx]) return idx;
    const W = this.w; const cx = idx % W; const cz = Math.floor(idx / W);
    for (let r = 1; r <= maxR; r++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
          const nx = cx + dx; const nz = cz + dz;
          if (nx < 0 || nz < 0 || nx >= W || nz >= this.h) continue;
          if (this.walk[nz * W + nx]) return nz * W + nx;
        }
      }
    }
    return -1;
  }

  // A random safe floor point in one of `zones`, at least `minDist` from every
  // point in `avoid`. `nearFurniture` prefers cells next to obstacles (pickups
  // hidden behind the sofa).
  randomPoint(rng, { zones = null, avoid = [], minDist = 1.2, nearFurniture = false } = {}) {
    const allowed = zones ? new Set(zones.map((z) => this.zones.indexOf(z))) : null;
    const candidates = [];
    for (let i = 0; i < this.walk.length; i++) {
      if (!this.walk[i] || this.hazard[i] || this.zoneOf[i] < 0) continue;
      if (allowed && !allowed.has(this.zoneOf[i])) continue;
      if (nearFurniture && !this.besideObstacle(i)) continue;
      candidates.push(i);
    }
    if (!candidates.length) return nearFurniture ? this.randomPoint(rng, { zones, avoid, minDist }) : null;
    for (let tries = 0; tries < 30; tries++) {
      const p = this.center(candidates[Math.floor(rng() * candidates.length)]);
      if (avoid.every((a) => Math.hypot(a.x - p.x, a.z - p.z) >= minDist)) return p;
    }
    return this.center(candidates[Math.floor(rng() * candidates.length)]);
  }

  besideObstacle(i) {
    const W = this.w; const x = i % W; const z = Math.floor(i / W);
    for (const [dx, dz] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) {
      const n = (z + dz) * W + (x + dx);
      if (n >= 0 && n < this.walk.length && this.zoneOf[n] >= 0 && !this.walk[n]) return true;
    }
    return false;
  }

  // A walkable spot near (x, z), for NPCs placed at the hearth.
  snap(x, z) {
    const c = this.nearestWalkable(this.cell(x, z));
    return c >= 0 ? this.center(c) : { x, z };
  }

  // Lightweight description sent to clients: the world itself plus derived zone levels.
  describe() {
    return { ...this.world, levels: Object.fromEntries(this.levels) };
  }
}

export function centroid(poly) {
  let x = 0; let z = 0;
  for (const p of poly) { x += p[0]; z += p[1]; }
  return [x / poly.length, z / poly.length];
}

// Validate and trim an uploaded world so a bad client can't hurt the server.
export function sanitizeWorld(w) {
  if (!w || typeof w !== 'object' || !Array.isArray(w.zones) || !w.zones.length) return null;
  const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
  const pt = (p) => [num(p?.[0]), num(p?.[1])];
  const zones = w.zones.slice(0, 32).map((z, i) => ({
    id: String(z.id || `z${i}`).slice(0, 40),
    name: String(z.name || `Zone ${i + 1}`).slice(0, 40),
    kind: ['room', 'hall', 'outdoor'].includes(z.kind) ? z.kind : 'room',
    theme: String(z.theme || 'hearth').slice(0, 20),
    floorY: num(z.floorY),
    floor: (z.floor || []).slice(0, 256).map(pt),
    walls: (z.walls || []).slice(0, 256).map((k) => ({ a: pt(k.a), b: pt(k.b), h: num(k.h, 2.4), t: num(k.t, 0.1) })),
    openings: (z.openings || []).slice(0, 64).map((o) => ({ kind: String(o.kind || 'door').slice(0, 10), x: num(o.x), y: num(o.y), z: num(o.z), w: num(o.w, 0.9), h: num(o.h, 2), yaw: num(o.yaw) })),
    objects: (z.objects || []).slice(0, 256).map((o) => ({ cat: String(o.cat || 'storage').slice(0, 20), x: num(o.x), y: num(o.y), z: num(o.z), w: num(o.w, 0.5), h: num(o.h, 0.5), d: num(o.d, 0.5), yaw: num(o.yaw) })),
  })).filter((z) => z.floor.length >= 3 && polygonArea(z.floor) < 2000);
  if (!zones.length) return null;
  const ids = new Set(zones.map((z) => z.id));
  const links = (w.links || []).slice(0, 64).filter((l) => ids.has(l.a) && ids.has(l.b))
    .map((l) => ({ a: String(l.a), b: String(l.b), x: num(l.x), z: num(l.z), w: num(l.w, 0.9) }));
  const h = w.hearth && ids.has(w.hearth.zone) ? { x: num(w.hearth.x), z: num(w.hearth.z), zone: String(w.hearth.zone) } : null;
  return { v: 1, id: String(w.id || 'world').slice(0, 64), name: String(w.name || 'A world').slice(0, 60), hearth: h, zones, links };
}
