# Wildwright

A third-person **elemental ecosystem sandbox with cinematic action-fantasy
spectacle**, built in Unreal Engine. The player learns fire, water, earth and air
and uses them on a living valley that remembers what was done to it.

> **If you are a new chat (Claude Code or Codex): read this file completely, then
> follow the reading order below. Do not start building before you have read
> `docs/02-gdd.md` sections 1–3 and `docs/04-decisions.md`.**

*Written 2026-10-11 from a long setup-and-design session with the owner.*

## Reading order

| # | File | Read it for | Time |
|---|---|---|---|
| 1 | this README | Context, decisions, environment, rules | 5 min |
| 2 | [docs/01-vision.md](docs/01-vision.md) | The idea and the two-layer principle | 2 min |
| 3 | [docs/02-gdd.md](docs/02-gdd.md) | **Authoritative design and implementation spec** | 30 min |
| 4 | [docs/04-decisions.md](docs/04-decisions.md) | What is decided, accepted, open | 5 min |
| 5 | [docs/03-feel-reference-valley-of-the-ancient.md](docs/03-feel-reference-valley-of-the-ancient.md) | How the target "feel" is built; reuse map; traps | 10 min |
| — | `source/` | Original PDFs (Concept v1.1, GDD v0.1). Read-only history. | — |

## What this is, in five lines

1. Fire, water, earth, air act on **tagged targets** through deterministic,
   data-driven rules (`ER_*`).
2. Every cast has a **cast layer** (cinematic, transient, cosmetic) and a
   **state layer** (persistent, readable, authoritative). The cast layer never
   decides state. (GDD 2.2)
3. The world stores sparse **ecological memory** per region and responds.
4. Knowledge, recorded in a **field journal**, is the main progression.
5. First playable: one valley, four elements, six rules, two plant types, one or
   two creatures. Not open world, not a combat game.

## Where things stand

| Item | State |
|---|---|
| Design | GDD 0.2 written (merged from Concept v1.1 + GDD 0.1) |
| Unreal project for Wildwright | **Does not exist yet** |
| Code / assets | None |
| Git | These files are untracked inside the Mr. Mak repo; no game repository yet |
| Playtests | None |

## Decisions

Full detail and reasoning: [docs/04-decisions.md](docs/04-decisions.md).

**Decided by the owner**
- Name: **Wildwright** (game and folder). Replaced *Worldweave*, then *Elemental*, on 2026-10-11 after a name check (D-06).
- **Supersedes Tharrn** as the active idea. Leave `projects/tharrn-game/` alone.
- Target feel: **cinematic, action-fantasy spectacle** (from Valley of the Ancient).
- Built with **Claude Code and Codex** together.

**Accepted in principle:** the spectacle contract: the cast is a cinematic input,
the simulation is the consequence (GDD 2.2, CR-001). Not yet prototyped.

**Open (need an answer before building, recommendations in the log)**

| ID | Question | Recommendation |
|---|---|---|
| OD-01 | Engine version | UE 5.4.4 |
| OD-02 | Cast-layer technology | GAS for casting only; world state separate |
| OD-03 | How much combat | None in M1–M2 |
| OD-04 | Element delivery | Aimed cast, charge → release |
| OD-05 | Title availability | Only a quick web check was done; run a real trademark and storefront search before public branding |
| OD-10 | Valley asset licensing | Unchecked; migrate nothing until resolved |

If the owner has not answered OD-01 or OD-02 when you start, **ask once, state the
recommendation, and proceed with it only if told to.**

## Environment (verified 2026-10-11)

| Item | Value |
|---|---|
| OS | Windows 11 |
| Unreal Engine 5.4.4 | `D:\UE_5.4` (BuildId 33043543) |
| Unreal Engine 5.7.4 / 5.8.3 | `D:\UE_5.7`, `D:\UE_5.8` |
| Visual Studio | 2022 Community 17.13, MSVC **14.43.34808** |
| MSVC vs engines | 5.4.4 accepts 14.43 (warning only). **5.7 and 5.8 ban it**; they need VS 2022 17.14.4+ (or VS 2026) |
| Registry engine entries | Stale for 5.4 (`C:\Program Files\Epic Games\UE_5.4` does not exist). **Launch `UnrealEditor.exe` directly; do not double-click a `.uproject`** |
| Free disk | D: about 3.5 TB; **C: low (about 40 GB)**. Put the Wildwright UE project on D: |
| Codex CLI | 0.162.1, signed in with ChatGPT |
| Mr. Mak app | `D:\Mr. Mak Workspace`. It reads the installed-agent list once at startup, so **restart it if Codex is not offered in the new-chat picker** |
| Unreal editor MCP | **Not connected** in earlier sessions. Do not assume you can drive the editor live |
| Higgsfield CLI | **Blocked**: Windows Defender quarantined its binary (`Trojan:Win32/Bearfoos.A!ml`, unresolved). Do not add Defender exclusions without the owner's decision |

**Valley of the Ancient** (the feel reference) is at
`%USERPROFILE%\Documents\Unreal Projects\ValleyoftheAncient`, UE 5.4.4. Open it
with the command in the feel-reference doc. It is a **read-only reference lab**.

## Working agreement

**Do**
- Work **one small system at a time**, behind a test map, with an acceptance check
  (GDD 12.1, 15.2, 16.2).
- Keep rules **deterministic and data-driven** (data assets / data tables).
- Keep the **cast layer separate from state** (GDD 2.2). VFX are never the source
  of truth.
- Propose exact steps, C++, editor Python, data tables and tests. A human or the
  editor produces `.uasset` files; **agents cannot hand-edit binary assets**.
- Log decisions in `docs/04-decisions.md`. Use the change-control fields (GDD 16.1)
  for anything that adds a system, raises the content cap or changes a rule.
- Mark anything you did not verify as *(unverified)*.
- Keep content in English (repo rule).

**Do not**
- Build Wildwright inside the Valley project, or port Valley to 5.7/5.8 to "start".
- Migrate any Valley/Megascans asset before OD-10 is resolved.
- Expand scope beyond GDD 14.1 without a change request.
- Make AI/LLM calls part of runtime gameplay.
- Restart the owner's applications or end an active agent session to apply a
  change; prepare it and ask first (repo rule).
- Commit `Saved/`, `Intermediate/`, `DerivedDataCache/`, `Binaries/`, `.env`,
  logins or tokens.
- Modify `source/`, `projects/tharrn-game/` or the Valley project in place.

## Ownership

Two agents will work in the same folder. To avoid collisions:

- One agent per file or area at a time. **Claim an area in the table below before
  editing it**; release it when you stop.
- `docs/02-gdd.md` is authoritative. Do not fork it; edit it and note the change
  in its "What changed" table and in the decisions log.

| Area | Owner (agent) | Since | Notes |
|---|---|---|---|
| *(nothing claimed)* | | | |

## Next actions

Per GDD 16.3. Items 1–3 unblock everything else.

| # | Action | Needs the owner? | Output |
|---|---|---|---|
| 1 | Resolve OD-01 and OD-02 | **Yes** | Entry in `04-decisions.md` |
| 2 | Create the clean UE project on D: and a Git baseline (`.gitignore`, LFS) | Confirm location | Versioned project that opens |
| 3 | Greybox valley and test range | No | Small map with target objects |
| 4 | Element selection and target interface | No | Select and apply one element to one target |
| 5 | First three `ER_*` rules | No | Deterministic, visible outcomes |
| 6 | First hero cast (water or fire) | Review look | Passes the spectacle contract |
| 7 | World-state debug overlay | No | Inspect variables and rule decisions |

**Proposed project location** (not decided): `D:\Wildwright\` for the Unreal
project, keeping this folder as the design record.

## Useful repo skills

| Skill | Path | Use |
|---|---|---|
| plan | `.agents/skills/plan/SKILL.md` | Turn a milestone into deliverables with checks |
| feature-handoff | `.agents/skills/feature-handoff/SKILL.md` | Hand work between Claude and Codex |
| workspace-authoring | `.agents/skills/workspace-authoring/SKILL.md` | If a deliverable should become a Workspace card |
| image-reference-workflow | `.agents/skills/image-reference-workflow/SKILL.md` | Concept art exploration |
| fal-ai-generation | `.agents/skills/fal-ai-generation/SKILL.md` | Image/video/3D generation via fal |
| higgsfield-workflow | `.agents/skills/higgsfield-workflow/SKILL.md` | Higgsfield (currently blocked, see above) |

## Handoff checklist (for the end of any session)

Before ending a session, update:

1. the "Where things stand" table above;
2. the decisions log if anything was decided;
3. the ownership table (release your claim);
4. a one-paragraph note of what was done, what was verified, and what is next,
   at the bottom of this file under "Session notes".

## Session notes

*2026-10-11.* Setup session. Installed and signed in Codex; got Valley of the
Ancient running in UE 5.4.4 (fixed a wrong engine association and restored
missing `__ExternalActors__` content from the launcher vault); analyzed how the
Valley cast and levitate feel is built; merged and corrected the Worldweave
documents into this folder. **Verified:** Valley loads and the level is visible in
the 5.4.4 editor (owner-confirmed); 5.4.4 build rules compile against the
installed toolchain. **Not verified:** how the Valley graphs behave at runtime;
any 5.8 port; licensing; Higgsfield generation.
