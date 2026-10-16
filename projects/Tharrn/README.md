# Tharrn

A **sci-fi action-RPG survival shooter** on a vast alien archipelago, single player and
multiplayer, built in Unreal Engine 5.8.3: elite gunfeel, high-stakes survival, MetaHuman characters,
flagged PvP hotspots, deep RPG dungeons and quests. The owner's **only active game** (D-01); it replaced
Wildwright on 2026-10-15.

> **New chat (Claude Code or Codex)? Start here.** Read this file, then
> [GDD 0.1](docs/gdd/00-overview.md), the [task list](docs/tasks.md) and the
> [decision log](docs/decisions.md). Read the [engineering guide](docs/engineering-guide.md) before
> touching the Unreal project. The owner's direction document in `source/` is the design source (D-02).

## Reading order

| # | File | For | Time |
|---|---|---|---|
| 1 | this README | State, rules, next actions | 5 min |
| 2 | [docs/gdd/00-overview.md](docs/gdd/00-overview.md) | GDD 0.1: the direction in 13 modules with build notes | 20 min |
| 3 | [docs/tasks.md](docs/tasks.md) | Current work: the Prototype modules | 2 min |
| 4 | [docs/decisions.md](docs/decisions.md) | Decisions D-01 to D-17, open questions OQ-01 to OQ-13 | 5 min |
| 5 | [docs/engineering-guide.md](docs/engineering-guide.md) | Build, test, MCP, budget, conventions, gotchas | 15 min |
| — | [docs/session-log.md](docs/session-log.md) | Dated history | as needed |
| — | `source/` | The owner's direction document (2026-10-15) and the Nanite Landscape Build Protocol | — |
| — | `source/owner-package-2026-10-15/` | The owner's scaffold package (drafts of deliverables 2–10); [review](docs/reviews/owner-package-2026-10-15.md) | as needed |

## Where things stand (2026-10-15)

| Item | State |
|---|---|
| Design | GDD 0.1 drafted from the direction (deliverable 1 of 10); **owner review** |
| Unreal project | `D:\Tharrn\`, UE 5.8.3 C++, module `Tharrn`; Git with LFS, first commit fb20fca (design record: 29e9dfc) |
| Carried setup (D-03) | DLSS 4.5 and budget settings (D-11, D-12), Unreal MCP and `AllToolsets`, Game Animation Sample and Sci-Fi Complete Bundle (staged outside Git), pack staging, plugin check, budget measurement, terrain pipeline (not yet re-run), sky, capture subsystem, world-building helpers |
| Checks | Both targets build; plugin check PASS; the editor opens with DLSS supported and MCP answering; PIE on the template level runs with no errors |
| Wildwright | Design record and Workspace card deleted; `D:\Wildwright` (31 GB) awaits the owner's manual delete (Claude Code may not remove it) |
| Next | Prototype module P1, Foundation ([tasks](docs/tasks.md)) |

## Working agreement

**Do**
- One module at a time through Unreal MCP; polish and test each before the next (D-06), including the
  server-and-clients test (D-04).
- C++ for complex systems, Blueprints for simple ones, notes in both; data in CSV (D-07).
- World building under the protocol and within budget (D-10, D-11).
- Log decisions in [docs/decisions.md](docs/decisions.md); mark anything unverified. English for stored
  content.
- Ask the owner before every commit.

**Do not**
- Use Valley of the Ancient content, or designs and lore from earlier game projects (D-09).
- Redistribute Fab assets; no public repo or remote for `D:\Tharrn` (D-03).
- Use NoAI Fab assets to generate content (D-08).
- Put AI or LLM calls in runtime gameplay; keep AI and MCP plugins editor-only (D-13).
- Restart the owner's applications or end an agent session without permission.

## Ownership

| Area | Owner (agent) | Since | Notes |
|---|---|---|---|
| Everything (setup, GDD 0.1, Prototype) | Claude Code | 2026-10-15 | Codex works from written briefs |

## Next actions

| # | Action | Needs the owner? |
|---|---|---|
| 1 | Review GDD 0.1 and the open questions (scope OQ-07, tutorial creature OQ-12, travel OQ-13 first) | **Yes** |
| 2 | P1 Foundation: network test harness, CSV pipeline, test scaffolding, test range | No |
| 3 | Fab packs for armour, weapons, creatures, weapon animations (OQ-04) | **Yes** |
