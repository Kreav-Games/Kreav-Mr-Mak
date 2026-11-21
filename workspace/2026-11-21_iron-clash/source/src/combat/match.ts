import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Vector3, Matrix } from '@babylonjs/core/Maths/math.vector';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import '@babylonjs/core/Layers/effectLayerSceneComponent';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import { DefaultRenderingPipeline } from '@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline';
import '@babylonjs/core/PostProcesses/RenderPipeline/postProcessRenderPipelineManagerSceneComponent';
import { ImageProcessingConfiguration } from '@babylonjs/core/Materials/imageProcessingConfiguration';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import { RobotModel, type RobotSpec } from '../render/robotModel';
import { Arena, type ArenaId } from '../render/arena';
import { FX } from '../render/fx';
import { Fighter, type CombatEnv } from './fighter';
import { AIController } from './ai';
import type { FighterStats, ClassId, InputFrame, Settings } from '../core/types';
import { emptyInput } from '../core/types';
import type { Opponent, ChallengeMods } from '../data/opponents';
import type { FightContext, FightResult } from '../core/economy';
import type { MoveDef } from '../data/moves';
import { MOVES } from '../data/moves';
import { Hud } from '../ui/hud';
import { goFullscreen } from '../main';
import { audio } from '../audio/audio';
import type { Input } from '../input/input';

export interface MatchOpts {
  player: { name: string; cls: ClassId; stats: FighterStats; spec: RobotSpec; weapon?: string };
  enemy: { def: Opponent; stats: FighterStats; spec: RobotSpec; weapon?: string; diff?: number };
  arena: ArenaId; ctx: FightContext; mods: ChallengeMods; rounds: number; roundTime: number; tutorial: boolean; settings: Settings; touch: boolean;
}

interface Proj { mesh: Mesh; owner: Fighter; move: MoveDef; mult: number; dir: Vector3; dist: number }

const TUTORIAL = [
  { text: '<b>Move</b> with <kbd>WASD</kbd> or the left stick. Walk around the bot.', done: (m: Match) => m.tut.moved > 4 },
  { text: '<b>Punch</b> with <kbd>Left Mouse</kbd> / <kbd>J</kbd> / <b>PUNCH</b>. Land 4 punches. Tap repeatedly to chain jab, cross, hook and uppercut.', done: (m: Match) => m.p.tally.hits >= 4 },
  { text: '<b>Heavy attack</b> with <kbd>Right Mouse</kbd> / <kbd>K</kbd> / <b>HEAVY</b>. Hold it to charge. Push toward the bot for an uppercut, sideways for a hook, back for a low kick. Land 2.', done: (m: Match) => m.p.heavyHits >= 2 },
  { text: '<b>Combos:</b> keep hitting without getting hit. Reach a <b>5-hit combo</b>.', done: (m: Match) => m.p.tally.bestCombo >= 5 },
  { text: '<b>Block</b> by holding <kbd>Shift</kbd> / <b>BLOCK</b>. The bot will attack now. Block 3 hits. Press block right before impact for a <b>PERFECT BLOCK</b> and a counter window.', done: (m: Match) => m.p.blocksMade >= 3, attack: true },
  { text: '<b>Dodge</b> with <kbd>Space</kbd> / <b>DODGE</b> plus a direction. Dodge through 2 attacks. Dodging just in time gives a <b>PERFECT DODGE</b>.', done: (m: Match) => m.p.dodges >= 2, attack: true },
  { text: 'Attacks build <b>HEAT</b>. At 100% you overheat and are helpless. Use ability <kbd>4</kbd> <b>Coolant Purge</b> now. Abilities <kbd>1</kbd>–<kbd>3</kbd> come from your class and weapon.', done: (m: Match) => (m.p.cd['purge'] || 0) > 0, prep: (m: Match) => { m.p.heat = 85; } },
  { text: 'Your <b>SPECIAL</b> meter is full. Press <kbd>Q</kbd> / <b>SPECIAL</b> up close to unleash it.', done: (m: Match) => m.p.tally.specials >= 1, prep: (m: Match) => { m.p.special = 100; } },
  { text: 'Finish it! Beat the bot down. When it is <b>staggered under 15% health</b>, <kbd>Q</kbd> becomes a <b>FINISHER</b>.', done: () => false, prep: (m: Match) => { m.e.hp = m.e.stats.maxHp * 0.3; m.e.special = 0; m.tut.final = true; } },
];

export class Match {
  scene: Scene; cam: FreeCamera; arena: Arena; fx: FX; hud: Hud;
  p!: Fighter; e!: Fighter; ai: AIController | null = null;
  private projs: Proj[] = [];
  private phase: 'intro' | 'roundStart' | 'fight' | 'roundEnd' | 'ko' | 'end' | 'paused' = 'intro';
  private phaseT = 0; round = 1; time: number; wins: [number, number] = [0, 0];
  private hitstopT = 0; private slowT = 0; private slowScale = 1; private shakeA = 0;
  private camYaw = 0; private camPitch = 0.18; private camPos = new Vector3(0, 4, -10); private camTgt = new Vector3(0, 1.5, 0);
  private endMethod: FightResult['method'] = 'KO'; private winner: Fighter | null = null; private elapsed = 0;
  private stepPh = [0, 0]; private pausedFrom: Match['phase'] = 'fight'; private pauseEl: HTMLElement | null = null;
  tut = { step: 0, moved: 0, final: false, atkT: 0 };
  private lastPos = new Vector3(); private disposed = false;
  private obs: any;

  constructor(private engine: Engine, private o: MatchOpts, private input: Input, private uiRoot: HTMLElement, private onEnd: (r: FightResult) => void) {
    const scene = this.scene = new Scene(engine);
    scene.skipPointerMovePicking = true;
    const q = o.settings.quality;
    this.cam = new FreeCamera('cam', new Vector3(0, 4, -10), scene); this.cam.fov = 0.9; this.cam.minZ = 0.1; this.cam.maxZ = 300;
    this.fx = new FX(scene, q);
    this.arena = new Arena(scene, o.arena, this.fx, q);
    const ip = scene.imageProcessingConfiguration;
    ip.toneMappingEnabled = true; ip.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES; ip.exposure = 1.25; ip.contrast = 1.15;
    if (q !== 'low') { const gl = new GlowLayer('glow', scene, { mainTextureRatio: q === 'high' ? 0.5 : 0.25, blurKernelSize: q === 'high' ? 48 : 24 }); gl.intensity = 0.75; for (const m of scene.meshes) if ((m as any).noGlow) gl.addExcludedMesh(m as Mesh); }
    const env = this.makeEnv();
    const pm = new RobotModel(scene, o.player.spec), em = new RobotModel(scene, o.enemy.spec);
    this.p = new Fighter(o.player.name, o.player.cls, o.player.stats, pm, env, true, o.player.weapon, o.mods.playerHp || 1);
    this.e = new Fighter(o.enemy.def.name, o.enemy.def.cls, o.enemy.stats, em, env, false, o.enemy.weapon, o.mods.enemyHp || 1);
    if (o.mods.enemyHp) { this.e.stats = { ...this.e.stats, maxHp: this.e.stats.maxHp * o.mods.enemyHp }; this.e.hp = this.e.stats.maxHp; }
    this.p.opp = this.e; this.e.opp = this.p;
    if (!o.tutorial) this.ai = new AIController(this.e, o.enemy.def, o.mods.enemyDiff ?? o.enemy.diff);
    if (q !== 'low') {
      const sg = new ShadowGenerator(q === 'high' ? 2048 : 1024, this.arena.key);
      if (engine.webGLVersion >= 2) { sg.usePercentageCloserFiltering = true; sg.filteringQuality = q === 'high' ? ShadowGenerator.QUALITY_MEDIUM : ShadowGenerator.QUALITY_LOW; }
      else sg.usePoissonSampling = true;
      sg.bias = 0.0008; sg.normalBias = 0.02; sg.darkness = 0.25;
      for (const m of [...pm.meshes, ...em.meshes]) sg.addShadowCaster(m, false);
      this.arena.key.autoUpdateExtends = true; this.arena.key.shadowMinZ = 1; this.arena.key.shadowMaxZ = 60;
    }
    if (q === 'high' || q === 'medium') {
      const dp = new DefaultRenderingPipeline('dp', true, scene, [this.cam]);
      dp.fxaaEnabled = true; dp.imageProcessingEnabled = true;
      dp.imageProcessing.toneMappingEnabled = true; dp.imageProcessing.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
      dp.imageProcessing.exposure = 1.25; dp.imageProcessing.contrast = 1.15;
      dp.imageProcessing.vignetteEnabled = true; dp.imageProcessing.vignetteWeight = 1.6; dp.imageProcessing.vignetteStretch = 0.4;
      if (q === 'high') { dp.bloomEnabled = true; dp.bloomThreshold = 0.75; dp.bloomWeight = 0.3; dp.bloomKernel = 48; dp.bloomScale = 0.5; dp.chromaticAberrationEnabled = true; dp.chromaticAberration.aberrationAmount = 6; }
      (this as any).dp = dp;
    }
    this.resetPositions();
    this.time = o.roundTime;
    this.hud = new Hud(uiRoot, this.p, this.e, o.touch, () => this.togglePause());
    input.onPause = () => this.togglePause();
    if (o.touch) {
      const ab = this.p.abilityIds().map(id => id ? MOVES[id].name.split(' ')[0].toUpperCase() : '—');
      input.buildTouch(uiRoot, { ab });
    }
    input.enabled = true; input.reset();
    audio.crowd(true); audio.music('fight'); audio.cheer(0.5);
    if (o.tutorial) { this.phase = 'fight'; this.time = Infinity; this.hud.tutorial(this.tutHtml()); this.hud.announce('TRAINING', 'Follow the prompts', '#4FD8FF'); }
    else { this.hud.announce(`${o.player.name}  VS  ${o.enemy.def.name}`, o.enemy.def.boss ? o.enemy.def.boss.title.toUpperCase() : `${o.enemy.def.handler.toUpperCase()}'S ROBOT`, '#FFFFFF', 3); }
    this.obs = scene.onBeforeRenderObservable.add(() => this.tick());
    const skip = () => { if (this.phase === 'intro' && this.phaseT > 0.6) { this.phaseT = 99; } };
    this.uiRoot.addEventListener('pointerdown', skip);
    addEventListener('keydown', skip);
    (this as any)._skip = skip;
  }

  private resetPositions() {
    this.p.pos.set(0, 0, -3.2); this.e.pos.set(0, 0, 3.2); this.p.yaw = 0; this.e.yaw = Math.PI;
    for (const f of [this.p, this.e]) { f.model.root.position.copyFrom(f.pos); f.model.root.rotation.y = f.yaw; }
    this.camYaw = 0;
  }

  private makeEnv(): CombatEnv {
    const self = this;
    return {
      time: 0, mods: this.o.mods,
      sparks: (pos, power, color) => this.fx.emit('spark', pos, 10 + power * 40, color),
      burst: (kind, pos, power = 1) => {
        if (kind === 'ring') { this.fx.ring(pos, power); this.fx.emit('dust', pos, 20); return; }
        const n = { debris: 14, smoke: 8, steam: 12, dust: 16, shock: 18, fire: 24 }[kind];
        this.fx.emit(kind as any, pos, n * power);
      },
      sfx: (n, v) => audio.sfx(n, v),
      shake: a => { if (this.o.settings.shake) this.shakeA = Math.min(1.2, this.shakeA + a); },
      hitstop: t => { this.hitstopT = Math.max(this.hitstopT, t); },
      slowmo: (t, s) => { this.slowT = Math.max(this.slowT, t); this.slowScale = s; },
      popup: (text, pos, color, big) => {
        const p = Vector3.Project(pos, Matrix.Identity(), this.scene.getTransformMatrix(), this.cam.viewport.toGlobal(this.engine.getRenderWidth(), this.engine.getRenderHeight()));
        const sx = p.x / this.engine.getRenderWidth() * innerWidth, sy = p.y / this.engine.getRenderHeight() * innerHeight;
        if (p.z > 1 || p.z < 0) return;
        this.hud.popup(text, sx, sy, color, !!big);
      },
      announce: (t, s, c) => this.hud.announce(t, s, c),
      projectile: (owner, move, mult) => this.spawnProjectile(owner, move, mult),
      clamp: f => {
        const hit = this.arena.clamp(f);
        if (hit && this.arena.electricWalls && f.kb.length() > 2.6 && f.alive && f.state !== 'down') { (f as any)._stunT = 0.7; f.setState('stun'); this.fx.emit('shock', f.chestPos(), 30, '#7FE8FF'); audio.sfx('crit', 0.6); }
        return hit;
      },
      crowd: level => { this.arena.excitement = Math.min(1, this.arena.excitement + level * 0.6); audio.cheer(0.3 + level * 0.6); },
      onKO: (loser, method) => self.ko(loser, method),
    };
  }

  private spawnProjectile(owner: Fighter, move: MoveDef, mult: number) {
    const pr = move.projectile!; const count = pr.count || 1;
    for (let i = 0; i < count; i++) {
      const m = MeshBuilder.CreateSphere('proj', { diameter: pr.size, segments: 8 }, this.scene);
      const mat = new StandardMaterial('projM', this.scene); mat.emissiveColor = Color3.FromHexString(pr.color).scale(1.6); mat.disableLighting = true; m.material = mat;
      const start = (move.hand === 'B' ? owner.chestPos() : owner.model.fist.R.getAbsolutePosition()).clone();
      const tgt = owner.opp.chestPos(); const dir = tgt.subtract(start); dir.y *= 0.3;
      if (count > 1) { const sideways = owner.right.scale((i - (count - 1) / 2) * 0.35); dir.addInPlace(sideways); start.addInPlace(new Vector3(0, 0.5 + i * 0.1, 0)); }
      dir.normalize(); m.position.copyFrom(start);
      this.projs.push({ mesh: m, owner, move, mult, dir, dist: 0 });
    }
    audio.sfx(move.id === 'teslaArc' || move.id === 'overloadBeam' ? 'blink' : 'fireburst', 0.6);
  }

  private updateProjectiles(dt: number) {
    for (let i = this.projs.length - 1; i >= 0; i--) {
      const pj = this.projs[i]; const step = pj.move.projectile!.speed * dt;
      pj.mesh.position.addInPlace(pj.dir.scale(step)); pj.dist += step;
      this.fx.emit('trail', pj.mesh.position, 2, pj.move.projectile!.color);
      const tgt = pj.owner.opp; const c = tgt.chestPos();
      const hit = Math.hypot(pj.mesh.position.x - c.x, pj.mesh.position.z - c.z) < 0.85 && Math.abs(pj.mesh.position.y - c.y) < 1.4;
      if (hit) { tgt.receive(pj.owner, pj.move, pj.mult / (pj.move.projectile!.count || 1) * (pj.move.projectile!.count ? 1.6 : 1)); this.fx.emit('spark', pj.mesh.position, 30, pj.move.projectile!.color); }
      if (hit || pj.dist > pj.move.projectile!.range) { pj.mesh.material?.dispose(); pj.mesh.dispose(); this.projs.splice(i, 1); }
    }
  }

  private ko(loser: Fighter, method: 'KO' | 'TKO' | 'Finisher') {
    if (this.phase === 'ko' || this.phase === 'end') return;
    this.winner = loser === this.p ? this.e : this.p;
    this.endMethod = method;
    if (method === 'TKO') { loser.hp = Math.min(loser.hp, loser.hp); }
    this.phase = 'ko'; this.phaseT = 0;
    this.hud.announce(method === 'TKO' ? 'T.K.O.' : method === 'Finisher' ? 'FINISHED!' : 'K.O.!', method === 'TKO' ? 'Three knockdowns' : '', loser === this.p ? '#FF5A5A' : '#FFB12E', 3);
    audio.sfx('bell'); audio.cheer(1); this.arena.excitement = 1; this.hud.flash('rgba(255,255,255,0.6)');
  }

  togglePause() {
    if (this.phase === 'end' || this.phase === 'ko') return;
    if (this.phase !== 'paused') {
      this.pausedFrom = this.phase; this.phase = 'paused'; this.input.releaseLock();
      const el = this.pauseEl = document.createElement('div'); el.className = 'modal pause';
      el.innerHTML = `<div class="panel"><h2>PAUSED</h2><button class="btn primary" data-a="resume">Resume</button><button class="btn" data-a="fs">Full screen</button>${this.o.tutorial ? '<button class="btn" data-a="skip">Skip training</button>' : ''}<button class="btn danger" data-a="forfeit">${this.o.tutorial ? 'Leave training' : 'Forfeit fight'}</button></div>`;
      el.addEventListener('click', ev => {
        const a = (ev.target as HTMLElement).closest('[data-a]')?.getAttribute('data-a');
        if (a === 'resume') this.togglePause();
        if (a === 'fs') { goFullscreen(true); this.togglePause(); }
        if (a === 'forfeit') { this.closePause(); this.winner = this.e; this.endMethod = 'TKO'; this.finish(true); }
        if (a === 'skip') { this.closePause(); this.winner = this.p; this.endMethod = 'KO'; this.finish(true); }
      });
      this.uiRoot.appendChild(el);
    } else { this.closePause(); }
  }
  private closePause() { this.pauseEl?.remove(); this.pauseEl = null; if (this.phase === 'paused') this.phase = this.pausedFrom; }

  private tutHtml() { const s = TUTORIAL[this.tut.step]; return s ? `<div class="tstep">STEP ${this.tut.step + 1} / ${TUTORIAL.length}</div>${s.text}` : null; }

  private tick() {
    if (this.disposed) return;
    const realDt = Math.min(0.05, this.engine.getDeltaTime() / 1000);
    if (this.phase === 'paused') { this.input.frame(); this.input.camera(); return; }
    this.phaseT += realDt;
    this.slowT -= realDt; this.hitstopT -= realDt;
    const ts = this.slowT > 0 ? this.slowScale : 1;
    const dt = realDt * ts;
    const simDt = this.hitstopT > 0 ? dt * 0.05 : dt;
    this.elapsed += realDt;
    // inputs
    let pin: InputFrame = this.input.frame();
    const cd = this.input.camera();
    this.camYaw = Math.max(-1.6, Math.min(1.6, this.camYaw - cd.dx)); this.camPitch = Math.max(-0.05, Math.min(0.6, this.camPitch + cd.dy));
    if (Math.abs(cd.dx) < 1e-4) this.camYaw *= Math.exp(-0.35 * realDt);
    let ein: InputFrame = emptyInput();
    const fighting = this.phase === 'fight';
    if (!fighting) { pin = { ...emptyInput(), mash: pin.mash }; }
    else if (this.ai) ein = this.ai.update(simDt);
    if (this.o.tutorial && fighting) ein = this.tutorialDummy(simDt);
    if (this.phase === 'ko' || this.phase === 'end') { pin = emptyInput(); ein = emptyInput(); }
    // simulate
    this.p.env.time += simDt;
    this.p.update(simDt, pin); this.e.update(simDt, ein);
    this.updateProjectiles(simDt);
    this.arena.update(dt, [this.p, this.e], this.p.env, fighting);
    this.fx.update(dt);
    this.footsteps();
    // tutorial tracking
    if (this.o.tutorial) this.tutorialTrack(pin);
    // round flow
    if (this.phase === 'intro' && this.phaseT > 3.2) { this.phase = 'roundStart'; this.phaseT = 0; this.hud.announce(`ROUND ${this.round}`, '', '#FFFFFF', 1.2); audio.sfx('bell'); }
    if (this.phase === 'roundStart' && this.phaseT > 1.3) { this.phase = 'fight'; this.phaseT = 0; this.hud.announce('FIGHT!', '', '#FFB12E', 0.9); audio.cheer(0.9); this.arena.excitement = 0.8; }
    if (fighting && !this.o.tutorial) {
      this.time -= simDt;
      if (this.time <= 0) { this.time = 0; this.phase = 'roundEnd'; this.phaseT = 0; audio.sfx('bell'); this.hud.announce('TIME', `Round ${this.round} over`, '#FFFFFF', 2); this.p.move = null; this.e.move = null;
        const pr = this.p.hp / this.p.stats.maxHp + this.p.tally.dmgDealt * 0.0002, er = this.e.hp / this.e.stats.maxHp + this.e.tally.dmgDealt * 0.0002;
        if (pr >= er) this.wins[0]++; else this.wins[1]++;
      }
    }
    if (this.phase === 'roundEnd' && this.phaseT > 2.6) {
      const need = Math.ceil(this.o.rounds / 2);
      if (this.round >= this.o.rounds || this.wins[0] >= need || this.wins[1] >= need) {
        this.winner = this.wins[0] >= this.wins[1] ? this.p : this.e; this.endMethod = 'Decision';
        this.hud.announce(this.winner === this.p ? 'YOU WIN' : 'YOU LOSE', 'Judges decision', this.winner === this.p ? '#FFB12E' : '#FF5A5A', 3);
        this.phase = 'ko'; this.phaseT = 0;
      } else {
        this.round++; this.time = this.o.roundTime; this.resetPositions();
        this.p.resetForRound(0.18); this.e.resetForRound(0.18);
        this.phase = 'roundStart'; this.phaseT = 0; this.hud.announce(`ROUND ${this.round}`, 'Repairs complete', '#FFFFFF', 1.3); audio.sfx('bell');
      }
    }
    if (this.phase === 'ko') {
      if (this.phaseT > 1.2 && this.winner && this.winner.state !== 'victory' && this.winner.alive) { this.winner.victory(); this.fx.emit('confetti', new Vector3(0, 6, 0), 200); audio.sfx(this.winner === this.p ? 'victory' : 'defeat'); }
      if (this.phaseT > 5) this.finish(false);
    }
    // camera, hud, screens
    this.updateCamera(realDt);
    this.hud.update(realDt, this.p, this.e, this.round, this.o.rounds, this.time, this.wins);
    this.arena.updateScreens(realDt, this.p, this.e, this.round, this.time, this.phase === 'ko' ? (this.winner === this.p ? 'WINNER' : 'K.O.') : this.phase === 'roundStart' ? 'READY' : undefined);
    audio.tickCrowd(realDt);
    if (this.o.touch) {
      const ids = this.p.abilityIds();
      this.input.setTouchCooldowns(ids.map((id, i) => { if (!id || (i === 1 && !this.p.stats.abilityB)) return null; return (this.p.cd[id] || 0) / ((MOVES[id].cd || 1) * this.p.stats.cdMult); }), this.p.special, this.p.finisherReady);
    }
  }

  private footsteps() {
    [this.p, this.e].forEach((f, i) => {
      const ph = f.anim.walkPh; const prev = this.stepPh[i];
      if (Math.floor(ph / Math.PI) !== Math.floor(prev / Math.PI)) { const d = Vector3.Distance(f.pos, this.cam.position); audio.sfx('step', Math.max(0.15, 0.7 - d * 0.04)); if (Math.random() < 0.3) this.fx.emit('dust', f.pos, 3); }
      this.stepPh[i] = ph;
    });
  }

  private updateCamera(dt: number) {
    const p = this.p.pos, e = this.e.pos;
    let pos: Vector3, tgt: Vector3;
    if (this.phase === 'intro') {
      const a = this.phaseT * 0.6 - 1.2; const r = 9 - this.phaseT * 0.8;
      pos = new Vector3(Math.sin(a) * r, 2.2 + this.phaseT * 0.4, Math.cos(a) * r); tgt = new Vector3(0, 1.6, 0);
    } else if ((this.phase === 'ko' || this.phase === 'end') && this.winner) {
      const w = this.winner.pos; const a = this.phaseT * 0.35 + this.winner.yaw;
      pos = new Vector3(w.x + Math.sin(a) * 5.5, 2.4, w.z + Math.cos(a) * 5.5); tgt = w.add(new Vector3(0, 1.8, 0));
    } else {
      const d = e.subtract(p); d.y = 0; let dist = d.length(); if (dist < 0.01) { d.set(0, 0, 1); dist = 1; } d.scaleInPlace(1 / dist);
      const yaw = Math.atan2(d.x, d.z) + this.camYaw;
      const back = new Vector3(Math.sin(yaw), 0, Math.cos(yaw));
      const right = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
      const camDist = 4.6 + Math.min(8, dist) * 0.45;
      const fin = this.p.move?.kind === 'finisher' || this.p.move?.kind === 'special';
      pos = p.subtract(back.scale(fin ? camDist * 0.75 : camDist)).add(right.scale(1.6)).add(new Vector3(0, 3.0 + this.camPitch * 4 + (this.p.state === 'down' ? 1.5 : 0), 0));
      tgt = p.scale(0.4).add(e.scale(0.6)).add(new Vector3(0, 1.4, 0));
    }
    const k = 1 - Math.exp(-(this.phase === 'intro' ? 3 : 7) * dt);
    this.camPos.addInPlace(pos.subtract(this.camPos).scale(k));
    this.camTgt.addInPlace(tgt.subtract(this.camTgt).scale(k));
    // keep the camera inside the arena stands
    const walled = this.o.arena === 'pit' || this.o.arena === 'scrap';
    const lim = walled ? this.arena.cfg.half + 0.1 : this.arena.cfg.standR - 1.5; const cl = Math.hypot(this.camPos.x, this.camPos.z); if (cl > lim) { this.camPos.x *= lim / cl; this.camPos.z *= lim / cl; }
    this.shakeA *= Math.exp(-6 * dt);
    const s = this.shakeA * 0.25;
    this.cam.position.set(this.camPos.x + (Math.random() - 0.5) * s, this.camPos.y + (Math.random() - 0.5) * s, this.camPos.z + (Math.random() - 0.5) * s);
    this.cam.setTarget(this.camTgt);
    this.cam.fov = 0.9 - (this.slowT > 0 ? 0.12 : 0);
  }

  /* ---------------- tutorial ---------------- */
  private tutorialDummy(dt: number): InputFrame {
    const inp = emptyInput(); const step = TUTORIAL[this.tut.step];
    const e = this.e;
    if (e.hp < e.stats.maxHp * 0.35 && !this.tut.final) e.hp = e.stats.maxHp * 0.6;
    if (step?.attack) {
      this.tut.atkT -= dt; const d = e.distTo(this.p);
      if (d > 2.0) inp.mz = 1;
      else if (this.tut.atkT <= 0 && e.canAct) { inp.light = true; this.tut.atkT = 1.7; }
    } else if (this.tut.final) {
      if (Math.random() < 0.01) inp.light = true;
      inp.mx = Math.sin(this.elapsed) * 0.4;
    }
    return inp;
  }
  private tutorialTrack(pin: InputFrame) {
    if (Math.abs(pin.mx) + Math.abs(pin.mz) > 0.1) this.tut.moved += Vector3.Distance(this.p.pos, this.lastPos);
    this.lastPos.copyFrom(this.p.pos);
    const step = TUTORIAL[this.tut.step];
    if (step && step.done(this)) {
      this.tut.step++; audio.sfx('upgrade');
      const next = TUTORIAL[this.tut.step]; next?.prep?.(this);
      this.hud.announce('NICE!', '', '#5BD16A', 0.8);
      this.hud.tutorial(this.tutHtml());
    }
  }

  private finish(forced: boolean) {
    if (this.phase === 'end' && !forced) return;
    this.phase = 'end';
    const t = this.p.tally;
    const res: FightResult = {
      win: this.winner === this.p, method: this.endMethod, rounds: this.round, time: this.elapsed,
      dmgDealt: t.dmgDealt, dmgTaken: t.dmgTaken, hits: t.hits, attempts: t.attempts, headHits: t.headHits, counters: t.counters,
      perfectBlocks: t.perfectBlocks, perfectDodges: t.perfectDodges, bestCombo: t.bestCombo, knockdownsDealt: t.knockdownsDealt,
      knockdownsTaken: t.knockdownsTaken, specials: t.specials, zoneTaken: t.zoneTaken, ctx: this.o.ctx,
    };
    this.onEnd(res);
  }

  dispose() {
    this.disposed = true;
    this.scene.onBeforeRenderObservable.remove(this.obs);
    removeEventListener('keydown', (this as any)._skip);
    this.input.enabled = false; this.input.onPause = null; this.input.destroyTouch(); this.input.releaseLock();
    this.closePause(); this.hud.dispose();
    audio.crowd(false);
    this.p.model.dispose(); this.e.model.dispose();
    this.scene.dispose();
  }
}
