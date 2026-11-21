import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { ReflectionProbe } from '@babylonjs/core/Probes/reflectionProbe';
import { RenderTargetTexture } from '@babylonjs/core/Materials/Textures/renderTargetTexture';
import { ImageProcessingConfiguration } from '@babylonjs/core/Materials/imageProcessingConfiguration';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { RobotModel, type RobotSpec } from './robotModel';
import { Animator } from '../combat/animator';
import { metal, glow, canvasTexture, hex } from './materials';

/** The workshop scene shown behind every menu. */
export class Garage {
  scene: Scene; cam: ArcRotateCamera; model: RobotModel | null = null; private anim: Animator | null = null;
  private turntable: AbstractMesh; private sg: ShadowGenerator | null = null; private yaw = 0.5; private yawVel = 0;
  private drag: { id: number; x: number } | null = null; private pinch = new Map<number, { x: number; y: number }>(); private pinchD = 0;
  private t = 0; offsetX = 0; offsetY = 0; targetRadius = 6.2; private spinIdle = true; private lastSpec = '';
  interactive = true;

  constructor(private engine: Engine, canvas: HTMLCanvasElement, quality: string) {
    const s = this.scene = new Scene(engine);
    s.clearColor = new Color4(0.04, 0.045, 0.055, 1);
    const ip = s.imageProcessingConfiguration; ip.toneMappingEnabled = true; ip.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES; ip.exposure = 1.3; ip.contrast = 1.1;
    ip.vignetteEnabled = true; ip.vignetteWeight = 2.2;
    this.cam = new ArcRotateCamera('gcam', -Math.PI / 2, 1.33, 6.2, new Vector3(0, 1.35, 0), s);
    this.cam.fov = 0.8; this.cam.minZ = 0.1;
    const hemi = new HemisphericLight('h', new Vector3(0, 1, 0), s); hemi.intensity = 0.4; hemi.diffuse = hex('#a8b8d0'); hemi.groundColor = hex('#20242c');
    const key = new DirectionalLight('k', new Vector3(-0.5, -1, 0.6), s); key.position = new Vector3(5, 10, -6); key.intensity = 1.5; key.diffuse = hex('#fff2e0');
    const rimA = new PointLight('ra', new Vector3(-3, 3.2, 2.5), s); rimA.diffuse = hex('#4fd8ff'); rimA.intensity = 0.9; rimA.range = 12;
    const rimB = new PointLight('rb', new Vector3(3, 2.4, 2.5), s); rimB.diffuse = hex('#ffb12e'); rimB.intensity = 0.8; rimB.range = 12;
    // floor and set
    const envMeshes: AbstractMesh[] = [];
    const floor = MeshBuilder.CreateGround('gf', { width: 40, height: 40 }, s); floor.material = metal(s, 'gfM', '#2a2e34', 0.5, 0.55, { bump: 0.5, uv: 16 }); floor.receiveShadows = true; envMeshes.push(floor);
    const tt = this.turntable = MeshBuilder.CreateCylinder('tt', { diameter: 3.4, height: 0.16, tessellation: 48 }, s);
    tt.position.y = 0.08; tt.receiveShadows = true;
    const ttTex = canvasTexture(s, 'ttT', 512, 512, (g, w) => {
      g.fillStyle = '#25282e'; g.fillRect(0, 0, w, w); g.save(); g.translate(w / 2, w / 2);
      for (let i = 0; i < 24; i++) { g.rotate(Math.PI / 12); g.fillStyle = i % 2 ? '#e8b23a' : '#16181c'; g.beginPath(); g.moveTo(w * 0.42, -18); g.lineTo(w * 0.5, -18); g.lineTo(w * 0.5, 18); g.lineTo(w * 0.42, 18); g.fill(); }
      g.strokeStyle = '#4fd8ff'; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, w * 0.3, 0, 7); g.stroke(); g.restore();
    });
    const ttm = metal(s, 'ttM', '#ffffff', 0.6, 0.45, { bump: 0.3 }); ttm.albedoTexture = ttTex; tt.material = ttm; envMeshes.push(tt);
    const ring = MeshBuilder.CreateTorus('ttr', { diameter: 3.45, thickness: 0.04, tessellation: 64 }, s); ring.position.y = 0.16; ring.material = glow(s, 'ttG', '#4fd8ff', 1.2);
    const wallM = metal(s, 'wallM', '#30343c', 0.6, 0.6, { bump: 0.9, uv: 6 });
    for (let i = -3; i <= 3; i++) {
      const p = MeshBuilder.CreateBox('wall', { width: 3.6, height: 7, depth: 0.3 }, s); const a = i * 0.28;
      p.position.set(Math.sin(a) * 9, 3.5, Math.cos(a) * 9); p.rotation.y = a; p.material = wallM; envMeshes.push(p);
      const strip = MeshBuilder.CreateBox('ws', { width: 3.2, height: 0.08, depth: 0.05 }, s); strip.position.set(Math.sin(a) * 8.8, 5.2, Math.cos(a) * 8.8); strip.rotation.y = a; strip.material = glow(s, 'wsG', i % 2 ? '#ffb12e' : '#4fd8ff', 1);
    }
    // tool racks and crates
    const crateM = metal(s, 'crM', '#5a4a30', 0.3, 0.7, { bump: 0.6 });
    for (const [x, z, sc] of [[-4.5, 3, 1], [-5.2, 4.2, 0.7], [4.6, 3.4, 0.9], [5.4, 1.6, 0.6]]) { const c = MeshBuilder.CreateBox('crate', { size: sc }, s); c.position.set(x, sc / 2, z); c.rotation.y = x; c.material = crateM; envMeshes.push(c); c.receiveShadows = true; }
    const armM = metal(s, 'armM', '#e8b23a', 0.7, 0.4);
    const craneBase = MeshBuilder.CreateCylinder('cb', { diameter: 0.5, height: 0.4 }, s); craneBase.position.set(-3.4, 0.2, 1.5); craneBase.material = armM;
    const craneArm = MeshBuilder.CreateBox('ca', { width: 0.18, height: 3.2, depth: 0.18 }, s); craneArm.position.set(-3.4, 1.8, 1.5); craneArm.rotation.z = -0.2; craneArm.material = armM;
    const hazard = canvasTexture(s, 'hz', 256, 32, (g, w, h) => { for (let i = -2; i < 20; i++) { g.fillStyle = i % 2 ? '#e8b23a' : '#111'; g.beginPath(); g.moveTo(i * 16, h); g.lineTo(i * 16 + 16, h); g.lineTo(i * 16 + 32, 0); g.lineTo(i * 16 + 16, 0); g.fill(); } });
    const hm = new StandardMaterial('hzM', s); hm.diffuseTexture = hazard; hm.specularColor.set(0.1, 0.1, 0.1);
    const hzStrip = MeshBuilder.CreateBox('hzs', { width: 6, height: 0.02, depth: 0.25 }, s); hzStrip.position.set(0, 0.01, -2.4); hzStrip.material = hm;
    for (const m of [craneBase, craneArm, hzStrip]) envMeshes.push(m);
    if (quality !== 'low') { const gl = new GlowLayer('gg', s, { mainTextureRatio: 0.35 }); gl.intensity = 0.6; this.sg = new ShadowGenerator(1024, key); this.sg.usePoissonSampling = true; this.sg.darkness = 0.3; key.autoUpdateExtends = true; }
    try {
      const probe = new ReflectionProbe('gp', 64, s, true); probe.position = new Vector3(0, 1.5, 0);
      for (const m of envMeshes) probe.renderList!.push(m);
      probe.refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE; probe.cubeTexture.onAfterRenderObservable.addOnce(() => { s.environmentTexture = probe.cubeTexture; }); s.environmentIntensity = 1.2;
    } catch { /* optional */ }
    s.onBeforeRenderObservable.add(() => this.update());
    // interaction
    canvas.addEventListener('pointerdown', e => {
      if (!this.interactive || this.engine.scenes[this.engine.scenes.length - 1] !== this.scene && !this.isActive()) return;
      this.pinch.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pinch.size === 1) this.drag = { id: e.pointerId, x: e.clientX };
      if (this.pinch.size === 2) { const [a, b] = [...this.pinch.values()]; this.pinchD = Math.hypot(a.x - b.x, a.y - b.y); this.drag = null; }
    });
    canvas.addEventListener('pointermove', e => {
      if (!this.isActive()) return;
      if (this.pinch.has(e.pointerId)) this.pinch.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pinch.size === 2) { const [a, b] = [...this.pinch.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); this.targetRadius = Math.max(3.2, Math.min(9, this.targetRadius * this.pinchD / Math.max(1, d))); this.pinchD = d; return; }
      if (this.drag && this.drag.id === e.pointerId) { const dx = e.clientX - this.drag.x; this.drag.x = e.clientX; this.yawVel = -dx * 0.012; this.yaw += -dx * 0.012; this.spinIdle = false; }
    });
    const up = (e: PointerEvent) => { this.pinch.delete(e.pointerId); if (this.drag?.id === e.pointerId) this.drag = null; };
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('wheel', e => { if (!this.isActive()) return; this.targetRadius = Math.max(3.2, Math.min(9, this.targetRadius * (1 + e.deltaY * 0.001))); }, { passive: true });
  }
  active = true;
  private isActive() { return this.active && this.interactive; }

  setSpec(spec: RobotSpec, force = false) {
    const key = JSON.stringify(spec);
    if (!force && key === this.lastSpec && this.model) return;
    this.lastSpec = key;
    if (this.model) { this.model.dispose(); }
    this.model = new RobotModel(this.scene, spec);
    this.model.root.position.y = 0.16;
    this.anim = new Animator(this.model);
    if (this.sg) for (const m of this.model.meshes) this.sg.addShadowCaster(m, false);
  }

  /** Frame the robot for the current menu layout. */
  frame(offsetX: number, offsetY: number, radius: number) { this.offsetX = offsetX; this.offsetY = offsetY; this.targetRadius = radius; this.spinIdle = true; }

  private update() {
    const dt = Math.min(0.05, this.engine.getDeltaTime() / 1000); this.t += dt;
    if (!this.drag) { this.yaw += this.yawVel; this.yawVel *= Math.exp(-4 * dt); if (this.spinIdle && Math.abs(this.yawVel) < 0.001) this.yaw += dt * 0.25; }
    this.turntable.rotation.y = this.yaw;
    if (this.model && this.anim) {
      this.model.root.rotation.y = this.yaw + Math.PI;
      this.anim.update(dt, { state: 'idle', blocking: false, moveFwd: 0, moveSide: 0, speed: 0, t: this.t });
      this.model.update(dt, 0);
    }
    this.cam.radius += (this.targetRadius - this.cam.radius) * Math.min(1, dt * 5);
    const tx = this.offsetX * this.cam.radius * 0.35, ty = 1.35 + this.offsetY * this.cam.radius * 0.3;
    this.cam.target.x += (tx - this.cam.target.x) * Math.min(1, dt * 5);
    this.cam.target.y += (ty - this.cam.target.y) * Math.min(1, dt * 5);
  }
}
