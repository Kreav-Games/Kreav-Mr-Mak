# Iron Clash

A 3D robot fighting RPG built with Babylon.js, TypeScript and Vite. `index.html` is the playable single-file build.

## Build

```
cd source
npm install
npm run build   # type-checks, bundles, and writes ../index.html
npm run dev     # local dev server
```

## Layout

- `source/src/data` — parts (48 designs, 6 rarities), classes and skill trees, moves, 30 opponents, leagues, challenges, daily templates
- `source/src/core` — save data, build-to-stats math, economy (loot, shop, upgrades, tournaments, rankings)
- `source/src/render` — procedural robot models, materials, five arenas, particle effects, garage scene
- `source/src/combat` — fighter state machine, animation, AI personalities and bosses, match flow and tutorial
- `source/src/ui` — menus, HUD, styles; `source/src/input` — keyboard, mouse and touch; `source/src/audio` — synthesized sound and music
- `source/src/net/protocol.ts` — message shapes for a future online mode (no server included)
