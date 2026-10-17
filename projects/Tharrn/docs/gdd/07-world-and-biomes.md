# 07 — World and biomes (direction §3.1–3.2)

## Scale and layout

- The main map is **an island of about 100 km²** (D-26, D-27, 2026-10-17; D-14 had about 75, the direction 16–25 km²):
  the 15 zones, 2.56 km each, with sea all around; streamed with World Partition. Proposed layout, a biome per zone:
  [picture](../pictures/p6/main_map_layout.png).
- Biome order: **Coastal → Fungal Forest → Crystalline Desert → High-Gravity Plateau →
  Subterranean Caverns → Floating Archipelagos (endgame)**, easiest to hardest.
- Starting locations (D-28, 2026-10-17): a new player picks where to start, one or two starting locations in each
  region, by the difficulty they want (the zone's recommended level). Proposal in the game's `Data/StartLocations.csv`
  (OQ-16): 8 starts, none in the Floating Archipelagos.
- 6 hub towns with safe services, vendors and mission boards.
- 8–12 PvP hotspots of varying size, each surrounded by an amber buffer belt.

## Biomes

| Biome | Features | Resources | Threats |
|---|---|---|---|
| Coastal (starter) | Wreckage, shallow pools, small fauna | Organic, low-tier minerals | Skitter packs, tidal storms |
| Fungal Forest | Bioluminescent flora, spore clouds | Biotech cores, organic fibre | Spore bloom, Lumivine Colossus |
| Crystalline Desert | Crystal fields, gravity anomalies | Energy crystals, alloy veins | Sand raptors, grav raptors |
| High-Gravity Plateau | Heavy fauna, slow movement | Rare alloys | Heavy grazers, territorial titans |
| Subterranean Caverns | Oxygen limits, echo swarms | Alien cores, rare minerals | Echo Swarm, cave collapses |
| Floating Archipelagos | Aerial traversal, PvP warzones | Endgame blueprints | Aerial predators, faction fortresses |

## Build notes

- **World building** stays within the D-11 budget.
- **Prototype biome: Coastal**, a slice of about 1–2 km² first, built to full quality, then extended.
- **Assets:** the Sci-Fi Complete Bundle has jungle, arctic, dry, volcanic and moon kits (cliff sets as
  level instances, alien flora, fog, water, planets in the sky) and shore formations for several of them
  (`ShoreFormation`, `ShorePools`). Each Tharrn biome is assembled from the bundle's biome presets the way its
  example level is ([how](../scifi-bundle.md#how-the-biomes-look-and-are-assembled-2026-10-17)): Coastal ← Jungle Shore, Jungle Swamp and Jungle with
  the jungle shore formations and water; Fungal Forest ← Jungle (hollow and fungus-like trees, plants that glow at
  night) and Jungle Swamp; Crystalline Desert ← Desert, Desert Grass, Desert Acid and Moon plus crystal materials;
  High-Gravity Plateau ← Columnar and Moon with the desert mountain sets; Caverns need underground kits (gap);
  Floating Archipelagos ← the jungle's floating islands.
- **Terrain:** real coastal lidar through `Tools/Terrain` where a landform fits, generated terrain
  elsewhere (OQ-06); the ocean needs its own test (OQ-05). Subterranean caverns cannot be Landscape
  (no overhangs): meshes or Mesh Terrain, decided when the biome is built.
- **Floating Archipelagos** are separate streamed sub-levels or a second World Partition map reached by
  vehicle or gate (direction §1.6 expansions), not one continuous heightfield.

## From the owner's package ([owner's package review](../reviews/owner-package-2026-10-15.md))

A first zone map (deliverable 2): 15 zones on a grid: 2 safe hubs (Coastal Outpost, Remnant Research Hub),
7 open PvE zones, 5 flagged PvP zones (Skitterjaw Hollow, Crystal Expanse, Echo Caverns, Floating
Archipelago A, Contested Ruins) and one amber buffer, each with a loot tier, spawn timer and recommended
level (1 to 30). Columns:

```
zone_id;name;type;bounds_min_x;bounds_min_y;bounds_max_x;bounds_max_y;pvp_flag;entry_consent_buffer_seconds;exit_cooldown_seconds;loot_tier;spawn_timer_seconds;recommended_level;notes
```

**Scale (D-27):** the owner's map is scaled by 0.5, so each zone is 2.56 × 2.56 km and the 15 zones cover 98.3 km²
(bounding box 15.4 × 10.2 km), sea all around (D-14 had 0.4375 and 75.3 km²); the source is the game repo's
`Data/Zones.csv` (imported into `DT_Zones`). Open
points: buffer belts around every PvP zone (the direction asks for them; the draft has one),
and hubs that border PvP zones directly. The direction asks for 6 hubs and 8–12 hotspots; the draft has 2
and 5.
