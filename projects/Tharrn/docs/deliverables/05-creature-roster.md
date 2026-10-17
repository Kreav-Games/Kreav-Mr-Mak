# Deliverable 5 — Creature roster (first six of 30)

Version 0.1, 2026-10-15. The direction asks for a creature CSV of 30 entries (§5.6). The game's
`Data/Creatures.csv` has the owner's first three; the direction names three more (GDD 08). **Proposal for the owner:**
full rows for those three, and the columns P7 needs (weak points, stagger), so the Prototype's three creatures
(Skitterjaw, Phase Warden, Grav Raptor) can be built from data. The other 24 come with the alpha's biomes.

Units: health in points; armour Light = cloth 10 %, Medium = composite 30 %, Heavy = alloy 50 % less damage;
resistances are fractions of that damage type removed; aggro radius in metres.

## 1. Rows

| id | name | biome | size | hp | armor | resistances | aggro_radius | loot_table | ai_profile | Source |
|---|---|---|---|---|---|---|---|---|---|---|
| CR001 | Skitterjaw | Crystalline Desert | Small | 120 | Light | acid:0.2;fire:0.1 | 12 | organic_fiber;teeth | skitter_ai_v1 | Owner |
| CR002 | Lumivine Colossus | Fungal Forest | Large | 420 | Heavy | poison:0.5;fire:0.2 | 20 | biolum_core;sap | lumivine_ai_v1 | Owner |
| CR003 | Phase Warden | Crystalline Desert | Medium | 260 | Medium | energy:0.4 | 18 | alloy_shard | phase_warden_ai | Owner |
| CR004 | Grav Raptor | Crystalline Desert | Medium | 180 | Light | — | 35 | talon_membrane | grav_raptor_ai | Direction (hp, loot); **rest proposed** |
| CR005 | Echo Swarm | Subterranean Caverns | Swarm | 300 | Light | fire:-0.5;energy:0.3 | 15 | swarm_gland | echo_swarm_ai | Direction (hp, loot); **rest proposed** |
| CR006 | Apex Titan | Subterranean Caverns | Boss | 4200 | Heavy | acid:0.2;energy:0.2;fire:0.2 | 40 | boss_blueprint;alien_core;rare_alloy | apex_titan_ai | Direction (hp), dungeon DGN_001 (loot); **rest proposed** |

Notes:

- **Grav Raptor** notices you from 35 m because it circles high above ([deliverable 9](09-creature-behaviour.md)).
- **Echo Swarm:** a negative resistance is a weakness: fire does 50 % more, so fire damage (the thermal core,
  [deliverable 7](07-weapons-and-attachments.md)) is the answer to swarms.
- The `ai_profile` names follow the owner's pattern (`skitter_ai_v1`); the direction's own names (`pack_flank`,
  `glide_dive`, …) describe the same behaviours.

## 2. Columns P7 adds

| id | weak_point | weak_point_mult | stagger_threshold | stagger_seconds | move_speed | Notes |
|---|---|---|---|---|---|---|
| CR001 | head | 2.0 | 60 | 1.2 | 6.5 | Faster than a running player (5 m/s), slower than a sprint (7 m/s): you escape a pack only while your stamina lasts |
| CR003 | crystal_core (chest) | 2.5 | 120 | 1.5 | 4.0 | The core glows while the shield is down |
| CR004 | wing_membrane | 2.0 | 70 | 2.0 (falls) | 14.0 flying, 3.0 on the ground | Staggered in a dive, it crashes and stays exposed |

Stagger threshold is damage taken within 3 seconds; move speed in m/s. All **Proposal**.

## 3. Still to write

24 entries for the alpha's biomes (High-Gravity Plateau grazers and titans, cavern fauna, aerial predators of the
Floating Archipelagos, coastal small fauna), with the owner's direction on the look of each biome first.
