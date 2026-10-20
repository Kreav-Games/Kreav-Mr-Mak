# 10 — UI, HUD and UX (direction §4)

## HUD layout

| Position | Element |
|---|---|
| Top centre | Compass 800 × 48 with PvP indicators and objective markers; transient notifications (quests, PvP flagging) |
| Top right | Minimap 240 × 240, toggleable; extraction points and flagged overlays |
| Top left | Player name, level, active buffs and debuffs |
| Bottom left | Vitals: health bar (large), stamina ring, hunger %, hydration %, temperature gauge, neural stability bar |
| Bottom centre | Hotbar: 12 slots, keys 1 to 9, 0, − and =; each shows its key, icon, count and, for a weapon, the rounds in its magazine; the slot in the hands lit (D-25) |
| Bottom right | Weapon: icon, magazine/total ammo, fire mode, attachment icons (420 × 120); the hotbar replaces the quick-use wheel that was here (D-25) |
| Centre | Dynamic crosshair (scalable), hit markers, damage numbers, weak-point indicators |
| Death screen | Drop list, respawn options, recovery timer, teammate ping |

```json
{
  "hud": {
    "compass":   {"pos": "top_center",   "size": "800x48"},
    "minimap":   {"pos": "top_right",    "size": "240x240"},
    "vitals":    {"pos": "bottom_left",  "elements": ["health", "stamina", "hunger", "hydration", "temp", "neural"]},
    "hotbar":    {"pos": "bottom_center", "slots": 12},
    "weapon":    {"pos": "bottom_right", "size": "420x120"}
  }
}
```

## Menus and flows

- Character creation: full-screen MetaHuman preview with morph sliders and real-time facial animation.
- Inventory: grid with a weight limit, equipment slots (head, chest, legs, back) and the hotbar row; quick-craft
  recipes; filter by type (D-25).
- Map: layers for PvP zones, resource nodes and dungeon entrances; zoom levels.
- Quest log: objectives, stages, lore entries, map markers.
- Accessibility: scalable UI, colour-blind modes, subtitle sizes, controller remapping.

## Loading screens and cinematics

- Loading: dynamic tips, server PvP hotspot status, last known base, active quests, MetaHuman close-ups
  with subtle facial animation.
- Cinematics: Sequencer with MetaHuman facial animation and audio events (Wwise later, D-05).

## Build notes

- Built with **Easy Game UI Ultimate 3.0** (D-21, [reference](../easy-game-ui.md)): menus, options, save
  system and the HUD toolkit; the points below apply on top of it.

- UMG with CommonUI for menus and controller navigation; the HUD as widgets bound to replicated
  attributes through a view model (the MVVM plugin is available).
- Pixel sizes are at 1920 × 1080 and scale with the DPI curve; the HUD JSON drives anchors so layout is
  data.
- The look (D-31, 2026-10-19, superseding D-25's MSS look): The Division 2's menus and HUD with ARK's layout for the
  survival screens; the style guide and mock-ups are in [ui-design.md](../ui-design.md) and `docs/ui/`. Before that:
  the Multiplayer Shooter System's weapon selector (its borders, text styles, colours and font; D-25);
  Easy Game UI's global styling is set to match.
- Prototype UI: the hotbar, weapon panel, crosshair and hit markers, the inventory screen, main and pause menus and
  options (P4, built 2026-10-16: the HUD and inventory screen are Tharrn's C++ widgets in MSS's look, the menus Easy
  Game UI's); the vitals cluster (health, stamina, hunger, hydration, temperature; neural stability's bar comes with
  its effects), the crafting panel in the inventory screen and the death screen (P5, built 2026-10-16); the map (P6);
  the rest later. The layout lives in
  the Widget Blueprints (`Tools/UI/build_ui.py`); `Data/UI/HudLayout.json` is the design's sketch.

## From the owner's package ([owner's package review](../reviews/owner-package-2026-10-15.md))

Adds a centred **dynamic crosshair with variants** `default`, `precision`, `suppressed`. Twelve HUD icons
are planned at 256 × 256 PNG (ammo, compass, crosshair, health, hunger, hydration, minimap, neural,
quick wheel, stamina, temperature, weapon); placeholders drawn in [deliverable 8](../deliverables/08-hud.md).
