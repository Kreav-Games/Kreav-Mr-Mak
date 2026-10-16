# Deliverable 10 — QA test matrix and acceptance criteria

Version 0.1, 2026-10-15. Every module's "done when" line from the GDD and the task list, the owner's five QA cases
(QA001–QA005, [GDD 12](../gdd/12-roadmap-qa.md)) and the [flagging tests](03-flagging-state.md) in one list. Each
module still passes the whole verification ladder (engineering guide §3) and ends with the owner's play-test.

**How a test runs:** *Auto* = an Unreal automation test (`Tools/Checks/run_tests.py`); *Net* = a server-and-clients
check with simulated latency and loss (`Tools/Checks/net_test.py`); *Budget* = `Tools/Checks/measure_budget.ps1`
(with `stat unit` and `stat gpu`); *Owner* = the owner's play-test with written steps.

## Prototype

| ID | Module | Case | How | Pass | State |
|---|---|---|---|---|---|
| F-01 | P1 Foundation | Weapons, creatures and zones import from CSV into data tables | Auto + import tool | Every row read back equal to the CSV; a second run changes nothing | **Pass** 2026-10-15 |
| F-02 | P1 | List and position helpers (`Tharrn.Data.*`) | Auto | All cases, including malformed input | **Pass** |
| F-03 | P1 | Replicated state reaches every client | Net | Listen server and dedicated server, 2 clients, 50 ms each way, 1 % loss: clients within 2 steps of the server | **Pass** |
| F-04 | P1 | A late-joining client gets the current state | Net | Its first value is the server's current one | **Pass** |
| F-05 | P1 | Client-to-server round trip measured | Net | Every client measures one; under 400 ms with 100 ms added | **Pass** (119–172 ms) |
| F-06 | P1 | Tharrn's MCP toolsets (Blueprint notes, play sessions) | Auto | Every tool's normal case and each error it raises | **Pass** (27 tests) |
| F-07 | P1 | Test range | Owner | Probe text agrees between windows; target labels read 10–100 m | Waiting for the owner |
| M-01 | P2 Character | Gait changes under latency | Net | No server corrections when walking, running, sprinting, crouching at 100 ms | Not built |
| M-02 | P2 | Slide | Net | Start, length and end match on server and clients | Not built |
| M-03 | P2 | Mantle and vault | Auto + Net | The server refuses a mantle where it finds no ledge; a valid one plays on every client | Not built |
| M-04 | P2 | Aim-down-sights camera | Owner | Readable at 10, 25, 50 and 100 m on the test range | Not built |
| C-01 | P3 Weapons | QA001 AR-01 recoil | Auto | Measured recoil within 5 % of its curve | Not built |
| C-02 | P3 | Hit multipliers | Auto | Head × 2.5, torso × 1.0, limb × 0.75 | Not built |
| C-03 | P3 | Armour | Auto | Cloth 10 %, composite 30 %, alloy 50 % less damage | Not built |
| C-04 | P3 | Hit registration under latency | Net | Two clients at 100 ms: under 2 % of shots disagree between client and server | Not built |
| C-05 | P3 | The server refuses impossible shots | Auto | A shot from a position or time the server cannot match deals no damage | Not built |
| C-06 | P3 | Heavy projectile | Auto | Drop and travel time match its speed; damage applied by the server only | Not built |
| C-07 | P3 | Weapons from data | Auto | SMG, pistol and the heavy weapon take every stat from `DT_Weapons` | Not built |
| C-08 | P3 | Aim assist | Auto | Only with a controller; 0.6° radius, strength 0.15 | Not built |
| V-01 | P4 Vitals | Hunger threshold | Auto | Below 30, stamina recovers 40 % slower; at 30 and above, normally | Not built |
| V-02 | P4 | Hydration threshold | Auto | Below 30, aim sway grows by 25 % (formula as settled with the owner, GDD 03) | Not built |
| V-03 | P4 | The two formulas | Auto | `StaminaRegen` and `AimSway` at 0, 29, 30, 31 and 100 | Not built |
| V-04 | P4 | Temperature | Auto | Outside the armour's range: damage over time and slower movement | Not built |
| V-05 | P4 | Crafting a bandage and ammo | Auto + Net | The server checks recipe and inventory; both clients see the same inventory | Not built |
| V-06 | P4 | HUD vitals and weapon panel | Owner + Net | The same values on both clients | Not built |
| W-01 | P5 Coastal slice | Frame budget | Budget | Within D-11 (16.6 ms on the minimum PC, split as in D-11) | Not built |
| W-02 | P5 | QA005 streaming | Budget | No frame more than 10 ms over the median while crossing cells | Not built |
| W-04 | P5 | Look | Owner | The owner approves the review images | Not built |
| A-01 | P6 Creatures | Behaviour runs on the server only | Net | Clients receive movement and montages; no AI on clients | Not built |
| A-02 | P6 | Skitterjaw pack | Net + Owner | Patrol, detect, chase, flank, pounce; two clients see the same fight | Not built |
| A-03 | P6 | Aggro radius | Auto | Notices a player at the CSV's radius, not beyond | Not built |
| A-04 | P6 | Stagger and weak points | Auto | Stagger at its threshold interrupts the attack; weak point uses its multiplier | Not built |
| A-05 | P6 | Phase Warden teleport dodge | Net | Hits on the old position after a teleport are refused by the server | Not built |
| H-01 | P7 MetaHuman | QA004 preset load | Auto | Morphs and materials match the JSON; save and load round-trips | Not built |
| H-02 | P7 | Customisation online | Net | A chosen preset survives a reload and shows on both clients | Not built |
| P-01 | P8 Play-through | The tutorial path | Owner | Crash site → vitals → scavenge and craft → first fight → shelter in 10–15 minutes, and fun | Not built |

## Vertical slice and later

| ID | Area | Case | How | Pass |
|---|---|---|---|---|
| X-01 | PvP | QA002 flag reaches nearby clients | Net | Each client shows the flag within 100 ms of the server's change plus the connection's latency |
| X-02 | PvP | Flagging state machine | Auto | The ten tests in [deliverable 3](03-flagging-state.md) §10 |
| X-03 | PvP | QA003 extraction interrupt | Net | Progress stops; the HUD shows it interrupted |
| X-04 | PvP | Combat-logging proxy | Net | A disconnected flagged player leaves a proxy for 5 minutes with their gear |
| X-05 | PvP | Loot rules | Auto | Full loot on death in flagged zones; secured base storage untouched |
| B-01 | Building | Placement | Auto + Net | The server refuses invalid placement; both clients see valid pieces |
| B-02 | Building | Power grid | Auto | Overload shuts the network down |
| B-03 | Building | Decay | Auto | 1 % a day by default, configurable |
| D-01 | Dungeons | Generator | Auto | The same seed gives the same rooms; modifiers apply |
| D-02 | Dungeons | Boss phases | Auto | Phases change at 75, 50 and 25 % health |
| N-01 | Network | Tick rates and interest management | Net | Measured per zone type once there are dedicated servers (OQ-02) |
| Q-01 | Progression | XP curve | Auto | `XP(level) = baseXP × 1.12^(level − 1)` from level 1 to 60 |
| Q-02 | Progression | Talents | Auto | Prerequisites enforced; each node's effect applied |

## Acceptance from the direction (GDD 12)

| Area | Criterion | How it is measured here |
|---|---|---|
| Combat feel | 95th percentile of play-tests report responsive aim; under 2 % desync | C-04 now; play-tests beyond the owner later |
| Survival balance | Expedition length matches the design; vitals influence but do not punish | The owner's play-tests from P4 and P8 |
| PvP | Flagging reliable; extraction interrupts work; proxies spawn | X-01 to X-05 |
| MetaHuman fidelity | Facial animation matches voice; LOD changes are seamless | H-01, H-02; voice later |
| Performance | 60 fps on the minimum PC (D-11), 120 fps on high-end PCs, consoles open (OQ-01) | W-01 and W-02 for every world module |
