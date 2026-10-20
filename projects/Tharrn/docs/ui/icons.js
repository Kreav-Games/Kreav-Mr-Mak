// Tharrn interface icons (draft 1): line icons on a 24 grid, drawn with tokens.css's .ico (2 px, square ends, sharp
// corners). The survival ones are P4's set (docs/deliverables/08-hud-icons) redrawn crisper; the rest are new.
// A mock-up writes <i data-ico="health"></i>; this script swaps each for its SVG.
const THARRN_ICONS = {
  health: '<path d="M12 2.5 20.2 7.25v9.5L12 21.5 3.8 16.75v-9.5Z"/><path d="M12 8v8M8 12h8"/>',
  armour: '<path d="M12 3 4 6v6c0 4.5 3.4 7.6 8 9 4.6-1.4 8-4.5 8-9V6Z"/>',
  stamina: '<path d="M13 2 5 14h6l-1 8 8-12h-6Z"/>',
  hunger: '<path d="M7 3v7M5 3v5a2 2 0 0 0 4 0V3M7 10v11"/><path d="M17 3c-2 2-3 5-3 8h3v10"/>',
  hydration: '<path d="M12 3 6 12a6 6 0 1 0 12 0Z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
  temperature: '<path d="M10 4h4v10a4 4 0 1 1-4 0Z"/><path d="M12 9v8"/><path d="M17 6h3M17 10h3"/>',
  neural: '<path d="M4 12h3l2-5 3 10 2-6 1 1h5"/>',
  weight: '<path d="M6 9h12l2 12H4Z"/><path d="M9 9a3 3 0 0 1 6 0"/>',
  ammo: '<path d="M6 21V9l2-5 2 5v12Z"/><path d="M14 21V9l2-5 2 5v12Z"/><path d="M6 13h4M14 13h4"/>',
  grenade: '<path d="M12 8a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"/><path d="M10 8V5h4v3M14 6l4-2"/>',
  bandage: '<path d="M4 15 15 4l5 5L9 20Z"/><path d="M9.5 12.5h.01M12 10h.01M11 15h.01M14 12h.01"/>',
  ration: '<path d="M4 8h16v12H4Z"/><path d="M4 12h16M9 4h6v4H9Z"/>',
  water: '<path d="M9 3h6v3l2 3v12H7V9l2-3Z"/><path d="M7 13h10"/>',
  organic: '<path d="M5 19C5 10 11 5 20 4c-1 9-6 15-15 15Z"/><path d="M5 19 13 11"/>',
  mineral: '<path d="M8 3h8l4 6-8 12L4 9Z"/><path d="M4 9h16M12 21 9 9l3-6 3 6-3 12"/>',
  alloy: '<path d="M5 9h14l2 8H3Z"/><path d="M8 9 9 6h6l1 3"/>',
  vest: '<path d="M8 3 4 6v15h16V6l-4-3-4 4Z"/><path d="M12 7v14M4 12h16"/>',
  rifle: '<path d="M2 10h15l2-2h3v4h-3l-1 2H10l-1 5H6l1-5H2Z"/><path d="M11 10v4"/>',
  pistol: '<path d="M3 7h16v4H11l-1 6H6l1-6H3Z"/><path d="M11 11v2h2"/>',
  launcher: '<path d="M2 9h14v5H2Z"/><path d="M16 10h5v3h-5M6 14l-1 5h3l1-5"/>',
  compass: '<path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z"/><path d="m12 7 2 7h-4Z"/>',
  map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2Z"/><path d="M9 4v14M15 6v14"/>',
  gear: '<path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
  server: '<path d="M4 4h16v6H4ZM4 14h16v6H4Z"/><path d="M8 7h.01M8 17h.01"/>',
  pvp: '<path d="M5 3 21 19M19 3 3 19"/><path d="M3 16l5 5M16 21l5-5"/>',
  safe: '<path d="M12 3 4 6v6c0 4.5 3.4 7.6 8 9 4.6-1.4 8-4.5 8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
  warning: '<path d="M12 3 2 20h20Z"/><path d="M12 10v4M12 17v.01"/>',
  cold: '<path d="M12 2v20M3 7l18 10M21 7 3 17"/><path d="m9 3 3 3 3-3M9 21l3-3 3 3"/>',
  bleed: '<path d="M12 3 7 11a5 5 0 1 0 10 0Z"/><path d="M15 3v4M19 5v3"/>',
  search: '<path d="M10 3a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z"/><path d="m15 15 6 6"/>',
  sort: '<path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4"/>',
  lock: '<path d="M5 11h14v10H5Z"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  head: '<path d="M7 11a5 5 0 0 1 10 0v6H7Z"/><path d="M5 17h14"/>',
  legs: '<path d="M7 3h10l1 18h-4l-2-11-2 11H6Z"/>',
  back: '<path d="M7 5h10v16H7Z"/><path d="M9 5V3h6v2M7 11h10M10 15h4"/>',
  objective: '<path d="M12 3 21 12 12 21 3 12Z"/><path d="M12 9v6M9 12h6"/>',
  craft: '<path d="M14 4l6 6-3 3-6-6Z"/><path d="M11 7 3 15l3 3 8-8M3 21l3-3"/>',
  star: '<path d="m12 3 3 6 6 1-4.5 4.5L18 21l-6-3-6 3 1.5-6.5L3 10l6-1Z"/>',
};
document.querySelectorAll('i[data-ico]').forEach((el) => {
  const name = el.dataset.ico;
  const cls = el.className ? ' ' + el.className : '';
  el.outerHTML = '<svg class="ico' + cls + '" viewBox="0 0 24 24" style="' + (el.getAttribute('style') || '') + '">' +
    (THARRN_ICONS[name] || '<path d="M4 4h16v16H4Z"/>') + '</svg>';
});
