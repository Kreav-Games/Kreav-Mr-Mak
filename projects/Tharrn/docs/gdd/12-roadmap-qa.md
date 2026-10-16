# 12 — Roadmap, QA and metrics (direction §6)

## Roadmap

| Phase | Months | Content |
|---|---|---|
| Prototype | 0–3 | Core shooter feel, vitals, one biome, 3 creatures, MetaHuman base |
| Vertical slice | 3–9 | A full dungeon and boss, base building, a flagged PvP zone, one faction questline, co-op extraction |
| Alpha | 9–15 | Several biomes, the creature roster, weapon mods, vehicles, basic multiplayer |
| Beta | 15–18 | Polish, balancing, endgame content, server stress tests |
| Launch and live ops | 18+ | Seasonal events, expansions |

## Acceptance criteria per module

- **Combat feel:** 95th-percentile play-test reports responsive aim; server logs show under 2 % desync in
  controlled tests.
- **Survival balance:** average expedition length matches the design; vitals influence but do not
  punish.
- **PvP zones:** flagging is reliable; extraction interrupts work; combat-logging proxies spawn.
- **MetaHuman fidelity:** facial animation matches voice lines; LOD transitions are seamless.
- **Performance:** 60 fps consoles, 120 fps high-end PC with streaming and HLOD (and D-11's minimum PC).

## Test matrix (sample)

| Area | Tests |
|---|---|
| Combat | Recoil curves, hit registration, latency compensation |
| Survival | Vitals thresholds, resource spawn rates, base decay |
| PvP | Flagging, extraction, loot rules, combat logging |
| AI | Behaviour trees, pack coordination, spawn scaling |
| Network | Tick rates, interest management, rollback |

## Live metrics

Time in PvP zones, dungeon completion rates, loot flow, combat-log incidents, grief reports,
day-1/7/30 retention, server load.

## Build notes

- Each module's "done when" line in its GDD file is the concrete version of these criteria for this
  project; the engineering guide's verification ladder applies to all (D-06).
- "95th-percentile player test" needs play-testers beyond the owner; until then the owner's play-test and
  measured data (desync, frame times) stand in.
- The full test matrix is deliverable 10.

## From the owner's package ([owner's package review](../reviews/owner-package-2026-10-15.md))

First QA tests (deliverable 10):

| ID | System | Case | Pass |
|---|---|---|---|
| QA001 | Combat | AR01 recoil curve | Measured recoil within 5 % of the spec |
| QA002 | Flagging | Enter a PvP zone | Flag and red icon reach nearby clients within 100 ms |
| QA003 | Extraction | An attacker interrupts | Progress stops; the HUD shows it interrupted |
| QA004 | MetaHuman | Load a preset | Morphs and materials match the JSON; save and load round-trips |
| QA005 | Performance | Open-world streaming | No hitch at cell boundaries (read as: no frame more than 10 ms over the median) |
