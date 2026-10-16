# Tharrn — GDD 0.1, overview

Version 0.1, 2026-10-15: the owner's direction document
(`../../source/Aetherfall_Exodus_Direction_2026-10-15.md`, D-02) split into modules, with build notes for
UE 5.8.3 and the questions it raises. The owner's numbers are kept as written; anything added is marked
as a build note or an open question (`OQ-xx`, see [decisions](../decisions.md)).

## The game

A sci-fi **action-RPG survival shooter** on a vast alien archipelago, single player and multiplayer.
You are an Exodus Initiative operative whose convoy crashed while investigating an alien signal. Survive,
secure an extraction beacon and uncover the mystery, through elite shooter gunfeel, high-stakes survival,
deep RPG dungeons and quests, and flagged PvP hotspots, in a world built to grow with expansions.

| Spec | Value |
|---|---|
| Genre | Sci-fi action-RPG / survival / shooter; single player and multiplayer |
| World | **About 75 km²** (D-14; the direction said 16–25 km²), streamed (World Partition); on foot ≈ 45 min across, vehicles ≈ 15–20 min (targets, OQ-13) |
| Camera | Third person over the shoulder with aim-down-sights (D-15) |
| Progression | Level cap 60; talent trees Combat, Survival, Tech |
| PvP | Flagged on entry to designated zones |
| Characters | MetaHumans for every player and NPC face |
| Networking | Server-authoritative, dedicated servers (D-04) |
| Platforms | PC first; consoles open (OQ-01) |
| Performance | 60 fps on the minimum PC at 1440p DLSS Quality; 120 fps on high-end PCs (D-11) |

## Pillars (from the core promise)

1. **Elite gunfeel.** Recoil curves, weak points, stagger and movement tech that feel precise, on a
   server-authoritative model.
2. **High-stakes survival.** Vitals that change how you fight, resources worth risking a PvP zone for,
   a base to hold.
3. **Deep RPG.** Sixty levels, three talent trees, quests, dungeons, blueprints and loot tiers.
4. **Consensual danger.** PvP only where you choose to go: flagged zones with richer loot.
5. **An extensible world.** Biomes, hubs and endgame regions added as map extensions.

## Modules

| # | Module | Direction § |
|---|---|---|
| 01 | [Player journey](01-player-journey.md): store, first launch, character creation, tutorial, loops, endgame | 1 |
| 02 | [Combat](02-combat.md): fire modes, recoil, accuracy, damage, attachments, stagger, weak points, movement tech | 2.1 |
| 03 | [Survival and base building](03-survival-and-building.md): vitals, formulas, resources, modules, power, decay, claims | 2.2 |
| 04 | [RPG progression and quests](04-rpg-progression.md): levels, XP curve, talents, quest types, loot tiers | 2.3 |
| 05 | [PvP flagged zones](05-pvp-zones.md): flagging, consequences, extraction, anti-abuse | 2.4 |
| 06 | [Vehicles and traversal](06-vehicles.md) | 2.5 |
| 07 | [World and biomes](07-world-and-biomes.md): scale, layout, hubs, six biomes | 3.1–3.2 |
| 08 | [Creatures](08-creatures.md): template, first six, deliverables | 3.3 |
| 09 | [Dungeons](09-dungeons.md): template, rooms, modifiers, bosses | 3.4 |
| 10 | [UI, HUD and UX](10-ui-hud.md): layout, menus, accessibility, loading, cinematics | 4 |
| 11 | [Technical implementation](11-technical.md): art pipeline, MetaHumans, networking, data tables | 5 |
| 12 | [Roadmap, QA and metrics](12-roadmap-qa.md) | 6 |

## How it is built (D-06)

One module at a time through Unreal MCP in the live editor; each module is polished and passes the
verification ladder (engineering guide §3: builds, data, tests, **a server-and-clients test**, budget,
the owner's play-test) before the next begins. C++ for complex systems, Blueprints for simple ones,
notes in both (D-07); data in CSV.

**First: the direction's Prototype** (§6.1, 0–3 months): core shooter feel, vitals, one biome, three
creatures, the MetaHuman base. Its module order is in the [task list](../tasks.md). The scope of the
whole document is a studio's 18-month plan; it is re-planned after the Prototype (OQ-07).

## Deliverables the direction asks for (§5.6)

| # | Artifact | State |
|---|---|---|
| 1 | Full GDD, modularized | **This folder, 0.1** |
| 2 | Zone definition CSV: full map with PvP flags and spawn timers | Owner's draft: 15 zones; scale to settle (GDD 07) |
| 3 | Flagging state pseudocode, expanded | Owner's keys and RPCs (GDD 05); pseudocode to write |
| 4 | MetaHuman JSON schema and 12 presets | Schema and 1 preset (GDD 01) |
| 5 | Creature CSV roster (30 entries) | 3 entries (GDD 08) |
| 6 | Dungeon template pack | 1 draft dungeon (GDD 09) |
| 7 | Weapon CSV and attachment table | 3 weapons (GDD 02); attachments to write |
| 8 | HUD JSON and PNG icon pack | Layout (GDD 10); icons not drawn |
| 9 | Behaviour tree templates and blackboard keys | Skitterjaw outline (GDD 08) |
| 10 | QA test matrix and acceptance criteria | 5 tests (GDD 12) |

The owner's scaffold package (`../../source/owner-package-2026-10-15/`) holds these drafts; see its
[review](../reviews/owner-package-2026-10-15.md).
