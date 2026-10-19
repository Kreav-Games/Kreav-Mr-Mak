# The main map: design and build plan (P6, 2026-10-17)

The owner, 2026-10-17: "I want the map to be worked on more until its "AAA" quality and feel. There's alot of
documentation how a map that size should be played out with assets, also remember there's going to be harvesting and
gathering so trees can be cut down, rocks mined, sticks and stones picked up, floral harvested for fibers and edible
things. Keep working the entire map and biomes until they are top notch."

This page is the plan for that: what the research says, the technical set-up, how each region is shaped and dressed,
how harvesting works, and the steps with their checks. Decisions it rests on: D-26 (about 100 km²), D-27 (an island,
15 zones of 2.56 km), D-28 (starting locations by difficulty), D-20 (the Sci-Fi Complete Bundle is the environment
kit), D-04 (the server decides everything).

## 1. What the research says

| Source | What Tharrn takes from it |
|---|---|
| Epic, [Landscape technical guide](https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-technical-guide-in-unreal-engine) | At most 1,024 landscape components; fewer, larger components (127 quads a section, 2 x 2 sections) cost less than many small ones. 100 km² at 1 m between points would need about 3,700 components, so the map uses **2 m** (999 components) and gets its close-up detail from the bundle's virtual textures and displacement |
| Epic, [PCG generation modes](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-pcg-generation-modes-in-unreal-engine) | Partitioned and hierarchical generation for big worlds: large things (trees, boulders) on large grid cells, small things on small cells; run-time generation near players for the smallest; radii growing with each smaller grid |
| The Sci-Fi bundle's guide (KK Design) | Its biome actors are already partitioned and hierarchical; `BP_PCG_Manager` splits the land into tiles that regenerate on their own; rock layers (flat-area rocks, cliffs, slopes, fallen rocks, terraces, mesas) follow the terrain's slope and height, so **the terrain's shape decides where cliffs and spires appear**; paths and clearings by excluders or landscape splines tagged `Path`; Nanite landscape (switched on region by region); four HLOD layers (landscape, foliage, buildings, instanced), built from the command line; trees stop swaying beyond a distance (cheaper shadows); keep the height map free of small spikes; few paint layers a landscape component |
| Far Cry 5 (Ubisoft, GDC 2018: [video](https://gdcvault.com/play/1025557/Procedural-World-Generation-of-Far), [summary](https://80.lv/articles/houdini-procedural-world-generation-of-far-cry-5/)) | About 100 km² of wilderness made believable with procedural tools: erosion and water flow first, then freshwater networks (rivers, lakes), cliffs on steep ground, and plants whose recipes react to the land (slope, height, wetness) and compete for ground |
| Horizon Zero Dawn (Guerrilla, [GDC 2017](https://www.guerrilla-games.com/read/gpu-based-procedural-placement-in-horizon-zero-dawn)) | Placement driven by world data (height, slope, wetness, distance to water and paths) so artists can move a river or a road without re-dressing by hand; the same rules place gameplay things such as plants to gather |
| Replicated instance removal ([forum](https://answers.unrealengine.com/questions/248259/view.html), [a store plugin](https://www.fab.com/listings/b1b32700-116c-4ddc-ac97-9a9777b45f1e)) | Unreal's instanced meshes do not replicate: a cut tree must be hidden on every machine **and** for players who join later, so the server keeps the list of what has been harvested and sends it to each client |

## 2. Technical set-up

| Part | Set-up |
|---|---|
| Level | `/Game/Tharrn/Maps/L_Main`: one World Partition level, its centre at the zones' centre (0, 0) |
| Landscape | 2 m between points; 37 x 27 components of 254 x 254 quads (2 x 2 sections of 127): 18.8 x 13.7 km, the island and about 800 m of seabed around it; heights from -256 to +256 m (Z scale 100); Nanite landscape; the bundle's combined material with its two runtime virtual textures |
| Terrain | Made by Tharrn's terrain tool (`Tools/World/`): the layout's coast, each region's landforms, then erosion (water and slope), rivers and lakes from the water's flow, beaches; the paint from the same data (slope, height, wetness, flow, the region) |
| Sea | The ocean at full size (gotcha 106 is solved first); swimming; the bundle's water for lakes and pools, its river splines for rivers |
| Dressing | The bundle's biome actors under one `BP_PCG_Manager`, tiled, each region with its presets; trees and big rocks made in the editor and saved, debris and small plants at run time around players (Tharrn's network-safe versions, gotcha 95); landscape grass for the finest debris |
| Streaming | World Partition cells, HLODs for landscape, foliage, buildings and the rest; data layers for nature and buildings, as the bundle's example level |
| Budget | 16.6 ms a frame at 1440p on the target tier (D-11) with DLSS; measured with the editor closed |

## 3. The regions

Each region gets landforms that make its biome read from far away, a landmark, its rivers or dry beds, and
the places players go. The bundle's rock layers turn steep ground into cliffs and spires, so steepness is placed on
purpose.

| Region (zones) | Landforms | Landmark | Water | Dressing (bundle presets) |
|---|---|---|---|---|
| Coastal (Z001, Z002, Z014, Z015) | Beaches and dunes, tidal flats and marsh (Shoreline Flats), coves and rocky headlands with sea stacks, low hills | The convoy's crashed ship at the easy start; sea stacks off Z015 | A river mouth and estuary, tide pools | Jungle Shore at the water, Jungle Swamp in the marsh, Jungle inland; shore formations |
| Fungal Forest (Z003, Z005, Z013) | Rolling hills and valleys; a deep sheltered hollow (Lumivine Grove); a raised terrace for the ruins (Contested Ruins) | Giant glowing trees in the grove; the ruins | Streams in every valley, a river to the south coast, small lakes | Jungle and Jungle Swamp, glowing at night |
| Crystalline Desert (Z004, Z006, Z012) | Dune fields, plains, buttes and small mesas, dry canyons (wadis); a crater (Skitterjaw Hollow) | Crystal spires in the Crystal Expanse | Acid pools and an acid river (the bundle's) | Desert, Desert Grass, Desert Acid; Moon for bare crystal ground |
| High-Gravity Plateau (Z007, Z011) | A mesa about 180 m high with cliff edges cut by canyons, terraces, one road up | The mesa itself; the Remnant Research Hub on top | A waterfall off the edge | Columnar and Moon, the desert mountain sets |
| Subterranean Caverns (Z008, Z009) | Karst: steep rock towers, sinkholes, arches and cave mouths (the dungeon entrance at Subterranean Mouth) | The tower forest | Sinkhole pools, a river leaving a cave | Moon and Columnar; rock arches; cave mouths from rock pieces (the inside is a separate dungeon level) |
| Floating Archipelagos (Z010) | A lagoon inside a reef rim | The floating islands above it | The lagoon | `BP_PCG_Jungle_Floating` and its rocks |

Players' places, by the zone notes: the hubs (Coastal Outpost, Remnant Research Hub) as outposts built with the
bundle's building system; the 8 starting crash sites (D-28); the PvP hotspots; the dungeon entrance; ruins; trading
posts (Scavenger Flats). Paths link the hubs and starts; each region has smaller finds (wrecks, caches, resource
clusters) every few hundred metres along the ways players travel.

## 4. Harvesting (built into the map from the start)

| What | Where | Gives | Tool |
|---|---|---|---|
| Trees: cut down | Jungle, swamp, fungal forest, desert palms | Wood (and sap, fibre from some) | Hatchet (more with better tools) |
| Rocks: mined | Boulders and outcrops everywhere; ore and crystal rocks in the desert and on the plateau | Stone; metal ore; crystals | Pickaxe |
| Sticks and stones: picked up | On the ground in every region, most near the starts | Sticks, stones | Hands |
| Plants: harvested | Bushes, ferns, fungi and grasses | Fibre; food (berries, fungi, roots) | Hands (a knife gives more) |

How it works (C++, server-authoritative): the trees and rocks the bundle places are instances in the saved PCG
cells; plants and debris come from the run-time layer. A harvest system knows which meshes are which resource (a
data table), takes hits from tools or a use key, and on the server counts each thing down; when one is used up it
hides it on every machine (and for anyone joining later: the server keeps the list, keyed by a stable id from its
place and mesh), drops the items, and grows it back after a while. Trees fall over before they go. Small pickups are
instances too (thousands of actors would be too heavy). Tools, items and recipes go into the game's data files
(`Items.csv`, `Recipes.csv`).

## 5. Steps and checks

| Step | What | Done when |
|---|---|---|
| M1 | This plan; research | The owner can read it (wiki) |
| M2 | Terrain tool v2: landforms per region, erosion, rivers and lakes, beaches, paint from terrain data; previews | The island's relief reads well from above and from the ground in previews |
| M3 | `L_Main`: the 2 m landscape, Nanite landscape, the sea at full size (gotcha 106 solved or replaced), rivers and lakes | The level opens, streams, and the sea, rivers and lakes show everywhere |
| M4 | Dressing: the bundle's biome actors per region, tuned; mountain sets, floating islands; HLODs | Pictures of every region from the air and the ground |
| M5 | Harvesting (C++): trees, rocks, pickups, plants; tools; respawn; online | Tests, and the network test on the map (two clients see the same cut tree, a late joiner too) |
| M6 | Places: start crash sites, hubs, ruins, PvP hotspots, dungeon mouth, paths | Each zone has its places; paths link the hubs and starts |
| M7 | Look: per-region fog and light, the sky, sound beds | Pictures at day and night in every region |
| M8 | Budget and checks: measured with the editor closed; the network tests on the map; the whole check ladder | 16.6 ms on the target tier; every check passes |

Each step ends with pictures on the wiki and a local commit with a tag (while-away.md's rollback table).
