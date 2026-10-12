# Wildwright — Engineering guide

How to build, generate, test and verify the Unreal project, how the code is laid
out, and what has bitten us before. Written for whichever agent picks the work up
next (Claude Code or Codex) and for the owner. Every command here has been run on
this machine unless it is marked *(unverified)*.

Read the [README](../README.md) first for the current state, rules and ownership.
Design intent is in the [GDD](02-gdd.md); decisions in the [log](04-decisions.md).

## 1. Where things are

| What | Where |
|---|---|
| Design record (docs, decisions, Workspace hub source) | `D:\Mr.MakRepo\Kreav-Mr-Mak\projects\Wildwright\` (inside the Mr. Mak repo) |
| Unreal project (game repo) | `D:\Wildwright\` — its own Git repo on `main`, Git LFS, **local only, no remote** (D-11: keep it private) |
| Engine | UE **5.8.3** at `D:\UE_5.8` (D-07). Launch the exe directly; never double-click the `.uproject` |
| Compiler | VS 2022 17.14.41; `cl.exe` 14.44.35229 (accepted by 5.8; see gotchas) |
| Feel reference (read-only) | `%USERPROFILE%\Documents\Unreal Projects\ValleyoftheAncient` (UE 5.4.4). See [03](03-feel-reference-valley-of-the-ancient.md) |
| Workspace hub | `workspace\2026-10-11_wildwright\` in the Mr. Mak repo. `index.html` is generated (`node projects/Wildwright/tools/build-workspace-card.mjs`); `greybox.html` is hand-written |
| Agent scratch files | `D:\Wildwright\Saved\<Agent>Scratch\` (ignored by Git). Never the project root |

### Inside the game repo

| Path | Contents | Source of truth |
|---|---|---|
| `Source/Wildwright/` | Template character, controller, game mode (lightly edited) | C++ |
| `Source/Wildwright/Elements/` | Element system (action 4); `Tests/` holds automation tests | C++ |
| `Data/*.csv` | Elements, rules, target types (initial state, thresholds and colours) | **These CSVs.** Imported into data tables by a script |
| `Tools/Greybox/` | `build_greybox.py`, `verify_greybox.py`, README | Python |
| `Tools/Elements/` | `build_elements.py`, README | Python |
| `Config/DefaultGame.ini` | `[/Script/Wildwright.WildwrightSettings]` points the game at the generated assets | Text |
| `Content/Wildwright/Maps/` | `L_TestRange`, `L_Valley_Greybox` | **Generated** by `build_greybox.py` |
| `Content/Wildwright/Greybox/Materials/` | `MI_GB_*` | **Generated** by `build_greybox.py` |
| `Content/Wildwright/Input/` | `IA_Element*`, `IMC_Elements` | **Generated** by `build_elements.py` |
| `Content/Wildwright/Data/` | `DT_Elements`, `DT_ElementRules`, `DT_TargetTypes` | **Generated** from `Data/*.csv` |
| `Content/` (other) | Template content (character, input, LevelPrototyping, ThirdPerson map) | Template |
| `AGENTS.md`, `CLAUDE.md`, `.mcp.json`, `.codex/`, `.hyperai/` | HyperAIStudio agent files plus the hand-written "Wildwright project rules" in `AGENTS.md` | Do not delete the hand-written section |

**Never hand-edit a generated asset.** Change the script or CSV and regenerate, or
the next run will undo the change.

## 2. Everyday commands (PowerShell)

```powershell
$UE   = "D:\UE_5.8"
$Proj = "D:\Wildwright\Wildwright.uproject"

# Open the editor
Start-Process "$UE\Engine\Binaries\Win64\UnrealEditor.exe" "`"$Proj`""

# Build the GAME target: works even while the editor is open (separate binaries)
& "$UE\Engine\Build\BatchFiles\Build.bat" Wildwright Win64 Development "-Project=$Proj" -WaitMutex

# Build the EDITOR target: the editor must be CLOSED (it locks its DLLs / Live Coding)
& "$UE\Engine\Build\BatchFiles\Build.bat" WildwrightEditor Win64 Development "-Project=$Proj" -WaitMutex -NoHotReloadFromIDE
```

Build output to check: `Result: Succeeded`, and no `error`/`warning C` lines outside
HyperAIStudio (its 20 "does not list plugin" warnings are the vendor's and harmless).

### Headless editor runs (scripts, tests)

```powershell
function Invoke-WWEditor([string[]]$Extra, [string]$Log) {
  $a = @("`"$Proj`"") + $Extra + @('-unattended', '-nullrhi', '-nosplash', '-nosound', "-abslog=`"$Log`"")
  $p = Start-Process "$UE\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" -ArgumentList $a -PassThru -WindowStyle Hidden
  if (-not $p.WaitForExit(900000)) { $p.Kill(); "TIMEOUT" } else { "exit $($p.ExitCode)" }
}
$S = "D:\Wildwright\Saved\CodexScratch"   # or ClaudeScratch
New-Item -ItemType Directory -Force $S | Out-Null

# Element assets from Data/*.csv (input actions, IMC, data tables)
Invoke-WWEditor @('-ExecutePythonScript="D:\Wildwright\Tools\Elements\build_elements.py"') "$S\elements.log"
Select-String -Path "$S\elements.log" -Pattern '\[WWElements\]|Traceback|Imported DataTable'

# Greybox maps (skips existing maps unless forced; a forced rebuild replaces only Greybox-tagged actors)
$env:WW_GREYBOX_FORCE = "1"
Invoke-WWEditor @('-ExecutePythonScript="D:\Wildwright\Tools\Greybox\build_greybox.py"') "$S\greybox.log"
Remove-Item Env:WW_GREYBOX_FORCE
Select-String -Path "$S\greybox.log" -Pattern '\[WWGreybox\]|Traceback'

# Automation tests (all tests whose path starts with "Wildwright")
Invoke-WWEditor @('-ExecCmds="Automation RunTests Wildwright"', '-TestExit="Automation Test Queue Empty"') "$S\tests.log"
Select-String -Path "$S\tests.log" -Pattern 'Found \d+ automation tests|Test Completed'

# Layout and wiring verifier (read-only; ends with a SUMMARY line)
Invoke-WWEditor @('-ExecutePythonScript="D:\Wildwright\Tools\Greybox\verify_greybox.py"') "$S\verify.log"
Select-String -Path "$S\verify.log" -Pattern '\[WWVerify\] (FAIL|SUMMARY)|Traceback'
```

Expected today: `DT_Elements: 4 rows`, `DT_ElementRules: 6 rows`,
`DT_TargetTypes: 5 rows`, all `Imported DataTable ... 0 Problems`; tests
`Wildwright.Elements.TargetCheck`, `Wildwright.Elements.ProjectData`,
`Wildwright.Elements.Resolution`, `Wildwright.Elements.Runtime` all
`Result={Success}`; verifier
`SUMMARY 33 passed, 0 failed`.

Automation can exit 0 even when a test reports `Result={Fail}`. Inspect every
`Test Completed` line and reject any failure; process exit status alone is insufficient.

Headless runs can happen while the owner's editor is open (they only write the
assets listed above), **except** regenerating a map the owner has open. Check first:

```powershell
Select-String D:\Wildwright\Saved\Logs\Wildwright.log 'MAP LOAD' | Select-Object -Last 1
```

If the last map loaded is the one you would rebuild, ask the owner to switch maps or
close the editor.

## 3. Verification ladder (definition of done for agent work)

Do these in order and report each result with its evidence (GDD 16.2):

1. Game target builds; editor target builds (editor closed). No new warnings.
   `powershell -NoProfile -File D:\Wildwright\Tools\Checks\check_editor_only_plugins.ps1`
   prints `PASS` (no AI, MCP or editor-tool plugin can reach the game).
2. Generators run with `RESULT ok` and 0 import problems.
3. Automation tests pass. **New behaviour needs a new test**, with the normal case
   and at least two failure cases.
4. `verify_greybox.py` passes. Extend it when you add placed content.
5. Owner play-test in `L_TestRange` (an agent cannot play the game). Give them the
   exact steps and expected on-screen text (see the "Try it now" table in the
   Workspace `greybox.html`).
6. Commit only after the owner says so (see §6).
7. Update the README state table, add a [session log](06-session-log.md) entry,
   log decisions in [04](04-decisions.md), release your ownership claim.

## 4. Architecture

### Two layers (GDD 2.2)

```
 Player input ─► UWildwrightElementComponent ──(check)──► WildwrightElementRules::EvaluateTarget
   (on the character: select, aim trace,               pure, deterministic, unit-tested
    apply, HUD state)                                   reasons for every refusal
        │ apply (valid only)
        ▼
 UWildwrightRuleSubsystem::ResolveApplication   ◄── DT_Elements, DT_ElementRules, DT_TargetTypes
   (rechecks live state, resolves in table order;       via UWildwrightSettings (DefaultGame.ini)
    owns burn/cool timers, logs before/after)
        │
        ▼
 AWildwrightTargetActor::SetResolvedState       private; only the subsystem can write it
   (bounded state → persistent dynamic material)
        │
        ▼
 OnElementResolved / OnSteam / OnElementApplied  notifications after successful resolution
```

The cast layer (montages, Niagara, camera, GAS abilities; action 6) must only
*request* through `ResolveApplication` and *read* state. It never changes state.

### Element system files (`Source/Wildwright/Elements/`)

| File | Role |
|---|---|
| `WildwrightTags.h/.cpp` | Native Gameplay Tags: `Element.Fire/Water/Earth/Air`, `Target.CombustiblePatch/SoilPatch/HotSurface/SmokeDust/FlowEdge` |
| `WildwrightElementTypes.h` | Element/rule/target-type table rows; bounded target state and moisture/burn/temperature stages; checks, applications and `PreconditionFailed`; log category `LogWildwrightElements` |
| `WildwrightElementRules.h/.cpp` | `FindMatchingRules`, `EvaluateTarget`. Plain functions, no world. Check order: no element, nothing aimed at, not elemental, no rule, too far, recharging, ordered state preconditions |
| `WildwrightStateRules.h/.cpp` | Pure `InitialState`, `NormalizeState`, `ResolveRule`, `AdvanceBurn`, `DescribeState`; thresholds/effects come from data |
| `WildwrightElementTarget.h` | `IWildwrightElementTarget`: `GetElementTargetInfo`, `OnElementResolved` |
| `WildwrightTargetActor.h/.cpp` | Placed target with private state, optional `bOverrideInitialState`/`InitialStateOverride`, data profile and a dynamic material; actor tick stays disabled |
| `WildwrightRuleSubsystem.h/.cpp` | Loads three tables, initializes targets, rechecks applications, applies ordered rules, owns fixed burn/cool timers, broadcasts `OnSteam`/`OnElementApplied`; Game and PIE worlds only |
| `WildwrightElementComponent.h/.cpp` | On `AWildwrightCharacter`: input binding from settings, per-frame aim trace (starts level with the character), apply, last message |
| `WildwrightHUD.h/.cpp` | Canvas HUD: plus/X crosshair, reason, one-line aimed target state, element bar, last result, controls hint |
| `WildwrightSettings.h` | `UDeveloperSettings` (Project Settings > Game > Wildwright) |
| `Tests/WildwrightElementTests.cpp` | TargetCheck, ProjectData (all table values), Resolution (boundaries, refusals, order, determinism) |
| `Tests/WildwrightRuleRuntimeTests.cpp` | Runtime: isolated Game world, real target initialization, placed overrides, resolver, material parameters and timer progression |

Hooks into the template: `WildwrightCharacter.h/.cpp` (creates `Elements`, calls
`SetupInput`), `WildwrightGameMode.cpp` (sets `HUDClass`). The template Blueprints
`BP_ThirdPersonCharacter` and `BP_ThirdPersonGameMode` inherit both without edits.

### Adding things

- **A rule:** add a row to `Data/Rules.csv`, update the reference rules in
  `Tests/WildwrightElementTests.cpp` (the `ProjectData` test compares them), re-run
  `build_elements.py`, rebuild, run tests.
- **A target type:** add a native tag in `WildwrightTags.*`, use it in a rule, add it
  to `TARGET_TYPES` in `build_greybox.py`, place targets, extend the verifier counts.
- **An element property:** add a `UPROPERTY` to `FWildwrightElementRow`, a column to
  `Data/Elements.csv`, re-run `build_elements.py`.
- **Target state or tuning:** edit `Data/TargetTypes.csv` (initial state, stage
  thresholds, colours) or `Data/Rules.csv` (effect, eligibility, rates/cadence),
  update the ProjectData reference values, then regenerate and run the ladder.
  The first matching target-type row supplies a profile if an actor has several tags.

Action 5 uses the handoff's proposed values as tuning hypotheses: water adds 50,
fire requires moisture ≤30 and fuel >0, ignition sets temperature 80, fuel falls
10 per 1-second timer step, then burnt targets cool 10 per second to ambient 20.
Steam cooling requires temperature ≥60, removes 40, and never goes below ambient.
Wet/Hot/Warm thresholds are 50/60/35. Water on a burning patch increases moisture;
extinguishing and fire spread are outside this action. Unimplemented matching rules
log and report “not implemented yet”. State persists for the current Play session;
save/load is M2.

Runtime tests create a world with `CreateWorld(..., &InitializationValues)` (which
already initializes it), register an engine world context, configure targets,
then call `InitializeActorsForPlay` and `WorldSettings::NotifyBeginPlay`. Calling
`InitializeNewWorld` again duplicates WorldSettings; omitting actor initialization
suppresses interface notifications in `AActor::ProcessEvent`. Finish with
`EndPlay` before context/world destruction. Latent phases advance the timer on
separate engine frames without changing `GFrameCounter`.

## 5. Conventions

- **Implementation (D-12, decided):** systems the agents build are C++ with data in
  CSV files imported into data tables; assets come from idempotent editor-Python
  generators in `Tools/`. Blueprints are for content the owner tunes, with agent
  assistance: give exact editor steps, and use editor Python where it can do the
  job. Agents cannot edit Blueprint graphs or other binary assets.
- **Only Wildwright (D-02):** never use names, files, systems, lore or plans from any
  earlier game project, even if found elsewhere on this machine or in old chats.
- **Content paths:** everything Wildwright-specific under `/Game/Wildwright/`
  (`Maps/`, `Greybox/Materials/`, `Input/`, `Data/`). Prefixes: `L_` level, `MI_`
  material instance, `IA_` input action, `IMC_` mapping context, `DT_` data table,
  `BP_` Blueprint, `NS_` Niagara, `GA_`/`GE_`/`GC_` ability/effect/cue (GAS).
- **Tags:** gameplay meaning uses native Gameplay Tags (`Element.*`, `Target.*`).
  Greybox actors also carry plain actor tags (`Greybox`, `Target.*`, `Rule.ER_*`,
  `Test.A2.n`) for scripts.
- **C++:** match the template's style; tabs; `UPROPERTY` with a `Category`; player
  text in `LOCTEXT` (namespace `WildwrightElements`); log to `LogWildwrightElements`.
- **Rules are deterministic** (same input, same result) and every refusal has a
  player-facing reason (GDD 3.3, 3.6, 3.7).
- **Generators are idempotent and headless**, log with a `[WWxxx]` prefix, end with
  `RESULT ok`/`RESULT failed`, and call `unreal.SystemLibrary.quit_editor()`.
- **Data CSV syntax** (DataTable import): first header cell `---` (row name);
  `FGameplayTag` as `"(TagName=""Element.Fire"")"`; `FGameplayTagContainer` as
  `"(GameplayTags=((TagName=""A""),(TagName=""B"")))"`; `FLinearColor` as
  `"(R=..,G=..,B=..,A=..)"`; plain text for `FText`.
- **English** for everything stored.

## 6. Git and commits

- The owner approves every commit. Prepare the change, show the file list, wait.
- Game repo: `git add` only the intended paths; never `Binaries/`, `Intermediate/`,
  `Saved/`, `DerivedDataCache/`, `.vs/`, `.hyperai/runtime/`, `.env`, logins, tokens.
  `.uasset`/`.umap`/media go to LFS automatically (`.gitattributes`).
- **No remote, no push, no public repo** (D-11).
- Mr. Mak repo: the owner has unrelated uncommitted work there. Stage only
  `projects/Wildwright/`, `workspace/2026-10-11_wildwright/` and the Wildwright entry
  in `workspace/workspace.json` unless told otherwise.
- Commit message: what and why, then what was verified. End with the agent's own
  attribution trailer.
- CRLF warnings for text files are harmless (Git converts on checkout).

## 7. Gotchas we hit (read before you debug)

**Build and engine**
1. UE 5.8 bans MSVC 14.40–14.43 and 14.44.0–14.44.35210. UBT reads the version from
   `cl.exe`, not the folder name (folder `14.44.35207`, compiler `14.44.35229`: OK).
2. The registry entry for 5.4 is stale; always launch `UnrealEditor.exe` directly.
3. The editor target cannot build while the editor is open. Build the game target
   to catch compile errors early, then ask the owner to close the editor.
4. While the editor runs, HyperAIStudio may rewrite `Wildwright.uproject` (it once
   enabled 17 EditorOnly toolset plugins) and `.gitignore`. Check `git status`
   before committing. Edit the `.uproject` only with the editor closed.
5. Every AI/MCP plugin must stay editor-only (`TargetAllowList: Editor` or an
   EditorOnly plugin). Unreal MCP has Runtime modules; without the allow-list it
   would ship in the game.
6. HyperAIStudio logs an error in **commandlets** (`-run=...`), so they exit 1 even
   when the work succeeds. Read the commandlet's own summary. `-ExecutePythonScript`
   and `-ExecCmds` runs are editor mode and do not have this problem. Re-check before
   cooking (M6).
7. The open editor starts Unreal MCP on `127.0.0.1:8000`. A second headless editor
   logs `HttpListener unable to bind to 127.0.0.1:8000`: harmless.

**Editor Python (UE 5.8)**
8. `execute_console_command(None, "MAP CHECK")` crashes the editor. Pass the world:
   `unreal.get_editor_subsystem(unreal.UnrealEditorSubsystem).get_editor_world()`.
9. Deleting a map and recreating it at the same path in one session fails
   (`new_level` returns False). Reopen it and replace actors instead.
10. `AutomationLibrary.take_high_res_screenshot` writes nothing in a headless
    `-RenderOffscreen` editor. There is no automated visual check; ask the owner.
11. `unreal.Key(key_name=...)` fails; create `unreal.Key()` and
    `set_editor_property("key_name", "LeftMouseButton")`.
12. `unreal.BlueprintGameplayTagLibrary` is not exposed. Inspect a tag container with
    `container.export_text()`.
13. `unreal.Rotator` positional order is (roll, pitch, yaw); always use keywords.
14. A script run with `-ExecutePythonScript` must call `quit_editor()` itself, or
    the process never exits.
15. Re-saving unchanged assets makes binary churn in Git; generators save only when
    something changed (see `make_materials` in `build_greybox.py`).
16. `Automation RunTests` needs `-TestExit="Automation Test Queue Empty"` or the
    editor keeps running.

**Content**
17. `TextRenderComponent` faces local **+X** (normal (1,0,0), text runs along −Y,
    from engine source). A sign read by a player at −X needs yaw 180. Greybox signs
    are double-sided boards for this reason.
18. Engine `/Engine/BasicShapes/Cube` is centred; template `SM_Cube` is pivoted at a
    corner. The greybox uses the engine shapes.

**Tools on this machine**
19. Windows PowerShell 5.1 reads files without a BOM as ANSI; use
    `Get-Content -Encoding UTF8` or `[IO.File]::ReadAllText` for UTF-8 files.
20. Headless Edge will not lay out narrower than about 492 px; it crops instead.
21. Higgsfield CLI is quarantined by Defender; do not add exclusions.
22. `codex exec` failing with "Your access token could not be refreshed. Please log
    out and sign in again" (and 401 errors) means Codex's ChatGPT sign-in expired. It
    changes nothing. The owner runs `codex logout` then `codex login` (opens a
    browser); then re-run. Seen 2026-10-12.
23. On this Windows machine `codex exec -s workspace-write` still starts with
    `sandbox: read-only` and `approval: never` (its Windows sandbox flags are
    "removed" or "under development" in 0.162.1), so it cannot read or edit files
    through its shell. Only `-s danger-full-access` (no sandbox at all) would let a
    non-interactive Codex run work, and that is the owner's call. Interactive Codex
    sessions started by the owner are unaffected *(unverified)*. Seen 2026-10-12.
24. **Visual Studio's Unreal integration** (2026-10-12) installed its
    `VisualStudioTools` plugin into `D:\UE_5.8\Engine\Plugins\VisualStudioTools` (not
    `Plugins\Marketplace`) and rewrote `Wildwright.uproject` with its own formatting,
    **dropping every `TargetAllowList: Editor`**. With that plugin enabled, the editor
    target fails with `RulesError: Expecting to find a type ... 'VisualStudioTools'`
    (an installed engine only compiles add-on plugins under `Plugins\Marketplace`; the
    likely cause, not confirmed). It is now disabled in the `.uproject`. Moving the
    plugin into `Engine\Plugins\Marketplace\` might fix it *(unverified; an engine-wide
    change, owner's call)*. After any Visual Studio prompt about Unreal, run the
    plugin check below.
25. `Select-String` without parameter names takes the **pattern first**: always write
    `Select-String -Path <file> -Pattern <regex>`.

## 8. Working as two agents (Claude Code and Codex)

Both agents read the same files, so either can continue the other's work.

- **Claim before editing.** Add a row to the README ownership table with the area,
  your name and the date; remove it when you stop. One agent per area.
- **Hand off with a brief.** Use the repo skill `.agents/skills/feature-handoff/SKILL.md`
  and put the brief in `docs/07-...md` (example:
  [07-handoff-action-5.md](07-handoff-action-5.md)). It names the behaviour, files,
  constraints and acceptance checks so the receiver can start cold.
- **Where to start a Codex session:** in `D:\Wildwright` for game code (it reads that
  repo's `AGENTS.md`, which points here), or in `D:\Mr.MakRepo\Kreav-Mr-Mak` for
  design docs. Whether Codex's sandbox lets it write to the other repo from either
  place is *(unverified)*; if not, give it both folders as writable roots or split the
  work by repo.
- **Saving tokens:** hand well-specified, mechanical work (implementing from a brief,
  running the build/test ladder, digesting a tutorial into notes) to one agent, and
  design, review and owner-facing decisions to the other. Share results through files
  (briefs, the session log), not long chat summaries.
- **Never run two editor-target builds or two generators on the same assets at
  once.** `-WaitMutex` serialises UBT, but generators can overwrite each other.
- **Where things get written down:** decisions in [04](04-decisions.md); current
  state in the [README](../README.md); history in the [session log](06-session-log.md);
  how-to in this guide; task briefs in `07-*`.
