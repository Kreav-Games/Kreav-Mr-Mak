// Turns dist/index.html into an artifact-ready page (no html/head/body wrapper) at ../index.html
import { readFileSync, writeFileSync } from 'node:fs';
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const head = html.match(/<head>([\s\S]*?)<\/head>/i)[1];
const body = html.match(/<body>([\s\S]*?)<\/body>\s*<\/html>/i)[1];
const keepHead = head
  .replace(/<meta charset[^>]*>\s*/i, '')
  .replace(/<meta name="viewport"[^>]*>\s*/i, '');
const titleMatch = keepHead.match(/<title>[\s\S]*?<\/title>/i);
const rest = keepHead.replace(titleMatch[0], '');
// Title first so it falls in the first 8KB; scripts move after the body markup.
const scripts = [];
const restNoScripts = rest.replace(/<script\b[\s\S]*?<\/script>/gi, m => { scripts.push(m); return ''; });
const out = `${titleMatch[0]}\n<meta name="claude:viewport-fit-sides" content="cover">\n${restNoScripts.trim()}\n${body.trim()}\n${scripts.join('\n')}\n`;
writeFileSync(new URL('../../index.html', import.meta.url), out);
console.log('packed', (out.length / 1024 / 1024).toFixed(2), 'MB');
