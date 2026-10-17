// Tharrn HUD icons (deliverable 8, placeholders for P4): writes 12 SVG line icons and renders each to a 256 x 256 PNG
// with a transparent background, white on clear so the HUD can tint them. Also two item icons for the inventory (P4,
// D-25: bandage, armour) until the art direction is set; the game imports them from Data/UI/Icons.
//
//   node projects/Tharrn/tools/build_hud_icons.mjs        (from the Mr. Mak folder; uses Microsoft Edge through Playwright)
//
// Output: projects/Tharrn/docs/deliverables/08-hud-icons/<name>.svg and .png. Change an icon here and run it again.
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'docs', 'deliverables', '08-hud-icons');
const {chromium} = createRequire(join(here, '..', '..', '..', 'package.json'))('playwright');

// 24 x 24 drawings; strokes only unless a shape needs a filled part. Names follow GDD 10's icon list.
const icons = {
  health: '<path d="M12 2.5 20.2 7.25v9.5L12 21.5 3.8 16.75v-9.5Z"/><path d="M12 8v8M8 12h8"/>',
  stamina: '<path d="M13.5 2.5 5.5 13.5h6l-1 8 8-11h-6Z"/>',
  hunger: '<path d="M5 3v5M7 3v5M9 3v5M5 8q0 3 2 3t2-3M7 11v10"/><path d="M17 21V3q-3.5 2.5-3.5 8.5H17"/>',
  hydration: '<path d="M12 3s-6.5 7.5-6.5 11.5a6.5 6.5 0 0 0 13 0C18.5 10.5 12 3 12 3Z"/><path d="M9 15a3 3 0 0 0 2.5 3"/>',
  temperature: '<path d="M10 4a2 2 0 0 1 4 0v9.6a4 4 0 1 1-4 0Z"/><path d="M12 9v7M17 5.5h2M17 8.5h2M17 11.5h2"/>',
  neural: '<circle cx="12" cy="12" r="9.5"/><circle cx="8" cy="9" r="1.8"/><circle cx="16" cy="9" r="1.8"/><circle cx="12" cy="16" r="1.8"/><path d="M9.8 9h4.4M9 10.6l2.1 3.8M15 10.6l-2.1 3.8"/>',
  ammo: [6, 12, 18].map(x => `<path d="M${x - 2} 21V10q0-5 2-7 2 2 2 7v11Z"/><path d="M${x - 2} 17.5h4"/>`).join(''),
  weapon: '<path d="M2 9.5h3v-1h11v.5h6v1.5h-6V12h-1.5l.5 3.5h-2l-.5-3.5H11l-1 4H8l.8-4H5l-3 1Z"/>',
  crosshair: '<circle cx="12" cy="12" r="6.5"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4"/><circle cx="12" cy="12" r=".9" fill="#fff" stroke="none"/>',
  compass: '<circle cx="12" cy="12" r="9.5"/><path d="M12 5l2.5 7-2.5 7-2.5-7Z"/><path d="M12 5l2.5 7h-5Z" fill="#fff"/>',
  minimap: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2Z"/><path d="M9 4v14M15 6v14"/>',
  // Item placeholders (P4, D-25): a bandage strip and a chest plate.
  bandage: '<g transform="rotate(-35 12 12)"><rect x="2.5" y="8.5" width="19" height="7" rx="3.5"/><rect x="9" y="9.5" width="6" height="5" rx="1"/></g><path d="M5.4 11.4h.01M6.6 13.2h.01M17.4 10.8h.01M18.6 12.6h.01"/>',
  armour: '<path d="M7 3.5l5 2 5-2 3 3.5-2 3V20.5H6V10L4 7Z"/><path d="M12 5.5v15M6 13.5h12"/>',
  quickwheel: '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="3.5"/>' +
    [45, 135, 225, 315].map(a => { const r = Math.PI * a / 180, c = Math.cos(r), s = Math.sin(r); return `<path d="M${(12 + 3.5 * c).toFixed(2)} ${(12 + 3.5 * s).toFixed(2)}L${(12 + 9.5 * c).toFixed(2)} ${(12 + 9.5 * s).toFixed(2)}"/>`; }).join(''),
};

const svg = (body, size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${body}</svg>\n`;

mkdirSync(out, {recursive: true});
const browser = await chromium.launch({channel: 'msedge'});
const page = await browser.newPage({viewport: {width: 256, height: 256}, deviceScaleFactor: 1});
for (const [name, body] of Object.entries(icons)) {
  writeFileSync(join(out, `${name}.svg`), svg(body, 24));
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg(body, 256)}</body></html>`);
  await page.locator('svg').screenshot({path: join(out, `${name}.png`), omitBackground: true});
}
await browser.close();
console.log(`[THIcons] ${Object.keys(icons).length} icons in ${out}`);
console.log('[THIcons] RESULT ok');
