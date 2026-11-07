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

  async start({ scale = 1 } = {}) {
    this.scale = scale;
    const session = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['hit-test', 'local-floor'],
      optionalFeatures: ['dom-overlay', 'anchors', 'light-estimation'],
      domOverlay: { root: this.overlay },
    });
    this.session = session;
    this.renderer.xr.setReferenceSpaceType('local-floor');
    await this.renderer.xr.setSession(session);
    const viewer = await session.requestReferenceSpace('viewer');
    this.hitSource = await session.requestHitTestSource({ space: viewer });
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
    const root = this.world.root;
    root.position.copy(pos);
    root.rotation.set(0, Math.atan2(cam.x - pos.x, cam.z - pos.z), 0);
    root.scale.setScalar(this.scale);
    root.visible = true;
    this.placed = true;
    this.reticle.visible = false;
    this.onPlaced?.();
  }

  replace() {
    this.placed = false;
    this.world.root.visible = false;
  }

  // Called every XR frame.
  update(frame) {
    if (!frame || this.placed || !this.hitSource) return;
    const ref = this.renderer.xr.getReferenceSpace();
    const hits = frame.getHitTestResults(this.hitSource);
    if (hits.length) {
      const pose = hits[0].getPose(ref);
      this.reticle.visible = true;
      this.reticle.matrix.fromArray(pose.transform.matrix);
      // RingGeometry is in the XY plane; the hit pose's Y axis is the floor normal.
      this.reticle.matrix.multiply(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    } else this.reticle.visible = false;
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
