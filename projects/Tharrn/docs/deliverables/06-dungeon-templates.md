# Deliverable 6 — Dungeon template pack

Version 0.1, 2026-10-15. The direction's dungeon template (§3.4, [GDD 09](../gdd/09-dungeons.md)): 6 room types,
3 puzzle archetypes, 2 trap archetypes, a mini-boss, a final boss, and procedural modifiers. The direction names five
room types and none of the archetypes; **Proposal for the owner:** the sixth room, the archetypes, sizes and the
generator's rules below. The first full dungeon is a vertical-slice goal; the draft *Ruins of the First Signal*
(`Data/Dungeons/DGN_001.json`) is the test case.

## 1. Room templates

Each room is a level instance (`LI_DGN_<Room>_<Variant>`, owner's naming) with one entrance and one or two exits on a
4 m door grid, so any exit fits any entrance. Sizes are floor footprints for a group of 3–4 players.

| Room | From | Footprint | Holds | Target time |
|---|---|---|---|---|
| **Antechamber** (sixth type) | **Proposal** | 20 × 20 m | Entry, a respawn beacon, the dungeon's lore panel, a chest after the boss | 1 min |
| Puzzle room | Direction | 30 × 30 m | One puzzle archetype (below); the exit opens when solved | 4 min |
| Combat arena | Direction | 40 × 40 m, two levels | 2–3 waves, cover, a high route; spawn sockets out of the entrance's sight | 4 min |
| Traversal chamber | Direction | 20 × 60 m | Platforming, gaps, gravity shifts (needs mantle from P2; no slide, D-24) | 3 min |
| Trap corridor | Direction | 8 × 60 m | One trap archetype (below) | 2 min |
| Boss arena | Direction | 50 × 50 m | The boss; arena mechanics per phase (75, 50, 25 % health) | 6 min |

A **mini-boss** is a combat arena variant with one elite instead of waves.

## 2. Puzzle archetypes (Proposal)

Every puzzle needs a crafted item or an environmental trigger (direction), can be solved by one player, goes faster
with several, and keeps its state on the server (D-04).

| Archetype | How it works | Item or trigger |
|---|---|---|
| **Power routing** | Turn conduit junctions so energy reaches the door; a wrong route overloads and resets after 10 s | A crafted power cell starts the flow |
| **Resonance** | Strike crystals in the order of tones heard earlier in the dungeon | Environmental: the tones come from a room before |
| **Gravity alignment** | Flip local gravity to slide heavy blocks onto pressure plates | Environmental gravity switches; a grav anchor (crafted) holds one block |

## 3. Trap archetypes (Proposal)

| Archetype | How it works | Counter |
|---|---|---|
| **Pulse sweep** (timed hazard) | Energy walls sweep the corridor on a fixed rhythm; touching one deals heavy damage | Timing, slide under low sweeps |
| **Sentry scan** (detection) | Scanner beams; being seen locks the doors and spawns a wave | Stay out of the beams, or shoot the scanners' weak points (they return after 20 s) |

## 4. Modifiers

| Modifier | Effect |
|---|---|
| `gravity_shift` | Low gravity (higher jumps, slower falls) or high gravity (shorter jumps, stamina drains faster), rolled per run |
| `fog_of_war` | Sight limited to 15 m; creatures' perception unchanged |
| `enemy_variation` | Creatures swap in variants of the same family (resistances and attacks differ) |
| `time_limit` | A timer for the whole run; the boss chest only opens inside it |

Modifiers are gameplay effects on the dungeon instance (GDD 09 build note).

## 5. Generator rules (Proposal)

```
Generate(dungeon, seed):
    rng = Random(seed)
    rooms = [Antechamber]
    middle = dungeon.rooms if listed in the dungeon's JSON else rng.pick(3..5 of Puzzle, Combat, Traversal, Trap)
    require: at least one Combat arena, at most two rooms of one type in a row
    if len(middle) >= 4: insert a mini-boss arena before the boss
    rooms += middle + [BossArena]
    variant per room = rng.pick(variants of that room type)
    modifiers = dungeon.procedural_modifiers (all of them, or rng.pick 1..2 when the JSON lists more than 2)
    scale creature health and damage to dungeon.recommended_level
    return layout (rooms, variants, modifiers, seed)
```

The server generates the layout when the group enters and streams the rooms to its clients; the same seed always
gives the same dungeon (QA D-01). *Ruins of the First Signal* lists its five rooms and three modifiers, so only the
variants are rolled.

## 6. Data

The dungeon JSON (`Data/Dungeons/DGN_001.json`) gains nothing new; a room template table joins it when dungeons are
built:

```
room_type,variant,level_instance,footprint_m,exits,spawn_sockets,archetype
puzzle_room,puzzle_a,LI_DGN_Puzzle_A,30x30,1,0,power_routing
trap_corridor,trap_d,LI_DGN_Trap_D,8x60,1,0,pulse_sweep
```
