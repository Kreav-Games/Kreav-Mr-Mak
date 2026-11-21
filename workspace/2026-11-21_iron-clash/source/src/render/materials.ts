import { Scene } from '@babylonjs/core/scene';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';

type TexSet = { wear: DynamicTexture; dmg: DynamicTexture; normal: DynamicTexture };
const cache = new WeakMap<Scene, TexSet>();

function seeded(seed: number) { let s = seed; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }

function wearCanvas(size: number, damaged: boolean): HTMLCanvasElement {
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d')!;
  const r = seeded(damaged ? 99 : 7);
  g.fillStyle = '#ededed'; g.fillRect(0, 0, size, size);
  // fine noise
  const img = g.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) { const n = (r() - 0.5) * (damaged ? 46 : 26); img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n; }
  g.putImageData(img, 0, 0);
  // grime gradients
  for (let i = 0; i < (damaged ? 14 : 6); i++) {
    const x = r() * size, y = r() * size, rad = 20 + r() * 70;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, `rgba(60,50,40,${damaged ? 0.35 : 0.12})`); gr.addColorStop(1, 'rgba(60,50,40,0)');
    g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  // scratches
  const nS = damaged ? 140 : 55;
  for (let i = 0; i < nS; i++) {
    const x = r() * size, y = r() * size, a = r() * Math.PI, l = 6 + r() * (damaged ? 60 : 34);
    g.strokeStyle = r() < 0.6 ? `rgba(255,255,255,${0.35 + r() * 0.4})` : `rgba(40,36,32,${0.25 + r() * 0.3})`;
    g.lineWidth = 0.6 + r() * (damaged ? 1.8 : 1);
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  if (damaged) {
    for (let i = 0; i < 10; i++) { // scorch marks
      const x = r() * size, y = r() * size, rad = 10 + r() * 30;
      const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, 'rgba(15,12,10,0.8)'); gr.addColorStop(0.6, 'rgba(40,25,15,0.4)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill();
    }
    for (let i = 0; i < 18; i++) { // rust
      g.fillStyle = `rgba(${120 + r() * 40},${60 + r() * 20},30,${0.25 + r() * 0.3})`;
      g.beginPath(); g.ellipse(r() * size, r() * size, 2 + r() * 8, 2 + r() * 5, r() * 3, 0, 7); g.fill();
    }
  }
  return c;
}

function normalCanvas(size: number): HTMLCanvasElement {
  const r = seeded(31);
  const h = new Float32Array(size * size);
  // panel seams
  const seam = (x0: number, y0: number, x1: number, y1: number) => {
    for (let x = Math.floor(x0); x <= x1; x++) for (const y of [Math.floor(y0), Math.floor(y1)]) if (x >= 0 && x < size && y >= 0 && y < size) h[y * size + x] -= 1;
    for (let y = Math.floor(y0); y <= y1; y++) for (const x of [Math.floor(x0), Math.floor(x1)]) if (x >= 0 && x < size && y >= 0 && y < size) h[y * size + x] -= 1;
  };
  const cell = size / 4;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    if (r() < 0.25) continue;
    const x0 = i * cell + 2, y0 = j * cell + 2;
    seam(x0, y0, x0 + cell - 4 - (r() < 0.3 ? cell / 3 : 0), y0 + cell - 4);
    // rivets
    for (const [dx, dy] of [[5, 5], [cell - 9, 5], [5, cell - 9], [cell - 9, cell - 9]]) {
      const cx = x0 + dx, cy = y0 + dy;
      for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) { const d = Math.hypot(x, y); if (d < 3) { const ix = Math.floor(cx + x), iy = Math.floor(cy + y); if (ix >= 0 && iy >= 0 && ix < size && iy < size) h[iy * size + ix] += (3 - d) * 0.7; } }
    }
  }
  for (let i = 0; i < h.length; i++) h[i] += (r() - 0.5) * 0.12;
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d')!;
  const img = g.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const hl = h[y * size + ((x - 1 + size) % size)], hr = h[y * size + ((x + 1) % size)];
    const hu = h[((y - 1 + size) % size) * size + x], hd = h[((y + 1) % size) * size + x];
    let nx = (hl - hr) * 1.2, ny = (hu - hd) * 1.2, nz = 1; const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
    const i = (y * size + x) * 4;
    img.data[i] = (nx * 0.5 + 0.5) * 255; img.data[i + 1] = (ny * 0.5 + 0.5) * 255; img.data[i + 2] = (nz * 0.5 + 0.5) * 255; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return c;
}

function toTex(scene: Scene, name: string, canvas: HTMLCanvasElement): DynamicTexture {
  const t = new DynamicTexture(name, canvas.width, scene, true);
  const ctx = t.getContext() as unknown as CanvasRenderingContext2D;
  ctx.drawImage(canvas, 0, 0);
  t.update(false);
  t.wrapU = Texture.WRAP_ADDRESSMODE; t.wrapV = Texture.WRAP_ADDRESSMODE;
  return t;
}

export function textures(scene: Scene): TexSet {
  let t = cache.get(scene);
  if (!t) {
    t = { wear: toTex(scene, 'wear', wearCanvas(256, false)), dmg: toTex(scene, 'wearDmg', wearCanvas(256, true)), normal: toTex(scene, 'panelN', normalCanvas(256)) };
    cache.set(scene, t);
  }
  return t;
}

export const hex = (h: string) => Color3.FromHexString(h);

export function metal(scene: Scene, name: string, color: string, metallic: number, roughness: number, opts: { wear?: boolean; bump?: number; uv?: number } = {}): PBRMaterial {
  const m = new PBRMaterial(name, scene);
  m.albedoColor = hex(color).toLinearSpace();
  m.metallic = metallic; m.roughness = roughness;
  const t = textures(scene);
  if (opts.wear !== false) { m.albedoTexture = t.wear; }
  if (opts.bump) { m.bumpTexture = t.normal; m.bumpTexture.level = opts.bump; }
  if (opts.uv) for (const tx of [m.albedoTexture, m.bumpTexture]) if (tx) { (tx as Texture).uScale = opts.uv; (tx as Texture).vScale = opts.uv; }
  m.environmentIntensity = 0.9;
  m.maxSimultaneousLights = 6;
  m.usePhysicalLightFalloff = false;
  return m;
}

export function glow(scene: Scene, name: string, color: string, intensity = 1): StandardMaterial {
  const m = new StandardMaterial(name, scene);
  const c = hex(color);
  m.emissiveColor = c.scale(intensity); m.diffuseColor = Color3.Black(); m.specularColor = Color3.Black();
  m.disableLighting = true;
  return m;
}

export function flat(scene: Scene, name: string, color: string, rough = 0.9): PBRMaterial {
  const m = new PBRMaterial(name, scene);
  m.albedoColor = hex(color).toLinearSpace(); m.metallic = 0; m.roughness = rough; m.maxSimultaneousLights = 6; m.usePhysicalLightFalloff = false;
  return m;
}

/** Canvas helper for screens, ads and decals. */
export function canvasTexture(scene: Scene, name: string, w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, alpha = false): DynamicTexture {
  const t = new DynamicTexture(name, { width: w, height: h }, scene, true);
  t.hasAlpha = alpha;
  const g = t.getContext() as unknown as CanvasRenderingContext2D;
  if (alpha) g.clearRect(0, 0, w, h);
  draw(g, w, h);
  t.update(true);
  return t;
}
