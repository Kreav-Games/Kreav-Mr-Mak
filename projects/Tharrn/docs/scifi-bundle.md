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
| Videos | [AutoEnv PCG tutorial](https://youtu.be/8LCLxl_9d_4), [PCG generation tutorial](https://youtu.be/gXhZNOKIi80), [trailer](https://youtu.be/0qgMFHWg8ts), [colony overview](https://youtu.be/g60VjU10BLQ), [gameplay](https://youtu.be/W00FnqnEi_M) | — |
| Store page | [Fab listing](https://www.fab.com/listings/ad2bcd86-2aa1-442e-a984-49b99e29d490) | — |

## What it gives Tharrn

| Part of the bundle | Guide section | Tharrn module |
|---|---|---|
| PCG biome generation: its own system (from AutoEnv, not Unreal's PCG Biome plugin), driven by Biome, Rock and Foliage data assets; `BP_PCG_Biome`, `BP_PCG_Manager`, an offline graph for rocks and a runtime graph for debris and foliage, exclusion actors, landscape grass | Main: PCG generation, Tutorial | P5 Coastal slice, then every biome |
| Combined landscape material: the 8 landscape layers of all biomes, runtime virtual texturing | Main: Combined landscape material | P5 |
| Biomes: colony, jungle, desert, arctic (added in 1.1) | Colony, Jungle, Desert guides | P5 and later biomes; the desert for the Skitterjaw (D-16) |
| Building system: regular and circular buildings from modular kits, floors, stairs, pillars, furniture, scattering | Main and Colony: Building System | Hubs and outposts (world building); not the player's base building (GDD 03) |
| Level objects: doors, furniture, lights, machines, items (`BP_P_LevelObject`, power and switch states) | Main: Interactions | Interaction in P4 and P8, made replicated |
| Hoverbike, rover buggy (Chaos vehicles) | Hoverbike, Rover Buggy guides | Vehicles, alpha (GDD 06), made replicated |
| Automatic turrets with turret and ammo data assets | Auto Turrets guide | Base and outpost defences later |
| Environment controller (day and night, wetness, rain), space, planets, background mountains | Main: Environment | P5 sky and time of day (OQ-11) |
| Spline, scattering, stair and pillar tools | Main: Environment tools | World building |
| Material workflow: one parent material, vertex-colour wear, mesh decals, custom primitive data | Main: Material workflow | All art |
| World Partition, HLOD and optimisation advice | Main: Optimizations & best practices | The D-11 budget |

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
- Check which version is staged when P5 starts: 1.2.1 fixed the terrace rock layer in 5.7 and 5.8.

## Settings the bundle needs, and Tharrn's state (2026-10-16)

| Setting | The bundle | Tharrn |
|---|---|---|
| PCG plugin, also at run time | Required | On (enabled on its own 2026-10-16; before, only through Unreal's experimental PCG Biome plugin, now off) |
| Chaos Vehicles plugin | For the hoverbike and buggy | On (since 2026-10-16) |
| Lumen, Nanite (DirectX 12, SM6), virtual shadow maps | Required | On |
| Virtual texturing (streaming and runtime) | Recommended; without it rocks show an orange top layer | Off: turn on in P5 |
| Custom depth-stencil "Enabled with Stencil" | Only for the example player's highlight | Not set; set when Tharrn builds an interaction highlight |
| `r.Streaming.PoolSize` 3000 | For the landscape's virtual texture | Set |
