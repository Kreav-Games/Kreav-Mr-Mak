// Exports the THARRN wordmark (the title screen's: wide metal letters with an orange edge, D-36) as a PNG with a clear
// background for the engine, at twice the size the menus show it. Then fills the colour of the fully clear pixels from
// their neighbours (Python, Pillow) so the engine's filtering leaves no dark fringe round the glow.
//   node projects/Tharrn/docs/ui/art/export-wordmark.mjs <output.png>
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..', '..', '..', '..', '..');
const require = createRequire(join(repo, 'package.json'));
const { chromium } = require('playwright');
const out = process.argv[2];
if (!out) {
  console.error('usage: node export-wordmark.mjs <output.png>');
  process.exit(1);
}

const page = await (await chromium.launch({ channel: 'msedge' })).newPage({ viewport: { width: 2000, height: 320 }, deviceScaleFactor: 1 });
await page.setContent(`<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Michroma&display=swap">
  </head><body style="margin:0;background:transparent">
  <svg id="w" width="2000" height="300" viewBox="0 0 980 147" style="display:block">
    <defs>
      <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#eef1f3"/><stop offset=".44" stop-color="#a8b0b7"/><stop offset=".52" stop-color="#5b636b"/>
        <stop offset=".78" stop-color="#8d969d"/><stop offset="1" stop-color="#cdd3d8"/>
      </linearGradient>
      <filter id="edge" x="-10%" y="-30%" width="120%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="b"/>
        <feFlood flood-color="#ff6a13" flood-opacity=".55"/><feComposite in2="b" operator="in" result="g"/>
        <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <text x="490" y="112" text-anchor="middle" font-family="Michroma" font-size="104" letter-spacing="22"
      fill="url(#metal)" stroke="#ff6a13" stroke-width="1.6" paint-order="stroke" filter="url(#edge)">THARRN</text>
  </svg></body></html>`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await (await page.$('#w')).screenshot({ path: out, omitBackground: true });
await page.context().browser().close();
execFileSync('python', ['-c', `
import sys
from PIL import Image, ImageFilter
im = Image.open(sys.argv[1]).convert('RGBA')
rgb = im.convert('RGB').filter(ImageFilter.MaxFilter(9))
alpha = im.getchannel('A')
clear = alpha.point(lambda a: 255 if a == 0 else 0)
out = Image.composite(rgb, im.convert('RGB'), clear)
out.putalpha(alpha)
out.save(sys.argv[1])
`, out]);
console.log('wrote ' + out);
