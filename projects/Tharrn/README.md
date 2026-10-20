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
| — | [docs/while-away.md](docs/while-away.md) | **For the owner, back home:** what was built while away (P4), rollback points and how to go back, choices made for the owner | first, when home |
| 2 | [docs/gdd/00-overview.md](docs/gdd/00-overview.md) | GDD 0.1: the direction in 13 modules with build notes | 20 min |
| 3 | [docs/tasks.md](docs/tasks.md) | Current work: the Prototype modules | 2 min |
| 4 | [docs/decisions.md](docs/decisions.md) | Decisions D-01 to D-25, open questions OQ-01 to OQ-14 | 5 min |
| 5 | [docs/engineering-guide.md](docs/engineering-guide.md) | Build, test, MCP, budget, conventions, gotchas | 15 min |
| — | [docs/scifi-bundle.md](docs/scifi-bundle.md) | The Sci-Fi Complete Bundle's guides, the go-to reference for world building (D-20) | before world work |
| — | [docs/building.md](docs/building.md) | Base building (the Building chat, D-30): the bundle's building pieces, the remodel, which AI and tools, tiers, work stations, steps | before building work |
| — | [docs/story.md](docs/story.md) | The story bible and the progression design (the Story chat): how we got here, the factions, the main story by act, quests, XP and talents, loot, dungeons, raids | before story, quest or progression work |
| — | [docs/weapons.md](docs/weapons.md) | Weapons and tools (the Weapons and Tools chat, D-32): the shooter pack's weapons taken apart, what Tharrn's own models have to be, which AI and tools, the arsenal, the tools, steps | before weapon or tool work |
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
| Checks | Both targets build with no warnings (Shipping too); plugin check PASS; data import 0 problems; automation tests pass; network test passes (listen and dedicated server, 2 clients and a late joiner, 50 ms each way and 1 % loss): the probe, movement, the block course, made-up mantles refused, and P3's shots (0 to 1.2 % of shots disagree between a player and the server, made-up shots refused, the heavy round's flight); MSS test passes (draw, fire, reload, swap, the view through the sight, the mouse wheel, the grenade launcher and grenades on a client) |
| Base building | Started 2026-10-19 in its own chat (D-30): the bundle's building pieces measured and pictured; the remodel, tools and steps proposed; the tiers chosen (D-33: Wooden Fiber, Salvaged Mineral, Enhanced Alloy, Biotech); B2, the piece factory, in progress ([building.md](docs/building.md)) |
| Weapons and tools | Started 2026-10-19 in its own chat (D-32): the shooter pack's weapons measured and pictured (modular parts on one skeleton per class); the model contract, the AI and tools, the arsenal, the tools and the steps proposed ([weapons.md](docs/weapons.md)); the owner's choices next (OQ-20 to OQ-22) |
| Wildwright | Design record, Workspace card and `D:\Wildwright` gone. Its 7 commits stay in the Mr. Mak repo's history until the owner runs or allows the prepared history rewrite |
| Next | P2 (the player) and P3 (weapons, with MSS, D-23) built and checked 2026-10-16, then changed the same day (D-24: no slide, a grenade launcher and hand grenades, aiming through the sight, the mouse wheel): then P4 (D-25: the hotbar, inventory, pickups, HUD, inventory screen and Easy Game UI's menus) built 2026-10-16 while the owner was away ([report](docs/while-away.md)): then P5 (vitals, stamina, temperature, food and water, crafting, the death bag) built the same night: **owner play-tests** of P2 to P5 ([steps](docs/tasks.md)); then P6, the coastal slice |

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
- Several chats work on Tharrn at once (map, building, interface, weapons, story; each owns its wiki tab): read
  [docs/decisions.md](docs/decisions.md) just before adding a decision or open question, take the next free number,
  and never renumber another chat's.

**Do not**
- Use Valley of the Ancient content, or designs and lore from earlier game projects (D-09).
- Redistribute Fab assets; no public repo or remote for `D:\Tharrn` (D-03).
- Put AI or LLM calls in runtime gameplay; keep AI and MCP plugins editor-only (D-13).
- Restart the owner's applications or end an agent session without permission.

## Ownership

| Area | Owner (agent) | Since | Notes |
|---|---|---|---|
| Everything (setup, GDD 0.1, Prototype) | Claude Code | 2026-10-15 | Codex works from written briefs |
| Base building (D-30) | Claude Code, the Building chat | 2026-10-19 | Shares the editor with the map work ([how](docs/building.md#8-working-beside-the-map-chat)) |
| Weapons and tools (D-32) | Claude Code, the Weapons and Tools chat | 2026-10-19 | Models made outside the editor; imports only under `/Game/Art/Weapons` and `/Game/Tharrn/Weapons` ([how](docs/weapons.md#8-working-beside-the-other-chats)) |
| The main map `L_Main` ([map-design.md](docs/map-design.md)) and the wiki's world and map tab | Claude Code, the Map chat | 2026-10-19 | The owner: "world and zones, map build tabs for the wiki are yours to control"; the tab merges the two, with the map's questions and to-do list. Uses the editor's open level while it builds |
| The story, quests, progression, dungeons and raids, and the wiki's Progression and Story tab ([story.md](docs/story.md)) | Claude Code, the Story chat | 2026-10-19 | The owner: "you are the story behind the game, how we got here, what we do, quests, progression, raids ect. you controll the Progression and dungeons tab, name is Progression and Story". Draft 1 of the story bible and the progression design: OQ-25 to OQ-27 |

## Next actions

| # | Action | Needs the owner? |
|---|---|---|
| 1 | Review GDD 0.1 and the open questions (scope OQ-07 and tutorial creature OQ-12 first) and the proposals in deliverables 3, 5, 6, 7 and 9 | **Yes** |
| 2 | Fab packs or models for creatures (OQ-04; weapons and armour are made for Tharrn, D-22; weapon animations from MSS, D-23) | **Yes** |
| 3 | Remove Wildwright's 7 commits from the Mr. Mak repo's history: Claude prepared and dry-ran the rewrite; Claude Code blocks it without the owner | **Yes** |
| 4 | Play-test P2, the player character (10 minutes, [steps](docs/tasks.md)) | **Yes** |
| 5 | Play-test P3, the weapons (10 minutes, [steps](docs/tasks.md)): the launcher, grenades, aiming through the sight and the wheel too; say how the grenade and launcher numbers feel (proposals) and when to move to Tharrn's own weapon models (D-22) | **Yes** |
| 6 | Check the choices made in the P4 plan (D-25; [plan](docs/tasks.md#p4-inventory-hotbar-and-ui-plan-2026-10-16)); the owner said to go ahead | **Yes**, when home |
| 7 | Play-test P4 (10 minutes, [steps](docs/tasks.md#p4-inventory-hotbar-and-ui-results-2026-10-16)); report, pictures and rollback points in [docs/while-away.md](docs/while-away.md) | **Yes** |
| 8 | Play-test P5 (10 minutes, [steps](docs/tasks.md#p5-vitals-and-crafting-results-2026-10-16)) and say how its numbers feel (proposals) | **Yes** |
| 9 | ~~Choose the building tiers, the storey height and what the Hyper template's building system is for~~ Done 2026-10-19 (D-33) | — |
| 10 | Choose the arsenal's look and order, the tools and the 3D generation service (OQ-20 to OQ-22; [weapons.md](docs/weapons.md)); say go for the one-weapon trial (W2) | **Yes** |
