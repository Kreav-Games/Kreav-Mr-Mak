# Tharrn — Sci-Fi Complete Bundle reference

The Sci-Fi Complete Bundle (KK Design) is Tharrn's environment and world-building kit, and **its documentation is
the go-to reference** for building with it (D-20): "this document has every single things we need to making this
game, this is the go to document, theres even tutorials and more documents with in to learn more of what we can do"
(owner, 2026-10-16). Read the guide for the part of the bundle a module uses before building that module. This
file lists the guides and what each part is for in Tharrn; the guides themselves are the source.

## The guides

| Guide | What it covers | Link |
|---|---|---|
| **Main guide (the bundle)** | Required settings, PCG biome generation (with a tutorial), the combined landscape material, buildings, interactive level objects, materials, environment tools, environment controller, optimisation, the example player | [Google Doc](https://docs.google.com/document/d/1lFjRKIKaGpnxRJgw_aDCGNAif1RqJk6e4APHl3Pbz5o/edit) |
| Sci-fi Colony | Buildings, interactions, materials, environment tools in more depth | [Google Doc](https://docs.google.com/document/d/14c7uc5FaG9Yb_AJ27h9NRZgUekDBwn_Mwmrl3JCnOYg/edit) |
| Sci-fi Jungle | Its example environment, landscape material and PCG generation | [Google Doc](https://docs.google.com/document/d/1RcJoTWZoGgnZ3z-Ll_UV2Lc2Tsv1ebIKRkmKAUbbe0w/edit) |
| Sci-fi Desert | The same for the desert | [Google Doc](https://docs.google.com/document/d/157p7mKZX0WTNQsVY4ppcQrnNk_96rwzAQQVGvUJ6zV8/edit) |
| Sci-fi Hoverbike | The vehicle parent system, possessing, rider animations, effects | [Google Doc](https://docs.google.com/document/d/1zjzQejKQEpKhJm_fE0jQt6FpNFk7pLIlJ5MJeLLYrwg/edit) |
| Sci-fi Rover Buggy | The buggy, its static version, MetaSounds | [Google Doc](https://docs.google.com/document/d/1JJHw0vLJ9a7cjbnaOXy_u5sbclvVGWpT554HMoQwVdw/edit) |
| Sci-fi Auto Turrets | Turret classes, turret and ammo data assets, targeting, attaching to actors | [Google Doc](https://docs.google.com/document/d/1hWc8f6QwLxC5Rd0k94HTf7HSFVS3CRxWw2j9PSkAeig/edit) |
| Sci-fi Containers | No guide is linked from the main guide | — |
| Videos | [AutoEnv PCG tutorial](https://youtu.be/8LCLxl_9d_4), [PCG generation tutorial](https://youtu.be/gXhZNOKIi80) (not available on 2026-10-17), [trailer](https://youtu.be/0qgMFHWg8ts), [colony overview](https://youtu.be/g60VjU10BLQ), [gameplay](https://youtu.be/W00FnqnEi_M); the rest on [KK Design's channel](https://www.youtube.com/channel/UCC97c_DtTzQI_2iYi7qRm0w) ([what they show](#how-the-biomes-look-and-are-assembled-2026-10-17)) | — |
| Store page | [Fab listing](https://www.fab.com/listings/ad2bcd86-2aa1-442e-a984-49b99e29d490) | — |

## What it gives Tharrn

| Part of the bundle | Guide section | Tharrn module |
|---|---|---|
| PCG biome generation: its own system (from AutoEnv, not Unreal's PCG Biome plugin), driven by Biome, Rock and Foliage data assets; `BP_PCG_Biome`, `BP_PCG_Manager`, an offline graph for rocks and a runtime graph for debris and foliage, exclusion actors, landscape grass | Main: PCG generation, Tutorial | P6 Coastal slice, then every biome |
| Combined landscape material: the 8 landscape layers of all biomes, runtime virtual texturing | Main: Combined landscape material | P6 |
| Biomes: colony, jungle, desert, arctic (added in 1.1) | Colony, Jungle, Desert guides | P6 and later biomes; the desert for the Skitterjaw (D-16) |
| Building system: regular and circular buildings from modular kits, floors, stairs, pillars, furniture, scattering | Main and Colony: Building System | Hubs and outposts (world building); not the player's base building (GDD 03) |
| Level objects: doors, furniture, lights, machines, items (`BP_P_LevelObject`, power and switch states) | Main: Interactions | Interaction in P4 (pickups) and P9, made replicated |
| Hoverbike, rover buggy (Chaos vehicles) | Hoverbike, Rover Buggy guides | Vehicles, alpha (GDD 06), made replicated |
| Automatic turrets with turret and ammo data assets | Auto Turrets guide | Base and outpost defences later |
| Environment controller (day and night, wetness, rain), space, planets, background mountains | Main: Environment | P6 sky and time of day (OQ-11) |
| Spline, scattering, stair and pillar tools | Main: Environment tools | World building |
| Material workflow: one parent material, vertex-colour wear, mesh decals, custom primitive data | Main: Material workflow | All art |
| World Partition, HLOD and optimisation advice | Main: Optimizations & best practices | The D-11 budget |

## How the biomes look and are assembled (2026-10-17)

The owner: "You can look for kk designs unreal on YouTube to see how the bundle pack biomes look for assembly of our
biomes", then "This all will be for the main map thats 100km²" (D-26). KK Design (Kimmo Kaunela) makes the bundle.
Claude read the videos from their descriptions and preview frames (YouTube does not serve their transcripts), and
the bundle's example level from its saved actor files, without opening it.

| Video | What it shows |
|---|---|
| [Sci-Fi Bundle trailer](https://youtu.be/0qgMFHWg8ts) | The 16 km² example level: outposts on grey rock, green jungle valleys, red desert plains with terraced pools, rock spires, floating islands and a large planet in the sky; night with glowing plants; the hoverbike |
| [Bundle 1.1 update](https://youtu.be/yz-x3NVr4JM) | The arctic added; "example level updated with new biome data"; "example colonies added that blends with the nature", one in each biome; new rocks |
| [Jungle](https://youtu.be/T610pvW-GlU) and [desert](https://youtu.be/bjqUz05SjTg) speed level creation, 8 minutes each | An outpost built in a clearing of a finished biome: a floor platform, modular buildings, ramps and stairs, pillars and lights, a colour picked per building, floor markings, props; then walked through by day and night |
| [Jungle demonstration](https://youtu.be/Te_J4aa9yt0) | The environment controller (time of day, night sky, planets), rivers drawn as splines through grassland, floating islands placed in a ring, a forest grown by a biome volume, spline excluders cutting paths through it |
| [AutoEnv rock and foliage tutorial 1.1](https://youtu.be/8LCLxl_9d_4) | Its chapters: the PCG manager over the landscape in a grid of volumes, biome data assets, generation, runtime virtual texturing, rock materials, rock and foliage data assets, generation at run time (the system the bundle's biomes use) |
| [Jungle 2.0](https://youtu.be/nuV4EpwOAHw), [Desert 2.0](https://youtu.be/iplQE9-DnOo), [Arctic trailer](https://youtu.be/_AbZVICPIfM), [Arctic gameplay](https://youtu.be/HqTyUOTje8Q) | Each biome's look since 2.0, which "unifies the style between all of the sci-fi biome packs" |
| [Colony with the jungle](https://youtu.be/-um89aDlhIY) | Project settings, then colony buildings dropped into the jungle level |

**The look.**
- Jungle: sunlit alien forest of twisted, mossy trunks, branching trees and red coral-like shrubs over grass;
  floating rock spires in a hazy sky; glowing plants at night.
- Desert: orange rippled sand, carpets of red grass, red palm-like trees, sandstone shelves and mesas.
- Arctic: blue-white snow and ice, blue coral-like plants, ice caves with water and icicles, ice shelves over water.
- Colony: modular industrial outposts in grey, green, orange or red on platforms, fitted into whichever biome they
  stand in.

**How a map is assembled** (the videos, and `ScifiOutpost/Maps/ExampleLevel_Bundled`):
1. One landscape with the combined landscape material. Its painted layers decide where each biome's rocks and plants
   go, so the layer names must match the biome data assets.
2. Biome volumes (`BP_PCG_Biome_Bundled`, 37 in the example level) cover the landscape region by region under one
   `BP_PCG_Manager`. Each uses a biome data asset, a rock preset plus a foliage preset. Rocks are generated once and
   saved; plants and debris are generated at run time around the player.
3. Mountains and cliffs come as packed sets (`BP_PCG_Mountain_Jungle`, `BP_PCG_Mountain_Desert`,
   `BP_PCG_Jungle_MountainCovering`), floating islands as `BP_PCG_Jungle_Floating` (11 in the example level).
4. Rivers and paths are splines (`BP_JungleRiver`, `BP_AcidRiver`; path and spline excluders clear the plants);
   lakes and pools are water actors (`BP_JungleWater`, `BP_ArcticWater`, `BP_VolcanicWater`, children of
   `BP_P_Water` with the single-layer `M_Water`).
5. Outposts go into clearings, built from the building system and level objects, with box excluders keeping the
   plants out. The example level keeps nature and buildings on two data layers (`DataLayer_Nature`,
   `DataLayer_ManMade`) and has HLOD layers for buildings, foliage and landscape.
6. The environment controller sets the time of day, weather, the sky's planets and background mountains. HLODs are
   built last.

**The bundle's biome presets** (`ScifiOutpost/PCG/Bundle/Blueprints/DataAssets`): Jungle, Jungle Swamp, Jungle Shore,
Desert, Desert Acid, Desert Grass, Arctic Shore, Arctic Snow, Arctic Swamp, Moon, Columnar, Background. For shores:
shore formations for the jungle, desert, moon and arctic and arctic shore pools (level instances), shore landscape
layers, and `PCG_Jungle_Shore`.

**Tharrn's biomes from the presets** (proposal):

| Tharrn biome | Presets and pieces |
|---|---|
| Coastal (start) | Jungle Shore at the waterline, Jungle Swamp for the shallow pools and marsh, Jungle inland; the jungle shore formations; the sea and pools from the bundle's water or the Water plugin (OQ-05); wreckage from colony modules and containers |
| Fungal Forest | Jungle (hollow and fungus-like trees, plants that glow at night), Jungle Swamp in the hollows, fog sheets |
| Crystalline Desert | Desert, Desert Grass, Desert Acid with `BP_AcidRiver`; Moon for bare crystal fields; crystal materials |
| High-Gravity Plateau | Columnar and Moon, with the desert mountain sets |
| Subterranean Caverns | Still a gap: the arctic's caves and arches are surface pieces |
| Floating Archipelagos | `BP_PCG_Jungle_Floating` and its floating rocks |
| Beyond the playable edge | Background, with its forest rocks |

The arctic presets have no Tharrn biome yet. They could carry the plateau's high ground or a cold region (P5's cold
areas).

**For the main map** (D-26). The example level is 16 km² and Tharrn's main map about 100 km², so the main map is
assembled the same way in more regions: one World Partition map, its landscape streamed in pieces, biome volumes
region by region, and the plants generated at run time, which keeps the saved size down. The Coastal slice (P6) is
the first region of that map, not a separate level.

## What to keep in mind

- **Single player only out of the box.** Every guide: "example players and some controllers are made to work in single
  player games and are not supporting replication/networking 100%". Tharrn is server-authoritative (D-04): its own
  player is used (D-18), and vehicles, turrets and interactive objects get replicated versions when their module
  comes.
- Move bundle assets between projects with the editor's Migrate, never by copying files in Explorer. Tharrn's pack
  script stages the bundle's folders whole, at their original paths, so its references stay intact.
- PCG workflow (main guide, Tutorial): delete HLODs before generating, clear and then generate each
  `BP_PCG_Biome`, set `GlobalLowestPoint` to the landscape's lowest point, name landscape layers exactly as the
  biome data assets expect; build HLODs again when done. Editing the whole 16 km² example landscape needs 32 GB of
  memory.
- The individual biome example levels come in a separate download (`ScifiBundleIndividualMaps.zip`) and are not
  staged.
- No static lighting: the bundle needs Lumen.
- Check which version is staged when P6 starts: 1.2.1 fixed the terrace rock layer in 5.7 and 5.8.

## Settings the bundle needs, and Tharrn's state (2026-10-16)

| Setting | The bundle | Tharrn |
|---|---|---|
| PCG plugin, also at run time | Required | On (enabled on its own 2026-10-16; before, only through Unreal's experimental PCG Biome plugin, now off) |
| Chaos Vehicles plugin | For the hoverbike and buggy | On (since 2026-10-16) |
| Lumen, Nanite (DirectX 12, SM6), virtual shadow maps | Required | On |
| Virtual texturing (streaming and runtime) | Recommended; without it rocks show an orange top layer | Off: turn on in P6 |
| Custom depth-stencil "Enabled with Stencil" | Only for the example player's highlight | Not set; set when Tharrn builds an interaction highlight |
| `r.Streaming.PoolSize` 3000 | For the landscape's virtual texture | Set |
