# Tharrn — Engineering guide

How to build, test and verify the Unreal project, how it is laid out, and what has bitten us
before. Written for whichever agent picks the work up next (Claude Code or Codex) and for the
owner. Commands were run on this machine unless marked *(unverified)*. Most of it was learned on
the earlier project (deleted 2026-10-15) and carried over with its setup (D-03).

Read the [README](../README.md) first; the design is in [gdd/](gdd/00-overview.md); decisions in
[decisions.md](decisions.md).

## 1. Where things are

| What | Where |
|---|---|
| Design record | `D:\Mr.MakRepo\Kreav-Mr-Mak\projects\Tharrn\` (inside the Mr. Mak repo) |
| Unreal project | `D:\Tharrn\`: its own Git repo on `main` with LFS, **local only, no remote** (D-03) |
| Engine | UE **5.8.3** at `D:\UE_5.8`, an installed (launcher-type) build. Launch `UnrealEditor.exe` directly |
| Compiler | VS 2022 17.14.41, `cl.exe` 14.44.35229 |
| Packs | Outside Git, staged from the launcher cache by `Tools/Packs/stage_packs.py` (D-08) |
| Agent scratch | `D:\Tharrn\Saved\<Agent>Scratch\` (ignored by Git) |

### Inside the game repo

| Path | Contents |
|---|---|
| `Source/Tharrn/` | Template character (with an ability system component), controller (also the net probe's ping), game mode; `World/TharrnSky`; `Dev/TharrnCaptureSubsystem` (review images, development builds only) |
| `Source/Tharrn/Data/` | Row types for the data tables (`FTharrnWeaponRow`, `FTharrnCreatureRow`, `FTharrnZoneRow`) and `UTharrnDataLibrary` (zone at a position, list parsing) |
| `Source/Tharrn/Net/` | `ATharrnNetProbe`: replicated counter and ping for the network test (P1) |
| `Source/Tharrn/Tests/` | Automation tests `Tharrn.Data.*`, `Tharrn.Net.*` |
| `Source/TharrnEditor/` | `UTharrnWorldBuildLibrary`: Landscape from raw heights, edit-layer merge, ribbon and stone-block meshes, blocking PCG generation; Tharrn's own MCP toolsets `TharrnEditor.TharrnBlueprintNotesToolset` (comment boxes: add, list, remove; node comments; variable and Blueprint descriptions) and `TharrnEditor.TharrnPlaySessionToolset` (play session worlds, late-joining client), registered by `UTharrnToolsetsSubsystem`; tests `Tharrn.Editor.*` (editor only) |
| `Data/` | Game data source: CSV and JSON (its README) |
| `Tools/Mcp/` | `tharrn_mcp.py`: the small MCP client every script below uses |
| `Tools/Data/` | `import_data_tables.py`: CSV to data tables, read back and compared |
| `Tools/TestRange/` | `build_test_range.py`: `BP_NetProbe`, `BP_TargetDummy`, map `L_TestRange` |
| `Tools/Packs/` | `stage_packs.py`, `packs.csv` (Game Animation Sample, Sci-Fi Complete Bundle, the PCG biome framework from PCG Biomes Poplar Forest) |
| `Tools/Checks/` | `verify.py` (steps 1–4 below in one run), `check_editor_only_plugins.ps1`, `measure_budget.ps1` / `.py`, `run_tests.py`, `net_test.py` |
| `Content/Tharrn/` | `Data/` (DT_Weapons, DT_Creatures, DT_Zones), `Dev/` (BP_NetProbe, BP_TargetDummy), `Maps/L_TestRange` |
| `Tools/Terrain/` | Lidar-to-Landscape pipeline carried over, not yet re-run (its README) |
| `Config/` | Budget and DLSS (`DefaultEngine.ini` `[SystemSettings]`), default tier (`DefaultGameUserSettings.ini`), cue path and Game Features rule (`DefaultGame.ini`), Game Animation Sample tags (`Tags/`) |
| `Content/ThirdPerson`, `Characters`, `Input`, `LevelPrototyping` | Template content (tracked) |
| `Content/ScifiOutpost`, `Content/EasyBiomes`, Game Animation Sample folders | Staged packs (ignored) |
| `AGENTS.md`, `CLAUDE.md`, `.mcp.json` | Agent rules for this repo; MCP entry for chats started here |

Class prefix is `Tharrn` (`ATharrnCharacter`); the module is `Tharrn`; the log
category is `LogTharrn`; content specific to the game goes under `/Game/Tharrn/`.

## 2. Everyday commands (PowerShell)

```powershell
$UE   = "D:\UE_5.8"
$Proj = "D:\Tharrn\Tharrn.uproject"

# Open the editor. From a Mr. Mak chat, start it through Explorer so it is not a child of the chat:
#   a .cmd containing  start "" "D:\UE_5.8\Engine\Binaries\Win64\UnrealEditor.exe" "D:\Tharrn\Tharrn.uproject"
#   then  explorer.exe <that .cmd>

# Build the GAME target (works while the editor is open) and the EDITOR target (editor closed)
& "$UE\Engine\Build\BatchFiles\Build.bat" Tharrn Win64 Development "-Project=$Proj" -WaitMutex
& "$UE\Engine\Build\BatchFiles\Build.bat" TharrnEditor Win64 Development "-Project=$Proj" -WaitMutex
# Shipping, the configuration players get (cooked builds only, D-03): build it before a module closes
& "$UE\Engine\Build\BatchFiles\Build.bat" Tharrn Win64 Shipping "-Project=$Proj" -WaitMutex

# Plugin check: no AI, MCP or editor-tool plugin can reach the game
powershell -NoProfile -File D:\Tharrn\Tools\Checks\check_editor_only_plugins.ps1

# Headless automation tests (or through MCP: AutomationTestToolset, see §3)
& "$UE\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" $Proj -ExecCmds="Automation RunTests Tharrn; Quit" `
  -TestExit="Automation Test Queue Empty" -unattended -nullrhi -nosplash -nosound -abslog=D:\Tharrn\Saved\Logs\tests.log

# Frame budget of a map at 1440p in the default tier (D-11)
powershell -NoProfile -File D:\Tharrn\Tools\Checks\measure_budget.ps1 -Map /Game/ThirdPerson/Lvl_ThirdPerson

# Packs (editor closed): stage, list sizes, or remove
python D:\Tharrn\Tools\Packs\stage_packs.py [--pack SciFiBundle] [--dry-run] [--remove "<Pack>"]

# With the editor open (they talk to Unreal MCP); each ends with RESULT ok or RESULT failed
python D:\Tharrn\Tools\Checks\verify.py [--quick]                 # ladder steps 1-4: game build, plugins, data, tests, network
python D:\Tharrn\Tools\Data\import_data_tables.py [Weapons]    # Data/*.csv -> /Game/Tharrn/Data
python D:\Tharrn\Tools\Checks\run_tests.py [Tharrn.Data]       # automation tests, default every 'Tharrn' test
python D:\Tharrn\Tools\TestRange\build_test_range.py            # test range map and its Blueprints
python D:\Tharrn\Tools\Checks\net_test.py [seconds]            # network test; L_TestRange must be open
```

Build output to check: `Result: Succeeded` and no `error` or new `warning C` lines. The NWIRO
plugin's Build.cs prints a vendor warning (`ShadowVariableWarningLevel is obsolete`): harmless.
Automation can exit 0 when a test fails; read every `Test Completed` line.

### Live editor through Unreal MCP (D-06)

The editor-only `ModelContextProtocol` and `AllToolsets` plugins are on; the server starts with the
editor (`bAutoStartServer=True`, port 8000, `/mcp`, in the per-user
`Saved/Config/WindowsEditor/EditorPerProjectUserSettings.ini`). Claude Code reaches it as
`unreal-mcp` (registered for the Mr. Mak folder with `claude mcp add --scope local --transport http
unreal-mcp http://127.0.0.1:8000/mcp`; `D:\Tharrn\.mcp.json` holds the same entry). A chat
loads MCP servers when it starts; one started before the editor needs a restart to see them.

- Tool search is on: `list_toolsets`, `describe_toolset`, `call_tool` (`toolset_name`, `tool_name`,
  `arguments`). About 70 toolsets: actors, assets, Blueprints, materials, static meshes, scene, PCG
  (graphs, spatial, Biome Core), Niagara, Sequencer, StateTree, behaviour trees, GAS inspectors,
  automation tests, Live Coding, config settings, logs, PIE control, viewport capture.
- Project skills: `ToolsetRegistry.AgentSkillToolset` `ListSkills` / `GetSkills` (PCG graphs, PCG Biome
  Core and its debug checklist, instant level operations, outdoor lighting, material and Blueprint
  basics, Niagara). Read the matching one before that kind of work.
- `ProgrammaticToolset.execute_tool_script` runs a sandboxed Python script that chains tool calls (no
  `unreal` module).
- Rebuild C++ with the editor open through `LiveCodingToolset`; read every result (they flip between
  success and failure without an exception); save before and after bulk changes; stop PIE before
  asset edits.

## 3. Verification ladder (definition of done for every module, D-06)

1. Game and editor targets build; no new warnings. Plugin check prints `PASS`.
2. Data imports with 0 problems; generators end with `RESULT ok`.
3. Automation tests pass. **New behaviour needs a test** with the normal case and at least two
   failure cases.
4. **Network test (D-04):** the feature works in PIE as **Listen Server with 2 clients** and as
   **Client with a dedicated server** ("Play as Client"), with simulated latency and loss: state
   changes on the server only, clients see the same result, a late-joining client sees the current
   state. `Tools/Checks/net_test.py` does this for the net probe (50 ms each way, 1 % loss, a third
   client joining halfway); a new feature adds its own `[TH...]` log lines and checks in the same way.
5. World or rendering work: the protocol's budget table and Verification block
   (`measure_budget.ps1`, `stat unit`, `stat gpu`, `r.Nanite.Visualize Overdraw`).
6. Owner play-test with exact steps and expected results, only for what the owner can see or feel; the test
   map itself says what to try (a sign with the controls and the checks). The owner's yes closes the module.
   A module with nothing to play closes on the automated checks: P1's play-test asked the owner to read
   network counters, and the owner, running around the test range, found nothing to test (2026-10-16).
7. Commit only with the owner's approval; update the README, the [session log](session-log.md) and
   the [decision log](decisions.md).

## 4. Budget settings (D-11, D-12)

| Setting | Where | Value |
|---|---|---|
| Upscaler | `DefaultEngine.ini` `[SystemSettings]` | `r.NGX.DLSS.Enable=1` (DLSS 4.5 plugin 8.8.0 in `Engine/Plugins/Marketplace`); TSR (`r.AntiAliasingMethod=4`, `r.TemporalAA.Upscaler=1`) without DLSS |
| Default tier | `DefaultGameUserSettings.ini` `[ScalabilityGroups]` | High overall; GI and reflections Medium (Lumen irradiance volume); `sg.ResolutionQuality=66.662` (DLSS Quality) |
| Shadows | `[SystemSettings]` | `r.Shadow.Virtual.Cache.StaticSeparate=1` |
| Pools | `[SystemSettings]`, `[/Script/Engine.VirtualTexturePoolConfig]` | textures 3000 MB (capped to VRAM), Nanite 768 MB, virtual textures 128 MB per pool |

Baseline (earlier project, template level, 1440p, development PC RTX 4060 Ti, editor closed): 8.1 ms
frame, 7.4 ms GPU, 2.1 ms game thread; DLSS 1.6 ms; template clouds 1.9 ms. Measure with the editor
closed: an open editor once took 96 % of the GPU.

## 5. Conventions

- **C++ and Blueprints (D-07):** complex systems in C++, simple content in Blueprints. **Notes in
  both:** every C++ class starts with a comment saying what it does, who uses it and what to tune;
  non-obvious logic is commented; Blueprints have a comment box around each step and a description on
  every variable and function.
- **Data:** CSV files imported into data tables; the CSV is the source, never hand-edit the table.
  DataTable CSV syntax: first header cell `---` (row name); `FGameplayTag` as
  `"(TagName=""A.B"")"`; containers as `"(GameplayTags=((TagName=""A""),(TagName=""B"")))"`;
  `FLinearColor` as `"(R=..,G=..,B=..,A=..)"`.
- **Networking (D-04):** the server decides; clients predict only where the design asks (movement,
  firing) and are corrected. Replicated state lives on the actor or component that owns it, with
  `OnRep_` handlers for presentation. RPC names: `Server_`, `Client_`, `Multicast_`. Never trust a
  client value for damage, loot or flags.
- **Content paths (owner's conventions, `source/owner-package-2026-10-15/dev_notes.md`):** art (meshes, textures, materials,
  effects, audio) under `/Game/Art/`; game logic (Blueprints, data tables, maps, UI, AI) under
  `/Game/Tharrn/`. Meshes `CH_` character, `CR_` creature, `WP_` weapon, `ENV_` environment;
  textures `T_<name>_diff`, `_norm`, `_rough`, `_ao`, `_subs`; effects `VFX_<name>`; audio
  `SFX_<name>`, `MUS_<name>`, `VO_<name>`. Others: `L_` level, `BP_` Blueprint, `WBP_` widget, `DT_` data
  table, `IA_`/`IMC_` input, `M_`/`MI_` materials, `GA_`/`GE_`/`GC_` ability/effect/cue, `ST_` StateTree.
- **Generators** are idempotent and headless, log with an `[THxxx]` prefix, end with `RESULT ok` or
  `RESULT failed`, drop module-level Unreal references and `gc.collect()` before `quit_editor()`.
- **English** for everything stored.

## 6. Git and commits

- The owner approves every commit. Prepare, show the file list, wait.
- Game repo: never `Binaries/`, `Intermediate/`, `Saved/`, `DerivedDataCache/`, `.vs/`, `.env`, logins,
  tokens; packs stay ignored (the generated block in `.gitignore`). `.uasset`, `.umap` and media go to
  LFS (`.gitattributes`). **No remote, no push, no public repo** (D-03).
- Mr. Mak repo: the owner has unrelated uncommitted work; stage only `projects/Tharrn/` and
  the files named for the task.

## 7. Gotchas carried over (read before you debug)

**Build and engine**
1. UE 5.8 bans MSVC 14.40–14.43 and 14.44.0–14.44.35210; UBT reads the version from `cl.exe`.
2. The editor target cannot build while the editor is open: build the game target, or use Live Coding.
3. Every AI and MCP plugin stays editor-only (`TargetAllowList: Editor` or an EditorOnly plugin);
   Unreal MCP has Runtime modules. Run the plugin check after any plugin change or Visual Studio prompt
   (Visual Studio's Unreal integration once rewrote the `.uproject` and dropped every allow-list).
4. The open editor owns MCP port 8000; a second editor logs `HttpListener unable to bind`: harmless.
   Only one editor with MCP at a time.
5. `AllToolsets` turns on Game Features, which needs an Asset Manager rule for `GameFeatureData`
   (in `DefaultGame.ini`), or the editor reports an error at every start.
6. Without `GameplayCueNotifyPaths` the ability system scans all of `/Game` for cues (slow with the
   packs). In 5.8.3 the path is applied from `[/Script/GameplayAbilities.AbilitySystemGlobals]`; set it
   there and in the developer settings.
7. **Dedicated server builds need an engine built from source.** The installed engine at `D:\UE_5.8`
   cannot build `Server` targets *(standard for installed builds; not tried here)*. PIE "Play as
   Client" runs a server inside the editor and is enough for development (OQ-02).

**Editor Python (UE 5.8)**
8. `execute_console_command(None, ...)` with map commands crashes; pass the editor world.
9. Deleting a map and recreating it at the same path in one session fails; delete its
   `__ExternalActors__`/`__ExternalObjects__` folders and rescan first.
10. `take_high_res_screenshot` writes nothing in a headless `-RenderOffscreen` editor; review images
    come from the capture subsystem in `-game`, or MCP `CaptureViewport` in the live editor.
11. `unreal.Rotator` positional order is (roll, pitch, yaw): use keywords.
12. A `-ExecutePythonScript` run must call `quit_editor()`; `Automation RunTests` needs
    `-TestExit="Automation Test Queue Empty"`.
13. Scripts that build Landscapes must pop module-level Unreal references and `gc.collect()` before
    quitting, or Python's shutdown crashes the editor after saving.

**Landscape, PCG, World Partition**
14. Landscape edit layers merge on the GPU: build Landscapes with `-RenderOffscreen`, never `-nullrhi`,
    and call `FinishLandscapeEditLayers` before saving.
15. PNG import blanks the colour of fully transparent pixels: never store data in a mask's alpha.
16. Some packs store packed roughness as sRGB colour textures (far too glossy): check before use.
17. `-ResX/-ResY` are DPI-scaled in `-game`; set `r.SetRes` instead.
18. PCG in 5.8: the default input node has no Landscape pin (use Get Landscape Data); point-texture
    intersections give lazy spatial data (use Sample Texture); headless scripts must tick PCG.
19. The Water plugin is Experimental and rendered rivers broken on lidar terrain; ribbon meshes worked.
    The archipelago's ocean needs its own test (OQ-05).

**Machine and tools**
20. Quitting Mr. Mak ends every process its chats started: start the editor through Explorer.
21. Windows PowerShell 5.1 reads BOM-less files as ANSI: use `-Encoding UTF8` or
    `[IO.File]::ReadAllText`; prefer Python for text edits.
22. `Select-String` takes the pattern first unless named: write `-Path` and `-Pattern`.
    In Claude Code's Bash tool a double backslash inside a heredoc reaches the program as one, so a Python edit
    of `D:\\Tharrn\\Tools` can turn `\\t` or `\\v` into a control character. Put such edits in a script file
    (raw strings), then scan for control characters.
23. The launcher downloads into `VaultCache\<pack>\stage`, then moves it to `data`; stage a pack only
    after `data` holds its files. Its `FabLibrary/listings_v1.db` holds `is_ai_forbidden` per listing.
24. DLSS for an installed engine lives in `Engine/Plugins/Marketplace`; NVIDIA's binaries load only if
    their `BuildId` matches the engine (55116800 for 5.8.3). For DLSS in PIE, turn off Editor
    Preferences > Performance > "Override game screen percentage settings with editor settings in PIE".
25. `UnrealEditor.exe -game` reads `Saved\Config\WindowsEditor\GameUserSettings.ini` (the editor's own
    Epic tier); measurements set the tier explicitly. The CSV profiler does not quit the game:
    `measure_budget.ps1` stops the process it started.
26. The `SemanticSearchToolset` (part of `AllToolsets`) creates an OpenAI embedding provider at start.
    It sends nothing without an API key and a search request; do not configure a key without the owner.

**Unreal MCP, tests and networking (learned in P1)**
27. Tool arguments are camelCase (`assetPath`, `propertiesJson`, `graph`), including C++ tools whose
    parameters are PascalCase in the header. Struct fields and data-table row fields are camelCase too.
28. Blueprint notes: `BlueprintTools` cannot set node comments or variable descriptions, its comment box
    did not work reliably, and `delete_node` fails on comment nodes (so a rebuild that ignores the error stacks
    up boxes); use `TharrnEditor.TharrnBlueprintNotesToolset` (`RemoveCommentBox` to delete one).
    `read_graph_dsl` marks a Blueprint unsaved: after reading a pack's Blueprints, save or restage them before
    the editor closes.
29. Graph DSL names (`BlueprintTools.write_graph_dsl`): a C++ Blueprint event is
    `<Category>|Event<Name>` (`NetProbe|EventOnCounterChanged`); the construction script is
    `(fn ConstructionScript () ...)`; a component getter is `Variables|Default|Get<Component>`; a variable
    in a category is `Variables|<Category>|Get<Name>`.
30. Before closing the editor, save through MCP (`AssetTools.find_assets`, `is_dirty`, `save_assets`),
    then close its main window. An unsaved asset opens a "Save Content" dialog that blocks the close.
    Closing and reopening the editor needs the owner's permission (game repo `AGENTS.md`).
31. Play settings are `ConfigSettingsToolset` container `Editor`, category `LevelEditor`, section `PlayIn`
    (`playNetMode`, `playNumberOfClients`, `runUnderOneProcess`, `networkEmulationSettings`). They are
    saved per user; a script that changes them puts them back (`net_test.py` does).
32. An editor in the background runs at about 3 frames a second ("Use less CPU when in background",
    `Editor` / `General` / `EditorPerformanceSettings` `bThrottleCPUWhenNotForeground`). Every round trip
    then reads about 1000 ms. `net_test.py` turns it off while it runs.
33. A late-joining client runs `BeginPlay` on map-placed actors with the map's values, before the
    server's arrive. Show or log a replicated value only after its `OnRep_` (use `REPNOTIFY_Always` so an
    unchanged value still notifies), as `ATharrnNetProbe` does.
34. Tests of a tool's errors call it through `FToolCallExceptionHandler::CaptureErrorsIn` with
    `AddExpectedErrorPlain`. MCP's `RunTestsByFilter` then reports those script errors on the call itself;
    `run_tests.py` reads the results with `GetTestResults`. Latent spec tests can start their own PIE
    session (`GEditor->RequestPlaySession`), as `Tharrn.Editor.PlaySession` does.
35. A data-table field called `Name` clashes with the row name: the CSV's `name` column imports into
    `DisplayName`.
36. The Android File Server plugin writes a `SecurityToken` into `Config/DefaultEngine.ini`. It is
    switched off in `Tharrn.uproject` (PC only); still read `git diff Config/` before every commit.
37. The editor opens `L_TestRange` (`EditorStartupMap`); the game's default map is still the template level.
    Scripts that need a map check it with `SceneTools.get_current_level` first: PIE plays whatever is open.
38. PCG Biomes Poplar Forest ships `M_PCGIcon` referring to a texture the pack does not contain
    (`/Game/EasyBiomes/Textures/Icons/Thumbnails/A_Logo`), so the editor logs one Load Errors entry at start.
    Harmless: an editor-only icon material falls back to the default texture.

## 8. Working as two agents

Claim an area in the README's ownership table before editing; one agent per area. Hand off with a
brief (repo skill `.agents/skills/feature-handoff/SKILL.md`) in `docs/briefs/`. Never run two
editor-target builds or two generators on the same assets at once.
