# Handoff — Next action 5: the first three rules

*Prepared 2026-10-12 by Claude Code for whichever agent builds it (Claude Code or
Codex). Read the [README](../README.md) and the
[engineering guide](05-engineering-guide.md) first.*

## Before you start

- **Implementation is decided (D-12):** C++ with data in CSV files, assets from the
  generators in `Tools/`. Any Blueprint work is the owner's, with your step-by-step
  help.
- **Action 4 is committed** (`7b9712f` in `D:\Wildwright`). Check
  `git -C D:\Wildwright status --short` is clean apart from documentation before
  you start.
- **Claim** `D:\Wildwright\Source\Wildwright\Elements\`, `Data\`, `Tools\` and
  `Content\Wildwright\Data\` in the README ownership table.

## Goal

GDD 16.3 #5: implement the first three rules in [GDD 3.4](02-gdd.md) so they give
**deterministic, visible, persistent** results on the test-range targets. These are
the rules behind Appendix A.2 tests #1 and #2:

| Rule | Input → target | Precondition | Outcome |
|---|---|---|---|
| `ER_WATER_WET` | Water → combustible patch, soil patch | Target accepts moisture | Moisture rises to a cap; ignition eligibility falls |
| `ER_FIRE_IGNITE` | Fire → combustible patch | Fuel present and dry enough | Burn starts; temperature rises; fuel decreases over time |
| `ER_WATER_COOL` | Water → hot surface | Temperature at or above the steam threshold | Temperature falls; steam at the threshold |

The other three M1 rules (`ER_AIR_DISPERSE`, `ER_WATER_SOIL`, `ER_EARTH_BARRIER`)
stay matched but have no effect yet. Log them as "not implemented yet".

## What is already in place (action 4)

- Selecting, aiming and applying work. A valid apply calls
  `UWildwrightRuleSubsystem::ResolveApplication`, which logs, calls
  `IWildwrightElementTarget::OnElementResolved` on the target and broadcasts
  `OnElementApplied`. **No state changes yet.**
- `WildwrightElementRules::EvaluateTarget` decides validity before apply, with a
  reason for every refusal. It is pure and unit-tested.
- Rules come from `Data/Rules.csv` → `DT_ElementRules` (columns `InputElement`,
  `TargetTags`, `Phase`, `Summary`). Elements come from `Data/Elements.csv`.
- Targets are `AWildwrightTargetActor` (greybox), with `TargetTags`, `DisplayName`
  and `bWalkThrough`. Test-range stations: ST01 dry patch, ST02 patch to wet first,
  ST03 soil, ST04 hot surface (see `Tools/Greybox/README.md`).
- Tests: `Wildwright.Elements.TargetCheck`, `Wildwright.Elements.ProjectData`. All pass.

## Required behaviour

1. **Target state.** Each target has bounded state per GDD 4.2 and A.1: moisture,
   temperature and fuel (0–100), and a discrete stage (GDD 4.5). The stages needed
   now are Dry/Wet for moisture, Unburnt/Burning/Burnt for combustibles, and
   Hot/Warm/Cool for temperature. Values are clamped (GDD 3.6). Initial values per
   target type come from data; a placed actor may override them.
2. **Preconditions are checked before apply**, so the crosshair already shows an X
   and the reason. Examples: "Too wet to ignite (moisture 60, needs 30 or less)",
   "Already burning", "Not hot enough for steam (temperature 25, needs 60)". Add a
   verdict for this (e.g. `PreconditionFailed`) after the existing checks.
3. **Resolution is deterministic.** Same state plus same application gives the same
   result. Matching rules apply in table order (row order is the priority). Each
   resolution logs target, rule ID, preconditions, before and after state, or the
   rejection reason (GDD 3.6).
4. **Burning progresses over time** on a timer, not per-frame tick (GDD 12.5): fuel
   falls, then the patch becomes Burnt and cools back towards ambient. A burnt patch
   cannot ignite again.
5. **Steam** happens when cooling starts at or above the threshold. Report it as a
   state-layer event (HUD message now; Niagara steam is the hero cast, action 6).
6. **Every result is visible after the moment passes** (GDD 2.2 rule 3, 5.4): the
   target's look changes with its stage (wet darker, burning bright, burnt near
   black, hot red fading to grey as it cools). Use a dynamic material instance on the
   target mesh driven by state; the visual never decides state.
7. **The HUD shows the aimed target's state** in one line (e.g.
   `Moisture 60 · Temp 20 · Fuel 100 · Wet`) so a tester can confirm a result. The
   full debug overlay is action 7.

## Proposed data (hypotheses to tune; GDD says numbers are not commitments)

| Value | Proposal |
|---|---|
| Ambient temperature | 20 |
| Wet threshold (stage Wet) | moisture ≥ 50 |
| Ignite allowed | moisture ≤ 30, fuel > 0, not Burning or Burnt |
| `ER_WATER_WET` effect | moisture +50, cap 100 |
| `ER_FIRE_IGNITE` effect | stage Burning, temperature → 80, fuel −10 per second until 0, then Burnt |
| Steam threshold | temperature ≥ 60 |
| `ER_WATER_COOL` effect | temperature −40, not below ambient; steam event if it started ≥ 60 |
| Temperature stages | Hot ≥ 60, Warm 35–59, Cool < 35 |
| Initial state | combustible patch: moisture 10, temp 20, fuel 100. Soil patch: moisture 5, temp 20, fuel 0. Hot surface: moisture 0, temp 90, fuel 0 |

Keep thresholds and effects in data (extend `Data/Rules.csv`, and add for example
`Data/TargetTypes.csv` for initial state), never as literals in code. Update
`build_elements.py` to import any new table, and the `ProjectData` test to check it.

## Constraints

- State layer only. The element component and HUD request and read; only the rule
  subsystem (and the target state it owns) changes state (GDD 2.2).
- No GAS for world or target state (D-08). No Niagara or animation (action 6).
- Out of scope: world cells and save/load (M2), fire spread, smoke, the other three
  rules' effects, creatures, the full debug overlay (action 7).
- Keep `EvaluateTarget` and the new resolution logic pure and testable without a
  world, as in action 4.
- C++ and CSV per OD-11; generated assets only through the scripts; the editor must
  be closed to build the editor target (guide §2).

## Files likely to change

| File | Change |
|---|---|
| `Source/Wildwright/Elements/WildwrightElementTypes.h` | State struct and stage enums; new rule-row columns; new verdict |
| `Source/Wildwright/Elements/WildwrightElementRules.*` | Precondition check; pure `ResolveRule(state, rule) → new state + events` |
| `Source/Wildwright/Elements/WildwrightRuleSubsystem.*` | Apply resolution, log before/after, run burn timers, broadcast events |
| `Source/Wildwright/Elements/WildwrightTargetActor.*` | Own the state; initial values; dynamic material from stage |
| `Source/Wildwright/Elements/WildwrightHUD.cpp` | One-line state readout for the aimed target |
| `Source/Wildwright/Elements/Tests/WildwrightElementTests.cpp` | New tests (below) |
| `Data/Rules.csv`, new `Data/TargetTypes.csv` | Thresholds, effects, initial state |
| `Tools/Elements/build_elements.py` | Import the new table |
| `Tools/Elements/README.md`, engineering guide §4 | Document the new data and flow |

## Acceptance checks

Automated (must pass before asking the owner):

1. Game and editor targets build with no new warnings.
2. `build_elements.py`: `RESULT ok`, 0 import problems.
3. New tests, for example `Wildwright.Elements.Resolution`:
   - dry patch + fire → Burning, temperature 80;
   - patch + water → moisture 60, stage Wet; then fire → refused with the
     "too wet" reason, state unchanged (A.2 #1);
   - burning patch after enough timer steps → fuel 0, Burnt; fire again → refused;
   - hot surface (90) + water → 50 and a steam event; water again → refused, "not
     hot enough" (50 is below the threshold of 60), state unchanged (A.2 #2);
   - a hot surface at exactly 60 + water → steam (the threshold is inclusive), and
     never below ambient (20);
   - clamps hold at 0 and 100; same inputs twice give identical results.
4. Existing tests and `verify_greybox.py` (33/33) still pass.

Owner play-test in `L_TestRange` (give them these steps and expected text):

5. ST01 + Fire: the patch turns bright and burns down to near black; the HUD readout
   shows fuel falling.
6. ST02 + Water: the patch darkens (Wet). Then Fire: X and "Too wet to ignite …".
   ST01 next to it (dry) does ignite: same rule, different state (A.2 #1).
7. ST04 + Water: "Steam" message, the rock dulls from red (90 → 50). Water again: X
   and "Not hot enough for steam …" (A.2 #2).
8. Restarting play gives the same results.

Not testable yet: A.2 #6 (VFX off gives the same state) holds trivially until VFX
exist; A.2 #9 (cancel a charged cast) needs the charge from action 6.

## When done

Follow the verification ladder (guide §3): report evidence, update the README state
and next actions, add a session-log entry, release the claim, and ask the owner
before committing. Update the Workspace `greybox.html` "Try it now" table with the
new expected results.
