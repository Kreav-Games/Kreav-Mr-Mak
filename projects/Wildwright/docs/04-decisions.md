# Wildwright — Decision log

Keep this file current. When something is decided, move it from **Open** to
**Decided** with a date and the reason. Do not delete rejected or superseded
entries; strike them through and say why, so old ideas do not re-enter unnoticed
(GDD 15.2).

*Last updated: 2026-10-13.*

## Decided (by the owner)

| ID | Decision | Date | Notes |
|---|---|---|---|
| D-01 | ~~The game and its folder are called **Elemental**~~ *(superseded by D-06)* | 2026-10-11 | Replaced the working title *Worldweave*. "The Weave", "the Sundering" and "Wayfinder" remain working lore terms. |
| D-02 | Wildwright is the **only active game project** | 2026-10-11, updated 2026-10-12 | It replaced the owner's earlier game idea. On 2026-10-12 the owner had everything related to that idea removed from the workspace; do not reintroduce it. |
| D-03 | Target feel is **cinematic, action-fantasy spectacle** | 2026-10-11 | The feel target stands. Its original reference project was dropped by D-18; Wildwright builds its own spectacle. |
| D-04 | Build with **Claude Code and Codex** together | 2026-10-11 | Codex is available through the owner's ChatGPT subscription. Roles refined by D-19. |
| D-05 | Project docs live in `projects/Wildwright/`; original source documents are kept in `source/` | 2026-10-11 | Markdown in `docs/` is the working version. `source/` also holds the Dynamic World Systems Concept v0.1 (2026-10-13). |
| D-06 | The game and its folder are called **Wildwright** | 2026-10-11 | Owner floated *Elementor* and delegated a better name if one existed. *Elementor* is Elementor Ltd.'s WordPress page builder (10M+ installs) and would dominate search. Also checked: Emberwake (existing PC game), Fourfold (existing studio name), Elemancer (several games). *Wildwright* returned no game, studio or product in two searches. This is a web search, not a trademark clearance (OD-05). |
| D-07 | The prototype engine is **UE 5.8.3** (`D:\UE_5.8`, changelist 58210709). Resolves OD-01. | 2026-10-11 | The owner chose this over the 5.4.4 recommendation. C++ needs MSVC 14.44.35211+ (VS 2022 17.14) or 14.50.35723+ (VS 2026); the machine has VS 2022 17.14.41 with `cl.exe` 14.44.35229. |
| D-08 | The cast layer uses **GAS for casting only**. World state, the rule resolver and the journal live outside GAS. Resolves OD-02. | 2026-10-11 | GAS provides abilities, costs, cooldowns, tag blocking and Gameplay Cues. Under GDD 0.4 "world state" means the environmental cells, earthworks, flow network and object state. |
| D-09 | The Unreal project lives at **`D:\Wildwright\`** as its own Git repository with LFS. `projects/Wildwright/` stays the design record. | 2026-10-11 | Keeps large binaries out of the Mr. Mak repo. D: has about 3.5 TB free; C: is low. |
| D-10 | **Fab assets marked NoAI** ("Allows usage with AI: No"): "Never use any Fab asset marked as NoAI to generate, train, fine-tune, or create new content, and only allow AI operations that read, classify, tag, or organize the original files without producing new derivative output." | 2026-10-12 | The owner's rule, taken from Copilot's summary of the NoAI terms; not checked against the Fab EULA text *(unverified)*. Applies to every NoAI Fab asset. |
| D-11 | ~~Valley of the Ancient assets may be migrated into Wildwright~~ *(superseded by D-18)* | 2026-10-12 | Withdrawn: no Valley content is used. The general Fab Standard License obligations still apply to **any** Fab asset the project uses: never redistribute it on its own or in extractable form, keep `D:\Wildwright` private, ship only cooked builds (game repo `AGENTS.md`). |
| D-12 | **Agent-built systems are C++ with data in CSV files** imported into data tables, and their assets come from editor-Python generators in `Tools/`. **Blueprints are for content the owner tunes**, with agent assistance. Resolves OD-11. | 2026-10-12 | Owner: "we can keep c++ and csv and blue prints i can do with assistance". Agents cannot edit Blueprint graphs or other binary assets; C++, CSV and scripts stay diffable, reviewable and testable. |
| D-13 | The first hero cast is **Fire** | 2026-10-12 | Still the choice. GDD 0.4 schedules the hero cast in the casting milestone (MVP-3), after the world systems it acts on exist. |
| D-14 | Hero cast controls: **hold left mouse to charge, release to cast, right mouse to cancel** | 2026-10-12 | Stands for aimed casts. Earth's path drawing (GDD 3.4) uses its own input, to be specified in MVP-3. |
| D-15 | ~~Cast animation comes from Valley's Echo animations, retargeted~~ *(superseded by D-18)* | 2026-10-12 | Withdrawn. The animation source is open again (OD-16). |
| D-16 | ~~Valley effects, materials and sounds are starting points for the Fire cast~~ *(superseded by D-17, then D-18)* | 2026-10-12 | Withdrawn. |
| D-17 | **Create Wildwright's own Niagara effects and VFX materials**, with a **manual owner guide** | 2026-10-12 | Owner: "we will just make our own niagra effects". Fresh UE 5.8 emitters and original procedural materials. The guide (`09-hero-cast-owner-guide.md`) is now an optional learning track until MVP-3. |
| D-18 | **Valley of the Ancient is dropped entirely.** No assets, animations, effects, tags, redirects, tools or documents from it. Wildwright learns general techniques from Epic's documentation and builds its own versions. | 2026-10-13 | Owner: "remove any of the valley stuff we tried to use as i think we are better off just looking at how things are done then making our own version thats better suited to WildWright". Removed: 406 imported packages (1.6 GB, uncommitted; sent to the Recycle Bin), the import tools, the Valley tag file, 406 package redirects, the `AudioModulation` plugin enabled only for them, the feel-reference document, the Fire hero-cast plan built on Valley starting points and the Valley FX diagnosis. Supersedes D-11, D-15, D-16; OD-10 is moot. The Valley project itself (`Documents\Unreal Projects\ValleyoftheAncient`) is the owner's and was not touched. |
| D-19 | **Claude Code leads the game design** (GDD, decision log, build order). | 2026-10-13 | Owner: "codex i feel messed about alot in the game design so i upgraded you so we can get higher quality work done". Recommendation (not yet confirmed): Codex works from written briefs on bounded tasks (research, tutorials, isolated implementation) and does not restructure the GDD. |
| D-20 | **The MVP plan is approved**: GDD 0.4 §14 (MVP definition, content cap, milestones MVP-0 to MVP-5, the MVP-1/MVP-2 build order and the technical proof). Resolves OD-12. | 2026-10-13 | Owner: "approve the plan, commit everything". Rough sizes in §14.3 remain estimates, revised after each milestone. |
| D-21 | **Single-player time scale: 1 game day = 60 real minutes; severe world damage heals in about 10 game days.** Resolves OD-13. | 2026-10-13 | Owner: "use 60 real minutes per game day, with severe world damage healing in 10 game days" (over the 24-minute recommendation). "Heals" means living cover and soil health return above their healthy thresholds without player help; the land may settle into a different stage or ecosystem (GDD 4.1). Player help shortens it. All rates are CSV data tuned to hit this target. |

## Accepted in principle

| ID | Proposal | Status |
|---|---|---|
| A-01 | **Spectacle contract**: the cast is a cinematic *input*; the simulation is the *consequence* (GDD 2.2). | Accepted 2026-10-11 as CR-001. Partly proven: actions 4–5 keep state in the resolver and presentation reads it; the cast layer itself is not built. |
| A-02 | **Dynamic World Systems direction** (owner's Concept v0.1, 2026-10-13): scars, not resets; change classes; tiered simulation; authoritative environmental cells; Landscape for permanent geography plus controlled, material-limited earthworks; spline-based procedural earthworks; a custom flow graph that drives visible water; cell-based fire; PCG vegetation with recovery stages; physics only while active; no voxel terrain or fluid simulation; prove the world-change loop in one small technical test first. | Supplied by the owner and integrated as the backbone of **GDD 0.4** (CR-003). Resolves OD-07. Specific choices it left open are OD-12 (approved as D-20) to OD-16. |

## Resolved open decisions (kept for history)

### OD-01 Engine version → D-07
UE 5.4.4 was recommended (installed, accepted the old compiler); 5.7.4 not chosen;
**UE 5.8.3 chosen** by the owner on 2026-10-11.

### OD-02 Cast-layer technology → D-08
**GAS for casting only** (recommended, chosen 2026-10-11) over a Blueprint-only
tags-and-interfaces system, which would have re-implemented cooldown, cost and
cancel logic.

### OD-07 Terrain approach → A-02
GDD 0.2–0.3 recommended authored terrain states and discrete earthworks at
authored sockets. Superseded on 2026-10-13 by the owner's concept: Landscape for
permanent geography and spline-based procedural earthworks on deformable
materials; voxel terrain only if unrestricted digging ever becomes a pillar. How
a cut is made below the terrain surface is OD-14.

### OD-10 Asset licensing → D-10, D-11 → moot under D-18
The Valley of the Ancient Fab listing showed Standard License and "Allows usage
with AI: No" (owner's screenshot, 2026-10-11). D-10 (NoAI rule) still applies to
any Fab asset; D-11 was withdrawn when Valley was dropped.

### OD-12 MVP definition and build order → D-20
GDD 0.4 §14: one ~400 m valley, single player, four element actions acting on
terrain, water, vegetation and objects; world systems first (MVP-1 world-change
proof, MVP-2 living ground), then casting (MVP-3), the demo valley (MVP-4) and
polish (MVP-5); survival, crafting, construction beyond earthworks, creatures,
combat and multiplayer after the MVP. **Approved by the owner 2026-10-13.**

### OD-13 Single-player time scale → D-21
Recommended 24 real minutes per game day with severe burns healing in 5–10 game
days. **The owner chose 60 real minutes per game day and about 10 game days for
severe damage** (2026-10-13).

### OD-11 How agent-built systems are implemented → D-12
C++ plus CSV-sourced data tables for agent-built systems; Blueprints for content
the owner tunes. Accepted 2026-10-12.

## Open decisions

Recommendations are Claude Code's unless noted; none is binding until moved to
**Decided**.

### OD-14 How a channel is cut below the terrain surface — *spike decides*
UE 5.8 cannot edit Landscape at runtime in a shipped game (`LandscapePatch` is
editor-time). **Recommendation:** soft-ground zones are holes in the Landscape
filled by runtime terrain tiles (Geometry Script, production status in 5.8) that
are rebuilt when an earthwork changes them; berms can sit on top as meshes. MVP-1
spike S1 proves or rejects this against a fallback (all-mesh terrain for the soft
zone). The agent decides on measured results; the owner reviews the look.

### OD-15 How water in player-made channels is drawn — *spike decides*
The Water plugin is **Experimental** in 5.8. **Recommendation:** custom water
ribbon meshes along flow links for player channels, driven by the flow graph; the
Water plugin only for authored lakes and rivers if it holds up. MVP-1 spike S2
decides.

### OD-16 Cast animation source — *decide at MVP-3*
D-15 was withdrawn. Options: owner-made animations, Epic's free animation content
(check each Fab listing's NoAI flag, D-10), or licensed libraries. Casts work
without animation until then.

### OD-03 Combat role
No player-vs-creature combat in the MVP. Revisit after creatures exist
(post-MVP).

### OD-04 Element delivery
Partly settled: aimed casts use hold-to-charge, release, right-mouse cancel
(D-14); Earth draws a path over the ground (GDD 3.4). Final feel is tuned after
MVP-3 play-tests.

### OD-05 Title availability
"Wildwright" is a working title. A quick web search (2026-10-11) found no game,
studio or product with that name. That is **not** a trademark clearance. Before
public branding, search trademark registries, Steam/itch/console storefronts,
domains and social handles. Rejected names: *Elementor*, *Elemental*,
*Emberwake*, *Fourfold*, *Elemancer*.

### OD-06 Art direction
Candidates: grounded naturalism, dark fantasy, post-apocalyptic ecology, or
another distinct identity. Proposed in GDD 5.1: grounded, tactile land with
heightened elemental light and motion. Resolve after the first look test in MVP-4.

### OD-08 Costs and cooldowns
Minimal at first; tune only if spam undermines decisions. Earthworks need a
budget so a player cannot reshape the whole valley at once (GDD 4.7).

### OD-09 Death penalty
The MVP has no death. Revisit when hazards or survival arrive (post-MVP).

## Change requests

### CR-001 Add cinematic spectacle (cast layer) to the design
*Raised 2026-10-11 by D-03. Status: applied (GDD 2.2, 5.3); the cast layer is
scheduled in MVP-3.*

| Field | Entry |
|---|---|
| 1. Player problem solved | A purely systemic game risks feeling mechanical; the owner wants the intensity and power fantasy of an action-fantasy hero. |
| 2. Expected benefit | Casting feels powerful and memorable, and strengthens the "I changed the world" payoff. |
| 3. Implementation cost | High if unconstrained: a production-grade hero cast in an Epic sample used about 150 named assets. Mitigated by one hero cast first and a shared cast-profile structure. |
| 4. Systems affected | Cast layer (animation, camera mode, targeting preview, Niagara/audio/haptic cues); cast profiles; UI/accessibility; performance budgets. |
| 5. Acceptance test | The hero cast passes the spectacle contract: Appendix A tests for VFX-off parity and clean cancel, and play-testers can say what the cast did. |
| 6. Milestone impact | Hero cast is part of MVP-3. |

### CR-002 Clarify the first-playable build direction and project presentation
*Raised 2026-10-12 (Codex). Status: **superseded by CR-003** on 2026-10-13.*
Its proposals (a 20–30 minute spring-route session gated by a hot pass and burnable
brush, two plant archetypes, six recipes, authored flow sockets, eight build
packets) were written for discrete targets on box geometry. GDD 0.4 replaces them
with a terrain-based world model and MVP plan. The cover concept and Workspace
refresh from CR-002 remain.

### CR-003 Rebase the design on the Dynamic World Systems direction
*Raised 2026-10-13 by the owner's concept document (A-02) and request: "we need to
really get a good grip on this game and its design … build this right, system by
system so the goal for a true demo or mvp is realistic". Status: **applied to GDD
0.4; MVP plan approved (D-20).***

| Field | Entry |
|---|---|
| 1. Player problem solved | Elements acted on isolated objects in a box world, so "shaping a living landscape" (the core fantasy) could not happen. Persistence and recovery had no model. |
| 2. Expected benefit | Elements shape terrain, water, vegetation and air; the world keeps scars and recovers on its own terms; the plan proves the hardest technology first, so the MVP is realistic. |
| 3. Implementation cost | New state systems (cells, earthworks, flow graph, fire, succession, time), two technical spikes, a terrain-based proof scene. Existing element selection, targeting, resolver and object rules are reused for object targets. |
| 4. Systems affected | GDD 1–4, 12–16 and Appendix A rewritten; rules: `ER_AIR_DISPERSE` becomes `ER_AIR_GUST`, `ER_EARTH_BARRIER` becomes `ER_EARTH_BERM`, `ER_EARTH_CHANNEL` added, `ER_WATER_SOIL` becomes world process `WP_GROWTH`; milestones M1–M6 retired in favour of MVP-0 to MVP-5; the box valley greybox retired; `L_TestRange` kept as the object-rules regression lab. |
| 5. Acceptance test | GDD 0.4 §14.5: the concept's nine-step technical proof passes in `L_WorldProof`, with measured cost. |
| 6. Milestone impact | Replaces M1–M6 with MVP-1 to MVP-5 (GDD 14.3). The six-rule cap is kept. |

## Validation notes

*2026-10-12 — Action 5 accepted.* The owner reported that the `L_TestRange`
play-test results "seem to match" for wet, ignite and cool. These object rules
remain valid under GDD 0.4.

## Inherited from GDD 0.1 (still in force)

Third-person camera for the prototype; single player for the MVP; one valley; no
runtime LLM dependency for gameplay; the cause of the Sundering kept partly open.
