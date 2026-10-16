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
| 4 | [docs/decisions.md](docs/decisions.md) | Decisions D-01 to D-21, open questions OQ-01 to OQ-14 | 5 min |
| 5 | [docs/engineering-guide.md](docs/engineering-guide.md) | Build, test, MCP, budget, conventions, gotchas | 15 min |
| — | [docs/scifi-bundle.md](docs/scifi-bundle.md) | The Sci-Fi Complete Bundle's guides, the go-to reference for world building (D-20) | before world work |
| — | [docs/easy-game-ui.md](docs/easy-game-ui.md) | Easy Game UI Ultimate, for menus and the HUD (D-21) | before UI work |
| — | [docs/deliverables/](docs/deliverables/) | The direction's deliverables written so far: 3 (PvP flagging state), 9 (creature behaviour), 10 (QA matrix), 8 (placeholder HUD icons); proposals 5 (creatures), 6 (dungeon templates) and 7 (weapons, attachments) | as needed |
| — | [docs/session-log.md](docs/session-log.md) | Dated history | as needed |
| — | **Tharrn Wiki**, the pinned Workspace card (`workspace/2026-10-15_tharrn-wiki/`) | The game for readers: world, zone map, bestiary, combat, survival, progression, PvP, characters, development | 15 min |
| — | `source/` | The owner's direction document (2026-10-15) | — |
| — | `source/owner-package-2026-10-15/` | The owner's scaffold package (drafts of deliverables 2–10); [review](docs/reviews/owner-package-2026-10-15.md) | as needed |

## Where things stand (2026-10-16)

| Item | State |
|---|---|
| Design | GDD 0.1 drafted from the direction (deliverable 1 of 10); **owner review** |
| Unreal project | `D:\Tharrn\`, UE 5.8.3 C++, module `Tharrn`; Git with LFS, first commit fb20fca (design record: 29e9dfc); P1 and P2 committed 2026-10-16 |
| Carried setup (D-03) | DLSS 4.5 and budget settings (D-11, D-12), Unreal MCP and `AllToolsets`, Game Animation Sample, Sci-Fi Complete Bundle (the go-to reference, D-20), Multiplayer Shooter System (D-23) and Easy Game UI (D-21), all staged outside Git, pack staging, plugin check, budget measurement, terrain pipeline (not yet re-run), sky, capture subsystem, world-building helpers |
| Checks | Both targets build with no warnings (Shipping too); plugin check PASS; data import 0 problems; automation tests pass; network test passes (listen and dedicated server, 2 clients and a late joiner, 50 ms each way and 1 % loss): the probe, movement and slide, the block course, made-up mantles refused, and P3's shots (0 to 1.2 % of shots disagree between a player and the server, made-up shots refused, the heavy round's flight); MSS test passes (draw, fire, reload, swap on a client) |
| Wildwright | Design record, Workspace card and `D:\Wildwright` gone. Its 7 commits stay in the Mr. Mak repo's history until the owner runs or allows the prepared history rewrite |
| Next | P2 (the player) and P3 (weapons, with MSS, D-23) built and checked 2026-10-16: **owner play-tests** ([steps](docs/tasks.md)); then P4, the HUD and survival basics |

## Working agreement

**Do**
- One module at a time through Unreal MCP; polish and test each before the next (D-06), including the
  server-and-clients test (D-04).
- C++ for complex systems, Blueprints for simple ones, notes in both; data in CSV (D-07).
- World building within the budget (D-11).
- Log decisions in [docs/decisions.md](docs/decisions.md); mark anything unverified. English for stored
  content.
- After a GDD or data change, update the wiki: its pages are in `tools/build_wiki.py` (data tables come from
  the game repo's `Data/`); run `python projects/Tharrn/tools/build_wiki.py` from the Mr. Mak folder.
- Ask the owner before every commit.

**Do not**
- Use Valley of the Ancient content, or designs and lore from earlier game projects (D-09).
- Redistribute Fab assets; no public repo or remote for `D:\Tharrn` (D-03).
- Put AI or LLM calls in runtime gameplay; keep AI and MCP plugins editor-only (D-13).
- Restart the owner's applications or end an agent session without permission.

## Ownership

| Area | Owner (agent) | Since | Notes |
|---|---|---|---|
| Everything (setup, GDD 0.1, Prototype) | Claude Code | 2026-10-15 | Codex works from written briefs |

## Next actions

| # | Action | Needs the owner? |
|---|---|---|
| 1 | Review GDD 0.1 and the open questions (scope OQ-07 and tutorial creature OQ-12 first) and the proposals in deliverables 3, 5, 6, 7 and 9 | **Yes** |
| 2 | Fab packs or models for creatures (OQ-04; weapons and armour are made for Tharrn, D-22; weapon animations from MSS, D-23) | **Yes** |
| 3 | Remove Wildwright's 7 commits from the Mr. Mak repo's history: Claude prepared and dry-ran the rewrite; Claude Code blocks it without the owner | **Yes** |
| 4 | Play-test P2, the player character (10 minutes, [steps](docs/tasks.md)) | **Yes** |
| 5 | Play-test P3, the weapons (10 minutes, [steps](docs/tasks.md)); say whether to move to Tharrn's own weapon models (D-22) | **Yes** |
| 6 | P4, after the P2 and P3 play-tests | No |
