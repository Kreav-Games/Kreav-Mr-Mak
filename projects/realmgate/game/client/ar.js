// WebXR immersive-ar: hit-test reticle, tap-to-place arena, and the player's
// position read from the phone's pose. Works in Chrome on ARCore Android phones.

import * as THREE from 'three';
import { floorRing } from './models.js';

export async function arSupported() {
  try { return !!(navigator.xr && await navigator.xr.isSessionSupported('immersive-ar')); } catch { return false; }
}

export class ARController {
  constructor(renderer, scene, world, overlay) {
    this.renderer = renderer;
    this.scene = scene;
    this.world = world;
    this.overlay = overlay;
    this.session = null;
    this.placed = false;
    this.reticle = floorRing(0.25, 0.32, '#7ef9ff', 0.9);
    this.reticle.matrixAutoUpdate = false;
    this.reticle.visible = false;
    this.reticleInner = floorRing(0, 0.06, '#7ef9ff', 0.9);
    this.reticleInner.rotation.x = 0;
    this.reticle.add(this.reticleInner);
    scene.add(this.reticle);
    this.hitSource = null;
    this.onPlaced = null;
    this.onSelect = null; // (raycaster) => void after placement
  }

  // placement 'auto': one tap opens the arena facing you.
  // placement 'twoTap': tap the rift spot, then the spot it faces. Tapping the
  // same two real spots next time lines a saved scan up with the room again.
  async start({ scale = 1, placement = 'auto', keepReticle = false, scanning = false } = {}) {
    this.scale = scale;
    this.placement = placement;
    this.keepReticle = keepReticle;
    this.firstTap = null;
    const session = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['hit-test', 'local-floor'],
      // plane-detection lets the scanner fill whole floor areas ARCore has found
      optionalFeatures: ['dom-overlay', 'anchors', 'light-estimation', ...(scanning ? ['plane-detection'] : [])],
      domOverlay: { root: this.overlay },
    });
    this.session = session;
    this.renderer.xr.setReferenceSpaceType('local-floor');
    await this.renderer.xr.setSession(session);
    const viewer = await session.requestReferenceSpace('viewer');
    // Feature points (the rug's pattern) as well as planes: many more floor
    // readings when ARCore has not recognised the floor as a plane yet.
    const source = async (opts) => {
      try { return await session.requestHitTestSource({ ...opts, entityTypes: ['plane', 'point'] }); }
      catch { return session.requestHitTestSource(opts); }
    };
    this.hitSource = await source({ space: viewer });
    // While scanning, a fan of extra rays measures a wide strip of floor at
    // once instead of only the spot under the screen centre.
    this.scanSources = [];
    this.scanHits = [];
    this.floorYs = [];
    if ((scanning || placement === 'twoTap') && typeof XRRay !== 'undefined') {
      for (const dx of [-0.45, -0.22, 0, 0.22, 0.45]) {
        for (const dy of [-0.15, -0.4, -0.7]) {
          try {
            const ray = new XRRay({ x: 0, y: 0, z: 0, w: 1 }, { x: dx, y: dy, z: -1, w: 0 });
            this.scanSources.push(await source({ space: viewer, offsetRay: ray }));
          } catch { /* offset rays unsupported: centre ray only */ }
        }
      }
    }
    this.world.root.visible = false;

    const controller = this.renderer.xr.getController(0);
    controller.addEventListener('select', () => this.select(controller));
    this.scene.add(controller);
    this.controller = controller;
    session.addEventListener('end', () => { this.session = null; this.onEnd?.(); });
    return session;
  }

  select(controller) {
    if (!this.placed) {
      if (!this.reticle.visible) return;
      if (!this.onFloor) { this.onNotFloor?.(); return; }
      if (this.placement === 'twoTap') {
        const p = new THREE.Vector3().setFromMatrixPosition(this.reticle.matrix);
        if (!this.firstTap) {
          this.firstTap = p;
          this.firstMarker = floorRing(0.08, 0.14, '#ffd34a', 1);
          this.firstMarker.position.copy(p).setY(p.y + 0.01);
          this.scene.add(this.firstMarker);
          this.onFirstTap?.();
          return;
        }
        if (p.distanceTo(this.firstTap) < 0.3) return; // too close to tell a direction
        this.placeAt(this.firstTap, Math.atan2(p.x - this.firstTap.x, p.z - this.firstTap.z));
        this.scene.remove(this.firstMarker);
        return;
      }
      this.place();
      return;
    }
    const rc = new THREE.Raycaster();
    const m = new THREE.Matrix4().extractRotation(controller.matrixWorld);
    rc.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    rc.ray.direction.set(0, 0, -1).applyMatrix4(m);
    this.onSelect?.(rc);
  }

  // Put the arena origin (the Keeper and the portal) on the reticle, turned so
  // the Keeper faces the player.
  place() {
    const pos = new THREE.Vector3().setFromMatrixPosition(this.reticle.matrix);
    const cam = this.renderer.xr.getCamera().getWorldPosition(new THREE.Vector3());
    this.placeAt(pos, Math.atan2(cam.x - pos.x, cam.z - pos.z));
  }

  placeAt(pos, yaw) {
    const root = this.world.root;
    root.position.copy(pos);
    root.position.y += this.floorOffset;
    root.rotation.set(0, yaw, 0);
    this.floorSamples = [];
    this._floorOffset = undefined;
    root.scale.setScalar(this.scale);
    root.visible = true;
    this.placed = true;
    // Pin the world to the room with a WebXR anchor (created on the next XR
    // frame). ARCore keeps an anchor fixed to the real spot as it refines its
    // map, so the rift and characters stay put while you move the phone.
    this.anchor?.delete?.();
    this.anchor = null;
    this.pendingAnchor = pos.clone();
    this.reticle.visible = this.keepReticle && this.reticle.visible;
    this.onPlaced?.();
  }

  // The reticle's floor hit in arena space, or null (used to paint while scanning).
  // The centre ray's floor hit in arena space (y = 0 on the game floor), or
  // null when it isn't on the floor. Used to paint while scanning.
  reticleInArena() {
    if (!this.reticle.visible || !this.placed || !this.onFloor) return null;
    const p = new THREE.Vector3().setFromMatrixPosition(this.reticle.matrix);
    return this.world.root.worldToLocal(p);
  }

  // Is a world-space hit on the floor (not a sofa seat or table top)?
  isFloorHit(v, tolerance = 0.12) { return Math.abs(v.y - this.measuredFloor()) < tolerance; }

  replace() {
    this.anchor?.delete?.();
    this.anchor = null;
    this.placed = false;
    this.firstTap = null;
    this.world.root.visible = false;
  }

  // Called every XR frame.
  update(frame) {
    if (!frame || !this.hitSource) return;
    const ref = this.renderer.xr.getReferenceSpace();

    // Tracking: with no real position (only the phone's rotation), anything we
    // draw would stick to the screen. Hide the world and tell the player.
    const viewer = frame.getViewerPose(ref);
    const tracking = !!viewer && !viewer.emulatedPosition;
    if (tracking !== this.tracking) {
      this.tracking = tracking;
      this.onTracking?.(tracking);
    }
    this.world.root.visible = this.placed && tracking;

    if (this.pendingAnchor && frame.createAnchor && tracking) {
      const p = this.pendingAnchor;
      this.pendingAnchor = null;
      frame.createAnchor(new XRRigidTransform({ x: p.x, y: p.y, z: p.z, w: 1 }), ref)
        .then((a) => { this.anchor = a; })
        .catch(() => { /* anchors unsupported: the world stays where it was placed */ });
    }
    if (this.anchor && frame.trackedAnchors?.has(this.anchor)) {
      const pose = frame.getPose(this.anchor.anchorSpace, ref);
      if (pose) {
        const t = pose.transform.position;
        this.world.root.position.set(t.x, t.y + this.floorOffset, t.z);
      }
    }
    // Every ray's lowest hit feeds the floor estimate: the floor is the lowest
    // large flat surface the phone sees, never a table or TV-stand top.
    const lowest = (src) => {
      let best = null;
      for (const h of frame.getHitTestResults(src)) {
        const t = h.getPose(ref)?.transform.position;
        if (t && (!best || t.y < best.y)) best = t;
      }
      return best;
    };
    this.scanHits.length = 0;
    for (const src of this.scanSources) {
      const t = lowest(src);
      if (!t) continue;
      this.noteFloorY(t.y);
      this.scanHits.push(new THREE.Vector3(t.x, t.y, t.z));
      if (this.placed) this.sampleFloor(t.y);
    }
    const t = lowest(this.hitSource);
    if (t) {
      this.noteFloorY(t.y);
      const floor = this.floorEstimate();
      this.onFloor = floor === null || Math.abs(t.y - floor) < 0.12;
      this.reticle.visible = true;
      // Keep the ring level with gravity; only the hit's position is used.
      const ry = this.placed ? this.world.root.position.y : t.y + this.floorOffset;
      this.reticle.matrix.makeRotationX(-Math.PI / 2).setPosition(t.x, ry, t.z);
      this.reticle.material.color.set(this.onFloor ? '#7ef9ff' : '#ff5a4a');
      this.reticleInner.material.color.set(this.onFloor ? '#7ef9ff' : '#ff5a4a');
      if (this.placed && this.onFloor) this.sampleFloor(t.y);
    } else this.reticle.visible = false;
    // after placement the ring is only shown while scanning
    if (this.placed && !this.keepReticle) this.reticle.visible = false;
    this.levelFloor();
  }

  noteFloorY(y) {
    this.floorYs.push(y);
    if (this.floorYs.length > 400) this.floorYs.shift();
  }

  // Low percentile of recent hit heights: robust to the odd stray hit below the floor.
  floorEstimate() {
    const ys = this.floorYs;
    if (ys.length < 15) return null;
    const sorted = [...ys].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length * 0.15)];
  }

  // ARCore refines its floor height as you move; the first tap can be several
  // centimetres off. Keep the game floor on the median of recent floor hits
  // near the current level, so it never floats above or sinks below the real
  // floor (which reads as a tilt while you move).
  sampleFloor(y) {
    if (Math.abs(y - this.measuredFloor()) > 0.25) return; // a table top or a different storey
    this.floorSamples ??= [];
    this.floorSamples.push(y);
    if (this.floorSamples.length > 240) this.floorSamples.shift();
  }

  levelFloor() {
    const s = this.floorSamples;
    if (!this.placed || !s || s.length < 20) return;
    const now = performance.now();
    if (now - (this.leveledAt || 0) < 300) return;
    this.leveledAt = now;
    // The world's height now comes from its anchor; moving it here made it
    // slide. The measured floor is still used to tell floor hits from furniture.
  }

  // The floor height the phone has measured (median of recent floor hits),
  // before the player's own correction.
  measuredFloor() {
    const s = this.floorSamples;
    if (s && s.length >= 20) return [...s].sort((a, b) => a - b)[s.length >> 1];
    return this.world.root.position.y - this.floorOffset;
  }

  // Player correction when the phone's floor reading is off ("Floor ▼").
  // Remembered per device: a phone's error tends to repeat.
  get floorOffset() {
    if (this._floorOffset === undefined) {
      try { this._floorOffset = Number(localStorage.getItem('realmgate.floorOffset')) || 0; } catch { this._floorOffset = 0; }
    }
    return this._floorOffset;
  }

  nudgeFloor(dy) {
    this._floorOffset = Math.max(-1, Math.min(1, this.floorOffset + dy));
    try { localStorage.setItem('realmgate.floorOffset', String(this._floorOffset)); } catch { /* optional */ }
    if (this.placed && !this.anchor) this.world.root.position.y += dy;
    return this._floorOffset;
  }

  // Floor polygons from WebXR plane detection, in world space (empty if unsupported).
  floorPolygons(frame) {
    const out = [];
    const planes = frame?.detectedPlanes;
    if (!planes) return out;
    const ref = this.renderer.xr.getReferenceSpace();
    for (const plane of planes) {
      if (plane.orientation !== 'horizontal' || !plane.polygon?.length) continue;
      const pose = frame.getPose(plane.planeSpace, ref);
      if (!pose) continue;
      const m = new THREE.Matrix4().fromArray(pose.transform.matrix);
      out.push(plane.polygon.map((p) => new THREE.Vector3(p.x, p.y, p.z).applyMatrix4(m)));
    }
    return out;
  }

  // The player's position in arena metres: the phone projected onto the floor.
  playerPosition() {
    const cam = this.renderer.xr.getCamera();
    const world = cam.getWorldPosition(new THREE.Vector3());
    const local = this.world.root.worldToLocal(world.clone());
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(cam.getWorldQuaternion(new THREE.Quaternion()));
    const rootQ = this.world.root.getWorldQuaternion(new THREE.Quaternion()).invert();
    dir.applyQuaternion(rootQ);
    return { x: local.x, z: local.z, facing: Math.atan2(dir.x, dir.z) };
  }

  end() { this.session?.end(); }
}
