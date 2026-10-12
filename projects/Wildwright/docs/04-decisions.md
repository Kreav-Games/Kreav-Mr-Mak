# Wildwright — Decision log

Keep this file current. When something is decided, move it from **Open** to
**Decided** with a date and the reason. Do not delete rejected options; record
why they were rejected so they do not re-enter unnoticed (GDD 15.2).

*Last updated: 2026-10-11.*

## Decided (by the owner)

| ID | Decision | Date | Notes |
|---|---|---|---|
| D-01 | ~~The game and its folder are called **Elemental**~~ *(superseded by D-06)* | 2026-10-11 | Replaced the working title *Worldweave*. "The Weave", "the Sundering" and "Wayfinder" remain working lore terms. |
| D-02 | Wildwright replaces **Tharrn** as the active game idea | 2026-10-11 | Owner was not happy with Tharrn's direction. Tharrn files stay in `projects/tharrn-game/` and are not modified. |
| D-03 | Target feel is **cinematic, action-fantasy spectacle** | 2026-10-11 | Reference: Valley of the Ancient (intensity, Niagara effects, fluid animation, the cast and levitate skill). |
| D-04 | Build with **Claude Code and Codex** together | 2026-10-11 | Codex is available through the owner's ChatGPT subscription. |
| D-05 | Project docs live in `projects/Wildwright/`; original PDFs are kept in `source/` | 2026-10-11 | Markdown in `docs/` is the working version. |
| D-06 | The game and its folder are called **Wildwright** | 2026-10-11 | Owner floated *Elementor* and delegated a better name if one existed. *Elementor* is Elementor Ltd.'s WordPress page builder (10M+ installs) and would dominate search. Also checked: Emberwake (existing PC game), Fourfold (existing studio name), Elemancer (several games). *Wildwright* returned no game, studio or product in two searches. This is a web search, not a trademark clearance (OD-05). **Tharn** (the owner's earlier game) was also considered and not chosen: it is welded to a different design (a persistent-world faction-war survival MMO with its own lore, "the Fall" and "the Hum"), it says nothing about this game, and the owner's own files spell it two ways (*Tharn* in the documents, *Tharrn* in folder names). It stays reserved for that original concept. Flip back at any time if brand continuity matters more than clarity. |

## Accepted in principle

| ID | Proposal | Status |
|---|---|---|
| A-01 | **Spectacle contract**: the cast is a cinematic *input*; the simulation is the *consequence* (GDD 2.2). | The owner wants the spectacle to work with the new design. The mechanism is accepted in principle and written into GDD 0.2 as CR-001. It is not yet validated by a prototype. |

## Open decisions

Recommendations are mine unless noted; none is binding until moved to **Decided**.

### OD-01 Engine version for the prototype
| Option | For | Against |
|---|---|---|
| **UE 5.4.4** *(recommended)* | Installed; opens Valley; the 5.4.4 build tool accepts the installed MSVC 14.43 (warning only); Valley reference works in the same engine | Older; newer features unavailable |
| UE 5.7.4 / 5.8.3 | Newer engine | MSVC 14.43 is banned; needs Visual Studio 2022 17.14.4+ (or VS 2026) before any C++ builds; one-way asset upgrades |

Newer engines open older assets, so starting on 5.4.4 does not lock the project
out of 5.8 later. **Resolve before M0.**

### OD-02 Cast-layer technology
| Option | For | Against |
|---|---|---|
| **GAS for casting only; world-cell state in a separate subsystem** *(recommended)* | Gives abilities, costs, cooldowns, tag blocking and Gameplay Cues; matches the pattern behind the feel the owner loves; both agents know it | Needs a small C++ module (attribute sets); more concepts to learn |
| Lightweight Blueprint-only (Gameplay Tags + Blueprint Interface + cue actors) | No C++, faster to start | Re-implements cooldown/cost/cancel logic; weaker fit if combat grows |

Either way the world-cell state must **not** live in GAS. **Resolve before M1.**

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
(existing PC game), *Fourfold* (existing studio), *Elemancer* (several games). *Tharn* (the owner's earlier game) found no conflict but was set aside; see D-06.

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

### OD-10 Asset licensing
License terms for Valley of the Ancient and its Megascans content are **unchecked**.
No asset is to be migrated into Wildwright until this is resolved. Patterns and
architecture are not assets.

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

## Inherited from GDD 0.1 (still in force, unvalidated)

Third-person camera for the prototype; single player; one valley; no runtime
LLM dependency for core gameplay; narrative cause of the Sundering kept partly
open; world scale decided after simulation and streaming benchmarks.
