# Wildwright — Game Design Document v0.4

> The authoritative design. The short pitch is [01-vision.md](01-vision.md);
> decisions and open questions are in [04-decisions.md](04-decisions.md); current
> status lives in the [README](../README.md), not here.

| Field | Value |
|---|---|
| Working title | **Wildwright** (availability only lightly checked, OD-05) |
| Version | GDD 0.4 — 2026-10-13: world-systems rebase (CR-003) on the owner's Dynamic World Systems Concept v0.1 (A-02) |
| Genre | Third-person elemental landscape sandbox: shape a living valley with fire, water, earth and air |
| Presentation | **Cinematic action-fantasy spellcraft** (D-03) on top of a physically convincing, systemic world |
| Platform | Windows PC |
| Engine | Unreal Engine **5.8.3** (D-07); cast layer on GAS (D-08); agent-built systems in C++ with CSV data (D-12) |
| Mode | Single player for the MVP. World state is designed so it could later become server-authoritative (§13.4) |
| Audience | Players who enjoy discovery, simulation, building and creative problem-solving |

Numbers in this document are starting hypotheses kept in CSV data, not balance
commitments.

---

## How to read this document

**In one minute:**

1. The player wields fire, water, earth and air to **shape a living valley**: cut
   channels, raise berms, redirect water, burn, douse and turn the wind.
2. The valley **remembers**: scars, not resets. Nature pushes back through
   regrowth and succession, and recovery may produce a different landscape.
3. The simulation is **bounded**: full detail only near the player, compact numbers
   everywhere else, and no fluid or voxel simulation.
4. Every cast has a cinematic **cast layer** and an authoritative **state layer**
   (§2.2). The cast never decides what happened.
5. Knowledge of how the land works is the main progression.
6. The MVP is one valley, built **system by system**, hardest technology first (§14).

**Implementers:** §2.2, §3, §4, §12, §13 and §14, then Appendix A.
**Designers:** §1–4, §6, §7 and §14.1.

**ID conventions.** `PIL-n` pillar · `ER_*` cast rule (instant, caused by an
element) · `WP_*` world process (runs on its own over time) · `MVP-n` milestone ·
`S-n` technical spike · `OD-n` open decision · `CR-n` change request · `D-n`
decision · `A-n` accepted in principle. Rule IDs are stable once used; retired IDs
are listed in §3.5 and never reused.

### What changed from v0.3

| Change | Why |
|---|---|
| The world model is now terrain, water, vegetation and air held in environmental cells, earthworks and a flow network (§4), not standalone patch actors | Owner's concept (A-02). Elements must shape the land itself (PIL-5). |
| Elements act on three target kinds: ground, path and object (§3.3) | Ground and earthworks need different targeting from objects. |
| Cast rules (`ER_*`) are separated from world processes (`WP_*`) (§3.5–3.6) | v0.3 mixed instant outcomes with slow processes (for example soil growth as a "rule"). |
| `ER_AIR_DISPERSE` → `ER_AIR_GUST`; `ER_EARTH_BARRIER` → `ER_EARTH_BERM`; `ER_EARTH_CHANNEL` added; `ER_WATER_SOIL` → `WP_GROWTH` | Fit the new world model; the six-rule cap is kept. |
| Scars-not-resets, change classes, simulation tiers, terrain strategy, earthworks, flow graph, fire, succession and time (§4) | Integrated from the concept. |
| Survival, crafting, construction beyond earthworks and creatures moved after the MVP (§6.4, §8, §9) | Focus the MVP on the differentiator; keep it buildable. |
| Milestones M1–M6 retired; MVP-0 to MVP-5 with a system build order and two spikes (§14) | Prove the riskiest technology first; v0.3 built rules before world state existed. |
| Valley of the Ancient removed as a reference (D-18) | Owner direction: learn techniques, build our own. |
| Status and delivery tables moved to the README | This document describes the game, not progress. |

---

## 1. Product definition

### 1.1 High concept

Wildwright is a third-person sandbox in which the player learns to wield fire,
water, earth and air and uses them on a living valley. Earth cuts channels and
raises berms in soft ground; water follows the new course and wets the land it
reaches; fire burns what is dry and leaves scars; air turns smoke and flame. The
valley keeps what was done to it and responds on its own: burned slopes regrow,
watered basins turn green, drowned meadows become marsh.

### 1.2 Player promise

> Read the land. Change it with your own hands. Come back and see what it became.

### 1.3 Product definition

| Attribute | Definition |
|---|---|
| Camera | Third person |
| Core fantasy | A wright of the wild: a shaper of land, water and growth, with the presence of a spellcaster |
| Session structure | Short interventions with an immediate response; ecological consequences over game days; resting skips time to see them |
| Primary reward | A visibly changed, living landscape that the player caused and understands |
| Failure tone | Mistakes become scars, not game-over screens. Most damage recovers; the player can help it along |
| MVP scope | One valley (~400 m across), one player, four element actions, the world systems in §4, two objectives, save/load (§14.1) |
| Not in the MVP | Multiplayer, multiple regions, survival needs, crafting, building beyond earthworks, creatures, combat, voxel terrain, fluid simulation, runtime AI |

### 1.4 Differentiation

- The landscape itself is the medium: terrain, water routes, vegetation and wind
  change, not only objects and enemy health.
- Change persists as **scars**, and nature applies recovery pressure. Recovery can
  settle into a different, stable ecosystem.
- Water physically seems to find its way, because a flow network decides where it
  goes and the visuals follow it.
- Knowledge of these systems is the progression.
- Every action is performed with cinematic weight, but the state underneath stays
  readable and deterministic.

### 1.5 Design boundary

Wildwright promises **plausible**, not simulated, physics. Soft earth moves and
bedrock resists; water runs downhill along connected channels; fire needs fuel and
dryness. These are consistent, legible approximations. There is no computational
fluid dynamics, no unrestricted digging and no per-leaf simulation. A player should
be able to predict an outcome, and explain it afterwards when it surprises them.

---

## 2. Pillars, experience and loops

### 2.1 Design pillars

| ID | Pillar | Required experience | Anti-goal |
|---|---|---|---|
| PIL-1 | Causal world | Every change has a readable, repeatable cause. | Random results that cannot be explained or repeated. |
| PIL-2 | Experimentation | Players test ideas on the land, compare results and revise. | One correct recipe per problem; punishing a first try. |
| PIL-3 | **Scars, not resets** | The valley remembers; nature pushes back; recovery may change what the land becomes. | Cosmetic-only change, or a world that quietly restores itself. |
| PIL-4 | Knowledge is power | Understanding how the land works opens options. | Progress as numbers and grinding. |
| PIL-5 | **Shape the land** | Elements act on terrain, water, vegetation and air, within readable material limits. | Elements that only decorate or only damage. |
| PIL-6 | **Bounded simulation** | Full fidelity only where the player can see it; compact state everywhere else; designed to scale. | Simulating everything everywhere; ticking every plant. |
| PIL-7 | Cinematic spellcraft | Every cast is a performance: anticipation, release, impact, aftermath. | Spectacle that hides the rule, or flash with no lasting result. |

PIL-3, PIL-5 and PIL-6 were renamed and sharpened from v0.3 (ecological memory,
useful construction, scope-conscious simulation). The IDs are kept.

### 2.2 Spectacle contract

Systemic design wants **legibility**; action-fantasy wants **spectacle**. They are
reconciled by two layers.

| Layer | What it is | Lifetime | Authority |
|---|---|---|---|
| **Cast layer** | Montage, camera mode, charge and release, Niagara, audio, haptics | Seconds; transient | Cosmetic. Never decides state. |
| **State layer** | Environmental cells, earthworks, flow network, object state, game time, journal | Persistent | The only source of truth. |

Rules:

1. The cast layer may be as cinematic as the budget allows.
2. The cast layer **reads** state and **requests** changes through the rule
   resolver. It never writes world state itself.
3. Every meaningful result must stay readable *after* the effect ends: terrain,
   water, vegetation, material, sound or a journal entry (§5.4).
4. Disabling every visual effect leaves gameplay state identical (Appendix A).
5. A spectacle feature is rejected if a tester cannot say what it did.

The same separation applies to the world: the flow network decides where water
goes and the water surface only shows it; cells decide what burns and Niagara only
shows the fire.

### 2.3 Emotional rhythm

| Moment | Feeling | Design support |
|---|---|---|
| Read the land | Curiosity | Visible material, moisture and vegetation cues; inspection (§10) |
| Plan | Agency | A preview shows where a channel will run and why it is refused |
| Cast | **Power** | Cinematic cast and a physical-feeling change to the ground |
| Watch it work | Satisfaction | Water finds the new channel; fire meets the firebreak |
| Return later | Recognition | The valley has changed on its own: green, scarred or different |
| Adapt | Competence | The player uses what they learned somewhere else |

### 2.4 Core loop

**Read the land → Choose an intervention → Shape it → Watch the immediate response
→ Let the world respond → Return and read the consequence → Adapt.**

### 2.5 Three time scales

| Scale | Duration | Examples | Driven by |
|---|---|---|---|
| Cast | Seconds | Charge, release, impact, trench forming | Cast layer requesting a rule |
| Process | Seconds to minutes | Water filling a channel, fire spreading, ground drying | World processes in the active tier |
| Ecology | Game hours to days | Regrowth, succession, marsh forming, scar fading | World processes in the regional tier and catch-up |

The ecology scale is why resting and returning matter (§4.12).

### 2.6 Agency rule

A challenge should admit at least two valid approaches (for example a channel, a
berm or an old ruin to breach). A single solution is acceptable only in a tutorial.

### 2.7 Material language

What the player can change must be readable from the material itself:
**soft earth moves; bedrock resists.** Soil, mud and sand can be cut and raised;
gravel shifts within limits; bedrock does not. A refused earthwork names the
material that stopped it. No invisible "you can't build here" zones.

---

## 3. Elemental system

### 3.1 Principles

- Each element has one primary action in the MVP and a short list of later verbs.
- Elements act on three kinds of target (§3.3) through shared rules, not
  object-specific code.
- Cast rules are deterministic and data-driven: same state in, same result out.
- A cast changes state once, instantly; world processes then carry the
  consequences forward on their own (§3.6).
- Every refusal states its reason.
- Add combinations only when they create meaningful play.

### 3.2 The four elements

| Element | MVP primary action | Acts on | Later verbs | Risks and trade-offs |
|---|---|---|---|---|
| Earth | **Shape**: draw a path, then cut a channel or raise a berm | Soft ground (paths) | Firebreak profile, pads, move loose rocks, stabilise slopes | Rerouted water can drown or dry other ground; earthworks are lasting |
| Water | **Douse**: soak an area | Ground (area), objects | Pour to fill a depression, mist with air | Over-wetting makes mud and marsh |
| Fire | **Ignite**: set dry fuel alight | Ground (point), objects | Heat, dry, harden or alter materials | Fire spreads with fuel, dryness, wind and slope; leaves scars |
| Air | **Gust**: push the wind in a direction for a while | Ground (area) | Lift, disperse dust, carry mist | Strong wind spreads fire and dries the land |

All four are available from the start in the MVP; unlock pacing is later design.
Cultural meaning of each element is in §11.4.

### 3.3 Target kinds

| Kind | What it is | How it is targeted | State it changes |
|---|---|---|---|
| **Ground** | The environmental cells under an area or point | Aim at the terrain; a footprint shows the cells affected | Cell moisture, fire, wind, vegetation (§4.5) |
| **Path** | A polyline drawn over soft ground | Earth only: place points along the ground, preview, confirm | Creates an earthwork record (§4.7) |
| **Object** | A discrete actor with its own state: a hot rock, a log pile, a ruin dam, later structures and creatures | Aim at the object | The object's own bounded state |

Objects use the element target interface built in actions 4–5 (§12.8). Ground and
path targets are new in MVP-3.

### 3.4 Application model

| Step | What happens | Layer |
|---|---|---|
| Select | Choose an element; its availability shows | State |
| Aim or draw | Aim a point or area, or draw a path (Earth) | State |
| Validate | Range, line of sight, target kind, material, slope, budget, current state. A failure states why | State |
| Charge | Hold to charge: anticipation animation, camera, charge effects (D-14) | Cast |
| Release | Release animation and travel or forming effect | Cast |
| Resolve | The rule changes state once and emits an event | State |
| Process | World processes carry the change forward over time | State |
| Feedback | A lasting change plus a transient cue | Both |
| Record | Notable results add journal observations | State |

A cancelled charge cleans up the cast layer and changes nothing. Earth previews
its whole path before the cast; the cast then forms it.

### 3.5 Cast rules (`ER_*`)

The MVP has **six** cast rules (the cap is unchanged).

| Rule | Element → target | Preconditions | Result | Status |
|---|---|---|---|---|
| `ER_WATER_WET` | Water → ground area or object | Target accepts moisture | Moisture rises toward a cap; burning cells or objects in the area are extinguished | Accepted on objects (actions 4–5); ground in MVP-3 |
| `ER_FIRE_IGNITE` | Fire → ground point or object | Fuel above the minimum; moisture at or below the ignition limit; not already burning or burnt out | The cell or object starts burning; spread is `WP_FIRE_SPREAD` | Accepted on objects; ground in MVP-2/3 |
| `ER_WATER_COOL` | Water → hot object | Temperature at or above the steam threshold | Temperature falls; a Steam event | Accepted on objects |
| `ER_AIR_GUST` | Air → ground area | Inside range | A directional wind override for a set time in a cone; feeds `WP_FIRE_SPREAD`, `WP_MOISTURE` and smoke | MVP-2/3 |
| `ER_EARTH_CHANNEL` | Earth → path | Every segment on soft ground; slope, depth, intersections and budget valid (§4.7) | A channel is cut; vegetation along it is removed; the flow network may gain links | MVP-1 (debug input), MVP-3 (cast) |
| `ER_EARTH_BERM` | Earth → path | As for channels | A berm is raised; flow links it crosses are blocked | MVP-1 (debug input), MVP-3 (cast) |

**Later rules** (not in the MVP): `ER_FIRE_AIR_LIFT` (thermal lift),
`ER_AIR_EARTH_DUST` (dust and erosion), `ER_FIRE_EARTH_ALTER` (altered mineral),
`ER_WATER_AIR_MIST` (mist), and an Earth rule to move loose rocks.

**Retired IDs** (never reuse): `ER_AIR_DISPERSE` → `ER_AIR_GUST`;
`ER_EARTH_BARRIER` → `ER_EARTH_BERM`; `ER_WATER_SOIL` → world process `WP_GROWTH`.

### 3.6 World processes (`WP_*`)

World processes are the "nature" half of the game: they run on their own, in
fixed steps, in the tier the player's distance allows (§4.4).

| Process | Reads | Writes | Runs in | MVP |
|---|---|---|---|---|
| `WP_FLOW` | Flow network, earthworks, sources, storage | Flow per link, water in basins | Recomputed on any network change; levels settle in the active tier | MVP-1 |
| `WP_MOISTURE` | Flow beside cells, water casts, rain, temperature, wind, soil | Cell moisture (wetting, drainage, drying) | Active and nearby tiers; regional in batches | MVP-1 |
| `WP_FIRE_SPREAD` | Burning cells, fuel, moisture, wind, slope | Fire state, fuel, temperature, burn severity | Active tier at high rate; elsewhere as a burn front | MVP-2 |
| `WP_GROWTH` | Moisture band, soil health, temperature, burn severity | Growth progress per cell | Regional tier and catch-up | MVP-2 |
| `WP_SUCCESSION` | Growth progress, moisture extremes, fire | Vegetation stage, fuel load (§4.10) | Regional tier and catch-up | MVP-2 |
| `WP_SOIL` | Burn severity, vegetation cover, waterlogging | Soil health | Regional tier and catch-up | MVP-2 |
| `WP_WIND` | Ambient wind preset, gust overrides | Wind vector per area | Active and nearby tiers | MVP-2 |

Order within one simulation step: wind → flow → moisture → fire → growth →
succession → soil. Every process clamps its outputs and uses no hidden randomness;
where variation is wanted (fire fronts), it uses a fixed seed per cell, so the same
save always plays out the same way.

### 3.7 Conflict handling

- One authoritative state per value; processes write only their own outputs.
- Effects stack only where declared; otherwise the stronger value or a refreshed
  duration wins.
- Clamp every value; rate-limit feedback loops (fire heating dries ground that then
  burns faster).
- In development builds every cast rule and process step can log the target, rule
  or process, inputs, before and after values and any refusal reason.

### 3.8 Readability

Every meaningful change must be visible after the effect ends, or inspectable
(§10). Invisible numbers with no perceptible result are not acceptable.

### 3.9 Element × target matrix (MVP)

| | Ground | Path | Object |
|---|---|---|---|
| Earth | — | Channel or berm | — (moving rocks is later) |
| Water | Douse: wet, extinguish | — | Wet, cool, extinguish |
| Fire | Ignite dry fuel | — | Ignite |
| Air | Gust: wind override | — | — (pushing light objects is later) |

A dash means the cast is refused with a reason ("Earth needs a path over soft
ground").

---

## 4. World model

### 4.1 Scars, not resets

Meaningful environmental change is allowed without the map becoming either a
permanent wasteland or a world that visibly resets behind the player.

- Players may burn, soak, cut, raise and redirect.
- The world remembers selected consequences; nature applies recovery pressure
  through regrowth, recolonisation, weather and succession.
- Recovery does not have to recreate the original. Changed conditions can produce a
  new stable state: a drained bog becomes meadow, a flooded hollow becomes marsh.
- Structural changes (earthworks, diverted streams) stay until something changes
  them.

### 4.2 Change classes

| Class | Examples | Behaviour | Single-player time (OD-13) | Future server time |
|---|---|---|---|---|
| Temporary disturbance | A small fire, a soaked patch, trampled growth | Recovers by itself | Minutes to one game day | Minutes to days |
| Ecological change | A burned hillside, a drained or flooded area | Staged succession; may settle into a different ecosystem | Several game days | Days to weeks |
| Structural change | Channels, berms, a diverted stream | Persists until another process or player changes it | Permanent | Permanent |

Player restoration (watering, replanting later) speeds recovery. The future-server
column is the concept's starting target: obvious early recovery within days, severe
regional damage healthy again in roughly 2–6 weeks.

### 4.3 World layout

| Layer | Purpose | MVP |
|---|---|---|
| World | Setting and long-term progression | One region |
| Region | A coherent ecological unit with its own problems | One valley, ~400 m × 400 m |
| Cell | The unit of environmental state | ~4 m square (test parameter): ~10,000 cells for the valley |
| Object | Discrete things with their own state | A few dozen: hot rocks, log piles, ruin dams |

### 4.4 Simulation tiers

The whole world never runs at full fidelity. Overlapping player activity activates
an area once, not once per player.

| Tier | Where | What runs | Rule |
|---|---|---|---|
| Active | Around the player (~60 m) | Fire spread, water levels, drying, casts, object timers, full presentation | High fidelity only where it can be seen; fixed steps 2–5 per second |
| Nearby | ~60–200 m | Batched moisture, fire front and wind | No per-object tick; ~1 step per second |
| Regional | The rest of the valley | Growth, succession, soil, coarse moisture | Numbers replace actors; batched each game hour |
| Dormant | Saved or unvisited time | Stored state and last-update time | No simulation; bounded catch-up when resumed (§4.12) |

Tier radii and rates are CSV data, set by measurement in MVP-1 and MVP-2.

### 4.5 Environmental cell state

Cell state is **authoritative**. Terrain materials, PCG vegetation, water surfaces
and effects are built from it; they never decide it. Cells are saved only where
they differ from the authored baseline.

| Field | Range | Meaning | Written by |
|---|---|---|---|
| Ground material | Bedrock, gravel, soil, sand, mud, water body | What earth can do here; drainage | Authored; earthworks |
| Elevation offset | ± metres | Change from the authored terrain | Earthworks |
| Moisture | 0–100 | Bands: Arid < 15, Dry < 35, Moist < 65, Wet < 85, Waterlogged | Water casts, `WP_MOISTURE` |
| Temperature | 0–100 abstract | Ambient plus heat from fire | `WP_FIRE_SPREAD`, ambient |
| Fuel | 0–100 | Burnable biomass, set mainly by vegetation stage | `WP_SUCCESSION`, `WP_FIRE_SPREAD` |
| Fire | None, Burning, Smouldering | Transient | `ER_FIRE_IGNITE`, `WP_FIRE_SPREAD`, `ER_WATER_WET` |
| Burn severity | 0–100 | The scar; fades as growth returns | `WP_FIRE_SPREAD`, `WP_GROWTH` |
| Vegetation stage | §4.10 | What grows here | `WP_SUCCESSION`, earthworks |
| Growth progress | 0–100 | Progress toward the next stage | `WP_GROWTH` |
| Soil health | 0–100 | Fertility; slows or speeds growth | `WP_SOIL` |
| Wind | Direction + strength | Ambient plus gusts | `WP_WIND`, `ER_AIR_GUST` |
| Last update | Game time | For catch-up | Scheduler |

Example cell: *forest stage Woodland · moisture 58 (Moist) · fuel 70 · burn
severity 0 · soil health 71 · last update day 3, 14:00.*

### 4.6 Terrain and materials

Permanent geography is conventional terrain: Unreal Landscape for valley floors,
slopes and ridges. Only plausibly deformable materials can be changed.

| Material | What the player can do |
|---|---|
| Soil, mud, sand | Cut channels, raise berms (later: flatten pads, firebreaks) |
| Gravel, scree | Cut or raise within tighter limits |
| Loose rocks | Later: move as objects; physics only while moving |
| Fractured deposits | Later: breakable through specific systems |
| Bedrock, major geology | Permanent; earthworks refuse with "Bedrock" |

**Soft-ground zones** are where earthworks are possible. Landscape cannot be edited
at runtime in a shipped game, so each zone is a hole in the Landscape filled by a
runtime terrain tile that is rebuilt when an earthwork changes it (OD-14,
proven or replaced by spike S-1). Berms may be separate meshes on top. The
material and colour of a zone must match the surrounding Landscape so the player
sees one continuous valley.

### 4.7 Earthworks

The player appears to sculpt the land; the game stores a compact earthwork
definition instead of millions of edits.

1. **Define a path.** Earth targeting places points along the ground; the preview
   follows the terrain.
2. **Validate.** Every segment on soft ground; slope within limits; depth not into
   bedrock; no crossing of protected geology; intersections with other earthworks
   resolved (a channel through a berm breaches it); within the earthwork budget.
   A refusal names the segment and the reason.
3. **Generate geometry.** A channel or berm profile is swept along the spline and
   conforms to the terrain.
4. **Sell it.** Exposed soil, blended edges, displaced stones, vegetation removed
   along the path, dust and debris, sound and animation.
5. **Feed the systems.** Collision, navigation, the flow network (§4.8), cell
   material and moisture, and vegetation (cleared cells start at Bare).
6. **Persist compactly.** Spline points, profile, width, depth, material,
   connections and creation time; rebuilt on load.

| Profile | Width | Depth or height | Effect | MVP |
|---|---|---|---|---|
| Channel | 1.5–3 m | 0.5–1.5 m deep | Carries water if connected and downhill; acts as a firebreak | Yes |
| Berm | 2–3 m | 0.5–1.5 m high | Blocks flow links it crosses; diverts water | Yes |
| Firebreak, pad, raised bank | — | — | Variants of the two above | Later |

The earthwork budget (OD-08) stops a player from reshaping the whole valley in one
go: for example a total length per game day that recharges. Runtime dynamic-mesh
deformation beyond these profiles, and voxel terrain, are not baseline features.

### 4.8 Water

Visible water is separated from the hydraulic logic that decides where water goes.

- **Flow network.** Nodes (springs, junctions, basins, outlets) joined by links
  (stream reaches, channels). Each link has a bed elevation at each end and a
  capacity from its cross-section.
- **Sources** inject flow (a spring gives, for example, 100 units). **Basins** store
  water up to their volume, then overflow. **Outlets** remove it.
- **Distribution.** Flow at a node splits among outgoing links in proportion to
  capacity times elevation drop. Water never runs uphill and is never created: the
  sum leaving a node equals what entered, minus what a basin stores.
- **Earthworks change the network.** A channel adds a link when one end meets
  water and its bed falls downhill along its length; a berm closes the links it
  crosses. A barrier or a new ditch can shift a 70/30 split to 20/80.
- **Recompute** happens when the network changes, never per frame; it visits each
  link a bounded number of times, so loops cannot run forever.
- **Presentation follows.** Water surfaces are drawn along links with width and
  depth from the flow (OD-15, spike S-2). Depressions show standing water when the
  model says a basin holds some. Banks and downstream cells get wetter through
  `WP_MOISTURE`.
- **No particle fluid dynamics** in the persistent world.

### 4.9 Fire

- **Ignition.** `ER_FIRE_IGNITE` on a cell or object with enough fuel and low
  enough moisture.
- **Spread.** Each step, a burning cell heats its neighbours; a neighbour ignites
  when its heat passes a threshold set by its fuel and moisture, with wind and
  uphill slope lowering the threshold downwind and upslope.
- **Burn-out.** Fuel is consumed; the cell becomes Smouldering, then out; burn
  severity records the scar; vegetation drops to Scorched (§4.10).
- **Stopping fire.** Wet cells, channels and bare ground carry no fire;
  `ER_WATER_WET` extinguishes; `ER_AIR_GUST` can turn the front.
- **Presentation.** Niagara flames, smoke and embers near the player; far away the
  burn is a regional number with cheap distant smoke.

### 4.10 Vegetation and succession

Vegetation is represented by PCG and instanced foliage built from each cell's
stage. A stage change regenerates only the affected area.

| Stage | Fuel | Grows into | When |
|---|---|---|---|
| Bare | 0 | Pioneer | Soil present; moisture Dry to Wet |
| Pioneer (grasses, herbs) | Low | Meadow | Sustained Moist ground |
| Meadow | Medium | Scrub | Moist ground and good soil over time |
| Scrub | High | Woodland | Long stable moisture and soil |
| Woodland | High | — | Climax for the MVP |
| Marsh *(alternative state)* | Low | Meadow, if drained | Waterlogged for a sustained time |
| Scorched *(after fire)* | 0 | Bare, then Pioneer | Fire passed; speed set by burn severity and soil |

Drought pushes stages back one step over time; long waterlogging turns any stage
into Marsh. Values and durations are CSV data. A single watering never produces
instant mature growth.

### 4.11 Rocks

Movable rocks are a later feature. When added they are physics-active only while
moved, falling or colliding; once settled, physics turns off and only the transform
is stored. Large geology is static.

### 4.12 Time, rest and catch-up

- **Game clock.** A day-night cycle; recommended 1 game day = 24 real minutes
  (OD-13).
- **Rest.** At the camp the player can rest one to three days. The world advances
  in bounded catch-up steps using the same deterministic processes, then shows the
  result.
- **Catch-up.** Any area returning from Dormant (after a load or a long absence)
  runs the regional processes for the elapsed time in coarse steps, up to a cap.
  It must give the same answer as running the steps in real time, within stated
  tolerance.
- **While the game is closed,** time does not pass in single player.

### 4.13 Weather

MVP: a daily ambient wind preset (direction and strength) and dry or damp days.
Rain, storms and seasons are later, as bounded changes to moisture, temperature and
wind.

### 4.14 Safeguards

- Keep clues to why the world changed (scars, wet banks, cut channels).
- Avoid punishment spirals: most damage recovers, and the player can help.
- Persist selectively; never save particles or transient effects.
- Make consequences valuable: new options as well as costs.
- Test for exploits: infinite water, endless fire, earthwork spam.

---

## 5. Presentation

### 5.1 Visual direction

A **grounded, tactile valley** with **heightened elemental light and motion**:
layered vegetation, exposed soil and rock, wet and dry ground, atmospheric depth.
Changes to the land must look physical: cut earth shows strata and loose soil,
water carries reflections and flow lines, burns leave char and ash. Stylisation is
welcome where it improves clarity. Final art direction is open (OD-06).

### 5.2 Element language

| Element | Visual | Audio | UI cue |
|---|---|---|---|
| Fire | Warm light, heat distortion, embers, char | Crackle, low roar | Flame icon and label |
| Water | Sheen, darkened soil, flow lines, pooling | Splash, trickle, running water | Droplet icon |
| Earth | Exposed strata, dust, displaced stones | Scrape, crumble, low thud | Layered-ground icon |
| Air | Bending grass, drifting particles and smoke | Wind tone, rustle | Swirl icon |

Never communicate element identity by colour alone.

### 5.3 Hero cast anatomy

A hero cast is the full cast-layer performance for one element action. The MVP has
**one** (Fire, D-13); the others reuse its structure at lower fidelity.

| Part | Purpose | Notes |
|---|---|---|
| Animation | Anticipation, charge loop, release, cancel | Source open (OD-16) |
| Camera | Aim mode and recovery | Reduced-motion option |
| Targeting | Preview of what the cast will affect | Doubles as legibility; shows refusals |
| Niagara cue | Charge, travel, impact, aftermath | Spawned by a cue, never by gameplay code (D-17: our own effects) |
| Audio | Layered charge, release, impact | Parameter-driven |
| Haptics | Controller feedback | Optional |

### 5.4 Feedback stack

Every meaningful result combines at least two signals: a visible change, a sound, a
short message, a journal entry or a clear animation. At least one must last after
the transient cue ends.

### 5.5 Legibility over beauty

A readable change beats a beautiful ambiguous one. If a tester cannot tell what a
flashy effect did, it fails.

### 5.6 Selling world change

Expensive presentation only where the player can see it: ground blending and
exposed soil along earthworks, dust and debris while forming, wet banks and flow
lines on new channels, char and ash after fire, fresh green on recovering ground.
Far away, the same state is shown with cheap materials and distant smoke.

### 5.7 Performance-aware art

Instancing for foliage; Nanite where it helps; scalable volumetrics; material
parameters (or virtual textures) for wetness, burn and exposed soil; a Niagara
budget per element with quality tiers.

### 5.8 Cover concept

An original cover concept exists for review (Workspace card, Cover art tab; prompt
in [art/cover-v1.prompt.md](../art/cover-v1.prompt.md)). It sets no promise for the
game's graphics and does not decide OD-06.

---

## 6. Play experience

### 6.1 Reading the land

Exploration is driven by questions the land poses: why is this meadow dry, why
does the stream vanish here, which slope will burn. The player can inspect ground
(material, moisture band, vegetation stage, scars) without casting (§10).

### 6.2 MVP session shape

The demo valley (MVP-4) has a camp, a stream fed by a spring, a dry meadow below
the stream's level on soft ground, a grove on a wind-exposed slope and old ruins
with a collapsed earth dam. Pacing targets are hypotheses.

| Beat | Time | The player | The build proves |
|---|---|---|---|
| Arrive | 0–3 min | Learns to move, look and read the land | Inspection and the quiet HUD work |
| First change | 3–10 min | Douses dry ground and tries fire on wet and dry ground | Refusals with reasons; fire spreads only where dry |
| Bring water | 10–25 min | Gets water to the dry meadow: a channel from the stream, or breaching the old dam | Two solutions; flow changes visibly; banks get wet |
| Fire on the slope | 25–35 min | A fire starts upwind of the grove; stop it with a channel firebreak, dousing, turning the wind, or let it burn | Elements combine; outcomes differ and persist |
| Rest and return | 35–40 min | Rests two days at camp and walks back | The meadow greens; the burn shows early recovery; saving and reloading keeps it |
| Sandbox | Open | Keeps shaping the valley | Nothing resets |

### 6.3 Failure and recovery

There is no death in the MVP. A bad outcome is a scar: a burned grove, a drowned
meadow. Most scars recover; the player can help. A development reset exists for
testing.

### 6.4 After the MVP

Survival needs (health, stamina, exposure), gathering and crafting, construction
beyond earthworks, creatures, combat and multiplayer are later design. Their v0.3
detail is kept in the history of this file and the decision log; it returns only
through a change request.

---

## 7. Knowledge and progression

### 7.1 Philosophy

Progression is understanding. Numbers may support it but never replace it. No
skill tree until the systems are proven fun.

### 7.2 Field journal (MVP)

A small authored set of observations (~10) recorded when the evidence happens:
for example "Wet ground refused fire", "Water followed my channel downhill", "The
burn scar is greening". Each entry has a cause, a confidence (observed, repeated,
confirmed) and a location. Evidence conditions are authored checks on state
changes, never an AI judgement or a cast count.

### 7.3 Later progression

| Track | Example | When |
|---|---|---|
| Elemental fluency | Longer earthworks, stronger gusts, finer control | After the MVP proves the base actions |
| Field knowledge | Species, soils, recovery forecasts | Grows with the journal |
| Regional access | New valleys with different ecologies | After the MVP |

---

## 8. Creatures (after the MVP)

Creatures will respond to cell state: food (vegetation stage), water, cover, recent
fire. Each has an ecological role and a small state machine (rest, forage, flee,
relocate). The first candidate is a slow grazer that moves into recovering meadows.
Cells already carry what creatures need; wildlife suitability is derived from them
when creatures arrive. No creature is in the MVP.

## 9. Construction and resources (after the MVP)

Earthworks are the MVP's construction. Structures (shelter, storage, water control),
gathering and recipes return after the MVP through a change request, using the same
validation pattern as earthworks: preview, readable refusal, nothing consumed on a
failed placement.

---

## 10. User interface, feedback and accessibility

| UI element | Purpose | MVP |
|---|---|---|
| Element selector | Selected element and availability | Yes |
| Aim and path preview | What the cast affects; refusal and reason | Yes |
| Land inspection | Hold a key: material, moisture band, vegetation stage, scar and fire state of the aimed ground | Yes |
| Clock and rest | Time of day, day count, rest prompt at camp | Yes |
| Journal toast and page | New observations | Yes |
| Debug overlay (development) | Cell heat maps, flow values, fire front, tiers, timings, rule logs | Yes |

Principles: icons and shapes as well as colour; a quiet HUD while exploring;
readable at 1080p and scalable; remappable controls, subtitles, camera sensitivity
and reduced motion as production matures. Cinematic camera moves never take aim
control away for long.

---

## 11. World lore and narrative framework

Lore is low priority for the MVP. Terms marked *(working)* may change.

### 11.1 Setting premise

The world's natural systems once ran in a stable pattern called **the Weave**
*(working)*: the relationships among heat, water, wind, ground, living things and
seasons. A past event, **the Sundering** *(working)*, broke those relationships.
Some valleys dried, some flooded, some forests stopped renewing. The world is not
dead; it is unstable and unevenly recovering, and its systems can still be read and
influenced.

### 11.2 Narrative stance

History is told through the land: ruins of old water works, scars, altered
vegetation. No long opening cinematic. Prior societies show how land was managed and
mismanaged. There is no single mandatory moral reading: the player may restore,
redirect or reshape.

### 11.3 Player role

The player is a **Wayfinder** *(working)*: someone who reads the land, not a chosen
saviour. Capability is earned by observation and practice.

### 11.4 The four elements in lore

| Element | Cultural meaning | Natural domain |
|---|---|---|
| Fire | Transformation | Heat, ignition, drying, burning |
| Water | Continuity | Moisture, flow, pooling, growth |
| Earth | Structure | Soil, rock, channels, banks |
| Air | Exchange | Wind, drying, carrying smoke and seeds |

### 11.5 Guardrails

Do not fully explain the Sundering in the first region. Environmental storytelling
first; journal second; dialogue and cinematics later.

---

## 12. Technical architecture

### 12.1 Strategy

Agent-built systems are C++ with CSV data imported into data tables, and assets
come from editor-Python generators (D-12). Blueprints are for content the owner
tunes. The cast layer is GAS (D-08). AI and MCP plugins stay editor-only. Build and
test procedures: [engineering guide](05-engineering-guide.md).

> **Implementation principle:** one system at a time, each proven in a small test
> map with automated checks before it joins the next. Keep simulation
> deterministic. Keep AI out of the runtime.

### 12.2 Tool stack (UE 5.8.3)

| Need | Tool | Status in 5.8 | Role |
|---|---|---|---|
| Permanent terrain | Landscape | Core | Valley floors, slopes, ridges |
| Soft-ground terrain | Runtime terrain tiles built with Geometry Script / Dynamic Mesh | Production (runtime module) | Diggable zones (OD-14, spike S-1) |
| Earthwork geometry | Spline sweep in C++ (Geometry Script or procedural mesh) | Production | Channels and berms |
| Water routing | Custom C++ flow network | Ours | Authoritative hydraulics |
| Water presentation | Custom water ribbons; Water plugin for authored lakes if it holds up | Water plugin is **Experimental** | Visible water (OD-15, spike S-2) |
| Vegetation | PCG + instanced foliage | Production | Stage-driven representation |
| Fire and effects | Niagara | Production | Presentation only (D-17) |
| Ecology, fire, moisture | Custom C++ cell simulation | Ours | Authoritative state |
| Casting | GAS | Production | Cast layer (D-08) |
| Streaming | World Partition | Production | Not needed for one valley; keep the option |
| Persistence | SaveGame + versioned records | Core + ours | Sparse state |
| Creatures (later) | StateTree | Production | Behaviour |
| Voxel terrain | — | — | Not used; reconsider only if unrestricted digging becomes a pillar |

Purchase policy: buy no voxel or deformation plugin. Prove the spline-earthwork and
flow-network approach first; evaluate paid tools later against a proven need.

### 12.3 Runtime architecture

**State layer** (C++, deterministic, serialisable):

| System | Owns |
|---|---|
| Environment subsystem | The cell grid, tiers, the fixed-step scheduler and catch-up |
| Earthwork subsystem | Earthwork records, validation, budget |
| Flow subsystem | The flow network and `WP_FLOW` |
| Process modules | `WP_MOISTURE`, `WP_FIRE_SPREAD`, `WP_GROWTH`, `WP_SUCCESSION`, `WP_SOIL`, `WP_WIND` |
| Rule resolver (existing `UWildwrightRuleSubsystem`) | Cast rules for every target kind; refusals |
| Time subsystem | Game clock, rest |
| Persistence | Save records and reconstruction order (§13.3) |

**Presentation layer** (reads state, never writes it): soft-ground tile builder,
earthwork mesh builder, water ribbon builder, PCG vegetation driver, fire and
smoke effects, terrain material parameters for wetness and scars, debug overlay.

**Cast layer** (GAS): abilities, charge and release, cues (D-08).

Every state change goes through a subsystem function that can be called from
tests, the debug tools and later a server. Events (`OnCellsChanged`,
`OnEarthworkCreated`, `OnFlowRecomputed`, `OnStageChanged`, `OnFireChanged`) tell
presentation what to rebuild.

### 12.4 Core data

| Data | Fields | Source |
|---|---|---|
| Element | Tag, name, colour, range, cooldown | `Data/Elements.csv` (exists) |
| Cast rule | Rule ID, element, target kinds and tags, preconditions, effect values | `Data/Rules.csv` (exists; extended) |
| Object target type | Initial state, thresholds, presentation | `Data/TargetTypes.csv` (exists) |
| Ground material | Diggable, drainage, max cut depth, colour | New CSV |
| Earthwork profile | Width, depth or height, cost, slope limits | New CSV |
| Process parameters | Rates, thresholds, tier radii and rates | New CSV per process |
| Vegetation stage | Fuel, growth thresholds, PCG set | New CSV |
| Cell record | §4.5 fields (sparse) | Save data |
| Earthwork record | Spline points, profile, width, depth, material, connections, time | Save data |
| Cast profile | Timing, cues, montages, camera | `Data/CastProfiles.csv` (parked work, §12.8) |

### 12.5 Tick discipline

No per-frame tick on cells, plants or earthworks. Fixed-step simulation per tier;
batched regional updates; event-driven presentation rebuilds; recompute the flow
network only on change. Profile packaged builds, not only the editor.

### 12.6 AI-assisted workflow and source control

One small system per task, with tests; never a project-wide rewrite. Agents write
C++, CSV and generators; the editor produces binary assets. Git with LFS; generated
caches excluded; commit only with the owner's approval. Evaluate any plugin or
framework on a branch first.

### 12.7 Determinism

Fixed step lengths; no frame-time dependence in state; seeded per-cell variation;
stable iteration order. Required for tests, catch-up and a future server.

### 12.8 Existing work and how it fits

| Existing (game repo) | Becomes |
|---|---|
| Element selection, aiming, HUD, reasons (action 4, `7b9712f`) | Kept. Extended in MVP-3 to ground and path targets |
| Rule resolver, three object rules, target actor and interface, object state (action 5, `a4049ae`) | Kept as the **object** target path; ground rules are added beside them |
| `L_TestRange` and its generator and verifier | Kept as the object-rules regression lab until MVP-3 adds ground and path tests |
| Cast-layer C++ (`Source/Wildwright/Cast/`; uncommitted; builds and its 7 automation tests pass) | Parked until MVP-3 |
| Box-built valley greybox | Retired 2026-10-13 |

---

## 13. Persistence

### 13.1 What is saved

| Data | Saved | How |
|---|---|---|
| Earthworks | Yes | Earthwork records |
| Cells that differ from the baseline | Yes | Sparse cell records |
| Flow network | No | Rebuilt from the authored network plus earthworks |
| Object state | Yes, if changed | Stable object ID plus bounded values |
| Game time | Yes | Clock and last-update times |
| Journal | Yes | Entry IDs, confidence, evidence |
| Player | Yes | Position, selected element, earthwork budget |
| Effects, particles, timers | No | Rebuilt from state |

### 13.2 Rules

Every save has a schema version; known fields migrate, unknown versions are
rejected with a clear message and never overwrite a good save. Save on rest and on
request. Never save every frame.

### 13.3 Reconstruction order

Load earthworks → rebuild soft-ground tiles and earthwork meshes → rebuild the flow
network and recompute it → apply cell records → run catch-up → rebuild vegetation,
water surfaces, materials and effects.

### 13.4 Multiplayer later

A future server (the concept imagines about 50 players) would own the state layer;
clients render nearby state only, and distant change is not drawn on every player's
GPU. The MVP builds no networking, but keeps every state change behind subsystem
functions and every presentation rebuilt from state, so that door stays open.

---

## 14. MVP scope, build order and acceptance

**This section is the MVP plan, approved by the owner on 2026-10-13 (D-20).**

> Build the world before the spells that act on it. Prove the hardest technology
> first, in a small scene, with measurements.

### 14.1 MVP definition

**One valley demo** a new player can explore for about 40 minutes, then keep
shaping as a sandbox.

| In | Out (after the MVP) |
|---|---|
| One ~400 m valley on Landscape with soft-ground zones, a spring-fed stream, a dry meadow, a grove, ruins, a camp | More regions, streaming |
| Four element actions (§3.2) and six cast rules (§3.5) | More rules and combinations |
| Cells, earthworks, flow network and visible water, moisture, fire, vegetation stages and succession, wind, time and rest | Weather beyond wind and dry or damp days; seasons |
| One hero cast (Fire) with our own effects | Hero casts for every element |
| Land inspection, journal (~10 observations), two objectives with two or more solutions each | Quests, dialogue, story |
| Save, load and catch-up | Offline elapsed time |
| Debug overlay | — |
| — | Survival, crafting, structures, creatures, combat, multiplayer |

### 14.2 MVP content cap

| Content | Maximum |
|---|---|
| Regions | 1 |
| Element actions | 4 (one per element) |
| Cast rules | 6 |
| World processes | 7 (§3.6) |
| Earthwork profiles | 2 (channel, berm) |
| Vegetation stages | 7 (§4.10) |
| Ground materials | 5 |
| Objectives | 2 |
| Hero casts | 1 |
| Journal observations | ~10 |

### 14.3 Milestones

| Milestone | Builds | Done when | Rough size *(estimate)* |
|---|---|---|---|
| **MVP-0 Foundation** | Project, Git and LFS, character, element selection and object rules | Done (actions 0–5) | — |
| **MVP-1 World-change proof** | Proof scene, spikes S-1 and S-2, cells, earthworks (debug input), flow network and water, moisture, save and load, measurements | §14.5 passes in `L_WorldProof` | 3–5 weeks |
| **MVP-2 Living ground** | Time and rest, vegetation stages with PCG, succession, fire spread, wind, catch-up | A burned slope and a watered meadow change correctly over rested days and survive a reload, within budget | 4–6 weeks |
| **MVP-3 Casting** | Ground and path targets, four element actions, the cast layer (GAS), Earth path input, the Fire hero cast, land inspection | Each element does its action with reasons; the hero cast passes the spectacle contract; owner play-test | 3–5 weeks plus owner effects and animation |
| **MVP-4 Demo valley** | The valley, objectives, journal, onboarding | A new player completes both objectives and explains one consequence | 3–5 weeks |
| **MVP-5 Demo polish** | Audio, effects, art pass, performance, packaged build, play-tests | Go/no-go criteria (§14.7) on 3–5 external testers | 2–3 weeks |

Sizes assume agents implement and the owner reviews, play-tests and makes content
part-time. They are planning hypotheses, revised after each milestone.

### 14.4 MVP-1 and MVP-2 build order

Each step is one small system with its own brief, tests and exit check. A step
starts only when its dependencies are accepted.

| Step | Depends on | Deliverable | Exit check |
|---|---|---|---|
| 1.1 Proof scene | — | `L_WorldProof`: a grassy stream bank above a lower basin; a spring-fed stream; one soft-ground zone; camp marker | Walkable; stream and zone visible; generated or documented so it can be rebuilt |
| 1.2 Spike S-1: soft ground | 1.1 | A Landscape hole filled with a runtime terrain tile; a test channel cut by code | Decision on OD-14 from measured look, collision, rebuild time and memory |
| 1.3 Spike S-2: channel water | 1.1 | A water surface along a test channel that updates when flow changes | Decision on OD-15 from look at play distance, update time and cost |
| 1.4 Cells and overlay | 1.1 | Cell grid, §4.5 schema, tiers and fixed-step scheduler, debug heat maps | Values clamp; steps are deterministic; overlay shows any field |
| 1.5 Earthworks | 1.2, 1.4 | Debug path input, validation with reasons, channel and berm geometry, collision, vegetation cleared in cells, budget | Valid and three refused cases (bedrock, slope, budget) behave as specified |
| 1.6 Flow network and water | 1.3, 1.5 | Authored stream network; channels connect when downhill; berms block; distribution; water surfaces follow | Split changes as specified; no water from nothing; loops bounded; visible water matches the numbers |
| 1.7 Moisture | 1.4, 1.6 | `WP_MOISTURE`: banks wet, ground dries; terrain shows wetness | Downstream of a new channel gets wetter; the old route dries over time |
| 1.8 Save and load | 1.5–1.7 | Earthwork and cell records; reconstruction order | Save, quit, reload rebuilds the trench, water route and moisture exactly |
| 1.9 Measure | 1.8 | CPU, GPU, memory and save-size report | Budgets recorded for MVP-2 |
| 2.1 Time and rest | 1.4 | Clock, rest, catch-up | Catch-up equals step-by-step within tolerance |
| 2.2 Vegetation | 1.4, 2.1 | Stages, `WP_GROWTH`, `WP_SUCCESSION`, `WP_SOIL`, PCG driven by stage | A watered meadow advances; drought regresses; waterlogging makes marsh |
| 2.3 Wind | 1.4 | `WP_WIND`, gust override (debug) | Wind field and decay as specified |
| 2.4 Fire | 2.2, 2.3 | `WP_FIRE_SPREAD`, ignition (debug), burn-out, scars, extinguishing, effects | Fire stops at wet ground and channels; spreads downwind and uphill; scars recover through stages |
| 2.5 Integration | all | Save and load and catch-up across all processes; budgets | MVP-2 exit check |

MVP-3 to MVP-5 get the same step tables when MVP-2 ends, using what was learned.

### 14.5 Technical proof (MVP-1 acceptance)

From the owner's concept, in `L_WorldProof`:

1. A realistic grassy stream bank above a lower basin.
2. Earth (debug input in MVP-1) draws a curved trench across valid soil.
3. A convincing channel forms, with collision and removed, blended vegetation.
4. The system detects that the channel connects to the stream and runs downhill.
5. Visible moving water runs through the new channel.
6. Flow in the original route drops; ground downstream of the new route gets wetter.
7. An earth berm blocks or redirects the flow again.
8. Save, exit, reload: the trench, water route and environmental state come back.
9. CPU, GPU, memory and save-data cost are measured before more complexity is added.

### 14.6 Play-test questions

- Can a new player read why a cast was refused and what to try instead?
- Does the land feel shaped by the player, physically and believably?
- Can the player predict where water will go, and explain it when wrong?
- Does the valley seem to remember, and to heal in its own way?
- Do players try a second intervention without prompting?
- Does the cast feel powerful while its result stays clear?
- Do testers describe the game as shaping a living landscape?

### 14.7 Go / no-go

Expand beyond the MVP only if most testers can explain cause and effect, notice the
valley's recovery and choose to keep shaping it. Otherwise improve feedback and
reduce variables before adding regions, creatures or systems.

### 14.8 Retired plan

| v0.3 item | Now |
|---|---|
| M0 Foundation | MVP-0 (done) |
| M1 Element lab: three object rules | Done; kept as the object target path |
| M1 remaining rules (dispersal, living soil, barrier) | Replaced by `ER_AIR_GUST`, `WP_GROWTH`, `ER_EARTH_CHANNEL` and `ER_EARTH_BERM` |
| M1 hero cast (action 6) | MVP-3 |
| Action 7 debug overlay | MVP-1 step 1.4 |
| M2 World state | MVP-1 and MVP-2 |
| M3 Ecosystem | MVP-2 (vegetation); creatures after the MVP |
| M4 Survival and building | After the MVP; earthworks are in MVP-1 |
| M5 Journal and objective | MVP-4 |
| M6 Vertical slice | MVP-5 |

---

## 15. Risks, budgets and discipline

| Risk | Impact | Mitigation |
|---|---|---|
| Cutting below terrain fails or looks wrong | The core fantasy breaks | Spike S-1 first; fallback all-mesh soft zone; owner reviews the look early |
| Water presentation looks fake or costs too much | Channels do not sell | Spike S-2; presentation is separate from logic, so it can be swapped |
| Simulation cost | Frame drops when fire or flow is busy | Tiers, fixed steps, budgets measured in 1.9 and 2.5 |
| PCG regeneration hitches | Stutter when stages change | Regenerate small partitions, spread over frames; measure in 2.2 |
| Catch-up drift | Rest gives different results from play | Same processes, coarse steps, tolerance tests |
| Save corruption | Lost world changes | Versioned sparse records, rejection of unknown versions, tests |
| Opaque causality | Players stop trusting the world | Inspection, overlay, refusal reasons, journal |
| Earthwork spam | The valley becomes a maze | Budget (OD-08) and material limits |
| Scope creep | MVP never ships | Content cap §14.2; change requests for anything else |
| Spectacle scope | Hero cast consumes the budget | One hero cast; shared cast profile |
| AI-assisted drift | Broad changes break systems | One system per brief, tests, owner-approved commits |

### 15.1 Initial budgets *(hypotheses, set by measurement)*

| Metric | Target |
|---|---|
| Frame rate | Stable 60 FPS at 1080p on the development machine |
| Simulation cost | ≤ 2 ms game-thread per frame on average in the active tier |
| Flow recompute | ≤ 5 ms per network change for the MVP valley |
| Earthwork rebuild | ≤ 50 ms per channel, off the critical path where possible |
| Save size | Measured in 1.9; sparse records only |
| Niagara | Per-element budget set in MVP-3 |

### 15.2 Discipline

Keep a working build at every step. Document purpose, inputs, outputs, failure cases,
test map and exit check for every system. Placeholder art until mechanics hold.
Record scope decisions in the decision log.

### 15.3 Not in the MVP

A large world or multiple regions; multiplayer or servers; survival, crafting or
structures; creatures or combat; dozens of element combinations; voxel terrain or
unrestricted digging; fluid simulation; runtime AI; a story campaign.

---

## 16. Open decisions and change control

| ID | Decision | Recommendation | Resolve when |
|---|---|---|---|
| OD-03 | Combat role | None in the MVP | After the MVP |
| OD-04 | Element delivery | Aimed charge and release (D-14); Earth draws paths | After MVP-3 play-tests |
| OD-05 | Title availability | Real trademark and storefront search | Before public branding |
| OD-06 | Art direction | Grounded land, heightened elements | After the first look test in MVP-4 |
| OD-08 | Costs and earthwork budget | Minimal casts; a daily earthwork budget | MVP-1 step 1.5 |
| OD-09 | Death penalty | No death in the MVP | After the MVP |
| OD-13 | Single-player time scale | 24 real minutes per game day; severe burns heal in 5–10 days | Before MVP-2 |
| OD-14 | Cutting below the terrain | Landscape hole plus runtime terrain tile | Spike S-1 |
| OD-15 | Drawing channel water | Custom ribbons | Spike S-2 |
| OD-16 | Cast animation source | Decide at MVP-3 | MVP-3 |

Decided: OD-01 (D-07), OD-02 (D-08), OD-07 (A-02), OD-10 (moot, D-18), OD-11 (D-12),
OD-12 (D-20: this §14 is the approved MVP plan).

### 16.1 Change control

A change that adds a system, raises the content cap or changes a rule states:
(1) the player problem, (2) the benefit, (3) the cost, (4) the systems affected,
(5) the acceptance test, (6) the milestone impact.

### 16.2 Definition of done

- Written purpose and bounded scope.
- The normal case and at least two failure cases are tested automatically.
- The result is readable to the player.
- It survives save and load if it is meant to persist.
- No known severe performance or stability problem in its test map.
- Reviewed, and committed only with the owner's approval.

---

## Appendix A — Test scenarios

| # | Scenario | Verifies |
|---|---|---|
| 1 | Douse dry ground, then try fire on it and on dry ground beside it: wet refuses with a reason, dry burns | `ER_WATER_WET`, `ER_FIRE_IGNITE` |
| 2 | Water a hot rock at or above the threshold: it cools and Steam fires; again below the threshold: refused, unchanged | `ER_WATER_COOL` (accepted on objects) |
| 3 | Cut a channel from the stream down to the basin: flow splits as specified, water appears, banks get wetter | `ER_EARTH_CHANNEL`, `WP_FLOW`, `WP_MOISTURE` |
| 4 | Cut a channel that runs uphill, or into bedrock, or over budget: each refused with its reason, nothing changes | Earthwork validation |
| 5 | Raise a berm across the new channel: flow returns to the original route; the channel dries over time | `ER_EARTH_BERM`, `WP_FLOW`, `WP_MOISTURE` |
| 6 | Build a loop of channels: the network settles in bounded steps and creates no water | Flow conservation and bounds |
| 7 | Ignite dry meadow upwind of a channel: fire spreads downwind, stops at the channel and at wet ground | `WP_FIRE_SPREAD` |
| 8 | Gust against a fire front: it turns; when the gust ends it resumes with the ambient wind | `ER_AIR_GUST`, `WP_WIND` |
| 9 | Rest three days after a burn and a watering: the burn reaches Pioneer, the meadow advances; repeat from the same save: identical result | Succession, catch-up, determinism |
| 10 | Save, quit, reload after all of the above: earthworks, water, moisture, stages and scars match | Persistence |
| 11 | Disable every visual effect and repeat 1, 3 and 7: identical state | Spectacle contract |
| 12 | Cancel a charged cast: nothing changes; the cast layer is clean | Application model |

---

## Appendix B — Glossary

| Term | Meaning |
|---|---|
| Cell | A ~4 m square of the valley holding the environmental state in §4.5 |
| Cast rule (`ER_*`) | An instant, deterministic state change caused by an element |
| World process (`WP_*`) | A process that changes state over time on its own |
| Earthwork | A compact record of a channel or berm, rebuilt into geometry |
| Soft-ground zone | An area where earthworks are possible; terrain there is rebuilt at runtime |
| Flow network | Nodes and links that decide where water goes and how much |
| Succession | Vegetation moving through stages over time |
| Scar | Lasting evidence of change, such as burn severity |
| Tier | How much simulation runs at a distance from the player |
| Catch-up | Running regional processes over skipped time in coarse steps |
| Cast layer | The transient cinematic performance of a cast (§2.2) |
| State layer | The persistent, authoritative world state (§2.2) |
| Hero cast | A full-fidelity cast-layer performance for one element action |
| Spike | A short technical experiment that answers one question with measurements |

### Closing design statement

> Wildwright succeeds when players stop asking "what can I build?" and start asking
> "what will this valley become if I change it?", and when changing it feels like
> power.
