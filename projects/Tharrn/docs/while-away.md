# Tharrn — report for when the owner is home

Started 2026-10-16. The owner is on the phone for a few days and can't test in the editor: "Might as well commit, I
can't do testing, using phone for next few days, we dont want to lose progress. Continue with whats next and when im
home we can revisit. Make sure to make notes or a report for when I get home incase we need a roll back." Claude
builds P4 (the hotbar, inventory and UI, D-25; [plan](tasks.md#p4-inventory-hotbar-and-ui-plan-2026-10-16)) in the
meantime, then P5 (vitals and crafting; [plan](tasks.md#p5-vitals-and-crafting-plan-2026-10-16)), then P6 (the coastal
slice, from 2026-10-17; [plan](tasks.md#p6-coastal-slice-plan-2026-10-17)). This file says what was done, what to look at
first, and how to go back.

## Rollback points

| Repo | Commit | Tag | What it holds |
|---|---|---|---|
| Game `D:\Tharrn` | `a68c0b7` | `p6-main-map-terrain` | P6 M2 done, M3 begun: the 2 m terrain and `L_Main`'s builder (the level itself, 688 MB, stays out of Git until its terrain settles; the scripts rebuild it). Checked: `L_Main` built and pictured |
| Game `D:\Tharrn` | `f882102` | `p6-terrain-wip` | P6 M2 so far: the main map's terrain tool with erosion, rivers and lakes ([plan](map-design.md)); committed after a power cut (nothing was lost). Checked: the preview runs end to end |
| Game `D:\Tharrn` | `fb313ae` | `d28-starts` | D-28: the proposed starting locations (`Data/StartLocations.csv`, 8 starts, not imported yet) on the layout picture and in the island blockout. Checked: the blockout rebuilt and its pictures |
| Game `D:\Tharrn` | `30ba8ff` | `p6-island-blockout` | The island blockout's tools (`Tools/World/island_blockout.py`; the level itself, `/Game/Tharrn/Scratch/L_Island_Blockout`, stays out of Git and is made again by the script). Checked: the pictures, the test coast's pictures through the changed level builder |
| Game `D:\Tharrn` | `2c51e17` | `d27-island` | D-27: the zones rescaled to 2.56 km (about 100 km², sea all around). Checked: data import, 105 tests |
| Game `D:\Tharrn` | `dd8c093` | `p6-budget-first` | P6.9 so far: HLODs on the test coast, the budget script's `-ExtraCmds` (first numbers in tasks.md) |
| Game `D:\Tharrn` | `b8637a0` | `p6-time-of-day` | P6.7: the world's hour from the server's clock, the bundle's sky on the test coast. Checked: verify.py 5 of 5 (105 tests), nature_test.py (the same hour on every machine) |
| Game `D:\Tharrn` | `594f1ed` | `p6-coast-candidates` | P6.4: the tools that make candidate coasts from lidar and build their levels (scripts only; the candidate levels stay out of Git) |
| Game `D:\Tharrn` | `d12d728` | `p6-biomes-online` | P6.2: the bundle's jungle on the test coast, run-time bushes and boulders for looks only, `nature_test.py`. Checked: verify.py 5 of 5 (104 tests), nature_test.py, survival_test.py |
| Game `D:\Tharrn` | `ef8a9a5` | `p6-ocean-test` | P6 so far: the world-building tool, the made-up test coast (`L_CoastTest`) with Unreal's ocean, the Water plugin and virtual texturing switched on. Checked: verify.py 5 of 5 (104 tests). Going back to `p5-built` also switches the Water plugin and virtual texturing off again |
| Game `D:\Tharrn` | `8a93b0d` | `p5-built` | P5 built: vitals (stamina, hunger, hydration, temperature), food and water, crafting, the vitals on the HUD, the crafting panel, the death screen and bag, cold and hot areas on the test range. Checked: verify.py, survival_test.py, inventory_test.py, mss_test.py, Shipping build |
| Game `D:\Tharrn` | `700db9d` | `p4-built` | P4 built: everything above plus Easy Game UI's main menu (the game's start level), pause menu (Esc) and options. Checked: verify.py 5 of 5 (Shipping too), inventory_test.py and mss_test.py |
| Game `D:\Tharrn` | `883a04d` | `p4-checkpoint-1` | P4 so far: the inventory, hotbar, pickups, the HUD and the inventory screen in MSS's look; Easy Game UI's HUD class in place, its menus not yet. Checked: 84 automation tests, the network test, the inventory network test (listen and dedicated server), the MSS test |
| Game `D:\Tharrn` | `f2e695d` | `d24-before-p4` | D-24: grenade launcher, hand grenades, the view through the sight, the mouse wheel, no slide. Everything checked (80 tests, network test, MSS test, Shipping build). The last state before P4 |
| Game | `a470f3f` | — | P3's first build with MSS (the slide and the Mass Driver still in) |
| Mr. Mak | `d2bff9f` | — | The design record for D-24, decision D-25 and the P4 plan |

P4's commits are added to the table above as they happen. Asked on 2026-10-16 whether Claude may commit verified P4
checkpoints on its own while they are away (local only, never pushed, each tagged), the owner said "Commit".

## How to go back

Simplest: tell Claude "roll Tharrn back to `d24-before-p4`" (or to any commit or tag above). Claude closes the
editor, keeps the newer work on a branch so nothing is lost, resets, rebuilds and checks.

By hand, with the Unreal Editor closed (PowerShell):

```powershell
git -C D:\Tharrn branch p4-kept               # keeps the newer work on a branch
git -C D:\Tharrn reset --hard d24-before-p4   # the game files as they were at that point
```

Then open `D:\Tharrn\Tharrn.uproject`; it offers to rebuild the C++ (say yes).

**What Git does not cover.** Store packs stay outside Git (D-08). Some of Tharrn's tool scripts change pack files
in place: `Tools/Weapons/setup_mss.py` (MSS's shooter component, its projectile and throwable masters, the sample's
animation Blueprint, the UEFN skeleton). Every pack file P4 changes is listed below, and a copy of it as it was is
kept first in `D:\Tharrn\Saved\PackBackups\`. To undo pack changes: copy those files back, or stage the pack again
(`Tools/Packs/stage_packs.py`) and run `setup_mss.py` again.

## P4 progress

| Step | State | Commit | Notes |
|---|---|---|---|
| P4.1 MSS from a slot | Done 2026-10-16 | — | The server makes the picked weapon and MSS draws it with its own animation; the old one is put away and removed; nothing shows on the back (pictures: nothing on the body, only the weapon in the hands) |
| P4.2 Data | Done | — | `Data/Items.csv` (14 items), `Data/StartingKit.csv`, `ammo_item` in `Weapons.csv`; two placeholder icons (bandage, armour) |
| P4.3 Inventory (C++) | Done | — | `UTharrnInventoryComponent`: 12 hotbar + 30 grid + 4 worn slots, 60 kg; reloads take rounds from it; grenades are items; worn armour sets the armour |
| P4.4 Hotbar | Done | — | Keys 1 to 9, 0, - and =; the wheel steps through the weapons; a grenade slot readies a grenade; a bandage heals 25 (refused at full health) |
| P4.5 Pickups and drops | Done (single player) | — | E picks up what the player looks at; the server refuses a pick-up from 10 m; items lie on the test range (right of the starts) |
| P4.6 to P4.8 Look, HUD, inventory screen | Done | `883a04d` | In MSS's look (its panel and text styles, pale blue-white on dark): the hotbar along the bottom with the item in the hands named above it, health and weight bottom left, the pick-up prompt, the inventory screen on Tab (worn, grid, hotbar row, drag and drop, details); MSS's weapon selector and its X, Z, F and G hints hidden (its ammunition, R and V stay) |
| P4.9 Menus (Easy Game UI) | Done | `700db9d` | The game starts at the main menu (THARRN, press any key, then its menu; New Game opens the test range); Esc opens the pause menu (Continue, Options, Quit to Title Screen, Quit; it does not pause: online); its options (video, graphics, gameplay, controls, audio) |
| P4.10 Checks | Done | `700db9d` | verify.py 5 of 5 (Shipping too), inventory_test.py and mss_test.py |
| P4.11 Owner play-test | **Waiting for you** | — | Steps in [tasks.md](tasks.md#p4-inventory-hotbar-and-ui-results-2026-10-16) |

The owner pointed at MST Pro (Hyper's Multiplayer Survival Template) on 2026-10-16: it has an inventory, hotbar,
crafting, vitals, building, farming and more. Claude recommended keeping Tharrn's own inventory (built and working,
the server checks every move, it draws MSS weapons directly) and taking MST Pro's parts that fit, module by module;
the owner can say "2" to switch to MST Pro's inventory instead.

## P5 progress

| Step | State | Notes |
|---|---|---|
| P5.1 Vitals | Done 2026-10-16 | Attributes next to health, the server runs them (`UTharrnVitalsComponent`); numbers in `Data/Vitals.csv` |
| P5.2 Formulas | Done | `StaminaRegen` and `AimSway` (`UTharrnVitalsLibrary`), tested at 0, 29, 30, 31 and 100 |
| P5.3 Stamina | Done | Sprinting uses it; predicted in the movement: no corrections when it runs out |
| P5.4 Temperature | Done | Cold (6 °C) and hot (33 °C) areas on the test range; armour widens the comfortable range |
| P5.5 Food and water | Done | Ration +40 hunger, water +50 hydration; not used up when full |
| P5.6 Crafting | Done | Bandage, pistol, SMG and 40 mm rounds; a queue of 5; cancel gives the inputs back |
| P5.7 UI | Done | Vitals cluster, crafting panel, death screen (pictures below) |
| P5.8 Going down | Done | Everything carried drops in a bag; the new body has the starting kit |
| P5.9 Checks | Done | verify.py 5 of 5 (Shipping too, 91 tests, 0 corrections), survival_test.py (new), inventory_test.py and mss_test.py, each as listen and dedicated server ([details](tasks.md#p5-vitals-and-crafting-results-2026-10-16)) |
| P5.10 Owner play-test | **Waiting for you** | Steps in [tasks.md](tasks.md#p5-vitals-and-crafting-results-2026-10-16) |

## P6 progress

| Step | State | Notes |
|---|---|---|
| Research | Done 2026-10-17 | KK Design's videos and the bundle's example level: how its biomes look and are assembled, which preset makes which Tharrn biome ([scifi-bundle.md](scifi-bundle.md#how-the-biomes-look-and-are-assembled-2026-10-17)) |
| Tools | Done (`ef8a9a5`) | `TharrnEditor.TharrnWorldBuildToolset` (C++, 13 tests): levels, landscapes from height and paint files, the bundle's editor buttons, PCG progress; the Water plugin and virtual texturing switched on (one rebuild) |
| Test coast | Done | `L_CoastTest`: 1 km of made-up coast (beach, tide pools, marsh, stream, rocky headland) painted with the bundle's jungle shore, swamp, jungle and rock layers ([map](pictures/p6/test_coast_map.jpg)) |
| P6.1 Ocean test | Done (`ef8a9a5`, verify.py 5 of 5) | Unreal's ocean for the sea, the bundle's water for pools and rivers (pictures below; OQ-05) |
| P6.2 Biomes online | Done (`d12d728`) | The bundle's jungle shore, swamp and jungle on the test coast (generated in about 35 s); players sprint into the jungle with no corrections, as listen and dedicated server (`nature_test.py`, new). The bushes and small boulders made around players are for looks only (they no longer block) |
| P6.3 Main map | **A blockout for you** | The island in the editor (`/Game/Tharrn/Scratch/L_Island_Blockout`, outside Git; `Tools/World/island_blockout.py` makes it again): each zone's ground shaped and coloured for its proposed biome, the sea all around, the 8 proposed starting locations marked with beacons coloured by difficulty (D-28). No plants yet. Pictures, also on the wiki's World page: [from above, labelled](pictures/p6/island/top_labelled.jpg), [from the sea](pictures/p6/island/southwest.jpg), [the start from the sea](pictures/p6/island/start_from_sea.jpg), [coming ashore](pictures/p6/island/start_low.jpg). The real map comes once the layout and the starting coast are settled. **2026-10-19:** the real level `/Game/Tharrn/Maps/L_Main` is built from the new terrain tool (2 m, erosion, rivers, lakes, the bundle's layers); pictures on the wiki's new Map build tab |
| P6.4 Terrain candidates | **Waiting for you** | Four 2 km coasts from public lidar, built in the editor with the ocean and the bundle's jungle ([all four](pictures/p6/coasts/all_coasts.jpg)); pick one (question 5) |
| P6.7 Sky and time of day | Done (`b8637a0`) | The bundle's environment controller on the test coast, its hour from the server's clock: the same on every machine (checked as listen and dedicated server). A day lasts 60 real minutes, play starts at 9:30 (proposals, OQ-11). At night the jungle's plants glow ([noon](pictures/p6/time_noon.jpg), [evening](pictures/p6/time_evening.jpg), [night](pictures/p6/time_night.jpg), [dawn](pictures/p6/time_dawn.jpg)) |
| P6.9 Budget | First numbers | The test coast takes 24.8 ms of GPU a frame at 1440p on this PC with the editor open (budget 16.6 on an RTX 3060): the jungle's trees and rocks are most of it; clouds 1.7 ms, grass 1 ms. A clean run with the editor closed and the cuts come next ([table](tasks.md#p6-coastal-slice-first-budget-numbers-2026-10-17)) |

## Pack files changed in P4

| Pack file | What changed | Backup |
|---|---|---|
| `Content/EasyGameUI/Core/GlobalConfig/BP_EGUI_GlobalConfigSelector.uasset` | One class default, `GlobalConfigDataAsset`: Easy Game UI's demo settings to Tharrn's `DA_TharrnUIConfig` (Easy Game UI finds its settings only through this selector) | `D:\Tharrn\Saved\PackBackups\2026-10-16\EasyGameUI\Core\GlobalConfig\` |

Staging Easy Game UI again undoes it; `Tools/UI/build_ui.py` sets it again. P5 changed no other pack file
(`build_ui.py` saved the selector again with the same value).

## Pictures (2026-10-16)

The HUD [hud.jpg](pictures/p4/hud.jpg), the inventory screen [inventory.jpg](pictures/p4/inventory.jpg), the pick-up
prompt at the test range's items [pickup_prompt.jpg](pictures/p4/pickup_prompt.jpg), empty hands with nothing on the
back [hands_empty_back_clear.jpg](pictures/p4/hands_empty_back_clear.jpg), aiming through the SMG's sight in a client's
small play window [aiming_client_window.jpg](pictures/p4/aiming_client_window.jpg), the main menu
[main_menu.jpg](pictures/p4/main_menu.jpg), the pause menu [pause_menu.jpg](pictures/p4/pause_menu.jpg), the options
[options.jpg](pictures/p4/options.jpg).

P5: the vitals cluster (hungry, in cold air, after a sprint) [hud_vitals.jpg](pictures/p5/hud_vitals.jpg), a resource
on the item table [pickup_resource.jpg](pictures/p5/pickup_resource.jpg), the crafting panel with a bandage under way
and what is missing in red [crafting.jpg](pictures/p5/crafting.jpg), the death screen
[death_screen.jpg](pictures/p5/death_screen.jpg), back with the starting kit and full vitals
[back_with_kit.jpg](pictures/p5/back_with_kit.jpg).

P6 pictures (2026-10-17), the ocean test on the made-up coast: Unreal's ocean from the air
([ocean_aerial.jpg](pictures/p6/ocean_aerial.jpg)), along the beach ([ocean_beach.jpg](pictures/p6/ocean_beach.jpg)),
at the headland ([ocean_headland.jpg](pictures/p6/ocean_headland.jpg)) and from the water
([ocean_waves.jpg](pictures/p6/ocean_waves.jpg)); the bundle's own water as a sea, jungle
([bundle_water_jungle.jpg](pictures/p6/bundle_water_jungle.jpg)) and clear
([bundle_water_clear.jpg](pictures/p6/bundle_water_clear.jpg)). Then the bundle's jungle on it: from the air
([jungle_aerial.jpg](pictures/p6/jungle_aerial.jpg)), the beach ([jungle_beach.jpg](pictures/p6/jungle_beach.jpg)), inside
([jungle_inside.jpg](pictures/p6/jungle_inside.jpg), [jungle_to_sea.jpg](pictures/p6/jungle_to_sea.jpg)), the headland
([jungle_headland.jpg](pictures/p6/jungle_headland.jpg)); and in play, with the HUD: on the beach
([play_beach.jpg](pictures/p6/play_beach.jpg)) and after a sprint into the jungle ([play_jungle.jpg](pictures/p6/play_jungle.jpg)).

## Things that happened

- 2026-10-16, evening: a rebuild could not close the editor (Unreal's "Save Content" box was open). Claude's attempt
  to press Esc on it was declined; the owner chose to force-close and rebuild ("#2"). The editor then offered to
  restore three Easy Game UI Blueprints (`BP_EasyMainGameHUD`, `GI_EasyMainGameInstance`,
  `BPFL_EGUI_EasyFunctionUtilities`) that only reading their graphs had marked as changed; the restore was skipped by
  moving Unreal's restore list aside (kept in `D:\Tharrn\Saved\ClaudeScratch\restore_2026-10-16\`). The pack files
  were not changed. Claude read "#2" as that option, not as switching to MST Pro's inventory.
- 2026-10-16, night: the editor crashed once on Play after a Live Coding patch of a file with test console variables
  (`TharrnPlayerCharacter.cpp`); the crash was in Tharrn's movement test code, nothing was lost; full builds since
  (engineering guide, gotcha 79).

- 2026-10-16, night (P5): the new survival test found that, once out of stamina, a held sprint key sprinted again
  every 1.25 s; now sprinting comes back after letting go of sprint with 20 stamina back, or when it is full.
  Saving project settings also rewrote `Config/DefaultEngine.ini` with every default again (as in P4); the file was
  put back and the script now saves only a change.

- 2026-10-17: the first network test in the generated jungle failed (6 to 33 corrections a sprint); the cause turned
  out to be the editor itself after a long session (the P5 survival test failed the same way on the test range, and
  both passed after a restart). On the way, the bundle's run-time bushes and boulders were made non-blocking (above).
- 2026-10-17, morning: the owner pointed at KK Design's videos ("You can look for kk designs unreal on YouTube to see
  how the bundle pack biomes look for assembly of our biomes") and set the main map at 100 km² ("This all will be for
  the main map thats 100km²", D-26). Claude read about twenty of the videos and the bundle's example level and wrote
  down how the biomes look, how a map is assembled, and which bundle preset makes which Tharrn biome
  ([scifi-bundle.md](scifi-bundle.md#how-the-biomes-look-and-are-assembled-2026-10-17)). Found on the way: the bundle has its own water, rivers and shore pieces, now the
  fallback for the ocean (OQ-05).
- 2026-10-17, late: the owner could not see the docs folder on the phone, so the island was built as a blockout in
  the editor and its pictures, with the four candidate coasts, put on the wiki's World page. On the way: Unreal's
  ocean drew nothing at the main map's size (gotcha 106; the blockout's sea is the bundle's water on a plane), the
  bundle's landscape material failed where too many paint layers met (105), and the scene search does not find
  Tharrn's sky (104).

## Chosen for the owner (proposals in the P4 plan; say if any is wrong)

- G (grenade) and Z (drop) leave MSS's keys too: grenades go on the hotbar, dropping happens in the inventory.
- 12 hotbar slots, 30 in the grid; 60 kg carried, over it no sprinting.
- The starting kit: SMG, pistol and launcher with four magazines each, three grenades, two bandages; armour to pick
  up on the test range.
- The crafting and death screens come with P5, the map with P6.
- Easy Game UI's menus: the pause menu does not pause the game (online); no saving, autosaves, photo mode, intro or
  credits button yet; version shown 0.4; its accent in MSS's pale blue; a plain "THARRN" text logo as a placeholder
  (rendered from the engine's Roboto font) until there is real art. Its own menu backdrops (a teal or pink blur) stay
  until the whole UI pass.
- Grenades on the hotbar's 4, bandages on 5 (the starting kit); E picks up within 2.5 m.

P5 (all in `Data/Vitals.csv`, `Data/Recipes.csv` and `Data/Items.csv`, easy to change):
- Hunger empty in 60 minutes, hydration in 40; at 0 each costs 0.5 health a second.
- Stamina 100; sprinting 12 a second (about 8 s); back at 20 a second after 1 s of rest; out of it, sprint again
  after letting go with 20 back.
- Comfortable from 10 to 30 °C; cloth armour 5 °C colder, composite 5 colder and 5 hotter, alloy 3 and 3; outside
  it 1 health a second and 15 % slower; the felt temperature moves 2 °C a second.
- GDD 03's aim formula with the hydration term only below 30 (else a well-watered player would sway less than the
  weapon's own spread).
- Recipes: a bandage from 2 organic fibre (3 s); 24 pistol rounds from 1 mineral and 1 alloy scrap (4 s); 40 SMG
  rounds from 2 mineral and 1 alloy (5 s); two 40 mm grenades from 2 and 2 (6 s). A ration +40 hunger, water +50.
- Five crafts in the queue; everything carried drops in a bag on going down (worn armour too); anyone can open a bag.

P6 so far (proposals):
- The sea is Unreal's ocean (Water plugin); the bundle's water is for jungle pools, the marsh and rivers (OQ-05).
- Bushes and small boulders that appear around a player are for looks and do not block; trees and big rocks block.
- The coast's biome presets: Jungle Shore at the waterline, Jungle Swamp in the marsh, Jungle inland.
- A day lasts 60 real minutes and play starts at 9:30 (OQ-11); nights stay light enough to play.

## To look at first, when home

1. Play-test P2 and P3 ([steps](tasks.md#p3-weapons-results-2026-10-16)): the slide is gone, the launcher and
   grenades, aiming through the sight, the wheel.
2. P4's play-test steps ([tasks.md](tasks.md#p4-inventory-hotbar-and-ui-results-2026-10-16)), then P5's
   ([tasks.md](tasks.md#p5-vitals-and-crafting-results-2026-10-16)): stamina, the cold and hot areas, crafting.
3. This file's "Chosen for the owner" and "Questions" sections.
4. The island blockout in the editor: open `/Game/Tharrn/Scratch/L_Island_Blockout` (in World Partition, load the regions you want to see).

## Questions for the owner

1. GDD 03's table says thirst adds 25 % aim sway; its formula gives up to 24 % (at hydration 0). The build follows the
   formula; say if 25 % should be exact.
2. Should thirst only ever add sway (the build: the hydration term only below 30), or should a well-watered player
   sway less than the weapon's own spread (the formula as written)?
3. Bags of a downed player: should they vanish after a while, and should anyone be able to open them (now: they stay,
   anyone can)?
4. ~~The 100 km² main map~~: answered "Water all around" (D-27: the zones make about 100 km², sea all around; the zone
   data is rescaled). The layout: answered "We can adjust layout later when im at the PC" (it stands for now). The
   proposed island and a biome per zone: [main_map_layout.png](pictures/p6/main_map_layout.png); in
   the editor: [from above, labelled](pictures/p6/island/top_labelled.jpg), [from the sea](pictures/p6/island/southwest.jpg), [the start from the sea](pictures/p6/island/start_from_sea.jpg), [coming ashore](pictures/p6/island/start_low.jpg) (all on the wiki's World page, for the phone). Does the layout suit
   (the coast in the south-west where play starts, the fungal forest east of it, the desert across the middle, the
   plateau in the east, the caverns in the north-west, Floating Archipelago A as a lagoon with islands above it)?
5. Which coast should the Coastal region (around the easy start S01) be made from (pictures of each on the wiki's World page; [all four](pictures/p6/coasts/all_coasts.jpg), each from the air, from the sea and on the shore; maps:
   [A](pictures/p6/coasts/a_hanalei_map.jpg), [B](pictures/p6/coasts/b_polihale_map.jpg),
   [C](pictures/p6/coasts/c_waimea_map.jpg), [D](pictures/p6/coasts/d_point_lobos_map.jpg))? A Hanalei Bay (a crescent
   bay, a river lowland with marsh, jungle mountains), B Polihale (a long beach under rock ridges), C Waimea (a rocky
   bay under cliffs, a valley), D Point Lobos (a jagged rocky coast with coves and stacks), or a made-up coast. The
   plants and rocks are the bundle's alien jungle whichever place the land comes from. Another way: one whole
   10 × 10 km lidar area as the 100 km² main map (OQ-06).
6. The starting locations (D-28: one or two in each region, by difficulty). Proposal, 8 starts (OQ-16; the table is
   on the wiki's World page, the dots on [the map](pictures/p6/main_map_layout.png)): Coastal S01 beach at the Coastal
   Outpost (level 1, Easy), S02 Apex Migration coast (25, Hard); Fungal Forest S03 Fungal Fringe (5, Easy), S04
   Lumivine Grove (10, Medium); Crystalline Desert S05 Scavenger Flats (6, Medium); High-Gravity Plateau S06 Remnant
   Research Hub (12, Medium), S07 High Gravity Plateau (22, Hard); Subterranean Caverns S08 Subterranean Mouth (15,
   Hard); none in the Floating Archipelagos (all PvP). Do these suit? Pick once per new character, or again later? The
   tutorial at every start, or the easy ones only?
