// HTML HUD: unit frames, action bar, radar, quest tracker, panels (quests,
// character and bags, vendor, menu), nameplates and floating combat text.

import {
  ABILITIES, BAG_SIZE, CLASSES, ENEMIES, RESOURCES, SLOTS, SLOT_NAMES, STAT_NAMES, VENDOR, itemScore, questById, rarityById,
} from '../shared/data.js';

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SLOT_ICONS = { head: '⛑', shoulders: '🪖', chest: '🥋', hands: '🧤', legs: '👖', feet: '🥾', weapon: '🗡', trinket: '📿' };
const WEAPON_ICONS = { warrior: '🗡', mage: '🪄', ranger: '🏹', cleric: '🔨' };
const BUFF_ICONS = { shieldWall: '🛡', absorb: '🔮', hot: '💚', root: '❄', slow: '🐌' };

function bar(cur, max, color, label = true) {
  const k = max > 0 ? Math.max(0, Math.min(1, cur / max)) : 0;
  return `<div class="bar"><div class="fill" style="background:${color};transform:scaleX(${k})"></div>${label ? `<span>${Math.round(cur)} / ${max}</span>` : ''}</div>`;
}

export class Hud {
  constructor(game) {
    this.game = game;
    this.panel = null;
    this.plates = new Map();
    this.buildActionBar();
    $('#topButtons').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b) this.toggle(b.dataset.panel);
    });
    $('#panel').addEventListener('click', (e) => this.onPanelClick(e));
    $('#tooltip').addEventListener('click', (e) => this.onTooltipClick(e));
    $('#partyFrames').addEventListener('click', (e) => {
      const f = e.target.closest('[data-id]');
      if (f) game.setTarget(f.dataset.id);
    });
    // Taps on HUD controls must not become AR "select" taps on the world.
    for (const el of document.querySelectorAll('#hud > *')) el.addEventListener('beforexrselect', (ev) => ev.preventDefault());
  }

  buildActionBar() {
    const cls = CLASSES[this.game.cls];
    const keys = ['1', '2', '3', '4'];
    const html = cls.abilities.map((id, i) => {
      const a = ABILITIES[id];
      return `<button class="ab" data-ab="${id}" title="${esc(a.name)}: ${esc(a.desc)}"><span class="key">${keys[i]}</span>${a.icon}<div class="cd"></div><span class="cdt"></span></button>`;
    }).join('');
    $('#actionBar').innerHTML = `<button class="ab small" data-act="next" title="Target nearest enemy (Tab)">🎯</button>${html}<button class="ab small" data-act="potion" title="Drink a potion (Q)">🧪<span class="cnt"></span><div class="cd"></div></button>`;
    $('#actionBar').onclick = (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.ab) this.game.cast(b.dataset.ab);
      else if (b.dataset.act === 'next') this.game.targetNearest();
      else if (b.dataset.act === 'potion') this.game.drinkPotion();
    };
  }

  // ------------------------------------------------------------- frames ---

  update(snap, me, selfPlayer, target) {
    if (!selfPlayer) return;
    const cls = CLASSES[selfPlayer.cls];
    const res = RESOURCES[cls.resource];
    $('#playerFrame').innerHTML = `<div class="name"><span>${esc(selfPlayer.name)}</span><span class="lvl">${selfPlayer.level}</span></div>
      ${bar(selfPlayer.hp, selfPlayer.maxHp, 'var(--hp)')}${bar(selfPlayer.res, selfPlayer.maxRes, res.color)}
      <div class="buffs">${selfPlayer.buffs.map((b) => BUFF_ICONS[b] || '').join('')}<span style="margin-left:auto;color:var(--gold)">${me?.gold ?? 0}g</span></div>`;

    const tf = $('#targetFrame');
    if (target) {
      tf.classList.remove('hidden');
      const isEnemy = !!target.type;
      const def = isEnemy ? ENEMIES[target.type] : null;
      const tag = def?.boss ? ' 💀' : def?.elite ? ' ★' : '';
      tf.innerHTML = `<div class="name"><span>${esc(target.name)}${tag}</span><span class="lvl">${target.level}</span></div>
        ${bar(target.hp, target.maxHp, isEnemy ? 'var(--danger)' : 'var(--hp)')}
        <div class="buffs">${(target.buffs || []).map((b) => BUFF_ICONS[b] || '').join('')}</div>`;
    } else tf.classList.add('hidden');

    const others = snap.players.filter((p) => p.id !== selfPlayer.id);
    $('#partyFrames').innerHTML = others.map((p) => `<div class="unitframe ${this.game.targetId === p.id ? 'sel' : ''}" data-id="${p.id}">
      <div class="name"><span style="color:${CLASSES[p.cls].color}">${esc(p.name)}</span><span class="lvl">${p.level}</span></div>
      ${bar(p.hp, p.maxHp, p.alive ? 'var(--hp)' : '#555', false)}${bar(p.res, p.maxRes, RESOURCES[CLASSES[p.cls].resource].color, false)}</div>`).join('');

    // Action bar cooldowns and resource
    for (const b of document.querySelectorAll('#actionBar [data-ab]')) {
      const a = ABILITIES[b.dataset.ab];
      const left = this.game.cooldownLeft(b.dataset.ab);
      b.querySelector('.cd').style.setProperty('--p', `${Math.min(100, (left / a.cd) * 100)}%`);
      b.querySelector('.cdt').textContent = left > 0.05 ? (left > 3 ? Math.ceil(left) : left.toFixed(1)) : '';
      b.classList.toggle('nores', selfPlayer.res < a.cost);
    }
    const potions = (me?.bag || []).filter((i) => i.kind === 'consumable').length;
    const pb = $('#actionBar [data-act="potion"]');
    pb.querySelector('.cnt').textContent = potions || '';
    pb.querySelector('.cd').style.setProperty('--p', `${Math.min(100, (this.game.cooldownLeft('potion') / 10) * 100)}%`);

    if (me) {
      $('#xpBar .fill').style.transform = `scaleX(${me.xp / me.xpNext})`;
      $('#xpBar span').textContent = `XP ${me.xp} / ${me.xpNext}`;
    }
    $('#deathNote').classList.toggle('hidden', selfPlayer.alive);
  }

  tracker(me) {
    if (!me) return;
    const rows = [];
    for (const [qid, st] of Object.entries(me.quests)) {
      if (st.state !== 'active' && st.state !== 'done') continue;
      const q = questById[qid];
      rows.push(`<b>${esc(q.name)}</b>`);
      if (st.state === 'done') rows.push('<div class="ok">Return to the Keeper</div>');
      else q.objectives.forEach((o, i) => rows.push(`<div class="${st.progress[i] >= o.count ? 'ok' : ''}">${objectiveText(o)}: ${st.progress[i]}/${o.count}</div>`));
    }
    if (!rows.length && me.available.length) rows.push('<b>Talk to the Keeper</b><div>Tap her for a quest</div>');
    $('#tracker').innerHTML = rows.join('');
    if (this.panel && this.panel !== 'menu') this.renderPanel();
  }

  // Radar: you at the centre, facing up. Enemies red, allies green, quest
  // objects cyan, loot gold, Keeper yellow.
  radar(snap, selfPos, facing) {
    const cvs = $('#radar');
    const x = cvs.getContext('2d');
    const W = cvs.width; const R = W / 2;
    x.clearRect(0, 0, W, W);
    const range = Math.max(4, snap.arena * 2);
    const k = (R - 8) / range;
    x.strokeStyle = 'rgba(126,249,255,0.25)';
    x.beginPath(); x.arc(R, R, R - 8, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.arc(R, R, (R - 8) / 2, 0, Math.PI * 2); x.stroke();
    const cos = Math.cos(facing); const sin = Math.sin(facing);
    const dot = (wx, wz, color, size) => {
      const dx = wx - selfPos.x; const dz = wz - selfPos.z;
      // rotate so the facing direction points up the radar
      let px = (-dx * cos + dz * sin) * k;
      let py = -(dx * sin + dz * cos) * k;
      const d = Math.hypot(px, py);
      const lim = R - 8;
      if (d > lim) { px *= lim / d; py *= lim / d; }
      x.fillStyle = color;
      x.beginPath(); x.arc(R + px, R + py, size, 0, Math.PI * 2); x.fill();
    };
    for (const n of snap.npcs) dot(n.x, n.z, n.kind === 'questgiver' ? '#ffd34a' : '#c08a4a', 6);
    for (const p of snap.pickups) dot(p.x, p.z, '#7ef9ff', 5);
    for (const l of snap.loot) dot(l.x, l.z, l.rarity ? rarityById[l.rarity].color : '#ffd34a', 4);
    for (const p of snap.players) if (p.id !== this.game.selfId) dot(p.x, p.z, '#4aff7a', 6);
    for (const e of snap.enemies) if (e.alive) dot(e.x, e.z, ENEMIES[e.type].boss || ENEMIES[e.type].elite ? '#ff8a1a' : '#ff3a2a', ENEMIES[e.type].boss ? 9 : 6);
    x.fillStyle = '#fff';
    x.beginPath(); x.moveTo(R, R - 9); x.lineTo(R - 6, R + 6); x.lineTo(R + 6, R + 6); x.fill();
  }

  // Nameplates and health bars above entities, positioned by main.js.
  plate(id, html, cls, sx, sy, visible) {
    let el = this.plates.get(id);
    if (!el) {
      el = document.createElement('div');
      el.className = `plate ${cls}`;
      $('#floaters').appendChild(el);
      this.plates.set(id, el);
    }
    if (!visible) { el.style.display = 'none'; return; }
    el.style.display = '';
    if (el._html !== html) { el.innerHTML = html; el._html = html; }
    el.style.left = `${sx}px`;
    el.style.top = `${sy}px`;
  }

  prunePlates(alive) {
    for (const [id, el] of this.plates) if (!alive.has(id)) { el.remove(); this.plates.delete(id); }
  }

  floatText(text, sx, sy, cls) {
    const el = document.createElement('div');
    el.className = `float ${cls}`;
    el.textContent = text;
    el.style.left = `${sx + (Math.random() - 0.5) * 30}px`;
    el.style.top = `${sy}px`;
    $('#floaters').appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  toast(text, err = false) {
    const now = performance.now();
    if (this.lastToast === text && now - this.lastToastAt < 1500) return;
    this.lastToast = text; this.lastToastAt = now;
    const el = document.createElement('div');
    el.className = `toast ${err ? 'err' : ''}`;
    el.innerHTML = text;
    $('#toasts').appendChild(el);
    setTimeout(() => el.remove(), 2600);
    while ($('#toasts').children.length > 4) $('#toasts').firstChild.remove();
  }

  banner(text) {
    const b = $('#banner');
    b.textContent = text;
    b.classList.remove('hidden');
    clearTimeout(this.bannerT);
    this.bannerT = setTimeout(() => b.classList.add('hidden'), 3500);
  }

  // ------------------------------------------------------------- panels ---

  toggle(name, arg) {
    if (this.panel === name && arg === undefined) return this.close();
    this.panel = name;
    this.panelArg = arg;
    this.hideTooltip();
    this.renderPanel();
    $('#panel').classList.remove('hidden');
  }

  close() {
    this.panel = null;
    $('#panel').classList.add('hidden');
    this.hideTooltip();
  }

  renderPanel() {
    const me = this.game.me;
    if (!me) return;
    const inner = $('#panel .panel-inner');
    const close = '<button class="close" data-act="close">✕</button>';
    if (this.panel === 'keeper') inner.innerHTML = close + this.keeperHtml(me);
    else if (this.panel === 'vendor') inner.innerHTML = close + this.vendorHtml(me);
    else if (this.panel === 'quests') inner.innerHTML = close + this.questLogHtml(me);
    else if (this.panel === 'character') inner.innerHTML = close + this.characterHtml(me);
    else if (this.panel === 'menu') inner.innerHTML = close + this.menuHtml();
  }

  keeperHtml(me) {
    const q = this.panelArg && questById[this.panelArg];
    if (q) {
      const st = me.quests[q.id];
      const r = q.reward;
      const rarity = rarityById[r.item.rarity];
      const slot = r.item.slot === 'random' ? 'gear' : SLOT_NAMES[r.item.slot].toLowerCase();
      let action = '';
      if (!st || st.state === 'repeat') action = `<button class="btn primary" data-act="accept" data-id="${q.id}">Accept</button>`;
      else if (st.state === 'done') action = `<button class="btn primary" data-act="turnin" data-id="${q.id}">Complete quest</button>`;
      else action = '<p class="note">In progress.</p>';
      return `<h2>${esc(q.name)}</h2><p class="qtext">${esc(q.text)}</p>
        <h3>Objectives</h3>${q.objectives.map((o) => `<div>• ${objectiveText(o)} ×${o.count}</div>`).join('')}
        ${q.group ? '<p class="note">Group quest: bring a party.</p>' : ''}
        <h3>Rewards</h3><div>${r.xp} XP · ${r.gold} gold · <span style="color:${rarity.color}">${rarity.name} ${slot}</span></div>
        <div style="margin-top:12px">${action}</div><button class="btn" data-act="keeper">Back</button>`;
    }
    const ready = Object.entries(me.quests).filter(([, s]) => s.state === 'done').map(([id]) => id);
    const active = Object.entries(me.quests).filter(([, s]) => s.state === 'active').map(([id]) => id);
    const list = (ids, mark) => ids.map((id) => `<button data-act="quest" data-id="${id}">${mark} ${esc(questById[id].name)}</button>`).join('');
    return `<h2>Ysolde, Keeper of the Threshold</h2>
      <p class="qtext">“The rift sits on your floor now, traveller. Walk it. What you see through this glass is as real as you let it be.”</p>
      <div class="list">${list(ready, '❓')}${list(me.available, '❗')}${list(active, '⏳')}</div>
      ${!ready.length && !me.available.length && !active.length ? '<p class="note">Nothing more for now. Return tomorrow for the daily task, or when you are stronger.</p>' : ''}`;
  }

  vendorHtml(me) {
    const sellable = me.bag.map((it, i) => ({ it, i })).filter(({ it }) => it.kind === 'gear');
    return `<h2>Bram the Pedlar</h2><p class="qtext">“Potions, fresh-ish. And I'll take that junk off your hands.”</p>
      <h3>Buy</h3><div class="list">${VENDOR.map((v) => `<button data-act="buy" data-id="${v.id}">${v.icon} ${esc(v.name)} — ${v.price}g <small class="note">${esc(v.desc)}</small></button>`).join('')}</div>
      <h3>Sell (you have ${me.gold}g)</h3><div class="list">${sellable.length ? sellable.map(({ it, i }) => `<button data-act="sell" data-index="${i}"><span style="color:${rarityById[it.rarity].color}">${esc(it.name)}</span> — ${it.value}g</button>`).join('') : '<p class="note">No gear in your bags.</p>'}</div>`;
  }

  questLogHtml(me) {
    const rows = Object.entries(me.quests).filter(([, s]) => s.state === 'active' || s.state === 'done');
    const done = Object.entries(me.quests).filter(([, s]) => s.state === 'complete').length;
    return `<h2>Quest log</h2>${rows.length ? rows.map(([id, st]) => {
      const q = questById[id];
      return `<h3>${esc(q.name)}${st.state === 'done' ? ' — ready' : ''}</h3><p class="qtext">${esc(q.text)}</p>
        ${q.objectives.map((o, i) => `<div>${objectiveText(o)}: ${st.progress[i]}/${o.count}</div>`).join('')}
        <button class="btn" data-act="abandon" data-id="${id}">Abandon</button>`;
    }).join('') : '<p class="note">No active quests. Talk to the Keeper at the rift.</p>'}<p class="note">${done} quest(s) completed.</p>`;
  }

  characterHtml(me) {
    const cls = CLASSES[this.game.cls];
    const s = me.stats;
    const slotHtml = SLOTS.map((slot) => {
      const it = me.equipment[slot];
      const border = it ? rarityById[it.rarity].color : '#3a3048';
      return `<button class="item" data-act="eq" data-slot="${slot}" style="border-color:${border}">${it ? iconFor(it, this.game.cls) : `<span style="opacity:.25">${SLOT_ICONS[slot]}</span>`}<small>${SLOT_NAMES[slot]}</small></button>`;
    }).join('');
    const bag = [];
    for (let i = 0; i < BAG_SIZE; i++) {
      const it = me.bag[i];
      if (!it) { bag.push('<div class="item"></div>'); continue; }
      const up = it.kind === 'gear' && it.cls === this.game.cls && itemScore(it, this.game.cls) > itemScore(me.equipment[it.slot], this.game.cls);
      bag.push(`<button class="item" data-act="bag" data-index="${i}" style="border-color:${rarityById[it.rarity].color}">${iconFor(it, this.game.cls)}${up ? '<span class="up">▲</span>' : ''}</button>`);
    }
    return `<h2>${esc(this.game.name)} — level ${this.game.self?.level} ${cls.name}</h2>
      <div class="stats">${['str', 'agi', 'int', 'spi', 'sta', 'armor'].map((k) => `<span>${STAT_NAMES[k]}</span><span>${s[k] || 0}</span>`).join('')}
      <span>Health</span><span>${s.maxHp}</span><span>Damage reduction</span><span>${Math.round(s.dr * 100)}%</span><span>Item level</span><span>${s.ilvl}</span><span>Gold</span><span>${me.gold}</span></div>
      <h3>Equipped</h3><div class="slots">${slotHtml}</div>
      <h3>Bags (${me.bag.length}/${BAG_SIZE})</h3><div class="bag">${bag.join('')}</div>
      <p class="note">Tap an item for details. ▲ marks an upgrade.</p>`;
  }

  menuHtml() {
    const g = this.game;
    return `<h2>Menu</h2>
      ${g.roomCode ? `<p>Room code: <b style="font-size:22px;color:var(--gold);letter-spacing:3px">${g.roomCode}</b><br><span class="note">Friends join with this code. In the same room, place the rift on the same spot facing the same way.</span></p>` : '<p class="note">Solo game. Create a room from the lobby to play with friends.</p>'}
      ${g.mode === 'ar' || g.mode === 'table' || g.mode === 'home' ? `<button class="btn" data-act="replace">${g.mode === 'home' ? 'Line up with my room again' : 'Move the rift'}</button>` : ''}
      <button class="btn" data-act="leave">Leave to lobby</button>
      <h3>Controls</h3><p class="note">${g.mode === 'home' ? 'Stay seated. Steer your hero with the stick; up on the stick is the way your phone points. Tap enemies to target them and the Keeper for quests.' : g.mode === 'ar' ? 'Walk around your room to move. Tap enemies to target them, tap the Keeper for quests. Step out of red circles!' : 'Move with the stick or WASD. Tap/click to target. 1–4 abilities, Tab next target, Q potion, C character, L quests.'}</p>`;
  }

  onPanelClick(e) {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const g = this.game;
    const act = b.dataset.act;
    if (act === 'close') this.close();
    else if (act === 'quest') this.toggle('keeper', b.dataset.id);
    else if (act === 'keeper') this.toggle('keeper', null);
    else if (act === 'accept') { g.send({ t: 'accept', id: b.dataset.id }); this.toggle('keeper', null); }
    else if (act === 'turnin') { g.send({ t: 'turnin', id: b.dataset.id }); this.toggle('keeper', null); }
    else if (act === 'abandon') g.send({ t: 'abandon', id: b.dataset.id });
    else if (act === 'buy') g.send({ t: 'buy', id: b.dataset.id });
    else if (act === 'sell') g.send({ t: 'sell', index: Number(b.dataset.index) });
    else if (act === 'bag') this.showTooltip(g.me.bag[Number(b.dataset.index)], { index: Number(b.dataset.index) });
    else if (act === 'eq') { const it = g.me.equipment[b.dataset.slot]; if (it) this.showTooltip(it, { slot: b.dataset.slot }); }
    else if (act === 'leave') g.leave();
    else if (act === 'replace') { g.replaceArena(); this.close(); }
  }

  showTooltip(it, where) {
    if (!it) return;
    const me = this.game.me;
    const r = rarityById[it.rarity];
    const tt = $('#tooltip');
    let body = '';
    if (it.kind === 'gear') {
      const cur = where.index !== undefined ? me.equipment[it.slot] : null;
      const lines = Object.entries(it.stats).map(([k, v]) => {
        const diff = cur ? v - (cur.stats[k] || 0) : 0;
        return `<div>+${v} ${STAT_NAMES[k]} ${cur && diff ? `<span class="${diff > 0 ? 'green' : 'red'}">(${diff > 0 ? '+' : ''}${diff})</span>` : ''}</div>`;
      }).join('');
      const usable = it.cls === this.game.cls;
      body = `<div class="sub"><span>${SLOT_NAMES[it.slot]}${it.armorType ? ` · ${it.armorType}` : ''}</span><span>Item level ${it.ilvl}</span></div>${lines}
        ${usable ? '' : `<div class="red">Requires ${CLASSES[it.cls].name}</div>`}<div class="note">Sells for ${it.value}g</div>`;
    } else {
      const v = VENDOR.find((x) => x.id === it.vendorId);
      body = `<div>${esc(v?.desc || '')}</div>`;
    }
    const acts = [];
    if (where.index !== undefined && it.kind === 'gear') acts.push(`<button data-tt="equip" data-index="${where.index}">Equip</button>`);
    if (where.index !== undefined && it.kind === 'consumable') acts.push(`<button data-tt="use" data-index="${where.index}">Use</button>`);
    if (where.slot) acts.push(`<button data-tt="unequip" data-slot="${where.slot}">Unequip</button>`);
    if (where.index !== undefined) acts.push(`<button data-tt="sell" data-index="${where.index}">Sell</button>`);
    acts.push('<button data-tt="x">Close</button>');
    tt.innerHTML = `<div class="tn" style="color:${r.color}">${esc(it.name)}</div><div class="sub"><span>${r.name}</span></div>${body}<div class="acts">${acts.join('')}</div>`;
    tt.classList.remove('hidden');
  }

  hideTooltip() { $('#tooltip').classList.add('hidden'); }

  onTooltipClick(e) {
    const b = e.target.closest('[data-tt]');
    if (!b) return;
    const g = this.game;
    const t = b.dataset.tt;
    if (t === 'equip') g.send({ t: 'equip', index: Number(b.dataset.index) });
    else if (t === 'use') g.send({ t: 'use', index: Number(b.dataset.index) });
    else if (t === 'unequip') g.send({ t: 'unequip', slot: b.dataset.slot });
    else if (t === 'sell') g.send({ t: 'sell', index: Number(b.dataset.index) });
    this.hideTooltip();
  }
}

function objectiveText(o) {
  if (o.kind === 'collect') return `Collect ${o.target === 'shard' ? 'Rift Shards' : 'Hearth Embers'}`;
  if (o.target === 'any') return 'Defeat rift creatures';
  return `Defeat ${ENEMIES[o.target].name}${o.count > 1 ? 's' : ''}`;
}

function iconFor(it, cls) {
  if (it.kind === 'consumable') return it.icon;
  return it.slot === 'weapon' ? WEAPON_ICONS[it.cls || cls] : SLOT_ICONS[it.slot];
}
