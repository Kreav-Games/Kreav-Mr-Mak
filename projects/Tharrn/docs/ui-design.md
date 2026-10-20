# The interface: GUI, UI and menus (2026-10-19)

The owner, 2026-10-19: "this chat is now for design and implementation of the games GIU, UI and Menu's, here we will
design and make top triple A quality game interface, Loading screen ect." Direction: "The Division 2 menus and HUD idea
with Ark survival type layout for the survival aspect, as this is a FPS / Survival" (D-31). The wiki's GUI, UI, Menus
tab shows this page's progress and pictures.

## 1. Direction

- **The Division 2's menus and HUD:** calm dark glass over the world, one signal colour, condensed capitals, numbers you
  read at a glance; the HUD in the corners, tilted a little as if it floats beside the player, fading when it has
  nothing to say; full-screen menus with tabs across the top (Q and E) and a card for the selected thing.
- **ARK's layout for the survival parts:** the inventory with the backpack left, the character and what is worn in the
  middle with the survival stats, the other side (an item, a container, a crafting station) right; hunger, hydration
  and temperature beside health with their values.
- **Honest data:** every number comes from the game's real state and data; a feature not built yet is labelled, not
  drawn as if it were.
- The style is Tharrn's own (Exodus orange, Barlow type, its own icons), not copied art; Barlow is under the SIL Open
  Font License, so it can ship with the game.

Sources: `docs/ui/` holds the style guide's tokens and parts (`tokens.css`, `icons.js`), the mock-ups (`*.html`, drawn
over in-game captures in `docs/ui/backdrops/`) and `render.mjs`, which turns them into pictures in `pictures/ui/`
(`node projects/Tharrn/docs/ui/render.mjs`).

## 2. Progress

| Step | What | State |
|---|---|---|
| U1 | Style guide: colour, type, panels, buttons, rows, item slots, bars, icons, HUD layout, motion, sound | Doing: draft 1, 2026-10-19, for the owner's review |
| U2 | Mock-ups of the main screens over in-game captures: HUD, inventory, main menu, loading screen | Doing: draft 1, 2026-10-19 |
| U3 | Shared parts in the engine: the tokens as UMG styles, Barlow imported, the icon set, buttons, rows, slots, bars, prompts and toasts as C++ widget classes with Blueprint looks | Next |
| U4 | Main menu (with a live 3D scene behind) and loading screen | Later |
| U5 | HUD rebuilt in the new style | Later |
| U6 | Inventory and crafting in ARK's layout | Later |
| U7 | Pause menu, options (Easy Game UI, D-21), death and respawn, starting-location picker (D-28) | Later |
| U8 | Map, journal, character creation | Later |

## 3. Pictures

- ![The style guide (draft 1): principles, colour, type, panels, buttons and rows in their states, item slots, bars, icons, the HUD layout, motion and sound](pictures/ui/style-guide.png)
- ![HUD mock-up: the player, health, survival meters and minimap bottom left; the weapon bottom right; the objective top left; the compass with the zone and time; a pick-up prompt and the loot feed (the game's real items and values)](pictures/ui/mock-hud.png)
- ![Inventory mock-up in ARK's layout: the backpack (30 slots) left, the character with head, chest, legs and back in the middle with the survival stats, the selected item's card right, the hotbar below](pictures/ui/mock-inventory.png)
- ![Main menu mock-up: the world behind (a live 3D scene in the game), the list at the left, what is in this build at the right](pictures/ui/mock-main-menu.png)
- ![Loading screen mock-up: where you are going, big, with its zone, type, level and loot from the zone data, a survival tip, the progress](pictures/ui/mock-loading.png)
