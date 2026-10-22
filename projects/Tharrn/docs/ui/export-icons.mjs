// Exports the style guide's icons (icons.js) as PNGs for the engine: white lines on a clear background (the game
// tints them), 64 x 64 pixels, the same 2-on-24 stroke, square ends and sharp corners as the mock-ups.
//   node projects/Tharrn/docs/ui/export-icons.mjs <output folder>     e.g. D:/Tharrn/Data/UI/LineIcons
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crc32, deflateSync } from 'node:zlib';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..', '..', '..', '..');
const require = createRequire(join(repo, 'package.json'));
const { chromium } = require('playwright');

const out = process.argv[2];
if (!out) {
  console.error('usage: node export-icons.mjs <output folder>');
  process.exit(1);
}
mkdirSync(out, { recursive: true });
// icons.js defines THARRN_ICONS and then swaps <i data-ico> tags; only the table is needed here.
const source = readFileSync(join(here, 'icons.js'), 'utf8');
const table = source.slice(source.indexOf('const THARRN_ICONS'), source.indexOf('};') + 2);
const icons = new Function(table + '; return THARRN_ICONS;')();

/** A PNG file from RGBA pixels: one IHDR, one IDAT (no filter on each row), IEND. */
function png(rgba, width, height) {
  const chunk = (type, body) => {
    const head = Buffer.alloc(4);
    head.writeUInt32BE(body.length);
    const typed = Buffer.concat([Buffer.from(type, 'ascii'), body]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typed));
    return Buffer.concat([head, typed, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.set([8, 6, 0, 0, 0], 8); // 8 bits, RGBA
  const rows = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    rgba.copy(rows, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(rows)),
    chunk('IEND', Buffer.alloc(0))]);
}

const size = 64;
const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
for (const [name, paths] of Object.entries(icons)) {
  // Every pixel white, the shape only in alpha, so the engine's filtering leaves no dark fringe. A canvas's own PNG
  // export would turn clear pixels black (it stores colours premultiplied), so the file is written here.
  const data = await page.evaluate(async ([paths, size]) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
      stroke="#fff" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">${paths}</svg>`;
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svg);
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, size, size);
    return Array.from(ctx.getImageData(0, 0, size, size).data);
  }, [paths, size]);
  const rgba = Buffer.from(data);
  for (let i = 0; i < rgba.length; i += 4) {
    rgba[i] = rgba[i + 1] = rgba[i + 2] = 255;
  }
  writeFileSync(join(out, name + '.png'), png(rgba, size, size));
}
await browser.close();
console.log('exported ' + Object.keys(icons).length + ' icons to ' + out);
