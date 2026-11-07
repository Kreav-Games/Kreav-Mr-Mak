// Procedural low-poly models. Everything is built from primitives so the
// prototype has no asset pipeline yet; replace with glTF models later.

import * as THREE from 'three';
import { CLASSES, ENEMIES, PICKUPS, rarityById } from '../shared/data.js';

const mats = new Map();
export function mat(color, opts = {}) {
  const key = `${color}|${JSON.stringify(opts)}`;
  if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05, flatShading: true, ...opts }));
  return mats.get(key);
}
const glow = (color, intensity = 1.5) => mat(color, { emissive: color, emissiveIntensity: intensity, roughness: 0.4 });

function mesh(geo, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

const SKIN = '#e9c3a0';
const BASE_CLOTH = { warrior: '#6b4f3a', mage: '#4a3d7a', ranger: '#4f5d3a', cleric: '#d8d2c0' };
// Armour tint per rarity: gear upgrades are visible on the character.
const ARMOR_TINT = {
  poor: '#7d7d7d', common: '#b9b9b9', uncommon: '#3fae2a', rare: '#2f79d6', epic: '#9b3ae6', legendary: '#ff8a1a',
};

// A humanoid of about 1.7 m whose pieces are tinted by the equipped item's
// rarity in each slot. `look` maps slot -> rarity id or null.
export function makeHumanoid(cls, look = {}) {
  const c = CLASSES[cls];
  const g = new THREE.Group();
  const cloth = BASE_CLOTH[cls];
  const tint = (slot, fallback) => (look[slot] ? ARMOR_TINT[look[slot]] : fallback);
  const metallic = c.armor === 'plate' || c.armor === 'mail';
  const armorMat = (slot, fallback) => mat(tint(slot, fallback), metallic && look[slot] ? { metalness: 0.6, roughness: 0.35 } : {});
  const legendaryGlow = (slot) => look[slot] === 'legendary' || look[slot] === 'epic';

  const hips = new THREE.Group(); hips.position.y = 0.85; g.add(hips);
  const legGeo = new THREE.BoxGeometry(0.16, 0.8, 0.18);
  const bootGeo = new THREE.BoxGeometry(0.18, 0.16, 0.26);
  const legs = [-0.11, 0.11].map((x) => {
    const pivot = new THREE.Group(); pivot.position.set(x, 0, 0);
    pivot.add(mesh(legGeo, armorMat('legs', cloth), 0, -0.4, 0));
    pivot.add(mesh(bootGeo, armorMat('feet', '#3b2b20'), 0, -0.78, 0.04));
    hips.add(pivot);
    return pivot;
  });
  const torso = mesh(new THREE.BoxGeometry(0.46, 0.6, 0.26), armorMat('chest', cloth), 0, 0.32, 0);
  hips.add(torso);
  if (c.armor === 'cloth') hips.add(mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.4, 7), armorMat('chest', cloth), 0, -0.1, 0)); // robe skirt
  const belt = mesh(new THREE.BoxGeometry(0.48, 0.07, 0.28), mat(c.color), 0, 0.04, 0); hips.add(belt);
  const head = mesh(new THREE.IcosahedronGeometry(0.15, 1), mat(SKIN), 0, 0.8, 0); hips.add(head);
  if (look.head) {
    const helm = mesh(new THREE.SphereGeometry(0.17, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.55), armorMat('head'), 0, 0.82, 0);
    hips.add(helm);
    if (cls === 'warrior') hips.add(mesh(new THREE.ConeGeometry(0.04, 0.16, 5), armorMat('head'), 0, 1.02, 0));
  } else if (c.armor === 'cloth') {
    hips.add(mesh(new THREE.ConeGeometry(0.17, 0.3, 7), mat(cloth), 0, 1.0, -0.02));
  }
  // eyes so facing reads at a glance
  for (const x of [-0.05, 0.05]) hips.add(mesh(new THREE.BoxGeometry(0.03, 0.03, 0.02), mat('#111'), x, 0.82, 0.14));
  const shoulderGeo = new THREE.SphereGeometry(look.shoulders ? 0.12 : 0.08, 7, 5);
  const arms = [-1, 1].map((side) => {
    const pivot = new THREE.Group(); pivot.position.set(side * 0.3, 0.56, 0);
    pivot.add(mesh(shoulderGeo, armorMat('shoulders', cloth), 0, 0, 0));
    pivot.add(mesh(new THREE.BoxGeometry(0.12, 0.5, 0.12), mat(cloth), 0, -0.27, 0));
    pivot.add(mesh(new THREE.BoxGeometry(0.13, 0.12, 0.13), armorMat('hands', SKIN), 0, -0.55, 0));
    hips.add(pivot);
    return pivot;
  });
  // Weapon in the right hand.
  const weapon = new THREE.Group();
  weapon.position.set(0, -0.58, 0.05);
  const wTint = look.weapon ? ARMOR_TINT[look.weapon] : '#9a9a9a';
  const wGlow = legendaryGlow('weapon');
  if (cls === 'warrior') {
    weapon.add(mesh(new THREE.BoxGeometry(0.05, 0.75, 0.02), wGlow ? glow(wTint, 0.8) : mat(wTint, { metalness: 0.7, roughness: 0.3 }), 0, 0, 0.38).rotateX(Math.PI / 2));
    weapon.add(mesh(new THREE.BoxGeometry(0.2, 0.04, 0.05), mat('#5a4630'), 0, 0, 0.02));
    const shield = mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.04, 8), armorMat('chest', '#7a5a3a'), 0, -0.45, 0.12);
    shield.rotation.x = Math.PI / 2;
    arms[0].add(shield);
  } else if (cls === 'mage') {
    weapon.add(mesh(new THREE.CylinderGeometry(0.025, 0.03, 1.3, 6), mat('#5b3a22'), 0, 0.3, 0));
    weapon.add(mesh(new THREE.OctahedronGeometry(0.08), glow(look.weapon ? wTint : '#69ccf0'), 0, 0.98, 0));
  } else if (cls === 'ranger') {
    const bow = mesh(new THREE.TorusGeometry(0.42, 0.02, 4, 12, Math.PI), wGlow ? glow(wTint, 0.8) : mat(look.weapon ? wTint : '#6d4a2a'), 0, 0, 0.05);
    bow.rotation.z = Math.PI / 2; bow.rotation.y = Math.PI / 2;
    weapon.add(bow);
    hips.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.45, 6), mat('#5a3d22'), 0.12, 0.4, -0.18)); // quiver
  } else {
    weapon.add(mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.55, 6), mat('#6d5a3a'), 0, 0.15, 0));
    weapon.add(mesh(new THREE.DodecahedronGeometry(0.09), wGlow ? glow(wTint, 0.8) : mat(look.weapon ? wTint : '#d9c27a', { metalness: 0.6 }), 0, 0.45, 0));
  }
  arms[1].add(weapon);
  g.userData = { legs, arms, hips, kind: 'humanoid', baseY: 0.85 };
  return g;
}

export function makeEnemy(type) {
  const def = ENEMIES[type];
  const g = new THREE.Group();
  const body = new THREE.Group();
  g.add(body);
  const c = def.color;
  const eye = glow('#ffef5a', 2);
  if (type === 'imp') {
    body.add(mesh(new THREE.IcosahedronGeometry(0.35, 0), mat(c), 0, 0.5, 0));
    body.add(mesh(new THREE.IcosahedronGeometry(0.22, 0), mat(c), 0, 0.95, 0.05));
    for (const s of [-1, 1]) {
      body.add(mesh(new THREE.ConeGeometry(0.06, 0.25, 4), mat('#2a1010'), s * 0.12, 1.18, 0).rotateZ(-s * 0.4));
      body.add(mesh(new THREE.BoxGeometry(0.04, 0.04, 0.02), eye, s * 0.08, 0.98, 0.24));
      const wing = mesh(new THREE.ConeGeometry(0.18, 0.5, 3), mat('#7a1d12'), s * 0.38, 0.75, -0.15);
      wing.rotation.z = s * 1.2; body.add(wing);
      body.add(mesh(new THREE.BoxGeometry(0.09, 0.3, 0.09), mat(c), s * 0.16, 0.15, 0));
    }
  } else if (type === 'wisp') {
    body.add(mesh(new THREE.IcosahedronGeometry(0.3, 1), glow(c, 1.2), 0, 1.1, 0));
    for (let i = 0; i < 4; i++) {
      const bit = mesh(new THREE.TetrahedronGeometry(0.08), glow('#d4c2ff', 1.5), 0, 1.1, 0);
      bit.userData.orbit = i * Math.PI / 2;
      body.add(bit);
    }
    for (const s of [-1, 1]) body.add(mesh(new THREE.BoxGeometry(0.05, 0.05, 0.02), glow('#ffffff', 2), s * 0.09, 1.15, 0.28));
  } else if (type === 'hound') {
    body.add(mesh(new THREE.BoxGeometry(0.4, 0.4, 0.9), mat(c), 0, 0.55, 0));
    body.add(mesh(new THREE.BoxGeometry(0.32, 0.3, 0.38), mat('#33334a'), 0, 0.7, 0.55));
    body.add(mesh(new THREE.BoxGeometry(0.2, 0.14, 0.2), mat('#222235'), 0, 0.62, 0.8));
    for (const s of [-1, 1]) {
      body.add(mesh(new THREE.BoxGeometry(0.05, 0.05, 0.02), glow('#9cf3ff', 2), s * 0.09, 0.76, 0.75));
      body.add(mesh(new THREE.ConeGeometry(0.06, 0.18, 4), mat('#222235'), s * 0.1, 0.92, 0.5));
      for (const z of [-0.32, 0.32]) body.add(mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), mat('#2a2a3c'), s * 0.15, 0.2, z));
    }
    const tail = mesh(new THREE.ConeGeometry(0.06, 0.45, 4), mat(c), 0, 0.7, -0.6); tail.rotation.x = -1; body.add(tail);
  } else if (type === 'warden') {
    const armor = mat(c, { metalness: 0.5, roughness: 0.4 });
    body.add(mesh(new THREE.BoxGeometry(0.8, 0.9, 0.5), armor, 0, 1.25, 0));
    body.add(mesh(new THREE.OctahedronGeometry(0.15), glow('#7ef9ff', 2), 0, 1.3, 0.27));
    body.add(mesh(new THREE.BoxGeometry(0.4, 0.38, 0.4), armor, 0, 1.9, 0));
    for (const s of [-1, 1]) {
      body.add(mesh(new THREE.ConeGeometry(0.08, 0.5, 5), mat('#e8e2cf'), s * 0.25, 2.2, 0).rotateZ(-s * 0.5));
      body.add(mesh(new THREE.BoxGeometry(0.06, 0.05, 0.02), glow('#7ef9ff', 2), s * 0.09, 1.92, 0.21));
      body.add(mesh(new THREE.BoxGeometry(0.28, 0.8, 0.3), armor, s * 0.22, 0.4, 0));
      body.add(mesh(new THREE.BoxGeometry(0.24, 0.9, 0.26), armor, s * 0.56, 1.15, 0));
    }
    body.add(mesh(new THREE.BoxGeometry(0.12, 1.6, 0.12), mat('#2b3b3a'), 0.75, 0.9, 0.35));
    body.add(mesh(new THREE.BoxGeometry(0.5, 0.35, 0.12), mat('#5c6d6b', { metalness: 0.7 }), 0.75, 1.65, 0.35));
  } else if (type === 'colossus') {
    const rock = mat(c, { roughness: 0.95 });
    const crack = glow('#ff6a1a', 2);
    body.add(mesh(new THREE.DodecahedronGeometry(0.75, 0), rock, 0, 1.6, 0));
    body.add(mesh(new THREE.DodecahedronGeometry(0.45, 0), rock, 0, 2.55, 0.1));
    body.add(mesh(new THREE.OctahedronGeometry(0.25), crack, 0, 1.6, 0.62));
    for (const s of [-1, 1]) {
      body.add(mesh(new THREE.DodecahedronGeometry(0.4, 0), rock, s * 0.45, 0.45, 0));
      body.add(mesh(new THREE.DodecahedronGeometry(0.42, 0), rock, s * 1.0, 1.9, 0));
      body.add(mesh(new THREE.DodecahedronGeometry(0.38, 0), rock, s * 1.15, 1.2, 0.2));
      body.add(mesh(new THREE.BoxGeometry(0.1, 0.06, 0.03), crack, s * 0.15, 2.6, 0.5));
    }
  }
  g.userData = { body, kind: 'enemy', type };
  return g;
}

export function makeNpc(kind) {
  const g = new THREE.Group();
  if (kind === 'questgiver') {
    g.add(mesh(new THREE.ConeGeometry(0.32, 1.3, 8), mat('#2e4a6b'), 0, 0.65, 0));
    g.add(mesh(new THREE.IcosahedronGeometry(0.15, 1), mat(SKIN), 0, 1.42, 0));
    g.add(mesh(new THREE.ConeGeometry(0.18, 0.32, 8), mat('#d9c27a'), 0, 1.62, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.6, 5), mat('#6b4a2a'), 0.3, 0.8, 0.1));
    const orb = mesh(new THREE.OctahedronGeometry(0.09), glow('#7ef9ff', 2), 0.3, 1.65, 0.1); g.add(orb);
    g.userData.orb = orb;
  } else {
    g.add(mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.9, 7), mat('#7a5230'), 0, 0.45, 0));
    g.add(mesh(new THREE.IcosahedronGeometry(0.15, 1), mat(SKIN), 0, 1.05, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 8), mat('#3e2a1a'), 0, 1.18, 0));
    g.add(mesh(new THREE.BoxGeometry(0.4, 0.5, 0.25), mat('#5a3a1f'), 0, 0.8, -0.28)); // pack
    g.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 10), glow('#ffd34a', 0.8), 0.3, 0.6, 0.15).rotateX(Math.PI / 2));
  }
  g.userData.kind = 'npc';
  return g;
}

// Marker floating above a quest giver: ! (quest available) or ? (ready to turn in)
export function makeMarker(char, color) {
  const cvs = document.createElement('canvas');
  cvs.width = cvs.height = 128;
  const x = cvs.getContext('2d');
  x.font = 'bold 110px Georgia, serif';
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.lineWidth = 10; x.strokeStyle = '#000';
  x.strokeText(char, 64, 70);
  x.fillStyle = color; x.fillText(char, 64, 70);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cvs), depthTest: false }));
  sp.scale.set(0.35, 0.35, 0.35);
  return sp;
}

export function makePortal() {
  const g = new THREE.Group();
  const ring = mesh(new THREE.TorusGeometry(0.75, 0.07, 6, 24), mat('#3a3550', { roughness: 0.6 }), 0, 0.85, 0);
  g.add(ring);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    g.add(mesh(new THREE.OctahedronGeometry(0.07), glow('#7ef9ff', 2), Math.cos(a) * 0.75, 0.85 + Math.sin(a) * 0.75, 0));
  }
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.7, 32), new THREE.MeshBasicMaterial({ color: '#6b3cff', transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
  disc.position.y = 0.85;
  g.add(disc);
  g.userData = { disc };
  return g;
}

export function makePickup(type) {
  const g = new THREE.Group();
  const c = PICKUPS[type].color;
  const gem = type === 'shard' ? mesh(new THREE.OctahedronGeometry(0.1), glow(c, 1.8), 0, 0.3, 0) : mesh(new THREE.IcosahedronGeometry(0.09, 1), glow(c, 2.2), 0, 0.3, 0);
  if (type === 'shard') gem.scale.y = 1.8;
  g.add(gem);
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6, 1, true), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.25, depthWrite: false }));
  beam.position.y = 0.6;
  g.add(beam);
  g.userData = { gem };
  return g;
}

export function makeLoot(rarity) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.IcosahedronGeometry(0.1, 0), mat('#8a5a2b'), 0, 0.1, 0));
  g.add(mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.06, 6), mat('#5a3a1a'), 0, 0.2, 0));
  const color = rarity ? rarityById[rarity].color : '#ffd34a';
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 6, 1, true), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35, depthWrite: false }));
  beam.position.y = 0.75;
  g.add(beam);
  return g;
}

// A flat ring/disc on the floor (telegraphs, selection rings, nova effects).
export function floorRing(inner, outer, color, opacity = 0.8) {
  const m = new THREE.Mesh(new THREE.RingGeometry(inner, outer, 40), new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.01;
  m.renderOrder = 2;
  return m;
}

export function floorDisc(r, color, opacity = 0.35) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 40), new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.012;
  m.renderOrder = 2;
  return m;
}
