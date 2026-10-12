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
const compass = get('### 1.6 ', 'table');
const truth = get('### 1.7 ', 'table');
const pillars = get('### 2.1 ', 'table');
const loop = get('### 2.4 ', 'p');
const contractTable = get('### 2.2 ', 'table');
const contractRules = get('### 2.2 ', 'ol');
const elements = get('### 3.2 ', 'table');
const model = get('### 3.3 ', 'table');
const rules = get('### 3.4 ', 'table');
const ruleContracts = get('### 3.8 ', 'table');
const ruleStatus = get('### 3.9 ', 'table');
const firstRules = { header: rules.header, rows: rules.rows.filter(r => /\*\*M1\*\*/.test(r[5])) };
const laterRules = { header: rules.header, rows: rules.rows.filter(r => !/\*\*M1\*\*/.test(r[5])) };
const acceptedRules = ruleStatus.rows.filter(r => plain(r[1]) === 'Accepted').length;
const variables = get('### 4.2 ', 'table');
const cadence = get('### 4.3 ', 'table');
const memory = get('### 4.4 ', 'ul');
const valley = get('### 4.7 ', 'table');
const language = get('### 5.2 ', 'table');
const heroCast = get('### 5.3 ', 'table');
const session = get('### 6.6 ', 'table');
const evidence = get('### 7.5 ', 'table');
const ecology = get('### 8.6 ', 'table');
const flows = get('### 10.3 ', 'table');
const milestones = get('## 14. ', 'table');
const cap = get('### 14.1 ', 'table');
const packets = get('### 14.4 ', 'table');
const sessionChecks = get('### 14.5 ', 'table');
const next = get('### 16.3 ', 'table');
const openDecisions = get('## 16. ', 'table');
const decided = pick(section(decisions, '## Decided'), 'table');
const milestoneState = r => /^done/i.test(plain(r[3])) ? 'done' : /^in progress/i.test(plain(r[3])) ? 'progress' : 'todo';
const isDoneAction = r => r.some(c => c.includes('~~'));
const isDecided = r => /^\*\*Decided/.test(r[2]);
const doneMark = '<span class="done-mark" aria-hidden="true">✓</span>';
need(elements.rows.length === 4, 'Expected four elements');
need(firstRules.rows.length === 6 && ruleStatus.rows.length === 6, 'Expected six M1 rules and status rows');
need(milestones.rows.length === 7 && packets.rows.length === 8, 'Expected M0–M6 and eight bounded packets');
need(session.rows.length === 6, 'Expected six first-session beats');
const current = packets.rows[0];
const art = 'images/wildwright-cover-v1.png';
const source = '<a href="' + DOCS + '02-gdd.md" target="_blank" rel="noopener">GDD source ↗</a>';
const proposal = '<span class="status-label planned">Proposed build direction</span>';
const tabs = [
  ['overview', 'Vision'], ['direction', 'Play session'], ['elements', 'Elements'],
  ['world', 'Valley'], ['spectacle', 'Spellcraft'], ['build', 'Build'],
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
const routeCard = row => '<article class="route-card"><span class="eyebrow">' + inline(row[0]) + '</span><h3>' + inline(row[1]) + '</h3><p>' + inline(row[2]) + '</p><p class="route-aftermath"><b>Afterwards</b> ' + inline(row[3]) + '</p></article>';
const nextCard = '<article class="next-build"><div><span class="eyebrow">Current build packet · action 6</span><h2>' + inline(current[0].split(' · ')[1]) + '</h2><p>' + inline(current[2]) + '</p></div><div><span class="eyebrow">Accepted when</span><p>' + inline(current[3]) + '</p><button class="text-action" data-open="build">Open the build path →</button></div></article>';
const hero = '<figure class="cover-hero"><img src="' + art + '" width="1672" height="941" alt="Wildwright cover concept: a solitary spellcrafter guides water into scorched ground in a misty mountain valley at dawn." fetchpriority="high" decoding="async"><figcaption><span>Original cover concept · owner review</span><a href="cover.html">View cover &amp; source ↗</a><a href="' + art + '" download>Download PNG ↓</a></figcaption></figure>';

// ---------------------------------------------------------------- pages
const overview = panel('overview', `
${hero}
<div class="vision-intro"><div><div class="eyebrow">One valley. Four forces. Lasting consequences.</div><h1>Shape the valley.<br>Learn what it remembers.</h1></div><p>Become a capable spellcrafter through observation and experiment. Make a route safer, bring water to a useful site, and return to read what changed.</p></div>
<div class="progress-ribbon"><span><i class="phase-dot"></i>M0 complete · M1 in progress</span><span><b>${acceptedRules} / ${firstRules.rows.length}</b> rule effects accepted</span><a href="greybox.html">Play-test instructions ↗</a></div>
<div class="project-actions"><button class="primary-action" data-open="direction">The first playable session <span>→</span></button><button class="secondary-action" data-open="build">What to build next <span>↗</span></button></div>
${nextCard}
<div class="game-stats"><div><strong>01</strong><span>valley</span></div><div><strong>04</strong><span>elements</span></div><div><strong>06</strong><span>core rules</span></div><div><strong>02</strong><span>plant archetypes proposed</span></div></div>
<div class="editorial-grid"><article class="note-card"><div class="eyebrow">The repeatable loop</div><h2>Observe. Change. Return.</h2><div class="chip-row">${arrowChips(loop.text)}</div><p>Knowledge opens useful options. The cast is the performance; the changed ground, route or habitat is the consequence.</p></article><article class="note-card"><div class="eyebrow">Build compass · GDD 1.6</div><h2>A small game with a clear promise.</h2><p>Learn a rule, use it for something useful, then recognize the result when you return. The cover is a visual concept; the current build is the accepted element lab.</p><button class="text-action" data-open="direction">Read the direction →</button></article></div>
${heading('What exists today', 'Accepted foundation and future work')}
${tableHtml(truth)}
${details('Design principles and owner decisions', '<div class="pillar-grid">' + pillars.rows.map(r => '<article class="pillar"><span class="pillar-id">' + inline(r[0]) + '</span><h3>' + inline(r[1]) + '</h3><p>' + inline(r[2]) + '</p></article>').join('') + '</div>' + tableHtml(decided))}
<p class="project-footnote">Generated from ${source} and the decision log. ${esc(version)} · 2026-10-12. Readable sources and cover prompt are preserved; all changes remain local and uncommitted.</p>`);

const direction = panel('direction', `
${pageHead('First playable / design proposal', 'Reach the spring.<br>Choose what changes.', 'A focused 20–30 minute target session, built across M0–M5. The existing lab proves its first interactions.')}
${proposal}
<div class="direction-statement">Learn a rule → choose a route → make a useful intervention → return to its consequence.</div>
<div class="session-timeline">${session.rows.map((r, i) => '<article class="session-beat"><span class="beat-number">' + String(i + 1).padStart(2, '0') + '</span><div><span class="eyebrow">' + inline(r[1]) + '</span><h2>' + inline(r[0]) + '</h2><p>' + inline(r[2]) + '</p><p class="beat-proof"><b>The build proves</b> ' + inline(r[3]) + '</p></div></article>').join('')}</div>
${heading('Two routes, one destination', 'Proposed integration of the existing valley')}
<div class="route-grid">${valley.rows.filter(r => /West brush|East hot/.test(r[0])).map(routeCard).join('')}</div>
<article class="note-card"><h2>Let knowledge do useful work.</h2><p>The first objective needs a valid approach, not every spell. Stream and basin work become optional experiments after reaching the spring. Shelter, plants and the creature enter only when their systems exist.</p></article>
${heading('Why build each feature?', 'GDD 1.6')}
${tableHtml(compass)}
${details('Session acceptance checks', tableHtml(sessionChecks))}
${details('Player-facing flows', tableHtml(flows))}
<p class="project-footnote">Pacing, starting access and detailed outcomes are proposals under CR-002. Open owner decisions remain open. ${source}</p>`);

const elementsPage = panel('elements', `
${pageHead('Elemental rules / current foundation', 'Four forces.<br>Clear consequences.', 'Shared target tags, bounded state and deterministic resolution. Three effects are accepted; three still need implementation.')}
<div class="element-grid">${elements.rows.map(r => { const key = plain(r[0]).toLowerCase(); return '<article class="element-card ' + key + '"><div class="element-glyph">' + glyph[key] + '</div><h3>' + inline(r[0]) + '</h3><p>' + inline(r[1]) + '</p><dl><dt>Works on</dt><dd>' + inline(r[2]) + '</dd></dl></article>'; }).join('')}</div>
${heading('Six rules, tracked honestly', 'GDD 3.9 · accepted versus pending')}
${tableHtml(ruleStatus, {classes:'rule-status', cell:{1:statusLabel}})}
${heading('What each rule owns', 'Accepted behaviour and proposed bounded contracts')}
${tableHtml(ruleContracts, {classes:'rules'})}
<div class="callout"><b>Current limits.</b> Water wets burning fuel without extinguishing it. Steam is an event/message. Save/load, changed route collision, plant response and the remaining effects are pending.</div>
${details('Application sequence', tableHtml(model))}
${details('Full M1 interaction matrix', tableHtml(firstRules, {classes:'rules'}))}
${details('Later combinations · outside the first-playable cap', tableHtml(laterRules, {classes:'rules muted-table'}))}
<p class="project-footnote">Thresholds and rates live in CSV data. Presentation requests state changes and reads results. ${source}</p>`);

const worldPage = panel('world', `
${pageHead('The valley / encounter plan', 'One place worth<br>coming back to.', 'The greybox provides a layout. The next milestones give its routes, water and living patches consequences.')}
${proposal}
<div class="route-grid">${valley.rows.map(routeCard).join('')}</div>
${heading('A small living cast', 'Two proposed plant archetypes · begin with one Mossback')}
${tableHtml(ecology)}
<div class="editorial-grid"><article class="note-card"><div class="eyebrow">Immediate change</div><h2>Read the aftermath.</h2><p>Wet ground darkens. Burnt fuel stays charred. Cooled stone changes tone. These state cues already work in the lab.</p></article><article class="note-card"><div class="eyebrow">Later memory</div><h2>Keep the consequence.</h2><p>M2 must preserve meaningful conditions when the player leaves, returns and reloads. M3 lets plants and the creature react on a timed cadence.</p></article></div>
${details('Regional variables and cadence', tableHtml(variables) + tableHtml(cadence))}
${details('What ecological memory stores', list(memory.items))}
${details('Knowledge evidence', tableHtml(evidence))}
<p class="project-footnote">Route collision and exposure are future integration work. Full fluids, a continent and a large creature roster remain outside the cap. ${source}</p>`);

const spectaclePage = panel('spectacle', `
${pageHead('Cinematic spellcraft / action 6', 'Power with<br>a readable result.', 'Anticipation, release, impact and aftermath. A cast earns its spectacle by making the rule easier to understand.')}
<div class="layer-flow"><article><span class="eyebrow">Cast layer · transient</span><h2>The performance</h2><p>GAS, montage, camera, Niagara, audio and haptics.</p></article><span aria-hidden="true">→</span><article><span class="eyebrow">Resolver · authoritative</span><h2>The decision</h2><p>Validate current conditions, apply bounded rules and report the result.</p></article><span aria-hidden="true">→</span><article><span class="eyebrow">State layer · lasting</span><h2>The consequence</h2><p>Target conditions, materials, routes, ecology and knowledge.</p></article></div>
${heading('One hero cast first', 'Water or fire · choice still open')}
${tableHtml(heroCast)}
<div class="editorial-grid"><article class="note-card"><div class="eyebrow">Spectacle contract</div><h2>Five rules for every cast.</h2>${list(contractRules.items, 'ol')}</article><article class="note-card"><div class="eyebrow">Review the look separately</div><h2>Tactile world. Expressive forces.</h2><p>The cover proposes grounded material detail, dawn atmosphere and restrained elemental light. It is not shipped-game imagery or final character approval.</p><a class="text-action" href="cover.html">View the cover concept ↗</a></article></div>
${details('Two layers, one game', tableHtml(contractTable))}
${details('Element visual and sound language', tableHtml(language))}
<p class="project-footnote">Claude's action 6 research brief is owned separately. Start with <a href="${DOCS}03-feel-reference-valley-of-the-ancient.md" target="_blank" rel="noopener">the feel reference</a>; no licensed reference imagery was used for the cover.</p>`);

const buildPage = panel('build', `
${pageHead('Build direction / bounded packets', 'Build the next proof.<br>Keep the valley small.', 'Every packet names its dependencies, deliverable and exit check. Milestones advance on evidence and owner review.')}
${nextCard}
<div class="milestone-strip">${milestones.rows.map(r => '<article class="milestone is-' + milestoneState(r) + '"><span>' + inline(plain(r[0]).split(' — ')[0]) + '</span><h3>' + inline(plain(r[0]).split(' — ')[1]) + '</h3>' + statusLabel(milestoneState(r) === 'done' ? 'Done' : milestoneState(r) === 'progress' ? 'In progress' : 'Planned') + '</article>').join('')}</div>
${heading('The build path', 'GDD 14.4 · no invented deadlines')}
<div class="packet-grid">${packets.rows.map((r, i) => '<article class="packet' + (i === 0 ? ' current' : '') + '"><div class="packet-top"><span>' + String(i + 1).padStart(2, '0') + '</span>' + statusLabel(i === 0 ? 'Next' : 'Planned') + '</div><h2>' + inline(r[0]) + '</h2><p>' + inline(r[2]) + '</p><dl><dt>Depends on</dt><dd>' + inline(r[1]) + '</dd><dt>Accepted when</dt><dd>' + inline(r[3]) + '</dd></dl></article>').join('')}</div>
${details('Completed work and immediate actions', tableHtml(next, {classes:'progress-table', rowClass:r=>isDoneAction(r)?'is-done':'', cell:{0:(c,r)=>(isDoneAction(r)?doneMark:'')+inline(c)}}))}
${details('Milestone deliverables and evidence', tableHtml(milestones))}
${details('First-playable content cap', tableHtml(cap))}
${details('Open owner decisions', tableHtml(openDecisions, {rowClass:r=>isDecided(r)?'is-done':''}))}
<article class="handoff"><div class="eyebrow">For the next implementation session</div><h2>Start with action 6.</h2><p>Read the README and engineering guide, then the hero-cast research brief when its owner releases it. Pick one cast, claim the files, preserve the resolver and follow the verification ladder. Keep changes uncommitted until the owner authorizes a commit.</p><a href="../../projects/Wildwright/README.md" target="_blank" rel="noopener">Open the current project state ↗</a></article>`);

const html = `<!doctype html>
<html lang="en" data-mak-report="document">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Wildwright · Game direction &amp; build</title>
<link rel="stylesheet" href="../_shared/report.css"><link rel="stylesheet" href="../_shared/examples.css"><link rel="stylesheet" href="wildwright.css">
<script defer src="../_shared/report.js"></script><script defer src="wildwright.js"></script></head>
<body class="game-document"><div class="game-shell">
<aside class="project-rail"><a class="project-brand" href="#overview"><span class="brand-mark" aria-hidden="true">W</span><span>WILDWRIGHT<small>Shape a living valley</small></span></a>
<div class="rail-label">PROJECT FIELD GUIDE</div><nav aria-label="Wildwright sections" role="tablist" aria-orientation="vertical">
${tabs.map(([id,name],i)=>'<button role="tab" id="nav-'+id+'" aria-controls="'+id+'" aria-selected="'+(i===0)+'" data-page="'+id+'"'+(i?' tabindex="-1"':'')+'><span>'+String(i+1).padStart(2,'0')+'</span>'+name+'</button>').join('\n')}
</nav><div class="rail-note"><span class="phase-dot"></span>M1 · Element lab<p>${acceptedRules} of 6 effects accepted<br>First hero cast next</p></div>
<a class="rail-link" href="greybox.html">Greybox &amp; play-tests ↗</a><a class="rail-link" href="cover.html">Cover art ↗</a>
<a class="rail-link" href="${DOCS}02-gdd.md" target="_blank" rel="noopener">GDD source ↗</a><a class="rail-link" href="${DOCS}04-decisions.md" target="_blank" rel="noopener">Decisions &amp; proposals ↗</a>
</aside><main class="game-main"><div class="project-topline"><span>WILDWRIGHT / DEVELOPMENT FIELD GUIDE</span><span class="sample-pill">${esc(version)}</span></div>
${overview}${direction}${elementsPage}${worldPage}${spectaclePage}${buildPage}
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
mkdirSync(cardDir, { recursive:true });
writeFileSync(path.join(cardDir,'index.html'), html, 'utf8');
writeFileSync(path.join(cardDir,'cover.html'), coverHtml, 'utf8');
console.log('Generated Wildwright hub and cover page from ' + version);
console.log(tabs.length + ' sections; ' + acceptedRules + '/6 accepted rules; ' + session.rows.length + ' session beats; ' + packets.rows.length + ' build packets');
