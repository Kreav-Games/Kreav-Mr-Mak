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
