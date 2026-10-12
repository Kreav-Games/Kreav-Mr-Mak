# Fire hero cast — owner's step-by-step guide

*For the owner, written by Claude Code on 2026-10-12. The plan behind it is
[08-hero-cast-plan.md](08-hero-cast-plan.md). It follows Epic's Niagara documentation
(template first, User parameters, Effect Types, fixed bounds, pooling) and reuses
Valley of the Ancient's LightDart pieces. Menu labels are from UE 5.8 as far as they
could be checked; where a label may differ slightly it says so.*

## How to use this guide

- Do the parts in order. Each part ends with a **check** so you know it worked.
- Agents do the code and file copying (part 1). You do the hands-on editor work
  (parts 2–6). If a check fails, tell the agent which step and what you see.
- **Never edit `L_TestRange` or `L_Valley_Greybox` to try effects.** They are
  rebuilt by a script. Use the sandbox level made in part 3.
- Save often (**Ctrl+Shift+S** saves everything).

### Names and folders

| What | Folder | Prefix |
|---|---|---|
| Copied Valley and Epic assets | `/Game/Wildwright/Imported/` | keep their names |
| Retargeted animations and montages | `/Game/Wildwright/Cast/Animations/` | `A_` and `AM_FireCast_` |
| Niagara systems | `/Game/Wildwright/Cast/Niagara/` | `NS_FireCast_`, `NS_Fire_` |
| Materials you recolour | `/Game/Wildwright/Cast/Materials/` | `MI_Fire_` |
| Effect Type | `/Game/Wildwright/Cast/Niagara/` | `ET_HeroCast` |
| Cue Blueprints | `/Game/Wildwright/Cast/Cues/` | `GC_` |
| Sandbox level | `/Game/Wildwright/Cast/` | `L_FXSandbox` |

### Fire colours (use everywhere)

| Role | Linear colour (R, G, B) | Notes |
|---|---|---|
| Core (hottest) | 1.0, 0.85, 0.55 × 20 | ×20 = emissive strength (HDR) |
| Flame | 1.0, 0.38, 0.08 × 10 | Main orange |
| Edge | 0.9, 0.16, 0.03 × 5 | Red-orange rim |
| Ember spark | 1.0, 0.45, 0.1 × 30 | Tiny, very bright |
| Smoke | 0.12, 0.11, 0.10, alpha 0.5 | Never emissive |

---

## Part 1 — Get the Valley pieces into Wildwright (agent does this)

Tell the agent **"do part 1 of the owner guide"**. It will copy these assets from
Valley of the Ancient, with everything they depend on, into
`/Game/Wildwright/Imported/Valley/`, add a package redirect so their internal links
still work, and check every one loads in 5.8. Valley itself is not changed.

| Kind | Assets |
|---|---|
| Animations | `LightDart_Charge_1_5s`, `LightDart_Charge_1_5s_Loop`, `LightDart_Release`, `LightDart_Release_Montage`, `LightDart_Charge_Cancel`, `LightDart_Charge_Cancel_Montage`, plus Echo's skeleton and skeletal mesh (needed as the retarget source) |
| Niagara | `NS_LightdartHandCharge`, `NS_LightdartCore2`, `NS_LightDartCoreChargeTrail`, `NS_HotSpotImpact`, `NE_Campfire_Sparks` |
| Textures and materials | `MAP_SmokeSprites`, `M_HeatDistortion`, and every material the systems above use |
| Sounds | `sfx_Ability_LightDart_ImpactShared_FireHit_nl_01`, `sfx_Ability_LightDart_ImpactShared_FireTail_nl_01`, `sfx_amb_poi_campfire_main_lp`, `sfx_amb_poi_campfire_spark_nl_01` |
| Epic flipbooks | `T_Fire_SubUV`, `T_Smoke_SubUV`, `M_Fire_SubUV` (Epic's Starter Content, shipped inside an engine plugin) into `/Game/Wildwright/Imported/Epic/` |

Remember the rule (D-10): these are **NoAI** assets. Use them in the game; never put
them, or screenshots of them, into an AI image or video tool.

**Check:** open the editor, Content Browser → `Wildwright/Imported/Valley`. Double-click
`NS_LightdartHandCharge`: it plays in the preview with no "missing" warnings.

---

## Part 2 — Retarget Echo's cast animations onto the mannequin

Echo has her own skeleton (`Echo_Skeleton`); the Wildwright character uses
`SK_Mannequin`. Retargeting copies the motion from one to the other.

1. Content Browser → `Wildwright/Imported/Valley/.../Echo/Animations`.
2. Hold **Ctrl** and click these four: `LightDart_Charge_1_5s`,
   `LightDart_Charge_1_5s_Loop`, `LightDart_Release`, `LightDart_Charge_Cancel`.
3. Right-click one of them → **Retarget Animations** (in some versions under
   *Animation* or *Retarget*).
4. In the window that opens:
   - **Source Skeletal Mesh:** Echo's skeletal mesh (it should already be filled in).
   - **Target Skeletal Mesh:** `SK_Mannequin` (`/Game/Characters/Mannequins/Meshes/`).
   - **Retargeter:** leave empty so it **auto-generates** one (5.4 and later can do this
     for human skeletons).
5. Look at the preview: the mannequin should copy Echo's pose. Scrub through
   `LightDart_Release`: the right hand should sweep forward and open, as Echo's does.
6. **Export**: folder `/Game/Wildwright/Cast/Animations/`, add the prefix `A_`, click
   **Export Animations**.
7. If arms or wrists look twisted: tell the agent which animation and frame. The fix
   is in the generated retargeter (chain settings for the arms), and the agent can
   walk you through it.

**Check:** in `Cast/Animations` you have four `A_LightDart_...` assets; double-click
`A_LightDart_Release`: the mannequin performs the throw cleanly.

## Part 3 — Montages and the sandbox level

### Montages

8. Right-click `A_LightDart_Charge_1_5s` → **Create → Create AnimMontage**. Name it
   `AM_FireCast_Charge`.
9. Open it. In the **Montage Sections** panel, add a section named `Loop`. Drag
   `A_LightDart_Charge_1_5s_Loop` from the Asset Browser onto the montage track, right
   after the charge clip, and place the `Loop` section marker at its start.
10. In **Montage Sections**, set `Default` → next: `Loop`, and `Loop` → next: `Loop`
    (click `Loop` to make it repeat). The charge now plays once, then loops while you
    hold.
11. Right-click `A_LightDart_Release` → Create AnimMontage → `AM_FireCast_Release`.
12. In `AM_FireCast_Release`, scrub to the frame where the hand fully opens. Right-click
    the **Notifies** track → **Add Notify → New Notify…** → name it `WW_CastRelease`.
    The bolt leaves the hand on this notify.
13. Right-click `A_LightDart_Charge_Cancel` → Create AnimMontage → `AM_FireCast_Cancel`.
14. All three montages use the slot `DefaultGroup.DefaultSlot` (the default). The
    character's animation Blueprint already has that slot, so nothing else is needed.

For this first pass you cast **standing still**: the montage drives the whole body. Upper
body only, so you can walk while casting, comes later (the agent will give steps).

### Sandbox level

15. **File → New Level → Basic**. Save it as `/Game/Wildwright/Cast/L_FXSandbox`.
16. Drag a cube in as a floor if the template has none. This level is yours: nothing
    rebuilds it.

**Check:** opening `AM_FireCast_Charge` and pressing play shows the charge, then the
loop repeating.

## Part 4 — The Effect Type (the budget for every fire effect)

17. Content Browser → `Wildwright/Cast/Niagara` → right-click → **FX → Niagara Effect
    Type**. Name it `ET_HeroCast`.
18. Open it. Under the scalability settings for **each quality level** (Epic, High,
    Medium):
    - **Max Distance:** 6000 (60 m).
    - **Max Instances** (system instances of the same kind alive at once): 6.
    - Medium only: tick the option that reduces spawn counts, and note that lights will
      be removed on Medium in each system (step 22).
19. Save.

**Check:** `ET_HeroCast` exists in `Cast/Niagara`.

## Part 5 — Build the six Niagara systems

### Do this for every system (the common steps)

20. **System properties** (click the system name at the top of the stack):
    - **Effect Type:** `ET_HeroCast`.
    - **Fixed Bounds:** on, with a box that just covers the effect (use the bounds
      preview; the bolt is the exception, see its steps).
    - **Warmup Time:** 0.
21. **User parameters**: in the **Parameters** panel, under **User Exposed**, click
    **+** and add the parameters listed for that system, with the type and default
    given. Use exactly these names: the code looks for them.
22. **Lights**: if the system has a **Light Renderer**, open its scalability settings
    and turn it off for Medium.
23. **Recolour a Valley material**: in a renderer, click the material → **Browse to
    asset**. Right-click it → **Create Material Instance**, name it `MI_Fire_...`,
    move it to `Cast/Materials`, open it, and change every colour parameter to the fire
    colours above. Back in the renderer, pick your `MI_Fire_...` instead.
24. **Recolour a module**: in each emitter, look for modules called **Initialize
    Particle** (its *Color*), **Color**, or **Scale Color**. Set them to the fire
    colours. Particle colours are multiplied by the material, so do both.
25. **Test** in `L_FXSandbox`: drag the system into the level, select it, and in the
    **Details** panel under **User Parameters** change values while watching. For
    one-shot systems, right-click the actor → **Reset** to replay.

### 5.1 `NS_FireCast_Charge` — embers gathering in the hand

Start from Valley's `NS_LightdartHandCharge`.

26. Right-click `NS_LightdartHandCharge` → **Duplicate**, name `NS_FireCast_Charge`,
    move it to `Cast/Niagara`.
27. Open it. In **User Exposed**, right-click `energy` → **Rename** → `Charge`. Leave
    `handPosition` and `probability` as they are (the code sets `handPosition` every
    frame).
28. Common steps 20–24. Bounds: about 60 × 60 × 60.
29. Add sparks: in the system overview, right-click empty space → **Add Emitter** →
    pick `NE_Campfire_Sparks`. In its **Spawn Rate** module, click the dropdown next to
    *SpawnRate* → **Multiply Float**; set A = 40 and link B to `User.Charge` (dropdown →
    **Link Inputs → User → Charge**). The hand throws more sparks as the charge grows.
30. User parameters: `Charge` (float, 0), `handPosition` (vector, 0,0,0).

**Check:** in the sandbox, raise `Charge` from 0 to 1: a fire-coloured swirl grows and
sparks increase.

### 5.2 `NS_FireCast_Bolt` — the fire bolt

Start from Valley's `NS_LightdartCore2`; add a ribbon trail from an engine template.

31. Duplicate `NS_LightdartCore2` → `NS_FireCast_Bolt` in `Cast/Niagara`.
32. Open it. In **User Exposed**, set defaults: `charged` = 1, `moving` = 1,
    `energy` = 1, `dissapate` = 0 (Valley's spelling). These put it in its "flying"
    look.
33. Add user parameters: `Target` (vector) and `TravelTime` (float, 0.6). The bolt
    actor that carries this system moves itself; these are for any part that wants the
    end point.
34. Common steps 20–24. **Bounds:** leave this one **dynamic** (it travels; Epic's
    guide names this exception).
35. Trail: right-click the overview → **Add Emitter** → template **Location Based
    Ribbon**. In its **Ribbon Renderer**, pick a recoloured ribbon material (step 23 on
    the material the Valley system's ribbon uses). Set ribbon width to about 18 with a
    **Scale Ribbon Width** curve from 1 to 0 over the ribbon's length.
36. Light: if the system has no **Light Renderer**, add one to the core emitter (radius
    250, colour Flame, intensity 4). Common step 22.

**Check:** drag it into the sandbox and move it with the gizmo while simulating: a
bright fire core with a trailing ribbon.

### 5.3 `NS_FireCast_Impact` — the ignition flash

Start from Valley's `NS_HotSpotImpact`.

37. Duplicate `NS_HotSpotImpact` → `NS_FireCast_Impact` in `Cast/Niagara`.
38. In **User Exposed**: `headshot` = 0, `headshotScale` = 1, `BurstParticleRing` as is.
39. Turn off emitters that look like crystal or glass for this effect (untick the
    emitter's checkbox in the overview). Keep flares, glow, the burst ring and the
    shockwave.
40. Common steps 20–24. Bounds: about 400 × 400 × 300.
41. Add embers: **Add Emitter** → template **Omnidirectional Burst**. Set:
    - **Spawn Burst Instantaneous → Spawn Count:** 40.
    - **Initialize Particle:** Lifetime random 0.4–0.9; Color Ember; Sprite Size 2–5.
    - **Add Velocity:** speed 300–700.
    - Add **Gravity Force** (−980 Z) and **Drag** (1.5).
    - **Sprite Renderer → Alignment:** Velocity Aligned.
42. User parameter: `Charge` (float, 1). In the burst emitters' spawn counts, multiply
    by `User.Charge` (as in step 29) so a full charge gives a bigger flash.

**Check:** reset it in the sandbox: a quick bright fire flash with flying embers, gone
in about a second.

### 5.4 `NS_FireCast_Fizzle` — refused cast

From the engine template.

43. Content Browser → `Cast/Niagara` → right-click → **FX → Niagara System** → **New
    system from selected emitter(s)** → **Omnidirectional Burst** → name
    `NS_FireCast_Fizzle`.
44. Smoke (the emitter you have):
    - **Spawn Burst Instantaneous:** 16.
    - **Initialize Particle:** Lifetime 0.8–1.4; Color Smoke; Sprite Size 40–90.
    - **Add Velocity:** speed 60–140; add **Acceleration Force** Z = +60 (smoke rises).
    - Add **Drag** 2 and **Curl Noise Force** (strength 30).
    - **Scale Sprite Size:** grow to 2.5× over life. **Scale Color:** alpha fades to 0.
    - **Sprite Renderer → Material:** a smoke material using `MAP_SmokeSprites`
      (step 23; if the texture is a grid of frames, add **SubUV Animation** and set
      *Sub Image Size* to the grid, e.g. 8 × 8; open the texture to count).
45. Dying sparks: **Add Emitter** → **Omnidirectional Burst**: 6 sparks, Lifetime
    0.3–0.6, Color Ember, Size 2–4, speed 200–400, Gravity −980, Velocity Aligned.
46. Common steps 20–22. Bounds: about 250 × 250 × 250.

**Check:** a small grey puff with a few sparks that die out. It must read as "failed".

### 5.5 `NS_Fire_Burning` — the patch on fire

From the engine template with Epic's fire flipbook.

47. New Niagara System → **New system from selected emitter(s)** → **Fountain** → name
    `NS_Fire_Burning`. Rename the emitter `Flames`.
48. Flames:
    - **Spawn Rate:** Multiply Float, A = 50, B linked to `User.Fuel`.
    - Replace the spawn shape: **Shape Location** → Box; *Box Size* linked to
      `User.Extent` (multiply by 2 if it asks for full size).
    - **Initialize Particle:** Lifetime 0.6–1.0; Color Flame; Sprite Size 60–120.
    - **Add Velocity:** straight up, speed 80–160, cone angle about 15°.
    - Remove **Gravity Force**. Add **Curl Noise Force** (strength 40).
    - **Scale Sprite Size:** curve up then down over life. **Scale Color:** alpha fades
      out near the end.
    - **SubUV Animation:** Sub Image Size to match `T_Fire_SubUV` (open the texture and
      count the grid, for example 6 × 6); play once over life.
    - **Sprite Renderer → Material:** `M_Fire_SubUV` from `Imported/Epic` (or an
      `MI_Fire_` instance of it).
49. Sparks: **Add Emitter** → `NE_Campfire_Sparks`.
50. Thin smoke: **Add Emitter** → **Hanging Particulates**; recolour to Smoke, spawn
    about 4 per second, rising slowly.
51. Light: add a **Light Renderer** to `Flames` (radius 300, colour Flame, intensity
    linked to `User.Fuel` × 5). Common step 22.
52. User parameters: `Extent` (vector, 150, 150, 10), `Fuel` (float, 1). Loops forever
    until the code removes it.
53. Optional heat haze: **Add Emitter** → **Single Looping Particle**, one large sprite
    with a recoloured `M_HeatDistortion`.
54. Common steps 20–21. Bounds: about 350 × 350 × 300.

**Check:** drop it on a cube in the sandbox: flames, sparks and a little smoke. Lower
`Fuel` to 0.2: the fire dies down.

### 5.6 `NS_Fire_Smoulder` — after it has burnt

55. New Niagara System → **Hanging Particulates** → name `NS_Fire_Smoulder`.
56. Smoke: spawn rate 6 × `User.Heat`; lifetime 2–3; rising 20–40; size 40–100; Color
    Smoke with alpha × `User.Heat` (Scale Color, link the alpha to `User.Heat`).
57. Embers: **Add Emitter** → **Hanging Particulates**: spawn rate 3 × `User.Heat`,
    size 2–4, Color Ember, small random drift; flicker by fading alpha in and out.
58. User parameter: `Heat` (float, 1).
59. Common steps 20–22. Bounds: about 300 × 300 × 300.

**Check:** with `Heat` 1 there is smoke and glowing embers; at 0 it is gone.

## Part 6 — The cue Blueprints (after the agent's C++ is in)

The agent first adds two C++ cue classes (**WildwrightCueBurst** and
**WildwrightCueLooping**) and the cue tags. Then, for each row below:

60. Content Browser → `Wildwright/Cast/Cues` → right-click → **Blueprint Class** →
    **All Classes** → search for the parent class → name it as below.
61. Open it → **Class Defaults**:
    - **Gameplay Cue Tag:** the tag in the table.
    - **Niagara System:** the system in the table.
    - **Sound** (optional): the Valley sound in the table.
62. **Compile**, **Save**.

| Blueprint | Parent | Gameplay Cue Tag | Niagara System | Sound |
|---|---|---|---|---|
| `GC_Fire_Charge` | WildwrightCueLooping | `GameplayCue.Cast.Fire.Charge` | `NS_FireCast_Charge` | — |
| `GC_Fire_Release` | WildwrightCueBurst | `GameplayCue.Cast.Fire.Release` | `NS_FireCast_Bolt` | `..._FireTail_nl_01` |
| `GC_Fire_Impact` | WildwrightCueBurst | `GameplayCue.Cast.Fire.Impact` | `NS_FireCast_Impact` | `..._FireHit_nl_01` |
| `GC_Fire_Fizzle` | WildwrightCueBurst | `GameplayCue.Cast.Fire.Fizzle` | `NS_FireCast_Fizzle` | — |
| `GC_Target_Burning` | WildwrightCueLooping | `GameplayCue.Target.Burning` | `NS_Fire_Burning` | `sfx_amb_poi_campfire_main_lp` |
| `GC_Target_Smoulder` | WildwrightCueLooping | `GameplayCue.Target.Smoulder` | `NS_Fire_Smoulder` | `sfx_amb_poi_campfire_spark_nl_01` |

**Check:** play `L_TestRange` (after the agent says the ability is in): hold left mouse
at ST01, release, and watch the whole cast.

## Part 7 — Optional: better flames with Niagara Fluids (later)

Niagara Fluids is a **Beta** plugin in 5.8 and costly to run live, so Wildwright only
uses it to **bake** a flipbook texture once. Follow Epic's
[Fluids Quick Start](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-fluids-quick-start-guide-for-unreal-engine)
with a **2D Gas** fire template, then the
[Flipbook Baker Quick Start](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-flipbook-baker-quick-start-guide-in-unreal-engine)
to bake it, and swap the texture in step 48. Enabling the plugin needs an editor
restart; tell the agent first, because plugin changes touch the `.uproject`.

## When you are done

Tell the agent: "Parts 2–6 done". It will run the automated checks (cancel leaves
nothing behind, effects off gives the same result, timing) and give you the play-test
list from the plan.

## Learning links (Epic)

- [Quick Start for Niagara Effects](https://dev.epicgames.com/documentation/en-us/unreal-engine/quick-start-for-niagara-effects-in-unreal-engine): a dust puff on Third Person footsteps; do this first if Niagara is new.
- [Key Concepts](https://dev.epicgames.com/documentation/unreal-engine/key-concepts-in-niagara-effects-for-unreal-engine): systems, emitters, modules, the User namespace.
- [Scalability and Best Practices](https://dev.epicgames.com/documentation/unreal-engine/scalability-and-best-practices-for-niagara?lang=en-US) and [Effect Types](https://dev.epicgames.com/documentation/en-us/unreal-engine/performance-budgeting-using-effect-types-in-niagara-for-unreal-engine).
- [Lightweight Emitters](https://dev.epicgames.com/documentation/unreal-engine/niagara-lightweight-emitters-overview): cheaper emitters for simple sparks and smoke.
