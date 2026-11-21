import type { Game } from '../main';
import { robotSpec, opponentSpec } from '../main';
import type { ClassId, PartItem, Rarity, SlotId, StatBlock, Materials, FighterStats } from '../core/types';
import { STAT_KEYS, STAT_LABEL, LOWER_BETTER } from '../core/types';
import { activeRobot, addRobot, addPart, partInUse, xpForPlayer, xpForRobot, skillPointsLeft, wipeProfile, newProfile, MAX_ROBOT_LEVEL } from '../core/save';
import { robotStats, robotItems, partStats, opponentStats, powerRating, sumStats, derive } from '../core/stats';
import { PARTS, PART_BY_ID, RARITIES, SLOTS, slotCat, MAX_PART_LEVEL, sellPrice, repairCost } from '../data/parts';
import { CLASSES, CLASS_IDS } from '../data/classes';
import { LEAGUES, OPPONENTS, OPP_BY_ID, CHALLENGES, DAILY_TEMPLATES, PERSONALITY_LABEL, DUMMY, leagueOpponents, leagueBoss, type Opponent, type ChallengeMods } from '../data/opponents';
import { MOVES, WEAPON_MOVE } from '../data/moves';
import { ARENA_INFO, type ArenaId } from '../render/arena';
import {
  shopStock, SHOP_REFRESH_COST, upgradeInfo, MAT_LABEL, MAT_COLOR, salvage, contractFor, leagueProgress, leaderboard,
  newTournament, playerOpponentInRound, roundPairs, advanceTournament, tournamentEntry, tournamentPrize, ROUND_NAMES, ensureDaily,
  type FightContext, type FightResult, type Rewards,
} from '../core/economy';
import { audio } from '../audio/audio';

const esc = (s: string) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const rc = (r: Rarity) => RARITIES[r].color;
const PALETTE = ['#2F6FD6', '#C8432B', '#E8B23A', '#5BD16A', '#B65CFF', '#2EE6C5', '#FF6A9A', '#F2F2F2', '#8A8F98', '#2A2F3A', '#15161C', '#4E6B3A', '#7A4A2A', '#D9D4C7', '#FF8A3D', '#3A4A5A'];
const GLOWS = ['#4FD8FF', '#FF3A6A', '#9CFF6A', '#FFB12E', '#D27CFF', '#FFFFFF', '#FF5A2A', '#2EE6C5'];
const DECAL_NAMES = ['Bolt', 'Star', 'Skull', 'Crown', 'Flame', 'Gear'];
type Screen = 'title' | 'hub' | 'career' | 'prefight' | 'quick' | 'tournament' | 'garage' | 'shop' | 'collection' | 'stats' | 'settings' | 'post';

interface PreFight { opp: Opponent; ctx: FightContext; arena: ArenaId; mods: ChallengeMods; title: string; back: Screen }

export class UI {
  private screenEl: HTMLElement; private fightEl: HTMLElement; private toastEl: HTMLElement; private modalEl: HTMLElement | null = null;
  screen: Screen = 'title';
  private sel = { slot: 'head' as SlotId, item: '' as string, tab: 'parts' as 'parts' | 'paint' | 'skills' | 'builds', league: 0, paintSlot: 'all' as SlotId | 'all', collTab: 'robots' as 'robots' | 'catalog', statsTab: 'career' as 'career' | 'rank', quickOpp: '', quickArena: 'pit' as ArenaId };
  private pre: PreFight | null = null;
  private post: { res: FightResult; rw: Rewards | null } | null = null;

  constructor(private g: Game, private root: HTMLElement) {
    root.innerHTML = `<div class="screen"></div><div class="fight-layer"></div><div class="toast"></div><div class="rotate-hint">Turn your phone sideways for the best fighting view</div>`;
    this.screenEl = root.querySelector('.screen')!; this.fightEl = root.querySelector('.fight-layer')!; this.toastEl = root.querySelector('.toast')!;
    root.addEventListener('click', e => this.onClick(e));
    root.addEventListener('input', e => this.onInput(e));
    root.addEventListener('change', e => this.onChange(e));
    this.show('title');
  }

  /* ---------------- plumbing ---------------- */
  fightLayer() { this.screenEl.innerHTML = ''; this.screenEl.hidden = true; this.root.classList.add('fighting'); this.fightEl.innerHTML = ''; return this.fightEl; }
  private get p() { return this.g.profile; }
  private get robot() { return activeRobot(this.p); }
  toast(msg: string, kind: 'ok' | 'bad' = 'ok') { this.toastEl.textContent = msg; this.toastEl.className = 'toast on ' + kind; clearTimeout((this as any)._tt); (this as any)._tt = setTimeout(() => this.toastEl.className = 'toast', 2400); }
  private save() { this.g.save(); }

  show(s: Screen, keepScroll = false) {
    this.screen = s; this.root.classList.remove('fighting'); this.screenEl.hidden = false; this.fightEl.innerHTML = '';
    const body = this.screenEl.querySelector('.content') as HTMLElement | null; const st = keepScroll && body ? body.scrollTop : 0;
    const side = this.screenEl.querySelector('.inv-list') as HTMLElement | null; const st2 = keepScroll && side ? side.scrollTop : 0;
    this.screenEl.innerHTML = this.render(s);
    this.screenEl.dataset.screen = s;
    if (keepScroll) { const b = this.screenEl.querySelector('.content') as HTMLElement | null; if (b) b.scrollTop = st; const l = this.screenEl.querySelector('.inv-list') as HTMLElement | null; if (l) l.scrollTop = st2; }
    const wide = innerWidth > innerHeight;
    const gr = this.g.garage;
    gr.interactive = s === 'garage' || s === 'hub' || s === 'collection';
    if (s === 'title') gr.frame(0, wide ? -0.05 : -0.1, wide ? 6.4 : 8);
    else if (s === 'garage') gr.frame(wide && this.sel.tab !== 'parts' ? 0.85 : 0, wide ? 0 : -0.45, wide ? 6.2 : 8.6);
    else gr.frame(wide ? -1.25 : 0, wide ? 0 : -0.55, wide ? 6.6 : 8.4);
  }
  private rerender() { this.show(this.screen, true); }

  private topbar(title: string, back: Screen | null = 'hub') {
    const p = this.p; const need = xpForPlayer(p.level);
    return `<header class="topbar">
      ${back ? `<button class="iconbtn" data-act="go" data-arg="${back}" aria-label="Back">‹</button>` : ''}
      <h1>${esc(title)}</h1>
      <div class="tb-right">
        <div class="chip lvl"><span>LV ${p.level}</span><i style="width:${(p.xp / need * 100).toFixed(0)}%"></i></div>
        <div class="chip cr"><b>¢</b>${fmt(p.credits)}</div>
        <div class="chip mats">${(Object.keys(p.mats) as (keyof Materials)[]).map(k => `<span title="${MAT_LABEL[k]}" style="--c:${MAT_COLOR[k]}"><em></em>${p.mats[k]}</span>`).join('')}</div>
      </div>
    </header>`;
  }

  private render(s: Screen): string {
    switch (s) {
      case 'title': return this.rTitle();
      case 'hub': return this.rHub();
      case 'career': return this.rCareer();
      case 'prefight': return this.rPrefight();
      case 'quick': return this.rQuick();
      case 'tournament': return this.rTournament();
      case 'garage': return this.rGarage();
      case 'shop': return this.rShop();
      case 'collection': return this.rCollection();
      case 'stats': return this.rStats();
      case 'settings': return this.rSettings();
      case 'post': return this.rPost();
    }
  }

  /* ---------------- title & hub ---------------- */
  private rTitle() {
    const has = this.p.stats.fights > 0 || this.p.tutorialDone;
    return `<div class="title-screen">
      <div class="logo"><span class="l1">IRON</span><span class="l2">CLASH</span><div class="tag">ROBOT FIGHTING LEAGUE</div></div>
      <div class="title-btns">
        <button class="btn primary xl" data-act="start">${has ? 'Continue' : 'Start'}</button>
        <div class="small">Build your fighter. Climb from the underground pits to the World Championship.</div>
      </div>
    </div>`;
  }

  private rHub() {
    const p = this.p, r = this.robot; const fs = robotStats(r, p.parts); ensureDaily(p);
    const lg = LEAGUES[p.career.league]; const prog = leagueProgress(p, p.career.league);
    const next = leagueOpponents(p.career.league).find(o => !p.career.beaten.includes(o.id)) || (prog.bossUnlocked && !prog.bossBeaten ? prog.boss : null);
    const daily = p.daily.list.map((d, i) => { const t = DAILY_TEMPLATES.find(x => x.id === d.id)!; return `<div class="daily ${d.done ? 'done' : ''}"><div><b>${esc(t.text)}</b><div class="bar"><i style="width:${d.progress / t.n * 100}%"></i></div><small>${fmt(d.progress)} / ${fmt(t.n)} · ¢${t.reward}</small></div>${d.done && !d.claimed ? `<button class="btn sm primary" data-act="claimDaily" data-arg="${i}">Claim</button>` : d.claimed ? '<span class="ok">✓</span>' : ''}</div>`; }).join('');
    const nav = [
      ['career', 'Career', `${lg.short} league`], ['quick', 'Quick Fight', 'Any unlocked opponent'], ['tournament', 'Tournament', p.tournament ? 'In progress' : 'Bracket of 8'],
      ['garage', 'Garage', `${skillPointsLeft(r) > 0 ? skillPointsLeft(r) + ' skill pts · ' : ''}Build & upgrade`], ['shop', 'Shop', 'Parts & materials'], ['collection', 'Robots', `${p.robots.length} owned`],
      ['stats', 'Statistics', 'Career & rankings'], ['settings', 'Settings', 'Audio, graphics, controls'], ['tutorial', 'Training', p.tutorialDone ? 'Practice the basics' : 'Start here!'],
    ];
    return `${this.topbar('IRON CLASH', null)}
    <div class="hub">
      <nav class="mainnav">${nav.map(([k, n, sub]) => `<button class="navbtn ${k === 'tutorial' && !p.tutorialDone ? 'pulse' : ''}" data-act="${k === 'tutorial' ? 'tutorial' : 'go'}" data-arg="${k}"><b>${n}</b><small>${esc(sub)}</small></button>`).join('')}</nav>
      <section class="content hubside">
        <div class="panel robotcard">
          <div class="rc-head"><div><h2>${esc(r.name)}</h2><span class="cls" style="--c:${CLASSES[r.cls].color}">${CLASSES[r.cls].name}</span> <span class="muted">Robot LV ${r.level}</span></div><div class="pr"><small>POWER</small><b>${powerRating(fs)}</b></div></div>
          ${this.miniStats(fs)}
        </div>
        ${next ? `<div class="panel nextfight"><div class="eyebrow">Next career fight · ${esc(lg.name)}</div><div class="nf"><div><h3>${esc(next.name)}</h3><small>${esc(next.handler)} · ${CLASSES[next.cls].name} · ${PERSONALITY_LABEL[next.pers]}</small></div><button class="btn primary" data-act="pre" data-arg="${next.id}">Fight</button></div></div>` : `<div class="panel nextfight"><div class="eyebrow">Career</div><p>${p.career.belts.includes(4) ? 'You are the World Champion. Defend your title in tournaments and challenges.' : 'Beat four league opponents to unlock the league boss.'}</p></div>`}
        <div class="panel"><div class="eyebrow">Daily challenges · resets at midnight</div>${daily}</div>
      </section>
    </div>`;
  }

  private miniStats(fs: FighterStats) {
    const rows: [string, number, number, string][] = [
      ['Health', fs.maxHp, 2600, fmt(fs.maxHp)], ['Armor', fs.dr, 0.6, Math.round(fs.dr * 100) + '%'], ['Power', fs.dmgMult, 2.2, '×' + fs.dmgMult.toFixed(2)],
      ['Speed', fs.atkSpeed, 1.6, '×' + fs.atkSpeed.toFixed(2)], ['Mobility', fs.moveMult, 1.6, '×' + fs.moveMult.toFixed(2)], ['Stamina', fs.staminaMax, 220, fmt(fs.staminaMax)],
      ['Cooling', fs.heatDiss, 40, fs.heatDiss.toFixed(1) + '/s'], ['Crit', fs.crit, 0.4, Math.round(fs.crit * 100) + '%'],
    ];
    return `<div class="ministats">${rows.map(([n, v, max, t]) => `<div class="ms"><span>${n}</span><div class="bar"><i style="width:${Math.min(100, v / max * 100)}%"></i></div><b>${t}</b></div>`).join('')}</div>`;
  }

  /* ---------------- career ---------------- */
  private rCareer() {
    const p = this.p; const L = this.sel.league;
    const tabs = LEAGUES.map((l, i) => { const unlocked = i <= p.career.league; return `<button class="tab ${L === i ? 'on' : ''} ${unlocked ? '' : 'lock'}" data-act="league" data-arg="${i}" style="--c:${l.color}">${l.short}${p.career.belts.includes(i) ? ' ★' : ''}</button>`; }).join('');
    const lg = LEAGUES[L]; const unlocked = L <= p.career.league; const prog = leagueProgress(p, L);
    let body: string;
    if (!unlocked) body = `<div class="panel locked"><h3>${esc(lg.name)}</h3><p>Win the ${esc(LEAGUES[L - 1].belt)} to unlock this league.</p></div>`;
    else {
      const opps = leagueOpponents(L).map(o => this.oppCard(o, p.career.beaten.includes(o.id), true)).join('');
      const boss = prog.boss;
      const bossCard = `<div class="oppcard boss ${prog.bossUnlocked ? '' : 'lock'} ${prog.bossBeaten ? 'beaten' : ''}">
        <div class="oc-main"><div class="eyebrow">TITLE FIGHT · ${esc(boss.boss!.title)}</div><h3>${esc(boss.name)}</h3><small>${esc(boss.handler)} · ${CLASSES[boss.cls].name} · ${boss.boss!.phases} combat phases</small><p>${esc(boss.bio)}</p></div>
        <div class="oc-side">${prog.bossBeaten ? '<span class="belt">★ ' + esc(lg.belt) + '</span>' : ''}<small>Purse ¢${fmt(contractFor(boss.id).purse)}</small>${prog.bossUnlocked ? `<button class="btn ${prog.bossBeaten ? '' : 'primary'}" data-act="pre" data-arg="${boss.id}">${prog.bossBeaten ? 'Rematch' : 'Challenge'}</button>` : `<span class="muted">Beat ${4 - Math.min(4, prog.beaten)} more</span>`}</div>
      </div>`;
      const chs = CHALLENGES.filter(c => c.league === L).map(c => `<div class="oppcard challenge ${p.challengesDone.includes(c.id) ? 'beaten' : ''}"><div class="oc-main"><div class="eyebrow">SPECIAL CHALLENGE</div><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p><small>vs ${esc(OPP_BY_ID[c.opp].name)} · prize ¢${fmt(c.reward.credits)} + <span style="color:${rc(c.reward.rarity)}">${RARITIES[c.reward.rarity].name}</span> part</small></div><div class="oc-side">${p.challengesDone.includes(c.id) ? '<span class="ok">✓ Done</span>' : ''}<button class="btn" data-act="challenge" data-arg="${c.id}">${p.challengesDone.includes(c.id) ? 'Replay' : 'Take it'}</button></div></div>`).join('');
      body = `<div class="league-head panel" style="--c:${lg.color}"><div><h2>${esc(lg.name)}</h2><small>Arena: ${esc(ARENA_INFO[lg.arena as ArenaId].name)} · ${prog.beaten}/${prog.total} contracts won</small></div><div class="bar big"><i style="width:${prog.beaten / prog.total * 100}%"></i></div></div>
        <div class="opplist">${opps}</div>${bossCard}${chs ? `<h3 class="sech">Special challenges</h3><div class="opplist">${chs}</div>` : ''}`;
    }
    return `${this.topbar('Career')}<div class="content scroll"><div class="tabs">${tabs}</div>${body}</div>`;
  }

  private oppCard(o: Opponent, beaten: boolean, contract: boolean) {
    const fs = opponentStats(o); const c = contractFor(o.id);
    return `<div class="oppcard ${beaten ? 'beaten' : ''} ${o.rival ? 'rival' : ''}">
      <div class="oc-main"><div class="eyebrow">${o.rival ? 'RIVAL · ' : ''}${CLASSES[o.cls].name} · ${PERSONALITY_LABEL[o.pers]}</div><h3>${esc(o.name)}</h3><small>${esc(o.handler)} · Power ${powerRating(fs)}</small>${contract ? `<small class="bonus">Bonus: ${esc(c.bonus.text)}</small>` : ''}</div>
      <div class="oc-side">${beaten ? '<span class="ok">✓ Won</span>' : ''}<small>¢${fmt(c.purse)}</small><button class="btn ${beaten ? '' : 'primary'}" data-act="pre" data-arg="${o.id}">${beaten ? 'Rematch' : 'Fight'}</button></div>
    </div>`;
  }

  /* ---------------- pre-fight ---------------- */
  private openPre(o: Opponent, kind: FightContext['kind'], back: Screen, extra: Partial<PreFight> = {}) {
    const lg = o.league; const c = contractFor(o.id);
    this.pre = { opp: o, arena: (extra.arena || LEAGUES[lg].arena) as ArenaId, ctx: { kind, league: lg, oppId: o.id, bonus: kind === 'career' || kind === 'boss' || kind === 'rival' ? c.bonus : undefined, ...(extra.ctx || {}) }, mods: extra.mods || {}, title: extra.title || (o.boss ? 'Title Fight' : 'Fight Contract'), back };
    this.show('prefight');
  }
  private rPrefight() {
    const pf = this.pre!; const o = pf.opp; const p = this.p; const r = this.robot;
    const a = robotStats(r, p.parts), b = opponentStats(o);
    const row = (n: string, x: number, y: number, f: (v: number) => string, higher = true) => { const better = higher ? x >= y : x <= y; return `<div class="tt-row"><b class="${better ? 'win' : ''}">${f(x)}</b><span>${n}</span><b class="${!better ? 'win' : ''}">${f(y)}</b></div>`; };
    const ai = ARENA_INFO[pf.arena];
    const purse = pf.ctx.kind === 'quick' ? LEAGUES[o.league].purse * 0.6 : pf.ctx.kind === 'tournament' ? 0 : contractFor(o.id).purse;
    const warn = robotItems(r, p.parts); const worn = Object.values(warn).filter(it => it && it.cond < 50).length;
    return `${this.topbar(pf.title, pf.back)}<div class="content scroll">
      <div class="tape panel">
        <div class="tt-side me"><div class="eyebrow">YOU</div><h2>${esc(r.name)}</h2><small>${CLASSES[r.cls].name} · LV ${r.level}</small></div>
        <div class="tt-vs">VS</div>
        <div class="tt-side them"><div class="eyebrow">${o.rival ? 'RIVAL' : o.boss ? 'CHAMPION' : 'OPPONENT'}</div><h2>${esc(o.name)}</h2><small>${CLASSES[o.cls].name} · ${esc(o.handler)}</small></div>
      </div>
      <div class="panel tt">
        ${row('Power rating', powerRating(a), powerRating(b), v => String(v))}
        ${row('Health', a.maxHp, b.maxHp, fmt)}
        ${row('Armor', a.dr, b.dr, v => Math.round(v * 100) + '%')}
        ${row('Attack power', a.dmgMult, b.dmgMult, v => '×' + v.toFixed(2))}
        ${row('Attack speed', a.atkSpeed, b.atkSpeed, v => '×' + v.toFixed(2))}
        ${row('Mobility', a.moveMult, b.moveMult, v => '×' + v.toFixed(2))}
        ${row('Weight', a.weight, b.weight, v => fmt(v) + ' kg', false)}
      </div>
      <div class="panel"><p class="bio">${esc(o.bio)}</p><small>Style: ${PERSONALITY_LABEL[o.pers]}${o.boss ? ` · Signature: ${o.boss.sig.map(s => MOVES[s].name).join(', ')}` : ''}</small></div>
      <div class="panel"><div class="eyebrow">ARENA</div><b>${esc(ai.name)}</b><p class="muted">${esc(ai.desc)} ${esc(ai.hazard)}</p>
        ${Object.keys(pf.mods).length ? `<div class="eyebrow">RULES</div><p>${esc(CHALLENGES.find(c => c.id === pf.ctx.challengeId)?.desc || '')}</p>` : ''}
        ${purse ? `<div class="eyebrow">PURSE</div><b>¢${fmt(purse)}</b>${pf.ctx.bonus ? `<span class="muted"> · Bonus: ${esc(pf.ctx.bonus.text)}</span>` : ''}` : ''}
        ${worn ? `<p class="warnline">${worn} of your parts are below 50% condition and fight weaker. Repair them in the Garage.</p>` : ''}</div>
      <div class="actions"><button class="btn" data-act="go" data-arg="garage">Garage</button><button class="btn primary xl" data-act="fight">FIGHT</button></div>
    </div>`;
  }

  /* ---------------- quick fight ---------------- */
  private rQuick() {
    const p = this.p;
    const avail = OPPONENTS.filter(o => o.league <= p.career.league && (!o.boss || p.career.beaten.includes(o.id)));
    if (!this.sel.quickOpp || !avail.find(o => o.id === this.sel.quickOpp)) this.sel.quickOpp = avail[0].id;
    const arenas = (Object.keys(ARENA_INFO) as ArenaId[]).filter((_, i) => i <= p.career.league);
    return `${this.topbar('Quick Fight')}<div class="content scroll">
      <div class="panel"><div class="eyebrow">Opponent</div><div class="pickgrid">${avail.map(o => `<button class="pick ${this.sel.quickOpp === o.id ? 'on' : ''}" data-act="qopp" data-arg="${o.id}"><b>${esc(o.name)}</b><small>${LEAGUES[o.league].short} · ${CLASSES[o.cls].name}</small></button>`).join('')}</div></div>
      <div class="panel"><div class="eyebrow">Arena</div><div class="pickgrid">${arenas.map(a => `<button class="pick ${this.sel.quickArena === a ? 'on' : ''}" data-act="qarena" data-arg="${a}"><b>${esc(ARENA_INFO[a].name)}</b><small>${esc(ARENA_INFO[a].hazard)}</small></button>`).join('')}</div></div>
      <div class="actions"><button class="btn primary xl" data-act="quickgo">Continue</button></div>
      <p class="muted">Quick fights pay 60% of a contract purse and still earn XP and part drops.</p>
    </div>`;
  }

  /* ---------------- tournament ---------------- */
  private rTournament() {
    const p = this.p; const t = p.tournament;
    if (!t) {
      const tiers = LEAGUES.map((l, i) => { const ok = i <= p.career.league; const won = p.trophies.includes(i);
        return `<div class="oppcard ${ok ? '' : 'lock'}"><div class="oc-main"><div class="eyebrow">${won ? '🏆 WON BEFORE' : 'TOURNAMENT'}</div><h3>${esc(l.short)} Cup</h3><small>8 robots · 3 knockout rounds · 2 rounds per fight · ${esc(ARENA_INFO[l.arena as ArenaId].name)}</small></div>
        <div class="oc-side"><small>Entry ¢${fmt(tournamentEntry(i))}</small><small>Prize ¢${fmt(tournamentPrize(i))} + ${RARITIES[Math.min(5, i + 1) as Rarity].name} part</small>${ok ? `<button class="btn primary" data-act="tjoin" data-arg="${i}">Enter</button>` : '<span class="muted">Locked</span>'}</div></div>`; }).join('');
      return `${this.topbar('Tournament')}<div class="content scroll"><p class="muted">Win three straight fights to take the cup. One loss and you are out.</p><div class="opplist">${tiers}</div></div>`;
    }
    const name = (id: string) => id === 'player' ? esc(this.robot.name) : esc(OPP_BY_ID[id].name);
    // rebuild rounds from results
    const rounds: { a: string; b: string; w?: string }[][] = [];
    let alive = t.bracket.slice(); let ri = 0; let resIdx = 0;
    while (alive.length > 1 && ri < 3) {
      const pairs = roundPairs(alive); const row: { a: string; b: string; w?: string }[] = []; const next: string[] = [];
      for (const [a, b] of pairs) { const r = t.results[resIdx]; if (r && r.a === a && r.b === b) { row.push({ a, b, w: r.w }); next.push(r.w); resIdx++; } else row.push({ a, b }); }
      rounds.push(row); if (next.length < pairs.length) break; alive = next; ri++;
    }
    const opp = playerOpponentInRound(p);
    const champion = t.alive.length === 1 && t.alive[0] === 'player';
    const out = !t.alive.includes('player');
    return `${this.topbar(`${LEAGUES[t.tier].short} Cup`)}<div class="content scroll">
      <div class="bracket">${rounds.map((row, i) => `<div class="bcol"><div class="eyebrow">${ROUND_NAMES[i]}</div>${row.map(m => `<div class="bm"><span class="${m.w === m.a ? 'w' : m.w ? 'l' : ''} ${m.a === 'player' ? 'me' : ''}">${name(m.a)}</span><span class="${m.w === m.b ? 'w' : m.w ? 'l' : ''} ${m.b === 'player' ? 'me' : ''}">${name(m.b)}</span></div>`).join('')}</div>`).join('')}</div>
      <div class="actions">${champion ? `<div class="panel"><h2>🏆 Champion!</h2><p>The ${esc(LEAGUES[t.tier].short)} Cup is yours.</p></div><button class="btn primary" data-act="tclear">Done</button>` : out ? `<div class="panel"><h2>Eliminated</h2><p>Better luck next time.</p></div><button class="btn primary" data-act="tclear">Leave tournament</button>` : opp ? `<button class="btn danger" data-act="tquit">Withdraw</button><button class="btn primary xl" data-act="tfight">Fight ${ROUND_NAMES[t.round]}: ${esc(OPP_BY_ID[opp].name)}</button>` : ''}</div>
    </div>`;
  }

  /* ---------------- garage ---------------- */
  private rGarage() {
    const p = this.p, r = this.robot; const fs = robotStats(r, p.parts);
    const tabs = (['parts', 'paint', 'skills', 'builds'] as const).map(t => `<button class="tab ${this.sel.tab === t ? 'on' : ''}" data-act="gtab" data-arg="${t}">${t === 'skills' && skillPointsLeft(r) > 0 ? `Skills (${skillPointsLeft(r)})` : t[0].toUpperCase() + t.slice(1)}</button>`).join('');
    let inner = '';
    if (this.sel.tab === 'parts') inner = this.gParts();
    if (this.sel.tab === 'paint') inner = this.gPaint();
    if (this.sel.tab === 'skills') inner = this.gSkills();
    if (this.sel.tab === 'builds') inner = this.gBuilds();
    return `${this.topbar('Garage')}<div class="garage">
      <div class="g-head"><div><h2>${esc(r.name)}</h2><span class="cls" style="--c:${CLASSES[r.cls].color}">${CLASSES[r.cls].name}</span> <span class="muted">LV ${r.level} · ${fmt(r.xp)}/${fmt(xpForRobot(r.level))} XP · Build ${r.activeBuild + 1}</span></div><div class="pr"><small>POWER</small><b>${powerRating(fs)}</b></div></div>
      <div class="tabs">${tabs}</div>
      ${inner}
    </div>`;
  }

  private gParts() {
    const p = this.p, r = this.robot; const items = robotItems(r, p.parts);
    const slots = SLOTS.map(s => { const it = items[s.id]; const d = it ? PART_BY_ID[it.def] : null;
      return `<button class="slot ${this.sel.slot === s.id ? 'on' : ''}" data-act="slot" data-arg="${s.id}"><small>${s.name}</small><b style="color:${it ? rc(it.rarity) : '#667'}">${d ? esc(d.name) : 'Empty'}</b>${it ? `<span class="lv">Lv${it.level}</span><span class="cond ${it.cond < 50 ? 'bad' : ''}" style="--w:${it.cond}%"></span>` : ''}</button>`; }).join('');
    const cat = slotCat(this.sel.slot); const eq = items[this.sel.slot];
    const list = p.parts.filter(it => PART_BY_ID[it.def]?.cat === cat).sort((a, b) => (b.uid === eq?.uid ? 1 : 0) - (a.uid === eq?.uid ? 1 : 0) || b.rarity - a.rarity || b.level - a.level);
    if (!this.sel.item || !list.find(i => i.uid === this.sel.item)) this.sel.item = eq?.uid || list[0]?.uid || '';
    const cards = list.map(it => this.partCard(it, eq, it.uid === eq?.uid)).join('') || `<p class="muted">No parts for this slot. Buy some in the Shop.</p>`;
    const sel = list.find(i => i.uid === this.sel.item);
    return `<div class="g-body">
      <div class="slotlist">${slots}</div>
      <div class="inv">
        <div class="inv-list">${cards}</div>
        ${sel ? this.partDetail(sel, eq) : ''}
      </div>
    </div>`;
  }

  private partCard(it: PartItem, eq: PartItem | undefined, equipped: boolean) {
    const d = PART_BY_ID[it.def]; const a = partStats(it, this.robot.cls); const b = eq ? partStats(eq, this.robot.cls) : null;
    const deltas = STAT_KEYS.map(k => ({ k, d: a[k] - (b ? b[k] : 0) })).filter(x => Math.abs(x.d) >= 0.5).sort((x, y) => Math.abs(y.d) - Math.abs(x.d)).slice(0, 3);
    return `<button class="pcard ${this.sel.item === it.uid ? 'on' : ''} ${equipped ? 'eq' : ''}" data-act="item" data-arg="${it.uid}" style="--rc:${rc(it.rarity)}">
      <div class="pc-top"><b>${esc(d.name)}</b>${equipped ? '<em>EQUIPPED</em>' : ''}</div>
      <small><span style="color:${rc(it.rarity)}">${RARITIES[it.rarity].name}</span> · Lv ${it.level}${d.cls ? ` · ${CLASSES[d.cls].name}` : ''}</small>
      ${!equipped && deltas.length ? `<div class="deltas">${deltas.map(x => { const good = LOWER_BETTER.includes(x.k) ? x.d < 0 : x.d > 0; return `<span class="${good ? 'up' : 'dn'}">${x.d > 0 ? '+' : ''}${Math.round(x.d)} ${STAT_LABEL[x.k]}</span>`; }).join('')}</div>` : ''}
      <span class="cond ${it.cond < 50 ? 'bad' : ''}" style="--w:${it.cond}%"></span>
    </button>`;
  }

  private partDetail(it: PartItem, eq: PartItem | undefined) {
    const p = this.p; const d = PART_BY_ID[it.def]; const cls = this.robot.cls;
    const a = partStats(it, cls), b = eq ? partStats(eq, cls) : null;
    const equipped = eq?.uid === it.uid;
    const rows = STAT_KEYS.filter(k => Math.abs(a[k]) >= 0.5 || (b && Math.abs(b[k]) >= 0.5)).map(k => {
      const dv = a[k] - (b ? b[k] : 0); const good = LOWER_BETTER.includes(k) ? dv < 0 : dv > 0;
      return `<div class="st-row"><span>${STAT_LABEL[k]}</span><b>${Math.round(a[k])}</b>${!equipped && Math.abs(dv) >= 0.5 ? `<em class="${good ? 'up' : 'dn'}">${dv > 0 ? '+' : ''}${Math.round(dv)}</em>` : '<em></em>'}</div>`;
    }).join('');
    // power rating change if equipped
    let prDelta = '';
    if (!equipped) {
      const r = this.robot; const items = robotItems(r, p.parts); const cur = robotStats(r, p.parts);
      const test = { ...items, [this.sel.slot]: it };
      const fs = derive(sumStats(Object.values(test), cls), cls, r.skills);
      const dpr = powerRating(fs) - powerRating(cur);
      prDelta = `<span class="${dpr >= 0 ? 'up' : 'dn'}">${dpr >= 0 ? '+' : ''}${dpr} power</span>`;
    }
    const up = upgradeInfo(it); const rep = it.cond < 100 ? repairCost(d, it.rarity, it.cond) : 0;
    const inUse = partInUse(p, it.uid);
    const optional = ['plating', 'hydraulics', 'cooling', 'weapon'].includes(this.sel.slot);
    const sv = salvage(it);
    const weaponMove = d.cat === 'weapon' ? MOVES[WEAPON_MOVE[d.style]] : null;
    return `<div class="pdetail" style="--rc:${rc(it.rarity)}">
      <div class="pd-head"><b>${esc(d.name)}</b><small><span style="color:${rc(it.rarity)}">${RARITIES[it.rarity].name}</span> · Level ${it.level}/${MAX_PART_LEVEL} · Condition ${it.cond}%</small></div>
      <p class="muted">${esc(d.desc)}${d.cls ? ` ${CLASSES[d.cls].name} affinity: +8% when used by a ${CLASSES[d.cls].name}.` : ''}${weaponMove ? ` Cooldown ${weaponMove.cd}s.` : ''}</p>
      <div class="st-grid">${rows}</div>
      <div class="pd-actions">
        ${equipped ? (optional ? `<button class="btn sm" data-act="unequip">Unequip</button>` : '<span class="muted">Equipped</span>') : `<button class="btn sm primary" data-act="equip" data-arg="${it.uid}">Equip ${prDelta}</button>`}
        ${up ? `<button class="btn sm" data-act="upgrade" data-arg="${it.uid}" ${p.credits >= up.credits && p.mats[up.mat] >= up.n ? '' : 'disabled'}>Upgrade · ¢${fmt(up.credits)} + ${up.n} ${MAT_LABEL[up.mat]}</button>` : '<span class="muted">Max level</span>'}
        ${rep ? `<button class="btn sm" data-act="repair" data-arg="${it.uid}" ${p.credits >= rep ? '' : 'disabled'}>Repair · ¢${fmt(rep)}</button>` : ''}
        ${inUse ? '' : `<button class="btn sm" data-act="sell" data-arg="${it.uid}">Sell · ¢${fmt(sellPrice(d, it.rarity, it.level))}</button><button class="btn sm" data-act="salvage" data-arg="${it.uid}">Scrap · +${sv.n} ${MAT_LABEL[sv.mat]}</button>`}
      </div>
    </div>`;
  }

  private gPaint() {
    const r = this.robot;
    const sw = (key: string, cur: string, list: string[]) => `<div class="swatches">${list.map(c => `<button class="sw ${c.toLowerCase() === cur.toLowerCase() ? 'on' : ''}" style="background:${c}" data-act="paint" data-arg="${key}|${c}" aria-label="${c}"></button>`).join('')}<label class="sw custom" title="Custom color"><input type="color" data-paint="${key}" value="${cur}"></label></div>`;
    const slotOpts = `<option value="all">All plating (main color)</option>${SLOTS.filter(s => !['core', 'hydraulics', 'cooling'].includes(s.id)).map(s => `<option value="${s.id}" ${this.sel.paintSlot === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}`;
    const curMain = this.sel.paintSlot === 'all' ? r.paint.primary : (r.slotPaint[this.sel.paintSlot] || r.paint.primary);
    return `<div class="g-body single"><div class="content scroll paintpanel">
      <div class="panel"><div class="eyebrow">Main paint</div><label class="selrow">Apply to <select data-sel="paintSlot">${slotOpts}</select></label>${sw('primary', curMain, PALETTE)}
        ${this.sel.paintSlot !== 'all' && r.slotPaint[this.sel.paintSlot] ? `<button class="btn sm" data-act="clearSlotPaint">Use main color on this part</button>` : ''}</div>
      <div class="panel"><div class="eyebrow">Frame color</div>${sw('secondary', r.paint.secondary, PALETTE)}</div>
      <div class="panel"><div class="eyebrow">Accent trim</div>${sw('accent', r.paint.accent, PALETTE)}</div>
      <div class="panel"><div class="eyebrow">Eyes & LEDs</div>${sw('glow', r.paint.glow, GLOWS)}</div>
      <div class="panel"><div class="eyebrow">Chest decal</div><div class="pickgrid">${DECAL_NAMES.map((n, i) => `<button class="pick ${r.decal === i ? 'on' : ''}" data-act="decal" data-arg="${i}"><b>${n}</b></button>`).join('')}</div></div>
      <button class="btn sm" data-act="resetPaint">Restore ${CLASSES[r.cls].name} factory colors</button>
    </div></div>`;
  }

  private gSkills() {
    const r = this.robot; const c = CLASSES[r.cls]; const pts = skillPointsLeft(r);
    const tiers = [1, 2, 3].map(t => `<div class="tier"><div class="eyebrow">Tier ${t}${t > 1 ? ' · needs the skill above' : ''}</div>${c.skills.filter(s => s.tier === t).map(s => {
      const rank = r.skills[s.id] || 0; const reqOk = !s.req || (r.skills[s.req] || 0) > 0; const can = pts > 0 && rank < s.max && reqOk;
      return `<div class="skill ${rank ? 'has' : ''} ${reqOk ? '' : 'lock'}"><div><b>${esc(s.name)}</b><p>${esc(s.desc)}</p><div class="pips">${Array.from({ length: s.max }, (_, i) => `<i class="${i < rank ? 'on' : ''}"></i>`).join('')}</div></div><button class="btn sm ${can ? 'primary' : ''}" data-act="skill" data-arg="${s.id}" ${can ? '' : 'disabled'}>+</button></div>`;
    }).join('')}</div>`).join('');
    const abil = [c.abilityA, c.abilityB].map((id, i) => `<li><b>${i + 1}. ${esc(MOVES[id].name)}</b>${i === 1 && !robotStats(r, this.p.parts).abilityB ? ' <span class="muted">(unlock in tier 2)</span>' : ''}</li>`).join('');
    return `<div class="g-body single"><div class="content scroll">
      <div class="panel"><div class="eyebrow">${c.name} · ${esc(c.tag)}</div><p>${esc(c.desc)}</p><ul class="ablist">${abil}<li><b>3.</b> Weapon mount ability</li><li><b>4. Coolant Purge</b></li><li><b>Q. ${esc(MOVES[c.special].name)}</b> (special)</li></ul></div>
      <div class="panel"><b>${pts}</b> skill point${pts === 1 ? '' : 's'} available · Robot level ${r.level}/${MAX_ROBOT_LEVEL} (1 point per level)
        ${Object.keys(r.skills).length ? `<button class="btn sm" data-act="respec">Reset skills · ¢500</button>` : ''}</div>
      <div class="skilltree">${tiers}</div>
    </div></div>`;
  }

  private gBuilds() {
    const r = this.robot; const p = this.p;
    const builds = r.builds.map((b, i) => {
      const items = SLOTS.map(s => b[s.id]).filter(Boolean).map(uid => p.parts.find(x => x.uid === uid)).filter(Boolean) as PartItem[];
      const fs = derive(sumStats(items, r.cls), r.cls, r.skills);
      return `<div class="oppcard ${r.activeBuild === i ? 'beaten' : ''}"><div class="oc-main"><div class="eyebrow">BUILD ${i + 1}${r.activeBuild === i ? ' · ACTIVE' : ''}</div><h3>Power ${powerRating(fs)}</h3><small>${items.length} parts · ${fmt(fs.maxHp)} HP · ×${fs.dmgMult.toFixed(2)} power · ×${fs.moveMult.toFixed(2)} mobility</small></div>
      <div class="oc-side">${r.activeBuild === i ? '' : `<button class="btn sm primary" data-act="build" data-arg="${i}">Use</button><button class="btn sm" data-act="copybuild" data-arg="${i}">Copy active here</button>`}</div></div>`;
    }).join('');
    return `<div class="g-body single"><div class="content scroll">
      <div class="panel"><div class="eyebrow">Robot name</div><input class="textin" data-name="robot" maxlength="16" value="${esc(r.name)}"></div>
      <p class="muted">Each robot keeps three builds. Swap between a fast build and a heavy build before a fight.</p>
      <div class="opplist">${builds}</div>
    </div></div>`;
  }

  /* ---------------- shop ---------------- */
  private rShop() {
    const p = this.p; const stock = shopStock(p);
    const cards = stock.map(s => {
      const bought = p.shop.bought.includes(s.key);
      if (s.kind === 'part') { const d = PART_BY_ID[s.def!]; const st = partStats({ def: d.id, rarity: s.rarity!, level: 1, cond: 100 }, this.robot.cls);
        const top = STAT_KEYS.filter(k => st[k] > 0 && !LOWER_BETTER.includes(k)).sort((a, b) => st[b] - st[a]).slice(0, 3);
        return `<div class="pcard shop ${bought ? 'sold' : ''}" style="--rc:${rc(s.rarity!)}"><div class="pc-top"><b>${esc(d.name)}</b><em>${SLOTS.find(x => x.cat === d.cat)!.name.replace('Left ', '')}</em></div><small><span style="color:${rc(s.rarity!)}">${RARITIES[s.rarity!].name}</span>${d.cls ? ' · ' + CLASSES[d.cls].name : ''}</small><div class="deltas">${top.map(k => `<span class="up">${Math.round(st[k])} ${STAT_LABEL[k]}</span>`).join('')}</div><button class="btn sm ${bought ? '' : 'primary'}" data-act="buy" data-arg="${s.key}" ${bought || p.credits < s.price ? 'disabled' : ''}>${bought ? 'Sold' : '¢' + fmt(s.price)}</button></div>`; }
      return `<div class="pcard shop ${bought ? 'sold' : ''}" style="--rc:${MAT_COLOR[s.mat!]}"><div class="pc-top"><b>${s.qty} × ${MAT_LABEL[s.mat!]}</b></div><small>Upgrade material</small><button class="btn sm ${bought ? '' : 'primary'}" data-act="buy" data-arg="${s.key}" ${bought || p.credits < s.price ? 'disabled' : ''}>${bought ? 'Sold' : '¢' + fmt(s.price)}</button></div>`;
    }).join('');
    const left = Math.max(0, 3 - p.shop.refreshAt);
    return `${this.topbar('Shop')}<div class="content scroll">
      <div class="panel shophead"><div><b>Parts dealer</b><p class="muted">New stock every 3 fights (${left} to go). Better rarities appear as you level up.</p></div><button class="btn" data-act="refreshShop" ${p.credits >= SHOP_REFRESH_COST ? '' : 'disabled'}>Restock now · ¢${SHOP_REFRESH_COST}</button></div>
      <div class="shopgrid">${cards}</div>
      <p class="muted">Sell or scrap parts you no longer need from the Garage.</p>
    </div>`;
  }

  /* ---------------- collection ---------------- */
  private rCollection() {
    const p = this.p;
    const tabs = `<div class="tabs"><button class="tab ${this.sel.collTab === 'robots' ? 'on' : ''}" data-act="ctab" data-arg="robots">Robots</button><button class="tab ${this.sel.collTab === 'catalog' ? 'on' : ''}" data-act="ctab" data-arg="catalog">Part catalog</button></div>`;
    if (this.sel.collTab === 'catalog') {
      const owned = new Set(p.parts.map(x => x.def));
      const best = (id: string) => p.parts.filter(x => x.def === id).reduce((m, x) => Math.max(m, x.rarity), -1);
      const cats = [...new Set(PARTS.map(d => d.cat))];
      return `${this.topbar('Robots')}<div class="content scroll">${tabs}<p class="muted">${owned.size} of ${PARTS.length} component designs discovered.</p>${cats.map(c => `<h3 class="sech">${SLOTS.find(s => s.cat === c)!.name.replace('Left ', '')}</h3><div class="pickgrid">${PARTS.filter(d => d.cat === c).map(d => { const b = best(d.id); return `<div class="pick cat ${b >= 0 ? 'on' : 'lock'}"><b>${b >= 0 ? esc(d.name) : '???'}</b><small>${b >= 0 ? `Best: <span style="color:${rc(b as Rarity)}">${RARITIES[b].name}</span>` : `Shop from level ${d.unlock}`}</small></div>`; }).join('')}</div>`).join('')}</div>`;
    }
    const mine = p.robots.map(r => { const fs = robotStats(r, p.parts); return `<div class="oppcard ${r.id === p.activeRobot ? 'beaten' : ''}"><div class="oc-main"><div class="eyebrow">${CLASSES[r.cls].name}${r.id === p.activeRobot ? ' · ACTIVE' : ''}</div><h3>${esc(r.name)}</h3><small>LV ${r.level} · Power ${powerRating(fs)} · ${p.stats.classWins[r.cls] || 0} wins as ${CLASSES[r.cls].name}</small></div><div class="oc-side">${r.id === p.activeRobot ? '' : `<button class="btn sm primary" data-act="activate" data-arg="${r.id}">Make active</button>`}</div></div>`; }).join('');
    const buy = CLASS_IDS.filter(c => !p.robots.some(r => r.cls === c)).map(c => { const d = CLASSES[c]; const ok = p.level >= d.unlock;
      return `<div class="oppcard ${ok ? '' : 'lock'}"><div class="oc-main"><div class="eyebrow" style="color:${d.color}">${d.name.toUpperCase()} FRAME · ${esc(d.tag)}</div><p>${esc(d.desc)}</p><small>Abilities: ${MOVES[d.abilityA].name}, ${MOVES[d.abilityB].name} · Special: ${MOVES[d.special].name}</small></div><div class="oc-side">${ok ? `<button class="btn sm primary" data-act="buyframe" data-arg="${c}" ${p.credits >= d.price ? '' : 'disabled'}>Buy · ¢${fmt(d.price)}</button>` : `<span class="muted">Player level ${d.unlock}</span>`}</div></div>`; }).join('');
    return `${this.topbar('Robots')}<div class="content scroll">${tabs}<div class="opplist">${mine}</div>${buy ? `<h3 class="sech">New robot frames</h3><p class="muted">Each frame comes with a full set of starter parts for its class.</p><div class="opplist">${buy}</div>` : ''}</div>`;
  }

  /* ---------------- stats ---------------- */
  private rStats() {
    const p = this.p; const s = p.stats;
    const tabs = `<div class="tabs"><button class="tab ${this.sel.statsTab === 'career' ? 'on' : ''}" data-act="stab" data-arg="career">Career</button><button class="tab ${this.sel.statsTab === 'rank' ? 'on' : ''}" data-act="stab" data-arg="rank">Rankings</button></div>`;
    if (this.sel.statsTab === 'rank') {
      const rows = leaderboard(p); const me = rows.findIndex(r => r.player);
      return `${this.topbar('Statistics')}<div class="content scroll">${tabs}<div class="panel"><b>World rank #${me + 1}</b> of ${rows.length} · ${fmt(p.rankPts)} ranking points</div><div class="panel board">${rows.map((r, i) => `<div class="brow ${r.player ? 'me' : ''}"><span>#${i + 1}</span><b>${esc(r.name)}</b><small>${LEAGUES[r.league].short}</small><em>${fmt(r.pts)}</em></div>`).join('')}</div></div>`;
    }
    const mins = Math.round(s.playSeconds / 60);
    const items: [string, string][] = [
      ['Fights', fmt(s.fights)], ['Wins', fmt(s.wins)], ['Losses', fmt(s.losses)], ['Win rate', s.fights ? Math.round(s.wins / s.fights * 100) + '%' : '—'],
      ['Knockouts', fmt(s.kos)], ['TKOs', fmt(s.tkos)], ['Decisions', fmt(s.decisions)], ['Finishers', fmt(s.finishers)],
      ['Knockdowns scored', fmt(s.knockdownsDealt)], ['Knockdowns taken', fmt(s.knockdownsTaken)], ['Damage dealt', fmt(s.dmgDealt)], ['Damage taken', fmt(s.dmgTaken)],
      ['Hits landed', fmt(s.hits)], ['Head shots', fmt(s.headHits)], ['Counters', fmt(s.counters)], ['Perfect blocks', fmt(s.perfectBlocks)],
      ['Perfect dodges', fmt(s.perfectDodges)], ['Best combo', fmt(s.bestCombo)], ['Specials landed', fmt(s.specials)], ['Parts found', fmt(s.partsFound)],
      ['Tournaments won', fmt(s.tournamentsWon)], ['Time played', mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`],
    ];
    const belts = LEAGUES.map((l, i) => `<div class="beltc ${p.career.belts.includes(i) ? 'on' : ''}" style="--c:${l.color}"><b>${esc(l.belt)}</b><small>${p.career.belts.includes(i) ? 'Won' : 'Not yet'}</small></div>`).join('');
    const trophies = LEAGUES.map((l, i) => `<div class="beltc ${p.trophies.includes(i) ? 'on' : ''}" style="--c:${l.color}"><b>${esc(l.short)} Cup</b><small>${p.trophies.includes(i) ? 'Won' : '—'}</small></div>`).join('');
    return `${this.topbar('Statistics')}<div class="content scroll">${tabs}<div class="statgrid">${items.map(([k, v]) => `<div class="stat"><small>${k}</small><b>${v}</b></div>`).join('')}</div><h3 class="sech">Championship belts</h3><div class="belts">${belts}</div><h3 class="sech">Tournament trophies</h3><div class="belts">${trophies}</div></div>`;
  }

  /* ---------------- settings ---------------- */
  private rSettings() {
    const s = this.p.settings;
    const sl = (k: string, v: number, label: string, max = 1, step = 0.05) => `<label class="setrow"><span>${label}</span><input type="range" min="0" max="${max}" step="${step}" value="${v}" data-set="${k}"><b>${k === 'sens' ? v.toFixed(2) + '×' : Math.round(v * 100) + '%'}</b></label>`;
    const sel = (k: string, v: string, label: string, opts: [string, string][]) => `<label class="setrow"><span>${label}</span><select data-set="${k}">${opts.map(([a, b]) => `<option value="${a}" ${a === v ? 'selected' : ''}>${b}</option>`).join('')}</select></label>`;
    const tog = (k: string, v: boolean, label: string) => `<label class="setrow"><span>${label}</span><input type="checkbox" data-set="${k}" ${v ? 'checked' : ''}></label>`;
    return `${this.topbar('Settings')}<div class="content scroll">
      <div class="panel"><div class="eyebrow">Audio</div>${sl('master', s.master, 'Master volume')}${sl('music', s.music, 'Music')}${sl('sfx', s.sfx, 'Sound effects')}</div>
      <div class="panel"><div class="eyebrow">Graphics</div>${sel('quality', s.quality, 'Quality', [['low', 'Low (fastest)'], ['medium', 'Medium'], ['high', 'High (bloom, sharp shadows)']])}${tog('shake', s.shake, 'Screen shake')}<p class="muted">Changing quality applies at the next fight. Low is best for older phones.</p></div>
      <div class="panel"><div class="eyebrow">Controls</div>${sel('touch', s.touch, 'Touch controls', [['auto', 'Automatic'], ['on', 'Always on'], ['off', 'Off']])}${sl('sens', s.sens, 'Camera sensitivity', 3, 0.05)}${tog('invertY', s.invertY, 'Invert camera Y')}
        <p class="muted">Desktop: WASD move · Left mouse or J punch · Right mouse or K heavy (hold to charge; push forward for uppercut, sideways for hook, back for low kick) · Shift block · Space dodge · Q special/finisher · E taunt · 1–4 abilities · Esc pause. Click the arena to lock the mouse for camera control.</p></div>
      <div class="panel"><div class="eyebrow">Save data</div><p class="muted">Progress saves automatically in this browser.</p>${(this as any)._confirmReset ? `<p>This erases your robots, parts and career. Are you sure?</p><button class="btn danger" data-act="resetYes">Yes, erase everything</button> <button class="btn" data-act="resetNo">Keep my save</button>` : `<button class="btn danger" data-act="reset">Erase save and start over</button>`}</div>
      <p class="muted">Iron Clash · original robots, arenas and synthesized audio. Multiplayer-ready data model; online play needs a server and is not included.</p>
    </div>`;
  }

  /* ---------------- post-fight ---------------- */
  postFight(res: FightResult, rw: Rewards | null) {
    this.post = { res, rw };
    if (res.ctx.kind === 'tournament' && this.p.tournament) {
      const r = advanceTournament(this.p, res.win);
      if (r.champion) { const t = this.p.tournament!; const prize = tournamentPrize(t.tier); this.p.credits += prize; const part = addPart(this.p, PARTS[Math.floor(Math.random() * PARTS.length)].id, Math.min(5, t.tier + 1) as Rarity); rw?.notes.push(`Tournament champion! +¢${fmt(prize)} and a ${RARITIES[part.rarity].name} ${PART_BY_ID[part.def].name}.`); rw?.parts.push(part); }
      this.save();
    }
    if (rw) { audio.sfx(res.win ? 'coins' : 'click'); }
    this.show('post');
  }
  private rPost() {
    const { res, rw } = this.post!; const ctx = res.ctx;
    if (ctx.kind === 'tutorial') {
      return `<div class="content scroll post"><div class="post-banner win"><h1>TRAINING COMPLETE</h1><p>You know the basics. Time to earn some credits in the Underground.</p></div>${rw ? this.rewardsHtml(rw) : ''}<div class="actions"><button class="btn primary xl" data-act="go" data-arg="career">Go to Career</button></div></div>`;
    }
    const opp = OPP_BY_ID[ctx.oppId];
    const acc = res.attempts ? Math.round(res.hits / res.attempts * 100) : 0;
    const zt = res.zoneTaken;
    return `<div class="content scroll post">
      <div class="post-banner ${res.win ? 'win' : 'lose'}"><h1>${res.win ? 'VICTORY' : 'DEFEAT'}</h1><p>${res.win ? 'Beat' : 'Lost to'} ${esc(opp.name)} by ${res.method === 'Decision' ? 'decision' : res.method === 'Finisher' ? 'finisher' : res.method} in round ${res.rounds}</p>${rw ? `<div class="grade g${rw.grade}">${rw.grade}</div>` : ''}${rw?.belt ? `<div class="beltwin">★ ${esc(rw.belt)} ★</div>` : ''}</div>
      ${rw ? this.rewardsHtml(rw) : ''}
      <div class="panel"><div class="eyebrow">Fight stats</div><div class="statgrid small">
        <div class="stat"><small>Damage dealt</small><b>${fmt(res.dmgDealt)}</b></div><div class="stat"><small>Damage taken</small><b>${fmt(res.dmgTaken)}</b></div>
        <div class="stat"><small>Accuracy</small><b>${acc}%</b></div><div class="stat"><small>Best combo</small><b>${res.bestCombo}</b></div>
        <div class="stat"><small>Counters</small><b>${res.counters}</b></div><div class="stat"><small>Perfect blocks</small><b>${res.perfectBlocks}</b></div>
        <div class="stat"><small>Knockdowns</small><b>${res.knockdownsDealt} – ${res.knockdownsTaken}</b></div><div class="stat"><small>Time</small><b>${Math.floor(res.time / 60)}:${String(Math.floor(res.time % 60)).padStart(2, '0')}</b></div>
      </div><div class="eyebrow">Damage taken by zone</div><div class="zones-post">${(['head', 'torso', 'arms', 'legs'] as const).map(z => `<span>${z}<b>${fmt(zt[z])}</b></span>`).join('')}</div></div>
      <div class="actions">${ctx.kind === 'tournament' ? `<button class="btn primary xl" data-act="go" data-arg="tournament">Back to bracket</button>` : `<button class="btn" data-act="go" data-arg="garage">Garage</button>${!res.win ? `<button class="btn" data-act="pre" data-arg="${opp.id}">Rematch</button>` : ''}<button class="btn primary xl" data-act="go" data-arg="${ctx.kind === 'quick' ? 'quick' : 'career'}">Continue</button>`}</div>
    </div>`;
  }
  private rewardsHtml(rw: Rewards) {
    const mats = (Object.keys(rw.mats) as (keyof Materials)[]).map(k => `<span class="matc" style="--c:${MAT_COLOR[k]}">+${rw.mats[k]} ${MAT_LABEL[k]}</span>`).join('');
    const parts = rw.parts.map(it => `<div class="pcard drop" style="--rc:${rc(it.rarity)}"><small style="color:${rc(it.rarity)}">${RARITIES[it.rarity].name.toUpperCase()}</small><b>${esc(PART_BY_ID[it.def].name)}</b><small>${SLOTS.find(s => s.cat === PART_BY_ID[it.def].cat)!.name.replace('Left ', '')}</small></div>`).join('');
    return `<div class="panel rewards"><div class="eyebrow">Rewards</div><div class="rw-row"><span class="big">¢${fmt(rw.credits)}</span><span>+${fmt(rw.xp)} XP</span><span>+${fmt(rw.robotXp)} robot XP</span>${rw.rank ? `<span>${rw.rank > 0 ? '+' : ''}${rw.rank} rank</span>` : ''}</div>${mats ? `<div class="rw-row">${mats}</div>` : ''}${parts ? `<div class="eyebrow">Components earned</div><div class="drops">${parts}</div>` : ''}${rw.notes.map(n => `<p class="note">${esc(n)}</p>`).join('')}</div>`;
  }

  /* ---------------- events ---------------- */
  private onClick(e: Event) {
    const el = (e.target as HTMLElement).closest('[data-act]') as HTMLElement | null;
    if (!el || (el as HTMLButtonElement).disabled) return;
    const act = el.dataset.act!, arg = el.dataset.arg || '';
    audio.unlock(); audio.sfx('click');
    const p = this.p, r = this.robot;
    switch (act) {
      case 'start': audio.music('menu'); if (!p.tutorialDone) { this.modal(`<h2>Welcome to Iron Clash</h2><p>You are a rookie robot owner with one boxer frame and a garage full of spare parts. Start with a quick training session to learn to fight.</p><div class="actions"><button class="btn" data-mact="skip">Skip</button><button class="btn primary" data-mact="train">Start training</button></div>`, a => { if (a === 'train') this.startTutorial(); else { p.tutorialDone = true; this.save(); this.show('hub'); } }); } else this.show('hub'); break;
      case 'go': if (arg === 'career') this.sel.league = Math.min(this.sel.league, p.career.league) || p.career.league; this.show(arg as Screen); break;
      case 'tutorial': this.startTutorial(); break;
      case 'league': if (Number(arg) <= p.career.league) { this.sel.league = Number(arg); this.rerender(); } else this.toast('Win the previous belt first', 'bad'); break;
      case 'pre': { const o = OPP_BY_ID[arg]; this.openPre(o, o.boss ? 'boss' : o.rival ? 'rival' : 'career', 'career'); break; }
      case 'challenge': { const c = CHALLENGES.find(x => x.id === arg)!; const o = OPP_BY_ID[c.opp]; this.openPre(o, 'challenge', 'career', { mods: c.mods, ctx: { kind: 'challenge', league: c.league, oppId: o.id, challengeId: c.id }, title: c.name, arena: LEAGUES[c.league].arena as ArenaId }); break; }
      case 'fight': { const pf = this.pre!; this.g.startFight(pf.ctx, pf.opp, pf.arena, pf.mods, pf.ctx.kind === 'tournament' ? { rounds: 2 } : {}); break; }
      case 'qopp': this.sel.quickOpp = arg; this.rerender(); break;
      case 'qarena': this.sel.quickArena = arg as ArenaId; this.rerender(); break;
      case 'quickgo': { const o = OPP_BY_ID[this.sel.quickOpp]; this.openPre(o, 'quick', 'quick', { arena: this.sel.quickArena, title: 'Quick Fight' }); break; }
      case 'tjoin': { const t = Number(arg); const fee = tournamentEntry(t); if (p.credits < fee) { this.toast('Not enough credits', 'bad'); break; } p.credits -= fee; newTournament(p, t); this.save(); this.rerender(); break; }
      case 'tfight': { const opp = playerOpponentInRound(p); if (!opp) break; const o = OPP_BY_ID[opp]; const t = p.tournament!; this.openPre(o, 'tournament', 'tournament', { arena: LEAGUES[t.tier].arena as ArenaId, title: `${LEAGUES[t.tier].short} Cup · ${ROUND_NAMES[t.round]}`, ctx: { kind: 'tournament', league: t.tier, oppId: o.id } }); break; }
      case 'tquit': p.tournament = null; this.save(); this.rerender(); break;
      case 'tclear': p.tournament = null; this.save(); this.rerender(); break;
      case 'gtab': this.sel.tab = arg as any; this.rerender(); break;
      case 'slot': this.sel.slot = arg as SlotId; this.sel.item = ''; this.rerender(); break;
      case 'item': this.sel.item = arg; this.rerender(); break;
      case 'equip': { r.builds[r.activeBuild][this.sel.slot] = arg; audio.sfx('equip'); this.afterBuildChange(); break; }
      case 'unequip': { delete r.builds[r.activeBuild][this.sel.slot]; this.afterBuildChange(); break; }
      case 'upgrade': { const it = p.parts.find(x => x.uid === arg)!; const up = upgradeInfo(it); if (!up) break; if (p.credits < up.credits || p.mats[up.mat] < up.n) { this.toast('Not enough credits or materials', 'bad'); break; } p.credits -= up.credits; p.mats[up.mat] -= up.n; it.level++; audio.sfx('upgrade'); this.toast(`${PART_BY_ID[it.def].name} upgraded to level ${it.level}`); this.save(); this.rerender(); break; }
      case 'repair': { const it = p.parts.find(x => x.uid === arg)!; const c = repairCost(PART_BY_ID[it.def], it.rarity, it.cond); if (p.credits < c) break; p.credits -= c; it.cond = 100; audio.sfx('equip'); this.save(); this.rerender(); break; }
      case 'sell': case 'salvage': {
        const it = p.parts.find(x => x.uid === arg)!; if (partInUse(p, it.uid)) { this.toast('Unequip it from every build first', 'bad'); break; }
        const d = PART_BY_ID[it.def];
        this.modal(`<h2>${act === 'sell' ? 'Sell' : 'Scrap'} ${esc(d.name)}?</h2><p>${act === 'sell' ? `You get ¢${fmt(sellPrice(d, it.rarity, it.level))}.` : `You get ${salvage(it).n} ${MAT_LABEL[salvage(it).mat]}.`} This cannot be undone.</p><div class="actions"><button class="btn" data-mact="no">Cancel</button><button class="btn danger" data-mact="yes">${act === 'sell' ? 'Sell' : 'Scrap'}</button></div>`, a => {
          if (a !== 'yes') return;
          if (act === 'sell') p.credits += sellPrice(d, it.rarity, it.level); else { const sv = salvage(it); p.mats[sv.mat] += sv.n; }
          p.parts = p.parts.filter(x => x.uid !== it.uid); this.sel.item = ''; audio.sfx('coins'); this.save(); this.rerender();
        });
        break;
      }
      case 'paint': { const [k, c] = arg.split('|'); this.applyPaint(k, c); break; }
      case 'clearSlotPaint': delete r.slotPaint[this.sel.paintSlot as SlotId]; this.afterPaint(); break;
      case 'decal': r.decal = Number(arg); this.afterPaint(); break;
      case 'resetPaint': r.paint = { ...CLASSES[r.cls].frame }; r.slotPaint = {}; this.afterPaint(); break;
      case 'skill': { const node = CLASSES[r.cls].skills.find(s => s.id === arg)!; if (skillPointsLeft(r) <= 0) break; r.skills[arg] = Math.min(node.max, (r.skills[arg] || 0) + 1); audio.sfx('upgrade'); this.save(); this.rerender(); break; }
      case 'respec': if (p.credits < 500) { this.toast('Not enough credits', 'bad'); break; } p.credits -= 500; r.skills = {}; this.save(); this.rerender(); break;
      case 'build': r.activeBuild = Number(arg); this.afterBuildChange(); break;
      case 'copybuild': r.builds[Number(arg)] = { ...r.builds[r.activeBuild] }; this.toast(`Copied into build ${Number(arg) + 1}`); this.save(); this.rerender(); break;
      case 'buy': {
        const s = shopStock(p).find(x => x.key === arg)!; if (p.shop.bought.includes(arg) || p.credits < s.price) break;
        p.credits -= s.price; p.shop.bought.push(arg);
        if (s.kind === 'part') { const it = addPart(p, s.def!, s.rarity!); this.toast(`Bought ${PART_BY_ID[it.def].name}. Equip it in the Garage.`); } else { p.mats[s.mat!] += s.qty!; this.toast(`+${s.qty} ${MAT_LABEL[s.mat!]}`); }
        audio.sfx('coins'); this.save(); this.rerender(); break;
      }
      case 'refreshShop': if (p.credits < SHOP_REFRESH_COST) break; p.credits -= SHOP_REFRESH_COST; this.restock(); this.rerender(); break;
      case 'ctab': this.sel.collTab = arg as any; this.rerender(); break;
      case 'stab': this.sel.statsTab = arg as any; this.rerender(); break;
      case 'activate': p.activeRobot = arg; this.g.refreshGarage(); this.save(); this.rerender(); break;
      case 'buyframe': { const c = arg as ClassId; const d = CLASSES[c]; if (p.credits < d.price || p.level < d.unlock) break; p.credits -= d.price; const nr = addRobot(p, c); p.activeRobot = nr.id; this.g.refreshGarage(); audio.sfx('upgrade'); this.toast(`${d.name} frame added. It is now your active robot.`); this.save(); this.rerender(); break; }
      case 'claimDaily': { const d = p.daily.list[Number(arg)]; if (!d.done || d.claimed) break; const t = DAILY_TEMPLATES.find(x => x.id === d.id)!; d.claimed = true; p.credits += t.reward; p.mats.scrap += 2; audio.sfx('coins'); this.toast(`+¢${t.reward} and 2 Scrap`); this.save(); this.rerender(); break; }
      case 'reset': (this as any)._confirmReset = true; this.rerender(); break;
      case 'resetNo': (this as any)._confirmReset = false; this.rerender(); break;
      case 'resetYes': wipeProfile(); this.g.profile = newProfile(); ensureDaily(this.g.profile); (this as any)._confirmReset = false; this.g.refreshGarage(); this.save(); this.show('title'); break;
    }
  }
  private restock() { const p = this.p; p.shop.seed = (p.shop.seed * 48271 + 7) % 2147483647; p.shop.bought = []; p.shop.refreshAt = 0; this.save(); }
  private afterBuildChange() { this.g.refreshGarage(); this.save(); this.rerender(); }
  private afterPaint() { this.g.refreshGarage(); this.save(); this.rerender(); }
  private applyPaint(k: string, c: string) {
    const r = this.robot;
    if (k === 'primary' && this.sel.paintSlot !== 'all') r.slotPaint[this.sel.paintSlot as SlotId] = c;
    else (r.paint as any)[k] = c;
    this.afterPaint();
  }
  private onInput(e: Event) {
    const t = e.target as HTMLInputElement; const k = t.dataset.set;
    if (k && t.type === 'range') {
      const v = Number(t.value); (this.p.settings as any)[k] = v; const b = t.parentElement!.querySelector('b'); if (b) b.textContent = k === 'sens' ? v.toFixed(2) + '×' : Math.round(v * 100) + '%';
      const s = this.p.settings; audio.setVolumes(s.master, s.music, s.sfx); this.g.input.sens = s.sens; this.save();
    }
  }
  private onChange(e: Event) {
    const t = e.target as HTMLInputElement | HTMLSelectElement;
    if ((t as HTMLInputElement).dataset.paint) { this.applyPaint((t as HTMLInputElement).dataset.paint!, t.value); return; }
    if (t.dataset.sel === 'paintSlot') { this.sel.paintSlot = t.value as any; this.rerender(); return; }
    if ((t as HTMLInputElement).dataset.name === 'robot') { const v = t.value.trim().toUpperCase().slice(0, 16); if (v) { this.robot.name = v; this.save(); this.toast('Robot renamed'); } return; }
    const k = t.dataset.set; if (!k) return;
    const s = this.p.settings as any;
    if (t instanceof HTMLInputElement && t.type === 'checkbox') s[k] = t.checked; else if (t.tagName === 'SELECT') s[k] = t.value;
    this.g.input.invertY = this.p.settings.invertY;
    if (k === 'quality') this.g.applyScaling();
    this.save();
  }

  private startTutorial() {
    this.g.startFight({ kind: 'tutorial', league: 0, oppId: 'dummy' }, DUMMY, 'pit', {}, { tutorial: true, rounds: 1 });
  }

  modal(html: string, cb: (action: string) => void) {
    this.modalEl?.remove();
    const el = this.modalEl = document.createElement('div'); el.className = 'modal';
    el.innerHTML = `<div class="panel">${html}</div>`;
    el.addEventListener('click', ev => { const a = (ev.target as HTMLElement).closest('[data-mact]')?.getAttribute('data-mact'); if (!a) return; el.remove(); this.modalEl = null; audio.sfx('click'); cb(a); });
    this.root.appendChild(el);
  }
}

// keep tree-shaking honest about intentionally unused helpers
export const _uiInternals = { opponentSpec, robotSpec, leagueBoss, StatBlockKeys: STAT_KEYS as (keyof StatBlock)[] };
