# Wildwright — Game Design Document v0.2

> Single source of truth for design and implementation. The short pitch is in
> [01-vision.md](01-vision.md). Decisions and open questions are logged in
> [04-decisions.md](04-decisions.md).

| Field | Value |
|---|---|
| Working title | **Wildwright** (formerly *Worldweave*, then *Elemental*; availability only lightly checked, see OD-05) |
| Version | GDD 0.2 — 2026-10-11 (supersedes GDD 0.1 and Concept v1.1) |
| Status | Pre-production. Design only; no Unreal project exists yet. |
| Genre | Third-person elemental ecosystem sandbox: exploration, survival, construction |
| Presentation target | **Cinematic action-fantasy spectacle** on top of a systemic world |
| Platform | Windows PC |
| Engine | Unreal Engine 5.x (version not locked, see OD-01) |
| Mode | Single-player prototype. Multiplayer is out of scope. |
| Audience | Players who enjoy discovery, simulation, exploration and creative problem-solving |

Numeric values marked as targets are hypotheses to test, not balance commitments.

---

## How to read this document

**In one minute:**

1. The player learns four elements (fire, water, earth, air) and uses them on a
   living valley.
2. Each cast has two layers. The **cast layer** is a cinematic, transient
   performance. The **state layer** is a persistent, readable change to the world.
3. The world remembers meaningful changes (*ecological memory*) and responds:
   plants, creatures, routes and settlements change.
4. Knowledge is the main progression. The journal records what the player has
   actually learned.
5. Scope is deliberately small: one valley, four elements, six rules, a handful
   of organisms.
6. Build in milestones M0–M6. Each has an acceptance test (section 14).

**If you are an implementer** read sections 2, 3, 12, 13 and 14, then Appendix A.
**If you are designing content** read sections 3, 4, 7, 8 and Appendix A.

**ID conventions.** `PIL-n` pillar, `ER_*` elemental rule, `M0–M6` milestone,
`OD-n` open decision, `CR-n` change request, `D-n` decided. The rule IDs and
milestone IDs are stable; do not rename them.

### What changed from V0.1

| Change | Why |
|---|---|
| Renamed Worldweave to Elemental, then to Wildwright | Owner decisions (D-01, D-06). |
| Added PIL-7 *Cinematic spellcraft*, section 2.2 *Spectacle contract* and section 5.3 *Hero cast anatomy* | Owner wants action-fantasy spectacle; recorded as CR-001. |
| Merged the Concept document and GDD; removed duplicated sections | One source of truth per topic. |
| Moved lore from section 3 to section 11 | Lore is low priority for the prototype; the verbs come first. |
| Moved the element system ahead of the world simulation | The player's actions are the entry point. |
| Unified the two rule lists (old §5.3 and Appendix A) into one table | They disagreed. See Appendix A. |
| Added spectacle risks, OD-01 to OD-10 and CR-001 | New direction creates new risks and decisions. |

**Section map V0.1 → V0.2** (so old references still resolve)

| V0.1 | V0.2 | V0.1 | V0.2 |
|---|---|---|---|
| 1 Executive summary | 1 | 9 Resources and crafting | 9 |
| 2 Pillars | 2 | 10 UI and accessibility | 10 |
| 3 Lore | **11** | 11 Technical | **12** |
| 4 World and simulation | **4** | 12 Data and save | **13** |
| 5 Elemental system | **3** | 13 Audio and visual | **5** |
| 6 Gameplay loop and survival | 6 | 14 Milestones | 14 |
| 7 Progression | 7 | 15 Risks | 15 |
| 8 Creatures | 8 | 16 Open decisions | 16 |

---

## 1. Product definition

### 1.1 High concept

Wildwright is a third-person elemental ecosystem sandbox. The player enters a
damaged, unfamiliar world and learns to influence it through four forces: fire,
water, earth and air. These are not only combat spells. They change temperature,
moisture, soil, airflow, erosion, plant growth, creature routines, material
states, and whether a place can be built on or crossed.

### 1.2 Player promise

> Learn how the world works. Use that knowledge to change it. Live with the
> consequences, and discover opportunities that did not exist before.

### 1.3 Product definition

| Attribute | Definition |
|---|---|
| Camera | Third-person for the prototype; first-person remains open. |
| Core fantasy | Become a capable interpreter and shaper of a living landscape, with the presence of a spellcaster, not only its strongest fighter. |
| Session structure | Short experiments give immediate feedback; longer expeditions and regional projects produce persistent change. |
| Primary reward | New knowledge, routes, materials, ecological opportunities and visible world transformation. |
| Failure tone | Consequences should teach. Early experimentation is recoverable; high-risk actions can cost time, supplies or access. |
| First-playable scope | One valley, one player, four elements, limited interactions, a few organisms, simple shelter, save/load. |
| Excluded from first playable | Online multiplayer, procedural continent generation, complex NPC societies, large-scale terrain deformation, full fluid dynamics, AI-dependent gameplay. |

### 1.4 Differentiation

- Elemental actions modify the environment and resource flows, not only enemy health.
- The world retains selected consequences through a lightweight ecological-memory model.
- Creatures and plants react to understandable environmental conditions.
- Player knowledge becomes practical capability: a discovered rule can open a
  route, improve a build site or solve a survival problem.
- A field journal records observations and confirmed rules without revealing
  every answer.
- Every elemental action is performed with cinematic weight (PIL-7).

### 1.5 Design boundary

The game does not promise physically perfect weather, fluid simulation, terrain
deformation or creature intelligence. It delivers consistent, legible
approximations that create convincing cause and effect. Players should be able to
reason about outcomes even when the result surprises them.

---

## 2. Pillars, experience and loops

### 2.1 Design pillars

| ID | Pillar | Required experience | Anti-goal |
|---|---|---|---|
| PIL-1 | Causal world | Actions produce readable, explainable effects. | Random effects that cannot be understood or repeated. |
| PIL-2 | Experimentation | Players test ideas, observe results, revise hypotheses. | One correct recipe per problem; punishing early experiments. |
| PIL-3 | Ecological memory | A region responds to accumulated changes over time. | Cosmetic-only persistence. |
| PIL-4 | Knowledge is power | Discovery creates options beyond stat increases. | Progression dominated by repetitive XP grinding. |
| PIL-5 | Useful construction | Structures manage resources, shelter, access and environment. | Decorative building disconnected from gameplay. |
| PIL-6 | Scope-conscious simulation | Systems interact while staying performant. | Simulating every leaf, droplet or creature continuously. |
| PIL-7 | **Cinematic spellcraft** *(new)* | Every elemental action is a performance: anticipation, release, impact, aftermath. | Spectacle that hides the rule, or flashy effects with no lasting consequence. |

### 2.2 Spectacle contract *(new, CR-001)*

The tension in this game is that systemic design wants **legibility** and
action-fantasy wants **spectacle**. They are reconciled by separating two layers.

| Layer | What it is | Lifetime | Authority |
|---|---|---|---|
| **Cast layer** | Montage, camera mode, charge/release, Niagara, audio, haptics | Seconds; transient | Cosmetic. Never decides state. |
| **State layer** | World-cell variables, tags, material/mesh state, journal | Persistent | The only source of truth. |

Rules:

1. The cast layer is allowed to be as cinematic as the budget permits.
2. The cast layer **reads** from the state layer and **requests** changes through
   the rule resolver. It never mutates world state itself.
3. Every meaningful result must also be readable *after* the effect ends, via a
   material change, mesh state, sound or journal entry (see 5.4).
4. Disabling all VFX must leave gameplay state identical (test in Appendix A.2).
5. A spectacle feature may not be accepted if a tester cannot say what it did.

### 2.3 Intended emotional rhythm

| Moment | Feeling | Design support |
|---|---|---|
| Notice | Curiosity | Distinct cues and unusual local conditions. |
| Hypothesize | Agency | Journal notes and visible clues. |
| Experiment | Anticipation | Low-cost early tests, clear targeting, charge-up. |
| Release | **Power** | Cinematic cast and impact (cast layer). |
| Understand | Satisfaction | Cause/effect confirmation and journal record. |
| Apply | Competence | The same rule solves a different practical problem. |
| Return later | Attachment | Persistent regional state and visible recovery or change. |

### 2.4 Core loop

**Observe → Form a hypothesis → Cast an element or combination → Read the result
→ Record knowledge → Use the new option → Revisit a changed region.**

### 2.5 Secondary loops

- **Survival:** scout → collect/cultivate → manage exposure and shelter → expand
  safe operating range.
- **Construction:** identify a need → survey site → gather materials → place
  structure → connect it to a useful process → verify.
- **Creature:** observe signs → infer needs/territory → change conditions or
  behavior → avoid, redirect, befriend or defend.
- **Regional:** diagnose a local ecological problem → alter variables → wait for
  bounded updates → verify stabilization.

### 2.6 Agency rule

Where practical, a challenge should admit at least two valid approaches, for
example redirect water with earthworks, or reduce heat exposure with shade and
moisture, or find another route. A single intended solution is acceptable for a
tutorial, not as the default sandbox structure.

---

## 3. Elemental system

### 3.1 System principles

- Each element has a primary action family and a small set of predictable effects.
- Effects act on tagged targets through shared interfaces, not duplicated
  object-specific logic.
- Interactions use explicit rules and priorities. The same conditions must
  produce the same gameplay result.
- VFX communicate the result but do not determine gameplay state (see 2.2).
- Rules are discovered through observation, the journal and repeatable experiments.
- Avoid universal simulation of every combination. Start with a curated set and
  add combinations only when they produce meaningful gameplay.

### 3.2 The four elements

| Element | Core verbs | Targets | Risks / trade-offs |
|---|---|---|---|
| Fire | Ignite, heat, dry, cook, transform | Combustible material, heat-sensitive resources, creatures | Spread, smoke, resource loss, heat exposure |
| Water | Wet, cool, pool, redirect, nourish | Ground, plants, heat, channels, materials | Mud, erosion, flooding, reduced fire effectiveness |
| Earth | Raise, block, stabilize, expose, shape | Soil, loose deposits, barriers, foundations | Blocked routes, unstable cuts, cost, redirected water |
| Air | Push, ventilate, disperse, dry, lift | Smoke, mist, particles, light objects, thermal zones | Fire/spore spread, dust, loss of control in strong wind |

Cultural interpretation and natural domain of each element are in 11.4.

### 3.3 Element application model

The player selects an unlocked element and applies it through a short, readable
action. The input style (aimed projection, placed field, or tool-like ability)
remains open (OD-04); the underlying API must support validation, costs,
resolution, feedback and discovery regardless of input method.

| Step | Rule | Layer |
|---|---|---|
| Select | Show selected element and availability. | State |
| Charge | Optional hold. Anticipation animation, camera shift, charging VFX/audio. | **Cast** |
| Target | Trace/query finds an eligible target within range and line of sight. | State |
| Validate | Check target tags, state, cost, cooldown and resistance. A failed check explains why. | State |
| Release | Release animation, projectile or field, impact. | **Cast** |
| Resolve | Apply deterministic state changes and emit an interaction event. | State |
| Feedback | Persistent cue (material, mesh, sound) plus the transient cue. | Both |
| Record | Novel or useful results add journal observations or confirmed rules. | State |

A cancelled charge must clean up the cast layer and must not change state.

### 3.4 Interaction rules

This is the one list of rules. Appendix A holds the test for each.

| Rule ID | Input → target | Preconditions | Prototype outcome | Player use | Phase |
|---|---|---|---|---|---|
| ER_WATER_WET | Water → combustible patch / soil | Target accepts moisture | Moisture rises to a cap; ignition eligibility may fall | Fireproof, prepare soil | **M1** |
| ER_FIRE_IGNITE | Fire → dry combustible patch | Fuel and dryness above threshold | Burn starts; temperature rises; fuel decreases over time | Clear brush, transform, heat | **M1** |
| ER_WATER_COOL | Water → hot surface | Temperature above steam threshold | Temperature falls; **steam** (brief local cooling, reduced visibility) at threshold | Cool surfaces, obscure a short route, reveal airflow | **M1** |
| ER_AIR_DISPERSE | Air → smoke / dust target | Target present | Particle volume shifts; bounded gameplay effect | Clear visibility, push hazards | **M1** |
| ER_WATER_SOIL | Water → compatible soil patch | Moisture reaches soil with organic matter | Growth suitability rises within a cap (**living soil**) | Recover a depleted patch, cultivate | **M1** |
| ER_EARTH_BARRIER | Earth → buildable flow edge | Edge is valid | Barrier modifies a simplified flow link | Redirect water, protect ground | **M1** |
| ER_FIRE_AIR_LIFT | Fire + Air → heat source | Controlled heat; airflow not too strong | Bounded updraft force or heat transport (**thermal lift**) | Reach a ledge, carry light objects | Later (M5+) |
| ER_AIR_EARTH_DUST | Air → loose dry material | Sufficient airflow | Dust cloud and/or gradual stability loss (**erosion**) | Reveal wind direction, uncover a feature, create a hazard | Later |
| ER_FIRE_EARTH_ALTER | Fire → compatible deposit | Heat reaches compatible material | Material changes state or yields a specialized material (**altered mineral**) | Unlock crafting or a component upgrade | Later |
| ER_WATER_AIR_MIST | Water + Air | Moisture and airflow permit dispersal | Mist patch or bounded moisture transfer | Conceal movement, cool an area, support certain plants | Later |

The first-playable cap is **six** rules (14.1), so only the M1 rows are built first.

### 3.5 Special states

| State | Meaning | Prototype status |
|---|---|---|
| Resonance | Rare stable overlap of several elemental conditions | Defer until base rules work. |
| Life | Compatible conditions for biological growth/recovery | Derived from moisture/soil/temperature thresholds. |
| Phase | Authored material state changes (heat-softening, liquid/vapor-like effects) | Bounded materials only; no universal phase simulator. |

Each must have consistent, discoverable rules, not arbitrary puzzle magic.

### 3.6 Conflict handling

- Safety-critical changes resolve before cosmetic effects.
- Each target has one authoritative state per state family; overlap follows a
  declared priority.
- Effects stack only when explicitly allowed; otherwise refresh duration or apply
  the stronger value.
- Clamp values and use cooldowns to prevent runaway feedback loops.
- In development builds, every rule logs: target, rule ID, preconditions,
  before/after state and rejection reason.

### 3.7 Readability requirement

Every meaningful result must be inferable from visual cues, audio, journal or
inspection. Invisible numerical changes without a perceptible result are not
acceptable, except deliberately signposted mysteries.

---

## 4. World and environmental simulation

### 4.1 World layout

The full game is divided into distinct regions rather than one enormous seamless
map. Each region has an ecological identity, a few dominant problems, unique
materials and a reason to revisit.

| Layer | Purpose | Prototype treatment |
|---|---|---|
| World | Setting, history, long-term progression | One region only |
| Region / zone | Coherent ecological and gameplay unit | One small valley with visible boundaries |
| Local cell | Bounded area for aggregated environmental variables | Grid/spatial bins; cell size is a test parameter |
| Actor / object | Player, plant, creature, structure, elemental target | Only relevant actors update frequently |

### 4.2 Regional state variables

| Variable | Range | Influences | Gameplay use |
|---|---|---|---|
| Temperature | 0–100 abstract | Fire, shade, weather, time | Ignition, comfort, drying, habitat |
| Moisture | 0–100 | Rain, water placement, evaporation, soil | Growth, mud, water availability, fire resistance |
| Soil stability | 0–100 | Ground type, flow, earthworks, vegetation | Erosion risk, foundations, path quality |
| Vegetation health | 0–100 per patch/type | Moisture, temperature, soil, disturbance | Harvesting, regrowth, habitat |
| Airflow | Direction + intensity tier | Weather, terrain channels, barriers | Smoke, mist, drying, lift |
| Ecological pressure | 0–100 per patch/region | Harvesting, fire, creature activity, recovery | Regrowth rate, scarcity, migration pressure |

### 4.3 Simulation cadence

| Tier | Updates | Notes |
|---|---|---|
| Immediate | Elemental hits, ignition, splashes, local state change, feedback | Event-driven |
| Short-range | Nearby cells and active organisms on a timed cadence | Target 1–5 updates/second for relevant actors; profile |
| Regional | Distant vegetation, populations, recovery | Batched |
| Dormant | Unloaded regions store summary state | Bounded catch-up rules on revisit/load |

### 4.4 Ecological memory

Ecological memory stores *selected current-state changes* that influence future
outcomes. It is **not** a complete event log. Save current state and a few
useful trend indicators.

- Repeated overharvesting lowers local vegetation health and increases recovery time.
- Water diversion changes moisture distribution; one route may green while another dries.
- A burned patch follows a recovery stage rather than snapping back to baseline.
- Creature territory suitability changes when water or food patches change.

Design safeguards: keep clues about why the world changed; avoid punishment
spirals (mistakes should be recoverable); persist selectively; make consequences
valuable (new options as well as costs); test for exploits and dead ends.

### 4.5 State transitions

Use explicit thresholds and discrete stages:
**Healthy → Stressed → Dormant/Damaged → Recovering → Healthy.**
Do not create a unique visual state for every numeric value. Discrete tiers are
cheaper, easier to debug and easier for players to read.

### 4.6 Weather and physical limits

Use authored presets: **Calm, Windy, Rainfall, Dry Heat**. They make bounded
changes to airflow, moisture and temperature. Water movement uses simplified flow
links/channels and cell-to-cell transfer, not computational fluid dynamics.
Large-scale real-time landscape sculpting is out of scope; earth actions modify
authored terrain or place discrete earthworks.

---

## 5. Presentation: spectacle, audio and visual direction

*(Merges V0.1 §13, the feedback stack from V0.1 §10.1 and the new cinematic direction.)*

### 5.1 Visual direction

A **grounded, tactile, atmospheric world** with **heightened, cinematic elemental
effects.** Use layered vegetation, worn structures, exposed rock, wet/dry
material variation, atmospheric depth, and creatures whose anatomy fits their
environment. Stylization is acceptable where it improves clarity. The reference
for *feel* (not for content or scope) is Epic's Valley of the Ancient; see
[03-feel-reference-valley-of-the-ancient.md](03-feel-reference-valley-of-the-ancient.md).
The final art direction is open (OD-06).

### 5.2 Element language

| Element | Visual language | Audio language | UI cue |
|---|---|---|---|
| Fire | Warm light, heat distortion, embers, charred transitions | Crackle, low roar, material response | Flame-like icon + shape/label |
| Water | Surface sheen, darkened soil, droplets, pooling | Splash, trickle, impact variation | Droplet/wave icon |
| Earth | Dust, cracks, displaced strata, compacted surfaces | Scrape, crumble, low thud | Layered-ground icon |
| Air | Directional foliage, drifting particles, cloth response, lift cues | Wind tone, rustle, pressure swell | Swirl/stream icon |

Never communicate element identity through color alone.

### 5.3 Hero cast anatomy *(new, CR-001)*

A "hero cast" is the full cast-layer performance for one element action. It has
six parts. M1 asks for **one** hero cast as the feel benchmark; the others reuse
the same structure at lower fidelity.

| Part | Purpose | Notes |
|---|---|---|
| Animation | Anticipation, charge loop, release, cancel | Montages; Motion Warping where movement is involved |
| Camera | Aim/ADS mode and recovery | Camera mode stack with priorities |
| Targeting | Preview of what the cast will hit | Doubles as legibility; shows invalid targets |
| Niagara cue | Charge, travel, impact, aftermath | Spawned by a cue, never by gameplay logic |
| Audio | Layered charge/release/impact, reactive mix | Parameter-driven; ducks ambience briefly |
| Haptics | Controller feedback on charge and impact | Optional; keep accessible |

### 5.4 Feedback stack

Every meaningful elemental result combines **at least two** signals: visible
world change, an audio cue, a concise UI message, a journal update or a clear
animation. High-value discoveries deserve stronger feedback than routine updates.
At least one of the signals must **persist** after the transient cue ends.

### 5.5 Legibility over beauty

A readable change is worth more than a beautiful ambiguous effect. Spectacle is
welcome, but a simple mesh state change, clear sound and visible
moisture/temperature cue must exist underneath it. If a tester cannot tell what
a flashy effect did, the effect fails acceptance.

### 5.6 Performance-aware art

- Use instancing for repeated foliage and props.
- Use LODs/Nanite where appropriate, but profile real content.
- Keep volumetric effects scalable; smoke, fog and foliage can be expensive together.
- Use material parameters for wetness, burn state and dust where practical.
- Budget Niagara per element (particle count, GPU/CPU choice) and give every
  effect a quality-scalability tier.
- Polish one valley only after the greybox loop works.

---

## 6. Core gameplay loop and survival systems

### 6.1 Exploration

Exploration is driven by environmental questions, landmarks, resource needs,
blocked routes, unusual organism behavior and ruins that demonstrate elemental
principles. Include one route that becomes easier after learning a rule, proving
that knowledge has a practical payoff.

### 6.2 Survival needs

| Need | Prototype rule | Guardrail |
|---|---|---|
| Health | Reduced by hazards, hostile encounters, severe exposure; restored by rest or treatment | Signal danger before severe penalties |
| Stamina | Limits sprinting, climbing, heavy actions; recovers with rest | Keep traversal responsive |
| Temperature exposure | Local heat/cold and shelter change exposure over time | Use comfortable / stressed / critical states |
| Hydration | Optional; if included, generous depletion and clear sources | Do not add unless it creates decisions |
| Hunger | Deferred until the core elemental loop is validated | Food should support the loop, not become busywork |

Implement health, stamina and temperature exposure first. Add hydration only if
it creates meaningful decisions in the valley test. Defer hunger until playtests
show it strengthens the elemental loop.

### 6.3 Hazards

- Fire/heat zones: visible cues, escalating exposure, recoverable retreat.
- Unstable ground: material cues and warning before a fall or route failure.
- Water hazards: authored volumes and rules, not fluid simulation.
- Creatures: readable territory and warning behavior; avoid unavoidable ambushes early.
- Weather: tactical variation without randomly erasing progress.

### 6.4 Death and recovery

Prototype default: respawn at a known safe point with health restored and journal
knowledge retained. Whether carried resources are dropped or partially lost
remains open (OD-09). Early prototypes test learning and ecosystem feedback, not
punitive loss.

### 6.5 Objective layers

| Layer | Example |
|---|---|
| Immediate | Understand one elemental interaction |
| Short-term | Reach a landmark, establish shelter, or secure a resource |
| Regional | Restore local water/vegetation balance or create a safe route |
| Long-term (full game) | Investigate the Sundering and access further regions |

---

## 7. Progression, knowledge and objectives

### 7.1 Philosophy

Progression expands what the player understands and can do. Numerical upgrades
may support discovery but must not replace it. Avoid a large skill tree until
interaction rules are proven.

| Track | Advancement | Examples | Prototype |
|---|---|---|---|
| Elemental fluency | Discover/apply reliable rules | Improved control, safer application, new combination | One unlock/journal milestone |
| Field knowledge | Observe organisms, materials, local patterns | Habitat clues, resource identification, recovery forecasts | Journal + three discoveries |
| Crafting capability | Find plans and process materials | Tools, containers, shelter parts | Small fixed recipe list |
| Regional access | Complete meaningful interventions | New site, route, specialist help | One regional objective |
| Traversal | Use elemental effects and crafted equipment | Climb aid, glider-like device, heat protection | One knowledge-gated route |

### 7.2 Field journal

The journal is both UI and gameplay system. It distinguishes observations from
confirmed rules, so a coincidence is not presented as proof.

| Entry | Example | Behavior |
|---|---|---|
| Observation | "Moss near the spring looks healthier after rainfall." | May be incomplete or uncertain |
| Hypothesis | "Moisture may improve this soil's growth potential." | Player-created or suggested from evidence |
| Confirmed rule | "Watering compatible soil improves growth suitability." | Added after repeated or controlled results |
| Organism profile | Habitat, diet clues, territorial signs, reactions | Fills in as the player observes |
| Regional record | Changes to water, vegetation, hazards, landmarks | Updates after meaningful state transitions |

### 7.3 Journal UX rules

- Record the result and likely cause, not only a recipe string.
- Filter by element, material, organism and region.
- Do not reveal outcomes before evidence unless a guidance setting requests it.
- Allow hypotheses to be corrected when later evidence disproves them.
- Use confidence labels: observed, repeated, confirmed, unknown.

### 7.4 Quest structure

Use problem-led objectives rather than generic errands. A regional objective asks
the player to diagnose a system and choose an intervention. **First major
objective:** restore a reliable route to a water source by understanding a local
obstacle, applying at least one elemental rule and observing a persistent change.

---

## 8. Creatures and ecosystem behavior

### 8.1 Design goals

- Every creature has an ecological role: resource, seed dispersal, grazing,
  predation, scavenging or territorial pressure.
- Creatures react to a few legible inputs rather than omniscient AI.
- Environmental changes alter suitability, routes, feeding opportunities or territory.
- Start with a small cast of distinct behaviors rather than many reskinned enemies.

| Creature | Role | Behavior | Element relationship | Priority |
|---|---|---|---|---|
| Mossback | Slow herbivore / seed disperser | Grazes suitable patches, retreats from disturbance, follows water | Water/soil affect forage; fire triggers avoidance | High |
| Cinderwing | Small scavenger / airborne indicator | Circles warm updrafts, visits disturbed ground, flees threats | Air/heat create opportunities; smoke changes response | Medium |
| Riftstalker | Territorial predator | Patrols bounded territory, investigates stimuli, retreats if habitat is poor | Water scarcity/habitat loss shifts patrols; fire is a temporary barrier | Later |

Creature names are working names.

### 8.2 Behavior state machine

| State | Entry | Action | Exit |
|---|---|---|---|
| Idle/Rest | No urgent need; safe | Rest, idle animation, low-cost perception | Need, stimulus, schedule |
| Forage | Suitable food patch | Move to patch; consume/interact | Patch depleted, threat, need met |
| Investigate | New sound, elemental event, disturbance | Approach to a safe distance; inspect | Stimulus resolved, threat, timeout |
| Flee | Threat above fear threshold | Move to a safe point using navigation | Distance threshold and threat absent |
| Defend/Attack | Threat crosses territory rule | Telegraphed warning, bounded attack/chase | Threat retreats, stamina threshold, territory boundary |
| Recover/Relocate | Habitat suitability too low | Move to a nearby suitable patch or reduce activity | Suitable habitat or region update |

### 8.3 Habitat suitability

A weighted score from food, moisture, temperature, disturbance and safe cover.
Prototype scoring is simple and deterministic. Thresholds change behavior;
machine learning is not required.

### 8.4 Population persistence

Start with a fixed small population. Later, simulate population trends by
habitat patch rather than keeping every individual active in unloaded regions.
Regional summaries can represent few, stable, stressed or absent without
spawning dozens of actors.

### 8.5 Fairness

- Give visible/audio warning before a dangerous creature attacks.
- Do not let off-screen creatures alter the world in ways the player cannot discover.
- Do not make elemental rules inconsistent to protect a scripted encounter.
- Expose state, target, suitability and intent in debug overlays.

---

## 9. Resources, crafting and construction

| Category | Examples | Acquisition | Use |
|---|---|---|---|
| Organic | Branches, fiber, resin, edible plants | Gather, harvest, cultivate, creature interactions | Tools, bindings, shelter, fuel |
| Mineral | Stone, clay, ore, altered mineral | Gather, expose deposits, process with tools/heat | Foundations, tools, components |
| Environmental | Clean water, moisture, heat, airflow access | Collect, channel, store, create/protect conditions | Survival, growth, crafting, process control |
| Knowledge/plans | Rules, structure plans, material clues | Observe, experiment, explore ruins | Unlock capability; not physical inventory by default |

### 9.1 Crafting rules

- Recipes are data-driven: recipe ID, inputs, outputs, station, knowledge requirement.
- First prototype uses authored recipes; experimentation can expand later.
- Crafting should connect to elemental systems: dry fiber, alter minerals, improve soil.
- Start with about **6–10** useful recipes; expand only when the loop needs them.

### 9.2 Initial recipe candidates

| Item | Inputs (provisional) | Purpose |
|---|---|---|
| Hand tool | Branch + stone + fiber | Basic harvesting and light obstacle interaction |
| Water container | Fiber/resin or clay component | Carry water or apply controlled moisture |
| Simple shelter | Branches + fiber + plant material | Rest point and partial exposure protection |
| Storage rack | Branches + fiber | Organize resources |
| Heat-safe vessel | Clay + fired component | Basic material processing |
| Small barrier / channel marker | Stone or timber | Modify or test a flow route |
| Field kit | Fiber + tool component | Support observation interactions if needed |

### 9.3 Building philosophy

Building is functional and modular. Early structures provide shelter, storage,
work surfaces and limited control over environmental processes. Later systems may
include irrigation, wind capture, thermal processing, barriers and
habitat-support structures. Avoid complex power networks until process-building
is proven fun.

### 9.4 Placement and validation

- A ghost preview shows footprint, orientation, collision, slope suitability and
  material requirements.
- Invalid placement explains why: steep ground, blocked footprint, missing support
  or missing resources.
- Use explicit tags and connection points where useful; avoid a universal
  freeform connection system in the prototype.
- Keep placement validation centralized so multiplayer authority can be added later.

### 9.5 Durability

Structures do not decay merely because the player is away. Durability is reserved
for meaningful hazard or interaction damage. Routine upkeep is added only if it
creates a compelling planning decision.

---

## 10. User interface, feedback and accessibility

| UI element | Purpose | Priority |
|---|---|---|
| Element selector | Selected element, availability, cost/cooldown | Essential |
| Target feedback | Whether a target is eligible and why an action fails | Essential |
| Health / stamina / exposure | Immediate survival state | Essential |
| Interaction prompt | Context-sensitive actions without long text | Essential |
| Discovery toast | Confirms a new observation/rule | Essential |
| Compass / landmarks | Navigation without minimap dependency | Candidate |
| Journal | Searchable observations, rules, organisms, regional changes | Essential |
| Build menu | Recipes, materials, placement validation | Construction milestone |

### 10.1 UI principles

- Use icons and shapes as well as color.
- Keep the HUD quiet while exploring; surface detail in the journal or inspection panels.
- Keep important status readable at 1080p and scalable with UI scale.
- Avoid meters for needs that do not create meaningful choices.
- Add remappable controls, subtitles, adjustable camera sensitivity and scalable
  text as production matures.
- Cinematic camera moves must not remove aiming control for long and must have a
  reduced-motion option.

### 10.2 Debug UI

Development builds need toggleable overlays for cell variables, active rules,
creature states, target eligibility, region IDs and save versions. These tools
shorten debugging time and distinguish gameplay bugs from visual bugs.

---

## 11. World lore and narrative framework

Lore is **low priority for the prototype.** It exists to give the elements and
regions a coherent identity. Terms marked *(working)* may change.

### 11.1 Setting premise

The world's natural systems once ran in a stable pattern called **the Weave** *(working)*:
a network of relationships among heat, water, wind, mineral ground, living
organisms and seasonal cycles. It is a term surviving cultures use for
interdependence, not a literal glowing grid.

A past event, provisionally **the Sundering** *(working)*, disrupted those
relationships. Some valleys dried, some basins flooded, some forests stopped
renewing, and certain creatures changed migration and territorial behavior. The
world is not dead; it is unstable and unevenly recovering. The player arrives
after the catastrophe, when local systems can still be understood and influenced.

### 11.2 Narrative stance

- Tell history through environmental evidence, ruins, tools, altered vegetation,
  migration traces and conflicting field notes.
- Avoid a long opening cinematic that explains every mystery.
- Historical sites show how prior societies managed elemental processes and how
  misuse created consequences.
- Avoid a single mandatory moral interpretation: the player may stabilize,
  redirect, exploit or reshape a local ecosystem.

### 11.3 Player role

The player is provisionally a **Wayfinder** *(working)*: an explorer who
recognizes patterns in the damaged world. Not a chosen savior, and does not begin
with mastery of all elements. Capability is earned through observation,
experimentation and practical work.

### 11.4 Four elements in lore

| Element | Cultural interpretation | Natural domain |
|---|---|---|
| Fire | Transformation; released or concentrated energy | Heat, ignition, drying, cooking, material transformation |
| Water | Continuity; movement and storage of life-supporting resources | Moisture, runoff, pooling, cooling, transport, growth support |
| Earth | Structure; the framework that holds or redirects systems | Soil, mineral material, stability, barriers, erosion, foundations |
| Air | Exchange; movement connecting separated places | Wind, ventilation, dispersal, drying, lift, sound, airborne particles |

### 11.5 Narrative delivery

| Channel | Purpose | Priority |
|---|---|---|
| Environmental storytelling | Primary source of history and regional identity | High |
| Field journal | Observations, discoveries, competing hypotheses | High |
| Ruins and artifacts | Prior engineering and consequences of misuse | Medium |
| NPC dialogue | Partial, biased interpretations and optional tasks | Later |
| Cinematics | A small number of high-value transitions | Low for prototype |

### 11.6 Lore guardrails

Do not fully explain the Sundering in the first region. Keep several plausible
causes open until the wider narrative is designed.

---

## 12. Technical implementation in Unreal Engine

### 12.1 Strategy

Blueprint-first for the prototype; add C++ only when measured needs or
maintainability justify it. Prefer focused components and data assets over one
giant player Blueprint.

> **Implementation principle:** prove each rule in a small test map before
> integrating it into the valley. Keep elemental rules deterministic and keep AI
> tools out of the runtime dependency path.

### 12.2 Systems

| System | Suggested UE implementation | Responsibility |
|---|---|---|
| Player | Character Blueprint + focused Actor Components | Input, movement, interaction request, survival attributes |
| Element system | Element component + data assets/data table | Selected element, cost, target validation, rule dispatch |
| **Cast layer** *(new)* | Gameplay ability or lightweight component + Gameplay Tags + cue interface (OD-02) | Montages, camera mode, charge/release, Niagara/audio/haptic cues |
| Rule resolver | Subsystem or dedicated manager + data-driven rules | Resolve compatible inputs, priority, events |
| World cell state | Subsystem/manager with spatial grid or cell map | Store local variables, bounded transitions |
| Target interface | Blueprint Interface + Gameplay Tags | Expose supported effects and queryable state |
| Plant patches | Actor Blueprint + species data | Visual stage, growth suitability, harvest, recovery |
| Creature AI | AI Controller + StateTree or Behavior Tree + perception | Bounded state, navigation, stimulus response |
| Construction | Build component + placeable actor data | Preview, validation, cost, persistence |
| Journal | Data model + UMG widget | Observations, discovered rules, region records |
| Persistence | SaveGame object(s) with version field | Player, structures, journal, region snapshots |

### 12.3 Core data structures

| Data object | Minimum fields | Note |
|---|---|---|
| ElementDefinition | ElementID, display name, icon, action profile, cost, cooldown, **cast profile** | Designer-editable data asset |
| InteractionRule | RuleID, input elements, target tags, preconditions, outputs, priority, feedback ID | Deterministic and debuggable |
| WorldCellState | CellID, temperature, moisture, soil stability, airflow tier, vegetation/pressure summary | Bounded values; versioned serialization |
| SpeciesDefinition | SpeciesID, habitat weights, thresholds, resource outputs, visual references | Tune without editing AI graphs |
| RecipeDefinition | RecipeID, inputs, outputs, station and knowledge requirements | Validate item IDs |
| StructureDefinition | StructureID, mesh, footprint, cost, placement tags, connections | Instance stores transform and mutable state |
| JournalEntry | EntryID, type, related IDs, evidence count, confidence, region | Persist data, not UI text alone |
| **CastProfile** *(new)* | Montages, camera mode, targeting preview, cue tag(s), audio, haptics | Data-driven; one per element action |

### 12.4 Event-driven state changes

Use events such as `OnElementApplied`, `OnCellStateChanged`,
`OnPlantStageChanged`, `OnCreatureIntentChanged`, `OnDiscoveryRecorded`. Avoid
every system polling every actor each frame. The world manager listens and
schedules only necessary work. Cues (cast layer) subscribe to the same events.

### 12.5 Tick discipline

- Do not tick every plant, resource node, structure and distant creature continuously.
- Use timers, events, distance-based activation and batched updates.
- Separate VFX from persistent state; effects may end while world state remains.
- Use navigation/collision for local movement and placement, not as the ecosystem simulator.
- Profile packaged Development builds, not only editor sessions.

### 12.6 AI-assisted workflow

- Ask AI for exact asset names, variables, node flow, preconditions, failure cases
  and test steps.
- Implement one small system at a time; avoid project-wide rewrites.
- Use source control before major changes and commit each working system.
- Ask for dependencies and regression tests before changing architecture.
- Keep game project files separate from unrelated personal data and credentials.
- Binary `.uasset` files cannot be hand-edited by an agent. Agents propose exact
  steps, C++, Python editor scripts, data tables and tests; the editor produces assets.

### 12.7 Source control

Create a Git baseline before installing major frameworks or starter systems. Use
Git LFS for large binary assets. Exclude generated caches (`Saved`,
`Intermediate`, `DerivedDataCache`, `Binaries` unless deliberately shipped).
Test a clean clone before treating the repository as a reliable backup. Evaluate
any starter framework in a disposable branch or copy first.

---

## 13. Data model, save system and persistence

| Data | Persist? | Method |
|---|---|---|
| Player location, health, unlocked elements | Yes | Player save record |
| Journal discoveries and hypotheses | Yes | Entry IDs and confidence/evidence state |
| Placed structures | Yes | Structure ID, transform, mutable state, contents if needed |
| Changed environmental cells | Yes, if meaningful | Sparse cell records; omit default state |
| Creature individual positions | Usually not initially | Recreate from region rules or save special individuals |
| Particles / temporary visual effects | **No** | Rebuild visuals from gameplay state if needed |
| Short-lived effects | Usually no | Persist only if duration changes gameplay after reload |

### 13.1 Sparse persistence

Store only cells/objects that differ meaningfully from the authored baseline. Use
a stable region ID plus cell coordinate/index. Cell-grid resolution is a
prototype parameter: choose it by testing effect radius and required spatial
precision.

### 13.2 Save rules

- Manual save and a reliable checkpoint suffice for the first vertical slice.
- Every save has a schema version. Migrate known fields or reject with a clear
  diagnostic; never silently corrupt.
- Save after meaningful transitions and before risky experimental features; do
  not save the full world every frame.
- On load, restore persistent state first, then rebuild visuals and derived systems.
- Provide a development-only reset-region command for testing recovery and migration.

### 13.3 Multiplayer later

If multiplayer is approved, persistent environmental changes need an
authoritative owner and replication strategy. Do not build networking into the
prototype, but avoid tying all state changes to local-only cosmetic actors.

---

## 14. Prototype scope, milestones and acceptance tests

> **Do not build the whole world first.** The first milestone is a small, testable
> elemental laboratory proving cause and effect, persistence and player curiosity.

| Milestone | Build | Acceptance evidence |
|---|---|---|
| **M0 — Foundation** | UE project, source control, input, movement, test map, naming conventions | Clean checkout opens; player moves; a change can be reverted |
| **M1 — Element lab** | Four selectable elements, simple target types, six `ER_*` rules, **one hero cast** *(CR-001)* | Three interactions produce visible, repeatable outcomes; invalid targets explain failure; hero cast passes the spectacle contract (2.2) |
| **M2 — World state** | Local variables, heat/moisture/soil state, debug overlay | Change persists for a defined duration or across save/load; values remain bounded |
| **M3 — Ecosystem** | Two plant patches and one creature with state-driven behavior | Water/heat/disturbance changes suitability and causes an observable response |
| **M4 — Survival/building** | Shelter, storage, health/stamina/exposure, placement validation | Player establishes a safe base and uses it to support an experiment |
| **M5 — Journal/objective** | Observation entries, confirmed rules, one regional problem | Tester solves the objective using a learned rule and explains why |
| **M6 — Vertical slice** | Polish, audio, onboarding, save/load, performance pass | External testers understand the premise and choose to run more experiments |

### 14.1 First playable content cap

| Content | Maximum first-playable target |
|---|---|
| Regions | One valley; no open-world streaming requirement |
| Element actions | One clear primary action per element |
| Interaction rules | Six core rules; expand only if readable and fun |
| Environmental variables | Temperature, moisture, soil stability, vegetation health, airflow tier |
| Plant types | Two patch types with different needs |
| Creatures | One or two; begin with one non-hostile ecosystem actor |
| Crafting | Six to ten useful recipes |
| Structures | Shelter, storage, one environmental control structure |
| Regional objective | One problem with at least two plausible solutions |
| Persistence | Journal, structures, meaningful local cell changes |
| **Hero casts** *(new)* | One in M1; at most one per element by M6 |

### 14.2 Playtest questions

- Can a first-time player discover a useful interaction without the exact recipe being explained?
- Can the player explain why the outcome occurred?
- Does the result create a new option, problem or discovery?
- Does the world appear to remember what happened after leaving and returning?
- Do players naturally try multiple experiments?
- Does survival support the elemental loop or distract from it?
- Do testers describe the game as an elemental ecosystem sandbox rather than a conventional survival game?
- **Does the cast feel powerful, and can the player still say what it did?** *(new)*

### 14.3 Go / no-go

Expand only if most testers understand cause and effect, use the journal
voluntarily, and try a second experiment without prompting. If not, improve
feedback and reduce variables before adding creatures, regions or recipes.

---

## 15. Risks, performance budgets and production discipline

| Risk | Impact | Mitigation |
|---|---|---|
| Scope explosion | Each element, organism and region multiplies interactions | Cap first-playable content; expand only after tests pass |
| Opaque causality | Players stop trusting the simulation | Explicit rules, clear feedback, journal evidence, debug overlays |
| Simulation cost | World, foliage, AI, VFX and updates compete for frame time | Aggregate distant state; timers/events; profile early |
| Survival friction | Needs and gathering overshadow discovery | Start with high-value needs; defer hunger unless justified |
| AI-assisted code drift | Broad changes break systems and hide dependencies | Small tasks, version control, acceptance tests |
| Weak market identity | "Survival with elements" is generic | Lead with ecological memory and player-created consequences |
| Persistence bugs | World changes reset or corrupt saves | Versioned sparse saves and migration tests |
| AI service dependency | Cost/availability changes affect development | Core game runs offline without runtime LLM calls |
| **Spectacle scope creep** *(new)* | Hero casts consume the budget; the world sim starves. Reference point: Valley's single LightDart ability is about 147 named assets | One hero cast first; shared cast-profile structure; spectacle budget per milestone |
| **Spectacle hides rules** *(new)* | Players see effects but cannot infer causes | Spectacle contract (2.2); persistent state cue required |
| **Reference-project coupling** *(new)* | Valley-specific assets/code drag in size, version and license issues | Migrate only selected pieces into a clean project (see feel reference) |

### 15.1 Initial performance targets

Provisional PC targets; validate in a packaged build on actual development
hardware and representative content.

| Metric | Initial target | Notes |
|---|---|---|
| Frame rate | Stable 60 FPS at 1080p | Reduce effects/update frequency before harming rule clarity |
| Frame time | 16.7 ms | Measure game thread, render thread, GPU and memory separately |
| Active creatures | Start with 1–5 relevant actors | Scale by profiling |
| World simulation | Only nearby cells update frequently | Regional summaries update in batches |
| Save time | Short enough not to disrupt play; measure first | Sparse state, bounded object counts |
| Niagara | Per-element budget to be set in M1 | GPU vs CPU choice recorded per effect |

### 15.2 Production discipline

- Maintain a working build at every milestone.
- For each system document purpose, inputs, outputs, failure cases, test map and
  acceptance criteria.
- Do not ask AI to refactor the whole project when a narrow change suffices.
- Use placeholder art until mechanics are stable; do not model a large creature
  roster before behavior is proven.
- Track known issues and distinguish intended design from bugs.
- Record scope decisions in section 16 / [04-decisions.md](04-decisions.md) so old
  ideas do not re-enter unnoticed.

### 15.3 Explicit non-goals for the first playable

- A 1000 km² world or multiple streamed zones.
- Multiplayer, PvP, hosted servers or live-service architecture.
- Dozens of elemental combinations.
- Procedural narrative generation or LLM-controlled creature behavior.
- Fully deformable terrain, fluid simulation or realistic climate modeling.
- A complete main story, extensive dialogue or large quest chains.
- Advanced automation/power networks or hundreds of recipes.
- A full combat system *(new; see OD-03)*.

---

## 16. Open decisions and change control

The live list is in [04-decisions.md](04-decisions.md). This table is the summary.

| ID | Decision | Current recommendation | Resolve when |
|---|---|---|---|
| OD-01 | Engine version for the prototype | UE 5.4.4 | Before M0 |
| OD-02 | Cast-layer technology | GAS for casting only; world state separate | Before M1 |
| OD-03 | Combat role | No player-vs-creature combat in M1–M2 | After M3 |
| OD-04 | Element delivery | Aimed cast with charge → release | After M1 playtests |
| OD-05 | Title availability | "Wildwright" is a working title; a quick search found no conflicts | Before public branding |
| OD-06 | Art direction | Grounded world, heightened elements | After M1 look tests |
| OD-07 | Terrain approach | Authored states and discrete earthworks | After M2 |
| OD-08 | Costs/cooldowns | Minimal at first; tune if spam undermines decisions | After core rules are fun |
| OD-09 | Death penalty | Preserve journal; safe respawn | After survival loop tests |
| OD-10 | Valley asset licensing | Verify before reusing any Epic or Megascans asset | Before any asset migration |

### 16.1 Change control

Any change that adds a core system, expands the first-playable cap or changes an
elemental rule must state: (1) player problem solved, (2) expected benefit,
(3) implementation cost, (4) systems affected, (5) acceptance test, (6)
milestone impact. A good idea is not automatically a production priority.

### 16.2 Definition of done

- Feature has a written purpose and bounded scope.
- Normal case and at least two failure cases are tested.
- Result is readable to the player.
- Feature survives save/load if intended to persist.
- No known severe performance/stability issue in the test map.
- Project is committed and can reopen from the repository.

### 16.3 Immediate next actions

| Order | Action | Deliverable |
|---|---|---|
| 1 | Decide OD-01 and OD-02 | Recorded in 04-decisions.md |
| 2 | Create clean UE project and Git baseline | Versioned project that opens and runs |
| 3 | Create greybox valley and test range | Small map with target objects and test cases |
| 4 | Build target interface and element selection | Player selects and applies one element to one target |
| 5 | Implement first three `ER_*` rules only | Deterministic resolution and visible outcomes |
| 6 | Build the first hero cast (water or fire) | Passes the spectacle contract |
| 7 | Add world-state debug overlay | Inspect variables and rule decisions |
| 8 | Test and document fun/confusing points | Evidence-based decision on expanding rules |

---

## Appendix A — Prototype content and interaction matrix

### A.1 Targets

| Target | Properties | Initial reactions |
|---|---|---|
| Combustible patch | Fuel tier, moisture, burn state, regrow state | Fire ignites if dry enough; water cools/wets; air affects spread tendency |
| Soil patch | Moisture, stability, organic quality | Water raises moisture; earth changes barrier/stability; air can dry exposed soil |
| Hot surface | Temperature, heat capacity tier, material tag | Water cools and may create steam; air alters cooling within bounds |
| Loose mineral deposit | Material ID, exposed/buried state, heat response | Earth exposes/covers; fire transforms compatible material |
| Plant patch | Species ID, health stage, suitability thresholds | Moisture/soil/temperature affect growth; fire damages; recovery over time |
| Creature | Species ID, current state, habitat score, threat response | Investigates stimuli, flees or relocates at explicit thresholds |

### A.2 Test scenarios

Each scenario maps to a rule ID or a system guarantee.

| # | Scenario | Verifies |
|---|---|---|
| 1 | Water dry soil, then apply fire nearby; the wet/dry difference is visible and deterministic | `ER_WATER_WET`, `ER_FIRE_IGNITE` |
| 2 | Water a hot surface; temperature changes and steam feedback appears at the declared threshold | `ER_WATER_COOL` |
| 3 | Change a cell, leave its area, return; state remains correct | Dormant/catch-up rules |
| 4 | Save, quit, reload; journal, structures and modified cell state persist | Save system |
| 5 | Place a small earth barrier; the simplified flow changes without an endless loop | `ER_EARTH_BARRIER`, conflict handling |
| 6 | **Disable every visual effect; gameplay state is identical** | Spectacle contract (2.2) |
| 7 | Compare calm vs strong airflow on a smoke/dust target | `ER_AIR_DISPERSE` |
| 8 | Verify plant response after watering compatible soil | `ER_WATER_SOIL` |
| 9 | **Cancel a charged cast; no state changed and cast layer cleaned up** | Application model (3.3) |

### A.3 Rule-ID lineage

The V0.1 Appendix A rules map one-to-one to the table in 3.4. The four *Later*
rows were the V0.1 §5.3 combinations that had no rule ID; they are given IDs here
so they can be scheduled.

---

## Appendix B — Glossary and implementation vocabulary

| Term | Definition |
|---|---|
| Ecological memory | Persistent environmental state that influences growth, creature behavior, resource availability or travel |
| Elemental rule | Deterministic mapping from element/action, target context and preconditions to a state change |
| World cell | Bounded spatial unit storing aggregated gameplay variables; not necessarily a visible tile |
| Suitability score | Bounded measure of whether a plant or creature can thrive in a local patch |
| State transition | Change between named states when a declared condition is met |
| Data-driven | Values/rules stored as editable data rather than buried in logic graphs |
| Cast layer | The transient cinematic performance of an element action (2.2) |
| State layer | The persistent, authoritative world state (2.2) |
| Hero cast | A full-fidelity cast-layer performance for one element action (5.3) |
| Cast profile | Data asset that defines the cast layer of one element action (12.3) |
| Gameplay Tag | Hierarchical label for targets, materials, states and capabilities |
| Gameplay Cue | Event-driven presentation effect, triggered by a tag, that spawns VFX/audio/haptics |
| GAS | Unreal's Gameplay Ability System: abilities, effects, attributes, tags and cues |
| Niagara System | Unreal's particle/VFX asset; spawned by cues, never by gameplay logic |
| Actor Component | Reusable Unreal component attached to an Actor for focused behavior |
| Blueprint Interface | Contract allowing different actors to expose the same functions without a shared parent class |
| Subsystem | Unreal-managed object for systems needing shared access and a defined lifetime |
| Sparse persistence | Saving changed/important state rather than every default world value |
| Vertical slice | Small polished sample demonstrating the intended experience end to end |
| Greybox | Simple placeholder environment used to test scale, flow and mechanics before final art |
| Acceptance test | Observable condition required before a milestone is considered complete |

### Closing design statement

> Wildwright succeeds when players stop asking only "What can I craft next?" and
> start asking "What happens if I change this part of the world?", and when
> changing it *feels* like power. Every major system should reinforce that shift.
