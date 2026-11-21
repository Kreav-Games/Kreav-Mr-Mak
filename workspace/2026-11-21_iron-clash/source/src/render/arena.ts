import { Scene } from '@babylonjs/core/scene';
import { Vector3, Matrix, Quaternion } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { SpotLight } from '@babylonjs/core/Lights/spotLight';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import type { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { ReflectionProbe } from '@babylonjs/core/Probes/reflectionProbe';
import { RenderTargetTexture } from '@babylonjs/core/Materials/Textures/renderTargetTexture';
import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { metal, flat, glow, canvasTexture, hex } from './materials';
import type { FX } from './fx';
import type { Fighter, CombatEnv } from '../combat/fighter';

export type ArenaId = 'pit' | 'scrap' | 'neon' | 'stadium' | 'future';
export const ARENA_INFO: Record<ArenaId, { name: string; desc: string; hazard: string }> = {
  pit: { name: 'The Boiler Pit', desc: 'An underground industrial fighting pit under a steelworks.', hazard: 'Steam vents erupt in the corners: they add heat and chip damage.' },
  scrap: { name: 'Junkyard Dunes', desc: 'A desert scrapyard ring walled in by wrecked cars.', hazard: 'A magnet crane drops scrap on a marked target. Move out of the red circle.' },
  neon: { name: 'Neon District Arena', desc: 'A neon-soaked urban championship venue downtown.', hazard: 'Electrified ropes: a wall slam shocks and stuns.' },
  stadium: { name: 'Titan Stadium', desc: 'A massive professional stadium with 60,000 fans.', hazard: 'Pyro posts fire flame columns from the corners.' },
  future: { name: 'Apex Dome', desc: 'The elite futuristic championship arena in orbit above the city.', hazard: 'Energy nodes appear on the floor: step on them for special meter and stamina.' },
};

const BRANDS = ['VOLTCOLA', 'TORQUE OIL', 'HEXCORE', 'GEARHEAD ENERGY', 'MAGNA BOLTS', 'NOVA DYNAMICS', 'RUSTBUCKET BREW', 'SALVAGE KINGS', 'CHROME & CO', 'KILOWATT KICKS'];

interface Cfg {
  shape: 'square' | 'circle'; half: number; clear: string; fog: string; fogD: number; amb: string; ambI: number; key: string; keyI: number;
  points: { c: string; i: number; p: [number, number, number] }[]; mat: string; matLine: string; apron: string; crowd: number; standR: number; tiers: number; standCol: string;
}
const CFG: Record<ArenaId, Cfg> = {
  pit: { shape: 'circle', half: 6.4, clear: '#0c0907', fog: '#1a120c', fogD: 0.018, amb: '#7a5a40', ambI: 0.35, key: '#ffc890', keyI: 1.5, points: [{ c: '#ff8a3a', i: 0.9, p: [-7, 5, -7] }, { c: '#ffb060', i: 0.7, p: [7, 5, 7] }, { c: '#ff6a2a', i: 0.5, p: [7, 3, -7] }], mat: '#4a4038', matLine: '#c8742a', apron: '#2a2420', crowd: 260, standR: 11, tiers: 3, standCol: '#2e2a26' },
  scrap: { shape: 'square', half: 6.6, clear: '#f0a868', fog: '#e8b080', fogD: 0.012, amb: '#ffd8b0', ambI: 0.55, key: '#ffe0b0', keyI: 1.7, points: [{ c: '#ffb070', i: 0.5, p: [-8, 6, 6] }], mat: '#b89a72', matLine: '#6a4a2a', apron: '#5a4a3a', crowd: 260, standR: 12, tiers: 3, standCol: '#5a4a3a' },
  neon: { shape: 'square', half: 6.3, clear: '#06040e', fog: '#120a24', fogD: 0.014, amb: '#6a4aa8', ambI: 0.35, key: '#d8d0ff', keyI: 1.5, points: [{ c: '#ff3ac8', i: 1.0, p: [-7, 4, 7] }, { c: '#3ae0ff', i: 1.0, p: [7, 4, -7] }, { c: '#7a3aff', i: 0.7, p: [7, 5, 7] }], mat: '#14121c', matLine: '#ff3ac8', apron: '#0e0c16', crowd: 420, standR: 12.5, tiers: 4, standCol: '#1a1826' },
  stadium: { shape: 'square', half: 6.8, clear: '#0a0e18', fog: '#141a2a', fogD: 0.008, amb: '#8090b0', ambI: 0.45, key: '#ffffff', keyI: 1.9, points: [{ c: '#ffffff', i: 0.6, p: [-8, 8, -8] }, { c: '#ffd8a0', i: 0.5, p: [8, 8, 8] }], mat: '#e8e6e0', matLine: '#c8302a', apron: '#1a2a5a', crowd: 650, standR: 14, tiers: 6, standCol: '#262c3a' },
  future: { shape: 'circle', half: 6.6, clear: '#02040a', fog: '#06101e', fogD: 0.01, amb: '#4a8aaa', ambI: 0.4, key: '#d8f0ff', keyI: 1.6, points: [{ c: '#2ee6c5', i: 1.0, p: [-7, 4, -7] }, { c: '#4f8cff', i: 0.9, p: [7, 4, 7] }, { c: '#b65cff', i: 0.6, p: [-7, 5, 7] }], mat: '#101820', matLine: '#2ee6c5', apron: '#0a1018', crowd: 480, standR: 13.5, tiers: 4, standCol: '#141c26' },
};

export class Arena {
  cfg: Cfg; key: DirectionalLight; meshes: AbstractMesh[] = [];
  private crowd?: { mesh: Mesh; base: Float32Array; mats: Float32Array; phase: Float32Array; n: number };
  excitement = 0.2; private t = 0;
  private screens: { tex: DynamicTexture; w: number; h: number }[] = [];
  private screenT = 0;
  private hz: any = { t: 0 };
  private sweep: SpotLight[] = [];
  private flashes: PointLight | null = null;
  electricWalls = false; bounceWalls = false;

  constructor(public scene: Scene, public id: ArenaId, public fx: FX, quality: 'low' | 'medium' | 'high') {
    const c = this.cfg = CFG[id];
    scene.clearColor = Color4.FromColor3(hex(c.clear), 1);
    scene.fogMode = Scene.FOGMODE_EXP2; scene.fogColor = hex(c.fog); scene.fogDensity = c.fogD;
    scene.ambientColor = hex(c.amb).scale(0.3);
    const hemi = new HemisphericLight('hemi', new Vector3(0.2, 1, 0.1), scene); hemi.diffuse = hex(c.amb); hemi.intensity = c.ambI * 1.6; hemi.groundColor = hex(c.fog);
    this.key = new DirectionalLight('key', new Vector3(-0.35, -1, 0.45), scene); this.key.position = new Vector3(8, 20, -10); this.key.diffuse = hex(c.key); this.key.intensity = c.keyI;
    for (const p of c.points) { const l = new PointLight('pt', new Vector3(...p.p), scene); l.diffuse = hex(p.c); l.intensity = p.i * 1.3; l.range = 30; }
    this.electricWalls = id === 'neon'; this.bounceWalls = id === 'future';
    this.buildGround(); this.buildRing(); this.buildStands(quality); this.buildDressing();
    this.buildScreens();
    // Environment reflections from the arena itself
    try {
      const probe = new ReflectionProbe('probe', quality === 'high' ? 128 : 64, scene, true);
      probe.position = new Vector3(0, 2, 0);
      for (const m of this.meshes) probe.renderList!.push(m);
      probe.refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
      probe.cubeTexture.onAfterRenderObservable.addOnce(() => { scene.environmentTexture = probe.cubeTexture; });
      scene.environmentIntensity = 1.1;
    } catch { /* reflections are optional */ }
  }

  private reg<T extends AbstractMesh>(m: T, receive = true): T { m.receiveShadows = receive; m.isPickable = false; this.meshes.push(m); return m; }

  private buildGround() {
    const c = this.cfg, s = this.scene;
    const groundCol = { pit: '#2a221c', scrap: '#c8a070', neon: '#0a0a12', stadium: '#1a1e28', future: '#060a12' }[this.id];
    const g = this.reg(MeshBuilder.CreateGround('ground', { width: 120, height: 120 }, s));
    const gm = metal(s, 'groundM', groundCol, this.id === 'neon' || this.id === 'future' ? 0.6 : 0.1, this.id === 'neon' ? 0.25 : 0.85, { bump: 0.3, uv: 30 });
    g.material = gm; g.position.y = -0.02;
    // ring floor
    const half = c.half;
    const logo = canvasTexture(s, 'matTex', 1024, 1024, (gx, w) => {
      gx.fillStyle = c.mat; gx.fillRect(0, 0, w, w);
      for (let i = 0; i < 2400; i++) { gx.fillStyle = `rgba(${Math.random() < 0.5 ? '0,0,0' : '255,255,255'},${Math.random() * 0.05})`; gx.fillRect(Math.random() * w, Math.random() * w, 3, 3); }
      gx.strokeStyle = c.matLine; gx.lineWidth = 10;
      if (c.shape === 'circle') { gx.beginPath(); gx.arc(w / 2, w / 2, w * 0.46, 0, 7); gx.stroke(); gx.beginPath(); gx.arc(w / 2, w / 2, w * 0.16, 0, 7); gx.stroke(); }
      else { gx.strokeRect(30, 30, w - 60, w - 60); gx.beginPath(); gx.arc(w / 2, w / 2, w * 0.16, 0, 7); gx.stroke(); }
      if (this.id === 'future') { gx.lineWidth = 3; gx.strokeStyle = 'rgba(46,230,197,0.35)'; const r = 40; for (let y = 0; y < w + r; y += r * 1.5) for (let x = 0; x < w + r; x += r * 1.732) { const ox = (Math.round(y / (r * 1.5)) % 2) * r * 0.866; gx.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + Math.PI / 6; gx.lineTo(x + ox + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55); } gx.closePath(); gx.stroke(); } }
      if (this.id === 'neon') { gx.lineWidth = 2; gx.strokeStyle = 'rgba(255,58,200,0.25)'; for (let i = 0; i < w; i += 64) { gx.beginPath(); gx.moveTo(i, 0); gx.lineTo(i, w); gx.moveTo(0, i); gx.lineTo(w, i); gx.stroke(); } }
      if (this.id === 'pit') { for (let i = 0; i < 14; i++) { const x = Math.random() * w, y = Math.random() * w, r = 30 + Math.random() * 80; const gr = gx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(10,8,6,0.5)'); gr.addColorStop(1, 'rgba(10,8,6,0)'); gx.fillStyle = gr; gx.fillRect(x - r, y - r, r * 2, r * 2); } }
      gx.save(); gx.translate(w / 2, w / 2); gx.rotate(-Math.PI / 2);
      gx.fillStyle = this.id === 'stadium' ? 'rgba(200,48,42,0.85)' : `rgba(255,255,255,0.14)`;
      gx.font = 'bold 120px Teko, Impact, sans-serif'; gx.textAlign = 'center'; gx.textBaseline = 'middle'; gx.fillText('IRON CLASH', 0, 0);
      gx.restore();
    });
    const floor = this.reg(c.shape === 'circle'
      ? MeshBuilder.CreateCylinder('ring', { diameter: half * 2 + 1.2, height: 0.5, tessellation: 48 }, s)
      : MeshBuilder.CreateBox('ring', { width: half * 2 + 1.2, depth: half * 2 + 1.2, height: 0.5 }, s));
    floor.position.y = -0.25;
    const fm = flat(s, 'floorM', '#ffffff', this.id === 'neon' || this.id === 'future' ? 0.25 : 0.75);
    fm.albedoTexture = logo; if (this.id === 'neon' || this.id === 'future') { fm.metallic = 0.3; }
    floor.material = fm;
    // apron
    const apron = this.reg(c.shape === 'circle'
      ? MeshBuilder.CreateCylinder('apron', { diameter: half * 2 + 2.2, height: 0.7, tessellation: 48 }, s)
      : MeshBuilder.CreateBox('apron', { width: half * 2 + 2.2, depth: half * 2 + 2.2, height: 0.7 }, s));
    apron.position.y = -0.4; apron.material = metal(s, 'apronM', c.apron, 0.5, 0.5, { bump: 0.4, uv: 6 });
    if (this.id === 'neon' || this.id === 'stadium' || this.id === 'future') {
      const strip = this.reg(c.shape === 'circle' ? MeshBuilder.CreateTorus('strip', { diameter: half * 2 + 2.2, thickness: 0.06, tessellation: 64 }, s) : MeshBuilder.CreateBox('strip', { width: half * 2 + 2.25, depth: half * 2 + 2.25, height: 0.06 }, s), false);
      strip.position.y = -0.1; strip.material = glow(s, 'stripM', this.id === 'stadium' ? '#4f8cff' : c.matLine, 1.3);
    }
  }

  private buildRing() {
    const c = this.cfg, s = this.scene, h = c.half;
    if (this.id === 'pit') {
      // circular cage of bars
      const bar = MeshBuilder.CreateCylinder('bar', { diameter: 0.07, height: 3.4, tessellation: 6 }, s);
      bar.material = metal(s, 'barM', '#5a5048', 0.9, 0.55);
      const n = 56; const buf = new Float32Array(n * 16);
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; Matrix.Translation(Math.cos(a) * (h + 0.35), 1.7, Math.sin(a) * (h + 0.35)).copyToArray(buf, i * 16); }
      bar.thinInstanceSetBuffer('matrix', buf, 16, true); this.reg(bar);
      for (const y of [0.6, 1.8, 3.3]) { const t = this.reg(MeshBuilder.CreateTorus('cageR', { diameter: (h + 0.35) * 2, thickness: 0.1, tessellation: 64 }, s)); t.position.y = y; t.material = bar.material; }
      return;
    }
    if (this.id === 'future') {
      const wall = MeshBuilder.CreateCylinder('barrier', { diameter: (h + 0.3) * 2, height: 3.2, tessellation: 64, cap: Mesh.NO_CAP, sideOrientation: Mesh.DOUBLESIDE }, s);
      const wm = new StandardMaterial('barrierM', s); wm.emissiveColor = hex('#2ee6c5').scale(0.35); wm.alpha = 0.05; wm.disableLighting = true; wm.backFaceCulling = false;
      wall.material = wm; wall.position.y = 1.6; wall.isPickable = false; (wall as any).noGlow = true;
      for (const y of [0.05, 1.6, 3.2]) { const t = this.reg(MeshBuilder.CreateTorus('br', { diameter: (h + 0.3) * 2, thickness: 0.05, tessellation: 64 }, s), false); t.position.y = y; t.material = glow(s, 'brM', '#2ee6c5', 1.2); }
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; const p = this.reg(MeshBuilder.CreateCylinder('pyl', { diameterTop: 0.2, diameterBottom: 0.4, height: 3.6, tessellation: 6 }, s)); p.position.set(Math.cos(a) * (h + 0.4), 1.8, Math.sin(a) * (h + 0.4)); p.material = metal(s, 'pylM', '#c8d0d8', 0.9, 0.25); }
      return;
    }
    if (this.id === 'scrap') {
      const mats = ['#7a5a3a', '#5a6a72', '#8a4a2a', '#6a6a5a'].map((col, i) => metal(s, 'scrapM' + i, col, 0.7, 0.7, { bump: 0.8, uv: 2 }));
      for (let side = 0; side < 4; side++) for (let i = -6; i <= 6; i += 1.1) {
        const hh = 1.4 + Math.random() * 1.4; const w = 1.0 + Math.random() * 0.4;
        const b = this.reg(MeshBuilder.CreateBox('fence', { width: w, height: hh, depth: 0.12 }, s));
        const off = h + 0.4;
        const [x, z, ry] = side === 0 ? [i, off, 0] : side === 1 ? [i, -off, 0] : side === 2 ? [off, i, Math.PI / 2] : [-off, i, Math.PI / 2];
        b.position.set(x, hh / 2, z); b.rotation.set((Math.random() - 0.5) * 0.12, ry + (Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.1); b.material = mats[Math.floor(Math.random() * 4)];
      }
      return;
    }
    // ropes ring (neon, stadium)
    const postM = metal(s, 'postM', this.id === 'neon' ? '#1a1a24' : '#d8dce4', 0.9, 0.3);
    const ropeCols = this.id === 'neon' ? ['#ff3ac8', '#3ae0ff', '#ff3ac8'] : ['#c8302a', '#ffffff', '#2a4ac8'];
    const ropeMats = ropeCols.map((col, i) => this.id === 'neon' ? glow(s, 'ropeG' + i, col, 1.4) as any : metal(s, 'ropeM' + i, col, 0.2, 0.5, { wear: false }));
    const off = h + 0.3;
    const corners = [[-off, -off], [off, -off], [off, off], [-off, off]];
    for (const [x, z] of corners) {
      const p = this.reg(MeshBuilder.CreateCylinder('post', { diameter: 0.22, height: 1.9, tessellation: 12 }, s)); p.position.set(x, 0.95, z); p.material = postM;
      const pad = this.reg(MeshBuilder.CreateBox('pad', { width: 0.34, height: 1.1, depth: 0.34 }, s)); pad.position.set(x * 0.985, 1.05, z * 0.985); pad.material = metal(s, 'padM', this.id === 'neon' ? '#ff3ac8' : '#c8302a', 0.1, 0.6, { wear: false });
    }
    for (let i = 0; i < 4; i++) {
      const [x1, z1] = corners[i], [x2, z2] = corners[(i + 1) % 4];
      const len = Math.hypot(x2 - x1, z2 - z1);
      for (let r = 0; r < 3; r++) {
        const rope = this.reg(MeshBuilder.CreateCylinder('rope', { diameter: 0.07, height: len, tessellation: 8 }, s), false);
        rope.position.set((x1 + x2) / 2, 0.55 + r * 0.45, (z1 + z2) / 2);
        rope.rotation.z = Math.PI / 2; rope.rotation.y = Math.atan2(-(z2 - z1), x2 - x1);
        rope.material = ropeMats[r];
      }
    }
  }

  private buildStands(quality: string) {
    const c = this.cfg, s = this.scene;
    const standM = metal(s, 'standM', c.standCol, 0.3, 0.8, { bump: 0.3, uv: 8 });
    const seg = c.shape === 'circle' || this.id === 'stadium' ? 40 : 4;
    // tiers as rings/boxes
    for (let t = 0; t < c.tiers; t++) {
      const r = c.standR + t * 1.6, y = 0.3 + t * 0.9;
      if (seg === 4) {
        for (let side = 0; side < 4; side++) {
          const b = this.reg(MeshBuilder.CreateBox('tier', { width: r * 2, height: 0.9, depth: 1.6 }, s));
          const a = side * Math.PI / 2; b.position.set(Math.sin(a) * r, y, Math.cos(a) * r); b.rotation.y = a; b.material = standM;
        }
      } else {
        // a hollow ring of seating: lathe a rectangular cross-section around the arena
        const shape = [new Vector3(r - 0.8, -0.45, 0), new Vector3(r + 0.8, -0.45, 0), new Vector3(r + 0.8, 0.45, 0), new Vector3(r - 0.8, 0.45, 0), new Vector3(r - 0.8, -0.45, 0)];
        const ring = this.reg(MeshBuilder.CreateLathe('tier', { shape, tessellation: seg, sideOrientation: Mesh.DOUBLESIDE }, s));
        ring.position.y = y; ring.material = standM;
      }
    }
    // crowd
    const n = Math.round(c.crowd * (quality === 'low' ? 0.4 : quality === 'medium' ? 0.7 : 1));
    const body = MeshBuilder.CreateCapsule('cb', { radius: 0.2, height: 0.85, tessellation: 6, subdivisions: 1 }, s);
    const head = MeshBuilder.CreateSphere('ch', { diameter: 0.26, segments: 6 }, s); head.position.y = 0.55;
    const arm = MeshBuilder.CreateBox('ca', { width: 0.6, height: 0.1, depth: 0.1 }, s); arm.position.y = 0.2;
    const person = Mesh.MergeMeshes([body, head, arm], true)!;
    const pm = new StandardMaterial('crowdM', s); pm.diffuseColor = Color3.White(); pm.specularColor = Color3.Black(); pm.emissiveColor = new Color3(0.08, 0.08, 0.1);
    person.material = pm; person.isPickable = false;
    const mats = new Float32Array(n * 16), base = new Float32Array(n * 3), cols = new Float32Array(n * 4), phase = new Float32Array(n);
    const palette = this.id === 'neon' ? ['#ff3ac8', '#3ae0ff', '#7a3aff', '#ffffff', '#ffd84a'] : this.id === 'scrap' ? ['#c87a3a', '#6a5a4a', '#e8c890', '#4a6a8a', '#8a3a2a'] : ['#c8302a', '#2a4ac8', '#e8e8e8', '#e8b23a', '#3a8a4a', '#8a4ac8'];
    for (let i = 0; i < n; i++) {
      const t = Math.floor(Math.random() * c.tiers);
      const r = c.standR + t * 1.6 + (Math.random() - 0.5) * 0.6, y = 0.3 + t * 0.9 + 0.45 + 0.43;
      let x: number, z: number;
      if (seg === 4) { const side = Math.floor(Math.random() * 4), along = (Math.random() - 0.5) * r * 1.9; const a = side * Math.PI / 2; x = Math.sin(a) * r + Math.cos(a) * along; z = Math.cos(a) * r - Math.sin(a) * along; }
      else { const a = Math.random() * Math.PI * 2; x = Math.cos(a) * r; z = Math.sin(a) * r; }
      base[i * 3] = x; base[i * 3 + 1] = y; base[i * 3 + 2] = z; phase[i] = Math.random() * 10;
      const col = hex(palette[Math.floor(Math.random() * palette.length)]).scale(0.55 + Math.random() * 0.45);
      cols.set([col.r, col.g, col.b, 1], i * 4);
    }
    person.thinInstanceSetBuffer('matrix', mats, 16, false);
    person.thinInstanceSetBuffer('color', cols, 4, true);
    this.crowd = { mesh: person, base, mats, phase, n };
    this.updateCrowd(0);
  }

  private updateCrowd(dt: number) {
    const cr = this.crowd; if (!cr) return;
    const ex = this.excitement;
    const m = Matrix.Identity(); const q = new Quaternion(); const sc = new Vector3(1, 1, 1); const tp = new Vector3();
    for (let i = 0; i < cr.n; i++) {
      const x = cr.base[i * 3], y = cr.base[i * 3 + 1], z = cr.base[i * 3 + 2];
      const jump = Math.max(0, Math.sin(this.t * (3 + ex * 6) + cr.phase[i])) * (0.04 + ex * 0.35);
      const yaw = Math.atan2(-x, -z);
      Quaternion.RotationYawPitchRollToRef(yaw, 0, Math.sin(this.t * 2 + cr.phase[i]) * 0.08 * (1 + ex), q);
      tp.set(x, y + jump, z);
      Matrix.ComposeToRef(sc, q, tp, m); m.copyToArray(cr.mats, i * 16);
    }
    cr.mesh.thinInstanceBufferUpdated('matrix');
    void dt;
  }

  private screen(name: string, w: number, h: number, pos: Vector3, rotY: number, size: number) {
    const tex = canvasTexture(this.scene, name, w, h, (g) => { g.fillStyle = '#000'; g.fillRect(0, 0, w, h); });
    const m = new StandardMaterial(name + 'M', this.scene); m.emissiveTexture = tex; m.diffuseColor = Color3.Black(); m.specularColor = Color3.Black(); m.disableLighting = true;
    const p = MeshBuilder.CreatePlane(name, { width: size, height: size * h / w }, this.scene); p.material = m; p.position.copyFrom(pos); p.rotation.y = rotY; p.isPickable = false;
    const frame = this.reg(MeshBuilder.CreateBox(name + 'F', { width: size + 0.3, height: size * h / w + 0.3, depth: 0.2 }, this.scene));
    frame.position.copyFrom(pos); frame.rotation.y = rotY; frame.material = metal(this.scene, 'frameM', '#1a1c20', 0.8, 0.4);
    frame.position.addInPlace(new Vector3(Math.sin(rotY), 0, Math.cos(rotY)).scale(0.12));
    this.screens.push({ tex, w, h });
    return p;
  }

  private ad(text: string, pos: Vector3, rotY: number, w: number, h: number, i: number) {
    const cols = [['#e8302a', '#ffffff'], ['#1a1a1a', '#ffd84a'], ['#2a4ac8', '#ffffff'], ['#ffd84a', '#1a1a1a'], ['#0e0e16', '#3ae0ff']][i % 5];
    const tex = canvasTexture(this.scene, 'ad' + i, 512, 128, (g, W, H) => {
      g.fillStyle = cols[0]; g.fillRect(0, 0, W, H); g.fillStyle = cols[1]; g.font = 'bold 84px Teko, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, W / 2, H / 2 + 6);
      g.strokeStyle = cols[1]; g.lineWidth = 6; g.strokeRect(8, 8, W - 16, H - 16);
    });
    const m = new StandardMaterial('adM' + i, this.scene); m.diffuseTexture = tex; m.emissiveTexture = tex; m.emissiveColor = new Color3(0.6, 0.6, 0.6); m.specularColor = Color3.Black();
    const p = this.reg(MeshBuilder.CreatePlane('ad', { width: w, height: h }, this.scene)); p.material = m; p.position.copyFrom(pos); p.rotation.y = rotY;
  }

  private buildScreens() {
    const s = this.scene, c = this.cfg;
    if (this.id === 'stadium') {
      // hanging jumbotron cube
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; this.screen('jt' + i, 512, 256, new Vector3(Math.sin(a) * 2.3, 10.5, Math.cos(a) * 2.3), a, 4.2); }
      const top = this.reg(MeshBuilder.CreateBox('jtTop', { width: 5, height: 0.4, depth: 5 }, s)); top.position.y = 12; top.material = metal(s, 'jtM', '#20242c', 0.8, 0.4);
    } else {
      const d = c.standR + c.tiers * 1.6 + 1.5;
      this.screen('scr0', 512, 256, new Vector3(0, 4 + c.tiers * 0.6, d), Math.PI, 6.5);
      if (this.id !== 'pit') this.screen('scr1', 512, 256, new Vector3(0, 4 + c.tiers * 0.6, -d), 0, 6.5);
    }
    // ads around the apron / walls
    const h = c.half + 1.15;
    const brands = BRANDS.slice((this.id.length * 3) % 5).concat(BRANDS);
    let k = 0;
    if (c.shape === 'square') for (let side = 0; side < 4; side++) for (const off of [-3.2, 3.2]) {
      const a = side * Math.PI / 2; const pos = new Vector3(Math.sin(a) * h + Math.cos(a) * off, -0.4, Math.cos(a) * h - Math.sin(a) * off);
      this.ad(brands[k], pos, a + Math.PI, 3.6, 0.62, k); k++;
    } else for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2; const r = c.standR - 0.9; this.ad(brands[k], new Vector3(Math.sin(a) * r, 0.5, Math.cos(a) * r), a + Math.PI, 3.4, 0.8, k); k++;
    }
  }

  private buildDressing() {
    const s = this.scene, c = this.cfg;
    const lampRig = (pos: Vector3, color: string) => {
      const truss = this.reg(MeshBuilder.CreateBox('truss', { width: 0.3, height: 0.3, depth: 3 }, s)); truss.position.copyFrom(pos); truss.material = metal(s, 'trussM', '#2a2c30', 0.9, 0.5);
      for (const dz of [-1, 0, 1]) { const l = MeshBuilder.CreateCylinder('lamp', { diameter: 0.35, height: 0.12, tessellation: 12 }, s); l.position.set(pos.x, pos.y - 0.2, pos.z + dz); l.material = glow(s, 'lampG', color, 1.6); l.isPickable = false; }
      // light cone
      const cone = MeshBuilder.CreateCylinder('cone', { diameterTop: 0.4, diameterBottom: 5, height: pos.y, tessellation: 20, cap: Mesh.NO_CAP }, s);
      const cm = new StandardMaterial('coneM', s); cm.emissiveColor = hex(color).scale(0.25); cm.alpha = 0.06; cm.disableLighting = true; cm.backFaceCulling = false;
      cone.material = cm; cone.position.set(pos.x * 0.6, pos.y / 2 - 0.2, pos.z * 0.6); cone.isPickable = false; (cone as any).noGlow = true;
      const dir = new Vector3(-pos.x * 0.4, -pos.y, -pos.z * 0.4).normalize(); cone.rotation.x = 0; cone.lookAt(cone.position.add(dir)); cone.rotation.x += Math.PI / 2;
    };
    if (this.id === 'pit') {
      const pipeM = metal(s, 'pipeM', '#6a4a32', 0.9, 0.6, { bump: 0.5 });
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; const p = this.reg(MeshBuilder.CreateCylinder('pipe', { diameter: 0.5, height: 14, tessellation: 12 }, s)); p.position.set(Math.cos(a) * 17, 5, Math.sin(a) * 17); p.material = pipeM; }
      for (let i = 0; i < 4; i++) { const t = this.reg(MeshBuilder.CreateTorus('pipeH', { diameter: 34, thickness: 0.35, tessellation: 48 }, s)); t.position.y = 4 + i * 2.5; t.material = pipeM; }
      for (let i = 0; i < 10; i++) { const a = Math.random() * Math.PI * 2; const b = this.reg(MeshBuilder.CreateCylinder('barrel', { diameter: 0.7, height: 1, tessellation: 14 }, s)); b.position.set(Math.cos(a) * 9, 0.5, Math.sin(a) * 9); b.material = metal(s, 'barrelM', ['#8a2a1a', '#2a4a6a', '#4a4a3a'][i % 3], 0.6, 0.6); }
      for (const p of [new Vector3(0, 9, 0)]) { const hl = new SpotLight('hang', p, new Vector3(0, -1, 0), 1.1, 2, s); hl.diffuse = hex('#ffc890'); hl.intensity = 1.2; }
      lampRig(new Vector3(0, 9, 0), '#ffc890');
      this.hz = { t: 0, vents: [[-4.2, -4.2], [4.2, 4.2], [-4.2, 4.2], [4.2, -4.2]].map(([x, z]) => { const v = this.reg(MeshBuilder.CreateCylinder('vent', { diameter: 0.9, height: 0.08, tessellation: 16 }, s)); v.position.set(x, 0.02, z); const vm = glow(s, 'ventG', '#ff5a2a', 0.2); v.material = vm; return { x, z, m: vm }; }) };
    }
    if (this.id === 'scrap') {
      // sky gradient dome
      const sky = MeshBuilder.CreateSphere('sky', { diameter: 180, segments: 16, sideOrientation: Mesh.BACKSIDE }, s);
      const st = canvasTexture(s, 'skyT', 16, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a3a6a'); gr.addColorStop(0.45, '#e87a4a'); gr.addColorStop(0.55, '#ffc890'); gr.addColorStop(1, '#c8905a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
      const sm = new StandardMaterial('skyM', s); sm.emissiveTexture = st; sm.disableLighting = true; sm.backFaceCulling = false; sm.fogEnabled = false; sky.material = sm; sky.isPickable = false;
      const sun = MeshBuilder.CreateSphere('sun', { diameter: 10, segments: 12 }, s); sun.position.set(50, 18, -70); sun.material = glow(s, 'sunG', '#ffe0a0', 1.4); (sun.material as StandardMaterial).fogEnabled = false;
      const carM = ['#8a3a2a', '#3a5a7a', '#6a6a4a', '#a88a3a'].map((col, i) => metal(s, 'carM' + i, col, 0.6, 0.7, { bump: 0.6 }));
      for (let i = 0; i < 26; i++) {
        const a = Math.random() * Math.PI * 2, r = 20 + Math.random() * 14;
        const car = this.reg(MeshBuilder.CreateBox('car', { width: 3.6, height: 1.2, depth: 1.8 }, s)); car.position.set(Math.cos(a) * r, 0.6 + Math.floor(Math.random() * 3) * 1.2, Math.sin(a) * r); car.rotation.set(Math.random() * 0.3, Math.random() * 3, Math.random() * 0.3); car.material = carM[i % 4];
        if (i % 3 === 0) { const t = this.reg(MeshBuilder.CreateTorus('tire', { diameter: 1, thickness: 0.32, tessellation: 16 }, s)); t.position.set(Math.cos(a + 0.2) * (r - 3), 0.16, Math.sin(a + 0.2) * (r - 3)); t.material = metal(s, 'tireM', '#151515', 0.1, 0.9, { wear: false }); }
      }
      // crane
      const cm = metal(s, 'craneM', '#d8a030', 0.6, 0.5);
      const tower = this.reg(MeshBuilder.CreateBox('crane', { width: 1, height: 16, depth: 1 }, s)); tower.position.set(-14, 8, -14); tower.material = cm;
      const jib = this.reg(MeshBuilder.CreateBox('jib', { width: 22, height: 0.8, depth: 0.8 }, s)); jib.position.set(-6, 16, -6); jib.rotation.y = -Math.PI / 4; jib.material = cm;
      const magnet = this.reg(MeshBuilder.CreateCylinder('magnet', { diameter: 2, height: 0.5, tessellation: 20 }, s)); magnet.position.set(0, 12, 0); magnet.material = metal(s, 'magM', '#3a3a3a', 0.9, 0.4);
      const ring = MeshBuilder.CreateTorus('craneTarget', { diameter: 2.6, thickness: 0.1, tessellation: 40 }, s); ring.material = glow(s, 'tgtG', '#ff2a2a', 1.4); ring.setEnabled(false);
      const block = this.reg(MeshBuilder.CreateBox('scrapBlock', { width: 1.4, height: 1.1, depth: 1.4 }, s)); block.material = carM[0]; block.setEnabled(false);
      this.hz = { t: 0, magnet, ring, block, state: 'idle', target: new Vector3() };
    }
    if (this.id === 'neon') {
      for (let i = 0; i < 14; i++) {
        const a = i / 14 * Math.PI * 2, r = 24 + Math.random() * 6, hgt = 10 + Math.random() * 22;
        const b = this.reg(MeshBuilder.CreateBox('bld', { width: 5, height: hgt, depth: 5 }, s)); b.position.set(Math.cos(a) * r, hgt / 2, Math.sin(a) * r); b.material = metal(s, 'bldM', '#14121e', 0.4, 0.6, { bump: 0.4, uv: 4 });
        const sign = MeshBuilder.CreateBox('sign', { width: 3.6, height: 0.5, depth: 0.1 }, s); sign.position.set(Math.cos(a) * (r - 2.6), 4 + Math.random() * (hgt - 6), Math.sin(a) * (r - 2.6)); sign.rotation.y = -a + Math.PI / 2; sign.material = glow(s, 'signG' + i, ['#ff3ac8', '#3ae0ff', '#ffd84a', '#7a3aff'][i % 4], 1.6);
      }
      lampRig(new Vector3(-5, 10, 0), '#ff7ad8'); lampRig(new Vector3(5, 10, 0), '#7ae8ff');
    }
    if (this.id === 'stadium') {
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; const sp = new SpotLight('sweep', new Vector3(Math.sin(a) * 18, 16, Math.cos(a) * 18), new Vector3(0, -1, 0), 0.35, 8, s); sp.diffuse = hex(['#ffffff', '#ffd8a0', '#a0c8ff', '#ffffff'][i]); sp.intensity = 1.4; this.sweep.push(sp); }
      this.flashes = new PointLight('flash', new Vector3(0, 6, 15), s); this.flashes.intensity = 0; this.flashes.range = 20;
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; const tw = this.reg(MeshBuilder.CreateBox('ltower', { width: 0.6, height: 22, depth: 0.6 }, s)); tw.position.set(Math.sin(a) * 26, 11, Math.cos(a) * 26); tw.material = metal(s, 'twM', '#3a3e48', 0.8, 0.5); const lb = MeshBuilder.CreateBox('lbank', { width: 3, height: 1.6, depth: 0.3 }, s); lb.position.set(Math.sin(a) * 26, 22, Math.cos(a) * 26); lb.rotation.y = a; lb.material = glow(s, 'lbG', '#ffffff', 1.6); }
      const off = c.half + 0.3;
      this.hz = { t: 0, posts: [[-off, -off], [off, -off], [off, off], [-off, off]].map(([x, z]) => ({ x, z })) };
    }
    if (this.id === 'future') {
      for (let i = 0; i < 3; i++) { const t = MeshBuilder.CreateTorus('holo', { diameter: 18 + i * 8, thickness: 0.08, tessellation: 64 }, s); t.position.y = 9 + i * 3; t.material = glow(s, 'holoG' + i, ['#2ee6c5', '#4f8cff', '#b65cff'][i], 1.2); t.isPickable = false; (t as any)._spin = 0.1 + i * 0.05; this.hz.rings = (this.hz.rings || []).concat([t]); }
      const stars = MeshBuilder.CreateSphere('stars', { diameter: 200, segments: 8, sideOrientation: Mesh.BACKSIDE }, s);
      const stt = canvasTexture(s, 'starT', 1024, 512, (g, w, h) => { g.fillStyle = '#02040a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,255,255,${Math.random()})`; g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); } const gr = g.createLinearGradient(0, h * 0.55, 0, h); gr.addColorStop(0, 'rgba(40,80,160,0)'); gr.addColorStop(1, 'rgba(40,120,200,0.6)'); g.fillStyle = gr; g.fillRect(0, h * 0.55, w, h * 0.45); });
      const sm = new StandardMaterial('starM', s); sm.emissiveTexture = stt; sm.disableLighting = true; sm.fogEnabled = false; stars.material = sm; stars.isPickable = false;
      lampRig(new Vector3(0, 11, -5), '#2ee6c5'); lampRig(new Vector3(0, 11, 5), '#4f8cff');
      const node = MeshBuilder.CreateCylinder('node', { diameter: 0.9, height: 0.12, tessellation: 6 }, s); node.material = glow(s, 'nodeG', '#ffd84a', 1.8); node.setEnabled(false);
      this.hz.t = 0; this.hz.node = node; this.hz.nodeOn = false;
    }
  }

  /** Clamp a fighter inside the ring. Returns true if it hit the boundary. */
  clamp(f: Fighter): boolean {
    const lim = this.cfg.half - 0.55;
    let hit = false;
    if (this.cfg.shape === 'square') {
      if (Math.abs(f.pos.x) > lim) { f.pos.x = Math.sign(f.pos.x) * lim; hit = true; if (this.bounceWalls) f.kb.x *= -0.9; }
      if (Math.abs(f.pos.z) > lim) { f.pos.z = Math.sign(f.pos.z) * lim; hit = true; if (this.bounceWalls) f.kb.z *= -0.9; }
    } else {
      const d = Math.hypot(f.pos.x, f.pos.z);
      if (d > lim) { f.pos.x *= lim / d; f.pos.z *= lim / d; hit = true; if (this.bounceWalls) { const n = new Vector3(f.pos.x, 0, f.pos.z).normalize(); const dot = Vector3.Dot(f.kb, n); if (dot > 0) f.kb.subtractInPlace(n.scale(dot * 1.9)); } }
    }
    return hit;
  }

  update(dt: number, fighters: Fighter[], env: CombatEnv, active: boolean) {
    this.t += dt;
    this.excitement = Math.max(0.15, this.excitement - dt * 0.12);
    if (this.crowd && (Math.floor(this.t * 60) % 2 === 0)) this.updateCrowd(dt);
    this.sweep.forEach((sp, i) => { const a = this.t * 0.4 + i * 1.6; sp.direction.set(Math.sin(a) * 0.5, -1, Math.cos(a * 1.3) * 0.5); });
    if (this.flashes) { this.flashes.intensity = Math.random() < this.excitement * 0.08 ? 3 : this.flashes.intensity * 0.7; if (Math.random() < 0.02) this.flashes.position.set((Math.random() - 0.5) * 30, 3 + Math.random() * 5, (Math.random() < 0.5 ? -1 : 1) * 15); }
    if (this.hz.rings) for (const r of this.hz.rings) r.rotation.y += r._spin * dt;
    if (!active) return;
    const hz = this.hz; hz.t += dt;
    if (this.id === 'pit') {
      const cyc = hz.t % 9; const warn = cyc > 6.2 && cyc < 7.4, erupt = cyc >= 7.4 && cyc < 8.8;
      for (const v of hz.vents) {
        v.m.emissiveColor = hex('#ff5a2a').scale(warn ? 0.6 + Math.sin(this.t * 20) * 0.4 : erupt ? 1.6 : 0.15);
        if (erupt) {
          if (Math.random() < 0.5) env.burst('steam', new Vector3(v.x, 0.3, v.z), 1.2);
          for (const f of fighters) if (f.alive && Math.hypot(f.pos.x - v.x, f.pos.z - v.z) < 1.3) { f.heat += 45 * dt; if (f.hp > 1) { const d = f.stats.maxHp * 0.02 * dt; f.hp = Math.max(1, f.hp - d); f.tally.dmgTaken += d; } if (Math.random() < 0.05) env.popup('STEAM VENT', f.headPos(), '#FF9A3D'); }
        }
      }
      if (cyc >= 7.4 && cyc - dt < 7.4) env.sfx('steam', 0.6);
    }
    if (this.id === 'scrap') {
      if (hz.state === 'idle' && hz.t > 11) {
        const f = fighters[Math.floor(Math.random() * 2)];
        hz.target.set(f.pos.x + (Math.random() - 0.5), 0.05, f.pos.z + (Math.random() - 0.5)); hz.ring.position.copyFrom(hz.target); hz.ring.setEnabled(true);
        hz.state = 'warn'; hz.t = 0; env.sfx('alarm', 0.6);
      } else if (hz.state === 'warn') {
        hz.magnet.position.x += (hz.target.x - hz.magnet.position.x) * dt * 3; hz.magnet.position.z += (hz.target.z - hz.magnet.position.z) * dt * 3;
        hz.ring.scaling.setAll(1 + Math.sin(this.t * 14) * 0.08);
        if (hz.t > 1.7) { hz.state = 'drop'; hz.t = 0; hz.block.setEnabled(true); hz.block.position.set(hz.target.x, 11, hz.target.z); }
      } else if (hz.state === 'drop') {
        hz.block.position.y -= dt * 30;
        if (hz.block.position.y <= 0.55) {
          hz.block.position.y = 0.55; hz.ring.setEnabled(false); hz.state = 'land'; hz.t = 0;
          env.shake(0.5); env.sfx('slam'); env.burst('dust', hz.target.clone(), 2); env.burst('debris', hz.target.add(new Vector3(0, 0.5, 0)), 1.5);
          for (const f of fighters) if (f.alive && Math.hypot(f.pos.x - hz.target.x, f.pos.z - hz.target.z) < 1.4 && f.state !== 'dodge') {
            const d = f.stats.maxHp * 0.07; f.hp = Math.max(1, f.hp - d); f.tally.dmgTaken += d; f.opp.tally.dmgDealt += d;
            env.popup(`CRUSHED ${Math.round(d)}`, f.headPos(), '#FF5A3A', true); f.knockdown();
          }
        }
      } else if (hz.state === 'land' && hz.t > 2) { hz.block.setEnabled(false); hz.state = 'idle'; hz.t = 0; }
    }
    if (this.id === 'neon' && Math.random() < 0.05) {
      const h = this.cfg.half + 0.3; const side = Math.floor(Math.random() * 4); const al = (Math.random() - 0.5) * 2 * h;
      const p = side === 0 ? new Vector3(al, 0.6 + Math.random(), h) : side === 1 ? new Vector3(al, 0.6 + Math.random(), -h) : side === 2 ? new Vector3(h, 0.6 + Math.random(), al) : new Vector3(-h, 0.6 + Math.random(), al);
      env.sparks(p, 0.15, '#7FE8FF');
    }
    if (this.id === 'stadium') {
      const cyc = hz.t % 10; const fire = cyc > 8.6;
      if (fire) for (const p of hz.posts) {
        if (Math.random() < 0.6) env.burst('fire', new Vector3(p.x, 1.6, p.z), 1.2);
        for (const f of fighters) if (f.alive && Math.hypot(f.pos.x - p.x, f.pos.z - p.z) < 1.8) { f.heat += 40 * dt; if (Math.random() < 0.04) env.popup('PYRO!', f.headPos(), '#FF7A2A'); }
      }
      if (cyc > 8.6 && cyc - dt <= 8.6) { env.sfx('fireburst', 0.7); env.crowd(0.6); }
    }
    if (this.id === 'future') {
      if (!hz.nodeOn && hz.t > 12) { hz.nodeOn = true; hz.t = 0; const a = Math.random() * Math.PI * 2, r = Math.random() * 4; hz.node.position.set(Math.cos(a) * r, 0.08, Math.sin(a) * r); hz.node.setEnabled(true); env.sfx('buff', 0.4); }
      if (hz.nodeOn) {
        hz.node.rotation.y += dt * 3; hz.node.scaling.y = 1 + Math.sin(this.t * 8) * 0.5;
        for (const f of fighters) if (f.alive && Math.hypot(f.pos.x - hz.node.position.x, f.pos.z - hz.node.position.z) < 0.9) {
          f.special = Math.min(100, f.special + 25); f.stamina = Math.min(f.stats.staminaMax, f.stamina + 25);
          env.popup('ENERGY NODE +25', f.headPos(), '#FFD84A', true); env.burst('shock', hz.node.position.add(new Vector3(0, 0.5, 0)), 1); env.sfx('pickup');
          hz.nodeOn = false; hz.node.setEnabled(false); hz.t = 0; break;
        }
        if (hz.t > 10 && hz.nodeOn) { hz.nodeOn = false; hz.node.setEnabled(false); hz.t = 0; }
      }
    }
  }

  /** Redraw the arena screens with the live fight state. */
  updateScreens(dt: number, a: Fighter, b: Fighter, round: number, time: number, banner?: string) {
    this.screenT -= dt; if (this.screenT > 0) return; this.screenT = 0.3;
    for (const sc of this.screens) {
      const g = sc.tex.getContext() as unknown as CanvasRenderingContext2D; const { w, h } = sc;
      g.fillStyle = '#05070c'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#0c1424'; for (let y = 0; y < h; y += 4) g.fillRect(0, y, w, 1);
      g.font = 'bold 40px Teko, Impact, sans-serif'; g.textBaseline = 'middle';
      g.fillStyle = '#4fd8ff'; g.textAlign = 'left'; g.fillText(a.name, 20, 40);
      g.fillStyle = '#ff5a6a'; g.textAlign = 'right'; g.fillText(b.name, w - 20, 40);
      const bar = (x: number, frac: number, col: string, flip: boolean) => { g.fillStyle = '#222'; g.fillRect(x, 70, 210, 22); g.fillStyle = col; const ww = 210 * Math.max(0, frac); g.fillRect(flip ? x + 210 - ww : x, 70, ww, 22); };
      bar(20, a.hp / a.stats.maxHp, '#4fd8ff', false); bar(w - 230, b.hp / b.stats.maxHp, '#ff5a6a', true);
      g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = 'bold 90px Teko, Impact, sans-serif';
      g.fillText(banner || `${Math.ceil(time)}`, w / 2, h * 0.62);
      g.font = 'bold 34px Teko, Impact, sans-serif'; g.fillStyle = '#ffb12e'; g.fillText(`ROUND ${round}`, w / 2, h - 28);
      sc.tex.update(true);
    }
  }
}
