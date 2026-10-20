# Tharrn — Session log

*2026-10-15.* Project start (Claude Code). The owner replaced Wildwright with a new game and supplied
its direction document (kept verbatim in `source/`). Owner's choices: delete Wildwright; a new project
with the setup carried over; server-authoritative networking from the first system; MetaSounds now,
Wwise later. Created `D:\Tharrn` from the wizard-made third-person template content (238
files, as tracked in the old repo), the old project's config, source and tools, renamed to module
`Tharrn` and class prefix `Tharrn` with redirects for the template's classes; dropped the
template variants and the old project's region data, set-piece script and HyperAI Studio files;
re-pointed comments at the new decision numbers; new ProjectID. Git initialised with LFS (files staged,
nothing committed); `stage_packs.py` staged the Game Animation Sample and the Sci-Fi Complete Bundle
outside Git. Wrote the design record: GDD 0.1 in 13 modules (deliverable 1), decisions D-01 to D-13,
open questions OQ-01 to OQ-11, engineering guide with the carried gotchas, task list with Prototype
modules P1 to P8. **Verified:** both targets build; plugin check PASS; the editor opens with DLSS
supported and MCP answering; PIE on the template level runs with no errors. Then deleted Wildwright's
design record, Workspace card and card entry; deleting `D:\Wildwright` itself (31 GB, its local-only Git
history included) was refused by Claude Code's path guard, so the owner deletes that folder by hand. **Not verified:** the terrain tools in the new
project; anything multiplayer beyond the template. **Next:** owner review and first commit; P1
Foundation.

*2026-10-15, later.* Owner's package reviewed (Claude Code). The owner added a package (now `source/owner-package-2026-10-15/`), a scaffold of
deliverables 2–10. Reviewed every file ([review](reviews/owner-package-2026-10-15.md)): real drafts of the
zone map (15 zones with per-zone consent and cooldown), flagging keys and RPCs, the preset schema (1 of
12), 3 weapons, 3 creatures, a dungeon, the HUD layout with crosshair variants, 5 QA tests and naming
conventions; the rest are one-line stubs or placeholders. Problems found by parsing: all three JSON files
invalid (doubled quotes, a comment, a BOM), broken quoting in two CSVs, mojibake in two text files; the
zone map is about 16 times the direction's world as written (÷4 gives 24.6 km²); Skitterjaw's biome
differs from the tutorial; weapon and armour units unstated. Adopted the usable content into GDD modules
01, 02, 03, 05, 07, 08, 09, 10, 12 and the naming conventions into the engineering guide; the package is
kept as received.
Owner's answers: a world of about 75 km² (D-14; zone map scaled by 0.4375 to 75.3 km²), the Skitterjaw
is a desert creature (D-16; the coastal tutorial's first fight becomes OQ-12), third-person camera with
aim-down-sights (D-15), and approval for the first commits. Corrected, valid working copies of the
package data in `data/` (zones, weapons, creatures, presets, dungeon, HUD); a semicolon in zone Z003's
note had split it into an extra column.

*2026-10-15, night.* Name and P1 Foundation (Claude Code). The owner named the game **Tharrn** (D-17): the Unreal project became `D:\Tharrn` (module, class prefix and content folder renamed; its history is one commit, fb20fca) and this record `projects/Tharrn`. `D:\Wildwright` is gone; Wildwright's 7 commits in the Mr. Mak repo's history remain: Claude Code's safety check refused the history rewrite, so it waits for the owner. P1 built through Unreal MCP in the live editor: the data in `Data/` (from the package's corrected copies) imports into three data tables and reads back with 0 problems; C++ row types and helpers; the net probe (a replicated counter, a client-to-server ping); two MCP toolsets of our own in the editor module, Blueprint notes (MCP could not write node comments or variable descriptions) and play sessions (a client that joins late); the test range map with two Blueprints carrying comment boxes and descriptions; scripts for tests and the network test. Found on the way: the editor in the background runs at 3 frames a second, which made every round trip read 1000 ms (the network test now switches that off while it runs); a late client logged the map's 0 before the server's value arrived (the probe now reports only values from the server); the Android File Server plugin had written a security token into the config again (plugin switched off). PCG Biomes Poplar Forest finished installing: staged only its PCG framework (82 files, 0.17 GB; no trees), every one of its 25 graphs loads and its 14 Blueprints compile with no warnings. **Verified:** both targets build with no warnings; plugin check PASS; 27 automation tests pass (31 after the fix below); the network test passes as listen server and as dedicated server with 2 clients and a late joiner, 50 ms each way and 1 % loss, round trips 119–172 ms. **Not verified:** the owner's play-test; anything with a character beyond the template. Then the **Tharrn Wiki**, the owner's new pinned Workspace card: 9 tabs (overview, world and zones with a zone map drawn from the data, bestiary, combat, survival, progression and dungeons, PvP and travel, characters and HUD, development), built by `tools/build_wiki.py` from GDD 0.1 and the game's data files; checked with Mr. Mak's own report theme in dark and light at 1280, 768 and 390 px (no page overflows; tables scroll inside their frame on phones) and against the template's card rules. Later: the P2 plan (the sample's Character Movement version, with predicted gait, slide and server-checked mantle in C++; OQ-14 asks the owner to confirm Character Movement over the Experimental Mover); deliverables 3 (PvP flagging state machine), 9 (creature behaviour templates) and 10 (QA matrix, 50 cases); `Tools/Checks/verify.py` runs ladder steps 1–4 in one go (all pass); the game target also builds in Shipping with no warnings; the probe's text rounded to whole milliseconds and enlarged after looking through a client's window; the editor now opens on `L_TestRange`. Found by opening `BP_NetProbe` in the editor: every run of the test range builder had added another comment box (10 in one graph), because the editor's delete tool cannot remove comment nodes and the builder ignored the failure; added `RemoveCommentBox` to the notes toolset (4 tests), the builder now removes old boxes and fails if any remain; two runs leave one box per graph. Reading two of the sample's Blueprints through MCP had marked them unsaved; saved, then restored from the launcher cache by the pack script. Proposals for deliverables 5 (stats for the Grav Raptor, Echo Swarm and Apex Titan; weak points and stagger for P6) and 7 (pistol, heavy and energy weapons, handling columns, the recoil curve, 11 attachments). Proposal for deliverable 6 (six room templates, three puzzle and two trap archetypes, generator rules). Deliverable 8: 12 placeholder HUD icons (SVG and transparent PNG, `tools/build_hud_icons.mjs`), shown in the wiki on dark tiles with the transparent file to download. Open questions informed by checks: OQ-13 (the sample runs at 5 m/s, 44.7 minutes across), OQ-03 (MetaHuman Creator's face technology is editor-only in 5.8.3; Mutable and DNACalib are the runtime routes), OQ-05 (Water is still Experimental). **Next:** owner play-test and commit approval; P2.

*2026-10-16.* The owner ran around the test range alone and found nothing to test: P1 has no gameplay, and the play-test asked for network counters. Explained; the engineering guide's ladder step 6 now asks for play-tests only of what the owner can see or feel, with a sign in the test map. Owner's answers: skip P1's play-test and start P2; commit both repos; D-18, the player is the Game Animation Sample's motion-matched character ("dont use the locomotion one tho, the running ect feels weird", about the template character they had just played); D-19, 45 minutes on foot. P1 closed.

*2026-10-16, day.* Commits: game repo 14c0633 (P1), Mr. Mak repo 8187772 (records, wiki). The owner allowed closing and reopening the editor for builds during P2. Owner's notes: the Sci-Fi Complete Bundle has everything needed (Poplar's PCG removed: pack row, staged files to the Recycle Bin, Unreal's experimental PCG Biome plugin off, base PCG on) and its documentation is the go-to reference (D-20, `docs/scifi-bundle.md`, all its linked guides read for their contents and caveats; every one says its example player and some systems are single-player only); Easy Game UI Ultimate 3.0 for menus and the HUD (D-21, `docs/easy-game-ui.md`); a Higgsfield subscription offered for art if needed (not yet). The editor had turned on the Chaos Vehicles plugin while the owner looked at the bundle's showcase; kept (the bundle's vehicles need it). **P2 built:** the sample's Character Movement character as `BP_TharrnPlayer` on C++ `ATharrnPlayerCharacter` and `UTharrnCharacterMovementComponent` (predicted gait, speeds, turning, slide; the server's mantle and vault check), `BP_TharrnGameMode` as the default, the sample's config (console variables, collision channels, acceleration replication), the test range's block course, lanes and controls sign, `build_player.py`, shared Blueprint helpers, `RunConsoleCommand` in the play-session toolset, movement tests in `net_test.py`. Found on the way: the sample's mantle trusts the player's machine (now checked by the server); its blocks' collision fooled the first two versions of that check (a plane through the middle; now measured by bounds); the check's corrections during a late server-side move left a player floating (no
corrections during an approved move now, and a safety net for the sample's own stuck-flying case); a spawn point
left from the engine template sent a test player into the 10 m target (removed); a chained rebuild command whose first step failed launched a second editor (closed at once, nothing lost; the rebuild now runs from a script that stops at the first failure). All checks pass (37 tests, the network test in both modes, builds including Shipping). An editor that had run dozens of play sessions started showing position corrections under emulated lag that a fresh editor does not (gotcha 47). The owner approved both P2 commits. **Next:** the owner's P2 play-test.

*2026-10-16, afternoon and evening.* P3 Weapons, then the Multiplayer Shooter System (Claude Code). The owner pointed
at MST Pro and Ultimate Weapon Pack (MST Pro has Lyra-style rifle, pistol and shotgun animations on the UE5
mannequin; Ultimate Weapon Pack was not downloaded and no listing has that exact name), then brought the Multiplayer
Shooter System 2.0 (MSS) with its documentation and GASP integration guide. MSS decides hits on the server without
lag compensation; the owner chose to combine it with P3's C++ (D-23). The owner also removed D-08's NoAI rule (they
changed which assets may be used with AI) and the Nanite Landscape Build Protocol with D-10 (an AI-written document),
asked to keep editor tools in C++, and asked about first person (none of the packs has it; open). Built: P3's C++
(weapon component, combat library, attribute set, projectile, targets, HUD), C++ editor toolsets
`TharrnAnimToolset` and `TharrnBlueprintSetupToolset`, and `setup_mss.py`, `build_mss_weapons.py`,
`build_mss_player.py`, `mss_test.py`; MSS staged outside Git with Easy Game UI. Fixed on the way: chooser tables
that need the sample's own animation Blueprint, MSS's HUD calling the server every frame for other players, MSS's
weapons and HUD outliving a downed player, a refused first shot after reloads, the moment a target goes down, a
projectile's steps under its arc, limb-edge disagreements (the shooter's view within 15 cm), and an editor crash in
the tool tests (a Blueprint compile collecting garbage in the middle of a tool call). **Verified:** the editor
builds; automation tests pass; the network test shows 0 to 1.2 % of shots disagreeing on hit or miss in both
server modes, made-up shots refused, the heavy round's flight exact; the MSS test passes; pictures of the player holding,
aiming and firing. **Not verified:** the owner's play-test of P2 and P3; picking weapons up, the hip-fire turn and
MSS's grenade (not built). **Next:** commit approval; the owner's play-tests.

*2026-10-16, night.* D-24, the owner's changes after P3's first build (Claude Code). Commits first, with the owner's
yes: game repo a470f3f (P3), Mr. Mak repo 7761e26 (records). Then the owner asked to remove the slide, keep hip fire
(asked: "Keep hip fire as now"), add the grenade launcher and hand grenades with the pack's explosions ("the required
stuff is in the shooter pack for heavy gun and genades"; asked: the launcher replaces the Mass Driver), remove the
test weapons, give aiming a first-person look through the sight (scopes and weapon mods later), and put weapon choice
on the mouse wheel. Built: the slide removed; the shape-built test weapons and their code removed; `GL01` and `HG01`
in the data with blast, fuse and sight-zoom columns; the server's blast (`UTharrnCombatSubsystem::Explode`); the
launcher round exploding (`ATharrnProjectile`, `BP_TharrnGrenadeRound` with MSS's looks); Tharrn's hand grenade on
MSS's throw (`UTharrnExplosiveComponent`, `BP_TharrnHandGrenade`); the view through the sight
(`ATharrnPlayerCameraManager`); the mouse wheel; `TharrnPlaySessionToolset.CaptureGameView` for pictures of a play
world. Fixed on the way: MSS's throw montage (UE5 only), its grenade's collision channel, its collision after the
throw and its late start of a thrown grenade under lag (the owner saw the grenade fall through the ground while Claude
was on it), the sights' middle. The owner allowed closing the editor for the last rebuild while testing. **Verified:**
both targets build; 80 automation tests pass; the MSS test passes (sight pictures, wheel, launcher, three grenades and
a refused fourth); the network test passes in a freshly started editor (0 corrections, 0 % of shots disagreeing in
both server modes, the launcher's flight within 0.0012 s and its blast on the server only). **Not verified:** the
owner's play-test; the holographic ring sits about 2° above the aim point. **Next:** commit approval; the owner's
play-tests.

*2026-10-16, late.* D-25 and P4 (Claude Code), the owner on a phone for a few days. Commits of D-24 (game repo
f2e695d, tagged d24-before-p4; Mr. Mak repo d2bff9f), then the owner: "Continue with whats next ... make notes or a
report for when I get home incase we need a roll back" (`docs/while-away.md`). The owner pointed at MST Pro (Hyper's
survival template); Claude recommended keeping Tharrn's own inventory and taking MST Pro's parts later. **Built:** the
inventory (C++, the server owns it), items and the starting kit from CSV, the hotbar drawing MSS's weapons (nothing on
the back), pickups and drops, the HUD and inventory screen in MSS's look, Easy Game UI's main menu, pause menu and
options (its HUD and game instance as Tharrn children, Tharrn's settings copies, one value changed in the pack). The
owner asked for pictures of the UI as it came together ("I like the screenshot updates"). A rebuild met Unreal's "Save
Content" box; the owner chose to force-close the editor; the editor's restore offer (three Easy Game UI Blueprints only
read) was skipped. A Live Coding patch crashed the editor once (test console variables); full builds since. Checkpoint
commit with the owner's yes: game repo 883a04d (p4-checkpoint-1). **Checks:** verify.py 5 of 5 (both targets build with no warnings, Shipping too; plugin check; data import; 84 automation tests, 4 of them new; the network test as listen and dedicated server); inventory_test.py passes as listen and dedicated server (the kit, the hotbar on every machine, the grenade slot, a bandage, a split, armour worn, 5 of 5 made-up requests refused, drop and pick up, one of two players getting an item in the same frame); mss_test.py passes on the hotbar; pictures of the HUD, inventory screen, pick-up prompt, main menu, pause menu and options.

*2026-10-16, night.* P5 (Claude Code) straight after P4's commit (game repo 700db9d, p4-built; Mr. Mak repo 70df312),
the owner: "Then continue with next step afterwards". **Built:** vitals as attributes the server runs (hunger,
hydration, felt temperature; neural stability kept at 100), GDD 03's two formulas, stamina predicted in the movement
(no corrections), climate areas and armour's comfortable range, a ration and a water bottle, crafting with a queue the
server checks, the vitals cluster, crafting panel and death screen in MSS's look, the bag a downed player drops, a cold
and a hot area and resources on the test range. Found by the new survival test: a held sprint key sprinted again every
1.25 s once out of stamina (now: let go first). Checkpoint commit under the owner's standing yes: game repo 8a93b0d
(p5-built). **Checks:** verify.py 5 of 5 (both targets build with no warnings, Shipping too; plugin check; data import; 91 automation tests, 7 of them new; the network test as listen and dedicated server with 0 corrections); survival_test.py passes as listen and dedicated server (the same vitals on the player's machine and the server; slower recovery and more sway below 30; a ration and water used, water at full kept; cold air hurts and slows, cloth armour comfortable; a bandage crafted, a craft cancelled with its inputs back, two made-up crafts refused; out of stamina after 8.3 s, then running with sprint held, 0 corrections; going down drops a bag, the screen is told, the new body has the kit, the bag can be picked up); inventory_test.py and mss_test.py pass; pictures of the vitals, a resource, the crafting panel and the death screen.

*2026-10-17, morning.* KK Design's videos and the main map's size (Claude Code). The owner: "You can look for kk
designs unreal on YouTube to see how the bundle pack biomes look for assembly of our biomes", then "This all will be
for the main map thats 100km²". Claude read about twenty of the channel's videos from their descriptions and preview
frames (YouTube does not serve their transcripts) and the bundle's example level from its saved actor files, without
opening it (37 biome volumes under one manager, 11 floating-island sets, colonies, a water actor). **Recorded:** how the
biomes look and how a map is assembled, the bundle's biome presets, water and shore pieces, Tharrn's biomes mapped to
them ([scifi-bundle.md](scifi-bundle.md#how-the-biomes-look-and-are-assembled-2026-10-17)); D-26 (the main map about 100 km²; D-14's size superseded), OQ-15 (how the zones fill
it), OQ-05's fallback now the bundle's own water; GDD 00, 06 and 07, the wiki; the P6 plan. **Next:** P6, starting
with the ocean test and the bundle's biome volumes online.

*2026-10-17, later.* P6 started (Claude Code). **Built:** `TharrnEditor.TharrnWorldBuildToolset` (C++, MCP: levels,
landscapes from height and paint files, saving Tharrn's levels, the bundle's editor buttons, PCG progress, unsaved
packages in pack folders), 13 tests; the Water plugin and virtual texturing switched on (one rebuild); a made-up 1 km
test coast (`Tools/Terrain/test_coast.py`, `L_CoastTest`) painted with the bundle's jungle shore, swamp, jungle and
rock layers. **Ocean test (OQ-05):** Unreal's ocean gives a clear tropical sea with waves and filled tide pools; the
bundle's water is pond water (murky green or fully clear): ocean for the sea, bundle water inland (pictures in
`pictures/p6/`). Found on the way: `ObjectTools.set_properties` takes a JSON string; a level saved while shaders
compile logs physical-material errors. Checkpoint under the owner's standing yes: game repo ef8a9a5 (p6-ocean-test).
**Checks:** verify.py 5 of 5 (104 tests, 13 new). **Next:** P6.2, the bundle's biome volumes on the test coast and
`nature_test.py`.

*2026-10-17, afternoon.* P6.2 (Claude Code). The bundle's biome volume on the test coast (Jungle Shore, Jungle Swamp,
Jungle; generated in about 35 s); in-game pictures with the HUD. **Found:** the first network test in the jungle failed
(6 to 33 corrections a sprint); the P5 survival test failed the same way on the test range, and both passed after an
editor restart: a long session (about two hours, Live Coding patches, many play sessions) made every sprint drift
(gotcha 94). On the way, the bundle's run-time bushes and boulders (which block and are made by each machine on its
own) were replaced by Tharrn's copies with no collision, made only for a server's own player (gotcha 95).
Checkpoint under the owner's standing yes: game repo d12d728 (p6-biomes-online). **Checks:** verify.py 5 of 5 (104
tests), nature_test.py (new) and survival_test.py pass as listen and dedicated server. **Next:** candidate coasts from
public lidar for the owner to choose from (OQ-06).

*2026-10-17, evening.* P6.4 candidate coasts (Claude Code). Four USGS 1 m lidar tiles (public domain) downloaded;
`Tools/Terrain/coast_terrain.py` (overviews, 2 km windows with a seabed and the bundle's paint layers) and
`Tools/World/build_coast_level.py` (level, landscape, ocean, the bundle's biome volume, generation, pictures). Built
A Hanalei Bay, B Polihale, C Waimea, D Point Lobos as scratch levels (outside Git) with pictures from the air, the sea
and the shore ([all four](pictures/p6/coasts/all_coasts.jpg)). Found on the way: the sea's height in the lidar differs by place (gotcha 99); Unreal's
Y runs south (98); the ocean leaves a dry island around its own place (96); a reopened World Partition level shows
few trees (97); editor pictures need the viewport there first (100). **Next:** the owner's pick of a coast (OQ-06)
and of the map's size rule (OQ-15); meanwhile the sky and time of day (P6.7) and the budget (P6.9).

*2026-10-17, night.* P6.7 (Claude Code). `ATharrnTimeOfDay` (C++): the hour worked out on every machine from the
server's clock, a start hour and a day length (proposal: 60 minutes from 9:30, OQ-11), `th.Time` to read or set it;
it drives the Sci-Fi bundle's environment controller (its `UpdateTimeOfDay` event) or Tharrn's sky. On the test coast
the bundle's controller replaced Tharrn's sky; it needs the level's own sun, sky, clouds, fog and post-process
actors (black but for glowing plants without them, gotcha 101), all always loaded (102). Pictures at noon, evening,
night (the corals glow) and dawn. **Checks:** Tharrn.World.TimeOfDay (new); nature_test.py now also checks that every
machine shows the same hour, before and after the server sets 21:00.

*2026-10-17, night (later).* P6.9 first numbers (Claude Code): HLODs built for the test coast
(WorldPartitionHLODsBuilder, 32 actors); the coast measured in the game at 1440p with the editor open: 24.8 ms GPU
(budget 16.6 on an RTX 3060), the jungle's trees and rocks most of it (Nanite 9.2 ms), clouds 1.7 ms, grass 1 ms, the
run-time layer nothing; DLSS did not start with the editor open (TSR ran). `measure_budget.ps1 -ExtraCmds` for
measuring one feature. **Next:** a clean run with the editor closed, then the cuts.

*2026-10-17, late.* The owner: "Water all around" (D-27: the main map is an island; the zones make about 100 km², sea
all around; OQ-15 resolved). The zone data scaled to 2.56 km zones (98.3 km²), the zone test and notes with it; the
wiki's zone map draws its grid from the data. A proposed island layout with a biome per zone for the owner
([picture](pictures/p6/main_map_layout.png), `Tools/World/draw_island_layout.py`). **Checks:** verify.py --quick (data import, 105 tests).

*2026-10-17, late.* The owner, on the phone: "I can't see the doc folder on my phone, so can't see where player should
start and island layout might be ok until I can see a editor screenshot". The island built as a blockout in the editor
(`Tools/World/island_blockout.py`, `/Game/Tharrn/Scratch/L_Island_Blockout`): 19 x 14 km of landscape at 8 m, the coast from the layout's own shape
(`draw_island_layout.island()`, now the same at any grid), each zone's ground and paint per proposed biome (the coast
green, the Fungal Forest the bundle's pink swamp ground, the desert sand, the plateau a 190 m mesa, the caverns rough
grey hills, the lagoon), a plane of the bundle's water for the sea, a yellow beacon and four player starts on the beach
at the Coastal Outpost's south-west corner. Pictures from the editor (from above with the zones labelled, from the sea,
at the start) on the wiki's World page with the four candidate coasts. Gotchas 104 to 106 (the sky not found by the
scene search, the bundle material's texture slots, Unreal's ocean drawing nothing at this size). **Checks:** the
pictures; the terrain's paint (at most 4 layers a component, every point adding up).

*2026-10-17, late.* The owner: "We can adjust layout later when im at the PC if we need changes, the starting area needs to be based off level difficulty for each region.  The player can pick 1 or 2 starting locations per region depending on difficulty they want to start with." D-28 recorded, OQ-16 opened (which zones; the tutorial at harder starts; choosing
again later). The starts are game data, `Data/StartLocations.csv` (8 proposed, in each region's zones without PvP;
not imported yet, P6.12 builds the choice); the layout picture, the island blockout (a beacon coloured by difficulty
and two player starts tagged with the start's id at each) and the wiki's World page (a table of the starts) read it.
GDD 01 (§1.3a) and 07 updated.

*2026-10-19.* After a power cut at the owner's home (nothing lost: both repos checked, the work since the last commit
intact), the owner had the work committed (`f882102`, tag `p6-terrain-wip`; `3c0d377`) and the editor started. M2:
the terrain tool on a 4 m grid refined to 2 m (9,399 x 6,859 points, heights -86 to 321 m, Z scale 200), biome
borders wandering near the zones' edges only, karst towers in clusters with giants, coastal uplands, the paint for
the bundle's presets (gotcha 107: Tharrn's Columnar copy reads Moon_Dune). M3: `L_Main` built (the 2 m landscape in
about 3.5 minutes, 298 packages, 688 MB); Unreal's ocean draws nothing there either (gotcha 106), so the sea is the
bundle's water on a plane; the owner was playing L_CoastTest when the first build tried (gotcha 108). The wiki's new
Map build tab shows the plan's progress and pictures from map-design.md.

*2026-10-19, evening.* The map moved to its own chat (the owner: L_Main scrapped, a better ExampleLevel_Bundled-style
map there; the uncommitted map tools left for that chat). This chat is now the interface's (the owner: GUI, UI, menus,
loading screen, to AAA quality; the wiki's Characters and HUD tab becomes GUI, UI, Menus, ours to post to). D-31: The
Division 2's menus and HUD with ARK's survival layout (D-31; the Building chat's decision is D-30). Draft 1 of the style guide (`docs/ui/tokens.css`, `icons.js`,
`style-guide.html`: colour, type, parts and their states, icons, HUD layout, motion, sound) and mock-ups over in-game
captures (HUD, inventory, main menu, loading screen), rendered with `docs/ui/render.mjs`; [ui-design.md](ui-design.md)
holds the direction, steps U1 to U8 and the pictures, which the wiki's tab reads.

*2026-10-19, evening.* The Building chat (Claude Code). The owner opened a chat for base building: "Here we will
access all the Bundles assests, like the floors, barrack's ect. Here we will find what AI we need to connect to for
rebuilding these assets [...] we will rebuild the assests to be individual parts so a player can build as they'd like
so remodeling will need to happen. we will also have different tiers of building." D-30 recorded (first written as
D-29 at the same moment as the interface chat's decision; the two chats settled on D-30 for building and D-31 for the
interface), OQ-17 (tiers), OQ-18 (storey height) and OQ-19 (the Hyper template) opened, [building.md](building.md)
written. Read from the open editor without changing it: sizes, triangles, materials and Nanite of 70 bundle pieces and
thumbnails of 48 (no package left unsaved). The barrack kit is on a 3 m grid with 4.5 m storeys and walls 1.8 m deep
at their widest; `_D` meshes are mesh decals and `_W` window glass; the main guide gives the look values
(`F_CustomPrimitiveVisuals`: five colours, dirt, dust, damage) and the level objects' power states. The Fab library's
flags: the bundle and the Hyper survival template are not marked "no AI". Higgsfield is on a free plan with 10
credits, its 3D models 5 to 25 credits each; fal.ai is not connected; Geometry Script is loaded in Tharrn's editor.
The owner then gave this chat the wiki's Survival and building tab, now **Building Assets**: "this is where you can
post pictures of progress and design ideas, its out space to build together and reach the triple A quality we need".
It reads building.md (progress and design-idea pictures, tiers, AI and tools, work stations, steps) and keeps GDD 03's
survival rules below; new pictures: the bundle's example colony from the open editor (the viewport's camera put back
afterwards) and a design picture of the grid, walls and tiers. **Checked** in Edge at 1280, 768 and 390 px, dark and
the app's light theme: no sideways scrolling, all 6 pictures load, the viewer opens with Download. **Next:** the
owner's choices (OQ-17 to OQ-19), then B2, the piece factory.

*2026-10-19, evening.* The owner opened the Weapons and Tools chat (D-32): the wiki's Combat and arsenal tab is its
space. W0 (Claude Code): the shooter pack's weapons measured through Unreal MCP without changing anything (vertices per LOD,
parts, bones, materials, 4K textures; thumbnails composed into sheets in `docs/pictures/weapons/`): each gun is modular, one
skeletal mesh per part on one weapon skeleton per class, with no sockets on the meshes (the muzzle is a child actor, the eye
behind the sight a tuned number). [weapons.md](weapons.md): the model contract (parts on the pack's class skeletons, sockets,
budgets, a core slot), which AI and tools do what and what is missing (nothing to start; the Higgsfield CLI's binary is
missing; a paid plan or a Lychee seat once the arsenal is made for real), the arsenal in waves, the hand tools as `melee`
weapon rows (proposals), steps W0 to W9. OQ-20 to OQ-22 opened. The wiki's Combat and arsenal tab now reads the page's
progress, pictures and tables. **Checks:** the wiki rebuilt; the Higgsfield balance read (10 credits, free plan).

*2026-10-19, evening.* The Story chat (Claude Code). The owner: "you are the story behind the game, how we got here, what we do, quests, progression, raids ect. you controll the Progression and dungeons tab, name is Progression and Story." [story.md](story.md), draft 1: the story in one page (the Exodus Initiative's First Signal, the two convoys, the Lattice and the Choir, the keeper's call), a timeline, the island's secrets act by act, four factions with hubs and reputation, the four origins' starter items and three-step intro quests, five acts with chapters and what each milestone needs, the five quest types with examples, cadence and a `Quests.csv` format, levels and XP (baseXP 100, rewards scaled by the curve, the level bands by region against the Map chat's layout), three talent trees of five tiers with keystones (the direction's nine kept), loot tiers' sources, blueprints, weapon mastery and reputation ranks, six dungeons with bosses and endgame difficulties, two raids, world bosses, faction wars and seasons; OQ-25 to OQ-27 opened; steps Q1 to Q8. The wiki's tab renamed **Progression and Story**: it reads story.md (an act strip drawn from the acts table, the sections, the steps) and keeps the draft dungeon's card from the game's data; GDD 04 and 09 point at the page. **Checked** with Playwright (Edge) at 1280, 768 and 390 px, dark and the app's light theme: no sideways scrolling, the picture loads, no page errors. Nothing committed: the owner's call.

*2026-10-19, night.* The Building chat (Claude Code). The owner's answers: "1. Tiers ( Wooden Fiber, Salvaged Mineral,
Enhanced Alloy, Biotech ) 2. yes 3. agree 4. yes, then continue with piece factory. and commit". D-33 recorded (the
four tiers, the 4.5 m storey, the Hyper template only a reference; OQ-17 to OQ-19 resolved); the tiers' looks are
proposals in [building.md](building.md) (the bundle as it ships becomes Enhanced Alloy). The shared record was committed
whole (`40bddde`) after the interface, weapons, map and story chats agreed. B2, the piece factory (game repo):
`Data/BuildPieces.csv` and `Tools/Building/build_pieces.py`, which cuts and joins the bundle's barrack meshes with
Geometry Script in a background editor beside the open one, into one frame (the storey's floor at z = 0, every bundle
mesh 80.4 cm down), with snap sockets (tag `TB`), box collision and a decal and glass mesh of their own. First six
pieces under `/Game/Tharrn/Building/Pieces`: foundation (the barrack floor, a ring of footings and a solid core in the
bundle's outside paint, its texture scale and wear colour copied from the barrack roof), floor and ceiling, roof, wall,
doorway wall, window wall. Found on the way: the bundle wall's body is 0.58 m (inside face at y 3, outside panel at
61) with ledges reaching up to 1 m into the room; trimming them above the floor only keeps the base flange under it,
so a wall still reaches 60 cm down and storeys overlap as in the bundle; footings are open frames (a foundation needs a
core); the bundle's base units are placeholder volumes in the grid material; a mesh's sockets are read with
`get_sockets_by_tag`, not the protected `sockets` property; a background editor sometimes crashes on exit after its
work is saved (the RESULT line is what counts); a background editor must not run while another chat compiles the
game's C++ (it holds the DLLs); and the open editor keeps a Nanite mesh's file open once it has drawn it, even for a
thumbnail, so later background saves of those pieces only logged "MoveFile was unable to move" (the first two game-repo
commits, `aa93a8b` and `ee76830`, hold the first build's meshes): the tool now checks every file it saves, and pictures
come from copies built with `TH_PREVIEW`. **Checks:** `build_pieces.py` RESULT ok (6 pieces, 0 problems: sizes against the
CSV, every socket, walls reaching under the wall below, every file written); game repo `c509229`; the Building Assets
tab in Edge at 1280, 768 and 390 px, dark and light, every picture loading. **Next:** B3, a gallery level built in a background editor
and pictures from the game, then the open points in building.md's piece factory section.

*2026-10-19, night (later).* The Building chat (Claude Code), B3. The owner: "You can go ahead, but remember that the
modular components can't have tears or openings in the graphics, they have to look like triple "A" parts players get to
used to build with." `Tools/Building/build_gallery.py` builds `/Game/Tharrn/Building/L_BuildGallery` in a background
editor (the Tharrn sky, a ground in the landing pad's surface, a two-storey base built from the pieces as a player would,
every piece on its own) with 12 camera views, photographed from the game with `capture.ps1`. The pictures showed an
opening at every outside corner (the bundle closes its corners with an L-shaped corner wall), a floor's edge open
between floor and ceiling, a messy line between storeys and, after the first fix, a floor core hiding its ceiling's
coffers. Now closed: a corner post (the bundle's medium pillar, its middle section stacked and scaled 1.2); floors carry
the foundation's ring of footings and a core resting on their ceiling. Right from the start: walls joined in a line, a
wall's free end, the trimmed inside faces, inside corners, the parapet. The Story chat's tier guide (story.md section
13) now sets the tiers' looks (building.md section 4). **Checks:** `build_pieces.py` RESULT ok (7 pieces, 0 problems),
`build_gallery.py` RESULT ok (54 pieces, 12 views), the capture RESULT ok twice; the pictures before and after on the
wiki's Building Assets tab; game repo `42bc60a`. **Next:** the rest of the set (triangle foundation and floor, half
wall, wall frame, door, stairs, ramp), each checked in the gallery the same way.

*2026-10-19, night (corner posts).* The Building chat. The owner asked: "the corner posts are apart of each wall now?"
No: the corner post is a piece of its own, the walls are unchanged (their ends were already closed), and the post fills
only the outside corner where two walls meet; the gallery places them by hand, the building system (B4) would add and
remove them itself. Logged as OQ-30 with that recommendation. The Building Assets tab now opens with the chat's next
step, OQ-30 and the decisions taken for it (D-30, D-33), as the README's rule asks.

*2026-10-19, night (the owner's corner test).* The owner: the post is approved and can be committed only once players
"can't see any openings like in the first picture, from any angle, including if a second player is standing near by
watching a player build, and the pillar covers the corners instantly"; otherwise keep working. Not yet a yes, so nothing
was committed. Found: the bundle's barrack pieces are thin layered panels with open ends and undersides, meant to be hidden
by the bundle's own corner pieces. A numba ray tracer over the exported pieces (game repo `Tools/Building/export_pieces.py`,
`check_corners.py`; scratchpad `rt.py`, `sweep.py`) paints the inside of any surface magenta. It confirms the post closes
the corner in the "after" view, but from other reachable angles every piece shows openings: a wall's free end (hollow),
the foundation's and floor's plate edges seen from above, the roof's underside edge, wall ends at straight joints and at
the post's sides. Its see-through count is still too loose (collision boxes include recesses), so it needs the boxes
shrunk by 15 cm. **Next:** close the pieces in `build_pieces.py` (end caps on walls, closed plate edges and undersides),
re-sweep until 0 magenta in every view, then B4's core: walls placed on the server, posts derived on every machine in the
same frame (instant, the same for a watching player and a late joiner), with a two-client test; then the commit.

*2026-10-20 (the owner's corner test).* The Building chat (Claude Code). The owner: "as long as players can see any
openings like in the first picture, from any angle, including if a second player is standing near by watching a player
build, and the pillar covers the corners instantly, then yes the second picture looks good and can commit. if you cant
say yes that it works how i described then continue to work on it." Logged as D-41 (resolves OQ-30), with those
conditions as its test.
**Any angle.** A small ray tracer outside the editor (`Tools/Building/raytrace.py`, numba) painted every surface seen
from behind magenta: the corner itself was closed by the post, but every piece opened from some angle (a wall's free end
hollow between its two panels; slits along floor, foundation and roof edges; the bands where the walls' ledges were
trimmed). The factory now closes them: wall end caps in the wall's own outline (`make_caps.py`), thin patches over every
opening seen straight on (`make_closures.py`, 3 to 80 a piece), two-sided copies of the bundle's materials
(`/Game/Tharrn/Building/Materials`). The gallery gained the junctions a player builds (an L-shaped house with an inside
corner, a free-standing wall, a T), posts placed by the building system's rule, and 49 views round them: none shows an
opening.
**At once, for a watching player.** The building system's core in C++ (`Source/Tharrn/Building`): the server checks and
places pieces (`ATharrnBuilding`, `UTharrnBuildComponent`), every machine draws them as instanced meshes and adds a
corner post in the same call, the same frame, as the wall that forms its corner; tests (`Tharrn.Building.*`) and a
network test with a builder, a watcher (a screenshot of every frame a wall arrives) and a late joiner
(`Tools/Building/build_net_test.py`).
**Checks:** pieces built (RESULT ok, 7 pieces, 0 problems); gallery (RESULT ok, 82 pieces, posts by the rule: 8 on the base, 6 on the junctions); 49 pictures from the game, no opening; game and editor targets build with no warnings; `Tharrn.Building.*` 5 of 5 pass; `build_net_test.py` RESULT ok (14 placed, 1 removed, 3 made-up refused; four machines with the same 13 pieces and 4 posts; each corner's post in its wall's frame on both players' machines; 10 watcher screenshots). Not yet committed: the commit is a git round through the Master chat. **Next:** that commit (both repos, only this chat's lines), then the rest of the set, the build tool and ghost preview.
