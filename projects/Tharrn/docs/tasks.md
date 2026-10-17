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
| P4 | **Inventory, hotbar and UI (D-25):** items from data, an inventory the server owns (grid, weight limit, equipment), a 12-slot hotbar (keys 1 to 9, 0, − and =; the wheel) that draws weapons, readies grenades and uses items, pickups and drops; the HUD, the inventory screen and Easy Game UI's menus in MSS's look | Every slot picks the same item on every machine; items move, stack, drop and are picked up through the server, made-up requests refused; the owner's yes | Started 2026-10-16 while the owner is away ([plan](#p4-inventory-hotbar-and-ui-plan-2026-10-16); report and rollback points: [while-away.md](while-away.md)) |
| P5 | **Vitals and crafting:** health, stamina, hunger, hydration, temperature as attributes; the two formulas; crafting a bandage and ammo (the crafting screen); the vitals on the HUD; the death screen and dropping the inventory | Thresholds tested; the HUD matches on both clients | — |
| P6 | **Coastal slice:** about 1–2 km² of the starter biome: terrain (OQ-06), ocean test (OQ-05), Sci-Fi bundle shore and jungle kits and its PCG biome system, following its guides ([reference](scifi-bundle.md)), sky, budget table | Within the D-11 budget; the owner approves the images | — |
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

## Asked of the owner

- Play-test P2 and P3 (steps above).
- When home: check the P4 plan's proposals (G and Z on the hotbar and in the inventory too, the first screens, the
  numbers) and read [while-away.md](while-away.md).
- Review GDD 0.1 and the open questions, especially scope (OQ-07) and the tutorial creature (OQ-12); the
  proposals in deliverables 3, 5, 6, 7 and 9.
- Fab packs or models for creatures (OQ-04); weapons and armour are made for Tharrn (D-22).
- Later: GitHub access to Unreal Engine source through the Epic account, for dedicated servers (OQ-02).
