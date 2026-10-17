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
| `Source/Tharrn/` | The template's character (no longer the default pawn, D-18), controller (input mappings, the net probe's ping), game mode; `World/TharrnSky`; `Dev/TharrnCaptureSubsystem` (review images, development builds only) |
| `Source/Tharrn/Data/` | Row types for the data tables (`FTharrnWeaponRow`, `FTharrnCreatureRow`, `FTharrnZoneRow`) and `UTharrnDataLibrary` (zone at a position, list parsing) |
| `Source/Tharrn/Net/` | `ATharrnNetProbe`: replicated counter and ping for the network test (P1); `TharrnNetText` (which machine a world is, for logs) |
| `Source/Tharrn/Player/` | The player (P2, D-18): `ATharrnPlayerCharacter` (ability system, the mouse wheel's weapon choice, the movement tests `th.MoveTest`), `UTharrnCharacterMovementComponent` (gait, speeds and turning, all predicted; the server's mantle and vault check; no slide since D-24) and `ATharrnPlayerCameraManager` (the view through the sight while aiming, D-24; `th.SightView`) |
| `Source/Tharrn/Combat/` | Weapons (P3, D-23): `UTharrnWeaponComponent` (shots predicted on the player's machine, checked and decided on the server with bodies rewound to the shot, ammunition and reload; follows the MSS weapon in the hand), `UTharrnCombatLibrary` (zones, armour, falloff, spread seed, recoil, projectile path, shot checks), `UTharrnCombatSubsystem` (bodies and their history), `UTharrnAttributeSet` and `UTharrnDamageEffect` (health through the ability system), `ATharrnProjectile` (the grenade launcher's round: flies, explodes where it lands, D-24), `UTharrnCombatSubsystem::Explode` (the server's blast: falloff, armour, walls shield), `UTharrnExplosiveComponent` (on Tharrn's hand grenade: the count, the throw, the blast), `TharrnMss` (the few calls into MSS's Blueprints, by name), `ATharrnTarget` (test-range targets), `UTharrnWeaponLookComponent` (on Tharrn's MSS weapons: the shot, reload and ammunition events, tracer and hit effects, where the eye sits behind the sight); test CVars `th.FireTest`, `th.FireTestSlot`, `th.FireTestAim`, `th.FireTestOnly`, `th.FireTestSeconds`, `th.HeldWeapons`, and `th.Press` (press an input action) |
| `Source/Tharrn/Inventory/` | D-25 (P4): `UTharrnInventoryComponent` (the player's inventory, the server owns it: hotbar, grid, worn slots, weight, pickups, drops; test command `th.Inv`), `TharrnInventory` (its rules, tested on their own), `ATharrnPickup` (an item lying in the world; a bag holds a downed player's things) |
| `Source/Tharrn/Survival/` | P5: `UTharrnVitalsLibrary` (GDD 03's formulas and the tuning from `DT_Vitals`), `UTharrnVitalsComponent` (hunger, hydration, temperature on the server; the rules' answers on every machine; test command `th.Vitals`, `th.VitalsRate`), `UTharrnCraftingComponent` (the queue the server runs; `th.Craft`), `ATharrnClimateVolume` (an area's air temperature). Stamina itself lives in `UTharrnCharacterMovementComponent` (predicted, gotcha 85) |
| `Source/Tharrn/UI/` | D-25 (P4): the widgets' logic in C++, their look in Widget Blueprints (`Tools/UI/build_ui.py`): `UTharrnItemSlotWidget` (one slot, drag and drop), `UTharrnHotbarWidget`, `UTharrnInventoryScreen`, `UTharrnGameHudWidget` (hotbar, the vitals cluster, weight, pick-up prompt, hit markers), `UTharrnCraftingPanel` with its recipe and queue rows (P5), `UTharrnDeathScreen` (P5); `ATharrnPlayerController` puts them on screen (the HUD class is Easy Game UI's) |
| `Source/Tharrn/Tests/` | Automation tests `Tharrn.Data.*`, `Tharrn.Net.*`, `Tharrn.Player.*`, `Tharrn.Combat.*`, `Tharrn.Inventory.*`, `Tharrn.Vitals.*`, `Tharrn.Crafting.*` |
| `Source/TharrnEditor/` | `UTharrnWorldBuildLibrary`: Landscape from raw heights, edit-layer merge, ribbon and stone-block meshes, blocking PCG generation; Tharrn's own MCP toolsets `TharrnEditor.TharrnBlueprintNotesToolset` (comment boxes: add, list, remove; node comments; variable and Blueprint descriptions) and `TharrnEditor.TharrnPlaySessionToolset` (play session worlds, late-joining client, console commands in a play world, a picture of one world's game view), `TharrnEditor.TharrnAnimToolset` (AnimGraph nodes, linked anim graphs in and out, skeleton sockets, IK retargeters, batch retargeting) and `TharrnEditor.TharrnBlueprintSetupToolset` (where Blueprint components attach, Blueprint interfaces, property values as Unreal text), `TharrnEditor.TharrnWorldBuildToolset` (new levels, landscapes from height and paint files, saving Tharrn's levels without asking, an actor's editor buttons such as the Sci-Fi bundle's PCG Generate, PCG progress, unsaved packages in pack folders and forgetting them), registered by `UTharrnToolsetsSubsystem`; tests `Tharrn.Editor.*` (editor only) |
| `Data/` | Game data source: CSV and JSON (its README) |
| `Tools/Mcp/` | `tharrn_mcp.py`: the small MCP client every script below uses; `tharrn_blueprints.py`: Blueprint helpers the build scripts share |
| `Tools/Data/` | `import_data_tables.py`: CSV to data tables, read back and compared |
| `Tools/TestRange/` | `build_test_range.py`: `BP_NetProbe`, `BP_TargetDummy`, map `L_TestRange` (targets, net probe, 8 player starts in 4 lanes, a mantle and vault course of the sample's traversable blocks, an item table (P4, P5: resources, rations, water), a cold and a hot area (P5), a sign with the controls) |
| `Tools/Weapons/` | `setup_mss.py` (MSS on the UEFN skeleton: sockets, retargeter, retargeted animations, pose data, the player's animation Blueprint with MSS's upper-body layer, the throw montage, MSS's collision channels; output in `/Game/MSS_Tharrn`, outside Git, remade by the script), `build_mss_weapons.py` (`BP_TharrnWeapon_SMG`, `_Pistol`, `_Heavy`, `BP_TharrnGrenadeRound`, `BP_TharrnHandGrenade`), `build_mss_player.py` (MSS on `BP_TharrnPlayer`, the wheel's `IMC_TharrnCombat`, the camera manager on the controller). Order after staging MSS or the sample: setup, weapons, player ([mss.md](mss.md)). (`build_weapons.py` and its shape-built test weapons were removed with D-24.) |
| `Tools/Player/` | `build_player.py`: `BP_TharrnPlayer` from the Game Animation Sample's Character Movement character, `BP_TharrnPlayerController`, `BP_TharrnGameMode`, the project's default game mode |
| `Tools/Packs/` | `stage_packs.py`, `packs.csv` (Game Animation Sample, Sci-Fi Complete Bundle, Multiplayer Shooter System, Easy Game UI; guides: [scifi-bundle.md](scifi-bundle.md), [mss.md](mss.md), [easy-game-ui.md](easy-game-ui.md)) |
| `Tools/Checks/` | `verify.py` (steps 1–4 below in one run), `check_editor_only_plugins.ps1`, `measure_budget.ps1` / `.py`, `run_tests.py`, `net_test.py`, `mss_test.py`, `inventory_test.py` (D-25: the inventory with a listen and a dedicated server), `survival_test.py` (P5: vitals, food and water, cold, crafting, running out of stamina, the bag; listen and dedicated server), `nature_test.py` (P6: players run through the bundle's generated nature on `L_CoastTest` with no corrections; listen and dedicated server) |
| `Tools/UI/` | `build_ui.py` (D-25): icons, the Widget Blueprints in MSS's look, `BP_TharrnHUD`, Easy Game UI's settings copies and its selector, `BP_TharrnGameInstance`, the main menu level, the project's start level |
| `Content/Tharrn/` | `Data/` (DT_Weapons, DT_Creatures, DT_Zones), `Dev/` (BP_NetProbe, BP_TargetDummy), `Maps/L_TestRange`, `Characters/Player/BP_TharrnPlayer`, `Core/` (BP_TharrnGameMode, BP_TharrnPlayerController, BP_TharrnGameInstance, BP_TharrnMenuGameMode), `Input/` (the hotbar, wheel, pick-up, inventory and pause actions, `IMC_TharrnCombat`), `UI/` (the Widget Blueprints, BP_TharrnHUD, Easy Game UI's settings copies, icons), `Maps/L_TharrnMainMenu`, `Weapons/` (placeholders, the heavy round, `MSS/` Tharrn's MSS weapons) |
| `Tools/World/` | `build_coast_level.py` (a coast level from a built terrain: landscape, virtual textures, sky, ocean, the bundle's biome volume, generation, pictures; levels under `/Game/Tharrn/Scratch/` are for comparisons, outside Git); `setup_bundle_biomes.py`: Tharrn's versions of the Sci-Fi bundle's run-time PCG graphs (the bushes and small boulders made around players have no collision), made into `/Game/ScifiOutpost_Tharrn/` (outside Git, remade by the script); `draw_island_layout.py` (the main map's island and a biome per zone as a picture; its `island()` gives the same coast on any grid) and `island_blockout.py` (the island as a blockout level: terrain, build, pictures labelled with the zones and the start) |
| `Tools/Terrain/` | Lidar-to-Landscape pipeline carried over, not yet re-run (its README); `test_coast.py`, the made-up coast for P6's ocean and biome tests (heights and the bundle's jungle paint layers, run with `Saved/PyTerrain`); `coast_terrain.py`, candidate coasts from USGS 1 m lidar tiles (overview maps, 2 km windows with a seabed and the paint layers) |
| `Config/` | Budget and DLSS (`DefaultEngine.ini` `[SystemSettings]`), default tier (`DefaultGameUserSettings.ini`), cue path and Game Features rule (`DefaultGame.ini`), Game Animation Sample tags (`Tags/`) and its data-driven console variables, collision channels and console variables (`DefaultEngine.ini`, D-18) |
| `Content/ThirdPerson`, `Characters`, `Input`, `LevelPrototyping` | Template content (tracked) |
| `Content/ScifiOutpost`, `DMD`, `EasyGameUI`, Game Animation Sample folders | Staged packs (ignored) |
| `Content/MSS_Tharrn` | Made from MSS by `setup_mss.py` (ignored; the script remakes it) |
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
python D:\Tharrn\Tools\Player\build_player.py [--fresh]          # the player Blueprint, controller, game mode
python D:\Tharrn\Tools\Checks\net_test.py [seconds]            # network test (probe, movement, block course, made-up mantle, shots); L_TestRange open
python D:\Tharrn\Tools\Checks\mss_test.py                     # MSS weapons on a client: draw, fire, reload, swap, sight, wheel, launcher, grenades
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
   client joining halfway) and the player (P2: every player runs a scripted path with `th.MoveTest`, one
   runs the block course, every client sends a made-up mantle) and the shots (P3: players shoot targets and a
   running player, made-up shots, the launcher round's flight and blast; under 2 % of shots may disagree between a
   player's machine and the server, C-04); `Tools/Checks/mss_test.py` checks MSS's weapons on a client (equip, fire,
   reload, swap, the view through the sight, the mouse wheel, the launcher, grenades); a new feature adds its own `[TH...]` log lines and checks in the same way. Console variables reach a play world through
   `TharrnPlaySessionToolset.RunConsoleCommand`; test input goes through Enhanced Input's
   `InjectInputForAction`, as keys would.
5. World or rendering work: a budget table against D-11
   (`measure_budget.ps1`, `stat unit`, `stat gpu`).
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
38. The Sci-Fi bundle's PCG is its own system (data assets, `BP_PCG_Biome`), not Unreal's experimental PCG
    Biome plugin, which is off since PCG Biomes Poplar Forest was removed (2026-10-16, D-20). The base `PCG`
    plugin is enabled on its own in `Tharrn.uproject`, because the bundle's runtime graphs need it in the game.
39. The Game Animation Sample's character needs config from the sample's `DefaultEngine.ini`: its data-driven
    console variables (`DDCvar.*`; without them its camera system stays off), the `Traversable`, `Mouse` and
    `Obstacle` collision channels (mantle and vault trace `Traversable`) and
    `p.EnableCharacterAccelerationReplication=1` (other players' copies animate from it). Copied into Tharrn's.
40. The sample's mantle and vault work only on its `LevelBlock_Traversable` actors: its check casts to them and
    reads their ledge splines. Mantling on world geometry needs a ledge finder of Tharrn's own (with P6).
41. The sample's mantle trusts the player's machine: while the move plays, the server takes the position the
    player sends. `UTharrnCharacterMovementComponent` checks for a ledge first and refuses otherwise. Sweeps
    on `Traversable` meet a sample block on a plane through its middle, and downward traces miss its top;
    the check measures the hit part's bounds instead.
42. `BlueprintTools.compile_blueprint` raises on compile errors and returns nothing on success. A Blueprint's
    `Status` cannot be read through `ObjectTools` (a Blueprint reference resolves to its class default object).
    `ObjectTools` does reach actors in a play world (`/Game/.../UEDPIE_0_<Map>.<Map>:PersistentLevel.<Actor>`).
43. A busy editor runs game time slower than the clock (the first play after starting builds the motion matching
    indexes): tests wait for their result lines rather than a fixed time.
44. A map copied from an engine template keeps the template's player start at the origin; the test range
    removes it (players spawned there ran into the 10 m target).
45. Close the editor and confirm it is gone before building or reopening: a failed step in a chained command
    once launched a second editor while the first was open (2026-10-16). `rebuild.sh`-style scripts that stop
    at the first failed step avoid it; only one editor may hold MCP's port.
46. The sample's mantle and vault fly the character while the montage plays and set it back only when the montage
    ends normally; an interrupted move leaves it flying (and, on the server, trusting the player). Under lag the
    server's copy of a move runs late: a correction sent during the move handed the player the server's
    mid-move "flying" and left them floating (found by `net_test.py`, 2026-10-16). So: no corrections during an
    approved move (far-off positions are refused instead), and `RecoverFromStuckTraversal` puts a player left
    flying without a montage back to walking after 0.25 s and ends the server's trust. The server's own copy of a
    move is sometimes left flying too (seen on a dedicated server); after the net returns it, the player can slip
    off the ledge and the sample's ledge catch climbs back up, so the course check counts at least three
    traversals, not exactly three.
47. After dozens of play sessions in one editor session, runs with network emulation started to show steady
    position corrections (about 30 per player per path, even at 0 ms and 0 % loss) that a fresh editor does not
    show (0). Restart the editor before the network test when it has run many sessions. `LogsToolset.GetLogEntries`
    returns the oldest matching lines first, so the test scripts ask for all of them.
48. `GameStateBase::GetServerWorldTimeSeconds` on a client is the server's time one trip ago (no latency
    compensation): rewind other players to the shot's own clock time, not one trip earlier (measured: subtracting
    another trip put shots in the wrong zone). A body that changes (down, up) reaches the shooter a frame or two after
    its clock passes the moment, so the server gives shots 0.25 s of grace (`StateChangeGraceSeconds`; damage to a
    body already down does nothing, so the grace only makes the shooter's hit marker agree with what it saw).
    The block course's position check waits for the runner to stand: a moving player's own machine is one trip
    ahead of the server (about 40 cm at the end of the course), which measured latency, not error.
49. The player's machine must treat a reload as started when it asks for it: otherwise it fires for one round trip
    and the server refuses those shots. The server replicates the last shot it handled with the ammunition, so the
    machine knows which of its shots the magazine count already includes.
50. A projectile traced in straight steps sags under its arc by g·dt²/8 per step: on a long server frame (0.1 s)
    that is over a centimetre, so `ATharrnProjectile` flies in steps of at most 1/60 s.
51. A Blueprint reparented to a C++ class it never had can keep a broken class default object; deleting and
    recreating the Blueprint fixed it (`BP_TargetDummy`).
52. `NS_Beam_Impact` from the Sci-Fi bundle made a large pink glow on hits; hits now use MSS's
    `NS_Impact_Projectile_Orange` (set on each weapon's `TharrnWeaponLook`).
53. `ObjectTools.set_properties` silently ignores `values` given as an object: pass a JSON string
    (`tharrn_blueprints.set_props`). It cannot write maps keyed by Blueprint enums or Blueprint structs (their
    fields carry hidden suffixes such as `Crouch_2_B957...`): use `TharrnBlueprintSetupToolset.GetPropertyText` /
    `SetPropertyText` and edit the text.
54. Graph DSL: overriding a parent Blueprint's custom event is `(event EventCE_Fire ...)`; `(event Custom|CE_Fire ...)`
    makes a new event named CustomEvent instead. A component's event (`OnShot`) cannot be made by the DSL: make it with
    `add_component_bound_event` first, then the DSL fills `(event OnShot(TharrnWeaponLook) (End bHit) ...)`. Two
    functions with one name in one category (the character's and the movement component's `IsSliding`) resolve to
    the wrong one. `get_node_type_pins` leaves the node in the graph: clear the graph before writing it.
55. A linked anim graph node made in C++ needs its class set the way the details panel does it (set `InstanceClass`,
    then `PostEditChangeProperty`); otherwise it has no input pose pins.
56. New assets cannot go under `/Temp` (not a content root); tests create under `/Game/Tharrn/Tests` and throw the
    packages away unsaved.
57. Reading a pack's Blueprint graph (`read_graph_dsl`, node infos) marks it unsaved; on closing, the editor then
    asks to save it and a scripted close stops. `save_dirty.py` also saves `/Game/MSS_Tharrn` and `/Game/DMD/Blueprints`.
58. `EditorAppToolset.CaptureViewport` renders the editor camera even during play, and so does `HighResShot` run in
    a play world; `CaptureEditorImage` shows the whole editor (floating windows such as the Message Log cover the
    view). `TharrnPlaySessionToolset.CaptureGameView` saves one play world's game view alone.
59. MSS's `CE_Fire`, `CE_Stop_Fire`, `CE_Reload` are called on the player's machine by its input (`FNC_Fire_Weapons`,
    `FNC_Reload_Weapons`); its effects come from server events and multicasts (`CES_`, `CEC_`). Calling a multicast
    from a listen server broadcasts it to every client, so Tharrn's weapons call MSS's effect functions directly.
60. MSS's collision channels are slots 1 and 2 in its project; Tharrn's are 4 (Projectile) and 5 (Laser) because the
    sample uses 1 to 3. MSS saves its projectiles and throwables as slot 1, which in Tharrn is the sample's
    "Traversable" (the ground ignores it): `setup_mss.py` step 8 moves them to slot 4. MSS's bullets and lasers are
    not fired (Tharrn's C++ decides shots); its grenades are thrown by MSS and decided by `UTharrnExplosiveComponent`.
61. Two of MSS's keys clash with the sample's: the middle mouse button (MSS shoulder swap, the sample's strafe toggle)
    and the gamepad's top face button (MSS swap weapon, the sample's interact).
62. The sample's chooser tables (`CHT_PoseSearchDatabases` and others) accept only `SandboxCharacter_CMC_ABP` as context: a
    copy of that animation Blueprint failed every frame on every character (about 100,000 errors in one network test,
    the frame rate down to a few frames a second, 30 position corrections per player). `setup_mss.py` therefore links
    MSS's layer into the sample's own animation Blueprint, a pack file, and is re-run after staging the sample.
63. MSS's shooter component calls its server event `CES_Update_HUD` from Tick on every machine; on other players'
    copies it cannot reach the server, and logs a network warning every frame for each of them. `setup_mss.py` puts a
    branch on MSS's own `FNC_Is_Controlled` in front of the HUD part of its Tick.
64. MSS expects the body to stay alive (its own respawn system): when Tharrn's game mode destroys a downed player,
    MSS's HUD widget and three weapon actors outlived it, kept ticking with a dead owner and piled up with each
    respawn. `UTharrnWeaponComponent::EndPlay` takes the widget off the screen and the server destroys the weapons.
65. MSS's HUD widget can log a Blueprint error as play starts (it reads its weapon list before it reaches the
    client), and its weapons can as play stops: `StartPIE` and `StopPIE` report those as failures although play
    started or stopped. The test scripts check `IsPIERunning` instead (`start_play`, `stop_play`).
66. Hits on a running player at the edge of a limb disagreed between the shooter's machine and the server in a few %
    of shots (the shooter aims at a smoothed, extrapolated copy; the server rewinds its own history). The shot now
    carries what the shooter saw it hit (`FTharrnShot::ClaimedActor`, `ClaimedZone`); the server takes that when it
    fits the rewound body within 15 cm (`UTharrnCombatLibrary::ClaimFits`, `MissFits`), and keeps a miss the shooter
    saw on a body that is down. The checks of made-up shots stay as they were.
67. A full Blueprint compile (`FKismetEditorUtilities::CompileBlueprint` with no options) collects garbage. Inside
    a tool call, that frees objects nothing else keeps alive while the call is still using them: the tool tests
    crashed the editor in full runs. A tool compiles with `EBlueprintCompileOptions::SkipGarbageCollection`, and a
    spec roots the throwaway Blueprints it makes in `BeforeEach` and unroots them in `AfterEach`.
68. MSS's grenade throw: G spawns the grenade in the left hand on the server; the fire button pulls the pin only while
    aiming (MSS's `CES_Activate_Throw_Object` needs Aiming and not hip aiming); letting go plays the throw montage
    and the grenade leaves at its notify. G pressed before that montage ends does nothing (a test pressing quickly saw
    G "stop working"). MSS names the UE5 throw montage in a pin default, which does not play on the UEFN skeleton:
    `setup_mss.py` step 7.
69. MSS turns a thrown grenade's collision and physics on 0.2 s after the throw through `Object_Throw_Reference`,
    which it has already cleared by then from the second throw on ("Accessed None ... SetSimulatePhysics" on the
    server): the grenade flew without collision and fell through the ground. MSS also starts the grenade moving
    only when the player's machine sends the direction (`CEOC_Throw_Direction` then `CES_Throw_Direction`); when that
    arrives after the throw animation has ended, the reference is gone and the grenade hung at hand height until it
    went off in the thrower's face (a race with network lag). `UTharrnExplosiveComponent` starts it moving, aims it
    and turns its collision on as soon as it leaves the hand.
70. The graph DSL cannot read a collapsed graph (`K2Node_Composite`: "Cannot cast type 'K2Node_Composite' to
    'Blueprint'"); `find_nodes` and `get_node_infos` on its graph path can (`EventGraph.K2Node_Composite_8.
    Action_Throw_Object_Graph`). It also has no node for calling a parent's custom event, so a child cannot add to
    MSS's `CE_Explosion` and still run MSS's own; Tharrn watches MSS's state from C++ instead.
71. `ObjectTools.set_properties` will not change an array's entries and its length in one call ("elements changed
    alongside the size change"): set it empty first.
72. A comment box's text (`NodeComment`) cannot be read or set with ObjectTools; `TharrnBlueprintNotesToolset.
    GetNodeComment` and `SetNodeComment` can.
73. A component's `Bounds` come from its collision (for a skinned mesh, its physics asset); for MSS's sight parts
    that is far from the glass. The view through the sight takes the mesh's own bounds (`GetSkinnedAsset()->
    GetBounds()`). MSS's rifle sight runs from the rear sight to the front posts, so its eye sits forward of the
    middle (`EyeDistanceCm` -28).
74. A blast's line of sight starts 10 cm off the surface it hit, or the surface itself counts as cover.
75. A target standing up reaches clients sooner than the 0.25 s grace on a busy listen server (measured 0.1 to 0.3 s
    after the server's moment): treating it as still down for the whole grace refused hits the clients saw (6.7 % of
    shots in one run). For the grace after standing up, the server now takes what the shooter saw either way
    (`ITharrnHittable::IsStandingUp`, used by `WeighClaim`); before the moment it counts as down.
76. A Blueprint class copies into new objects only the class defaults that differed from its C++ parent when it was
    last compiled. A default set on a Widget Blueprint's class after its compile (`ObjectTools.set_properties` on
    `Default__WBP_X_C`) reads back fine in the editor but never reaches new widgets (the inventory screen's slot class
    was None, 2026-10-16): set class defaults first, then compile (`Tools/UI/build_ui.py` does). A widget placed inside
    another Widget Blueprint keeps its own values: set them on it too.
77. MSS's HUD lays its ammunition panel out against its weapon selector: collapsing the selector pushed the ammunition
    off the screen. Hide (not collapse) the parts Tharrn replaces (`TharrnMss::HideHudParts`).
78. `UUserWidget` (`UWidget`) has a member called `Slot`: a local or parameter of that name in a widget class is a
    compile error here (warnings as errors, C4458).
79. Live Coding cannot change a console command registered by a static object (`FAutoConsoleCommand...`): the lambda
    bound at start keeps running. Worse, a patch that recompiles a file holding test console variables
    (`TAutoConsoleVariable`, e.g. `TharrnPlayerCharacter.cpp`) crashed the editor on the next play (a null variable in
    `TickMoveTest`, 2026-10-16). Live Coding only for files without them; otherwise the full editor build.
80. `TharrnPlaySessionToolset.CaptureGameView` reads the viewport, which has no UMG widgets in it; with `bIncludeUI` it
    renders the game view's Slate widget instead (`FSlateApplication::TakeScreenshot`), HUD and menus included.
81. `TextureTools.import_file` refuses a name that exists, and `AssetTools.delete` quietly leaves a texture that data
    tables still point at: `build_ui.py` imports an icon only when it is missing.
82. `UMGToolSet.GetWidgets` answers with lower-case keys (`widgets`, `parent`, `bInherited`); a tree is cleared by removing
    its root widgets.
83. An action in a mapping context of higher priority consumes its keys (`bConsumeInput`, on by default): Tharrn blocks
    MSS's F, X, G and Z with `IA_BlockMss` in `IMC_TharrnCombat` (priority 2 over MSS's 1). Injected input
    (`th.Press`, the grenade slot pressing `IA_Throw_Mode`) goes to the action itself and is not blocked.
84. Easy Game UI finds its settings asset through the class defaults of its `BP_EGUI_GlobalConfigSelector`: pointing
    that one value at Tharrn's own settings (`DA_TharrnUIConfig`) is the one change Tharrn makes to the pack (listed
    with a backup in `while-away.md` until the pack is staged again).
85. Anything that changes how a player moves must be predicted in the movement component, as the gait is: Tharrn's
    stamina lives in `UTharrnCharacterMovementComponent`, saved at the start of each saved move, put back in
    `PrepMoveFor` (a replay) and in `CombineWith` (two moves sent as one start again from the first's start), and sent
    with the server's corrections (`FTharrnMoveResponseDataContainer`). A value only the server keeps and the player's
    machine reads later would make every sprint that runs out end in a correction.
86. "Sprint again above N" with a held sprint key cycles: out, N back, sprint, out again (found 2026-10-16 at N = 5:
    every 1.25 s). Out of stamina ends when sprint is let go with `sprint_min_stamina` back, or when stamina is full;
    the move's own sprint request decides, so both machines agree.
87. `FTharrnVitalsTuning::Get()` reads `DT_Vitals` once per process: after re-importing `Data/Vitals.csv`, restart
    the editor before playing (the tests read the table directly).
88. `ConfigSettingsToolset.SaveSection` writes every setting of the section into `Config/Default*.ini`, defaults
    included (found again 2026-10-16): `build_ui.py` saves a section only when a value differs. Read `git diff Config/`
    after any script that saves settings.
89. A placed actor's `OnConstruction` runs while its level loads: no data table loads there. `ATharrnClimateVolume`
    takes its colour from the default comfortable range.
90. `ObjectTools.set_properties` takes its values as a JSON string (`json.dumps`): given an object, it sets nothing and
    returns False (found 2026-10-17).
91. The Water plugin's ocean (`WaterBodyOcean`) carves the landscape unless `bAffectsLandscape` is off; Tharrn's terrain
    has its own seabed, so it is off. The `WaterZone`'s `ZoneExtent` must cover the ocean's `OceanExtents`, and the
    water shows only once its materials have compiled (about a minute the first time after enabling the plugin).
92. After virtual texturing is switched on, materials compile again: a landscape saved meanwhile logs "Landscape
    physical material failed to complete before saving". Save again once the shaders have finished.
93. Live Coding patches are not in the editor module on disk: rebuild the editor target (closing the editor) before the
    next start, or that start runs without them. `SaveLevel` skips actors added and deleted since the last save
    (their packages have nothing to write).
94. A long editor session can make every sprint drift: on 2026-10-17, after about two hours, many play sessions and four
    Live Coding patches, the server fell behind every sprinting player by a few centimetres a frame (30 corrections a
    run, on the test range too); after a restart, 0. Restart the editor before trusting a movement failure.
95. The Sci-Fi bundle's run-time PCG graphs spawn bushes and small boulders that block movement, and each machine makes
    them on its own, at its own pace. Tharrn's biome volumes use Tharrn's versions (`Tools/World/setup_bundle_biomes.py`,
    no collision), and a server makes them only for its own player (`pcg.RuntimeGeneration.Server.Mode=1`): a
    dedicated server makes none. Trees and big rocks are generated once in the editor and saved with the level, so
    every machine has the same ones. The bundle's biome actor's `Biomes` list must be emptied before a shorter list
    with other entries is set (`set_properties` refuses it as ambiguous).
96. The Water plugin's ocean leaves a dry island around its own place, inside its outline (a circle by default), even
    with the outline shrunk to nothing (5.8.3). Stand the ocean actor far out at sea, outside the playable area, with
    `OceanExtents` reaching over the whole map (`build_coast_level.py`: 3 map widths away).
97. A World Partition level opened again in the editor has only some of its cells loaded: pictures after a reopen miss
    most generated trees. Take editor pictures in the session that generated the level, or in play.
98. Unreal is left-handed: with +X east, +Y runs south. A heightmap's north-first rows go in as they are (a flip would
    mirror a real coast); the zone data's y runs north, so the world's Y is minus the zone's y.
99. USGS lidar is "hydro-flattened": the sea is empty, at 0, or flattened at some height (Point Lobos: 1.15 m).
    `coast_terrain.py` finds that height next to the empty sea (one common value) and sets it to 0; a beach there
    has no common value (Hawaii: the sea is at 0, the commonest low height is farmland).
100. Editor pictures: point the viewport there first and wait (`EditorAppToolset.SetCameraTransform`, 8 s) with
    throttling off, or the virtual textures and World Partition cells are still low resolution.
101. The Sci-Fi bundle's `BP_EnvironmentController` does not hold a sun or sky of its own: it drives level actors set on
    it (`Sun` directional light, `SkyAtmosphere`, `Skylight` with real-time capture, `Clouds`, `Fog`,
    `PostProcessVolume` unbound), all movable. Without them the level is black but for glowing plants. Its own clock
    (`RuntimeTimeOfDayActive`) and on-screen time (`PrintGameTime`) are off: `ATharrnTimeOfDay` calls its
    `UpdateTimeOfDay(Hours, Minutes, Seconds)` every second from the server's clock.
102. In a World Partition level, actors are loaded only near a player unless `bIsSpatiallyLoaded` is off: the time
    actor, the environment controller and its sky actors must be always loaded (the time actor's class says so).
103. PowerShell names ignore case: a parameter `$Cmds` and a variable `$cmds` are one variable (the budget script's
    extra commands were lost that way; the parameter is `-ExtraCmds`). Git Bash rewrites `/Game/...` arguments into
    Windows paths: run such commands with `MSYS_NO_PATHCONV=1`.
104. `SceneTools.find_actors` does not list Tharrn's sky (`ATharrnSky`) by class, by name or among all actors, though
    it is in the level: keep the reference `add_to_scene_from_class` returns (the island script keeps it in
    `level.json`). Deleting a World Partition level with `AssetTools.delete` leaves the files of actors it did not have
    loaded or listed (the sky; after a reload, actors tied to cells) under `Content/__ExternalActors__/<level path>/`:
    remove them, or a level made again at that path gets them back.
105. The Sci-Fi bundle's landscape material runs out of texture slots where too many paint layers meet in one
    landscape component ("Shader is using too many SRVs: 72 (only 64 supported)" in the log); that component shows
    Unreal's grey default material. Keep to 4 layers a component (`island_blockout.py`'s `cap_layers`), and use few
    layers in all.
106. Unreal's ocean (Water plugin, 5.8.3) drew no water over a 19 km landscape of 8 m points: inside the water zone
    the surface is missing (zone 3 to 38 km, the ocean at the centre or far out, local tessellation, a higher capture;
    outside the zone its far mesh shows), while the same steps work on the 2 km coasts. From the air, the "sea"
    beyond such a level is the sky's planet ground. The island blockout's sea is a flat plane with the bundle's
    `MI_Water`. To be solved before the real map (P6.3).

## 8. Working as two agents

Claim an area in the README's ownership table before editing; one agent per area. Hand off with a
brief (repo skill `.agents/skills/feature-handoff/SKILL.md`) in `docs/briefs/`. Never run two
editor-target builds or two generators on the same assets at once.
