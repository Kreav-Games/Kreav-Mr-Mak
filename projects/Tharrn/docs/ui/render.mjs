// Renders the interface mock-ups in docs/ui/ to pictures in docs/pictures/ui/ (1920 x 1080; the style guide its full
// height) with Playwright (Microsoft Edge), so they can be looked at on a phone (the wiki's GUI, UI, Menus tab).
//   node projects/Tharrn/docs/ui/render.mjs [name ...]     e.g. node .../render.mjs mock-hud
import { mkdirSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..', '..', '..', '..');
const require = createRequire(join(repo, 'package.json'));
const { chromium } = require('playwright');
const out = join(here, '..', 'pictures', 'ui');
mkdirSync(out, { recursive: true });

const only = process.argv.slice(2);
const pages = readdirSync(here).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5))
  .filter((n) => !only.length || only.includes(n));
const browser = await chromium.launch({ channel: 'msedge' });
for (const name of pages) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('requestfailed', (r) => errors.push('failed ' + r.url()));
  await page.goto(pathToFileURL(join(here, name + '.html')).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const full = name.startsWith('style-guide');
  await page.screenshot({ path: join(out, name + '.png'), fullPage: full });
  console.log((errors.length ? 'PROBLEM ' : 'ok      ') + name + (errors.length ? ': ' + errors.join('; ') : ''));
  await page.close();
}
await browser.close();
