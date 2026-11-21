import { Scene } from '@babylonjs/core/scene';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import type { Material } from '@babylonjs/core/Materials/material';
import type { Paint, SlotId, Zone } from '../core/types';
import { PART_BY_ID } from '../data/parts';
import { metal, glow, textures, hex, canvasTexture } from './materials';

export interface RobotSpec { parts: Partial<Record<SlotId, string>>; paint: Paint; slotPaint?: Partial<Record<SlotId, string>>; decal: number; scale?: number }
export type JointName = 'pelvis' | 'torso' | 'neck' | 'shL' | 'shR' | 'elL' | 'elR' | 'wrL' | 'wrR' | 'hipL' | 'hipR' | 'knL' | 'knR' | 'anL' | 'anR';
export const JOINTS: JointName[] = ['pelvis', 'torso', 'neck', 'shL', 'shR', 'elL', 'elR', 'wrL', 'wrR', 'hipL', 'hipR', 'knL', 'knR', 'anL', 'anR'];

const CORE_COLORS: Record<string, string> = { fusion: '#4FD8FF', plasma: '#FF3AC8', ion: '#FFB12E', void: '#A67CFF' };
const DECALS = ['bolt', 'star', 'skull', 'crown', 'flame', 'gear'];

interface Prim { mesh: Mesh; mat: Material }
class Seg {
  prims: Prim[] = [];
  constructor(public node: TransformNode) { }
}

let uidCounter = 0;

export class RobotModel {
  root: TransformNode;
  j = {} as Record<JointName, TransformNode>;
  meshes: Mesh[] = [];
  fist: { L: TransformNode; R: TransformNode };
  zoneAnchor: Record<Zone, TransformNode>;
  pelvisBaseY = 1.12;
  private scene: Scene;
  private id: string;
  private mats = new Map<string, Material>();
  private zoneMats: Record<Zone, { m: PBRMaterial; base: Color3 }[]> = { head: [], torso: [], arms: [], legs: [] };
  private pistons: { a: TransformNode; b: TransformNode; sleeve: Mesh; rod: Mesh }[] = [];
  private spinners: { mesh: Mesh; speed: number; axis: 'x' | 'y' | 'z' }[] = [];
  private leds: { m: StandardMaterial; base: Color3 }[] = [];
  private eyeMat!: StandardMaterial; private coreMat!: StandardMaterial;
  private eyeBase!: Color3; private coreBase!: Color3;
  private dmg: Record<Zone, number> = { head: 0, torso: 0, arms: 0, legs: 0 };
  private decalMat: StandardMaterial | null = null;
  private t = 0;
  spec: RobotSpec;

  constructor(scene: Scene, spec: RobotSpec) {
    this.scene = scene; this.spec = spec; this.id = 'rb' + (uidCounter++);
    this.root = new TransformNode(this.id, scene);
    const mk = (n: JointName, parent: TransformNode, x: number, y: number, z: number) => { const t = new TransformNode(this.id + n, scene); t.parent = parent; t.position.set(x, y, z); this.j[n] = t; return t; };
    const style = (s: SlotId) => { const id = spec.parts[s]; return id ? PART_BY_ID[id]?.style : undefined; };
    const torsoStyle = style('torso') || 'boxer';
    const shW = ({ boxer: 0.5, heavy: 0.56, sleek: 0.44, block: 0.6, reactor: 0.5 } as Record<string, number>)[torsoStyle] || 0.5;
    const pelvis = mk('pelvis', this.root, 0, this.pelvisBaseY, 0);
    const torso = mk('torso', pelvis, 0, 0.12, 0);
    mk('neck', torso, 0, 0.9, 0);
    for (const [side, sgn] of [['L', -1], ['R', 1]] as const) {
      const sh = mk(('sh' + side) as JointName, torso, sgn * shW, 0.72, 0);
      const el = mk(('el' + side) as JointName, sh, 0, -0.42, 0);
      mk(('wr' + side) as JointName, el, 0, -0.4, 0);
      const hip = mk(('hip' + side) as JointName, pelvis, sgn * 0.2, -0.04, 0);
      const kn = mk(('kn' + side) as JointName, hip, 0, -0.5, 0);
      mk(('an' + side) as JointName, kn, 0, -0.5, 0);
    }
    const fa = (n: JointName, y: number) => { const t = new TransformNode(this.id + 'fist' + n, scene); t.parent = this.j[n]; t.position.y = y; return t; };
    this.fist = { L: fa('wrL', -0.12), R: fa('wrR', -0.12) };
    const za = (n: JointName, y: number, z = 0) => { const t = new TransformNode(this.id + 'za' + n, scene); t.parent = this.j[n]; t.position.set(0, y, z); return t; };
    this.zoneAnchor = { head: za('neck', 0.22, 0.1), torso: za('torso', 0.55, 0.25), arms: za('elR', 0, 0.08), legs: za('knL', 0, 0.12) };
    this.build(shW, torsoStyle);
    if (spec.scale) this.root.scaling.setAll(spec.scale);
  }

  /* ---------- materials ---------- */
  private paintFor(slot: SlotId, which: 'primary' | 'secondary' | 'accent') {
    if (which === 'primary' && this.spec.slotPaint?.[slot]) return this.spec.slotPaint[slot]!;
    return this.spec.paint[which];
  }
  private zoneOf(slot: SlotId): Zone {
    if (slot === 'head') return 'head';
    if (['legs', 'feet'].includes(slot)) return 'legs';
    if (['armL', 'armR', 'foreL', 'foreR', 'handL', 'handR', 'weapon', 'hydraulics'].includes(slot)) return 'arms';
    return 'torso';
  }
  private M(slot: SlotId, kind: 'P' | 'S' | 'A' | 'D' | 'C' | 'K' | 'G' | 'CORE' | 'HOT' | 'ICE'): Material {
    const zone = this.zoneOf(slot);
    const p = this.spec.paint;
    let key: string, make: () => Material;
    switch (kind) {
      case 'P': { const c = this.paintFor(slot, 'primary'); key = `P${zone}${c}`; make = () => this.zoneMat(metal(this.scene, key, c, 0.35, 0.38, { bump: 0.55, uv: 1.5 }), zone); break; }
      case 'S': { const c = p.secondary; key = `S${zone}${c}`; make = () => this.zoneMat(metal(this.scene, key, c, 0.6, 0.45, { bump: 0.35, uv: 2 }), zone); break; }
      case 'A': { const c = p.accent; key = `A${c}`; make = () => metal(this.scene, key, c, 0.85, 0.3, { uv: 2 }); break; }
      case 'D': key = 'D'; make = () => this.zoneMat(metal(this.scene, 'D' + this.id, '#4A4E55', 0.8, 0.45, { bump: 0.25, uv: 3 }), zone); key = 'D' + zone; break;
      case 'C': key = 'C'; make = () => metal(this.scene, 'C' + this.id, '#D8DDE3', 1, 0.16, { wear: false }); break;
      case 'K': key = 'K'; make = () => metal(this.scene, 'K' + this.id, '#18191C', 0.2, 0.75, { wear: false }); break;
      case 'G': key = 'G'; make = () => { const g = glow(this.scene, 'G' + this.id, p.glow, 1.4); this.eyeMat = g; this.eyeBase = g.emissiveColor.clone(); return g; }; break;
      case 'HOT': key = 'HOT'; make = () => glow(this.scene, 'H' + this.id, '#FF7A2A', 1.3); break;
      case 'ICE': key = 'ICE'; make = () => glow(this.scene, 'I' + this.id, '#6ADFFF', 1.2); break;
      case 'CORE': { const st = PART_BY_ID[this.spec.parts.core || '']?.style || 'fusion'; key = 'CORE'; make = () => { const g = glow(this.scene, 'core' + this.id, CORE_COLORS[st] || '#4FD8FF', 1.8); this.coreMat = g; this.coreBase = g.emissiveColor.clone(); return g; }; break; }
    }
    let m = this.mats.get(key);
    if (!m) { m = make(); this.mats.set(key, m); }
    return m;
  }
  private zoneMat(m: PBRMaterial, zone: Zone) { this.zoneMats[zone].push({ m, base: m.albedoColor.clone() }); return m; }

  /* ---------- primitive helpers (local coordinates of a segment) ---------- */
  private place(m: Mesh, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); return m; }
  private box(s: Seg, mat: Material, w: number, h: number, d: number, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) {
    s.prims.push({ mesh: this.place(MeshBuilder.CreateBox('b', { width: w, height: h, depth: d }, this.scene), x, y, z, rx, ry, rz), mat });
  }
  private cyl(s: Seg, mat: Material, dt: number, db: number, h: number, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0, tess = 16) {
    s.prims.push({ mesh: this.place(MeshBuilder.CreateCylinder('c', { diameterTop: dt, diameterBottom: db, height: h, tessellation: tess }, this.scene), x, y, z, rx, ry, rz), mat });
  }
  private sph(s: Seg, mat: Material, d: number, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1, seg = 12) {
    const m = this.place(MeshBuilder.CreateSphere('s', { diameter: d, segments: seg }, this.scene), x, y, z); m.scaling.set(sx, sy, sz); s.prims.push({ mesh: m, mat });
  }
  private tor(s: Seg, mat: Material, d: number, t: number, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) {
    s.prims.push({ mesh: this.place(MeshBuilder.CreateTorus('t', { diameter: d, thickness: t, tessellation: 20 }, this.scene), x, y, z, rx, ry, rz), mat });
  }
  private finalize(s: Seg) {
    const groups = new Map<Material, Mesh[]>();
    for (const p of s.prims) { const arr = groups.get(p.mat) || []; arr.push(p.mesh); groups.set(p.mat, arr); }
    for (const [mat, arr] of groups) {
      const merged = arr.length === 1 ? arr[0] : Mesh.MergeMeshes(arr, true, true);
      if (!merged) continue;
      merged.material = mat; merged.parent = s.node; merged.name = this.id + 'm';
      merged.receiveShadows = true;
      merged.isPickable = false;
      merged.freezeNormals?.();
      this.meshes.push(merged);
    }
    s.prims = [];
  }

  /* ---------- build ---------- */
  private build(shW: number, torsoStyle: string) {
    const st = (s: SlotId) => { const id = this.spec.parts[s]; return id ? PART_BY_ID[id]?.style : undefined; };
    const plating = st('plating');
    this.buildPelvis();
    this.buildTorso(torsoStyle, shW, plating, st('cooling'), st('core'));
    this.buildHead(st('head') || 'visor');
    for (const side of ['L', 'R'] as const) {
      const sg = side === 'L' ? -1 : 1;
      this.buildUpperArm(side, sg, st(side === 'L' ? 'armL' : 'armR') || 'piston', plating);
      this.buildForearm(side, sg, st(side === 'L' ? 'foreL' : 'foreR') || 'gauntlet');
      this.buildHand(side, sg, st(side === 'L' ? 'handL' : 'handR') || 'fist', st('weapon'));
      this.buildLeg(side, sg, st('legs') || 'strider', st('feet') || 'plate');
    }
    this.buildWeapon(st('weapon'));
    this.buildPistons(st('hydraulics') || 'standard');
    this.buildDecal(torsoStyle);
  }

  private buildPelvis() {
    const s = new Seg(this.j.pelvis);
    this.box(s, this.M('legs', 'S'), 0.5, 0.18, 0.3, 0, -0.02, 0);
    this.box(s, this.M('legs', 'P'), 0.22, 0.2, 0.08, 0, -0.06, 0.15, -0.15);
    this.cyl(s, this.M('torso', 'D'), 0.44, 0.48, 0.1, 0, 0.08, 0);
    this.box(s, this.M('legs', 'P'), 0.12, 0.16, 0.26, -0.27, -0.04, 0, 0, 0, 0.2);
    this.box(s, this.M('legs', 'P'), 0.12, 0.16, 0.26, 0.27, -0.04, 0, 0, 0, -0.2);
    this.finalize(s);
  }

  private buildTorso(style: string, shW: number, plating: string | undefined, cooling: string | undefined, core: string | undefined) {
    const s = new Seg(this.j.torso);
    const P = this.M('torso', 'P'), S = this.M('torso', 'S'), A = this.M('torso', 'A'), D = this.M('torso', 'D'), C = this.M('torso', 'C'), K = this.M('torso', 'K');
    // waist & spine
    this.cyl(s, D, 0.36, 0.42, 0.16, 0, 0.06, 0);
    this.cyl(s, C, 0.05, 0.05, 0.32, -0.08, 0.24, -0.04); this.cyl(s, C, 0.05, 0.05, 0.32, 0.08, 0.24, -0.04);
    this.cyl(s, D, 0.09, 0.09, 0.14, -0.08, 0.17, -0.04); this.cyl(s, D, 0.09, 0.09, 0.14, 0.08, 0.17, -0.04);
    this.box(s, S, 0.34, 0.24, 0.26, 0, 0.27, 0.02);
    for (let i = 0; i < 3; i++) this.box(s, K, 0.3, 0.025, 0.02, 0, 0.2 + i * 0.06, 0.15);
    let front = 0.22; let coreD = 0.17;
    if (style === 'boxer') {
      this.box(s, P, 0.8, 0.4, 0.42, 0, 0.6, 0);
      this.box(s, P, 0.58, 0.18, 0.38, 0, 0.36, 0.01, 0.12);
      this.box(s, P, 0.34, 0.22, 0.07, -0.18, 0.62, 0.22, 0, -0.18); this.box(s, P, 0.34, 0.22, 0.07, 0.18, 0.62, 0.22, 0, 0.18);
      this.box(s, S, 0.5, 0.08, 0.32, 0, 0.82, -0.02);
      this.box(s, A, 0.04, 0.3, 0.04, 0, 0.58, 0.245);
      front = 0.27;
    } else if (style === 'heavy') {
      this.cyl(s, P, 0.88, 0.76, 0.56, 0, 0.58, 0, 0, 0, 0, 18);
      this.tor(s, A, 0.82, 0.06, 0, 0.42, 0);
      this.cyl(s, S, 0.7, 0.88, 0.1, 0, 0.9, 0);
      for (const x of [-0.25, 0.25]) this.box(s, D, 0.12, 0.3, 0.05, x, 0.6, 0.38, 0, x > 0 ? 0.4 : -0.4);
      front = 0.36; coreD = 0.22;
    } else if (style === 'sleek') {
      this.box(s, P, 0.58, 0.34, 0.32, 0, 0.62, 0);
      for (let i = 0; i < 4; i++) this.box(s, D, 0.5 - i * 0.06, 0.03, 0.04, 0, 0.36 + i * 0.05, 0.14);
      this.box(s, A, 0.28, 0.2, 0.06, -0.14, 0.64, 0.17, 0, -0.35); this.box(s, A, 0.28, 0.2, 0.06, 0.14, 0.64, 0.17, 0, 0.35);
      this.box(s, S, 0.42, 0.06, 0.26, 0, 0.81, 0);
      front = 0.2; coreD = 0.13;
    } else if (style === 'block') {
      this.box(s, P, 0.96, 0.5, 0.5, 0, 0.6, 0);
      this.box(s, S, 0.6, 0.16, 0.44, 0, 0.32, 0);
      this.box(s, A, 0.96, 0.05, 0.52, 0, 0.86, 0);
      this.box(s, P, 0.3, 0.32, 0.08, -0.3, 0.6, 0.26); this.box(s, P, 0.3, 0.32, 0.08, 0.3, 0.6, 0.26);
      front = 0.3;
    } else { // reactor
      this.box(s, P, 0.7, 0.42, 0.24, 0, 0.6, -0.1);
      for (const x of [-0.3, 0.3]) this.box(s, S, 0.08, 0.46, 0.36, x, 0.6, 0.04);
      this.box(s, S, 0.68, 0.08, 0.4, 0, 0.84, 0); this.box(s, S, 0.6, 0.08, 0.38, 0, 0.38, 0);
      this.tor(s, this.M('torso', 'CORE'), 0.36, 0.05, 0, 0.6, 0.12, Math.PI / 2);
      for (const x of [-0.15, 0.15]) this.cyl(s, A, 0.05, 0.05, 0.4, x, 0.6, 0.12);
      front = 0.14; coreD = 0.24;
    }
    // core
    this.sph(s, this.M('torso', 'CORE'), coreD, 0, 0.58, front, 1, 1, 0.6);
    this.tor(s, D, coreD + 0.06, 0.04, 0, 0.58, front, Math.PI / 2);
    // shoulder mounts
    for (const sg of [-1, 1]) { this.box(s, S, 0.24, 0.2, 0.28, sg * (shW - 0.12), 0.72, 0); this.cyl(s, D, 0.16, 0.16, 0.08, sg * (shW - 0.02), 0.72, 0, 0, 0, Math.PI / 2); }
    // neck base & LEDs
    this.cyl(s, D, 0.2, 0.26, 0.08, 0, 0.88, 0);
    // plating overlay on chest
    if (plating === 'reactive') { for (let i = 0; i < 6; i++) this.box(s, P, 0.12, 0.09, 0.05, -0.15 + (i % 3) * 0.15, 0.52 + Math.floor(i / 3) * 0.12, front + 0.03); }
    else if (plating === 'composite') { this.box(s, P, 0.5, 0.06, 0.04, 0, 0.42, front - 0.02); this.box(s, P, 0.46, 0.06, 0.04, 0, 0.36, front - 0.03); }
    else if (plating === 'ceramic') { this.sph(s, P, 0.5, 0, 0.66, front - 0.12, 1.3, 0.5, 0.5); }
    else if (plating === 'steel') { this.box(s, P, 0.16, 0.08, 0.04, -0.24, 0.42, front - 0.04); this.box(s, P, 0.16, 0.08, 0.04, 0.24, 0.42, front - 0.04); }
    // back: cooling
    const back = style === 'heavy' ? -0.36 : style === 'block' ? -0.27 : -0.22;
    this.box(s, D, 0.46, 0.4, 0.1, 0, 0.6, back - 0.02);
    if (cooling === 'cryo') {
      for (const x of [-0.13, 0.13]) { this.cyl(s, this.M('torso', 'ICE'), 0.12, 0.12, 0.36, x, 0.6, back - 0.12); this.cyl(s, C, 0.14, 0.14, 0.04, x, 0.79, back - 0.12); }
      this.tor(s, this.M('torso', 'ICE'), 0.3, 0.03, 0, 0.6, back - 0.08, Math.PI / 2);
    } else if (cooling === 'fins') {
      for (let i = 0; i < 6; i++) this.box(s, P, 0.44, 0.025, 0.16, 0, 0.44 + i * 0.065, back - 0.12);
    }
    // LEDs
    this.finalize(s);
    for (let i = 0; i < 3; i++) {
      const led = MeshBuilder.CreateBox('led', { width: 0.04, height: 0.03, depth: 0.02 }, this.scene);
      const lm = glow(this.scene, 'led' + this.id + i, i === 1 ? '#FF3A3A' : this.spec.paint.glow, 1.2); this.leds.push({ m: lm, base: lm.emissiveColor.clone() });
      led.material = lm; led.parent = this.j.torso; led.position.set(-0.08 + i * 0.08, 0.84, 0.17); this.meshes.push(led);
    }
    if (!cooling || cooling === 'fan') {
      for (const x of [-0.12, 0.12]) {
        const housing = MeshBuilder.CreateCylinder('fanH', { diameter: 0.22, height: 0.06, tessellation: 18 }, this.scene);
        housing.material = this.M('torso', 'K'); housing.parent = this.j.torso; housing.position.set(x, 0.6, back - 0.09); housing.rotation.x = Math.PI / 2; this.meshes.push(housing);
        const fan = MeshBuilder.CreateBox('fan', { width: 0.19, height: 0.03, depth: 0.012 }, this.scene);
        const fan2 = MeshBuilder.CreateBox('fan', { width: 0.03, height: 0.19, depth: 0.012 }, this.scene);
        const f = Mesh.MergeMeshes([fan, fan2], true)!; f.material = this.M('torso', 'C'); f.parent = this.j.torso; f.position.set(x, 0.6, back - 0.125);
        this.spinners.push({ mesh: f, speed: 14, axis: 'z' }); this.meshes.push(f);
      }
    }
  }

  private buildHead(style: string) {
    const s = new Seg(this.j.neck);
    const P = this.M('head', 'P'), S = this.M('head', 'S'), A = this.M('head', 'A'), D = this.M('head', 'D'), G = this.M('head', 'G'), C = this.M('head', 'C');
    this.cyl(s, D, 0.13, 0.15, 0.14, 0, 0.05, 0);
    if (style === 'visor') {
      this.box(s, S, 0.3, 0.26, 0.32, 0, 0.21, 0);
      this.box(s, P, 0.3, 0.12, 0.06, 0, 0.12, 0.15, -0.15);
      this.box(s, G, 0.27, 0.055, 0.03, 0, 0.245, 0.162);
      this.box(s, P, 0.33, 0.05, 0.33, 0, 0.35, 0);
      for (const x of [-0.17, 0.17]) this.cyl(s, D, 0.1, 0.1, 0.05, x, 0.22, 0, 0, 0, Math.PI / 2);
      this.cyl(s, C, 0.015, 0.015, 0.16, 0.1, 0.44, -0.08);
    } else if (style === 'dome') {
      this.sph(s, P, 0.38, 0, 0.23, 0, 1, 0.9, 1, 16);
      for (const x of [-0.07, 0.07]) { this.sph(s, G, 0.065, x, 0.25, 0.16); this.tor(s, D, 0.08, 0.015, x, 0.25, 0.155, Math.PI / 2); }
      for (let i = 0; i < 3; i++) this.box(s, D, 0.16, 0.02, 0.04, 0, 0.1 + i * 0.035, 0.155);
      this.box(s, S, 0.26, 0.08, 0.2, 0, 0.08, 0.05);
      this.tor(s, A, 0.36, 0.03, 0, 0.2, 0, 0);
    } else if (style === 'blade') {
      this.box(s, S, 0.24, 0.22, 0.3, 0, 0.2, 0);
      this.box(s, P, 0.04, 0.2, 0.38, 0, 0.37, -0.03, 0.3);
      this.box(s, G, 0.11, 0.025, 0.02, -0.06, 0.24, 0.155, 0, 0, -0.3); this.box(s, G, 0.11, 0.025, 0.02, 0.06, 0.24, 0.155, 0, 0, 0.3);
      for (const x of [-0.13, 0.13]) this.box(s, P, 0.04, 0.2, 0.26, x, 0.18, 0.02, 0, x > 0 ? -0.25 : 0.25);
      this.box(s, A, 0.16, 0.06, 0.06, 0, 0.1, 0.14, 0.4);
    } else if (style === 'mono') {
      this.cyl(s, S, 0.34, 0.34, 0.3, 0, 0.21, 0, 0, 0, Math.PI / 2, 18);
      this.cyl(s, G, 0.14, 0.14, 0.04, 0, 0.22, 0.16, Math.PI / 2);
      this.tor(s, D, 0.18, 0.03, 0, 0.22, 0.165, Math.PI / 2);
      this.box(s, P, 0.32, 0.06, 0.3, 0, 0.38, -0.02);
      this.box(s, P, 0.04, 0.12, 0.2, 0, 0.44, -0.04);
    } else { // crown
      this.box(s, P, 0.32, 0.26, 0.3, 0, 0.21, 0);
      this.box(s, S, 0.26, 0.1, 0.05, 0, 0.12, 0.15);
      for (const x of [-0.07, 0.07]) this.box(s, G, 0.08, 0.04, 0.02, x, 0.25, 0.155);
      for (const x of [-0.11, 0, 0.11]) this.cyl(s, A, 0, 0.07, x === 0 ? 0.16 : 0.12, x, 0.4 + (x === 0 ? 0.02 : 0), 0);
      this.box(s, A, 0.34, 0.03, 0.32, 0, 0.34, 0);
    }
    this.finalize(s);
  }

  private pauldron(s: Seg, sg: number, plating: string | undefined, P: Material, A: Material) {
    if (plating === 'composite') { for (let i = 0; i < 3; i++) this.box(s, P, 0.3 - i * 0.04, 0.04, 0.32 - i * 0.03, sg * 0.04, 0.1 - i * 0.05, 0, 0, 0, sg * 0.3); }
    else if (plating === 'reactive') { this.box(s, P, 0.28, 0.06, 0.3, sg * 0.04, 0.06, 0, 0, 0, sg * 0.25); for (let i = 0; i < 4; i++) this.box(s, P, 0.1, 0.06, 0.1, sg * 0.04 + (i % 2 - 0.5) * 0.12, 0.12, (Math.floor(i / 2) - 0.5) * 0.13, 0, 0, sg * 0.25); }
    else if (plating === 'ceramic') { this.sph(s, P, 0.36, sg * 0.04, 0.06, 0, 1, 0.6, 1); }
    else { this.box(s, P, 0.3, 0.16, 0.34, sg * 0.04, 0.06, 0, 0, 0, sg * 0.25); this.box(s, A, 0.3, 0.03, 0.35, sg * 0.04, 0.0, 0, 0, 0, sg * 0.25); }
  }

  private buildUpperArm(side: 'L' | 'R', sg: number, style: string, plating: string | undefined) {
    const slot: SlotId = side === 'L' ? 'armL' : 'armR';
    const s = new Seg(this.j[('sh' + side) as JointName]);
    const P = this.M(slot, 'P'), S = this.M(slot, 'S'), A = this.M(slot, 'A'), D = this.M(slot, 'D'), C = this.M(slot, 'C');
    this.sph(s, D, 0.22, 0, 0, 0);
    this.pauldron(s, sg, plating, P, A);
    if (style === 'piston') {
      this.cyl(s, S, 0.12, 0.13, 0.36, 0, -0.21, 0);
      this.box(s, P, 0.15, 0.26, 0.06, 0, -0.2, 0.07);
      this.cyl(s, D, 0.06, 0.06, 0.16, sg * 0.07, -0.14, -0.04); this.cyl(s, C, 0.03, 0.03, 0.2, sg * 0.07, -0.3, -0.04);
    } else if (style === 'heavy') {
      this.box(s, P, 0.24, 0.32, 0.26, 0, -0.2, 0);
      this.box(s, A, 0.26, 0.04, 0.28, 0, -0.06, 0);
      this.box(s, S, 0.18, 0.08, 0.2, 0, -0.38, 0);
    } else if (style === 'light') {
      for (const x of [-0.04, 0.04]) this.cyl(s, S, 0.05, 0.05, 0.38, x, -0.21, 0);
      this.box(s, P, 0.1, 0.16, 0.06, 0, -0.18, 0.05);
      this.cyl(s, A, 0.08, 0.08, 0.04, 0, -0.32, 0);
    } else { // cable
      this.cyl(s, S, 0.13, 0.13, 0.36, 0, -0.21, 0);
      for (const y of [-0.1, -0.2, -0.3]) this.tor(s, A, 0.15, 0.025, 0, y, 0);
      this.box(s, P, 0.08, 0.3, 0.05, 0, -0.2, 0.07);
    }
    this.finalize(s);
  }

  private buildForearm(side: 'L' | 'R', sg: number, style: string) {
    const slot: SlotId = side === 'L' ? 'foreL' : 'foreR';
    const s = new Seg(this.j[('el' + side) as JointName]);
    const P = this.M(slot, 'P'), S = this.M(slot, 'S'), A = this.M(slot, 'A'), D = this.M(slot, 'D'), C = this.M(slot, 'C'), G = this.M(slot, 'G');
    this.cyl(s, D, 0.14, 0.14, 0.2, 0, 0, 0, 0, 0, Math.PI / 2);
    if (style === 'gauntlet') {
      this.cyl(s, P, 0.15, 0.21, 0.32, 0, -0.22, 0);
      this.tor(s, A, 0.2, 0.03, 0, -0.37, 0);
      this.box(s, S, 0.08, 0.22, 0.05, sg * 0.09, -0.2, 0, 0, 0, sg * 0.1);
    } else if (style === 'ram') {
      this.box(s, P, 0.18, 0.34, 0.2, 0, -0.2, 0);
      this.cyl(s, D, 0.09, 0.09, 0.16, 0, -0.12, 0.13); this.cyl(s, C, 0.055, 0.055, 0.26, 0, -0.27, 0.13);
      this.box(s, A, 0.2, 0.04, 0.22, 0, -0.38, 0);
    } else if (style === 'blade') {
      this.cyl(s, S, 0.11, 0.13, 0.34, 0, -0.2, 0);
      this.box(s, A, 0.02, 0.4, 0.13, sg * 0.08, -0.22, -0.02, 0.1);
      this.box(s, P, 0.1, 0.2, 0.05, 0, -0.18, 0.06);
    } else { // coil
      this.cyl(s, S, 0.13, 0.14, 0.34, 0, -0.2, 0);
      for (const y of [-0.12, -0.2, -0.28]) this.tor(s, G, 0.16, 0.022, 0, y, 0);
      this.box(s, P, 0.06, 0.3, 0.04, 0, -0.2, 0.07);
    }
    this.finalize(s);
    void C;
  }

  private buildHand(side: 'L' | 'R', sg: number, style: string, weapon: string | undefined) {
    const slot: SlotId = side === 'L' ? 'handL' : 'handR';
    const s = new Seg(this.j[('wr' + side) as JointName]);
    const P = this.M(slot, 'P'), S = this.M(slot, 'S'), A = this.M(slot, 'A'), D = this.M(slot, 'D'), G = this.M(slot, 'G');
    this.sph(s, D, 0.11, 0, 0, 0);
    if (style === 'mace') {
      this.sph(s, P, 0.22, 0, -0.11, 0.01);
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; this.sph(s, A, 0.05, Math.cos(a) * 0.1, -0.11 + Math.sin(a) * 0.1, 0.06); }
    } else if (style === 'claw') {
      this.box(s, S, 0.13, 0.08, 0.11, 0, -0.07, 0);
      for (const x of [-0.04, 0, 0.04]) this.box(s, A, 0.022, 0.16, 0.03, x, -0.17, 0.04, 0.35);
      this.box(s, A, 0.022, 0.1, 0.03, sg * -0.07, -0.1, 0.05, 0.3, 0, sg * 0.5);
    } else {
      this.box(s, S, 0.15, 0.13, 0.13, 0, -0.08, 0);
      for (let i = 0; i < 4; i++) this.box(s, P, 0.033, 0.06, 0.1, -0.05 + i * 0.034, -0.15, 0.02);
      this.box(s, P, 0.04, 0.08, 0.05, sg * -0.085, -0.1, 0.04, 0, 0, sg * 0.2);
      if (style === 'knuckle' || weapon === 'shock') this.box(s, G, 0.15, 0.03, 0.04, 0, -0.17, 0.06);
      else this.box(s, A, 0.15, 0.03, 0.04, 0, -0.165, 0.065);
    }
    if (weapon === 'shock') for (const x of [-0.04, 0.04]) this.cyl(s, G, 0.015, 0.02, 0.06, x, -0.2, 0.06);
    this.finalize(s);
  }

  private buildLeg(side: 'L' | 'R', sg: number, style: string, feet: string) {
    const hip = new Seg(this.j[('hip' + side) as JointName]);
    const knee = new Seg(this.j[('kn' + side) as JointName]);
    const ank = new Seg(this.j[('an' + side) as JointName]);
    const P = this.M('legs', 'P'), S = this.M('legs', 'S'), A = this.M('legs', 'A'), D = this.M('legs', 'D'), C = this.M('legs', 'C');
    this.sph(hip, D, 0.2, 0, 0, 0);
    if (style === 'column') {
      this.cyl(hip, P, 0.28, 0.24, 0.42, 0, -0.24, 0);
      this.sph(knee, D, 0.24, 0, 0, 0);
      this.box(knee, P, 0.27, 0.42, 0.27, 0, -0.26, 0);
      this.box(knee, A, 0.29, 0.04, 0.29, 0, -0.08, 0);
    } else if (style === 'sprint') {
      this.box(hip, S, 0.14, 0.4, 0.14, 0, -0.24, 0);
      this.box(hip, P, 0.16, 0.24, 0.05, 0, -0.22, 0.08);
      this.cyl(knee, D, 0.12, 0.12, 0.18, 0, 0, 0, 0, 0, Math.PI / 2);
      for (const x of [-0.04, 0.04]) this.cyl(knee, S, 0.045, 0.045, 0.44, x, -0.25, -0.02);
      this.tor(knee, A, 0.14, 0.03, 0, -0.18, 0); this.tor(knee, A, 0.14, 0.03, 0, -0.3, 0);
      this.box(knee, P, 0.12, 0.26, 0.04, 0, -0.24, 0.07);
    } else if (style === 'servo') {
      this.cyl(hip, S, 0.2, 0.18, 0.42, 0, -0.24, 0);
      for (const y of [-0.14, -0.32]) this.tor(hip, A, 0.22, 0.03, 0, y, 0);
      this.box(hip, P, 0.14, 0.3, 0.05, 0, -0.24, 0.1);
      this.cyl(knee, D, 0.16, 0.16, 0.24, 0, 0, 0, 0, 0, Math.PI / 2);
      this.cyl(knee, P, 0.18, 0.23, 0.42, 0, -0.26, 0);
    } else { // strider
      this.box(hip, P, 0.21, 0.38, 0.23, 0, -0.24, 0);
      this.box(hip, S, 0.14, 0.14, 0.16, 0, -0.44, 0);
      this.box(knee, A, 0.17, 0.15, 0.1, 0, 0.0, 0.1, -0.3);
      this.cyl(knee, D, 0.14, 0.14, 0.22, 0, 0, 0, 0, 0, Math.PI / 2);
      this.box(knee, S, 0.17, 0.4, 0.18, 0, -0.25, 0);
      this.box(knee, P, 0.15, 0.3, 0.05, 0, -0.22, 0.1);
    }
    this.sph(ank, D, 0.12, 0, 0, 0);
    if (feet === 'talon') {
      for (const a of [-0.35, 0, 0.35]) this.box(ank, S, 0.05, 0.06, 0.22, Math.sin(a) * 0.08, -0.05, 0.1 + Math.cos(a) * 0.02, 0, a);
      this.box(ank, A, 0.05, 0.06, 0.12, 0, -0.05, -0.1);
      this.box(ank, P, 0.12, 0.08, 0.12, 0, -0.04, 0);
    } else if (feet === 'boot') {
      this.box(ank, P, 0.22, 0.14, 0.3, 0, -0.02, 0.04);
      this.sph(ank, P, 0.22, 0, -0.02, 0.18, 1, 0.65, 0.7);
      this.box(ank, D, 0.23, 0.03, 0.34, 0, -0.08, 0.05);
    } else {
      this.box(ank, D, 0.25, 0.08, 0.4, 0, -0.04, 0.06);
      this.box(ank, P, 0.22, 0.06, 0.16, 0, 0.01, 0.15, 0.15);
      this.box(ank, P, 0.2, 0.08, 0.12, 0, 0.0, -0.08);
    }
    void C; void sg;
    this.finalize(hip); this.finalize(knee); this.finalize(ank);
  }

  private buildWeapon(w: string | undefined) {
    if (!w) return;
    const s = new Seg(this.j.elR);
    const D = this.M('weapon', 'D'), C = this.M('weapon', 'C'), A = this.M('weapon', 'A');
    if (w === 'piston') {
      this.cyl(s, D, 0.12, 0.12, 0.3, 0, -0.16, 0.15); this.cyl(s, C, 0.07, 0.07, 0.3, 0, -0.38, 0.15); this.cyl(s, A, 0.14, 0.14, 0.04, 0, -0.03, 0.15);
    } else if (w === 'flame') {
      for (const x of [-0.05, 0.05]) { this.cyl(s, D, 0.05, 0.07, 0.24, x, -0.24, 0.13); this.cyl(s, this.M('weapon', 'HOT'), 0.04, 0.04, 0.02, x, -0.365, 0.13); }
      this.cyl(s, A, 0.1, 0.1, 0.18, 0, -0.12, -0.12);
    } else if (w === 'rocket') {
      for (const x of [-0.06, 0, 0.06]) this.cyl(s, D, 0.055, 0.055, 0.3, x, -0.2, 0.14);
      this.box(s, A, 0.2, 0.06, 0.08, 0, -0.08, 0.14);
    } else if (w === 'shock') {
      this.cyl(s, A, 0.08, 0.08, 0.16, 0.11, -0.18, 0); this.tor(s, this.M('weapon', 'G'), 0.1, 0.02, 0.11, -0.14, 0); this.tor(s, this.M('weapon', 'G'), 0.1, 0.02, 0.11, -0.22, 0);
    }
    this.finalize(s);
    if (w === 'saw') {
      const disc = MeshBuilder.CreateCylinder('saw', { diameter: 0.34, height: 0.02, tessellation: 24 }, this.scene);
      const teeth: Mesh[] = [disc];
      for (let i = 0; i < 12; i++) { const t = MeshBuilder.CreateBox('tooth', { width: 0.04, height: 0.02, depth: 0.04 }, this.scene); const a = i / 12 * Math.PI * 2; t.position.set(Math.cos(a) * 0.18, 0, Math.sin(a) * 0.18); t.rotation.y = -a + 0.6; teeth.push(t); }
      const saw = Mesh.MergeMeshes(teeth, true)!; saw.material = this.M('weapon', 'C');
      const hub = new TransformNode('sawHub', this.scene); hub.parent = this.j.elR; hub.position.set(0.15, -0.22, 0); hub.rotation.z = Math.PI / 2;
      saw.parent = hub; this.spinners.push({ mesh: saw, speed: 18, axis: 'y' }); this.meshes.push(saw);
    }
  }

  private buildPistons(style: string) {
    const sleeveMat = style === 'over' ? this.M('hydraulics', 'A') : this.M('hydraulics', 'D');
    const rodMat = this.M('hydraulics', 'C');
    const ringMat = style === 'mag' ? this.M('hydraulics', 'G') : style === 'over' ? this.M('hydraulics', 'HOT') : null;
    const mkCyl = (d: number, len: number, mat: Material) => {
      const m = MeshBuilder.CreateCylinder('pst', { diameter: d, height: len, tessellation: 10 }, this.scene);
      m.rotation.x = Math.PI / 2; m.position.z = len / 2; m.bakeCurrentTransformIntoVertices();
      m.material = mat; this.meshes.push(m); m.isPickable = false; return m;
    };
    const anchor = (parent: JointName, x: number, y: number, z: number) => { const t = new TransformNode('anc', this.scene); t.parent = this.j[parent]; t.position.set(x, y, z); return t; };
    const pairs: [JointName, [number, number, number], JointName, [number, number, number]][] = [
      ['shL', [0, -0.1, -0.09], 'elL', [0, -0.1, -0.08]], ['shR', [0, -0.1, -0.09], 'elR', [0, -0.1, -0.08]],
      ['hipL', [0, -0.12, 0.13], 'knL', [0, -0.14, 0.11]], ['hipR', [0, -0.12, 0.13], 'knR', [0, -0.14, 0.11]],
    ];
    for (const [ja, pa, jb, pb] of pairs) {
      const sleeve = mkCyl(0.065, 0.2, sleeveMat); const rod = mkCyl(0.035, 0.24, rodMat);
      if (ringMat) { const ring = MeshBuilder.CreateTorus('ring', { diameter: 0.075, thickness: 0.018, tessellation: 12 }, this.scene); ring.rotation.x = Math.PI / 2; ring.position.z = 0.18; ring.bakeCurrentTransformIntoVertices(); ring.material = ringMat; ring.parent = sleeve; this.meshes.push(ring); }
      this.pistons.push({ a: anchor(ja, ...pa), b: anchor(jb, ...pb), sleeve, rod });
    }
  }

  private buildDecal(style: string) {
    const kind = DECALS[this.spec.decal % DECALS.length];
    const acc = this.spec.paint.accent;
    const tex = canvasTexture(this.scene, 'decal' + this.id, 128, 128, (g) => {
      g.fillStyle = acc; g.strokeStyle = 'rgba(0,0,0,0.6)'; g.lineWidth = 4;
      g.translate(64, 64);
      g.beginPath();
      if (kind === 'bolt') { g.moveTo(10, -50); g.lineTo(-24, 6); g.lineTo(0, 6); g.lineTo(-12, 52); g.lineTo(26, -10); g.lineTo(2, -10); g.closePath(); }
      else if (kind === 'star') { for (let i = 0; i < 10; i++) { const r = i % 2 ? 22 : 50, a = i / 10 * Math.PI * 2 - Math.PI / 2; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); }
      else if (kind === 'skull') { g.arc(0, -8, 36, 0, Math.PI * 2); g.rect(-22, 18, 44, 26); }
      else if (kind === 'crown') { g.moveTo(-46, 30); g.lineTo(-46, -24); g.lineTo(-22, 4); g.lineTo(0, -38); g.lineTo(22, 4); g.lineTo(46, -24); g.lineTo(46, 30); g.closePath(); }
      else if (kind === 'flame') { g.moveTo(0, 52); g.bezierCurveTo(-48, 40, -30, -10, -6, -50); g.bezierCurveTo(-4, -20, 14, -26, 18, -40); g.bezierCurveTo(44, -4, 46, 44, 0, 52); }
      else { for (let i = 0; i < 16; i++) { const r = i % 2 ? 36 : 48, a = i / 16 * Math.PI * 2; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); }
      g.fill(); g.stroke();
      if (kind === 'skull') { g.fillStyle = 'rgba(0,0,0,0.85)'; g.beginPath(); g.arc(-13, -8, 9, 0, 7); g.arc(13, -8, 9, 0, 7); g.fill(); }
      if (kind === 'gear') { g.fillStyle = 'rgba(0,0,0,0.85)'; g.beginPath(); g.arc(0, 0, 16, 0, 7); g.fill(); }
    }, true);
    const m = this.decalMat = new StandardMaterial('decalM' + this.id, this.scene);
    m.diffuseTexture = tex; m.useAlphaFromDiffuseTexture = true; m.emissiveColor = new Color3(0.25, 0.25, 0.25); m.specularColor = Color3.Black(); m.backFaceCulling = false;
    m.zOffset = -2;
    const plane = MeshBuilder.CreatePlane('decal', { size: 0.17 }, this.scene);
    plane.material = m; plane.parent = this.j.torso;
    const off = ({ boxer: [0.2, 0.7, 0.26], heavy: [0.22, 0.66, 0.37], sleek: [0.15, 0.7, 0.21], block: [0.3, 0.72, 0.31], reactor: [0.24, 0.73, 0.14] } as Record<string, number[]>)[style] || [0.2, 0.7, 0.26];
    plane.position.set(off[0], off[1], off[2] + 0.04); plane.rotation.y = Math.PI;
    this.meshes.push(plane);
  }

  /* ---------- runtime ---------- */
  setDamage(zone: Zone, frac: number) {
    frac = Math.max(0, Math.min(1, frac));
    if (Math.abs(this.dmg[zone] - frac) < 0.02) return;
    this.dmg[zone] = frac;
    const burnt = new Color3(0.035, 0.03, 0.025);
    const t = textures(this.scene);
    for (const { m, base } of this.zoneMats[zone]) {
      m.albedoColor = Color3.Lerp(base, burnt, frac * 0.6);
      m.roughness = Math.min(0.85, (m.roughness || 0.4) * 0 + 0.42 + frac * 0.35);
      if (frac > 0.45 && m.albedoTexture !== t.dmg) m.albedoTexture = t.dmg;
    }
  }
  resetDamage() { for (const z of ['head', 'torso', 'arms', 'legs'] as Zone[]) { this.dmg[z] = 0.5; this.setDamage(z, 0); for (const { m } of this.zoneMats[z]) m.albedoTexture = textures(this.scene).wear; } }

  update(dt: number, heat = 0) {
    this.t += dt;
    for (const p of this.pistons) {
      const a = p.a.getAbsolutePosition(), b = p.b.getAbsolutePosition();
      p.sleeve.position.copyFrom(a); p.rod.position.copyFrom(b);
      if (Vector3.DistanceSquared(a, b) > 1e-6) { p.sleeve.lookAt(b); p.rod.lookAt(a); }
    }
    for (const s of this.spinners) s.mesh.rotation[s.axis] += s.speed * dt;
    const blink = Math.floor(this.t * 2) % 2 === 0;
    this.leds.forEach((l, i) => { const on = blink !== (i % 2 === 0); l.m.emissiveColor = l.base.scale(on ? 1 : 0.15); });
    if (this.eyeMat) {
      const crit = this.dmg.head > 0.75;
      const k = crit ? (Math.random() < 0.25 ? 0.1 : 1) : 1;
      this.eyeMat.emissiveColor = this.eyeBase.scale(k);
    }
    if (this.coreMat) {
      const crit = this.dmg.torso > 0.75;
      const pulse = 0.85 + Math.sin(this.t * 4) * 0.15 + heat * 0.6;
      const k = crit && Math.random() < 0.2 ? 0.15 : pulse;
      this.coreMat.emissiveColor = this.coreBase.scale(k);
    }
  }

  setEnabled(v: boolean) { this.root.setEnabled(v); for (const p of this.pistons) { p.sleeve.setEnabled(v); p.rod.setEnabled(v); } }

  dispose() {
    for (const p of this.pistons) { p.sleeve.dispose(); p.rod.dispose(); }
    // Shared wear/normal textures belong to the scene, so keep them: only this robot's own materials go.
    this.root.dispose(false, false);
    for (const m of this.mats.values()) m.dispose(false, false);
    this.decalMat?.dispose(false, true);
    for (const l of this.leds) l.m.dispose();
  }
}

export function specColor(h: string) { return hex(h); }
