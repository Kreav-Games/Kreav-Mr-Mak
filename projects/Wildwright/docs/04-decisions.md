# Wildwright — Decision log

Keep this file current. When something is decided, move it from **Open** to
**Decided** with a date and the reason. Do not delete rejected options; record
why they were rejected so they do not re-enter unnoticed (GDD 15.2).

*Last updated: 2026-10-11.*

## Decided (by the owner)

| ID | Decision | Date | Notes |
|---|---|---|---|
| D-01 | ~~The game and its folder are called **Elemental**~~ *(superseded by D-06)* | 2026-10-11 | Replaced the working title *Worldweave*. "The Weave", "the Sundering" and "Wayfinder" remain working lore terms. |
| D-02 | Wildwright is the **only active game project** | 2026-10-11, updated 2026-10-12 | It replaced the owner's earlier game idea. On 2026-10-12 the owner had everything related to that idea removed from the workspace; do not reintroduce it. |
| D-03 | Target feel is **cinematic, action-fantasy spectacle** | 2026-10-11 | Reference: Valley of the Ancient (intensity, Niagara effects, fluid animation, the cast and levitate skill). |
| D-04 | Build with **Claude Code and Codex** together | 2026-10-11 | Codex is available through the owner's ChatGPT subscription. |
| D-05 | Project docs live in `projects/Wildwright/`; original PDFs are kept in `source/` | 2026-10-11 | Markdown in `docs/` is the working version. |
| D-06 | The game and its folder are called **Wildwright** | 2026-10-11 | Owner floated *Elementor* and delegated a better name if one existed. *Elementor* is Elementor Ltd.'s WordPress page builder (10M+ installs) and would dominate search. Also checked: Emberwake (existing PC game), Fourfold (existing studio name), Elemancer (several games). *Wildwright* returned no game, studio or product in two searches. This is a web search, not a trademark clearance (OD-05). |
| D-07 | The prototype engine is **UE 5.8.3** (`D:\UE_5.8`, changelist 58210709). Resolves OD-01. | 2026-10-11 | The owner chose this over the 5.4.4 recommendation. **Blocks every C++ build until Visual Studio is updated:** 5.8 bans MSVC 14.40–14.43 (`Engine/Config/Windows/Windows_SDK.json`). The installed compiler is 14.43.34808 (VS 2022 17.13.3). It needs VS 2022 17.14 with MSVC 14.44.35211 or later, or VS 2026 with 14.50.35723 or later. The Valley reference stays on 5.4.4. Any asset migrated from it after OD-10 is upgraded one-way when saved in 5.8. C++ patterns adapted from Valley may need API changes *(unverified)*. |
| D-08 | The cast layer uses **GAS for casting only**. World-cell state, the rule resolver and the journal live outside GAS. Resolves OD-02. | 2026-10-11 | The owner took the recommendation. GAS provides abilities, costs, cooldowns, tag blocking and Gameplay Cues, the same pattern as Valley's `GA_LightDart`. It needs a small C++ module (attribute sets) by M1, a stated exception to Blueprint-first (GDD 12.1). |
| D-09 | The Unreal project lives at **`D:\Wildwright\`** as its own Git repository with LFS. `projects/Wildwright/` stays the design record. | 2026-10-11 | It had been proposed in the README. Keeping the project out of the Mr. Mak repo keeps large binaries out of its history. D: has about 3.5 TB free; C: is low. |
| D-10 | **Fab assets marked NoAI** ("Allows usage with AI: No"): "Never use any Fab asset marked as NoAI to generate, train, fine-tune, or create new content, and only allow AI operations that read, classify, tag, or organize the original files without producing new derivative output." | 2026-10-12 | The owner's rule, taken from Copilot's summary of the NoAI terms. Not yet checked against the Fab EULA text *(unverified)*. Applies to every NoAI Fab asset, including Valley of the Ancient (OD-10). Allowed: agents reading or inspecting the files and writing notes about how they are built. Not allowed: feeding them, or renders and captures of them, to image, video, 3D, audio or texture generation. |
| D-11 | **Valley of the Ancient assets may be migrated into Wildwright**, modified and shipped inside the game under Fab's Standard License. Never redistribute them on their own or in an extractable form. Resolves OD-10 with D-10. | 2026-10-12 | Owner-supplied summary of the Standard License (Fab EULA 4(c)): commercial use, modification and distribution of a game that incorporates the content are allowed; resale, giveaway, inclusion in an extractable tool or template, and player extraction are not. **Consequences:** keep `D:\Wildwright` private (collaborators only), because a public repo would redistribute raw assets; ship only cooked, packaged builds and never raw `.uasset` files; consider pak encryption at the packaging milestone (M6); D-10 still applies. Migrate selected pieces only (feel reference, section 4), never the level, golems or bulk Megascans. |
| D-12 | **Agent-built systems are C++ with data in CSV files** imported into data tables, and their assets come from editor-Python generators in `Tools/`. **Blueprints are for content the owner tunes**, with agent assistance. Resolves OD-11. | 2026-10-12 | Owner: "we can keep c++ and csv and blue prints i can do with assistance". Agents cannot edit Blueprint graphs or other binary assets; C++, CSV and scripts stay diffable, reviewable and testable by both Claude Code and Codex. For Blueprint work, agents give exact steps and use editor Python where it can do the job. Amends GDD 12.1. |
| D-13 | The first hero cast (next action 6) is **Fire** | 2026-10-12 | The owner chose Fire over the Water recommendation. Fire shows `ER_FIRE_IGNITE`, its refusals (too wet, already burning or burnt, no effect on other targets) and a state-driven aftermath (burning, then smouldering). Plan: [08-hero-cast-plan.md](08-hero-cast-plan.md). A second hero cast may follow by M6 (GDD 14.1). |
| D-14 | Hero cast controls: **hold left mouse to charge, release to cast, right mouse to cancel** | 2026-10-12 | The owner approved the recommended charge → release delivery for the hero cast. OD-04 stays open for the final delivery model after M1 play-tests. |
| D-15 | Cast animation comes from **Valley's Echo LightDart animations, retargeted** to `SK_Mannequin` | 2026-10-12 | Echo has her own skeleton (`Echo_Skeleton`), so the four LightDart animations (charge, charge loop, release, cancel) are retargeted with an auto-generated IK retargeter and made into montages by the owner (owner guide, parts 2–3). Allowed by D-11. |
| D-16 | **Valley effects, materials and sounds are starting points** for the Fire cast, as needed | 2026-10-12 | Selected LightDart and campfire Niagara assets, their materials, a smoke sprite sheet, heat distortion and four sounds are copied into `/Game/Wildwright/Imported/Valley/` and recoloured or adapted (plan, "Starting points"). D-10 still applies: never used with generative AI. Epic's Starter Content fire and smoke flipbooks are copied in too. |

## Accepted in principle

| ID | Proposal | Status |
|---|---|---|
| A-01 | **Spectacle contract**: the cast is a cinematic *input*; the simulation is the *consequence* (GDD 2.2). | The owner wants the spectacle to work with the new design. The mechanism is accepted in principle and written into GDD 0.2 as CR-001. It is not yet validated by a prototype. |

## Resolved open decisions (kept for history)

### OD-01 Engine version for the prototype → D-07
| Option | For | Against |
|---|---|---|
| UE 5.4.4 *(was recommended; not chosen)* | Installed; opens Valley; the 5.4.4 build tool accepts the installed MSVC 14.43 (warning only); Valley reference works in the same engine | Older; newer features unavailable |
| UE 5.7.4 *(not chosen)* | Newer engine | MSVC 14.43 is banned; needs a Visual Studio update; one-way asset upgrades |
| **UE 5.8.3** *(chosen)* | Newest installed engine | MSVC 14.43 is banned; needs VS 2022 17.14 (MSVC 14.44.35211+) or VS 2026 (14.50.35723+) before any C++ builds; one-way asset upgrades |

**Decided 2026-10-11 by the owner: UE 5.8.3.** The owner gave no reason for
choosing it over the recommendation.

### OD-02 Cast-layer technology → D-08
| Option | For | Against |
|---|---|---|
| **GAS for casting only; world-cell state in a separate subsystem** *(recommended, chosen)* | Gives abilities, costs, cooldowns, tag blocking and Gameplay Cues; matches the pattern behind the feel the owner loves; both agents know it | Needs a small C++ module (attribute sets); more concepts to learn |
| Lightweight Blueprint-only (Gameplay Tags + Blueprint Interface + cue actors) *(not chosen)* | No C++, faster to start | Re-implements cooldown/cost/cancel logic; weaker fit if combat grows |

**Decided 2026-10-11 by the owner: GAS for casting only.** The world-cell state
must **not** live in GAS.

### OD-10 Asset licensing → D-10, D-11
License source: the [Fab listing](https://www.fab.com/listings/0c19880e-21bd-42ba-8287-1caccc3951b1)
for Valley of the Ancient. The owner's screenshot (2026-10-11) shows Epic Games,
free, **Standard License**, Unreal Engine format, **"Allows usage with AI: No"**.
Epic's Fab docs define the NoAI tag as "must not be used for generative AI data
collection". Agents get HTTP 403 from Fab, so the license terms came to the log
through the owner. The 2026-10-12 summary quotes the Standard License (Fab EULA
section 4(c)): "Use the assets commercially or privately", "Modify and adjust the
assets in order to incorporate them into your Projects", "Use the assets with any
compatible tools", and "You may Distribute a Project that incorporates Content to
end users, including software applications such as video games." Forbidden:
redistributing the asset on its own (resale, giveaway, or inclusion in a tool or
template where others can extract it), letting players extract it, and using NoAI
content in training data, as input to generative models, or to develop generative
AI systems. No agent has read the EULA text itself *(quotes unverified)*.

**Resolved 2026-10-12 by the owner:** AI use by D-10, migration and shipping by D-11.

### OD-11 How agent-built systems are implemented → D-12
*Raised 2026-10-12 during next action 4.* GDD 12.1 said Blueprint-first, but agents
cannot edit Blueprint graphs, so the element system was written in C++ with CSV
data. Recommendation: C++ plus CSV-sourced data tables for agent-built systems;
Blueprint for content the owner tunes. **Accepted by the owner 2026-10-12**, with
Blueprint work done by the owner with agent assistance.

## Open decisions

Recommendations are mine unless noted; none is binding until moved to **Decided**.

### OD-03 Combat role under the action-fantasy direction
GDD 0.1 says the player is "not simply its strongest fighter". The new direction
raises the question of how much combat exists.
Recommendation: no player-vs-creature combat in M1–M2. In M3 creatures respond to
the same element rules (fire as a temporary barrier, etc.). Revisit after M3.
**Owner input welcome.**

### OD-04 Element delivery
Aimed cast with charge → release → impact (matches the Valley feel) vs placed
field vs tool-like ability. Recommendation: aimed cast as the M1 default, with the
element API kept independent of input (GDD 3.3). Resolve after M1 playtests.

### OD-05 Title availability
"Wildwright" is a working title. A quick web search (2026-10-11) found no game, studio or
product with that name. That is **not** a trademark clearance. Before any public
branding, search trademark registries, Steam/itch/console storefronts, domains and
social handles. Names that were checked and rejected: *Elementor* (WordPress
page builder), *Elemental* (Pixar film, Stardock strategy series), *Emberwake*
(existing PC game), *Fourfold* (existing studio), *Elemancer* (several games).

### OD-06 Art direction
Candidates from the concept document: grounded naturalism, dark fantasy,
post-apocalyptic ecology, or another distinct identity. Valley of the Ancient is
the anchor for tone and spectacle. Resolve after M1 look tests.

### OD-07 Terrain approach
Authored terrain states and discrete earthworks (GDD 4.6) vs selective deformation.
Recommendation: authored states and earthworks. Revisit after M2.

### OD-08 Costs and cooldowns
Minimal at first; tune only if spam undermines decisions. Resolve after the core
rules are fun.

### OD-09 Death penalty
Prototype default: safe respawn, journal retained. Whether carried resources are
lost stays open until the survival loop is tested.

## Change requests

### CR-001 Add cinematic spectacle (cast layer) to the design
*Raised 2026-10-11 by the owner's direction D-03. Status: **applied to GDD 0.2,
pending prototype validation.***

| Field | Entry |
|---|---|
| 1. Player problem solved | A purely systemic game risks feeling mechanical; the owner wants the intensity and power fantasy of an action-fantasy hero. |
| 2. Expected benefit | Casting feels powerful and memorable, and strengthens the "I changed the world" payoff. |
| 3. Implementation cost | High if unconstrained (Valley's single LightDart ability is about 147 named assets). Mitigated by capping to one hero cast in M1 and a shared cast-profile structure. |
| 4. Systems affected | New cast layer (animation, camera mode, targeting preview, Niagara/audio/haptic cues); `ElementDefinition` gains a cast profile; UI/accessibility (camera motion); performance budgets. |
| 5. Acceptance test | One hero cast passes the spectacle contract: Appendix A tests 6 (VFX disabled, same state) and 9 (cancel is clean), and playtesters can say what the cast did. |
| 6. Milestone impact | M1 gains a hero-cast deliverable; M2–M6 unchanged. No new milestone. |

### CR-002 Clarify the first-playable build direction and project presentation

*Raised 2026-10-12 by the owner's request to expand the GDD, improve the Workspace
and design a game cover. Status: **applied to GDD 0.3 as proposed build detail;
new gameplay choices and cover art await review.*** Locked owner decisions remain
in force. This is authoring work, not a claim that the new gameplay is implemented.

| Field | Entry |
|---|---|
| 1. Player problem solved | The broad premise needs a concrete first session, useful interventions and clear consequences; builders need bounded tasks and visible proof of completion. |
| 2. Expected benefit | A spring-route session connects experiments, route choice, ecology, construction and knowledge into one playable arc; the Workspace makes current progress and next work easier to find. |
| 3. Implementation cost | Documentation and presentation delivered now. Future density, suitability, finite flow, route integration and persistence require small briefs, tests and owner play-tests; no new runtime system was built in this refresh. |
| 4. Systems affected | GDD rule contracts, valley/session design, ecology/journal/save requirements, milestone packets; Workspace hub generator/styles and an original cover concept. Existing action 5 behaviour remains unchanged. |
| 5. Acceptance test | GDD clearly labels accepted versus proposed work and preserves the content cap; every build packet has dependencies and an exit check; Workspace tabs, media preview/downloads and source links work at wide/narrow sizes; owner reviews new direction and cover. |
| 6. Milestone impact | M0–M6 and the six-rule cap stay intact. M1 closes with six effects and one hero cast. First-session detail links M2–M5 deliverables without adding regions, multiplayer, combat, recipes beyond the existing cap or additional creatures. |

**Choices still proposed:** 20–30 minute pacing, four basic actions available in the
first-playable test, the two plant archetypes, six recipe selection, density/soil/flow
details, route integration, journal confirmation policy and frozen simulation while
the application is closed. Record owner feedback before treating these as resolved
OD-03/04/06/08/09 decisions. The cover's person and costume are not a character approval.

## Validation notes

*2026-10-12 — Action 5 accepted.* After the four automated tests and greybox
verifier passed, the owner reported that the supplied `L_TestRange` play-test
results “seems to match”. Recorded owner acceptance of the first three rules;
M1 remains in progress, with the first hero cast next. This records validation,
with no new design, balance or scope decision. Changes remain uncommitted.

## Inherited from GDD 0.1 (still in force, unvalidated)

Third-person camera for the prototype; single player; one valley; no runtime
LLM dependency for core gameplay; narrative cause of the Sundering kept partly
open; world scale decided after simulation and streaming benchmarks.
