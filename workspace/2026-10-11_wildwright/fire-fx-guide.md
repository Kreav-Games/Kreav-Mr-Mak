# Fire hero cast — manual creation guide

*Claude Code's 2026-10-12 guide, revised by Codex for D-17 (make Wildwright's own
Niagara effects) and on 2026-10-13 for D-18 (no Valley of the Ancient content).
These are manual recipes, not effects already created or visually verified.*

> **Status 2026-10-13: optional learning track, off the critical path.** GDD 0.4
> builds the world systems first; the cast layer and its hero cast come later
> (GDD §14). Effects made now are still useful then. The gameplay tests at the end
> of this guide wait for that milestone.

## Start here

**Do part 5A first.** Make a visible stock emitter, assign our ember material,
then add the Charge slider. Stop at that preview check before building more.
Everything happens inside Unreal; no Python command is needed to view the effect.

Effects use UE 5.8 built-in emitters and original procedural materials
(**D-17**). If a name already exists, name the fresh asset `..._Original_v1`; do
not replace your previous work. Tell the agent the final paths before integration.

Build order: charge → bolt → impact → fizzle → burning → smoulder. Animation and
GAS can follow. VFX never decide ignition, fuel consumption or Water cooling.

### Where to work

| What | Content Browser folder |
|---|---|
| New systems | `Wildwright/Cast/Niagara` |
| New materials | `Wildwright/Cast/Materials` |
| Animations and montages | `Wildwright/Cast/Animations` |
| FX sandbox | `Wildwright/Cast/L_FXSandbox` |
| Cue Blueprints, after C++ exists | `Wildwright/Cast/Cues` |

Create missing folders in Content Browser. Use **Ctrl+S** in the asset you are
editing. Test in `L_FXSandbox`; `L_TestRange` is a generated map and must not be
edited for FX experiments. You can make the sandbox now:
**File → New Level → Basic**, save under `Wildwright/Cast`, add a floor if needed.
Place effects above the floor and enable real-time updates or Simulate.

### Find the controls

- Content Browser → right-click → **FX → Niagara System**. Search the creation
  browser for the named built-in emitter/template and create a system from it.
  The 5.8 wizard may say **Create** or **Create System**. Enable **Show Engine
  Content** and **Show Plugin Content** if engine entries are hidden. Choose
  `/Niagara/` entries.
- Niagara's **System Overview** → right-click empty space → **Add Emitter**.
- Select an emitter, then edit its stack in the **Selection** panel. Groups are
  Emitter Update, Particle Spawn, Particle Update and Render. Add modules with
  the group's **+** button.
- Open **User Parameters** through Niagara's **Window** menu if hidden. Parameter
  definitions are also available under **Parameters → User Exposed**.
- **Compile**, reset, then **Play** the timeline. Wait for shaders; use **F** in
  the preview viewport to frame the effect. Use **Niagara Log** for red errors.

Emitter/module files and User Parameters/Niagara Log tab names were checked in
installed UE 5.8 source/content. Wizard layouts and these recipes have not been
exercised through the owner's UI. Report a missing control by its label.
Epic demonstrates the workflow in its [Niagara Quick Start](https://dev.epicgames.com/documentation/en-us/unreal-engine/quick-start-for-niagara-effects-in-unreal-engine).

## Parts 1–3 — Sandbox level (animation retired)

Earlier versions imported and retargeted Valley of the Ancient's Echo animations.
That is withdrawn (**D-18**): no Valley content is used. The cast animation source
is chosen when the casting milestone starts; effects do not need it.

Make the sandbox now if you have not already:

1. **File → New Level → Basic**, save as `/Game/Wildwright/Cast/L_FXSandbox`.
2. Drag a cube in as a floor if the template has none. This level is yours:
   nothing rebuilds it.

## Part 4 — Effect Type and bounds, after the first visible preview

During the first charge check leave **Effect Type unassigned**, **Fixed Bounds
off**, **Warmup Time 0**. Add budgeting after visibility is proven.

1. Create **FX → Niagara Effect Type**, `ET_HeroCast`, in `Cast/Niagara`.
2. Assign it in each system's **System Properties → Effect Type**.
3. Start with distance limit **6000 cm (60 m)** and **6 instances** per effect
   kind. Medium halves spawn counts and disables any lights. Exact scalability
   array labels may differ; leave lights out of this first pass.
4. Stationary systems: turn on Fixed Bounds and enter explicit **Min/Max** that
   cover all particles. Each recipe has a starting box. Leave bolt bounds dynamic.
5. Pan around each sandbox effect and move away/back. It must remain visible
   while on-screen and in range; expand bounds if particles clip.

These settings need later profiling. Epic describes the controls in
[System Settings](https://dev.epicgames.com/documentation/en-us/unreal-engine/system-settings-reference-for-niagara-effects-in-unreal-engine).

## Part 5 — Create six original Niagara effects

### Our two procedural materials

Make the ember material during charge checkpoint B. Make smoke when reaching
fizzle. No imported assets, generated images, textures or flipbooks are needed.

**`M_WW_Ember`**, in `Cast/Materials`:

1. Create a Material. Set **Blend Mode = Additive**, **Shading Model = Unlit**,
   **Two Sided = true**. Leave depth testing enabled.
2. Add **Particle Color**, **RadialGradientExponential**, three scalar constants
   (**12**, **0.5**, **2**) and two **Multiply** nodes. Connect constant **0.5** to
   the gradient's **Radius**, and **2** to **Density**. Leave UVs and CenterPosition
   unconnected so their built-in defaults apply.
3. Connect **Particle Color RGB × 12 → Emissive Color**.
4. Connect **gradient Result × Particle Color A → Opacity**.
5. Apply and save. Niagara supplies the colour; a white material preview is OK.

| Material path | Wiring |
|---|---|
| Light and colour | Particle Color RGB → Multiply (B = 12) → Emissive Color |
| Soft edge and fade | Gradient Result × Particle Color A → Opacity |

**`M_WW_Smoke`**: create a new Material with **Translucent**, **Unlit**, **Two Sided**.
Use the same gradient. **Particle Color RGB → Emissive Color**; **gradient Result
× Particle Color A → Opacity**. Emitters supply grey RGB and alpha 0.35. This
first pass is a soft puff, not a realistic smoke flipbook.

The gradient is procedural; [Epic's gradient reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/gradient-material-functions-in-unreal-engine)
describes its radius/density controls.

### Shared emitter rules

Use linear RGBA: **ember (1,0.38,0.08,1)**, **warm core (1,0.85,0.55,1)**,
**flame (1,0.24,0.04,1)**, **smoke (0.12,0.11,0.10,0.35)**. The ember material
already supplies brightness ×12; do not multiply particle colour by 12 again.

- Use **CPU simulation** for this pass. No ribbons, fluids, event handlers,
  collision or distance-field modules are needed.
- Keep **Particle State** so particles expire, and **Solve Forces and Velocity**
  below force modules. Remove a force with its trash button when instructed;
  do not delete the solver to stop motion.
- Set lifetime, colour and size modes explicitly in **Initialize Particle**.
  Use **Direct Set** for single values and **Random** for ranges. A hidden field
  usually means its mode is unset or different.
- For a range outside Initialize Particle, such as velocity speed 20–50, open
  that input's dropdown, choose **Random Range Float**, and set Min/Max. For a
  constant vector, enter X/Y/Z directly.
- Use **Scale Color** with RGB scale 1 and alpha fading from 1 at normalized age
  0 to 0 at age 1. ChargeCore uses Charge directly instead of an alpha curve.
  Use the Alpha input's **Float from Curve** dynamic input, with two keys at
  (time 0, value 1) and (time 1, value 0), sampled by **Particles.NormalizedAge**.
- User parameters are **Float**, except Target and Extent (**Vector3**).
  For a linked input use its dropdown → **Link Inputs → User → name**.
  For a linked rate use **Multiply Float**: A = rate, B = linked parameter.
  Adding a User parameter alone does not make the emitter read it.
- Burst Spawn Count is an **integer** input. To drive it with Charge, use a
  **Float to Int** / **Make Int From Float** conversion dynamic input, then
  inside its float input use Multiply Float (A = count, B = User.Charge).
  Search the input dropdown for the conversion; do not link a float directly
  to an integer or leave a red type mismatch.
- A recipe's numeric values are starting points, not accepted final tuning.

### Part 5A — Charge: prove this first

#### Checkpoint A: a visible fresh template

1. Create a new system from the built-in **Fountain** emitter. Name it
   `NS_FireCast_Charge` in `Cast/Niagara`; use `_Original_v1` if the name is taken.
   The engine asset is `/Niagara/DefaultAssets/Templates/Emitters/Fountain`;
   choose the ordinary emitter rather than the Fountain Lightweight system.
2. Open it and press Play. Leave its default material/renderer alone.
3. Expected: ordinary template particles appear. If blank, check Niagara Log,
   emitter enabled checkbox, timeline Play and viewport framing. **Stop here if
   the stock template is blank.** Do not add more changes to it.

#### Checkpoint B: our visible ember material

4. Create `M_WW_Ember` above. Rename the Fountain emitter **ChargeEmbers**.
   Assign the material in **Sprite Renderer → Material**.
5. Configure ChargeEmbers below. Keep Spawn Rate a constant **40** for now.

| Stack location | Setting |
|---|---|
| Emitter Properties | Local Space **on**, CPU sim |
| Emitter Update → Emitter State | Life Cycle Mode **Self**, Loop Behavior **Infinite** |
| Particle Spawn → Initialize Particle | Lifetime Random **0.4–0.7 s**; Color Direct Set **ember**; Sprite Size Random Uniform **2–4 cm** |
| Particle Spawn → Shape Location | Sphere, radius **12 cm**, centred at emitter origin |
| Particle Spawn → Add Velocity | Cone about local +Z, speed **20–50 cm/s**, angle about **30°** |
| Particle Update | Remove Gravity Force; Curl Noise strength **10**; keep solver; Scale Color alpha fades 1 → 0 |
| Render | Sprite Renderer, `M_WW_Ember`, ordinary camera-facing sprites |

6. Compile, reset, Play. Expected: orange embers floating in a small area. Check
   beside a mannequin hand in the sandbox and save this stage. If the material
   makes it blank, switch back to the template material to isolate the issue;
   check both Emissive and Opacity connections.

#### Checkpoint C: Charge control and a warm core

7. Add **User.Charge**, Float, temporary default **1**. Replace Spawn Rate's
   constant 40 with **Multiply Float**, A **40**, B linked to **User.Charge**.
8. Add **Single Looping Particle**, rename **ChargeCore**. Local Space on,
   `M_WW_Ember`. Emitter State Self/Infinite; keep its one-particle burst.
   Lifetime **1 s**, Color **warm core**, Sprite Size Direct Set Uniform **16 cm**.
   Remove position/velocity offsets so it stays at the component origin. If the
   emitter exposes Loop Duration, set **1 s**.
9. In ChargeCore's Particle Update, add/use **Scale Sprite Size**, Uniform Scale
   linked to **User.Charge**. Add/use **Scale Color**, RGB scale 1, Alpha linked
   directly to **User.Charge**. Keep Particle State. Update links make the core
   respond as the slider changes.
10. Compile, reset, Play. Try Charge **0**, **0.25**, **1** in User Parameters or
    the sandbox Niagara actor's Details. Reset if a changed asset default is not
    reflected immediately.

**Charge acceptance:**

| Input | Expected |
|---|---|
| Charge 0, wait 1 second | No new embers; remaining particles expire; core invisible |
| Charge 0.25 | Small warm glow, sparse orange embers |
| Charge 1 | Larger glow and roughly four times the ember emission rate |
| Reset/play repeatedly | Same behaviour; no red compile errors |

Save the working system. Return the **asset default Charge to 0** for gameplay;
keep the sandbox **actor override = 1** to demonstrate it. A blank preview at
Charge 0 is expected. This first pass proves control/visibility; swirling motion,
rich flame shapes and camera response come later.

After visibility passes, start fixed bounds at **Min (-100,-100,-100),
Max (100,100,100)** and check camera clipping. The component will attach to
`hand_r`; no User.handPosition parameter is needed.

**Stop and report checkpoint C before continuing.** This is not connected to
left mouse or GAS yet; test in Niagara/the sandbox.

### Part 5B — Bolt

Create from **Single Looping Particle**, `NS_FireCast_Bolt`. Warm core colour,
our ember material, Local Space on, Sprite Size **12 cm**. Add Float
**TravelTime = 0.6** and Vector3 **Target = (0,0,0)**. Target is reserved for
future travel code; this particle graph does not read it.

Core Emitter State **Self / Once**, Loop Duration linked to **User.TravelTime**;
one-particle burst; Lifetime also linked to TravelTime. It lasts 0.6 s after reset.

Add **Fountain**, rename **BoltTrail**. Local Space **off**; Self/Once, Loop
Duration linked to TravelTime. Spawn Rate **90**, Lifetime **0.15–0.3 s**, size
**2–4 cm**, ember colour/material, sphere radius **2 cm**. Remove initial velocity,
gravity and curl noise; keep Particle State/solver and fade alpha. World-space
particles remain where emitted as the actor moves.

**Check:** reset while previewing/simulating in the sandbox, then move its actor
with the transform gizmo. Core follows; a short fading trail stays behind.
TravelTime 1.2 lasts longer than 0.6. Leave bounds dynamic. Future C++ moves the
component and owns arrival/cleanup; particles never trigger rule resolution.

### Part 5C — Impact

Create from **Omnidirectional Burst**, `NS_FireCast_Impact`, emitter **ImpactEmbers**.
Add Float **Charge = 1**.

| Setting | Value |
|---|---|
| Emitter State | Self / Once, Loop Duration **0.5 s** |
| Spawn Burst Instantaneous | Spawn Count **40 × User.Charge**, Burst Time 0 |
| Initialize Particle | Lifetime **0.35–0.75 s**, ember colour, Sprite Size **2–5 cm** |
| Add Velocity | Outward/spherical directions, speed **250–500 cm/s** |
| Particle Update | Gravity Z **-980**, Drag **1.5**, solver, alpha fade |
| Renderer | `M_WW_Ember`; start camera-facing, velocity alignment optional |

Add **Simple Sprite Burst** for the flash: Spawn Count **1**, Self/Once, Lifetime
**0.12 s**, warm core colour, size **80 cm**, zero velocity, our ember material,
alpha fade. Scale size by Charge in Particle Update. Bounds start Min
**(-400,-400,-300)**, Max **(400,400,300)**.

**Check:** reset → short warm flash and outward embers, gone in about one second.
Charge 0.25 is smaller/sparser than 1. Keep the persistent target state readable.

### Part 5D — Fizzle

Create from **Omnidirectional Burst**, `NS_FireCast_Fizzle`. Make `M_WW_Smoke`
and assign it. Self/Once, Spawn Count **12**, Lifetime **0.5–0.9 s**, smoke
colour, size **20–40 cm**, outward speed **30–70 cm/s**. Remove gravity; add
upward **Acceleration Force Z = 30**, solver, alpha fade. Scale Sprite Size grows
from 1 to **1.5** over life.

Add another Omnidirectional Burst for embers: **6** particles, lifetime
**0.2–0.4 s**, size **2 cm**, speed **40–90 cm/s**, ember material and alpha fade.
No large flash, lights or persistent flames. Bounds start Min **(-150,-150,-50)**,
Max **(150,150,150)**.

**Check:** small grey puff with dying embers, weaker than impact, gone within
about one second. Future code supplies the HUD refusal reason.

### Part 5E — Burning patch

Create from **Fountain**, `NS_Fire_Burning`, emitter **Flames**. Add Vector3
**Extent = (150,150,10)** and Float **Fuel = 1**. Extent is target half-size in
centimetres; Fuel is normalized remaining fuel, not a value the effect changes.

| Setting | Value |
|---|---|
| Emitter State | Self / Infinite |
| Spawn Rate | **50 × User.Fuel** |
| Shape Location | Box; Box Size **2 × User.Extent**, using Multiply Vector with B = (2,2,2) |
| Initialize Particle | Lifetime **0.4–0.8 s**, flame colour, Sprite Size Random Non-Uniform Min **(16,35)**, Max **(30,65)** |
| Add Velocity | Narrow cone up +Z, speed **60–120 cm/s** |
| Particle Update | Remove gravity; Curl Noise strength **15**; solver; alpha fade |
| Renderer | `M_WW_Ember` |

Add fresh Fountain sparks: **8 × Fuel** per second, size **2–3 cm**, lifetime
**0.5–0.9 s**, upward speed **100–180 cm/s**, ember colour/material.
Optional Hanging Particulates smoke: **3 × Fuel** per second, lifetime **1–2 s**,
size **35–60 cm**, upward velocity **20–40 cm/s**, smoke colour/material.
For the default Extent, bounds start Min **(-250,-250,-50)**,
Max **(250,250,350)**; enlarge when using larger extents.

**Check:** above a sandbox cube, Fuel 1 gives lively upward flame-like sprites;
0.2 much less emission; 0 stops new particles and fades within two seconds.
Extent changes the emitting footprint. Realistic flame textures/heat distortion
are optional later polish, not prerequisites for this readable first pass.

### Part 5F — Smoulder

Create from **Hanging Particulates**, `NS_Fire_Smoulder`. Add Float **Heat = 1**.
Self/Infinite, Spawn Rate **5 × Heat**, Lifetime **1–2 s**, size **30–50 cm**,
upward velocity **15–30 cm/s**, smoke colour/material and alpha fade.

Add fresh Fountain embers: **2 × Heat** per second, lifetime **0.3–0.6 s**,
size **2 cm**, ember material, upward velocity **10–25 cm/s**. No flame emitter
or bright core. Bounds start Min **(-150,-150,-50)**, Max **(150,150,250)**.

**Check:** Heat 1 gives low smoke/scattered embers; Heat 0 stops emission and
fades within two seconds. It reads as residual heat, not a flame loop.

## Part 6 — Cue Blueprints, after the agent's C++ exists

The agent first adds **WildwrightCueBurst**, **WildwrightCueLooping**, cue tags,
scan paths, bolt travel owner and ability/cancel/state-change integration. These
classes do not exist yet. Do not replace them with Blueprint gameplay logic.

Then create Blueprints from the named C++ parents. In Class Defaults pick the
Gameplay Cue Tag and the **new** Niagara system.

| Blueprint | Parent | Tag | System |
|---|---|---|---|
| `GC_Fire_Charge` | WildwrightCueLooping | `GameplayCue.Cast.Fire.Charge` | `NS_FireCast_Charge` |
| `GC_Fire_Release` | WildwrightCueBurst | `GameplayCue.Cast.Fire.Release` | `NS_FireCast_Bolt` |
| `GC_Fire_Impact` | WildwrightCueBurst | `GameplayCue.Cast.Fire.Impact` | `NS_FireCast_Impact` |
| `GC_Fire_Fizzle` | WildwrightCueBurst | `GameplayCue.Cast.Fire.Fizzle` | `NS_FireCast_Fizzle` |
| `GC_Target_Burning` | WildwrightCueLooping | `GameplayCue.Target.Burning` | `NS_Fire_Burning` |
| `GC_Target_Smoulder` | WildwrightCueLooping | `GameplayCue.Target.Smoulder` | `NS_Fire_Smoulder` |

Use `_Original_v1` paths if those were your chosen names. Code owns hand
attachment, travel, cancel and loop removal. The release cue's spawn ownership
must connect to the travelling bolt actor; a standalone cue does not move it.

## Part 7 — Polish after acceptance

Optional: charge vortex, travel streaks/ribbons, richer smoke, original flame
flipbooks, heat distortion and a small scalable light. Add one layer at a time.
Niagara Fluids is optional later baking work. No plugin changes or restarts are
required for this guide.

## What to report and play-test

First report **“Charge checkpoint C passed”** and the final asset name. If it
fails, give **A, B or C**, the first red Niagara Log error, and whether the plain
template/default material is visible. No screenshots are needed to answer that.

After all six, report paths, parameter-check results and warnings. The agent can
inspect the new systems' compile/dependency results.

Only **after GAS integration**, test in `L_TestRange`: ST01 charge → bolt →
ignition → burning → smoulder; ST02 after Water fizzles with the too-wet reason;
ST04 fizzles with its Fire refusal; cancel leaves state unchanged and removes
charge; all effects disabled still gives the same states/logs. A sandbox preview
alone does not prove those gameplay checks.
