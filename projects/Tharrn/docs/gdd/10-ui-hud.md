# 10 — UI, HUD and UX (direction §4)

## HUD layout

| Position | Element |
|---|---|
| Top centre | Compass 800 × 48 with PvP indicators and objective markers; transient notifications (quests, PvP flagging) |
| Top right | Minimap 240 × 240, toggleable; extraction points and flagged overlays |
| Top left | Player name, level, active buffs and debuffs |
| Bottom left | Vitals: health bar (large), stamina ring, hunger %, hydration %, temperature gauge, neural stability bar |
| Bottom centre | Weapon: icon, magazine/total ammo, fire mode, attachment icons (420 × 120) |
| Bottom right | Quick-use wheel, 4 slots with cooldown overlays |
| Centre | Dynamic crosshair (scalable), hit markers, damage numbers, weak-point indicators |
| Death screen | Drop list, respawn options, recovery timer, teammate ping |

```json
{
  "hud": {
    "compass":   {"pos": "top_center",   "size": "800x48"},
    "minimap":   {"pos": "top_right",    "size": "240x240"},
    "vitals":    {"pos": "bottom_left",  "elements": ["health", "stamina", "hunger", "hydration", "temp", "neural"]},
    "weapon":    {"pos": "bottom_center", "size": "420x120"},
    "quickwheel": {"pos": "bottom_right", "slots": 4}
  }
}
```

## Menus and flows

- Character creation: full-screen MetaHuman preview with morph sliders and real-time facial animation.
- Inventory: grid with a weight limit; quick-craft recipes; filter by type.
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
- Prototype HUD: vitals cluster, weapon panel, crosshair with hit markers; the rest later.

## From the owner's package ([owner's package review](../reviews/owner-package-2026-10-15.md))

Adds a centred **dynamic crosshair with variants** `default`, `precision`, `suppressed`. Twelve HUD icons
are planned at 256 × 256 PNG (ammo, compass, crosshair, health, hunger, hydration, minimap, neural,
quick wheel, stamina, temperature, weapon); placeholders drawn in [deliverable 8](../deliverables/08-hud.md).
