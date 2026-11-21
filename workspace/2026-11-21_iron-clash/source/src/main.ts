import { Engine } from '@babylonjs/core/Engines/engine';
import './ui/style.css';
import type { Profile, RobotFrame, SlotId } from './core/types';
import { loadProfile, newProfile, saveProfile, activeRobot, isMobile, addRobot, addPart } from './core/save';
import { robotStats, robotItems, opponentStats, powerRating } from './core/stats';
import { settleFight, ensureDaily, type FightContext, type FightResult, type Rewards } from './core/economy';
import { PART_BY_ID, SLOTS } from './data/parts';
import type { Opponent, ChallengeMods } from './data/opponents';
import { LEAGUES } from './data/opponents';
import { Garage } from './render/garage';
import type { RobotSpec } from './render/robotModel';
import { Match } from './combat/match';
import type { ArenaId } from './render/arena';
import { Input } from './input/input';
import { audio } from './audio/audio';
import { UI } from './ui/ui';
import { AIController } from './combat/ai';
import { OPP_BY_ID } from './data/opponents';

export function robotSpec(p: Profile, r: RobotFrame): RobotSpec {
  const items = robotItems(r, p.parts);
  const parts: Partial<Record<SlotId, string>> = {};
  for (const s of SLOTS) if (items[s.id]) parts[s.id] = items[s.id]!.def;
  return { parts, paint: r.paint, slotPaint: r.slotPaint, decal: r.decal };
}
export function opponentSpec(o: Opponent): RobotSpec {
  const parts: Partial<Record<SlotId, string>> = {};
  for (const s of SLOTS) { const d = o.parts[s.cat]; if (d) parts[s.id] = d; }
  return { parts, paint: o.paint, decal: o.decal };
}

export class Game {
  engine: Engine; canvas: HTMLCanvasElement; profile: Profile; garage: Garage; input: Input; ui: UI;
  match: Match | null = null; touch: boolean;

  constructor() {
    this.canvas = document.getElementById('game') as HTMLCanvasElement;
    this.profile = loadProfile() || newProfile();
    ensureDaily(this.profile);
    const s = this.profile.settings;
    this.engine = new Engine(this.canvas, s.quality !== 'low', { preserveDrawingBuffer: false, stencil: true, powerPreference: 'high-performance' }, true);
    this.applyScaling();
    addEventListener('resize', () => { this.applyScaling(); this.engine.resize(); });
    this.touch = this.computeTouch();
    this.input = new Input(this.canvas);
    this.input.sens = s.sens; this.input.invertY = s.invertY;
    audio.vol = { master: s.master, music: s.music, sfx: s.sfx };
    this.garage = new Garage(this.engine, this.canvas, s.quality);
    this.garage.setSpec(robotSpec(this.profile, activeRobot(this.profile)));
    this.ui = new UI(this, document.getElementById('ui')!);
    this.engine.runRenderLoop(() => {
      const sc = this.match ? this.match.scene : this.garage.scene;
      sc.render();
    });
    setInterval(() => { this.profile.stats.playSeconds += 10; this.save(); }, 10000);
    addEventListener('pagehide', () => this.save());
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') this.save(); });
  }

  computeTouch() { const t = this.profile.settings.touch; return t === 'on' || (t === 'auto' && (isMobile() || matchMedia('(pointer: coarse)').matches)); }
  applyScaling() {
    const q = this.profile.settings.quality; const dpr = devicePixelRatio || 1;
    const cap = q === 'high' ? 2 : q === 'medium' ? 1.5 : 1;
    this.engine.setHardwareScalingLevel(1 / Math.min(dpr, cap));
  }
  save() { saveProfile(this.profile); }
  refreshGarage() { this.garage.setSpec(robotSpec(this.profile, activeRobot(this.profile))); }

  startFight(ctx: FightContext, opp: Opponent, arena: ArenaId, mods: ChallengeMods = {}, opts: { rounds?: number; roundTime?: number; tutorial?: boolean } = {}) {
    const p = this.profile; const r = activeRobot(p);
    const items = robotItems(r, p.parts);
    const pstats = robotStats(r, p.parts);
    this.touch = this.computeTouch();
    audio.unlock();
    this.garage.active = false;
    this.match = new Match(this.engine, {
      player: { name: r.name, cls: r.cls, stats: pstats, spec: robotSpec(p, r), weapon: items.weapon ? PART_BY_ID[items.weapon.def].style : undefined },
      enemy: { def: opp, stats: opponentStats(opp), spec: opponentSpec(opp), weapon: opp.parts.weapon ? PART_BY_ID[opp.parts.weapon].style : undefined },
      arena, ctx, mods, rounds: opts.rounds ?? mods.rounds ?? 3, roundTime: opts.roundTime ?? (mods.rounds === 1 ? 180 : 90), tutorial: !!opts.tutorial,
      settings: p.settings, touch: this.touch,
    }, this.input, this.ui.fightLayer(), res => this.endFight(res));
  }

  private endFight(res: FightResult) {
    const m = this.match; if (!m) return;
    let rewards: Rewards | null = null;
    if (res.ctx.kind === 'tutorial') { if (!this.profile.tutorialDone) { this.profile.tutorialDone = true; rewards = settleFight(this.profile, res); } }
    else rewards = settleFight(this.profile, res);
    const shop = this.profile.shop;
    if (++shop.refreshAt >= 3) { shop.seed = (shop.seed * 48271 + 7) % 2147483647; shop.bought = []; shop.refreshAt = 0; }
    this.save();
    // let the KO camera finish its frame, then swap scenes
    setTimeout(() => {
      m.dispose(); this.match = null; this.garage.active = true; audio.music('menu');
      this.refreshGarage();
      this.ui.postFight(res, rewards);
    }, 30);
  }

  leagueArena(l: number) { return LEAGUES[l].arena as ArenaId; }
}

document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('dblclick', e => e.preventDefault());

function boot() {
  try {
    const game = new Game();
    (window as any).__game = game;
    (window as any).__dbg = { AIController, OPP_BY_ID, opponentStats, powerRating, robotStats, addRobot, addPart };
  } catch (err) {
    console.error(err);
    const ui = document.getElementById('ui')!;
    ui.innerHTML = `<div class="fatal"><h1>IRON CLASH</h1><p>Your browser could not start the 3D engine (WebGL is required).</p><pre>${String((err as Error)?.message || err)}</pre></div>`;
  }
}
boot();
