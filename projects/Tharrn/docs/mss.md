# Tharrn — Multiplayer Shooter System (MSS) reference

The owner is bringing in **Multiplayer Shooter System 2.0** by DMD ("im getting you the full framework for multiplayer
shooting and weapons, animations, works with gasp cmc and mover", 2026-10-16). Its documentation is the source:

- Documentation: [EN MSS DOCUMENTATION](https://petite-soldier-9c9.notion.site/EN-MSS-DOCUMENTATION-2db6fbab856780f1ab0ac2275bd1a2e7)
  (pages: Project Requirements, Multiplayer Replication, BPC Begin Play, Event Tick, Events, Inputs, Variables,
  Holster System, Weapon System, Weapon Variables).
- Integration: [EN MSS INTEGRATION](https://petite-soldier-9c9.notion.site/EN-MSS-INTEGRATION-2e96fbab856780d2bcf7fbe1bd32cc93),
  with a guide and video for GASP on Character Movement (the one Tharrn needs, D-18) and one for GASP on Mover.
- Fab listing: [Multiplayer Shooter System](https://www.fab.com/listings/78f92738-955a-47c0-9c91-95f1ad6ddcf9):
  "Supported on Unreal Engine 5.1+"; the base version, without the weapon packs or the turret (sold as a full pack).

This file notes what matters for Tharrn, read on 2026-10-16.

## State

- Downloaded on 2026-10-16 to the launcher cache (`Multiplace3358e60466V3`, 1.7 GB, 1,393 files, saved with UE 5.1;
  project `DMD_MSS`). Staged into Tharrn the same day as `Content/DMD` (row `MSS` in `Tools/Packs/packs.csv`, outside
  Git, D-08). In use since 2026-10-16 (D-23; how, below).
- It is more than the base version: the light weapons pistol, rifle, shotgun and grenade launcher, each as bullet,
  energy and laser variants (`MK1`), heavy weapons and a turret, the characters' and weapons' animations (on the UE5
  mannequin, `DMD/Animations/Characters/Manny_UE5`), example maps per weapon. There is no `ABP_Overlay_Shooter_UEFN`
  and no GASP character in it: the guide makes those during the integration (retargeting to the GASP skeleton).
- Read from its files: shots go to the server (`CES_Fire_Projectile`, `CES_Fire_Continuous`), the server spawns the
  projectile or traces the laser and calls the engine's `ApplyDamage`. Nothing in the shooter component, the weapon or
  the projectiles keeps a history, reads latency or the server's clock, so hits are decided against where bodies are
  on the server when the shot arrives: no lag compensation.
- Its collision channels are `ECC_GameTraceChannel1` = Projectile and `ECC_GameTraceChannel2` = Laser. In Tharrn those
  two slots are the sample's Traversable and Mouse (and 3 is Obstacle), so Projectile and Laser get new slots and
  every MSS Blueprint that names a channel has to be set again by hand (the guide's step 6 lists them).

## How Tharrn uses it (D-23)

MSS gives the look and the handling; Tharrn's C++ decides every shot. In the game repo:

| Step | What | Where |
|---|---|---|
| Project | Common UI on, MSS's input data (`DefaultGame.ini`), Common UI's viewport client, channels Projectile (slot 4) and Laser (slot 5) | `Tharrn.uproject`, `Config/` |
| Animation | MSS's sockets on the UEFN skeleton; `RTG_UE5_to_UEFN`; MSS's 40 shooter animations and `ABP_Overlay_Shooter` retargeted (`_UEFN`); `DA_MSS_Animation_UEFN`; the overlay linked into the sample's own `SandboxCharacter_CMC_ABP` after Offset Root Bone (in place: the sample's chooser tables accept only that class); MSS's HUD tick only for the player in control | `Tools/Weapons/setup_mss.py`, output `/Game/MSS_Tharrn` (outside Git, remade by the script); it changes three pack files (the UEFN skeleton, the sample's animation Blueprint, MSS's shooter component), so run it again after staging |
| Weapons | `BP_TharrnWeapon_SMG` (MSS rifle MK1), `_Pistol` (pistol MK1), `_Heavy` (grenade launcher MK1): a `TharrnWeaponLook` component names the row in `Data/Weapons.csv` (SMG_A1, PS01, MR01); MSS's trigger, release and reload go to the C++ weapon component; the component's events play MSS's flash, sound, weapon animation, arm recoil, reloads and HUD ammunition | `Tools/Weapons/build_mss_weapons.py`, `/Game/Tharrn/Weapons/MSS` |
| Player | `BP_TharrnPlayer`: the animation Blueprint above, tag `Root_Mesh`, `BPC_Shooter_System` with the UEFN poses and the three weapons holstered (Primary pistol on the right thigh, Secondary SMG and Heavy on the back), three `BP_Holster_Socket` holsters, `BPI_Locomotion` (crouch, walk, run, sprint from Tharrn's gait), the C++ weapon component following the weapon in the hand | `Tools/Weapons/build_mss_player.py` |
| Shots | `UTharrnWeaponComponent` (prediction, server check with rewind, zones and armour, damage through the ability system, data) | `Source/Tharrn/Combat` |
| Respawns | When the game mode destroys a downed player, the C++ weapon component removes MSS's HUD widget and the server destroys the player's MSS weapons (MSS expects the body to stay) | `UTharrnWeaponComponent::EndPlay` |
| Checks | `mss_test.py`: a client equips, fires the pistol (one shot a press), reloads, swaps to the SMG and holds the trigger; every machine sees the same weapon, the server takes the shots | `Tools/Checks/mss_test.py` |

Keys (MSS's `IMC_Shooter`): X draw or holster, F next weapon, left mouse fire, right mouse aim, R reload, V hip or
aimed fire, G grenade mode, Z (hold) drop; gamepad equivalents. Tharrn's own combat key mapping is no longer added.

Not done yet:
- Picking weapons up from the ground (`BPI_Interaction`, hold to interact, `PhysicsBody` on the capsule; guide step 7).
- The hip-fire turn (guide step 5): the character keeps the sample's facing while firing from the hip.
- The grenade throw (G) is still MSS's own: its explosion deals engine damage, which Tharrn's health does not take.
- Key clashes with the sample: the middle mouse button (MSS shoulder swap and the sample's strafe toggle) and the
  gamepad's top face button (MSS swap and the sample's interact).
- MSS's weapon models are placeholders (D-22); none of the three packs has a first-person view (the Sci-Fi bundle's
  example player has a first/third-person camera switch, single-player only).

## What it is

Blueprints only, built around one actor component, `BPC_Shooter_System` (in `Content/DMD/Blueprints/Components/
Shooter_System/`), added to the character; no special character class. It covers:

- input (`IMC_Shooter`: fire, aim, reload, swap, equip, drop, throw mode, shoulder swap, aiming type);
- weapons as Blueprint classes: `BP_Weapon_Master`, light weapons `BP_LW_Master` (picked up, dropped with physics,
  carried in holsters), heavy weapons `BP_HW_Master` (fixed on vehicles and turrets); fire modes automatic,
  semi-automatic, burst, continuous; reload with physical magazines; recoil and spread; grenades with a predicted arc;
- projectiles `BP_Projectile_Master` (collision channel `Projectile`) and instant hits `BP_Laser_Master` (trace
  channel `Laser`);
- holsters on the body (`BP_Holster_Socket` child actors, physics constraints);
- upper-body animation as a linked layer, `ABP_Overlay_Shooter` (`ABP_Overlay_Shooter_UEFN` for GASP), fed by a data
  asset of poses per weapon type (`BP_DA_MSS`) and the interface `BPI_Locomotion`; left-hand IK from each weapon's
  `IK_Hand_Left`; the right hand turned so the barrel points at what the camera looks at; the weapon raised near walls;
- camera zoom and lag while aiming, shoulder swap;
- HUD `WBP_Shooter_Hud` with a crosshair that opens with spread (`WBP_Crosshair_Master`), hit markers (`CE_Impact`);
- simple AI inputs (`CE_AI_Aim`, `CE_AI_Fire`, `CE_AI_Drop`);
- ally or enemy through `BPI_Target` (friendly fire).

Networking: "Server Authority architecture": input calls a local event (CE), which asks the server (CES); visuals go
to everyone (CEC multicast) and the HUD to the owning player (CEOC). The server checks ammunition and hits and
spawns the projectiles. The pages do not mention lag compensation (rewinding bodies to when the player fired).
Health is a separate product, the Multiplayer Health System (MHS, `BPC_Health_System`).

## What it needs (Project Requirements; GASP CMC guide)

| Step | Tharrn |
|---|---|
| Plugins: Enhanced Input, Common UI, Motion Warping | Enhanced Input and Motion Warping on; Common UI to enable, with MSS's input data in Common UI's settings |
| Collision: `Projectile` object channel and `Laser` trace channel, both Block by default | To add (`Config/DefaultEngine.ini`) |
| Migrate the whole `DMD` folder from a project of the same engine version | Staged as a pack, outside Git (D-08) |
| Skeleton sockets: `Weapon_TPS` (right hand), `Pistol_Magazine`, `Rifle_Magazine`, `Shotgun_Magazine`, `GL_Magazine`, `Throw_Object` (left hand); copied from MSS's `SK_Mannequin` to the GASP skeleton | To add to the player's skeleton |
| `BPC_Shooter_System` on `SandboxCharacter_CMC`, holster child actors copied from MSS's character, weapons in `Initial_Weapons` | Tharrn's player is `BP_TharrnPlayer` (D-18, on the sample's CMC character) |
| Tag `Root_Mesh` on the character's mesh | To add |
| Animations retargeted to the GASP skeleton; a `BP_DA_MSS` data asset of poses (crouch, walk, run, sprint) set in `DA_Animations` | To make |
| `ABP_Overlay_Shooter_UEFN` as a linked graph in the GASP CMC animation Blueprint, blended with locomotion | The upper-body layer the sample lacks (OQ-04) |
| `BPI_Locomotion` on the character, its functions fed from GASP's movement state; a hip-fire branch in the orientation function | To add |
| `BP_Projectile_Master` and `BP_Laser_Master` on the new channels; throw traces in the component | To set |
| `BPI_Interaction` on the character, its hold-to-interact input; `PhysicsBody` on the capsule's collision for pickups | To add |

## Against Tharrn's rules and P3

| Rule or P3 piece | MSS | Note |
|---|---|---|
| Server decides (D-04) | Yes: server events for ammunition, hits and projectiles | To confirm in its Blueprints |
| Hits checked with the bodies rewound to when the player fired (OQ-09; C-04: under 2 % of shots disagree at 100 ms) | Not mentioned | P3's `UTharrnWeaponComponent` and `UTharrnCombatSubsystem` do this |
| Weapons from data, `Data/Weapons.csv` (D-07, C-07) | Weapon stats are Blueprint class defaults ("avoiding Data Tables for logic") | Either fill them from `DT_Weapons` or keep them in the classes |
| Damage through the Gameplay Ability System (P3.3), zones and armour (GDD 02) | Damage per projectile with a weak-point multiplier; health in MHS | P3's `UTharrnCombatLibrary` and attribute set do zones and armour |
| C++ for complex systems, Blueprints for simple ones (D-07) | All Blueprints | Its networking and animation logic would stay in Blueprints |
| GASP motion matching (D-18) | Integration guide for the GASP CMC character | The animation layer is what P3 is missing |
