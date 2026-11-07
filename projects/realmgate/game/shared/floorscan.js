// Floor-paint scanning for any AR phone (ARCore on Android, ARKit on iPhone),
// no LiDAR needed. While scanning, the reticle "paints" floor cells it passes
// over; hits on the sofa seat or a table top are higher than the floor and are
// ignored. A zone's floor is the outline of its painted cells, and unpainted
// gaps inside that outline become obstacles (the sofa you couldn't paint under).
//
// Cells are keyed "i,j" in arena space (metres / CELL), the frame set by the two
// alignment taps: origin at the rift, +z toward the second tap.

export const CELL = 0.2;
export const FLOOR_TOLERANCE = 0.12; // a hit within 12 cm of the rift spot's height counts as floor

export const cellKey = (x, z) => `${Math.floor(x / CELL)},${Math.floor(z / CELL)}`;
const parse = (k) => k.split(',').map(Number);

function hull(points) {
  const pts = [...new Map(points.map((p) => [`${p[0]},${p[1]}`, p])).values()].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (pts.length < 3) return pts;
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const p of pts) { while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), p) <= 0) lower.pop(); lower.push(p); }
  const upper = [];
  for (const p of pts.slice().reverse()) { while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), p) <= 0) upper.pop(); upper.push(p); }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

function inside(x, z, poly) {
  let r = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i]; const [xj, zj] = poly[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) r = !r;
  }
  return r;
}

// Turn a set of painted cell keys into a world zone.
export function zoneFromCells(keys, { id, name, kind = 'room', theme }) {
  const cells = [...keys].map(parse);
  if (cells.length < 6) throw new Error('Paint more of the floor first.');
  const corners = [];
  for (const [i, j] of cells) corners.push([i * CELL, j * CELL], [(i + 1) * CELL, j * CELL], [i * CELL, (j + 1) * CELL], [(i + 1) * CELL, (j + 1) * CELL]);
  const floor = hull(corners);
  const painted = new Set(keys);
  const is = cells.map((c) => c[0]); const js = cells.map((c) => c[1]);
  const [i0, i1, j0, j1] = [Math.min(...is), Math.max(...is), Math.min(...js), Math.max(...js)];
  // Unpainted cells inside the outline, merged into runs along x per row.
  const objects = [];
  for (let j = j0; j <= j1; j++) {
    let run = null;
    for (let i = i0; i <= i1 + 1; i++) {
      const cx = (i + 0.5) * CELL; const cz = (j + 0.5) * CELL;
      const gap = i <= i1 && !painted.has(`${i},${j}`) && inside(cx, cz, floor);
      if (gap) run = run ? { ...run, i1: i } : { i0: i, i1: i };
      else if (run) {
        const w = (run.i1 - run.i0 + 1) * CELL;
        objects.push({ cat: 'clutter', x: run.i0 * CELL + w / 2, y: 0.4, z: (j + 0.5) * CELL, w, h: 0.8, d: CELL, yaw: 0 });
        run = null;
      }
    }
  }
  return {
    id, name, kind, theme: theme || (kind === 'outdoor' ? 'wilds' : kind === 'hall' ? 'gloam' : 'hearth'),
    floorY: 0, floor, walls: [], openings: [], objects: objects.slice(0, 250), cells: [...keys],
  };
}

// Zones whose painted cells come within 0.6 m are joined at the midpoint.
export function linkZones(zones) {
  const links = [];
  for (let a = 0; a < zones.length; a++) {
    for (let b = a + 1; b < zones.length; b++) {
      let best = null;
      const cb = zones[b].cells.map(parse);
      for (const [i, j] of zones[a].cells.map(parse)) {
        for (const [k, l] of cb) {
          const d = Math.hypot(i - k, j - l) * CELL;
          if (!best || d < best.d) best = { d, x: ((i + k) / 2 + 0.5) * CELL, z: ((j + l) / 2 + 0.5) * CELL };
        }
      }
      if (best && best.d <= 0.6) links.push({ a: zones[a].id, b: zones[b].id, x: best.x, z: best.z, w: 0.9 });
    }
  }
  return links;
}

export function buildWorld(zones, name = 'My home') {
  const home = zones.find((z) => z.cells.includes(cellKey(0.01, 0.01))) || zones[0];
  return {
    v: 1, id: `w${Date.now().toString(36)}`, name,
    hearth: { x: 0, z: 0, zone: home.id },
    zones,
    links: linkZones(zones),
  };
}

// Heroes are action-figure sized in your real room: a scan in real metres is
// played in "game metres" scaled up by 1 / HERO_SCALE, and AR shows the game
// world scaled down by HERO_SCALE. A 5 x 4 m living room becomes a 12.5 x 10 m
// battlefield and a 1.7 m hero stands about 68 cm tall on your rug.
export const HERO_SCALE = 0.4;

export function scaleWorld(w, f) {
  const p2 = ([x, z]) => [x * f, z * f];
  return {
    ...w,
    hearth: w.hearth && { ...w.hearth, x: w.hearth.x * f, z: w.hearth.z * f },
    zones: w.zones.map((z) => ({
      ...z,
      floorY: (z.floorY || 0) * f,
      floor: z.floor.map(p2),
      walls: (z.walls || []).map((k) => ({ ...k, a: p2(k.a), b: p2(k.b), h: k.h * f, t: k.t * f })),
      openings: (z.openings || []).map((o) => ({ ...o, x: o.x * f, y: o.y * f, z: o.z * f, w: o.w * f, h: o.h * f })),
      objects: (z.objects || []).map((o) => ({ ...o, x: o.x * f, y: o.y * f, z: o.z * f, w: o.w * f, h: o.h * f, d: o.d * f })),
      cells: undefined,
    })),
    links: (w.links || []).map((l) => ({ ...l, x: l.x * f, z: l.z * f, w: l.w * f })),
  };
}
