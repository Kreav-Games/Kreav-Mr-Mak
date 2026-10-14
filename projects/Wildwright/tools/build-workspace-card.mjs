#!/usr/bin/env node
// Generates the Wildwright Workspace hub from the Markdown design record.
//
//   node projects/Wildwright/tools/build-workspace-card.mjs
//
// Sources of truth: docs/02-gdd.md (design), docs/04-decisions.md (decisions) and
// README.md (status: "Where things stand", "Next actions"). Edit those, then re-run.
// The script fails loudly if a table or section it needs is missing, so a
// restructured GDD cannot silently produce a stale card.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(here, '..');
const repo = path.resolve(project, '..', '..');
const cardDir = path.join(repo, 'workspace', '2026-10-11_wildwright');
const DOCS = '../../projects/Wildwright/docs/';
const norm = s => s.replace(/\r\n/g, '\n');
const read = file => norm(readFileSync(path.join(project, 'docs', file), 'utf8'));
const gdd = read('02-gdd.md');
const decisions = read('04-decisions.md');
const readme = norm(readFileSync(path.join(project, 'README.md'), 'utf8'));
// This copy is a card preview; the owner guide in docs remains authoritative.
const fireGuide = read('09-hero-cast-owner-guide.md').replace(/\]\((\d\d-[^)]+\.md(?:#[^)]*)?)\)/g,
  (_, target) => '](' + DOCS + target + ')');

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
const tableHtml = (t, { classes = '', cell = {}, rowClass = () => '' } = {}) => {
  const head = t.header.map(h => `<th>${inline(h)}</th>`).join('');
  const body = t.rows.map(r => {
    const cls = rowClass(r);
    return `<tr${cls ? ` class="${cls}"` : ''}>${r.map((c, i) => `<td>${(cell[i] || inline)(c, r)}</td>`).join('')}</tr>`;
  }).join('');
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

// ---------------------------------------------------------------- source data
const version = (gdd.match(/GDD \d+\.\d+/) || ['GDD'])[0];
const pillars = get('### 2.1 ', 'table');
const contractTable = get('### 2.2 ', 'table');
const contractRules = get('### 2.2 ', 'ol');
const loop = get('### 2.4 ', 'p');
const timeScales = get('### 2.5 ', 'table');
const elements = get('### 3.2 ', 'table');
const targetKinds = get('### 3.3 ', 'table');
const model = get('### 3.4 ', 'table');
const rules = get('### 3.5 ', 'table');
const processes = get('### 3.6 ', 'table');
const matrix = get('### 3.9 ', 'table');
const scars = get('### 4.1 ', 'ul');
const changeClasses = get('### 4.2 ', 'table');
const tiers = get('### 4.4 ', 'table');
const cells = get('### 4.5 ', 'table');
const materials = get('### 4.6 ', 'table');
const earthSteps = get('### 4.7 ', 'ol');
const profiles = get('### 4.7 ', 'table');
const water = get('### 4.8 ', 'ul');
const fire = get('### 4.9 ', 'ul');
const succession = get('### 4.10 ', 'table');
const language = get('### 5.2 ', 'table');
const heroCast = get('### 5.3 ', 'table');
const sellChange = get('### 5.6 ', 'p');
const session = get('### 6.2 ', 'table');
const mvpScope = get('### 14.1 ', 'table');
const cap = get('### 14.2 ', 'table');
const milestones = get('### 14.3 ', 'table');
const steps = get('### 14.4 ', 'table');
const proof = get('### 14.5 ', 'ol');
const retired = get('### 14.8 ', 'table');
const openDecisions = get('## 16. ', 'table');
const decided = pick(section(decisions, '## Decided'), 'table');
const standing = pick(section(readme, '## Where things stand'), 'table');
const nextActions = pick(section(readme, '## Next actions'), 'table');

need(elements.rows.length === 4, 'Expected four elements');
need(rules.rows.length === 6, 'Expected six MVP cast rules (GDD 3.5)');
need(milestones.rows.length >= 2, 'Expected MVP milestones in GDD 14.3');
need(proof.items.length === 9, 'Expected the nine-step technical proof (GDD 14.5)');

const milestoneDone = r => /^done/i.test(plain(r[2]));
const nextMilestone = milestones.rows.find(r => !milestoneDone(r));
const doneCount = milestones.rows.filter(milestoneDone).length;
const milestoneName = r => plain(r[0]).replace(/^MVP-\d+\s*/, '');
const milestoneId = r => (plain(r[0]).match(/^MVP-\d+/) || [plain(r[0])])[0];
const acceptedRules = rules.rows.filter(r => /^accepted/i.test(plain(r[4]))).length;
const isDoneAction = r => r.some(c => c.includes('~~'));
const doneMark = '<span class="done-mark" aria-hidden="true">✓</span>';
const firstStep = steps.rows[0];
const art = 'images/wildwright-cover-v1.png';
const source = '<a href="' + DOCS + '02-gdd.md" target="_blank" rel="noopener">GDD source ↗</a>';
const tabs = [
  ['overview', 'Vision'], ['world', 'World'], ['elements', 'Elements'],
  ['play', 'Play'], ['spectacle', 'Spellcraft'], ['build', 'Build'],
];
const glyph = {
  fire: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4-3 5-3 9a3 3 0 0 0 6 0c0-1-.5-2-1-3 3 1 5 4 5 7a7 7 0 0 1-14 0c0-6 7-8 7-13z"/></svg>',
  water: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5s6 6.2 6 10.5a6 6 0 0 1-12 0C6 8.7 12 2.5 12 2.5z"/></svg>',
  earth: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 20 9 7l4 7 3-4 6 10z"/></svg>',
  air: '<svg viewBox="0 0 24 24" aria-hidden="true" class="stroke"><path d="M3 9h11a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3M3 19h7"/></svg>',
};
const pageHead = (label, title, desc) => '<div class="page-heading"><div><div class="eyebrow">' + label + '</div><h1>' + title + '</h1></div><p>' + desc + '</p></div>';
const panel = (id, body) => '<section class="game-page" id="' + id + '" role="tabpanel" aria-labelledby="nav-' + id + '" tabindex="0"' + (id === 'overview' ? '' : ' hidden') + '>' + body + '</section>';
const statusLabel = text => '<span class="status-label ' + (/accepted|done/i.test(plain(text)) ? 'accepted' : 'planned') + '">' + inline(text) + '</span>';
const details = (title, content) => '<details class="design-details"><summary>' + title + '</summary><div>' + content + '</div></details>';
const nextCard = '<article class="next-build"><div><span class="eyebrow">Next · ' + esc(milestoneId(nextMilestone)) + ' ' + esc(milestoneName(nextMilestone)) + '</span><h2>' + inline(firstStep[0]) + '</h2><p>' + inline(firstStep[2]) + '</p></div><div><span class="eyebrow">Accepted when</span><p>' + inline(firstStep[3]) + '</p><button class="text-action" data-open="build">Open the build order →</button></div></article>';
const hero = '<figure class="cover-hero"><img src="' + art + '" width="1672" height="941" alt="Wildwright cover concept: a solitary spellcrafter guides water into scorched ground in a misty mountain valley at dawn." fetchpriority="high" decoding="async"><figcaption><span>Original cover concept · owner review</span><a href="cover.html">View cover &amp; source ↗</a><a href="' + art + '" download>Download PNG ↓</a></figcaption></figure>';
const card = (eyebrow, title, body) => '<article class="note-card"><div class="eyebrow">' + eyebrow + '</div><h2>' + title + '</h2>' + body + '</article>';

// ---------------------------------------------------------------- pages
const overview = panel('overview', `
${hero}
<div class="vision-intro"><div><div class="eyebrow">One valley. Four forces. Scars, not resets.</div><h1>Shape the valley.<br>See what it becomes.</h1></div><p>Cut channels, raise berms, burn, douse and turn the wind. The valley keeps what you did and recovers on its own terms.</p></div>
<div class="progress-ribbon"><span><i class="phase-dot"></i>${esc(milestoneId(milestones.rows[0]))} done · ${esc(milestoneId(nextMilestone))} next</span><span><b>${acceptedRules} / ${rules.rows.length}</b> cast rules accepted (on objects)</span><a href="../../projects/Wildwright/README.md" target="_blank" rel="noopener">Current state ↗</a></div>
<div class="project-actions"><button class="primary-action" data-open="world">How the world works <span>→</span></button><button class="secondary-action" data-open="build">What gets built next <span>↗</span></button></div>
${nextCard}
<div class="game-stats"><div><strong>01</strong><span>valley, ~400 m</span></div><div><strong>04</strong><span>element actions</span></div><div><strong>${String(rules.rows.length).padStart(2, '0')}</strong><span>cast rules</span></div><div><strong>${String(processes.rows.length).padStart(2, '0')}</strong><span>world processes</span></div></div>
<div class="editorial-grid">${card('The loop', 'Read. Shape. Return.', '<div class="chip-row">' + arrowChips(loop.text) + '</div><p>The cast is the performance; the changed ground, water and growth are the consequence.</p>')}${card('Scars, not resets · GDD 4.1', 'The valley remembers.', list(scars.items.slice(0, 3)))}</div>
${heading('Where things stand', 'From the README')}
${tableHtml(standing)}
${details('Design pillars', '<div class="pillar-grid">' + pillars.rows.map(r => '<article class="pillar"><span class="pillar-id">' + inline(r[0]) + '</span><h3>' + inline(r[1]) + '</h3><p>' + inline(r[2]) + '</p></article>').join('') + '</div>')}
${details('Owner decisions', tableHtml(decided))}
<p class="project-footnote">Generated from ${source}, the decision log and the README. ${esc(version)}.</p>`);

const worldPage = panel('world', `
${pageHead('World model / GDD 4', 'Cells, earth,<br>water, fire, growth.', 'One authoritative state underneath; terrain, water, vegetation and effects are drawn from it.')}
${heading('Change classes', 'GDD 4.2 · what persists and how it heals')}
${tableHtml(changeClasses)}
<div class="editorial-grid">${card('Earthworks · GDD 4.7', 'Sculpt, stored compactly.', list(earthSteps.items.map(s => s.split('. ')[0].replace(/\*\*/g, '**')), 'ol') + tableHtml(profiles))}${card('Water · GDD 4.8', 'A network decides; the surface follows.', list(water.items.slice(0, 5)))}</div>
<div class="editorial-grid">${card('Fire · GDD 4.9', 'Fuel, dryness, wind and slope.', list(fire.items))}${card('Ground · GDD 4.6', 'Soft earth moves. Bedrock resists.', tableHtml(materials))}</div>
${heading('Succession', 'GDD 4.10 · recovery may become something new')}
${tableHtml(succession)}
${details('Simulation tiers · GDD 4.4', tableHtml(tiers))}
${details('Environmental cell state · GDD 4.5', tableHtml(cells))}
<p class="project-footnote">No voxel terrain and no fluid simulation: plausible, readable approximations. ${source}</p>`);

const elementsPage = panel('elements', `
${pageHead('Elements / GDD 3', 'Four forces.<br>Three kinds of target.', 'Instant cast rules change state once; world processes carry the consequences forward over time.')}
<div class="element-grid">${elements.rows.map(r => { const key = plain(r[0]).toLowerCase(); return '<article class="element-card ' + key + '"><div class="element-glyph">' + glyph[key] + '</div><h3>' + inline(r[0]) + '</h3><p>' + inline(r[1]) + '</p><dl><dt>Acts on</dt><dd>' + inline(r[2]) + '</dd><dt>Later</dt><dd>' + inline(r[3]) + '</dd></dl></article>'; }).join('')}</div>
${heading('Target kinds', 'GDD 3.3')}
${tableHtml(targetKinds)}
${heading('Six cast rules', 'GDD 3.5 · instant, deterministic, with reasons')}
${tableHtml(rules, { classes: 'rules', cell: { 4: statusLabel } })}
${heading('World processes', 'GDD 3.6 · nature runs on its own')}
${tableHtml(processes, { classes: 'rules' })}
${details('Element × target matrix · GDD 3.9', tableHtml(matrix))}
${details('Application sequence · GDD 3.4', tableHtml(model))}
<p class="project-footnote">Thresholds and rates live in CSV data. ${source}</p>`);

const playPage = panel('play', `
${pageHead('Play / GDD 6.2', 'A demo valley<br>worth returning to.', 'About 40 minutes of guided play, then an open sandbox. Every objective has at least two solutions.')}
<div class="session-timeline">${session.rows.map((r, i) => '<article class="session-beat"><span class="beat-number">' + String(i + 1).padStart(2, '0') + '</span><div><span class="eyebrow">' + inline(r[1]) + '</span><h2>' + inline(r[0]) + '</h2><p>' + inline(r[2]) + '</p><p class="beat-proof"><b>The build proves</b> ' + inline(r[3]) + '</p></div></article>').join('')}</div>
${heading('Three time scales', 'GDD 2.5')}
${tableHtml(timeScales)}
<p class="project-footnote">Pacing is a hypothesis to test in MVP-4. ${source}</p>`);

const spectaclePage = panel('spectacle', `
${pageHead('Cinematic spellcraft / GDD 2.2, 5', 'Power with<br>a readable result.', 'Anticipation, release, impact and aftermath, on top of a state layer that decides everything.')}
<div class="layer-flow"><article><span class="eyebrow">Cast layer · transient</span><h2>The performance</h2><p>GAS, montage, camera, Niagara, audio and haptics.</p></article><span aria-hidden="true">→</span><article><span class="eyebrow">Resolver · authoritative</span><h2>The decision</h2><p>Validate, apply a cast rule once, report the reason.</p></article><span aria-hidden="true">→</span><article><span class="eyebrow">State layer · lasting</span><h2>The consequence</h2><p>Cells, earthworks, flow, growth and scars; world processes carry it on.</p></article></div>
${heading('One hero cast', 'Fire · our own effects · MVP-3')}
${tableHtml(heroCast)}
<div class="editorial-grid">${card('Spectacle contract', 'Five rules for every cast.', list(contractRules.items, 'ol'))}${card('Selling world change · GDD 5.6', 'Expensive only where it is seen.', '<p>' + inline(sellChange.text) + '</p><a class="text-action" href="fire-fx-guide.md" target="_blank" rel="noopener">Owner Niagara learning track ↗</a>')}</div>
${details('Two layers, one game', tableHtml(contractTable))}
${details('Element visual and sound language', tableHtml(language))}`);

const buildPage = panel('build', `
${pageHead('Build / GDD 14', 'Prove the hardest<br>technology first.', 'World before spells. Each step is one system with automated checks and an exit check.')}
${nextCard}
<div class="milestone-strip">${milestones.rows.map(r => { const done = milestoneDone(r); const isNext = r === nextMilestone; return '<article class="milestone is-' + (done ? 'done' : isNext ? 'progress' : 'todo') + '"><span>' + esc(milestoneId(r)) + '</span><h3>' + esc(milestoneName(r)) + '</h3>' + statusLabel(done ? 'Done' : isNext ? 'Next' : 'Planned') + '</article>'; }).join('')}</div>
${heading('MVP-1 and MVP-2 build order', 'GDD 14.4 · one system per step')}
<div class="packet-grid">${steps.rows.map((r, i) => '<article class="packet' + (i === 0 ? ' current' : '') + '"><div class="packet-top"><span>' + inline(plain(r[0]).split(' ')[0]) + '</span>' + statusLabel(i === 0 ? 'Next' : 'Planned') + '</div><h2>' + inline(r[0].replace(/^[\d.]+\s*/, '')) + '</h2><p>' + inline(r[2]) + '</p><dl><dt>Depends on</dt><dd>' + inline(r[1]) + '</dd><dt>Accepted when</dt><dd>' + inline(r[3]) + '</dd></dl></article>').join('')}</div>
<div class="editorial-grid">${card('MVP-1 acceptance · GDD 14.5', 'The technical proof.', list(proof.items, 'ol'))}${card('Next actions · README', 'What happens now.', tableHtml(nextActions, { classes: 'progress-table', rowClass: r => isDoneAction(r) ? 'is-done' : '', cell: { 0: (c, r) => (isDoneAction(r) ? doneMark : '') + inline(c) } }))}</div>
${details('Milestones and rough sizes · GDD 14.3', tableHtml(milestones))}
${details('MVP definition · GDD 14.1', tableHtml(mvpScope))}
${details('MVP content cap · GDD 14.2', tableHtml(cap))}
${details('Open decisions · GDD 16', tableHtml(openDecisions))}
${details('Retired v0.3 plan · GDD 14.8', tableHtml(retired))}
<article class="handoff"><div class="eyebrow">For the next implementation session</div><h2>Start MVP-1: the world-change proof.</h2><p>Claim the area in the README, take step 1.1 from GDD 14.4, write its brief, then follow the verification ladder. Keep changes uncommitted until the owner authorizes a commit.</p><a href="../../projects/Wildwright/README.md" target="_blank" rel="noopener">Open the current project state ↗</a></article>`);

const html = `<!doctype html>
<html lang="en" data-mak-report="document">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Wildwright · Game direction &amp; build</title>
<link rel="stylesheet" href="../_shared/report.css"><link rel="stylesheet" href="../_shared/examples.css"><link rel="stylesheet" href="wildwright.css">
<script defer src="../_shared/report.js"></script><script defer src="wildwright.js"></script></head>
<body class="game-document"><div class="game-shell">
<aside class="project-rail"><a class="project-brand" href="#overview"><span class="brand-mark" aria-hidden="true">W</span><span>WILDWRIGHT<small>Shape a living valley</small></span></a>
<div class="rail-label">PROJECT FIELD GUIDE</div><nav aria-label="Wildwright sections" role="tablist" aria-orientation="vertical">
${tabs.map(([id, name], i) => '<button role="tab" id="nav-' + id + '" aria-controls="' + id + '" aria-selected="' + (i === 0) + '" data-page="' + id + '"' + (i ? ' tabindex="-1"' : '') + '><span>' + String(i + 1).padStart(2, '0') + '</span>' + name + '</button>').join('\n')}
</nav><div class="rail-note"><span class="phase-dot"></span>${esc(milestoneId(nextMilestone))} · ${esc(milestoneName(nextMilestone))}<p>${doneCount} of ${milestones.rows.length} milestones done<br>Step ${esc(plain(firstStep[0]).split(' ')[0])} next</p></div>
<a class="rail-link" href="cover.html">Cover art ↗</a><a class="rail-link" href="fire-fx-guide.md">Niagara learning track ↗</a>
<a class="rail-link" href="${DOCS}02-gdd.md" target="_blank" rel="noopener">GDD source ↗</a><a class="rail-link" href="${DOCS}04-decisions.md" target="_blank" rel="noopener">Decisions ↗</a>
</aside><main class="game-main"><div class="project-topline"><span>WILDWRIGHT / DEVELOPMENT FIELD GUIDE</span><span class="sample-pill">${esc(version)}</span></div>
${overview}${worldPage}${elementsPage}${playPage}${spectaclePage}${buildPage}
</main></div></body></html>`;

const coverHtml = `<!doctype html>
<html lang="en" data-mak-report="document"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Wildwright · Cover art</title>
<link rel="stylesheet" href="../_shared/report.css"><link rel="stylesheet" href="../_shared/examples.css"><link rel="stylesheet" href="wildwright.css"><script defer src="../_shared/report.js"></script></head>
<body class="cover-document"><main class="cover-main"><a class="back" href="index.html">← Wildwright field guide</a>
<div class="page-heading"><div><div class="eyebrow">Original key art / concept 01</div><h1>Wildwright</h1></div><p>A spellcrafter, a damaged valley, and a change that remains after the cast.</p></div>
<figure class="cover-showcase"><img src="${art}" width="1672" height="941" alt="Wildwright landscape cover with ivory lettering, a water spellcrafter, scorched earth, recovering ferns, stone cliffs and windblown leaves at dawn." decoding="async"><figcaption>Cover concept v1 · 1672 × 941 PNG · click to inspect at full size</figcaption></figure>
<div class="project-actions"><a class="primary-action" href="${art}" download="wildwright-cover-v1.png">Download cover PNG ↓</a><a class="secondary-action" href="../../projects/Wildwright/art/cover-v1.prompt.md" target="_blank" rel="noopener">Open the generation prompt ↗</a></div>
<div class="editorial-grid"><article class="note-card"><div class="eyebrow">The composition</div><h2>The environment is the promise.</h2><p>A readable title anchors the misty sky. Water leads from the traveller into scorched ground and recovering plants. Heat, stone and wind support one coherent valley scene.</p></article><article class="note-card"><div class="eyebrow">Review status</div><h2>A direction to react to.</h2><p>Generated from text with the built-in imagegen tool, without external reference images or Fab assets. This concept does not approve a character, settle OD-06 or represent current Unreal gameplay graphics.</p></article></div>
<p class="project-footnote">Master raster and prompt are preserved. Workspace HTML/CSS and the hub generator remain editable. Later art revisions should retain this v1 rather than overwrite it.</p>
</main></body></html>`;
mkdirSync(cardDir, { recursive: true });
writeFileSync(path.join(cardDir, 'index.html'), html, 'utf8');
writeFileSync(path.join(cardDir, 'cover.html'), coverHtml, 'utf8');
writeFileSync(path.join(cardDir, 'fire-fx-guide.md'), fireGuide, 'utf8');
console.log('Generated Wildwright hub and cover page from ' + version);
console.log(tabs.length + ' sections; ' + rules.rows.length + ' cast rules (' + acceptedRules + ' accepted); ' + processes.rows.length + ' world processes; ' + steps.rows.length + ' build steps; ' + milestones.rows.length + ' milestones');
