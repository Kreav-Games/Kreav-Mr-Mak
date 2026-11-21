import { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color4, Color3 } from '@babylonjs/core/Maths/math.color';
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import '@babylonjs/core/Particles/particleSystemComponent';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';

type Kind = 'spark' | 'debris' | 'smoke' | 'steam' | 'dust' | 'shock' | 'fire' | 'confetti' | 'trail';

function dotTexture(scene: Scene, name: string, draw: (g: CanvasRenderingContext2D, s: number) => void, size = 64) {
  const t = new DynamicTexture(name, size, scene, false);
  t.hasAlpha = true;
  const g = t.getContext() as unknown as CanvasRenderingContext2D; g.clearRect(0, 0, size, size); draw(g, size); t.update();
  return t;
}

export class FX {
  private pools = new Map<Kind, { list: ParticleSystem[]; i: number }>();
  private rings: { mesh: Mesh; t: number; life: number; size: number }[] = [];
  private ringMat: StandardMaterial;
  scale = 1;
  constructor(private scene: Scene, quality: 'low' | 'medium' | 'high') {
    this.scale = quality === 'low' ? 0.5 : quality === 'medium' ? 0.75 : 1;
    const glowT = dotTexture(scene, 'fxGlow', (g, s) => { const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, s, s); });
    const puffT = dotTexture(scene, 'fxPuff', (g, s) => { for (let i = 0; i < 7; i++) { const x = s / 2 + (Math.random() - 0.5) * s * 0.35, y = s / 2 + (Math.random() - 0.5) * s * 0.35, r = s * (0.22 + Math.random() * 0.15); const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); } }, 128);
    const chunkT = dotTexture(scene, 'fxChunk', (g, s) => { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(s * 0.2, s * 0.3); g.lineTo(s * 0.7, s * 0.15); g.lineTo(s * 0.85, s * 0.6); g.lineTo(s * 0.4, s * 0.85); g.closePath(); g.fill(); });
    const sqT = dotTexture(scene, 'fxSq', (g, s) => { g.fillStyle = '#fff'; g.fillRect(s * 0.25, s * 0.1, s * 0.5, s * 0.8); });
    const make = (kind: Kind, n: number, cap: number, setup: (p: ParticleSystem) => void) => {
      const list: ParticleSystem[] = [];
      for (let i = 0; i < n; i++) {
        const p = new ParticleSystem(kind + i, Math.round(cap * this.scale) + 8, scene);
        p.emitter = new Vector3(0, -100, 0); p.manualEmitCount = 0; p.emitRate = 0;
        setup(p); p.start(); list.push(p);
      }
      this.pools.set(kind, { list, i: 0 });
    };
    make('spark', 4, 160, p => {
      p.particleTexture = glowT; p.blendMode = ParticleSystem.BLENDMODE_ADD;
      p.color1 = new Color4(1, 0.9, 0.5, 1); p.color2 = new Color4(1, 0.6, 0.15, 1); p.colorDead = new Color4(1, 0.3, 0, 0);
      p.minSize = 0.03; p.maxSize = 0.08; p.minLifeTime = 0.15; p.maxLifeTime = 0.5;
      p.minEmitPower = 3; p.maxEmitPower = 9; p.gravity = new Vector3(0, -14, 0);
      p.createSphereEmitter(0.05, 1); p.billboardMode = ParticleSystem.BILLBOARDMODE_STRETCHED; p.updateSpeed = 0.016;
    });
    make('shock', 3, 80, p => {
      p.particleTexture = glowT; p.blendMode = ParticleSystem.BLENDMODE_ADD;
      p.color1 = new Color4(0.5, 0.9, 1, 1); p.color2 = new Color4(0.7, 0.5, 1, 1); p.colorDead = new Color4(0.2, 0.4, 1, 0);
      p.minSize = 0.06; p.maxSize = 0.22; p.minLifeTime = 0.1; p.maxLifeTime = 0.35; p.minEmitPower = 1; p.maxEmitPower = 5;
      p.createSphereEmitter(0.4, 1); p.updateSpeed = 0.016;
    });
    make('debris', 3, 60, p => {
      p.particleTexture = chunkT; p.blendMode = ParticleSystem.BLENDMODE_STANDARD;
      p.color1 = new Color4(0.35, 0.36, 0.4, 1); p.color2 = new Color4(0.18, 0.18, 0.2, 1); p.colorDead = new Color4(0.1, 0.1, 0.1, 0);
      p.minSize = 0.04; p.maxSize = 0.12; p.minLifeTime = 0.6; p.maxLifeTime = 1.2; p.minEmitPower = 2; p.maxEmitPower = 6;
      p.gravity = new Vector3(0, -16, 0); p.minAngularSpeed = -8; p.maxAngularSpeed = 8; p.createSphereEmitter(0.1, 1); p.updateSpeed = 0.016;
    });
    const puff = (p: ParticleSystem, c1: Color4, c2: Color4, life: number, up: number, size: number) => {
      p.particleTexture = puffT; p.blendMode = ParticleSystem.BLENDMODE_STANDARD;
      p.color1 = c1; p.color2 = c2; p.colorDead = new Color4(c2.r, c2.g, c2.b, 0);
      p.minSize = size * 0.5; p.maxSize = size; p.minLifeTime = life * 0.6; p.maxLifeTime = life;
      p.minEmitPower = 0.3; p.maxEmitPower = 1.2; p.gravity = new Vector3(0, up, 0); p.createSphereEmitter(0.3, 1);
      p.addSizeGradient(0, size * 0.5); p.addSizeGradient(1, size * 2.2); p.minAngularSpeed = -1; p.maxAngularSpeed = 1; p.updateSpeed = 0.016;
    };
    make('smoke', 3, 60, p => puff(p, new Color4(0.2, 0.2, 0.22, 0.6), new Color4(0.1, 0.1, 0.1, 0.4), 2.2, 1.2, 0.5));
    make('steam', 3, 70, p => puff(p, new Color4(0.95, 0.97, 1, 0.55), new Color4(0.8, 0.85, 0.9, 0.3), 1.2, 3.5, 0.45));
    make('dust', 2, 60, p => puff(p, new Color4(0.55, 0.47, 0.38, 0.45), new Color4(0.4, 0.35, 0.3, 0.2), 1.4, 0.4, 0.6));
    make('fire', 3, 90, p => {
      p.particleTexture = puffT; p.blendMode = ParticleSystem.BLENDMODE_ADD;
      p.color1 = new Color4(1, 0.7, 0.2, 0.9); p.color2 = new Color4(1, 0.35, 0.05, 0.8); p.colorDead = new Color4(0.3, 0.05, 0, 0);
      p.minSize = 0.2; p.maxSize = 0.5; p.minLifeTime = 0.25; p.maxLifeTime = 0.6; p.minEmitPower = 2; p.maxEmitPower = 5;
      p.gravity = new Vector3(0, 3, 0); p.createConeEmitter(0.3, 0.6); p.updateSpeed = 0.016;
    });
    make('confetti', 2, 260, p => {
      p.particleTexture = sqT; p.blendMode = ParticleSystem.BLENDMODE_STANDARD;
      p.color1 = new Color4(1, 0.8, 0.2, 1); p.color2 = new Color4(0.2, 0.7, 1, 1); p.colorDead = new Color4(1, 0.3, 0.5, 1);
      p.minSize = 0.08; p.maxSize = 0.16; p.minLifeTime = 2.5; p.maxLifeTime = 4.5; p.minEmitPower = 4; p.maxEmitPower = 10;
      p.gravity = new Vector3(0, -3, 0); p.minAngularSpeed = -6; p.maxAngularSpeed = 6; p.createConeEmitter(1, 0.9); p.updateSpeed = 0.016;
    });
    make('trail', 2, 200, p => {
      p.particleTexture = glowT; p.blendMode = ParticleSystem.BLENDMODE_ADD;
      p.color1 = new Color4(1, 0.7, 0.3, 1); p.color2 = new Color4(1, 0.4, 0.1, 1); p.colorDead = new Color4(0.3, 0.1, 0, 0);
      p.minSize = 0.12; p.maxSize = 0.3; p.minLifeTime = 0.15; p.maxLifeTime = 0.35; p.minEmitPower = 0.1; p.maxEmitPower = 0.5; p.createSphereEmitter(0.08, 1); p.updateSpeed = 0.016;
    });
    this.ringMat = new StandardMaterial('ringM', scene); this.ringMat.emissiveColor = new Color3(0.9, 0.8, 0.6); this.ringMat.disableLighting = true; this.ringMat.alpha = 0.7;
  }

  emit(kind: Kind, pos: Vector3, count: number, color?: string) {
    const pool = this.pools.get(kind); if (!pool) return;
    const p = pool.list[pool.i]; pool.i = (pool.i + 1) % pool.list.length;
    (p.emitter as Vector3).copyFrom(pos);
    if (color && (kind === 'spark' || kind === 'shock' || kind === 'trail')) { const c = Color3.FromHexString(color); p.color1 = new Color4(c.r, c.g, c.b, 1); p.color2 = new Color4(c.r * 0.9, c.g * 0.8, c.b * 0.7, 1); }
    else if (kind === 'spark') { p.color1 = new Color4(1, 0.9, 0.5, 1); p.color2 = new Color4(1, 0.6, 0.15, 1); }
    p.manualEmitCount = Math.max(1, Math.round(count * this.scale));
  }

  ring(pos: Vector3, size: number, color = '#FFE0A0') {
    const m = MeshBuilder.CreateTorus('ring', { diameter: 1, thickness: 0.06, tessellation: 40 }, this.scene);
    const mat = this.ringMat.clone('rm'); mat.emissiveColor = Color3.FromHexString(color); m.material = mat; m.position.copyFrom(pos); m.position.y = 0.08; m.isPickable = false;
    this.rings.push({ mesh: m, t: 0, life: 0.5, size });
  }

  update(dt: number) {
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i]; r.t += dt; const k = r.t / r.life;
      if (k >= 1) { r.mesh.material?.dispose(); r.mesh.dispose(); this.rings.splice(i, 1); continue; }
      const s = 0.5 + k * r.size * 2; r.mesh.scaling.set(s, 1 + k * 3, s); (r.mesh.material as StandardMaterial).alpha = 0.8 * (1 - k);
    }
  }
}
