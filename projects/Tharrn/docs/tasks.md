# Tharrn — Task list

The current phase and what is next. One line per task; a module is done when it passes the verification
ladder (engineering guide §3) and the owner's play-test (D-06). Game repo paths are under
`D:\Tharrn\`.

## Setup (2026-10-15)

| # | Task | State |
|---|---|---|
| S.1 | New project `D:\Tharrn` from the third-person C++ template, renamed; setup carried over (D-03); packs staged; both targets build; the editor opens with DLSS and MCP; PIE runs | Done |
| S.2 | Design record: direction kept in `source/`, GDD 0.1 modularized (deliverable 1), decisions D-01 to D-13, guide, this list | Done; **owner review** |
| S.3 | Wildwright deleted (D-01) after S.1 was verified | Design record, Workspace card and its entry deleted; **`D:\Wildwright` (31 GB) still on disk**: Claude Code refuses to remove that folder, the owner deletes it in File Explorer |
| S.4 | First commit of the new game repo and the new design record | Done 2026-10-15: game repo fb20fca, Mr. Mak repo 29e9dfc |

## Prototype (direction §6.1: core shooter feel, vitals, one biome, 3 creatures, MetaHuman base)

Proposed order; each module is built server-authoritative from the start (D-04).

| # | Module | Done when | State |
|---|---|---|---|
| P1 | **Foundation:** network test harness (PIE listen server and dedicated-server client, simulated latency and loss), CSV data-table pipeline, automation test scaffolding, a grey test range map | A replicated test actor passes the guide's network step; a CSV row imports and reads back in a test | Next |
| P2 | **Shooter character:** the Game Animation Sample's motion-matched character as the player, third-person aim-down-sights camera (D-15), sprint, crouch, slide, mantle; replicated | Two clients move, slide and mantle smoothly at 100 ms latency | — |
| P3 | **Weapons:** weapon CSV (deliverable 7), SMG and pistol hitscan, one heavy projectile, recoil curves, spread, damage multipliers and armour, server-validated hits with rewind (OQ-09) | Test-range targets; under 2 % desync between two clients; tests for multipliers and armour | — |
| P4 | **Vitals:** health, stamina, hunger, hydration, temperature as attributes; the two formulas; crafting a bandage and ammo; HUD vitals and weapon panel | Thresholds tested; the HUD matches on both clients | — |
| P5 | **Coastal slice:** about 1–2 km² of the starter biome under the protocol (D-10): terrain (OQ-06), ocean test (OQ-05), Sci-Fi bundle shore and jungle kits, sky, budget table | Within the D-11 budget; the owner approves the images | — |
| P6 | **Creatures:** Skitterjaw (desert, D-16), Phase Warden, Grav Raptor (creature CSV, deliverable 5 in part), StateTree behaviour, perception, stagger and weak points | The tutorial fight (creature per OQ-12) works for two clients | — |
| P7 | **MetaHuman base:** the player as a MetaHuman from presets (OQ-03), customisation JSON saved and loaded | A preset choice survives a reload and shows on both clients | — |
| P8 | **Prototype play-through:** crash site → vitals → scavenge and craft → Skitterjaw fight → shelter (foundation, generator, bench) | The owner plays it for 10–15 minutes and calls it fun | — |

## Asked of the owner

- Review GDD 0.1 and the open questions, especially scope (OQ-07), the tutorial creature (OQ-12) and travel times (OQ-13).
- Fab packs for sci-fi armour, hand-held weapons, creatures and weapon animations (OQ-04).
- Later: GitHub access to Unreal Engine source through the Epic account, for dedicated servers (OQ-02).
