// "Scan my home" in the browser (Android Chrome with ARCore). The player:
//   1. taps the rift spot and the spot it faces (remember them: the same two
//      taps line the scan up with the room next time),
//   2. walks slowly, sweeping the floor; painted cells show what was measured,
//   3. taps "Next area" for the hallway or the deck, and "Finish" to save.
// Furniture you can't paint under (the sofa) becomes an obstacle.

import * as THREE from 'three';
import { CELL, FLOOR_TOLERANCE, buildWorld, cellKey, zoneFromCells } from '../shared/floorscan.js';
import { ARController } from './ar.js';
import { sfx } from './sfx.js';

export const HOME_KEY = 'realmgate.home';
const BRUSH = [[0, 0], [CELL, 0], [-CELL, 0], [0, CELL], [0, -CELL]];
function inPoly(x, z, poly) {
  let r = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i]; const [xj, zj] = poly[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) r = !r;
  }
  return r;
}
export function loadHome() { try { return JSON.parse(localStorage.getItem(HOME_KEY)); } catch { return null; } }

const KINDS = [['room', 'Room'], ['hall', 'Hallway'], ['outdoor', 'Outdoors']];
const COLORS = { room: '#ffd34a', hall: '#8a7cff', outdoor: '#5fd35f' };

export class Scanner {
  async start() {
    const canvas = document.querySelector('#view');
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(2, devicePixelRatio));
    this.renderer.setSize(innerWidth, innerHeight);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.05, 100);
    this.scene.add(new THREE.HemisphereLight('#ffffff', '#444444', 2));
    const root = new THREE.Group();
    this.scene.add(root);
    this.world = { root }; // ARController only needs the root
    this.zones = [];
    this.kind = 'room';
    this.cells = new Set();
    this.allCells = new Set();

    // One instanced quad per painted cell.
    this.paint = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(CELL * 0.9, CELL * 0.9).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.45, depthWrite: false }),
      8000,
    );
    this.paint.count = 0;
    this.paint.frustumCulled = false;
    root.add(this.paint);

    this.ui = document.createElement('div');
    this.ui.id = 'scanUi';
    this.ui.innerHTML = `
      <div class="scan-status"></div>
      <div class="scan-buttons">
        <button data-a="kind" class="secondary"></button>
        <button data-a="next" class="secondary">Next area</button>
        <button data-a="finish" class="primary">Finish</button>
        <button data-a="cancel" class="secondary">Cancel</button>
      </div>`;
    document.querySelector('#overlay').appendChild(this.ui);
    this.ui.addEventListener('beforexrselect', (e) => e.preventDefault());
    this.ui.addEventListener('click', (e) => this.onButton(e.target.closest('[data-a]')?.dataset.a));
    document.querySelector('#lobby').classList.add('hidden');

    this.ar = new ARController(this.renderer, this.scene, this.world, document.querySelector('#overlay'));
    this.ar.onNotFloor = () => this.flash('That is the top of furniture. Aim the ring at the floor: it turns blue when it is on the floor.');
    this.ar.onFirstTap = () => { this.status('Now tap the spot the rift faces — for example the TV or a doorway.'); sfx('loot'); };
    this.ar.onPlaced = () => { this.placedAt = performance.now(); this.status(null); sfx('portal'); };
    this.ar.onEnd = () => this.exit();
    await this.ar.start({ placement: 'twoTap', keepReticle: true, scanning: true });
    this.status('Aim the ring at the floor (it turns blue on the floor, red on furniture) and tap a spot you will remember, like a rug corner. That is where the rift opens.');
    this.renderer.setAnimationLoop((t, frame) => this.frame(frame));
    this.refreshKind();
  }

  flash(text) {
    const el = this.ui.querySelector('.scan-status');
    const before = el.innerHTML;
    el.innerHTML = text;
    el.classList.add('warn');
    clearTimeout(this.flashT);
    this.flashT = setTimeout(() => { el.classList.remove('warn'); el.innerHTML = before; this.render(); }, 2500);
  }

  status(text) {
    this.statusText = text;
    this.render();
  }

  render() {
    const area = (this.cells.size * CELL * CELL).toFixed(1);
    const label = KINDS.find((k) => k[0] === this.kind)[1];
    this.ui.querySelector('.scan-status').innerHTML = this.statusText
      || `<b>Area ${this.zones.length + 1}: ${label}</b> — ${area} m² painted<br><small>Walk slowly and sweep the floor. Skip the area under furniture. Mind steps and stairs while scanning.</small>`;
    this.ui.querySelector('[data-a="kind"]').textContent = `Type: ${label}`;
  }

  refreshKind() {
    this.paint.material.color.set(COLORS[this.kind]);
    this.render();
  }

  frame(xrFrame) {
    this.ar.update(xrFrame);
    const now = performance.now();
    if (this.ar.placed) {
      const root = this.world.root;
      const pts = [];
      const r = this.ar.reticleInArena();
      if (r) pts.push(r);
      for (const h of this.ar.scanHits) pts.push(root.worldToLocal(h.clone()));
      let painted = 0;
      for (const p of pts) {
        if (Math.abs(p.y) > FLOOR_TOLERANCE) continue; // sofa seat, table top
        // a 30 cm brush per hit
        for (const [dx, dz] of BRUSH) painted += this.paintCell(p.x + dx, p.z + dz);
        this.lastFloorAt = now;
      }
      // Whole floor planes ARCore has found, twice a second.
      if (now - (this.planesAt || 0) > 500) {
        this.planesAt = now;
        for (const poly of this.ar.floorPolygons(xrFrame)) {
          const local = poly.map((v) => root.worldToLocal(v.clone()));
          const y = local.reduce((a, v) => a + v.y, 0) / local.length;
          if (Math.abs(y) > FLOOR_TOLERANCE) continue;
          painted += this.fillPolygon(local.map((v) => [v.x, v.z]));
          this.lastFloorAt = now;
        }
      }
      if (painted && !this.statusText) this.render();
      // Help when nothing is found: usually too dark, too fast, or a plain floor.
      const lost = now - (this.lastFloorAt || this.placedAt || now) > 3000;
      if (lost !== this.lost) {
        this.lost = lost;
        this.ui.querySelector('.scan-status').classList.toggle('warn', lost);
        if (lost && !this.statusText) this.ui.querySelector('.scan-status').innerHTML = '<b>Floor not found.</b> Point the phone down at the floor about a metre ahead, move slowly, and turn on more lights. Plain shiny floors are hard: a rug or a few objects help.';
        else this.render();
      }
    }
    this.renderer.render(this.scene, this.camera);
  }

  paintCell(x, z) {
    const k = cellKey(x, z);
    if (this.allCells.has(k) || this.paint.count >= 8000) return 0;
    this.allCells.add(k);
    this.cells.add(k);
    const [i, j] = k.split(',').map(Number);
    this.paint.setMatrixAt(this.paint.count++, new THREE.Matrix4().makeTranslation((i + 0.5) * CELL, 0.005, (j + 0.5) * CELL));
    this.paint.instanceMatrix.needsUpdate = true;
    return 1;
  }

  fillPolygon(poly) {
    let n = 0;
    const xs = poly.map((p) => p[0]); const zs = poly.map((p) => p[1]);
    for (let x = Math.min(...xs) + CELL / 2; x < Math.max(...xs); x += CELL) {
      for (let z = Math.min(...zs) + CELL / 2; z < Math.max(...zs); z += CELL) {
        if (inPoly(x, z, poly)) n += this.paintCell(x, z);
      }
    }
    return n;
  }

  closeArea() {
    if (this.cells.size < 6) return false;
    const n = this.zones.filter((z) => z.kind === this.kind).length + 1;
    const label = KINDS.find((k) => k[0] === this.kind)[1];
    const name = this.kind === 'room' ? (this.zones.length === 0 ? 'Living room' : `Room ${n}`) : n > 1 ? `${label} ${n}` : label;
    this.zones.push(zoneFromCells(this.cells, { id: `z${this.zones.length + 1}`, name, kind: this.kind }));
    this.cells = new Set();
    return true;
  }

  onButton(a) {
    if (!a) return;
    if (a === 'kind') {
      const i = KINDS.findIndex((k) => k[0] === this.kind);
      this.kind = KINDS[(i + 1) % KINDS.length][0];
      this.refreshKind();
    } else if (a === 'next') {
      if (!this.closeArea()) return this.status('Paint more floor before starting the next area.');
      sfx('quest');
      this.status(null);
    } else if (a === 'finish') {
      if (this.cells.size >= 6) this.closeArea();
      if (!this.zones.length) return this.status('Paint some floor first.');
      const world = buildWorld(this.zones, 'My home');
      localStorage.setItem(HOME_KEY, JSON.stringify(world));
      this.exit();
    } else if (a === 'cancel') this.exit();
  }

  exit() {
    if (this.left) return;
    this.left = true;
    this.renderer.setAnimationLoop(null);
    this.ar.end();
    location.href = location.pathname;
  }
}
