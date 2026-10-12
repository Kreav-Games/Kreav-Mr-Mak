#!/usr/bin/env node
// Generates the Wildwright Workspace hub from the Markdown design docs.
//
//   node projects/Wildwright/tools/build-workspace-card.mjs
//
// Source of truth: docs/02-gdd.md and docs/04-decisions.md. Edit those, then
// re-run. The script fails loudly if a table or section it needs is missing,
// so a restructured GDD cannot silently produce a stale card.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(here, '..');
const repo = path.resolve(project, '..', '..');
const cardDir = path.join(repo, 'workspace', '2026-10-11_wildwright');
const DOCS = '../../projects/Wildwright/docs/';
const read = file => readFileSync(path.join(project, 'docs', file), 'utf8').replace(/\r\n/g, '\n');
const gdd = read('02-gdd.md');
const decisions = read('04-decisions.md');

// ---------------------------------------------------------------- markdown
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const linkTarget = href => (/^[a-z]+:|^#|^\.\.?\//i.test(href) ? href : DOCS + href);

function inline(text) {
  const codes = [];
  let t = text.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  t = esc(t);
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => `<a href="${linkTarget(href)}" target="_blank" rel="noopener">${label}</a>`);
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(^|[^*\w])\*(?!\s)([^*]+?)(?<!\s)\*(?!\w)/g, '$1<em>$2</em>');
  t = t.replace(/~~(.+?)~~/g, '<del>$1</del>');
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
}
const plain = s => s.replace(/\*\*|\*|`|~~/g, '').trim();

function section(md, prefix) {
  const lines = md.split('\n');
  const start = lines.findIndex(l => l.startsWith(prefix));
  if (start < 0) throw new Error(`Section not found: "${prefix}"`);
  const level = lines[start].match(/^#+/)[0].length;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#+) /);
    if (m && m[1].length <= level) { end = i; break; }
  }
  return lines.slice(start + 1, end).join('\n');
}

const splitRow = line => line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
function blocks(md) {
  const lines = md.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || /^---+$/.test(line.trim())) continue;
    if (/^#+ /.test(line)) { out.push({ type: 'h', text: line.replace(/^#+ /, '') }); continue; }
    if (line.trim().startsWith('|') && lines[i + 1] && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const header = splitRow(line); const rows = []; let j = i + 2;
      while (j < lines.length && lines[j].trim().startsWith('|')) { rows.push(splitRow(lines[j])); j++; }
      for (const r of rows) if (r.length !== header.length) throw new Error(`Column mismatch in table [${header.join(' | ')}]: ${r.join(' | ')}`);
      out.push({ type: 'table', header, rows }); i = j - 1; continue;
    }
    if (/^>/.test(line)) {
      const parts = [];
      while (i < lines.length && /^>/.test(lines[i])) { parts.push(lines[i].replace(/^>\s?/, '')); i++; }
      i--; out.push({ type: 'quote', text: parts.join(' ').trim() }); continue;
    }
    const list = line.match(/^(\s*)([-*]|\d+\.) /);
    if (list) {
      const ordered = /\d/.test(list[2]); const items = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)([-*]|\d+\.) (.*)$/);
        if (m) items.push(m[3]);
        else if (/^\s+\S/.test(lines[i]) && items.length) items[items.length - 1] += ' ' + lines[i].trim();
        else break;
        i++;
      }
      i--; out.push({ type: ordered ? 'ol' : 'ul', items }); continue;
    }
    const parts = [];
    while (i < lines.length && lines[i].trim() && !/^(#+ |>|\||\s*([-*]|\d+\.) )/.test(lines[i])) { parts.push(lines[i].trim()); i++; }
    i--; out.push({ type: 'p', text: parts.join(' ') });
  }
  return out;
}
const pick = (md, type, n = 0) => {
  const found = blocks(md).filter(b => b.type === type)[n];
  if (!found) throw new Error(`No ${type} #${n} found in the requested section`);
  return found;
};
const get = (prefix, type, n = 0) => pick(section(gdd, prefix), type, n);
const need = (cond, msg) => { if (!cond) throw new Error(msg); };

// ---------------------------------------------------------------- renderers
const tableHtml = (t, { classes = '', cell = {} } = {}) => {
  const head = t.header.map(h => `<th>${inline(h)}</th>`).join('');
  const body = t.rows.map(r => `<tr>${r.map((c, i) => `<td>${(cell[i] || inline)(c)}</td>`).join('')}</tr>`).join('');
  return `<div class="table-wrap ${classes}"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
};
const list = (items, tag = 'ul', cls = '') => `<${tag}${cls ? ` class="${cls}"` : ''}>${items.map(i => `<li>${inline(i)}</li>`).join('')}</${tag}>`;
const heading = (title, aside = '') => `<div class="section-heading"><h2>${title}</h2>${aside ? `<span>${aside}</span>` : ''}</div>`;
const chip = (text, cls = '') => `<span class="chip ${cls}">${esc(text)}</span>`;
// A paragraph may hold a sentence plus a bold "A → B → C" line; chip only the bold span.
const arrowChips = text => {
  const bold = [...text.matchAll(/\*\*(.+?)\*\*/g)].map(m => m[1]).find(s => s.includes('→'));
  need(bold || text.includes('→'), `No arrow sequence found in: ${text.slice(0, 60)}`);
  return plain(bold || text).replace(/\.$/, '').split('→').map(s => chip(s.trim())).join('<i aria-hidden="true">→</i>');
};

// ---------------------------------------------------------------- data
const version = (gdd.match(/GDD \d+\.\d+/) || ['GDD'])[0];
const pillars = get('### 2.1 ', 'table');
need(pillars.rows.length >= 6, 'Expected at least six pillars');
const rhythm = get('### 2.3 ', 'table');
const loop = get('### 2.4 ', 'p');
const contractTable = get('### 2.2 ', 'table');
const contractRules = get('### 2.2 ', 'ol');
const elements = get('### 3.2 ', 'table');
need(elements.rows.length === 4, 'Expected four elements');
const model = get('### 3.3 ', 'table');
const rules = get('### 3.4 ', 'table');
const special = get('### 3.5 ', 'table');
const conflict = get('### 3.6 ', 'ul');
const isM1 = r => /\*\*M1\*\*/.test(r[5]);
const firstRules = { header: rules.header, rows: rules.rows.filter(isM1) };
const laterRules = { header: rules.header, rows: rules.rows.filter(r => !isM1(r)) };
need(firstRules.rows.length >= 1, 'No M1 rules found');
const variables = get('### 4.2 ', 'table');
const cadence = get('### 4.3 ', 'table');
const memory = get('### 4.4 ', 'ul');
const stages = get('### 4.5 ', 'p');
const weather = get('### 4.6 ', 'p');
const creatures = get('### 8.1 ', 'table');
const behavior = get('### 8.2 ', 'table');
const habitat = get('### 8.3 ', 'p');
const language = get('### 5.2 ', 'table');
const heroCast = get('### 5.3 ', 'table');
const feedback = get('### 5.4 ', 'p');
const legibility = get('### 5.5 ', 'p');
const milestones = get('## 14. ', 'table');
need(milestones.rows.length === 7, 'Expected milestones M0 to M6');
const cap = get('### 14.1 ', 'table');
const playtest = get('### 14.2 ', 'ul');
const goNoGo = get('### 14.3 ', 'p');
const dod = get('### 16.2 ', 'ul');
const openDecisions = get('## 16. ', 'table');
const next = get('### 16.3 ', 'table');
const decided = pick(section(decisions, '## Decided'), 'table');

// ---------------------------------------------------------------- layout bits
const glyph = {
  fire: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4-3 5-3 9a3 3 0 0 0 6 0c0-1-.5-2-1-3 3 1 5 4 5 7a7 7 0 0 1-14 0c0-6 7-8 7-13z"/></svg>',
  water: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5s6 6.2 6 10.5a6 6 0 0 1-12 0C6 8.7 12 2.5 12 2.5z"/></svg>',
  earth: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 20 9 7l4 7 3-4 6 10z"/></svg>',
  air: '<svg viewBox="0 0 24 24" aria-hidden="true" class="stroke"><path d="M3 9h11a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3M3 19h7"/></svg>',
};
const tabs = [
  ['overview', 'Overview'], ['elements', 'Elements'], ['world', 'World'], ['spectacle', 'Spectacle'], ['build', 'Build'],
];

const elementCard = r => {
  const key = plain(r[0]).toLowerCase();
  return `<article class="element-card ${key}"><div class="element-glyph">${glyph[key] || ''}</div><h3>${inline(r[0])}</h3>
<dl><dt>Verbs</dt><dd>${inline(r[1])}</dd><dt>Targets</dt><dd>${inline(r[2])}</dd><dt>Trade-offs</dt><dd>${inline(r[3])}</dd></dl></article>`;
};
const stepCard = (r, i) => {
  const layer = plain(r[2]).toLowerCase();
  return `<li class="step" data-layer="${esc(layer)}"><span class="step-n">${String(i + 1).padStart(2, '0')}</span><h3>${inline(r[0])}</h3>${chip(plain(r[2]), `layer-${layer}`)}<p>${inline(r[1])}</p></li>`;
};
const pillarCard = r => `<article class="pillar${/\(new\)/.test(r[1]) ? ' is-new' : ''}"><span class="pillar-id">${esc(plain(r[0]))}</span><h3>${inline(r[1])}</h3><p>${inline(r[2])}</p><p class="anti"><b>Avoid</b> ${inline(r[3])}</p></article>`;
const milestoneTask = r => {
  const [id, ...nameParts] = plain(r[0]).split(' — ');
  return `<div class="task"><span>${esc(id)} · NOT STARTED</span><h3>${esc(nameParts.join(' — '))}</h3><p>${inline(r[1])}</p><p class="accept"><b>Done when</b> ${inline(r[2])}</p></div>`;
};
const column = (title, dot, rows) => `<article class="board-column"><h2><span class="column-dot ${dot}"></span>${title} <small>${rows.length}</small></h2>${rows.map(milestoneTask).join('')}</article>`;

const handoff = `Read projects/Wildwright/README.md, then docs/02-gdd.md sections 1-3 and docs/04-decisions.md.
Engine is UE 5.8.3 (D-07), the cast layer is GAS for casting only (D-08), and the project is at D:\\Wildwright\\ (D-09).
Claim the area in the README, then build next action 3: a greybox valley and test range with target objects, in a test map, and report what you verified.
Keep every elemental rule data-driven and keep the cast layer separate from world state. Do not copy Valley assets until OD-10 is resolved.
Keep all output in English.`;

const diagram = `<figure class="layer-diagram"><svg viewBox="0 0 760 300" role="img" aria-labelledby="ld-t ld-d">
<title id="ld-t">Cast layer and state layer</title><desc id="ld-d">The cast layer reads world state and requests changes through the rule resolver. Only the state layer is authoritative.</desc>
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" class="ah"/></marker></defs>
<g class="box cast"><rect x="20" y="20" width="720" height="82" rx="12"/><text x="40" y="52" class="t1">CAST LAYER</text><text x="40" y="76" class="t2">Montage · camera · charge/release · Niagara · audio · haptics</text><text x="720" y="52" class="t3" text-anchor="end">transient · cosmetic · never authoritative</text></g>
<g class="box resolver"><rect x="230" y="125" width="300" height="56" rx="10"/><text x="380" y="150" class="t1" text-anchor="middle">RULE RESOLVER</text><text x="380" y="169" class="t2" text-anchor="middle">deterministic · data-driven · logged</text></g>
<g class="box state"><rect x="20" y="204" width="720" height="82" rx="12"/><text x="40" y="236" class="t1">STATE LAYER</text><text x="40" y="260" class="t2">World cells · tags · material and mesh state · journal</text><text x="720" y="236" class="t3" text-anchor="end">persistent · readable · the only source of truth</text></g>
<path d="M330 102v23" class="arrow" marker-end="url(#ah)"/><text x="318" y="118" class="t3" text-anchor="end">requests</text>
<path d="M380 181v23" class="arrow" marker-end="url(#ah)"/><text x="394" y="197" class="t3">resolves</text>
<path d="M600 204V102" class="arrow dashed" marker-end="url(#ah)"/><text x="614" y="158" class="t3">cues read state</text>
</svg><figcaption>The cast layer asks; the state layer decides. Disabling every effect must leave gameplay state identical.</figcaption></figure>`;

// ---------------------------------------------------------------- pages
const overview = `
<section aria-labelledby="nav-overview" class="game-page" id="overview" role="tabpanel" tabindex="0">
<div class="page-heading"><div><div class="eyebrow">Elemental ecosystem sandbox · ${esc(version)}</div><h1>Cast like a hero.<br/>Change a living world.</h1></div><p>Learn fire, water, earth and air. Every cast is a cinematic performance, and every cast leaves a readable mark on a valley that remembers.</p></div>
<figure class="title-card"><div class="title-glyphs">${['fire', 'water', 'earth', 'air'].map(k => `<span class="glyph ${k}">${glyph[k]}</span>`).join('')}</div>
<div class="title-copy"><span class="screen-kicker">AN ELEMENTAL ECOSYSTEM SANDBOX</span><div class="game-wordmark">WILD<b>WRIGHT</b></div><span class="screen-line">The world is not your resource. It is your creation, your adversary, and your memory.</span></div></figure>
<div class="project-actions"><button class="primary-action" data-open="elements">The four elements <span>→</span></button><button class="secondary-action" data-open="spectacle">How a cast works <span>↗</span></button></div>
<div class="game-stats"><div><strong>01</strong><span>valley in the first playable</span></div><div><strong>${String(elements.rows.length).padStart(2, '0')}</strong><span>elements to learn</span></div><div><strong>${String(firstRules.rows.length).padStart(2, '0')}</strong><span>rules in the first playable</span></div><div><strong>${String(milestones.rows.length).padStart(2, '0')}</strong><span>milestones, M0 to M6</span></div></div>
<div class="editorial-grid"><article class="note-card"><div class="eyebrow">The loop</div><h2>Observe, cast, understand, return.</h2><div class="chip-row">${arrowChips(loop.text)}</div><p>Knowledge, recorded in a field journal, is the main progression. A discovered rule opens a route, a build site or a way to survive.</p><button class="text-action" data-open="elements">See the rules →</button></article>
<article class="note-card"><div class="eyebrow">Decided so far</div><h2>The direction is set.</h2><ul class="decided">${decided.rows.map(r => `<li><b>${esc(plain(r[0]))}</b> ${inline(r[1])}</li>`).join('')}</ul><button class="text-action" data-open="build">Open decisions and milestones →</button></article></div>
${heading('Seven pillars', 'GDD 2.1 · the last one is new')}
<div class="pillar-grid">${pillars.rows.map(pillarCard).join('')}</div>
${heading('The intended feeling', 'GDD 2.3')}
${tableHtml(rhythm)}
<p class="project-footnote">Generated from <a href="${DOCS}02-gdd.md" target="_blank" rel="noopener">${esc(version)}</a> and the decision log on ${new Date().toLocaleDateString('en-CA')}. The Markdown is the source; re-run <code>node projects/Wildwright/tools/build-workspace-card.mjs</code> after editing it. The Unreal project is at <code>D:\\Wildwright\\</code>.</p>
</section>`;

const elementsPage = `
<section aria-labelledby="nav-elements" class="game-page" hidden id="elements" role="tabpanel" tabindex="0">
<div class="page-heading"><div><div class="eyebrow">Elements / 01</div><h1>Four forces.<br/>One shared rulebook.</h1></div><p>Elements act on tagged targets through deterministic rules. They are not four spell trees.</p></div>
<div class="element-grid">${elements.rows.map(elementCard).join('')}</div>
${heading('From input to consequence', 'GDD 3.3 · an action has two layers')}
<ol class="steps">${model.rows.map(stepCard).join('')}</ol>
<p class="muted">A cancelled charge must clean up the cast layer and must not change state.</p>
${heading('First-playable rules', `GDD 3.4 · ${firstRules.rows.length} rules at milestone M1`)}
${tableHtml(firstRules, { classes: 'rules', cell: { 0: c => `<code>${esc(plain(c))}</code>` } })}
${heading('Later rules', 'Scheduled, not built first')}
${tableHtml(laterRules, { classes: 'rules muted-table', cell: { 0: c => `<code>${esc(plain(c))}</code>` } })}
<div class="editorial-grid"><article class="note-card"><h2>When rules collide</h2>${list(conflict.items)}</article>
<article class="note-card"><h2>Special states</h2>${tableHtml(special)}</article></div>
</section>`;

const worldPage = `
<section aria-labelledby="nav-world" class="game-page" hidden id="world" role="tabpanel" tabindex="0">
<div class="page-heading"><div><div class="eyebrow">World / 01</div><h1>A valley that<br/>remembers.</h1></div><p>A few bounded variables per cell, discrete stages, and creatures that react to what changed.</p></div>
${heading('Regional state', 'GDD 4.2')}
${tableHtml(variables)}
<div class="editorial-grid"><article class="note-card"><div class="eyebrow">State transitions · GDD 4.5</div><h2>Stages, not numbers.</h2><div class="chip-row">${arrowChips(stages.text)}</div><p>Discrete tiers are cheaper, easier to debug and easier for players to read than a unique state for every value.</p></article>
<article class="note-card"><div class="eyebrow">Ecological memory · GDD 4.4</div><h2>What the world keeps.</h2>${list(memory.items)}</article></div>
${heading('How often things update', 'GDD 4.3')}
${tableHtml(cadence)}
<p class="muted">${inline(weather.text)}</p>
${heading('Creatures', 'GDD 8.1 · working names')}
${tableHtml(creatures)}
<div class="editorial-grid"><article class="note-card"><h2>Behavior states</h2>${tableHtml(behavior)}</article><article class="note-card"><h2>Habitat suitability</h2><p>${inline(habitat.text)}</p></article></div>
</section>`;

const spectaclePage = `
<section aria-labelledby="nav-spectacle" class="game-page" hidden id="spectacle" role="tabpanel" tabindex="0">
<div class="page-heading"><div><div class="eyebrow">Spectacle / 01</div><h1>Power you can<br/>read.</h1></div><p>Action-fantasy weight on the outside, a legible simulation underneath. The two never trade places.</p></div>
${diagram}
<div class="editorial-grid"><article class="note-card"><div class="eyebrow">The spectacle contract · GDD 2.2</div><h2>Five rules.</h2>${list(contractRules.items, 'ol')}</article>
<article class="note-card"><h2>The two layers</h2>${tableHtml(contractTable)}</article></div>
${heading('Anatomy of a hero cast', 'GDD 5.3 · one in M1, then at most one per element')}
${tableHtml(heroCast)}
<div class="editorial-grid"><article class="note-card"><div class="eyebrow">Feedback stack · GDD 5.4</div><h2>Two signals, one that persists.</h2><p>${inline(feedback.text)}</p></article><article class="note-card"><div class="eyebrow">Legibility · GDD 5.5</div><h2>Beauty never hides the rule.</h2><p>${inline(legibility.text)}</p></article></div>
${heading('How the reference feel is built', 'Valley of the Ancient')}
<ol class="steps pipeline"><li class="step"><span class="step-n">01</span><h3>Ability</h3><p>Charge, aim, release and cancel with montages and an aim camera.</p></li><li class="step"><span class="step-n">02</span><h3>Tag</h3><p>An effect grants tags only; it carries no visuals.</p></li><li class="step"><span class="step-n">03</span><h3>Cue</h3><p>A cue reacts to the tag and spawns the presentation.</p></li><li class="step"><span class="step-n">04</span><h3>Presentation</h3><p>Niagara, layered audio and haptics. Cosmetic only.</p></li></ol>
<div class="callout"><b>Scale warning.</b> The single LightDart ability in Valley of the Ancient has about 147 named assets, roughly 80 of them materials. Budget for one hero cast and reuse its structure for the rest. <a href="${DOCS}03-feel-reference-valley-of-the-ancient.md" target="_blank" rel="noopener">Feel reference ↗</a></div>
${heading('Element language', 'GDD 5.2')}
${tableHtml(language)}
</section>`;

const [now, soon, later] = [milestones.rows.slice(0, 2), milestones.rows.slice(2, 5), milestones.rows.slice(5)];
const buildPage = `
<section aria-labelledby="nav-build" class="game-page" hidden id="build" role="tabpanel" tabindex="0">
<div class="page-heading"><div><div class="eyebrow">Build / 01</div><h1>Prove it small,<br/>then grow it.</h1></div><p>Do not build the world first. Build a laboratory that proves cause and effect, persistence and curiosity.</p></div>
<div class="board">${column('Start here', 'ready', now)}${column('Then', 'next', soon)}${column('Later', 'later', later)}</div>
<p class="muted">${inline(goNoGo.text)}</p>
${heading('Open decisions', 'GDD 16 · recommendations are not binding')}
${tableHtml(openDecisions, { classes: 'decisions-table', cell: { 0: c => `<code>${esc(plain(c))}</code>` } })}
${heading('Next actions', 'GDD 16.3')}
${tableHtml(next)}
${heading('First-playable content cap', 'GDD 14.1')}
${tableHtml(cap)}
<div class="editorial-grid"><article class="note-card"><h2>Playtest questions</h2>${list(playtest.items)}</article><article class="note-card"><h2>Definition of done</h2>${list(dod.items)}</article></div>
<article class="handoff"><div class="eyebrow">A useful first agent task</div><h2>Give the next chat a concrete target.</h2><pre>${esc(handoff)}</pre><p>This is a handoff example. It does not start a chat or change an editor until you ask an agent to run it.</p></article>
</section>`;

const html = `<!DOCTYPE html>
<html data-mak-report="document" lang="en">
<head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1" name="viewport"/>
<title>Wildwright · Elemental ecosystem sandbox</title>
<link href="../_shared/report.css" rel="stylesheet"/><link href="../_shared/examples.css" rel="stylesheet"/><link href="wildwright.css" rel="stylesheet"/>
<script defer src="../_shared/report.js"></script><script defer src="wildwright.js"></script></head>
<body class="game-document"><div class="game-shell">
<aside class="project-rail"><a class="project-brand" href="#overview"><span aria-hidden="true" class="brand-mark">W</span><span>WILDWRIGHT<small>Elemental ecosystem sandbox</small></span></a>
<div class="rail-label">GAME DESIGN</div>
<nav aria-label="Wildwright sections" aria-orientation="vertical" role="tablist">
${tabs.map(([id, name], i) => `<button aria-controls="${id}" aria-selected="${i === 0}" data-page="${id}" id="nav-${id}" role="tab"${i ? ' tabindex="-1"' : ''}><span>${String(i + 1).padStart(2, '0')}</span>${name}</button>`).join('\n')}
</nav>
<div class="rail-note"><span class="phase-dot"></span> Pre-production<p>Design is written.<br/>M0 project set up.</p></div>
<a class="rail-link" href="../../projects/Wildwright/README.md" rel="noopener" target="_blank">Project README ↗</a>
<a class="rail-link" href="${DOCS}02-gdd.md" rel="noopener" target="_blank">Game design document ↗</a>
<a class="rail-link" href="${DOCS}04-decisions.md" rel="noopener" target="_blank">Decision log ↗</a></aside>
<main class="game-main">
<div class="project-topline"><span>PROJECT / WILDWRIGHT</span><span class="sample-pill">${esc(version)} · pre-production</span></div>
${overview}
${elementsPage}
${worldPage}
${spectaclePage}
${buildPage}
</main></div></body></html>
`;

mkdirSync(cardDir, { recursive: true });
writeFileSync(path.join(cardDir, 'index.html'), html, 'utf8');
console.log(`Wrote ${path.relative(repo, path.join(cardDir, 'index.html'))}`);
console.log(`  ${esc(version)}: ${pillars.rows.length} pillars, ${elements.rows.length} elements, ${firstRules.rows.length}+${laterRules.rows.length} rules, ${milestones.rows.length} milestones, ${openDecisions.rows.length} open decisions`);
