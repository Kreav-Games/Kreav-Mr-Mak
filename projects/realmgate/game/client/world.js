// Turns snapshots into a three.js scene: interpolated entities, telegraphs,
// projectiles, floor effects and the arena. `root` holds everything in arena
// space; AR mode moves and scales `root` onto the real floor.

import * as THREE from 'three';
import { ENEMIES } from '../shared/data.js';
import {
  floorDisc, floorRing, makeEnemy, makeHumanoid, makeLoot, makeMarker, makeNpc, makePickup, makePortal, mat,
} from './models.js';

const PROJECTILE_COLORS = { fire: '#ff7a2a', arcane: '#d18bff', arrow: '#e8d9b0', holy: '#ffe88a' };

export class World {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    scene.add(this.root);
    this.entities = new Map(); // id -> { obj, kind, data, pos }
    this.effects = [];
    this.selfId = null;
    this.hideSelf = false; // in room-scale AR you are the character
    this.raycastTargets = [];

    this.portal = makePortal();
    this.portal.position.set(0, 0, -0.9);
    this.root.add(this.portal);

    this.arenaRing = floorRing(2.95, 3.0, '#7ef9ff', 0.35);
    this.root.add(this.arenaRing);

    this.selection = floorRing(0.42, 0.5, '#ffd34a', 0.9);
    this.selection.visible = false;
    this.root.add(this.selection);

    this.selfRing = floorRing(0.22, 0.28, '#4ad8ff', 0.7);
    this.root.add(this.selfRing);

    // Shadow catcher: in AR it grounds models on the real floor; in preview a
    // visible floor is added by main.js.
    this.shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.3 }));
    this.shadowFloor.rotation.x = -Math.PI / 2;
    this.shadowFloor.receiveShadow = true;
    this.root.add(this.shadowFloor);

    this.sun = new THREE.DirectionalLight('#fff4e0', 2.2);
    this.sun.position.set(2, 6, 3);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    const sc = this.sun.shadow.camera; sc.left = -6; sc.right = 6; sc.top = 6; sc.bottom = -6; sc.near = 0.5; sc.far = 20;
    this.root.add(this.sun);
    this.root.add(this.sun.target);
    scene.add(new THREE.HemisphereLight('#dfe8ff', '#5a4a3a', 1.3));
  }

  setArena(r) {
    if (this.arenaR === r) return;
    this.arenaR = r;
    this.root.remove(this.arenaRing);
    this.arenaRing = floorRing(r - 0.05, r, '#7ef9ff', 0.35);
    this.root.add(this.arenaRing);
  }

  // -------------------------------------------------------------- sync ---

  apply(snap, me) {
    this.setArena(snap.arena);
    const seen = new Set();
    const ensure = (id, kind, data, build) => {
      seen.add(id);
      let ent = this.entities.get(id);
      if (!ent) {
        const obj = build();
        obj.position.set(data.x, 0, data.z);
        obj.traverse((o) => { o.userData.entityId = id; });
        this.root.add(obj);
        ent = { id, obj, kind, data, pos: new THREE.Vector3(data.x, 0, data.z), facing: data.f || 0, speed: 0 };
        this.entities.set(id, ent);
      }
      ent.data = data;
      ent.pos.set(data.x, 0, data.z);
      if (typeof data.f === 'number') ent.facing = data.f;
      return ent;
    };

    for (const p of snap.players) {
      const lookKey = JSON.stringify(p.look);
      const ent = ensure(p.id, 'player', p, () => makeHumanoid(p.cls, p.look));
      if (ent.lookKey && ent.lookKey !== lookKey) this.rebuild(ent, () => makeHumanoid(p.cls, p.look));
      ent.lookKey = lookKey;
    }
    for (const e of snap.enemies) {
      const ent = ensure(e.id, 'enemy', e, () => {
        const g = makeEnemy(e.type);
        g.scale.setScalar(ENEMIES[e.type].scale * 1.2);
        return g;
      });
      this.updateTelegraph(ent, e.wind);
    }
    for (const n of snap.npcs) {
      const ent = ensure(n.id, 'npc', n, () => makeNpc(n.kind));
      if (n.kind === 'questgiver') this.updateQuestMarker(ent, me);
    }
    for (const k of snap.pickups) ensure(k.id, 'pickup', k, () => makePickup(k.type));
    for (const l of snap.loot) ensure(l.id, 'loot', l, () => makeLoot(l.rarity));

    for (const [id, ent] of this.entities) {
      if (seen.has(id)) continue;
      this.root.remove(ent.obj);
      if (ent.tele) this.root.remove(ent.tele.group);
      this.entities.delete(id);
    }
    this.raycastTargets = [...this.entities.values()].filter((e) => e.kind !== 'player' || e.id !== this.selfId).map((e) => e.obj);
  }

  rebuild(ent, build) {
    const pos = ent.obj.position.clone();
    const rot = ent.obj.rotation.y;
    this.root.remove(ent.obj);
    ent.obj = build();
    ent.obj.position.copy(pos);
    ent.obj.rotation.y = rot;
    ent.obj.traverse((o) => { o.userData.entityId = ent.id; });
    this.root.add(ent.obj);
  }

  updateQuestMarker(ent, me) {
    const want = me?.questMarker || null; // '!', '?', or null
    if (ent.markerChar === want) return;
    if (ent.marker) ent.obj.remove(ent.marker);
    ent.marker = null;
    ent.markerChar = want;
    if (want) {
      ent.marker = makeMarker(want, want === '?' ? '#ffd34a' : '#ffd34a');
      ent.marker.position.y = 2.05;
      ent.obj.add(ent.marker);
    }
  }

  updateTelegraph(ent, wind) {
    if (!wind) {
      if (ent.tele) { this.root.remove(ent.tele.group); ent.tele = null; }
      return;
    }
    if (!ent.tele) {
      const group = new THREE.Group();
      const edge = floorRing(wind.r - 0.04, wind.r, '#ff2a2a', 0.95);
      const fill = floorDisc(wind.r, '#ff3b2a', 0.35);
      group.add(edge, fill);
      this.root.add(group);
      ent.tele = { group, fill };
    }
    ent.tele.group.position.set(wind.x, 0, wind.z);
    ent.tele.left = wind.left;
    ent.tele.dur = wind.dur;
  }

  // ------------------------------------------------------------- events ---

  handleEvent(ev) {
    const ent = this.entities.get(ev.id);
    if (ev.type === 'cast') {
      const src = ent;
      const dst = this.entities.get(ev.target);
      if (src) src.swing = 0.35;
      if (src && dst && ev.projectile && dst !== src) this.projectile(src.obj.position, dst.obj.position, PROJECTILE_COLORS[ev.projectile]);
    } else if (ev.type === 'nova') {
      const color = { cleave: '#ffcf8a', frostNova: '#a8e8ff', frostTrap: '#a8e8ff', holyNova: '#ffe88a' }[ev.ability] || '#ffffff';
      this.expandRing(ev.x, ev.z, ev.radius, color, 0.45);
    } else if (ev.type === 'slam') {
      this.expandRing(ev.x, ev.z, ev.r, '#ff5a3a', 0.35);
    } else if (ev.type === 'dmg' && ent) {
      ent.flash = 0.15;
    } else if (ev.type === 'death' && ent) {
      ent.dying = 0;
    } else if (ev.type === 'levelup' && ent) {
      this.column(ent.obj.position, '#ffd34a');
    } else if (ev.type === 'pickup') {
      this.expandRing(ev.x, ev.z, 0.6, '#7ef9ff', 0.4);
    } else if (ev.type === 'spawn') {
      this.expandRing(ev.x, ev.z, 0.8, '#8a5cff', 0.6);
    } else if (ev.type === 'buff' && ent) {
      this.column(ent.obj.position, ev.buff === 'shieldWall' ? '#ffcf8a' : '#d18bff', 0.6);
    }
  }

  projectile(from, to, color) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshBasicMaterial({ color }));
    this.root.add(m);
    const a = from.clone().setY(1.1);
    const b = to.clone().setY(0.8);
    this.effects.push({ t: 0, dur: 0.28, update: (k) => m.position.lerpVectors(a, b, k), done: () => this.root.remove(m) });
  }

  expandRing(x, z, r, color, dur) {
    const m = floorRing(0.85, 1, color, 0.9);
    m.position.set(x, 0.02, z);
    this.root.add(m);
    this.effects.push({
      t: 0, dur,
      update: (k) => { m.scale.setScalar(Math.max(0.01, r * (0.2 + 0.8 * k))); m.material.opacity = 0.9 * (1 - k); },
      done: () => { this.root.remove(m); m.material.dispose(); },
    });
  }

  column(pos, color, dur = 1.2) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.4, 16, 1, true), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide }));
    m.position.set(pos.x, 1.2, pos.z);
    this.root.add(m);
    this.effects.push({ t: 0, dur, update: (k) => { m.material.opacity = 0.5 * (1 - k); m.scale.x = m.scale.z = 1 + k * 0.5; }, done: () => this.root.remove(m) });
  }

  // -------------------------------------------------------------- frame ---

  update(dt, time, selfPos, targetId) {
    for (const ent of this.entities.values()) {
      const o = ent.obj;
      const isSelf = ent.id === this.selfId;
      const goal = isSelf && selfPos ? selfPos : ent.pos;
      const before = o.position.clone();
      o.position.lerp(goal, isSelf ? 1 : Math.min(1, dt * 10));
      const moved = before.distanceTo(o.position) / Math.max(dt, 1e-3);
      ent.speed += (moved - ent.speed) * Math.min(1, dt * 8);
      let dr = ent.facing - o.rotation.y;
      dr = Math.atan2(Math.sin(dr), Math.cos(dr));
      o.rotation.y += dr * Math.min(1, dt * 12);
      o.visible = !(isSelf && this.hideSelf);

      const u = o.userData;
      if (u.kind === 'humanoid') {
        const swingPhase = Math.sin(time * 9) * Math.min(1, ent.speed * 1.2) * 0.6;
        u.legs[0].rotation.x = swingPhase; u.legs[1].rotation.x = -swingPhase;
        u.arms[0].rotation.x = -swingPhase * 0.7;
        if (ent.swing > 0) { ent.swing -= dt; u.arms[1].rotation.x = -1.6 * Math.sin((ent.swing / 0.35) * Math.PI); } else u.arms[1].rotation.x = swingPhase * 0.7;
        u.hips.position.y = u.baseY + Math.abs(swingPhase) * 0.04;
        const dead = ent.data.alive === false;
        o.rotation.x = dead ? -Math.PI / 2 : 0;
        o.position.y = dead ? 0.15 : 0;
      } else if (u.kind === 'enemy') {
        const bob = u.type === 'wisp' ? Math.sin(time * 3 + ent.id.length) * 0.08 : Math.abs(Math.sin(time * 8)) * Math.min(1, ent.speed) * 0.06;
        u.body.position.y = bob;
        if (u.type === 'wisp') u.body.children.forEach((c) => { if (c.userData.orbit !== undefined) { const a = c.userData.orbit + time * 2.5; c.position.set(Math.cos(a) * 0.45, 1.1 + Math.sin(a * 2) * 0.1, Math.sin(a) * 0.45); } });
        if (ent.tele) {
          // body leans back during the wind-up, then the disc fills
          ent.tele.left -= dt;
          const k = 1 - Math.max(0, ent.tele.left) / ent.tele.dur;
          ent.tele.fill.scale.setScalar(Math.max(0.01, k));
          u.body.rotation.x = -0.25 * k;
        } else u.body.rotation.x = 0;
        if (ent.data.alive === false && ent.dying === undefined) ent.dying = 0;
        if (ent.dying !== undefined) {
          ent.dying += dt;
          o.position.y = -ent.dying * 0.5;
          o.rotation.z = Math.min(1.4, ent.dying * 2);
        }
        if (ent.data.buffs?.includes('root') || ent.data.buffs?.includes('slow')) u.body.rotation.z = Math.sin(time * 30) * 0.02;
      } else if (ent.kind === 'pickup') {
        o.userData.gem.rotation.y = time * 2;
        o.userData.gem.position.y = 0.3 + Math.sin(time * 3) * 0.05;
      } else if (ent.kind === 'npc' && o.userData.orb) {
        o.userData.orb.position.y = 1.65 + Math.sin(time * 2) * 0.05;
        if (ent.marker) ent.marker.position.y = 2.05 + Math.sin(time * 2.5) * 0.05;
      }
      if (ent.flash > 0) {
        ent.flash -= dt;
        o.scale.setScalar((ent.baseScale ??= o.scale.x) * (1 + ent.flash));
      } else if (ent.baseScale) o.scale.setScalar(ent.baseScale);
    }
    this.portal.userData.disc.rotation.z = time;
    this.portal.userData.disc.material.opacity = 0.45 + Math.sin(time * 2) * 0.1;

    const tgt = targetId && this.entities.get(targetId);
    this.selection.visible = !!tgt;
    if (tgt) {
      this.selection.position.set(tgt.obj.position.x, 0.015, tgt.obj.position.z);
      const r = tgt.kind === 'enemy' ? ENEMIES[tgt.data.type].scale * 0.9 + 0.2 : 0.5;
      this.selection.scale.setScalar(r / 0.5);
      this.selection.material.color.set(tgt.kind === 'enemy' ? '#ff4a3a' : '#4aff7a');
    }
    if (selfPos) this.selfRing.position.set(selfPos.x, 0.015, selfPos.z);

    this.effects = this.effects.filter((fx) => {
      fx.t += dt;
      const k = Math.min(1, fx.t / fx.dur);
      fx.update(k);
      if (k >= 1) { fx.done(); return false; }
      return true;
    });
  }

  entityAt(raycaster) {
    const hits = raycaster.intersectObjects(this.raycastTargets, true);
    for (const h of hits) {
      const id = h.object.userData.entityId;
      if (id && this.entities.has(id)) return this.entities.get(id);
    }
    // Generous fallback: nearest entity to the ray within 0.6 m (small phone targets).
    let best = null; let bd = 0.6;
    for (const ent of this.entities.values()) {
      if (ent.id === this.selfId || ent.kind === 'pickup') continue;
      const p = ent.obj.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.6 * this.root.scale.x, 0));
      const d = raycaster.ray.distanceToPoint(p) / this.root.scale.x;
      if (d < bd) { bd = d; best = ent; }
    }
    return best;
  }

  addPreviewFloor() {
    const floor = new THREE.Mesh(new THREE.CircleGeometry(12, 48), mat('#8a6a4a', { roughness: 0.95 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.position.y = -0.005;
    this.root.add(floor);
    // floorboards so movement reads
    const lines = new THREE.Group();
    for (let i = -12; i <= 12; i += 0.6) {
      const l = new THREE.Mesh(new THREE.PlaneGeometry(0.015, 24), new THREE.MeshBasicMaterial({ color: '#6e5238' }));
      l.rotation.x = -Math.PI / 2; l.position.set(i, 0.001, 0);
      lines.add(l);
    }
    this.root.add(lines);
    const rug = new THREE.Mesh(new THREE.CircleGeometry(2.2, 40), mat('#7a2e3a', { roughness: 1 }));
    rug.rotation.x = -Math.PI / 2; rug.position.y = 0.003; rug.receiveShadow = true;
    this.root.add(rug);
    this.shadowFloor.visible = false;
  }
}
