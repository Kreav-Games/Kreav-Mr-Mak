# Feel reference: Valley of the Ancient

**Purpose.** Epic's *Valley of the Ancient* sample (project name `AncientGame`) is
the benchmark for the spectacle, Niagara work, fluid animation and cast/levitate
feel that Wildwright wants. This note records how that feel is built and what is
worth taking, so an agent does not have to rediscover it.

**Status of this note.** Findings were taken from package headers, file names and
C++ headers on disk (2026-10-11). Asset graphs were **not** opened in the editor,
so runtime behavior is inferred, not observed. Items marked *(unverified)* need an
editor check.

> **Rule:** treat the Valley project as a read-only reference lab. Do not build
> Wildwright inside it. Migrate selected pieces into a clean project.

## 1. Where it lives and how to open it

| Item | Value |
|---|---|
| Project | `%USERPROFILE%\Documents\Unreal Projects\ValleyoftheAncient\AncientGame.uproject` |
| Engine | UE **5.4.4** at `D:\UE_5.4` (`EngineAssociation` is `5.4`) |
| Pristine copy | `C:\ProgramData\Epic\EpicGamesLauncher\VaultCache\AncientGame_5.4\data` (Epic launcher vault, 90 GB) |
| Size | about 70 GB without the derived-data cache; the cache inside the project is another ~20 GB |

**Open it** (double-clicking the `.uproject` will not resolve the engine; see
traps below):

```powershell
& "D:\UE_5.4\Engine\Binaries\Win64\UnrealEditor.exe" "$env:USERPROFILE\Documents\Unreal Projects\ValleyoftheAncient\AncientGame.uproject"
```

Main map: `/Game/AncientContent/Maps/AncientWorld` (World Partition).

## 2. How the cast feels the way it does

The cast is a **tag-driven pipeline**: ability → tag → cue → presentation.

| Piece | Asset (in the `AncientBattle` GameFeature plugin) | What it does *(from package references)* |
|---|---|---|
| Cast | `GA_LightDart` (Gameplay Ability BP) | Plays charge-cancel and release montages (`AbilityTask_PlayMontageAndWait`), waits on gameplay tags, uses a targeting actor, switches to an aim camera mode, spawns a projectile, applies a gameplay effect, triggers a gameplay cue by tag |
| Targeting | `BP_LightDartTargetingActor` | Aim preview |
| Camera | `BP_LightDartADSCameraMode`, `BP_DodgeCameraMode` | Per-ability camera modes in a priority stack |
| Projectile | `BP_LightDartProjectile` | The released bolt |
| State | `GE_Levitate` (Gameplay Effect BP) | **Tag carrier only**: grants owned tags; no visuals of its own |
| Presentation | `GC_AncientBattle_LightDart_Levitating` (Gameplay Cue BP) | Reacts to the tag; spawns `NS_GroundFX` (Niagara) and `FF_LightDartCharge` (force feedback) |
| Dodge | `GA_Dodge` | Montage + **Motion Warping** + dodge camera mode + loose gameplay tags |
| Audio | 18 `sfx_Ability_LightDart_*` assets plus 5 attenuation and source-effect assets, MetaSounds | Layered charge/idle/throw/impact; Audio Modulation `Ability_ControlBus` |

Other abilities present: `GA_ForceWalk`, `GE_ForceWalk`, `GE_LightDartDamage`, and
(in the base content) `GA_SitStand`, `GA_TouchInteract`, `GA_Vault`, `GE_Walk`.

**Scale warning.** The single LightDart ability has **147 assets with
"LightDart" in the name**: about 80 materials, 20 `LightDart_*` animation and
support assets, 18 sound effects, and a handful of Blueprints, Niagara systems and
cues. That is what one production-grade hero cast costs. Wildwright should budget
for **one** (GDD 14.1, risk "Spectacle scope creep") and design the rest as
lower-fidelity variations of the same cast profile.

**Why this matters for Wildwright.** Gameplay Tags are a natural fit for elemental
state ("Wet", "Burning", "Heated"). Cues are a natural fit for the **cast layer**
(GDD 2.2). The same pattern can carry both the feel and the simulation, as long as
authoritative world-cell state lives elsewhere (GDD 12.2).

## 3. What the project contains

### C++ (`Source/AncientGame`, 51 files, about 4,500 lines)

| Folder | Contents |
|---|---|
| `AbilitySystem` | Ability system component, attribute set, ability target actor, ability input binding component |
| `Animation` | `AncientGameAnimInstance` |
| `Camera` | Camera component, camera mode, mode stack, spring-arm mode, interpolators |
| `Character` | Player controller, movement attribute set, box component base |
| `Framework` | Game instance, game mode base, curve and loading utility libraries |
| `GameFeatures` | Actions: add abilities, add input context mapping, add level instances, add spawned actors, add world system |
| `Input` | `PlayerControlsComponent` |

### Plugins in the project

| Plugin | Type | Notes |
|---|---|---|
| `AncientBattle` | GameFeature (content only) | 2,478 files: Characters 674, Destruction 987, FX 398, Audio 189, Maps 144, Blueprints 40, UI 9, Feedbacks 21 |
| `HoverDrone` | GameFeature | 7 C++ files |
| `InstanceLevelCollision` | Editor tool | Level-instance collision generation |
| `Crossfader`, `Underscore`, `Uproar` (+ Editor modules) | Audio systems | Gameplay mix manager, interactive music, destruction-quantized sonification |
| `ModularGameplayActors` | Runtime | Modular actor base classes |

Engine plugins it relies on: GameplayAbilities, ModularGameplay, GameFeatures,
EnhancedInput, ControlRig, FullBodyIK, MotionWarping, Niagara and NiagaraFluids,
Metasound, AudioModulation, Soundscape, ChaosCaching, FieldSystem, Volumetrics,
VirtualHeightfieldMesh, HairStrands, MovieRenderPipeline.

### Asset census (by name prefix)

About 46 `NS_` Niagara systems, 69 `GC_` gameplay cues, 63 `BP_`, 19 `IA_` input
actions, 716 `frac_` fracture assets (destruction), 444 `sfx_`. About 1,000
static meshes and 33 GB of Megascans content.

## 4. Reuse map for Wildwright

| Wildwright need | Valley piece | How to reuse |
|---|---|---|
| Charge / release / cancel cast | `GA_LightDart` structure | **Recreate the pattern**; do not copy the asset graph blindly |
| Aim camera and recovery | Camera mode stack (C++) | **Adapt the C++** (small) or rebuild in Blueprint |
| Persistent elemental states as tags | `GE_*` tag effects | Pattern |
| Spectacle and haptics from tags | `GC_*` cues, `NS_*` systems | Pattern; migrate chosen Niagara systems as *starting points* |
| Fluid, grounded movement | AnimInstance, Control Rig, Motion Warping, FullBodyIK | Reference; character rig is project-specific |
| Reactive audio | MetaSounds, Audio Modulation, Crossfader/Underscore | Reference; consider Audio Modulation early |
| Water/air visuals | NiagaraFluids (engine plugin) | Evaluate; GDD forbids a full fluid solver as a rule driver |
| Destruction | `frac_*`, Chaos caching | **Out of first-playable scope** |
| Level, Megascans, golem characters | Project-specific | **Do not migrate** |

## 5. Traps (all hit during setup)

1. **Do not double-click the `.uproject`.** The Windows registry's `5.4` entry
   points to a non-existent path (`C:\Program Files\Epic Games\UE_5.4`); the real
   engine is `D:\UE_5.4`. Launch the editor executable directly.
2. **Content was incomplete once.** `Content\__ExternalActors__` (14,244 files)
   was missing, which made the level load empty (black screen with audio still
   playing). It was restored from the vault. If the level is ever empty again,
   check for that folder first.
3. **UE 5.7 / 5.8 will not build it on this machine** until Visual Studio is
   updated (MSVC 14.43 is banned by those engines). Using 5.4.4 avoids this.
4. **Editing the `.uproject` association to 5.7** produces misleading errors
   ("Target upgrade required", "Missing modules"). Keep it on `5.4`.
5. **Opening and saving in a newer engine is one-way.** Do not open the Valley
   project in 5.7/5.8 unless working on a copy.
6. **Binary assets.** `.uasset` files cannot be hand-edited from text. Agents
   can propose exact steps, C++, editor Python and data tables.

## 6. Licensing *(unverified; must be resolved: OD-10)*

The license terms for Valley of the Ancient and its bundled Megascans content
have **not been checked**. Before migrating any asset into a game that may be
shipped or sold, read the license on its Epic/Fab listing. Patterns and
architecture described in this note are not assets.

## 7. How to learn more from the project

Ask the editor, not the file system:

- Open `GA_LightDart` and read the event graph top to bottom.
- Open `GC_AncientBattle_LightDart_Levitating` and `NS_GroundFX`.
- Open `BP_LightDartADSCameraMode` and the camera mode stack C++.
- Use *Reference Viewer* on `GA_LightDart` to see its whole dependency tree.

Record anything learned back into this note and mark *(unverified)* items as
confirmed.
