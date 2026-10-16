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
| P2 | **Shooter character:** the Game Animation Sample's motion-matched character as the player, third-person aim-down-sights camera (D-15), sprint, crouch, slide, mantle; replicated | Two clients move, slide and mantle smoothly at 100 ms latency | Built and checked 2026-10-16 (below); **owner play-test** |
| P3 | **Weapons:** weapon CSV (deliverable 7), SMG and pistol hitscan, one heavy projectile, recoil curves, spread, damage multipliers and armour, server-validated hits with rewind (OQ-09) | Test-range targets; under 2 % desync between two clients; tests for multipliers and armour | — |
| P4 | **Vitals:** health, stamina, hunger, hydration, temperature as attributes; the two formulas; crafting a bandage and ammo; HUD vitals and weapon panel, built with Easy Game UI Ultimate 3.0 (D-21) | Thresholds tested; the HUD matches on both clients | — |
| P5 | **Coastal slice:** about 1–2 km² of the starter biome under the protocol (D-10): terrain (OQ-06), ocean test (OQ-05), Sci-Fi bundle shore and jungle kits and its PCG biome system, following its guides ([reference](scifi-bundle.md)), sky, budget table | Within the D-11 budget; the owner approves the images | — |
| P6 | **Creatures:** Skitterjaw (desert, D-16), Phase Warden, Grav Raptor (creature CSV, deliverable 5 in part), StateTree behaviour, perception, stagger and weak points | The tutorial fight (creature per OQ-12) works for two clients | — |
| P7 | **MetaHuman base:** the player as a MetaHuman from presets (OQ-03), customisation JSON saved and loaded | A preset choice survives a reload and shows on both clients | — |
| P8 | **Prototype play-through:** crash site → vitals → scavenge and craft → Skitterjaw fight → shelter (foundation, generator, bench) | The owner plays it for 10–15 minutes and calls it fun | — |

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
| P2.3 | Slide as a predicted movement mode in the same component (entry speed, duration, friction; ends in a crouch) | Slides match on server and clients |
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
  crouch), the sample's slide clip played full body. About 1 s and 5 m on flat ground.
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
  sample's blocks (gotcha 40, with P5).

**Owner play-test (about 10 minutes):**
1. Open Tharrn; the editor opens the test range. Press Play.
2. The sign on the left lists the keys. Run (W A S D), hold Shift to sprint, Ctrl to walk, C to crouch.
   Sprint and press C: you slide and end crouched; C again stands up.
3. Run at the three blocks on the left and press Space in front of each: a hurdle (1 m), a mantle (1.5 m) and a
   climb (2.5 m).
4. Hold the right mouse button: the camera comes in over the shoulder to aim. The middle mouse button switches
   between facing the camera (the default) and turning towards where you run.
5. Three dots next to Play: *Number of Players* 2, *Net Mode* "Play As Listen Server"; Play. Do the same in the
   second window and watch the first: the other player should move, slide and climb the same way.
6. Set it back to 1 player and "Play Standalone". Tell Claude what feels wrong or good.

## Asked of the owner

- Play-test P2 (steps above).
- Download Easy Game UI Ultimate in the Epic Games Launcher, so it can be staged for P4 (D-21).
- Review GDD 0.1 and the open questions, especially scope (OQ-07) and the tutorial creature (OQ-12); the
  proposals in deliverables 3, 5, 6, 7 and 9.
- Fab packs for sci-fi armour, hand-held weapons, creatures and weapon animations (OQ-04).
- Later: GitHub access to Unreal Engine source through the Epic account, for dedicated servers (OQ-02).
