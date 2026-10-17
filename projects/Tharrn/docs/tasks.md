# Tharrn — Task list

The current phase and what is next. One line per task; a module is done when it passes the verification
ladder (engineering guide §3) and the owner's play-test (D-06). Game repo paths are under
`D:\Tharrn\`.

## Setup (2026-10-15)

| # | Task | State |
|---|---|---|
| S.1 | New project `D:\Tharrn` from the third-person C++ template, renamed; setup carried over (D-03); packs staged; both targets build; the editor opens with DLSS and MCP; PIE runs | Done |
| S.2 | Design record: direction kept in `source/`, GDD 0.1 modularized (deliverable 1), decisions D-01 to D-17, guide, this list | Done; **owner review** |
| S.3 | Wildwright deleted (D-01) after S.1 was verified | Design record, Workspace card and its entry deleted; `D:\Wildwright` is gone (checked 2026-10-15). Left: its 7 commits in the Mr. Mak repo's history, removed by a history rewrite the owner runs (README, next actions) |
| S.4 | First commit of the new game repo and the new design record | Done 2026-10-15: game repo fb20fca, Mr. Mak repo 29e9dfc |

## Prototype (direction §6.1: core shooter feel, vitals, one biome, 3 creatures, MetaHuman base)

Proposed order; each module is built server-authoritative from the start (D-04).

| # | Module | Done when | State |
|---|---|---|---|
| P1 | **Foundation:** network test harness (PIE listen server and dedicated-server client, simulated latency and loss), CSV data-table pipeline, automation test scaffolding, a grey test range map | A replicated test actor passes the guide's network step; a CSV row imports and reads back in a test | Built and checked 2026-10-15 (ladder steps 1–4, below); closed 2026-10-16 (below) |
| P2 | **Shooter character:** the Game Animation Sample's motion-matched character as the player, third-person aim-down-sights camera (D-15), sprint, crouch, mantle (the slide was built, then removed by the owner, D-24); replicated | Two clients move and mantle smoothly at 100 ms latency | Built and checked 2026-10-16 (below); **owner play-test** |
| P3 | **Weapons:** weapon CSV (deliverable 7), SMG and pistol hitscan, one heavy projectile, recoil curves, spread, damage multipliers and armour, server-validated hits with rewind (OQ-09) | Test-range targets; under 2 % desync between two clients; tests for multipliers and armour | Built 2026-10-16 with MSS's weapons and animation (D-23); changed the same day (D-24: grenade launcher, grenades, aiming through the sight, the wheel, no slide); **owner play-test** ([steps](#p3-weapons-results-2026-10-16)) |
| P4 | **Inventory, hotbar and UI (D-25):** items from data, an inventory the server owns (grid, weight limit, equipment), a 12-slot hotbar (keys 1 to 9, 0, − and =; the wheel) that draws weapons, readies grenades and uses items, pickups and drops; the HUD, the inventory screen and Easy Game UI's menus in MSS's look | Every slot picks the same item on every machine; items move, stack, drop and are picked up through the server, made-up requests refused; the owner's yes | Built 2026-10-16 while the owner was away ([results](#p4-inventory-hotbar-and-ui-results-2026-10-16); report and rollback points: [while-away.md](while-away.md)); **owner play-test** |
| P5 | **Vitals and crafting** (started 2026-10-16, [plan](#p5-vitals-and-crafting-plan-2026-10-16))**:** health, stamina, hunger, hydration, temperature as attributes; the two formulas; crafting a bandage and ammo (the crafting screen); the vitals on the HUD; the death screen and dropping the inventory | Thresholds tested; the HUD matches on both clients | Built 2026-10-16 while the owner was away ([results](#p5-vitals-and-crafting-results-2026-10-16); report: [while-away.md](while-away.md)); **owner play-test** |
| P6 | **Coastal slice** ([plan](#p6-coastal-slice-plan-2026-10-17))**:** the first 1–2 km² of the 100 km² main map (D-26), in the starter biome: terrain (OQ-06), ocean test (OQ-05), the Sci-Fi bundle's jungle shore, swamp and jungle presets and its PCG biome system, assembled the way its example level is ([how](scifi-bundle.md#how-the-biomes-look-and-are-assembled-2026-10-17)), sky, budget table | Within the D-11 budget; the owner approves the images | — |
| P7 | **Creatures:** Skitterjaw (desert, D-16), Phase Warden, Grav Raptor (creature CSV, deliverable 5 in part), StateTree behaviour, perception, stagger and weak points | The tutorial fight (creature per OQ-12) works for two clients | — |
| P8 | **MetaHuman base:** the player as a MetaHuman from presets (OQ-03), customisation JSON saved and loaded | A preset choice survives a reload and shows on both clients | — |
| P9 | **Prototype play-through:** crash site → vitals → scavenge and craft → Skitterjaw fight → shelter (foundation, generator, bench) | The owner plays it for 10–15 minutes and calls it fun | — |

## P1 Foundation: what was built and checked

- **Data:** `Data/Weapons.csv`, `Creatures.csv`, `Zones.csv` import into `DT_Weapons`, `DT_Creatures`, `DT_Zones`
  (3, 3 and 15 rows) with `Tools/Data/import_data_tables.py`, read back and compared with 0 problems; a second
  run updates the tables in place. Row types and helpers in C++ (`Source/Tharrn/Data/`).
- **Tests:** 31 automation tests pass through MCP (`Tools/Checks/run_tests.py`): data parsing, zone bounds,
  tables, the net probe's setup, Tharrn's two MCP toolsets (Blueprint notes; play sessions, which start their
  own PIE sessions).
- **Network (D-04):** `Tools/Checks/net_test.py` plays L_TestRange as listen server + 2 clients and as dedicated
  server + 2 clients, 50 ms added each way and 1 % loss, and adds a third client halfway. Every client keeps up
  with the server's counter, the late client starts at the server's current value, round trips are 119–172 ms
  (100 ms of it added). Two bugs found and fixed on the way: a background editor's 3 frames a second made every
  round trip read 1000 ms; a late client reported the map's 0 before the server's value arrived.
- **Test range:** `L_TestRange` (140 x 60 m grid floor, targets at 10, 25, 50, 100 m, net probe, 4 player
  starts), `BP_NetProbe` and `BP_TargetDummy` with comment boxes and descriptions (D-07), all made by
  `Tools/TestRange/build_test_range.py`.
- **Builds:** game and editor targets build with no warnings; plugin check PASS.

**Closed 2026-10-16 without a play-test.** The owner ran around the test range alone and found nothing to do, rightly: P1 has no gameplay, and its multiplayer check runs in `net_test.py`. The owner chose to skip the play-test and go on to P2. To see the multiplayer check by hand (2 minutes): open `L_TestRange`; three dots next to Play, *Number of Players* 2, *Net Mode* "Play As Listen Server"; Play. Walking in one window moves the character in the other; the yellow probe text reads "Listen server" in one and "Client 1" in the other, with the same counter. Then back to 1 player and "Play Standalone".

## P2 Shooter character: plan (prepared 2026-10-15; started 2026-10-16)

What the Game Animation Sample gives (read through MCP, 2026-10-15):

- Two versions of its motion-matched character. `SandboxCharacter_CMC` is an `ACharacter` on Character Movement
  and is built for networking: the client sends its input state (`UpdateInputState_Server`, replicated
  `CharacterInputState`) and other players' copies animate from `OnCharacterMovementUpdated`.
  `SandboxCharacter_Mover` is a `Pawn` on the Mover plugin, which is still **Experimental** in 5.8.3 (Network
  Prediction is Beta).
- Mantle and vault (`AC_TraversalLogic`): the client finds the ledge, sends the result to the server, and the server
  replays it to everyone **without checking it**: against D-04.
- Slide exists only for the Mover version (`BP_MovementMode_Slide`). Gait changes (walk, run, sprint) are not part
  of Character Movement's saved moves, so under latency they would cause server corrections.
- Camera: the GameplayCameras rig (`CameraAsset_SandboxCharacter`, `CameraDirector_SandboxCharacter`).

Steps (D-18: the sample's motion-matched character on Character Movement, motion matching on; not the template's character):

| # | Step | Done when |
|---|---|---|
| P2.1 | Copy the CMC character and its animation Blueprint to `/Game/Tharrn/Characters/Player/`, reparented to a new C++ `ATharrnPlayerCharacter` (ability system component, notes); a Tharrn game mode uses it | It spawns and runs for a listen server and 2 clients with no errors |
| P2.2 | `UTharrnCharacterMovementComponent` (C++): walk, run, sprint, crouch and aim in the saved move, so they are predicted; speeds from the sample's curves | No corrections when changing gait at 100 ms latency |
| P2.3 | Slide as a predicted movement mode in the same component (entry speed, duration, friction; ends in a crouch) | Slides match on server and clients (built; removed 2026-10-16, D-24) |
| P2.4 | Mantle and vault: keep the sample's check and montages; the server repeats the check before anyone plays it | A client cannot mantle where the server finds no ledge (test) |
| P2.5 | Camera: the sample's rig plus over-the-shoulder offset, shoulder swap and aim-down-sights (field of view, offset, slower turn) on the Aim input (D-15) | Readable on the test range. Built: the sample's aim camera; shoulder swap and slower turning while aiming move to P3 |
| P2.6 | `net_test.py` movement check: a test-only console variable walks each client through a fixed path (walk, sprint, crouch, slide); server and clients log positions | Corrections and position differences under limits set from a first measurement |
| P2.7 | Owner play-test: L_TestRange, listen server and 2 clients at 100 ms; a sign at the start lists the controls and what to try (engineering guide §3, step 6) | The owner's yes |

## P2 Shooter character: what was built and checked (2026-10-16)

- **The player:** `BP_TharrnPlayer`, a copy of the Game Animation Sample's Character Movement character (motion
  matching, its camera, mantle and vault), reparented to C++ `ATharrnPlayerCharacter`. The movement rules moved to
  C++ `UTharrnCharacterMovementComponent`: sprint, walk, strafe and aim travel inside every movement update, so the
  server applies them at the same moment the player did (the sample sent them separately, which causes pull-backs
  under lag); speeds, turning and gait as in the sample. The Blueprint keeps input, camera, animation and mantling;
  its graph notes say what moved where. Built by `Tools/Player/build_player.py`; `BP_TharrnGameMode` is the default.
- **Slide:** sprint and crouch: a predicted movement mode (speed boost, steady braking, faster downhill, ends in a
  crouch), the sample's slide clip played full body. About 1 s and 5 m on flat ground. *Removed by the owner on
  2026-10-16 (D-24): crouching at any speed now only crouches.*
- **Mantle and vault:** the sample's own, plus a server check: the server looks for the ledge itself and refuses the
  move if there is none, and while it plays only accepts positions close to its own (the sample trusted the
  player's machine completely). A safety net returns a player the sample left flying after an interrupted move
  (engineering guide, gotcha 46).
- **Aim:** the sample's aim camera (closer, over the shoulder) on the right mouse button; the character faces where
  the camera looks.
- **Config:** the sample's console variables, collision channels and replication setting (engineering guide,
  gotcha 39).
- **Checks:** 37 automation tests pass (`Tharrn.Player.*` new: move flags, the server reading them, the speeds behind
  D-19; `RunConsoleCommand` tests). The network test (50 ms each way, 1 % loss; listen server and dedicated server):
  every player runs a scripted path (walk, run, sprint, slide, stand, run, stop): 0 to 2 corrections per player,
  every machine sees every player within 1 cm; a client runs the block course (hurdle 1 m, mantle 1.5 m, climb
  2.5 m), the server approves all three; every client sends a made-up mantle in open space, the server refuses
  every one and positions still agree. Editor and game targets build with no warnings, Shipping too.
- **Test range:** eight starts in four lanes, the block course on the left, a sign with the controls at the start.
- **Not built:** shoulder swap and slower turning while aiming (P3, with weapons); mantling on anything but the
  sample's blocks (gotcha 40, with P6).

**Owner play-test (about 10 minutes):**
1. Open Tharrn; the editor opens the test range. Press Play.
2. The sign on the left lists the keys. Run (W A S D), hold Shift to sprint, Ctrl to walk, C to crouch.
   (The slide that was here is gone, D-24.)
3. Run at the three blocks on the left and press Space in front of each: a hurdle (1 m), a mantle (1.5 m) and a
   climb (2.5 m).
4. Hold the right mouse button: the camera comes in over the shoulder to aim. The middle mouse button switches
   between facing the camera (the default) and turning towards where you run.
5. Three dots next to Play: *Number of Players* 2, *Net Mode* "Play As Listen Server"; Play. Do the same in the
   second window and watch the first: the other player should move and climb the same way.
6. Set it back to 1 player and "Play Standalone". Tell Claude what feels wrong or good.

## P3 Weapons: plan (2026-10-16)

The systems first, with placeholder weapons (D-22). What exists to build on: the weapon rows in `Data/Weapons.csv`
(AR-01, SMG A1, SG-01), deliverable 7's proposals (pistol PS-01, heavy MR-01, the extra columns, recoil curves),
the ability system component on the player (P2), the test range's targets. Not available: weapon models and weapon
animations (OQ-04, D-22): the template's pistol and rifle animations are for another skeleton, and the sample's
animation Blueprint has no upper-body layer, so a placeholder weapon sits in the right hand with unarmed movement.

| # | Step | Done when |
|---|---|---|
| P3.1 | Data: the pistol PS-01 and heavy MR-01 rows and deliverable 7's columns (reload, aim time, spread, falloff, pellets, fire mode) in `Data/Weapons.csv` as starting values; `Data/WeaponRecoil.csv`; row types and import | Imported and read back with no problems; C-07 |
| P3.2 | Combat rules in C++: hit zones on a body (head, torso, limbs), zone multipliers (×2.5, ×1, ×0.75), armour (cloth 10 %, composite 30 %, alloy 50 %), damage falloff, spread from a shot's seed, recoil from the curve | Automation tests C-01 (curve), C-02, C-03 |
| P3.3 | Health and armour on the Gameplay Ability System: an attribute set (health, maximum health, armour reduction); damage only from the server; death and respawn on the test range | Tests; health matches on every machine |
| P3.4 | `UTharrnWeaponComponent`: weapons from data, switching, automatic and single fire, ammunition and reload, spread, recoil. The player's machine fires at once (muzzle, tracer, predicted hit marker) and sends the shot; the server checks rate, ammunition and aim, works out the shot's spread from the same seed, and decides hits against hit zones rewound to when the player fired (`UTharrnHitHistory`, OQ-09) | Tests; C-05 (impossible shots refused) |
| P3.5 | Heavy projectile (MR-01): a server projectile with gravity and travel time from its data; the shooter sees a predicted copy | C-06 |
| P3.6 | Placeholder look and feedback: weapons built from simple shapes, muzzle flash and impacts (the Sci-Fi bundle's effects if they fit), a plain HUD (crosshair sized by spread, ammunition, hit markers) until Easy Game UI (P4) | Readable on the test range |
| P3.7 | Test range and input: targets take damage by zone, each with an armour material, show it and reset; our own copy of the sample's input mapping without its demo keys (left mouse "takedown", R "ragdoll"), plus fire, reload and weapons 1 to 3 | The owner can shoot every target |
| P3.8 | `net_test.py`: players shoot targets and each other at 100 ms; the server's hits against each client's predicted hits; made-up shots refused; projectile drop | Under 2 % of shots disagree (C-04) |
| P3.9 | Owner play-test | The owner's yes |

**With MSS (D-23, 2026-10-16).** The owner brought in the Multiplayer Shooter System; the weapons combine it with
the C++ above. Its GASP CMC guide is followed ([reference](mss.md)), with these differences: the shooter layer is
retargeted from the UE5 mannequin to the sample's UEFN skeleton by a retargeter made for it, and shots go through
`UTharrnWeaponComponent`.

| # | Step | Done when |
|---|---|---|
| P3.10 | Stage MSS as a pack (outside Git); Common UI with MSS's input data; the Projectile and Laser channels in free slots (4 and 5: the sample uses 1 to 3); `UTharrnAnimToolset` (C++ editor tools: AnimGraph nodes, linked graphs, skeleton sockets, retargeting) | Builds; toolset tests pass |
| P3.11 | Animation: MSS's sockets on the UEFN skeleton; a UE5-to-UEFN retargeter; MSS's character animations and `ABP_Overlay_Shooter` retargeted; the overlay linked into the sample's CMC animation Blueprint; a `BP_DA_MSS` of poses; `BPI_Locomotion` fed from the sample's movement | The player holds and aims a rifle with motion matching underneath |
| P3.12 | Character: `BPC_Shooter_System`, holsters, the `Root_Mesh` tag, interaction (hold to pick up), hip-fire orientation; MSS's Blueprints set to the new channel slots | Pick up, equip, holster, drop and reload work, on every machine |
| P3.13 | Combine: MSS's trigger sends the shot through `UTharrnWeaponComponent`; MSS's projectiles and lasers become effects only; ammunition, fire rate and spread from `DT_Weapons`; MSS's HUD shows Tharrn's ammunition and hit markers | `net_test.py` passes (C-04, C-05, C-06) with MSS weapons |
| P3.14 | Owner play-test with MSS weapons | The owner's yes |

**After the first build (D-24, 2026-10-16).** The owner's changes: no slide; hip fire stays; a grenade launcher in
place of the Mass Driver, and hand grenades, with MSS's explosions; the test weapons removed; aiming looks through the
sight; the mouse wheel picks weapons. Weapon mods and the whole UI come later.

| # | Step | Done when |
|---|---|---|
| P3.15 | Remove the slide: the movement mode, its animation and tests; the movement test crouches instead | Builds; the network test's movement passes |
| P3.16 | Remove the shape-built test weapons (their C++ class `ATharrnWeaponVisual`, Blueprints, builder, Tharrn's old fire, reload and 1 to 3 keys); tracers and hit effects from each MSS weapon (MSS's bullet hit) | Shots still show tracers and hits |
| P3.17 | Grenade launcher `GL01` (MSS's) in the heavy slot: its round explodes where it lands (C++ `ATharrnProjectile`, MSS's grenade, trail, fireball, scorch, shake); the server's blast (`UTharrnCombatSubsystem::Explode`: falloff, armour, walls shield, your own hurts) | Tests; the blast only on the server (C-06) |
| P3.18 | Hand grenade `HG01` on MSS's throw (G): the server counts three, throws along the aim at the data's speed, deals the blast; MSS's throw montage retargeted, its collision channel and its collision after the throw fixed | Three thrown and exploding on the server, a fourth refused (MSS test) |
| P3.19 | The view through the sight while aiming (`ATharrnPlayerCameraManager`), zoomed by `ads_zoom`; tuned per weapon from pictures (`TharrnPlaySessionToolset.CaptureGameView`) | The sight centred when aiming, on every weapon |
| P3.20 | The mouse wheel: next and previous weapon through MSS's swap | Up and down change the weapon on every machine (MSS test) |
| P3.21 | Owner play-test | The owner's yes |

## P3 Weapons: results (2026-10-16)

- **Done:** P3.1 to P3.8 and P3.10 to P3.13, except what is listed under *Not built*. The weapons are
  `UTharrnWeaponComponent` (C++): data from `Data/Weapons.csv` and `Data/WeaponRecoil.csv` (SMG A1, pistol PS-01,
  heavy MR-01), shots predicted on the player's machine and decided on the server with hit zones (head ×2.5, torso
  ×1, limbs ×0.75), armour (cloth 10 %, composite 30 %, alloy 50 %), falloff, spread from a shared seed, recoil
  curves, damage through the ability system, bodies rewound to the moment of the shot, the shooter's view taken
  within 15 cm; the heavy round flies on the server with gravity, the shooter sees a predicted copy. MSS gives the
  look and handling: the upper-body layer on the sample's motion matching, its weapons (placeholders, D-22) drawn
  from holsters on the thigh and back, reloads, recoil on the arms, its HUD showing Tharrn's ammunition. Targets on
  the test range show health and armour and stand up again; a downed player comes back after 3 seconds.
- **Checks:** 76 automation tests pass (new: `Tharrn.Combat.*` zone multipliers, armour, falloff, spread seed, body
  zones, shot claims, recoil curve, projectile drop, shot checks, weapons from data, damage effect;
  `Tharrn.Editor.Anim.*`, `Tharrn.Editor.BlueprintSetup.*`). Network test (50 ms each way, 1 % loss; listen and
  dedicated server, 2 clients and a late joiner): every player shoots targets, one client shoots a running player,
  every player sends a shot from 20 m up, one fires the heavy weapon aiming: 0 to 1.2 % of shots disagree on hit or
  miss (C-04, limit 2 %), every made-up shot refused (C-05), the heavy round's flight time and drop within 0.001 s and
  0.1 cm of its speed and gravity with only the server dealing damage (C-06). MSS test (`mss_test.py`, a listen
  server and a client): the client draws the pistol, fires it once a press, reloads, swaps to the SMG and holds the
  trigger (16 to 18 shots), every machine sees the same weapon in the hand, the server takes every shot. The block
  course's position check now waits for the runner to stand (it had compared a player still sliding to a stop, where
  its own machine is one trip ahead of the server).
- **Found and fixed on the way:** the sample's chooser tables need its own animation Blueprint class (a copy broke
  motion matching and the frame rate); MSS's HUD calls the server every frame on other players' copies; MSS's
  weapons and HUD outlived a downed player; the first shot after a reload was refused; targets that had just gone
  down; a projectile's straight steps under its arc; an editor tool's Blueprint compile collecting garbage mid-call,
  which crashed the editor in full test runs (engineering guide, gotchas 48 to 67).
- **After D-24 (2026-10-16): done:** P3.15 to P3.20. The slide is gone; crouching only crouches. The heavy slot is
  the grenade launcher `GL01` (120 damage at the centre, 4 a magazine, 50 m/s; proposals); its round explodes where it
  lands. Hand grenades `HG01`: three each, 150 at the centre, 3 s fuse, thrown at 15 m/s (proposals; MSS's 8 m/s
  landed inside the blast). Both blasts: full within 1 m, none past 5 m (MSS's radii), through armour, shielded by
  walls, your own included, only on the server. Aiming with a weapon looks through its sight (zoom 1.25 on the SMG,
  pistol and launcher). The mouse wheel picks the next or previous weapon. The shape-built test weapons and their
  code are gone.
- **After D-24: checks:** 80 automation tests pass (new: `Tharrn.Combat.Blast`;
  `Tharrn.Editor.PlaySession.CaptureGameView`; the weapon data test covers the launcher and the grenade). Network
  test (50 ms each way, 1 % loss; listen and dedicated server, 2 clients and a late joiner; a freshly started
  editor, gotcha 47): movement with 0 corrections and a crouch from a sprint, the block course approved, made-up
  mantles and shots refused, 0 % of shots disagree on hit or miss (targets and the runner, both modes; C-04), the
  launcher's rounds within 0.0012 s and 0.16 cm of their speed and gravity, their blasts reaching targets on the
  server only (C-06). MSS test: as before, plus the view through the sight (pictures), the wheel up (launcher) and
  down (SMG) on both machines, two launcher rounds exploding on the server only, three grenades thrown at 15 m/s,
  each exploding on the server just above the floor, and a fourth refused. Both targets build with no warnings
  (Shipping too).
- **After D-24: found and fixed on the way:** MSS's grenade fell through the floor (its collision channel is Tharrn's
  "Traversable" slot; MSS turns its collision back on through a reference it has already cleared); with network lag,
  MSS's start of a thrown grenade could come too late and the grenade hung in the air until it went off in the
  thrower's face (the server now starts it); MSS names a UE5
  throw montage that does not play on the UEFN skeleton, so the grenade never left the hand; a component's bounds
  for MSS's sights came from their collision, far from the glass; on a busy listen server, clients saw a test-range
  target stand up sooner than the server's grace allowed, and their hits were refused (engineering guide, gotchas 68
  to 75).
- **Not built:** picking weapons up from the ground (MSS's interaction); two key clashes with the sample (middle mouse
  button, gamepad top button); Tharrn's own weapon models (D-22) and with them scopes and weapon mods (attachments,
  deliverable 7); MSS's holographic sight shows its ring about 2° above the middle of the screen, where shots go.
  Not wanted (D-24): the hip-fire turn, a first-person mode.

**Owner play-test (about 10 minutes):**
1. Open Tharrn; the editor opens the test range. Press Play. The sign on the left lists the keys.
2. Press X: the pistol comes out of the thigh holster into the right hand. Left mouse fires it, one shot a click;
   the HUD at the bottom right counts the magazine down (12) and the spare rounds.
3. Shoot the targets down the range (10, 25, 50, 100 m, each a different armour): the number above each one drops,
   more for the head, less for the arms and legs, less again through better armour; at 0 it shows DOWN and stands
   up again 3 seconds later. A white cross flashes on a hit.
4. Press R to reload. Roll the mouse wheel up (or press F): the pistol goes back to the thigh and the SMG comes off
   the back; hold the left mouse button for automatic fire. Hold the right mouse button to aim: the view moves into a
   first-person look through the weapon's sight, a little zoomed. Wheel down picks the previous weapon.
5. Wheel up again for the grenade launcher: its round flies in an arc and explodes where it lands; a target within
   5 m loses health, more the closer it is, none behind a block.
6. Press G: a grenade comes into the left hand. Hold the right mouse button to see the arc, hold the left to pull the
   pin, let go to throw; it explodes 3 seconds after the pin. Three each (bottom left counts them); G again with the
   pin still in puts it away.
7. Run, sprint and crouch with a weapon out, and try the blocks on the left: the movement should feel as before (no
   slide any more).
8. Three dots next to Play: Number of Players 2, Net Mode "Play As Listen Server"; Play. Shoot the other player from
   one window and watch the other: the same weapons, shots, grenades and health on both.
9. Tell Claude what looks or feels wrong: the grenade and launcher numbers are proposals, and the sights can be moved
   per weapon.

## P4 Inventory, hotbar and UI: plan (2026-10-16)

D-25. The owner, on the phone for a few days: "Continue with whats next and when im home we can revisit"; the
proposals below are checked with the owner then ([while-away.md](while-away.md)). What exists to build on: MSS's weapons and throw, driven by Tharrn's weapon component
(P3); MSS's own UI styles (`DMD/Widgets/Styles`: borders, text, buttons) and its weapon selector; Easy Game UI's
menus, options, HUD builder (pickup notices, input prompts) and interaction system; `weight` in `Data/Weapons.csv`;
armour as an attribute (P3). To work out first: MSS carries at most one weapon of each class (primary, secondary,
heavy) in holsters on the body, while the hotbar holds any weapon in any slot with nothing on the body. So the server
makes the chosen weapon's MSS actor when its slot is picked and removes the one put away, keeping its rounds on the
item.

| # | Step | Done when |
|---|---|---|
| P4.1 | Drive MSS from a slot: the server makes the chosen weapon's MSS actor and MSS draws it with its animation; the weapon put away is removed with its rounds kept; no holsters on the body; Tharrn's own copy of MSS's key mapping without F, X, G and Z (the hotbar and the inventory take their jobs) | Each of the three weapons drawn by a console command on every machine; the MSS and network tests pass |
| P4.2 | Data: `Data/Items.csv` (id, name, type, weight in kg, stack size, icon, the weapon or armour it is, notes): the three weapons, their ammunition, the grenade, a bandage, three armour pieces (cloth, composite, alloy); an ammunition column in `Weapons.csv`; the starting kit; row type and import | Imported and read back with no problems (I-01) |
| P4.3 | `UTharrnInventoryComponent` (C++): 12 hotbar slots, a 30-slot grid, equipment slots (head, chest, legs, back), a weight limit; add, remove, stack, split, move and swap; only its owner receives the contents, everyone sees what is in the hands; the client asks, the server checks and changes. Reloading takes ammunition from it; grenades are items (P3's count of three goes); worn armour sets the armour attribute | Tests I-02 to I-04; made-up requests refused (I-05) |
| P4.4 | The hotbar: keys 1 to 9, 0, − and = pick a slot; the wheel moves to the next or previous filled slot; a weapon is drawn, a grenade readied (what G does now), a bandage used (it heals; crafting it is P5); the same key again puts the weapon away | Every slot on every machine (network test, I-06) |
| P4.5 | Pickups and drops: items lying in the world, picked up with a key (Easy Game UI's interaction system if it holds up with the server deciding, D-04; otherwise C++); dropping from the inventory lays one down; two players taking one item: one gets it; a table of items on the test range | Network test (I-07) |
| P4.6 | Tharrn's UI style from MSS's: its borders, text styles, colours and font, as one style every screen uses; Easy Game UI's global styling set to it | Pictures for the owner |
| P4.7 | HUD: the hotbar bottom centre (key, icon, count, rounds in the magazine; the slot in the hands lit); the weapon and ammunition bottom right (MSS's); crosshair and hit markers; Easy Game UI's pickup notices; `Data/UI/HudLayout.json` updated; Tharrn's plain text HUD goes | Pictures; the same on both clients (I-08) |
| P4.8 | The inventory screen (Tab): the grid, weight, equipment and the hotbar row; drag and drop, split, drop, item details; mouse and gamepad (Common UI) | Works on a client at 100 ms; pictures |
| P4.9 | Menus from Easy Game UI, set up as its pages say: the main menu (play the test range, options, quit), pause (Esc), options; its demo content removed | The game starts from the main menu |
| P4.10 | Checks: an inventory network test; `mss_test.py` on the hotbar instead of F and G; the whole ladder | `verify.py` passes |
| P4.11 | Owner play-test | The owner's yes |

Numbers to start from (**proposals**, in the data): 12 hotbar slots and 30 in the grid; 60 kg carried, over it no
sprinting; the starting kit is the SMG, pistol and launcher with four magazines each (as now), three grenades and two
bandages, with armour to pick up on the test range. Later, not P4: the crafting and death screens (P5), the map (P6,
with the coastal slice), storage boxes (with building), a backpack or jetpack in the back slot (GDD 02), the quest
log; the inventory kept between sessions comes with the server's save.

## P4 Inventory, hotbar and UI: results (2026-10-16)

Built while the owner was away (go-ahead: "Continue with whats next"; checkpoints committed with the owner's yes). The
report and rollback points are in [while-away.md](while-away.md), with pictures.

- **Done:** P4.1 to P4.10.
  - **Inventory (C++, the server owns it):** `UTharrnInventoryComponent`: 12 hotbar slots, a 30-slot grid, worn slots
    (head, chest, legs, back), 60 kg (over it no sprinting); the rules in `TharrnInventory` (stack, split, move, swap,
    worn slots); the player's machine only asks. Items from `Data/Items.csv` (14), the starting kit from
    `Data/StartingKit.csv`, each weapon's `ammo_item` in `Weapons.csv`.
  - **The hotbar drives MSS:** the server makes the chosen MSS weapon and has MSS draw it and put the old one away;
    only the weapon in the hands shows; reloads take rounds from the inventory; grenades are items (a grenade slot does
    what G did); worn armour sets the armour; a bandage heals 25 (not at full health).
  - **Keys:** 1 to 9, 0, - and = the hotbar; the wheel through its weapons; E pick up; Tab inventory; Esc pause menu.
    MSS's F, X, G and Z are blocked.
  - **Pickups and drops:** items lying in the world (MSS's weapon models, its grenade and crates), the prompt "E Pick up
    ..." when looked at within 2.5 m; the server checks the reach; a table of items on the test range.
  - **UI in MSS's look** (its panel and text styles, pale blue-white on dark): the hotbar with the item in the hands
    named above it, health and weight bottom left, the pick-up prompt, hit markers; the inventory screen on Tab (worn,
    grid, hotbar row, drag and drop, right drag for half a stack, drop outside to lay it down, double click to use,
    wear or take off, item details). MSS's weapon selector and its X, Z, F and G hints are hidden; its ammunition,
    crosshair and R and V hints stay.
  - **Menus (Easy Game UI):** the game starts at `L_TharrnMainMenu` (THARRN, press any key, then Easy Game UI's main
    menu; New Game opens the test range); Esc opens its pause menu (Continue, Options, Quit to Title Screen, Quit; the
    world goes on: online); its options (video, graphics, gameplay, controls, audio). Tharrn's own settings and styling
    copies; the pack's config selector points at them (the one change to the pack, backed up).
- **Checks:** verify.py 5 of 5 (both targets build with no warnings, Shipping too; plugin check; data import; 84 automation tests, 4 of them new; the network test as listen and dedicated server); inventory_test.py passes as listen and dedicated server (the kit, the hotbar on every machine, the grenade slot, a bandage, a split, armour worn, 5 of 5 made-up requests refused, drop and pick up, one of two players getting an item in the same frame); mss_test.py passes on the hotbar; pictures of the HUD, inventory screen, pick-up prompt, main menu, pause menu and options.
- **Found and fixed on the way:** a Blueprint copies into new widgets only the class defaults set before its compile (the
  inventory screen came up empty); collapsing MSS's weapon selector pushed its ammunition off the screen (now hidden
  instead); a Live Coding patch of a file with test console variables crashed the editor on the next play (now a full
  build for those); the network test's starting-kit line has no player name yet (the test counts lines) (engineering
  guide, gotchas 76 to 84).
- **Not built / later:** the crafting and death screens and the vitals on the HUD (P5); the map (P6); storage boxes;
  the gamepad's hotbar (its MSS swap still works); hosting and joining from the main menu (Easy Game UI has no online
  menus: a later module); Easy Game UI's menu backdrops (teal, pink) and its demo content stay until the whole UI pass;
  a real logo (a text placeholder now).

**Play-test (P4, about 10 minutes).**
1. Open `D:\Tharrn\Tharrn.uproject`; the test range opens. Press Play.
2. Bottom centre: the hotbar. Press 1: the SMG comes out (MSS's draw); 2: it goes away and the pistol comes out; 2
   again: hands empty. Nothing hangs on your back. The wheel steps through the weapons.
3. Fire and reload: the rounds come out of the inventory (bottom right: in the magazine | in the inventory).
4. Press 4: a grenade comes into the hand (aim, hold fire to pull the pin, let go); 4 again puts it back. Press 5 with
   full health: nothing; it heals once you are hurt.
5. Walk to the items on the right of the start: look at one, "E Pick up ..." shows; press E.
6. Press Tab: the inventory. Drag items between the grid, the hotbar row and the worn slots; right drag splits a stack;
   drop one outside the panel to lay it on the ground; double click the vest to wear it. Tab closes it.
7. Press Esc: the pause menu; Options shows the settings. (In the editor, Esc may stop play instead: try it in a
   standalone game, Play menu: Standalone Game.)
8. Play menu: Number of Players 2, Listen Server: the same weapon in the hands on both screens, items picked up by one
   player gone for the other.
9. Tell Claude what looks or feels wrong: sizes, places, colours, the numbers (60 kg, 30 slots, the kit).

## P5 Vitals and crafting: plan (2026-10-16)

Started straight after P4 while the owner is away ("Then continue with next step afterwards"); the proposals below are
checked with the owner when home ([while-away.md](while-away.md)). What exists to build on: health and armour on the
Gameplay Ability System (P3), the inventory the server owns and its items (P4), the bandage, the HUD and inventory
screen in MSS's look, the 12 placeholder HUD icons (deliverable 8).

| # | Step | Done when |
|---|---|---|
| P5.1 | Vitals as attributes next to health (C++, the server owns them, D-04): stamina, hunger, hydration, felt temperature, neural stability (kept at 100 for now: its effects come later, it is in the aim formula); a vitals component ticking them on the server at rates from `Data/Vitals.csv` | Values match on every machine (network test) |
| P5.2 | GDD 03's two formulas in one C++ calculation: `StaminaRegen` (hunger below 30: -40 %; outside the comfortable temperature: -TempPenalty) and `AimSway` (the hydration term only below 30, GDD 03's build note: **proposal**; neural stability) | V-01 to V-03 at 0, 29, 30, 31 and 100 |
| P5.3 | Stamina in play: sprinting uses it, with none left no sprint (the server decides, the player's machine follows); aim sway widens the weapon's spread | The network test's movement passes with no new corrections |
| P5.4 | Temperature: the air's temperature (the world's default; hot and cold areas on the test range), the comfortable range of what is worn (armour columns in `Items.csv`), outside it damage over time and slower movement | V-04 |
| P5.5 | Food and water: items that restore hunger and hydration (a ration, a water bottle), used from the hotbar like the bandage | Used on every machine |
| P5.6 | Crafting (C++, the server checks): recipes in `Data/Recipes.csv` (the bandage from organic fibre; pistol and SMG rounds from mineral and alloy: **proposals**), a request to the server, a short queue (seconds a craft), inputs taken and outputs added; resources to pick up on the test range | V-05 |
| P5.7 | UI in MSS's look: the vitals cluster bottom left (health, stamina, hunger, hydration, temperature, with deliverable 8's icons), a crafting panel in the inventory screen (recipes, what is missing, craft, the queue), a death screen (what was dropped, respawn) | Pictures; the same on both clients (V-06) |
| P5.8 | Death: the inventory drops as a bag where the player fell; the new body gets the starting kit | The network test |
| P5.9 | Checks: vitals and crafting tests, an addition to the inventory network test, the whole ladder | `verify.py` passes |
| P5.10 | Owner play-test | The owner's yes |

Numbers to start from (**proposals**, in the data): hunger from full to empty in 60 minutes, hydration in 40; at 0,
health falls 0.5 a second; stamina 100, sprinting 12 a second, back at 20 a second after 1 s of rest; comfortable
10 to 30 °C without armour, wider with it; outside it 1 health a second and 15 % slower. Radiation and neural stability's
effects (hallucinations) come later.

## P5 Vitals and crafting: results (2026-10-16)

Built straight after P4 while the owner was away ("Then continue with next step afterwards"); checkpoint committed
under the owner's standing yes for verified checkpoints. Report, rollback points and pictures:
[while-away.md](while-away.md).

- **Done:** P5.1 to P5.9.
  - **Vitals (C++, the server owns them):** stamina, hunger, hydration, felt temperature and neural stability as
    attributes next to health (only the owning player receives them); `UTharrnVitalsComponent` runs them on the server
    four times a second: hunger and hydration drain (60 and 40 minutes from full), at 0 each costs 0.5 health a
    second; the felt temperature follows the air at 2 °C a second; outside the comfortable range (10 to 30 °C, wider
    with what is worn: cloth 5 °C colder, composite 5 colder and 5 hotter, alloy 3 and 3) 1 health a second and 15 %
    slower. Numbers: `Data/Vitals.csv` (`DT_Vitals`), all **proposals**.
  - **GDD 03's formulas** in one C++ library (`UTharrnVitalsLibrary`): `StaminaRegen` (hunger below 30: 40 % slower;
    too cold or hot: 30 % slower) and `AimSway` (thirst below 30 and low neural stability widen the weapon's spread;
    the hydration term counts only below 30: **proposal**, so a well-watered player sways as the weapon does, not
    less).
  - **Stamina in play:** sprinting uses 12 a second; it comes back at 20 a second after 1 s of rest; out of it, no
    sprint until sprint is let go with 20 back, or stamina is full. Kept in the movement, move by move, like the gait,
    and sent with the server's corrections, so sprinting causes no corrections (checked under 100 ms and 1 % loss).
  - **Temperature:** `ATharrnClimateVolume`, an area with its own air (outlined and labelled when shown in the game);
    the test range has a cold area (6 °C) and a hot one (33 °C) behind the starts: the right armour makes each bearable.
  - **Food and water:** a ration (+40 hunger) and a water bottle (+50 hydration), used from the hotbar or the inventory
    like the bandage; not used up when full.
  - **Crafting (C++, the server checks):** `UTharrnCraftingComponent`: recipes in `Data/Recipes.csv` (a bandage from 2
    organic fibre; pistol, SMG and 40 mm rounds from mineral and alloy: **proposals**), a queue of 5, the inputs taken
    when queued, the item after the recipe's seconds (what does not fit drops at the feet), cancelling gives the inputs
    back. Organic fibre, mineral and alloy scrap, rations and water lie on the test range's item table.
  - **UI in MSS's look:** the vitals cluster bottom left (health, stamina, hunger, hydration, the felt temperature with
    deliverable 8's icons; red when one hurts, blue or orange when cold or hot); the crafting panel in the inventory
    screen (each recipe with what it takes and what is missing, Craft, the queue with progress and cancel); the death
    screen (what took the player down, what lies in the bag, the seconds left).
  - **Going down:** crafts are cancelled (inputs back), everything carried, worn items too, drops in a bag where the
    player fell (anyone can take from it); the new body comes with the starting kit and full vitals.
- **Checks:** verify.py 5 of 5 (both targets build with no warnings, Shipping too; plugin check; data import; 91 automation tests, 7 of them new; the network test as listen and dedicated server with 0 corrections); survival_test.py passes as listen and dedicated server (the same vitals on the player's machine and the server; slower recovery and more sway below 30; a ration and water used, water at full kept; cold air hurts and slows, cloth armour comfortable; a bandage crafted, a craft cancelled with its inputs back, two made-up crafts refused; out of stamina after 8.3 s, then running with sprint held, 0 corrections; going down drops a bag, the screen is told, the new body has the kit, the bag can be picked up); inventory_test.py and mss_test.py pass; pictures of the vitals, a resource, the crafting panel and the death screen.
- **Found and fixed on the way:** with "sprint again above 5" a held sprint key sprinted again every 1.25 s (now: let go
  first, or full); saving project settings wrote every default of the section into `Config/DefaultEngine.ini` (the
  script now saves only a change); the pick-up prompt showed behind the inventory screen and on the death screen
  (engineering guide, gotchas 85 to 89).
- **Not built / later:** radiation and neural stability's own effects (hallucinations; it is in the aim formula, kept
  at 100); resource nodes to gather (resources lie as items for now); benches and building (P5's building half comes
  with base building); a proper bag model (a box now) and bags that vanish after a while; the weather and biomes
  setting the air (climate volumes stand in); a death animation (the body stands until it is replaced).

**Play-test (P5, about 10 minutes).**
1. Open the test range, press Play. Bottom left: health, then stamina, hunger, hydration and the temperature.
2. Hold Shift and run: the stamina bar empties in about 8 seconds and turns red; you run, not sprint, until you let go
   of Shift and press it again (or it fills).
3. Walk behind the starts: the blue box is cold (6 °C). Stand in it: the temperature falls, turns blue "cold", you
   lose a little health and move slower. Pick up the cloth armour from the item table, Tab, double click it to wear it:
   comfortable again. The orange box is hot (33 °C): composite or alloy armour helps there.
4. From the item table pick up organic fibre, mineral, alloy scrap, a ration and water. Press Tab: the crafting panel
   on the right. Craft a bandage (3 s, the bar fills), queue pistol rounds and cancel them: the inputs come back.
5. Eat and drink from the hotbar once hungry or thirsty (in a long play, or ask Claude for a quicker test setting).
6. With 2 players (Listen Server): the same vitals on each player's own screen; one player's bag can be emptied by the
   other.
7. Tell Claude how the numbers feel (they are proposals): how fast stamina, hunger and thirst go, the cold and heat,
   the recipes.

## P6 Coastal slice: plan (2026-10-17)

Started after P5 while the owner is away. The owner pointed at KK Design's videos for how the bundle's biomes look and
are assembled, and set the main map at about 100 km² (D-26): the slice is the first region of that map, built the way
the bundle's example level is ([how](scifi-bundle.md#how-the-biomes-look-and-are-assembled-2026-10-17)). Proposals are checked with the owner when home; the module's
sign-off is the owner approving the images. What exists: the bundle staged (biome presets, water, shore formations,
the example level), `Tools/Terrain` (the earlier project's lidar pipeline, editor Python, not re-run), the sky and
capture subsystem, the D-11 budget measurement.

| # | Step | Done when |
|---|---|---|
| P6.1 | Ocean test (OQ-05): the Water plugin's ocean against the bundle's own water stretched as a sea, on a test level: looks, cost in milliseconds, the shoreline, swimming and wading | Pictures of both and a recommendation |
| P6.2 | The bundle's biome volumes online: rocks generated once and saved, plants and debris generated at run time; collision must be the same on the server and every player's machine, or movement is corrected | The network test walks through generated jungle and over rocks with 0 corrections, as listen and dedicated server |
| P6.3 | The main map: one World Partition level, its origin at the world's centre so the zones line up; its landscape at the bundle's settings, made first around the start (the Coastal Outpost and Shoreline Flats corner) and extended as biomes come (OQ-15) | The map opens, streams and plays |
| P6.4 | Terrain (OQ-06): real coastal survey data through `Tools/Terrain` (moved to C++ tools, D-07), or generated terrain; a few candidate coasts shown as pictures | The owner picks one (pictures) |
| P6.5 | Ground and nature: the combined landscape material's shore, swamp and jungle layers painted from the terrain's masks; biome volumes with the Jungle Shore, Jungle Swamp and Jungle presets; shore formations; streams as splines | Pictures |
| P6.6 | The crash site and the first outpost: wreckage from colony modules and containers; an outpost built in a clearing with the building system, excluders keeping plants out (as in the speed level videos) | Pictures |
| P6.7 | Sky and time of day (OQ-11): the bundle's environment controller driven by the server's clock so every player sees the same hour; a day length to propose | The same hour on every machine |
| P6.8 | The in-game map (from P4): the zones and the player's position, in MSS's look | Pictures |
| P6.9 | Budget table (D-11): frame time, memory and streaming in the slice | Within budget, or what to cut |
| P6.10 | Checks: tests, the network test on the slice, the whole ladder, Shipping | `verify.py` passes |
| P6.11 | Owner's review | The owner approves the images |

## P6 Coastal slice: first budget numbers (2026-10-17)

The test coast (`L_CoastTest`: 1 km, the bundle's jungle, Unreal's ocean, the bundle's sky, HLODs built) in the game
at 2560 x 1440, the default tier (DLSS Quality's 66.7 %), on the development PC (RTX 4060 Ti) **with the editor open**
(`Tools/Checks/measure_budget.ps1`, the player standing on the beach looking inland). The open editor shares the GPU
and DLSS did not start (TSR ran instead), so these numbers are high; a clean run with the editor closed comes at the
next restart. Budget: D-11 (16.6 ms on an RTX 3060, which is slower than this PC).

| Part | Median ms | Budget ms | What it is |
|---|---|---|---|
| Nanite (visibility and base pass) | 9.2 | 4.5 | The jungle's trees, rocks and undergrowth made in the editor; HLODs saved 1.7 ms |
| Shadows (VSM) | 3.9 | 3.0 | |
| Upscaling and post | 3.0 | 2.0 | TSR 2.6 ms (DLSS: 1.6 ms in the earlier baseline) |
| Volumetric clouds | 2.5 | (in "other") | Off: 1.7 ms less |
| Landscape grass | about 1 | (in Nanite) | Off: 1 ms less |
| Run-time bushes and boulders | about 0 | | Off: no change |
| GPU total | 24.8 | 16.6 | |
| Game thread | 5.4 | 6.0 | ok |

What to cut first (proposals, after the clean run): the jungle's density and draw distances in Tharrn's own copies of
the bundle's foliage presets (the biggest part), the clouds' quality, landscape grass distance; check that DLSS runs.
`measure_budget.ps1 -ExtraCmds '<console command>'` measures what a feature costs.

## Asked of the owner

- How the zones fill the 100 km² main map (OQ-15; proposal: scale the zone map by 0.5).
- Which coast the game starts on (OQ-06; four candidates in [pictures](pictures/p6/coasts/all_coasts.jpg)).
- Play-test P2, P3, P4 and P5 (steps above); say how P5's numbers feel (stamina, hunger, thirst, cold and heat, the
  recipes: all proposals).
- When home: check the P4 plan's proposals (G and Z on the hotbar and in the inventory too, the first screens, the
  numbers) and read [while-away.md](while-away.md).
- Review GDD 0.1 and the open questions, especially scope (OQ-07) and the tutorial creature (OQ-12); the
  proposals in deliverables 3, 5, 6, 7 and 9.
- Fab packs or models for creatures (OQ-04); weapons and armour are made for Tharrn (D-22).
- Later: GitHub access to Unreal Engine source through the Epic account, for dedicated servers (OQ-02).
