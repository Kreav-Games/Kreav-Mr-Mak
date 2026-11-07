// Realmgate client: lobby, game loop, input and the glue between the
// transport (solo or server), the three.js world, AR and the HUD.

import * as THREE from 'three';
import { ABILITIES, CLASSES, ENEMIES, rarityById } from '../shared/data.js';
import { LocalTransport, WsTransport, serverUrl } from './net.js';
import { World } from './world.js';
import { Hud } from './hud.js';
import { ARController, arSupported } from './ar.js';
import { sfx } from './sfx.js';
import { Scanner, loadHome } from './scan.js';
import { HERO_SCALE, scaleWorld } from '../shared/floorscan.js';
import { WorldMap } from '../shared/world.js';

const $ = (s) => document.querySelector(s);
const SAVE_KEY = (cls) => `realmgate.char.${cls}`;
const loadSave = (cls) => { try { return JSON.parse(localStorage.getItem(SAVE_KEY(cls))); } catch { return null; } };
const TABLE_SCALE = 0.15;

// ---------------------------------------------------------------- lobby ---

const lobby = { cls: localStorage.getItem('realmgate.cls') || 'warrior', party: 'solo', arena: 3, useHome: !!loadHome() };

function renderClasses() {
  $('#classes').innerHTML = Object.values(CLASSES).map((c) => {
    const save = loadSave(c.id);
    return `<button class="cls ${lobby.cls === c.id ? 'on' : ''}" data-cls="${c.id}">
      <b style="color:${c.color}">${c.name}</b><span class="role">${c.role} · ${c.armor}</span>
      <small>${c.blurb}</small>${save ? `<span class="saved">Saved: level ${save.level}</span>` : ''}</button>`;
  }).join('');
}

function initLobby() {
  $('#name').value = localStorage.getItem('realmgate.name') || '';
  renderClasses();
  $('#classes').onclick = (e) => {
    const b = e.target.closest('[data-cls]');
    if (!b) return;
    lobby.cls = b.dataset.cls;
    renderClasses();
  };
  const tabs = (sel, fn) => {
    $(sel).onclick = (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      for (const x of $(sel).children) x.classList.toggle('on', x === b);
      fn(b);
    };
  };
  tabs('#partyMode', (b) => { lobby.party = b.dataset.mode; $('#roomCode').classList.toggle('hidden', lobby.party !== 'join'); });
  tabs('#arenaSize', (b) => { lobby.arena = Number(b.dataset.r); });
  // Static hosting (GitHub Pages) has no game server: solo only, unless ?server= is given.
  const params = new URLSearchParams(location.search);
  if (location.hostname.endsWith('github.io') && !params.get('server')) {
    for (const b of $('#partyMode').querySelectorAll('[data-mode="create"], [data-mode="join"]')) b.disabled = true;
    $('#partyMode').insertAdjacentHTML('afterend', '<p class="note">Multiplayer needs the game server, which isn\'t online yet. Solo works fully here.</p>');
  }
  if (params.get('room')) {
    lobby.party = 'join';
    $('#roomCode').value = params.get('room').toUpperCase();
    $('#roomCode').classList.remove('hidden');
    for (const x of $('#partyMode').children) x.classList.toggle('on', x.dataset.mode === 'join');
  }
  arSupported().then((ok) => {
    if (!ok) {
      $('#startAR').disabled = true;
      $('#startTable').disabled = true;
      $('#arNote').textContent = 'AR needs Chrome on an ARCore Android phone over HTTPS. iPhone Safari does not offer WebXR AR yet; use Preview here.';
    } else $('#arNote').textContent = 'AR ready. Clear some floor space and keep your surroundings in view while you play.';
  });
  renderHome();
  $('#scanHome').onclick = () => new Scanner().start().catch((e) => { $('#lobbyError').textContent = e.message; });
  $('#useHome').onchange = (e) => { lobby.useHome = e.target.checked; renderHome(); };
  $('#startAR').onclick = () => start('ar');
  $('#startTable').onclick = () => start('table');
  $('#startPreview').onclick = () => start('preview');
}

function renderHome() {
  const home = loadHome();
  const zones = home?.zones || [];
  $('#homeInfo').textContent = home
    ? `Saved: ${zones.map((z) => z.name).join(', ')} (${home.links.length} doorway${home.links.length === 1 ? '' : 's'}).`
    : 'No home scanned yet. Scanning takes a few minutes of slow walking; after that you play seated.';
  $('#useHomeRow').classList.toggle('hidden', !home);
  $('#useHome').checked = lobby.useHome && !!home;
  $('#arenaRow').classList.toggle('hidden', lobby.useHome && !!home);
  $('#startAR').textContent = lobby.useHome && home ? 'Play seated in my home (AR)' : 'Play in AR (walk around)';
}

async function start(mode) {
  const saved = lobby.useHome && lobby.party !== 'join' ? loadHome() : null;
  // The scan is in real metres; the game plays it in hero-sized metres.
  const homeWorld = saved ? scaleWorld(saved, 1 / HERO_SCALE) : null;
  if (mode === 'ar' && homeWorld) mode = 'home';
  const name = $('#name').value.trim() || 'Adventurer';
  localStorage.setItem('realmgate.name', name);
  localStorage.setItem('realmgate.cls', lobby.cls);
  $('#lobbyError').textContent = '';
  const hello = { name, cls: lobby.cls, save: loadSave(lobby.cls), arena: lobby.arena, mode: mode === 'ar' ? 'body' : 'avatar' };
  let transport;
  if (homeWorld && lobby.party === 'create') {
    // Private by default: hosting shares the layout only with players you let in.
    const ok = confirm('Host your home?\n\nPlayers you let in will see the layout of your scanned rooms (shapes only, no camera images). '
      + 'It is not saved on the server, and sharing stops when you stop hosting. You approve each player before they join.');
    if (!ok) return;
    hello.shareConsent = true;
  }
  if (homeWorld) hello.world = homeWorld;
  if (lobby.party === 'solo') transport = new LocalTransport({ arena: lobby.arena, world: homeWorld });
  else {
    transport = new WsTransport({ url: serverUrl() });
    hello.room = lobby.party === 'join' ? $('#roomCode').value.trim().toUpperCase() : '';
    hello.create = lobby.party === 'create';
    if (lobby.party === 'join' && hello.room.length !== 4) { $('#lobbyError').textContent = 'Enter the 4-letter room code.'; return; }
  }
  transport.onWaiting = () => {
    $('#lobbyError').textContent = '';
    $('#arNote').textContent = 'Waiting for the host to let you in… You will see the layout of their home: it is theirs, so please do not record or share it.';
  };
  const game = new Game({ mode, name, cls: lobby.cls, transport });
  try {
    await game.start(hello);
  } catch (err) {
    $('#lobbyError').textContent = err.message || String(err);
    game.dispose();
  }
}

// ----------------------------------------------------------------- game ---

class Game {
  constructor({ mode, name, cls, transport }) {
    this.mode = mode;
    this.name = name;
    this.cls = cls;
    this.transport = transport;
    this.snap = null;
    this.me = null;
    this.self = null;
    this.selfId = null;
    this.targetId = null;
    this.cds = {};
    this.cdsAt = 0;
    this.selfPos = new THREE.Vector3(0, 0, 1.2);
    this.facing = Math.PI;
    this.camYaw = Math.PI;
    this.camDist = 6.5;
    this.camPitch = 0.75;
    this.keys = new Set();
    this.stick = { x: 0, y: 0 };
    this.lastMoveSent = 0;
    this.clock = new THREE.Clock();
  }

  async start(hello) {
    const canvas = $('#view');
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(2, devicePixelRatio));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.05, 100);
    this.world = new World(this.scene);
    addEventListener('resize', this.onResize = () => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
    });

    this.transport.onSnapshot = (s) => this.onSnapshot(s);
    this.transport.onSave = (save) => this.storeSave(save);
    this.transport.onClose = (text) => { this.hud?.banner(text || 'Disconnected from the server'); };
    this.transport.onKnock = (k) => this.hud?.knock(k);
    const welcome = await this.transport.connect(hello);
    this.selfId = welcome.id;
    this.roomCode = welcome.room;
    this.world.selfId = this.selfId;
    // A scanned home (yours, or the host's when you join a room).
    this.worldData = welcome.world || null;
    this.walk = this.worldData ? new WorldMap(this.worldData) : null;

    $('#lobby').classList.add('hidden');
    $('#hud').classList.remove('hidden');
    this.hud = new Hud(this);
    this.bindInput();

    if (this.worldData) this.world.setWorld(this.worldData, { twin: this.mode !== 'home' });
    if (this.mode === 'ar' || this.mode === 'table' || this.mode === 'home') {
      this.ar = new ARController(this.renderer, this.scene, this.world, $('#overlay'));
      this.ar.onSelect = (rc) => this.pick(rc);
      this.ar.onPlaced = () => { $('#placeHint').classList.add('hidden'); sfx('portal'); };
      this.ar.onFirstTap = () => { $('#placeHint').textContent = 'Now tap the spot the rift faces, the same one you chose when scanning.'; };
      this.ar.onEnd = () => this.leave();
      this.ar.onTracking = (ok) => {
        $('#trackLost').classList.toggle('hidden', ok || !this.ar.placed);
      };
      const scale = this.mode === 'table' ? TABLE_SCALE : this.mode === 'home' ? HERO_SCALE : 1;
      await this.ar.start({ scale, placement: this.mode === 'home' ? 'twoTap' : 'auto' });
      this.ar.onNotFloor = () => this.hud.toast('That is the top of furniture. Aim the ring at the floor (blue = floor).', true);
      // Floor ▲/▼: lower the game floor onto the real one if the phone misreads it.
      const nudge = document.createElement('div');
      nudge.className = 'floor-nudge';
      nudge.innerHTML = '<button data-d="0.02">Floor ▲</button><span></span><button data-d="-0.02">Floor ▼</button>';
      const label = nudge.querySelector('span');
      const show = (off) => { label.textContent = `${off >= 0 ? '+' : ''}${Math.round(off * 100)} cm`; };
      show(this.ar.floorOffset);
      nudge.addEventListener('beforexrselect', (e) => e.preventDefault());
      nudge.addEventListener('click', (e) => { const b = e.target.closest('[data-d]'); if (b) show(this.ar.nudgeFloor(Number(b.dataset.d))); });
      $('#hud').appendChild(nudge);
      if (this.mode === 'home') $('#placeHint').textContent = 'Sit somewhere comfy. Tap the rift spot you chose when scanning.';
      $('#placeHint').classList.remove('hidden');
      this.world.hideSelf = this.mode === 'ar';
      if (this.mode === 'ar') this.world.selfRing.visible = true;
    } else {
      this.scene.background = new THREE.Color('#1c1826');
      this.scene.fog = new THREE.Fog('#1c1826', 9, 22);
      if (!this.worldData) this.world.addPreviewFloor();
    }
    $('#joystick').classList.toggle('hidden', this.mode === 'ar');
    if (this.roomCode) this.hud.banner(`Room ${this.roomCode} — share this code`);
    this.renderer.setAnimationLoop((t, frame) => this.frame(frame));
  }

  dispose() {
    this.renderer?.setAnimationLoop(null);
    this.transport?.close();
    removeEventListener('resize', this.onResize);
  }

  leave() {
    if (this.left) return;
    this.left = true;
    this.transport.requestSave();
    setTimeout(() => { this.dispose(); location.href = location.pathname; }, 200);
    this.ar?.end();
  }

  replaceArena() { this.ar?.replace(); $('#placeHint').classList.remove('hidden'); }

  send(msg) { this.transport.send(msg); }

  storeSave(save) {
    if (!save) return;
    localStorage.setItem(SAVE_KEY(save.cls), JSON.stringify(save));
  }

  // ---------------------------------------------------------- snapshots ---

  onSnapshot(s) {
    const firstMe = !this.me && s.me;
    if (s.me) {
      this.me = s.me;
      const ready = Object.values(s.me.quests).some((q) => q.state === 'done');
      this.me.questMarker = ready ? '?' : s.me.available.length ? '!' : null;
    }
    this.snap = s;
    this.self = s.players.find((p) => p.id === this.selfId) || null;
    if (s.cds) { this.cds = s.cds; this.cdsAt = performance.now(); }
    if (this.self) {
      // Accept the server position when it disagrees a lot (respawn, root,
      // arena edge); otherwise trust local movement for responsiveness.
      const server = new THREE.Vector3(this.self.x, 0, this.self.z);
      if (this.mode !== 'ar' && (server.distanceTo(this.selfPos) > 0.75 || !this.self.alive)) this.selfPos.copy(server);
      if (this.self.target !== this.targetId && this.targetId && !this.findEntity(this.targetId)) this.targetId = null;
    }
    this.world.apply(s, this.me);
    for (const ev of s.events) this.onEvent(ev);
    if (s.me) {
      this.hud.tracker(this.me);
      if (this.self) this.storeSave({ v: 1, name: this.name, cls: this.cls, level: this.self.level, xp: s.me.xp, gold: s.me.gold, equipment: s.me.equipment, bag: s.me.bag, quests: s.me.quests });
      if (firstMe && this.me.available.includes('q1')) setTimeout(() => this.hud.toggle('keeper', 'q1'), 600);
    }
  }

  findEntity(id) {
    if (!this.snap) return null;
    return this.snap.enemies.find((e) => e.id === id && e.alive) || this.snap.players.find((p) => p.id === id) || null;
  }

  onEvent(ev) {
    const screen = (id, up = 1.6) => {
      const ent = this.world.entities.get(id);
      if (!ent) return null;
      return this.project(ent.obj.position.clone().setY(up));
    };
    if (ev.type === 'dmg') {
      const p = screen(ev.id, 1.2);
      if (p && (ev.src === this.selfId || this.targetId === ev.id)) this.hud.floatText(ev.amount, p.x, p.y, ev.crit ? 'crit' : '');
      if (ev.src === this.selfId) sfx('hit');
    } else if (ev.type === 'hurt') {
      const p = screen(ev.id, 1.4);
      if (p && ev.id === this.selfId) { this.hud.floatText(`-${ev.amount}`, p.x, p.y, 'hurt'); sfx('hurt'); navigator.vibrate?.(60); }
    } else if (ev.type === 'heal') {
      const p = screen(ev.id, 1.5);
      if (p && (ev.id === this.selfId || ev.src === this.selfId)) this.hud.floatText(`+${ev.amount}`, p.x, p.y, `heal ${ev.crit ? 'crit' : ''}`);
    } else if (ev.type === 'xp') this.hud.toast(`<span style="color:#c06aff">+${ev.amount} XP</span>`);
    else if (ev.type === 'levelup') {
      if (ev.id === this.selfId) { this.hud.banner(`Level ${ev.level}!`); sfx('level'); }
      else this.hud.toast(`${this.nameOf(ev.id)} reached level ${ev.level}`);
    } else if (ev.type === 'quest') { this.hud.toast(`<b style="color:var(--gold)">${ev.text}</b>`); sfx('quest'); }
    else if (ev.type === 'error') this.hud.toast(ev.text, true);
    else if (ev.type === 'looted') {
      if (ev.item) this.hud.toast(`Looted <span style="color:${rarityById[ev.rarity].color}">[${ev.item}]</span>`);
      if (ev.gold) this.hud.toast(`<span style="color:var(--gold)">+${ev.gold} gold</span>`);
      sfx('loot');
    } else if (ev.type === 'banner') { this.hud.banner(ev.text); sfx('quest'); }
    else if (ev.type === 'died' && ev.id === this.selfId) sfx('die');
    else if (ev.type === 'telegraph') {
      // warn when a circle lands on you
      const me = this.self;
      if (me && Math.hypot(me.x - ev.x, me.z - ev.z) <= ev.r) { navigator.vibrate?.([30, 40, 30]); sfx('warn'); }
    } else if (ev.type === 'join' && ev.id !== this.selfId) this.hud.toast(`${ev.name} joined the party`);
    else if (ev.type === 'leave') this.hud.toast(`${ev.name} left`);
    this.world.handleEvent(ev);
  }

  nameOf(id) { return this.snap?.players.find((p) => p.id === id)?.name || 'Someone'; }

  // ------------------------------------------------------------ actions ---

  cooldownLeft(id) {
    const left = (this.cds[id] || 0) - (performance.now() - this.cdsAt) / 1000;
    return Math.max(0, left);
  }

  setTarget(id) {
    this.targetId = id;
    this.send({ t: 'target', id });
  }

  targetNearest(maxRange = Infinity) {
    if (!this.snap) return null;
    const alive = this.snap.enemies.filter((e) => e.alive);
    alive.sort((a, b) => this.distTo(a) - this.distTo(b));
    const inRange = alive.filter((e) => this.distTo(e) <= maxRange);
    const pool = inRange.length ? inRange : alive;
    if (!pool.length) return null;
    // Tab cycling: pick the next one after the current target.
    const idx = pool.findIndex((e) => e.id === this.targetId);
    const next = pool[(idx + 1) % pool.length];
    this.setTarget(next.id);
    return next;
  }

  distTo(e) { return Math.hypot(e.x - this.selfPos.x, e.z - this.selfPos.z); }

  cast(abilityId) {
    const ab = ABILITIES[abilityId];
    if (ab.target === 'enemy') {
      const cur = this.snap?.enemies.find((e) => e.id === this.targetId && e.alive);
      if (!cur) { if (!this.targetNearest(ab.range)) return this.hud.toast('No enemies nearby', true); }
    }
    this.send({ t: 'cast', ability: abilityId, target: this.targetId });
  }

  drinkPotion() {
    const bag = this.me?.bag || [];
    const s = this.self;
    let idx = -1;
    const lowMana = CLASSES[this.cls].resource === 'mana' && s && s.res < s.maxRes * 0.4;
    if (lowMana && s.hp > s.maxHp * 0.6) idx = bag.findIndex((i) => i.vendorId === 'mpPotion');
    if (idx < 0) idx = bag.findIndex((i) => i.vendorId === 'hpPotion');
    if (idx < 0) idx = bag.findIndex((i) => i.kind === 'consumable');
    if (idx < 0) return this.hud.toast('No potions — buy some from Bram', true);
    this.send({ t: 'use', index: idx });
  }

  pick(raycaster) {
    const ent = this.world.entityAt(raycaster);
    if (!ent) return;
    if (ent.kind === 'enemy' && ent.data.alive) this.setTarget(ent.id);
    else if (ent.kind === 'player') this.setTarget(ent.id);
    else if (ent.kind === 'npc') this.hud.toggle(ent.data.kind === 'questgiver' ? 'keeper' : 'vendor', null);
    else if (ent.kind === 'loot') this.send({ t: 'loot', id: ent.id });
    else if (ent.kind === 'pickup') this.hud.toast('Walk over it to pick it up');
  }

  // -------------------------------------------------------------- input ---

  bindInput() {
    addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      const k = e.key.toLowerCase();
      this.keys.add(k);
      const abs = CLASSES[this.cls].abilities;
      if (['1', '2', '3', '4'].includes(k)) this.cast(abs[Number(k) - 1]);
      else if (k === 'tab') { e.preventDefault(); this.targetNearest(); }
      else if (k === 'q') this.drinkPotion();
      else if (k === 'c' || k === 'b') this.hud.toggle('character');
      else if (k === 'l') this.hud.toggle('quests');
      else if (k === 'escape') { this.hud.close(); this.setTarget(null); }
    });
    addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));

    // Virtual stick
    const js = $('#joystick');
    const knob = js.querySelector('.knob');
    let jsId = null;
    const jsMove = (e) => {
      const r = js.getBoundingClientRect();
      let x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      let y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      const l = Math.hypot(x, y);
      if (l > 1) { x /= l; y /= l; }
      this.stick = { x, y };
      knob.style.transform = `translate(${x * 35}px, ${y * 35}px)`;
    };
    js.addEventListener('pointerdown', (e) => { jsId = e.pointerId; js.setPointerCapture(jsId); jsMove(e); e.stopPropagation(); });
    js.addEventListener('pointermove', (e) => { if (e.pointerId === jsId) jsMove(e); });
    const jsEnd = (e) => { if (e.pointerId !== jsId) return; jsId = null; this.stick = { x: 0, y: 0 }; knob.style.transform = ''; };
    js.addEventListener('pointerup', jsEnd);
    js.addEventListener('pointercancel', jsEnd);

    if (this.mode !== 'preview') return; // AR taps arrive as XR select events
    // Preview: drag to orbit the camera, tap to pick, wheel or pinch to zoom.
    const view = $('#hud');
    const pointers = new Map();
    let down = null;
    view.addEventListener('pointerdown', (e) => {
      if (e.target !== view && e.target.id !== 'floaters' && !e.target.closest('#floaters')) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
    });
    view.addEventListener('pointermove', (e) => {
      const p = pointers.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x; const dy = e.clientY - p.y;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const before = Math.hypot(a.x - b.x, a.y - b.y);
        p.x = e.clientX; p.y = e.clientY;
        const [c, d] = [...pointers.values()];
        this.camDist = Math.min(9, Math.max(2, this.camDist * (before / Math.max(1, Math.hypot(c.x - d.x, c.y - d.y)))));
      } else {
        this.camYaw -= dx * 0.008;
        this.camPitch = Math.min(1.3, Math.max(0.15, this.camPitch + dy * 0.005));
        p.x = e.clientX; p.y = e.clientY;
      }
      if (down) down.moved += Math.abs(dx) + Math.abs(dy);
    });
    const up = (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      if (down && down.moved < 10 && performance.now() - down.t < 400) {
        const rc = new THREE.Raycaster();
        rc.setFromCamera(new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), this.camera);
        const ent = this.world.entityAt(rc);
        if (ent) this.pick(rc); else if (this.targetId) this.setTarget(null);
      }
      down = null;
    };
    view.addEventListener('pointerup', up);
    view.addEventListener('pointercancel', (e) => pointers.delete(e.pointerId));
    view.addEventListener('wheel', (e) => { this.camDist = Math.min(9, Math.max(2, this.camDist + e.deltaY * 0.004)); }, { passive: true });
  }

  stickVector() {
    let x = this.stick.x; let y = this.stick.y;
    if (this.keys.has('w') || this.keys.has('arrowup')) y -= 1;
    if (this.keys.has('s') || this.keys.has('arrowdown')) y += 1;
    if (this.keys.has('a') || this.keys.has('arrowleft')) x -= 1;
    if (this.keys.has('d') || this.keys.has('arrowright')) x += 1;
    const l = Math.hypot(x, y);
    if (l > 1) { x /= l; y /= l; }
    return { x, y };
  }

  // -------------------------------------------------------------- frame ---

  frame(xrFrame) {
    const dt = Math.min(0.05, this.clock.getDelta());
    const time = this.clock.elapsedTime;
    if (this.ar) this.ar.update(xrFrame);
    const placed = !this.ar || this.ar.placed;

    if (placed && this.self) this.updateMovement(dt);
    this.world.update(dt, time, this.selfPos, this.targetId);

    if (!this.ar) this.updateCamera();
    const cam = this.ar ? this.renderer.xr.getCamera() : this.camera;
    this.renderer.render(this.scene, this.camera);

    if (this.snap && this.self && placed) {
      this.hud.update(this.snap, this.me, this.self, this.findEntity(this.targetId));
      this.hud.radar(this.snap, this.selfPos, this.facing);
      this.updatePlates(cam);
    }
  }

  updateMovement(dt) {
    let moved = false;
    if (this.mode === 'ar') {
      const p = this.ar.playerPosition();
      this.selfPos.set(p.x, 0, p.z);
      this.facing = p.facing;
      moved = true;
    } else {
      const s = this.stickVector();
      const rooted = this.self.buffs.includes('root') || !this.self.alive;
      const viaPhone = this.mode === 'table' || this.mode === 'home';
      const yaw = viaPhone ? this.ar.playerPosition().facing : this.camYaw;
      if (!rooted && Math.hypot(s.x, s.y) > 0.1) {
        // forward = (sin yaw, cos yaw); right = (-cos yaw, sin yaw)
        const fx = Math.sin(yaw); const fz = Math.cos(yaw);
        const dx = -s.y * fx + s.x * -fz;
        const dz = -s.y * fz + s.x * fx;
        const speed = 1.6;
        const sx = dx * speed * dt; const sz = dz * speed * dt;
        const p = this.selfPos;
        if (this.walk) {
          // slide along scanned walls and furniture, like the server
          const ok = (x, z) => this.walk.walkable(x, z);
          if (ok(p.x + sx, p.z + sz) || !ok(p.x, p.z)) { p.x += sx; p.z += sz; }
          else if (ok(p.x + sx, p.z)) p.x += sx;
          else if (ok(p.x, p.z + sz)) p.z += sz;
        } else {
          p.x += sx; p.z += sz;
          const lim = (this.snap?.arena || 3) + 1.5;
          const r = Math.hypot(p.x, p.z);
          if (r > lim) p.multiplyScalar(lim / r);
        }
        this.facing = Math.atan2(dx, dz);
        moved = true;
      }
      if (this.mode === 'preview' && !moved && this.self) this.facing = this.self.f;
    }
    const now = performance.now();
    if (moved && now - this.lastMoveSent > 66) {
      this.lastMoveSent = now;
      this.send({ t: 'move', x: this.selfPos.x, z: this.selfPos.z, facing: this.facing });
    }
    // Your own model faces where you move or what you attack.
    const ent = this.world.entities.get(this.selfId);
    if (ent) ent.facing = this.mode === 'preview' && !moved ? this.self.f : this.facing;
  }

  updateCamera() {
    const target = this.selfPos.clone().setY(1.0);
    const off = new THREE.Vector3(
      -Math.sin(this.camYaw) * Math.cos(this.camPitch),
      Math.sin(this.camPitch),
      -Math.cos(this.camYaw) * Math.cos(this.camPitch),
    ).multiplyScalar(this.camDist);
    this.camera.position.copy(target).add(off);
    this.camera.lookAt(target);
  }

  project(worldPosInRoot) {
    const cam = this.ar ? this.renderer.xr.getCamera() : this.camera;
    const v = this.world.root.localToWorld(worldPosInRoot.clone());
    const camPos = cam.getWorldPosition(new THREE.Vector3());
    const camDir = cam.getWorldDirection(new THREE.Vector3());
    if (v.clone().sub(camPos).dot(camDir) < 0) return null;
    v.project(cam);
    return { x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight };
  }

  updatePlates() {
    const alive = new Set();
    for (const ent of this.world.entities.values()) {
      const d = ent.data;
      if (ent.id === this.selfId) continue;
      let html = null; let cls = ''; let h = 1.9;
      if (ent.kind === 'enemy') {
        if (!d.alive) continue;
        const def = ENEMIES[d.type];
        h = def.scale * 1.2 * (d.type === 'colossus' ? 2.3 : d.type === 'warden' ? 2.0 : 1.5) + 0.2;
        cls = def.elite || def.boss ? 'elite' : '';
        html = `${d.name} <span style="color:#ffd34a">${d.level}</span><div class="hpb"><i style="width:${(d.hp / d.maxHp) * 100}%"></i></div>`;
      } else if (ent.kind === 'player') {
        cls = 'friend';
        html = `<span style="color:${CLASSES[d.cls].color}">${d.name}</span><div class="hpb"><i style="width:${(d.hp / d.maxHp) * 100}%"></i></div>`;
      } else if (ent.kind === 'npc') {
        h = d.kind === 'questgiver' ? 2.35 : 1.5;
        html = `<span style="color:#ffd34a">${d.kind === 'questgiver' ? 'Ysolde' : 'Bram'}</span><br><small>${d.kind === 'questgiver' ? '&lt;Keeper&gt;' : '&lt;Pedlar&gt;'}</small>`;
      } else continue;
      alive.add(ent.id);
      const p = this.project(ent.obj.position.clone().setY(h));
      this.hud.plate(ent.id, html, cls, p?.x || 0, p?.y || 0, !!p);
    }
    this.hud.prunePlates(alive);
  }
}

initLobby();
