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
| Fab listing (license source) | <https://www.fab.com/listings/0c19880e-21bd-42ba-8287-1caccc3951b1> (supplied by the owner 2026-10-11) |
| Niagara documentation | <https://dev.epicgames.com/documentation/unreal-engine/creating-visual-effects-in-niagara-for-unreal-engine?lang=en-US> (supplied by the owner 2026-10-12): Epic's Niagara VFX and fluids guides and tutorials. Study it for the hero cast (next action 6); Codex can work through the tutorials in parallel. Niagara Fluids may drive visuals only; GDD 4.6 forbids a fluid solver as a rule driver |
| Epic documentation | <https://dev.epicgames.com/documentation/unreal-engine/valley-of-the-ancient-sample-game-for-unreal-engine?application_version=5.0>. Written for UE 5.0 Early Access; the local copy is 5.4.4, so names and paths may differ *(unverified)* |

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

### What Epic's documentation confirms

From the official walkthrough (link in section 1, read 2026-10-11). It describes
UE 5.0 Early Access, so treat details as likely but check them in the 5.4.4 copy.

| Topic | Documented fact | Relevance to Wildwright |
|---|---|---|
| Abilities | `GA_Vault` is a GameplayAbility. Light Dart is added to Echo by a Game Feature through Game Feature Data; Echo's base actor already supports gaining and using abilities | Confirms the GAS pattern behind D-08. Hero casts could be granted the same way, but Game Features are not required for M1 |
| Motion Warping | `VaultOver_Montage` uses MotionWarping notify states with three sync points (FrontEdge, BackEdge, BackFloor), computed in one custom Blueprint node from the vaultable actor and set through `VaultingTriggerVolume` on `BP_EchoCharacter` | Model for cast anticipation that must line up with a target (GDD 5.3) |
| Full-Body IK | A node in each character's Control Rig *Forwards Solve* graph, after animation. Echo's feet adapt to slopes and her hips to uneven ground. Rigs: `AncientContent/Characters/Echo/Rig`, `AncientBattle/Characters/AncientOne/Rig` | Grounded movement in the valley |
| Niagara | Three painted volumetric systems (`BP_NiagaraPainted_FarFog`, `BP_NiagaraPainted_FogDetail`, `BP_NiagaraPainted_SandStripe`) drive 100,000+ GPU particles from painted density and velocity maps | Ambient atmosphere, not cast cues; mind the GPU budget (GDD 15.1) |
| Audio | MetaSound `sfx_Golem_RobotBlast_Meta` drives the beam charge-up. Quartz, through the Underscore subsystem, syncs events such as laser fire to the music | Charge/release audio layering for a hero cast |
| World | One File Per Actor, World Partition, Data Layers, Packed Level Instances | Not needed for one small valley (GDD 14.1) |

The docs do **not** cover gameplay cues, camera modes or the levitate skill. The
rows about those in the table above still come from package references only.

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

## 6. Licensing *(resolved: D-10, D-11)*

**Migration (D-11, owner, 2026-10-12):** selected Valley assets may be migrated
into Wildwright, modified and shipped inside the game. They must never be
redistributed on their own or in an extractable form. Keep the game repo private,
ship only cooked, packaged builds, and consider pak encryption at M6. Patterns and
architecture described in this note are not assets.

**What the Fab listing says** (owner's screenshot of the listing, 2026-10-11;
agents get HTTP 403 from Fab):

| Field | Value |
|---|---|
| Seller | Epic Games |
| Price | Free |
| License terms | **Standard License** |
| Included formats | Unreal Engine |
| **Allows usage with AI** | **No** |
| Generated with AI | No |
| Promotional content | Yes |
| Published / last update | 2021-04-20 / 2025-11-12 |

**What "Allows usage with AI: No" means.** Epic's Fab documentation
(*Licenses and pricing in Fab*) says: "The NoAI meta tag indicates that an asset
must not be used for generative AI data collection." The binding text is the
Fab EULA (<https://www.fab.com/eula>), which has not been read by an agent.

**Wildwright's rule (D-10, owner, 2026-10-12):** "Never use any Fab asset marked
as NoAI to generate, train, fine-tune, or create new content, and only allow AI
operations that read, classify, tag, or organize the original files without
producing new derivative output." For this sample that means:

- **Allowed:** agents reading and inspecting Valley files and graphs, and writing
  notes like this one about how they are built.
- **Not allowed:** feeding Valley meshes, textures, animations, audio or Niagara
  systems, or renders, screenshots and videos of them, into generation tools
  (fal, Higgsfield, image, video, 3D or texture generation, `img2threejs`,
  `image-reference-workflow`).

**Standard License terms** *(owner-supplied summary quoting Fab EULA section
4(c), 2026-10-12; no agent has read the EULA text)*: you may "Use the assets
commercially or privately", "Modify and adjust the assets in order to incorporate
them into your Projects", "Use the assets with any compatible tools", and
"Distribute a Project that incorporates Content to end users, including software
applications such as video games". You may share assets privately with
collaborators on the same project. You may not resell the asset, give the raw
asset away, include it in a tool or template where others can extract it, let
players extract it, or use NoAI content in training data, as input to generative
models or to develop generative AI. Price tiers (Personal under $100,000 revenue
in 12 months, Professional above) apply to paid listings; this one is free.

**Megascans.** Epic's documentation page has no license terms. It only says the
environment assets "are available in the Canyons of Utah Megascans pack". The
Fab listing covers the sample as one package under the Standard License.

## 7. How to learn more from the project

Start with Epic's walkthrough (section 1), then ask the editor, not the file system:

- Open `GA_LightDart` and read the event graph top to bottom.
- Open `GC_AncientBattle_LightDart_Levitating` and `NS_GroundFX`.
- Open `BP_LightDartADSCameraMode` and the camera mode stack C++.
- Use *Reference Viewer* on `GA_LightDart` to see its whole dependency tree.

Record anything learned back into this note and mark *(unverified)* items as
confirmed.
