# Hero cast plan — next action 6: Fire

*Claude Code, 2026-10-12. Research from Epic's Niagara and Gameplay Ability System
documentation (sources at the end), the GDD, the feel reference, the action 4–5 code
and a read-only inventory of Valley of the Ancient. Engine API names were checked
against the installed UE 5.8.3 source. Not built yet.*

**Owner decisions, 2026-10-12** (logged as D-13 to D-16):
1. The first hero cast is **Fire**.
2. Controls: **hold left mouse to charge, release to cast, right mouse to cancel**.
3. Animation: **Valley's Echo LightDart animations, retargeted** to the Wildwright
   mannequin.
4. **Use Valley effects, materials and sounds as starting points** where they help
   (allowed by D-11; never fed to generative AI, D-10).

The owner's hands-on part is in [09-hero-cast-owner-guide.md](09-hero-cast-owner-guide.md).

## In one paragraph

Hold left mouse: the hand gathers embers and heat. Release: a fire bolt flies to the
aimed point. If the target can burn, it ignites, burns down over ten seconds and
smoulders while it cools; if not, the bolt fizzles into smoke and the HUD says why. A
Gameplay Ability (D-08) runs charge, release and cancel and **requests** ignition
from the existing rule subsystem; it never changes state. All visuals and sounds come
from Gameplay Cues that spawn Niagara systems and only **read** state. The moment of
impact is set by the ability's own timer, so switching every effect off leaves the
world identical (A.2 #6).

## What the GDD asks for

| Source | Requirement |
|---|---|
| GDD 2.2 spectacle contract | Cast layer is cosmetic; reads state and requests changes through the resolver; results stay readable after the effect; **all VFX off gives identical state**; a tester must be able to say what it did |
| GDD 5.3 hero cast anatomy | Animation (anticipation, charge loop, release, cancel), camera aim mode and recovery, targeting preview, Niagara cue (charge, travel, impact, aftermath), audio, haptics (optional) |
| GDD 3.3 | Charge is a hold with anticipation; **a cancelled charge cleans up the cast layer and changes no state** |
| GDD 14 (M1), 14.2 | One hero cast passing the contract; A.2 #6 and #9; "does the cast feel powerful, and can the player still say what it did?" |
| GDD 15, CR-001 | One hero cast first; shared cast-profile structure; a spectacle budget (Valley's LightDart is about 147 assets: do not match that scale) |
| GDD 12.3 | `CastProfile` per element action: montages, camera mode, targeting preview, cue tags, audio, haptics; data-driven |

## What already exists

- **Element component** (action 4): selection, per-frame aim trace and a target check
  with a reason for every refusal. Left mouse applies instantly today.
- **Rules** (action 5): `ER_FIRE_IGNITE` on combustible patches. Preconditions from
  `Data/Rules.csv`: moisture ≤ 30, fuel > 0, not already burning or burnt. Ignition
  sets temperature 80; a timer burns fuel at 10 per second (100 → 0 in 10 s), then the
  patch is Burnt and cools at 10 per second to ambient 20. Targets drive a state
  material (burning orange, burnt near black).
- **Events**: `OnElementApplied`, `OnSteam`. There is **no state-change event yet**; the
  burning aftermath needs one (below).
- **No GAS code yet**: no ability system component, no abilities.

## Design

### Flow

```
 LMB pressed ─► GA_ElementCast (Fire) activates            tag Cast.Charging
                 ├─ cue GameplayCue.Cast.Fire.Charge  (looping, hand socket, User.Charge 0→1)
                 ├─ montage LightDart_Charge_1_5s → LightDart_Charge_1_5s_Loop (retargeted)
                 ├─ camera eases to aim mode; target marker on
   RMB / Esc ───┼─► Cancel: montage LightDart_Charge_Cancel, cues removed, camera back.
                 │            NO state request.                                 (A.2 #9)
 LMB released ──► held < MinCharge → treated as cancel, HUD "Hold to charge"
                 ├─ re-check the aimed target (element component = state layer)
                 ├─ refused → montage Release, cue GameplayCue.Cast.Fire.Fizzle at the aim
                 │            point after the travel time, HUD shows the reason
                 └─ valid   → montage Release, cue GameplayCue.Cast.Fire.Release
                              T = distance / TravelSpeed (data);  UAbilityTask_WaitDelay(T)
                              RuleSubsystem.ResolveApplication(...)   ◄── the only state change
                              cue GameplayCue.Cast.Fire.Impact at the impact point
 State changes (new OnTargetStateChanged event):
   Unburnt → Burning : add    GameplayCue.Target.Burning   (looping, on the target)
   Burning → Burnt   : remove GameplayCue.Target.Burning;  add GameplayCue.Target.Smoulder
   Burnt and cooled  : remove GameplayCue.Target.Smoulder
```

The bolt is cosmetic and timed to the same `T`. With cues off it is not drawn, and
`WaitDelay` still fires at `T`, so the state is identical (A.2 #6). The burning loop
is driven by state, so a burning patch looks right however it was lit.

### Cue map

| Cue tag | Kind | Niagara system | User parameters it reads |
|---|---|---|---|
| `GameplayCue.Cast.Fire.Charge` | Looping, attached to `hand_r` | `NS_FireCast_Charge` | `User.Charge` (0–1) |
| `GameplayCue.Cast.Fire.Release` | Burst | `NS_FireCast_Bolt` | `User.Target` (vector), `User.TravelTime` |
| `GameplayCue.Cast.Fire.Impact` | Burst | `NS_FireCast_Impact` | `User.Charge` |
| `GameplayCue.Cast.Fire.Fizzle` | Burst | `NS_FireCast_Fizzle` | — |
| `GameplayCue.Target.Burning` | Looping, on the target | `NS_Fire_Burning` | `User.Extent` (target half-size), `User.Fuel` (0–1) |
| `GameplayCue.Target.Smoulder` | Looping, on the target | `NS_Fire_Smoulder` | `User.Heat` (0–1) |

Cue tags start with `GameplayCue.`. Cue notify Blueprints live in
`/Game/Wildwright/Cast/Cues/`; agents add that folder to the cue scan paths
(`GameplayCueNotifyPaths`).

### Starting points from Valley (selected pieces only, D-11)

| Wildwright asset | Start from (Valley) | Change |
|---|---|---|
| `NS_FireCast_Charge` | `NS_LightdartHandCharge` (+ sparks emitter from `NE_Campfire_Sparks`) | Recolour to fire; rename `User.energy` use to `User.Charge` |
| `NS_FireCast_Bolt` | `NS_LightdartCore2` + `NS_LightDartCoreChargeTrail` | Recolour; drive by `User.Target` and `User.TravelTime` |
| `NS_FireCast_Impact` | `NS_HotSpotImpact` | Recolour; drop the headshot parts |
| `NS_FireCast_Fizzle` | engine template **Omnidirectional Burst** + Valley `MAP_SmokeSprites` | Grey smoke puff, few dying sparks |
| `NS_Fire_Burning` | engine template **Fountain (Lightweight)** + Epic's `T_Fire_SubUV` flipbook | Flames over the patch, plus `NE_Campfire_Sparks` |
| `NS_Fire_Smoulder` | engine template **Hanging Particulates** + `MAP_SmokeSprites` | Thin smoke and embers, fade with `User.Heat` |
| Animations | `LightDart_Charge_1_5s`, `_Loop`, `LightDart_Release`, `LightDart_Charge_Cancel` (+ their montages) | Retarget `Echo_Skeleton` → `SK_Mannequin` |
| Sounds | `sfx_Ability_LightDart_ImpactShared_FireHit_nl_01`, `..._FireTail_nl_01`, `sfx_amb_poi_campfire_main_lp`, `sfx_amb_poi_campfire_spark_nl_01` | Charge, impact, burning loop, sparks |
| Heat haze (optional) | `M_HeatDistortion` | One distortion sprite over the burning patch |

Valley's LightDart systems already expose `User.energy`, `User.charged`,
`User.moving`, `User.releasePosition`, `User.direction`, `User.impacted` and
`User.curveLength` (read from the asset files); the guide reuses what fits.

Not used: Valley's campfire `Grid3D_Gas_Fire_System` (a 3D gas grid simulation, too
costly for a gameplay effect) and anything with a golem, robot or level dependency.

### Data: `Data/CastProfiles.csv` → `DT_CastProfiles` (D-12)

| Column | Fire | Note |
|---|---|---|
| `Element` | `(TagName="Element.Fire")` | |
| `MinChargeSeconds` | 0.25 | Shorter holds cancel |
| `FullChargeSeconds` | 1.5 | Matches Echo's `LightDart_Charge_1_5s` |
| `TravelSpeedMps` | 45 | 30 m lands in 0.67 s |
| `HandSocket` | `hand_r` | |
| Cue tag columns | the six tags above | Tags, not assets |
| `ChargeMontage`, `ReleaseMontage`, `CancelMontage` | soft paths to the retargeted montages | Empty allowed for the first pass |
| `AimArmLength`, `AimSocketOffset`, `AimFOV` | 220, (0,55,60), 75 | Camera aim mode |
| `ReducedMotionScale` | 0.3 | GDD 10.1 |

Charge strength is presentation only in M1; rules ignore it (balance stays in
`Rules.csv`). Making charge change outcomes is a rule change (GDD 16.1).

### C++ (agents)

| Piece | Notes |
|---|---|
| `UAbilitySystemComponent` on `AWildwrightCharacter` + `IAbilitySystemInterface` | No attribute set yet (OD-08) |
| `UWildwrightCastAbility` (`UGameplayAbility`, instanced per actor) | `UAbilityTask_PlayMontageAndWait`, `UAbilityTask_WaitInputRelease`, `UAbilityTask_WaitDelay`; `Cast.Charging` blocks reactivation; right mouse cancels |
| Input | Enhanced Input `Started` → `AbilitySpecInputPressed`, `Completed` → `AbilitySpecInputReleased`. Left mouse becomes charge; instant apply moves to a debug key for tests |
| `OnTargetStateChanged(Target, Before, After)` on the rule subsystem | Fired by every state write (apply and timers); drives the target cues |
| Cue base classes in C++ | Thin subclasses of `UGameplayCueNotify_Burst` and `AGameplayCueNotify_Looping` that spawn the Niagara system with `UNiagaraFunctionLibrary::SpawnSystemAtLocation` / `SpawnSystemAttached` and `ENCPoolMethod::AutoRelease`, and set parameters with `UNiagaraComponent::SetVariableFloat`, `SetVariableVec3`, `SetVariableLinearColor`. The owner's `GC_*` Blueprints only pick assets and tune |
| Target cues on actors without an ability system | Use the gameplay cue manager's non-replicated add/remove/execute on the target actor *(exact function to confirm against the 5.8 headers)* |
| Camera aim | Interpolate the existing spring arm and FOV while `Cast.Charging`, scaled by `ReducedMotionScale` |
| Target marker | Reuse the element check; a ground marker at the aim point, plus or X shape |
| Migration script | Copy the selected Valley assets with their dependencies into `/Game/Wildwright/Imported/Valley/` and add a package redirect; verify every asset loads in 5.8 *(scripted with the 5.4 editor read-only on Valley; see the owner guide, part 1)* |

### Budget (`ET_HeroCast`, GDD 15.1)

- One Effect Type for all six systems; Epic/High/Medium; Medium drops lights and halves
  spawn rates.
- At most 2 charge loops, 3 impacts, 6 burning patches alive; beyond 60 m only impact
  and burning play.
- Fixed bounds (the bolt may need dynamic bounds), no warmup, `AutoRelease` pooling,
  lightweight emitters for simple sparks and smoke.
- Worst case for one cast plus one burning patch: about 1,500 particles and two small
  lights. Record real numbers from a packaged Development build.

### Niagara Fluids

Beta in 5.8 and GPU-heavy. Not used live. Optional later: bake a better flame or smoke
flipbook from the Fluids **2D Gas** template with the Flipbook Baker (owner guide,
part 6).

## Acceptance checks

Automated (agents):

1. Game and editor targets build; data imports with 0 problems; existing tests, the
   greybox verifier and `Tools/Checks/check_editor_only_plugins.ps1` pass.
2. `Wildwright.Cast.Cancel`: cancel during charge → state unchanged, no cast cues
   active, montage stopped, camera restored (A.2 #9).
3. `Wildwright.Cast.EffectsOff`: the same casts with `AbilitySystem.DisableGameplayCues 1`
   give identical target states and rule logs (A.2 #6).
4. `Wildwright.Cast.Timing`: impact resolves at `distance / TravelSpeed` within one
   frame, cues on or off.
5. `Wildwright.Cast.TargetCues`: burning and smoulder cues follow state changes from
   both a cast and a placed override.
6. A short hold changes nothing and says why.
7. Every migrated Valley asset loads in 5.8 with no missing references.

Owner play-test in `L_TestRange`:

8. ST01: charge (embers gather, camera eases in), release → bolt → ignition flash;
   the patch burns ~10 s, then smoulders and cools.
9. ST02 after Water: the bolt fizzles into smoke; "Too wet to ignite…".
10. ST04 hot rock: fizzle; "Fire has no effect on ST04 Hot surface".
11. Cancel mid-charge: everything disappears, nothing changed.
12. GDD 14.2: powerful, and you can still say what it did.
13. Packaged Development build, 1080p, 60 fps with a cast and a burning patch.

## Order of work

| Step | Who | Output |
|---|---|---|
| 1 | Agent | Migrate the Valley pieces and Epic's fire flipbook into `/Game/Wildwright/Imported/` and verify they load |
| 2 | Agent | GAS plumbing, state-change event, cast profiles, camera aim, target marker, cue base classes, tests 2–6, with debug-draw placeholder cues so it runs before any Niagara exists |
| 3 | Owner (guide parts 2–3) | Retarget the Echo animations; make the three montages |
| 4 | Owner (guide part 4) | Build the six Niagara systems and `ET_HeroCast` |
| 5 | Owner (guide part 5) | Create the six `GC_*` cue Blueprints and pick the assets |
| 6 | Owner and agent | Sounds, haptics, camera tuning; play-test and look review; commit |

Steps 3–5 can start as soon as step 1 is done; they do not need the C++ from step 2.

## Sources

- [Creating Visual Effects in Niagara](https://dev.epicgames.com/documentation/unreal-engine/creating-visual-effects-in-niagara-for-unreal-engine?lang=en-US) · [Key Concepts](https://dev.epicgames.com/documentation/unreal-engine/key-concepts-in-niagara-effects-for-unreal-engine) · [Overview](https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-niagara-effects-for-unreal-engine) · [Quick Start](https://dev.epicgames.com/documentation/en-us/unreal-engine/quick-start-for-niagara-effects-in-unreal-engine)
- [Scalability and Best Practices](https://dev.epicgames.com/documentation/unreal-engine/scalability-and-best-practices-for-niagara?lang=en-US) · [Effect Types budgeting](https://dev.epicgames.com/documentation/en-us/unreal-engine/performance-budgeting-using-effect-types-in-niagara-for-unreal-engine) · [Lightweight Emitters](https://dev.epicgames.com/documentation/unreal-engine/niagara-lightweight-emitters-overview)
- [Fluid Simulation Overview](https://dev.epicgames.com/documentation/en-us/unreal-engine/fluid-simulation-in-unreal-engine---overview) · [Fluids Quick Start](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-fluids-quick-start-guide-for-unreal-engine) · [Flipbook Baker Quick Start](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-flipbook-baker-quick-start-guide-in-unreal-engine) · [Niagara Data Channels](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-data-channels-overview) · [System Settings (User Parameters)](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-settings-reference-for-niagara-effects-in-unreal-engine)
- [Understanding GAS](https://dev.epicgames.com/documentation/en-us/unreal-engine/understanding-the-unreal-engine-gameplay-ability-system) · [WaitInputRelease](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/GameplayAbilities/UAbilityTask_WaitInputRelease/WaitInputRelease) · [PlayMontageAndWait](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/GameplayAbilities/UAbilityTask_PlayMontageAndWait) · [GameplayCueNotify_Burst](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/GameplayAbilities/UGameplayCueNotify_Burst) · [GameplayCueNotify_Looping](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/GameplayAbilities/AGameplayCueNotify_Looping) · [Abilities in Lyra](https://dev.epicgames.com/documentation/en-us/unreal-engine/abilities-in-lyra-in-unreal-engine)
- Checked in the installed 5.8.3: Niagara component setters, spawn functions and `ENCPoolMethod`; cue notify and ability task classes; `AbilitySystem.DisableGameplayCues`; NiagaraFluids Beta; system templates (DirectionalBurst, RadialBurst, SimpleExplosion, FountainLightweight, …) and emitter templates (Fountain, OmnidirectionalBurst, HangingParticulates, LocationBasedRibbon, …); module names used in the guide; `ABP_Unarmed` has a `DefaultSlot`.
- Valley inventory (read-only): `Echo_Skeleton`, the LightDart animations and montages, the LightDart and campfire Niagara assets, materials, sounds listed above.
