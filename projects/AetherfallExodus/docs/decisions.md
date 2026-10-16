# Aetherfall: Exodus — Decision log

Decisions are binding once listed under **Decided**. Open questions carry a recommendation; none is
binding until moved up. Quotes are the owner's words.

## Decided (by the owner)

| ID | Decision | Date | Notes |
|---|---|---|---|
| D-01 | **Aetherfall: Exodus (working title) is the owner's only active game.** Wildwright is deleted: its Unreal project, design record and Workspace card. | 2026-10-15 | "everything about wildwright is goine to go away, we building a new game now"; chose "Delete it". Its reusable setup was copied first (D-03). |
| D-02 | **The design source is the owner's direction document** (`source/Aetherfall_Exodus_Direction_2026-10-15.md`): a sci-fi action-RPG survival shooter on an alien archipelago, single player and multiplayer, MetaHuman characters, flagged PvP zones, dungeons, talents, vehicles. The GDD (`gdd/`) is that document split into modules with build notes; where they differ, the source document wins until the owner decides otherwise. | 2026-10-15 | Its own deliverable list starts with "Full GDD (this doc modularized)". |
| D-03 | **New project `D:\AetherfallExodus`** (UE 5.8.3 C++, module `AetherfallExodus`), its own private Git repo with LFS, no remote; cooked builds only; Fab assets never redistributed. Carried over from the earlier project: budget and DLSS settings, MCP, the Game Animation Sample and Sci-Fi Complete Bundle, pack staging, plugin check, budget measurement, terrain pipeline, sky, capture subsystem, world-building helpers, engineering notes. | 2026-10-15 | Owner chose "New project, carry the setup over" over converting the old project or starting from nothing. |
| D-04 | **Server-authoritative networking from the first system.** Every system is built replicated and tested with a server and clients (guide §3 step 4) from day one. | 2026-10-15 | Owner chose it over a single-player prototype first. Dedicated server packaging needs a source-built engine (OQ-02). |
| D-05 | **Audio: MetaSounds now, Wwise later.** Unreal's built-in audio for the prototype; Wwise (event names `SFX_`, `MUS_`, `VO_`) once there is real audio content and the owner has an Audiokinetic account. | 2026-10-15 | Owner chose the recommendation. |
| D-06 | **Built iteratively through Unreal MCP in the live editor, one module at a time; each module is polished and tested before the next begins.** World steps that may need rebuilding also stay re-runnable scripts or asset specs. | 2026-10-15 | From the direction document ("Claude → Unreal MCP will build iteratively; each module must be polished and tested before the next begins"). |
| D-07 | **C++ for complex systems, Blueprints for simple ones, both with notes** the owner can follow when adjusting by hand. Data in CSV files imported into data tables. | 2026-10-15 | Carried from the owner's rule of 2026-10-15: "with both c++ and blue prints make sure to have notes so I can understand whats going on". |
| D-08 | **Third-party packs stay outside Git**, staged from the launcher cache by script. Fab assets marked NoAI are never used to generate content (only read, classify, tag or organise). The owner cleared every asset in the Fab library for AI use on 2026-10-15; the launcher still marks *Western Desert Town w/ Construction Tool* as AI-forbidden, so it stays unused until the owner confirms its listing. | 2026-10-15 | Carried rules. Staged: Game Animation Sample (without Echo), Sci-Fi Complete Bundle. |
| D-09 | **No Valley of the Ancient content** (assets, animations, effects, files), and nothing from earlier game projects' designs or lore. The technical setup carried over under D-03 is the exception the owner chose. | 2026-10-15 | Carried owner rule. |
| D-10 | **World building follows the Nanite Landscape Build Protocol** (`source/UE58_Nanite_Landscape_Protocol_ChatGPT_2026-10-15.md`): hero-kit discipline, overdraw rules, World Partition with Packed Level Instances and HLOD, RVT ground blending, PCG seam debris, a budget table and Verification block for every map. Valley of the Ancient is a style reference only (D-09). | 2026-10-15 | Carried; the protocol was written for a 20–40 player survival game, which matches this one. |
| D-11 | **Performance: minimum PC RTX 3060 / Ryzen 5 5600 at 1440p DLSS Quality, 60 fps (16.6 ms)**, split as in protocol §0 (Nanite + base pass ≤ 4.5 ms, shadows ≤ 3.0, Lumen ≤ 3.5, post + upscale ≤ 2, game thread ≤ 6 with 40 characters visible); **120 fps on high-end PCs** (direction §6.2). Consoles are open (OQ-01). | 2026-10-15 | Minimum spec carried from the owner's choice of 2026-10-15; the 120 fps target is the direction's. |
| D-12 | **DLSS 4.5 (NVIDIA plugin 8.8.0) is the upscaler**, TSR without it. | 2026-10-15 | Carried; installed in the engine. |
| D-13 | **AI and MCP plugins stay editor-only; no AI or LLM calls in runtime gameplay.** | 2026-10-15 | Carried rule. |
| D-14 | **The world is about 75 km²**, not the direction's 16–25 km². The owner's zone map is kept and scaled by 0.4375 (bounds in metres): 15 zones of 2.24 × 2.24 km, 75.3 km² in total (`data/zones_definition.csv`). | 2026-10-15 | Owner: "im thinkging more like 75 sq km" (the zone file as written was about 393 km²). The direction's travel times become targets for movement and vehicle speeds (GDD 06). |
| D-15 | **Third-person camera over the shoulder with aim-down-sights.** Resolves OQ-08. | 2026-10-15 | Owner chose the recommendation. |
| D-16 | **The Skitterjaw is a desert creature** (Crystalline Desert). | 2026-10-15 | Owner: "i think skitterjaw is a desert type creature." The direction's tutorial fights a Skitterjaw pack at the coastal crash site: OQ-12. |

## Open questions

| ID | Question | Recommendation |
|---|---|---|
| OQ-01 | Consoles ("60 FPS consoles", direction §6.2) | PC first. Console builds need platform developer accounts, dev kits and their SDKs; decide when the PC prototype is fun |
| OQ-02 | Dedicated servers | Develop with PIE "Play as Client" (a server inside the editor). Packaging a dedicated server needs UE 5.8.3 built from source (GitHub access through the owner's Epic account, about 200 GB and several hours to build); do it before the vertical slice's co-op extraction |
| OQ-03 | MetaHuman character creation with 120 face sliders at runtime (direction §1.3) | MetaHuman Creator is an editor tool; runtime face sculpting on that scale is not something the engine provides as shipped *(not verified for 5.8.3)*. Prototype with the 12 presets plus body scale, materials, tattoos and implants; research runtime face morphs as its own module |
| OQ-04 | Missing art: sci-fi armour, hand-held weapons, creatures (Skitterjaw first), weapon animations for the shooter | The owner picks Fab packs; Claude checks skeleton fit, cost and AI flag before staging |
| OQ-05 | Ocean and coast for the archipelago | Test the Water plugin's ocean early in the Coastal slice (it failed on rivers before); fallback: a custom ocean plane with a single-layer water material |
| OQ-06 | Terrain for 16–25 km² | Real coastal or island lidar through `Tools/Terrain` for the starter area; generated terrain where no real landform fits; decide with the Coastal slice |
| OQ-07 | Scope | The direction is a studio roadmap of 18 months or more (raids, shards, live ops). Build its Prototype first (core gunfeel, vitals, one biome, 3 creatures, MetaHuman base) and re-plan after it |
| ~~OQ-08~~ | ~~First- or third-person camera~~ | Resolved by D-15 |
| OQ-09 | Hit detection and lag compensation | Hitscan validated on the server with rewind of hit boxes, projectiles simulated on the server with client-side prediction; prove with 2 clients and simulated latency in the combat module |
| OQ-10 | Anti-cheat | Server validation from the start (D-04); Easy Anti-Cheat (Epic Online Services) when there is an online build |
| OQ-11 | Day length and time of day | Not specified; propose with the Coastal slice |
| OQ-12 | The tutorial's first fight: the direction puts a Skitterjaw pack at the coastal crash site, but the Skitterjaw is a desert creature (D-16) | A coastal cousin (a "shore skitter" variant on the same rig and behaviour, cheaper than a new creature), or the crash site on the desert's edge, or another first creature; the owner picks |
| OQ-13 | Travel at 75 km² (D-14): the direction's 45 minutes on foot across the map means about 5 m/s average over ~13 km (mostly running); the hoverbike's 15–20 minutes about 11–15 m/s | Keep the times as targets and tune speeds; or relax the walking time to about 60–70 minutes |

## Change log

- 2026-10-15: log started with D-01 to D-13 and OQ-01 to OQ-11.
- 2026-10-15: D-14 to D-16 (world 75 km², camera, Skitterjaw) after the owner's package review; OQ-08 resolved; OQ-12 and OQ-13 opened.
