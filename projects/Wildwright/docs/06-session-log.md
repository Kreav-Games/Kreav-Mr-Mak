# Wildwright — Session log

Dated history of what each session did, verified and left open. Newest at the
bottom. The current state is summarised in the [README](../README.md); how to do
things is in the [engineering guide](05-engineering-guide.md). Add one entry at the
end of every session (README handoff checklist).

Each entry: what was done, **Verified** (with evidence), **Not verified**, **Next**.

---

*2026-10-11.* Setup session. Installed and signed in Codex; got Valley of the
Ancient running in UE 5.4.4 (fixed a wrong engine association and restored
missing `__ExternalActors__` content from the launcher vault); analyzed how the
Valley cast and levitate feel is built; merged and corrected the Worldweave
documents into this folder. **Verified:** Valley loads and the level is visible in
the 5.4.4 editor (owner-confirmed); 5.4.4 build rules compile against the
installed toolchain. **Not verified:** how the Valley graphs behave at runtime;
any 5.8 port; licensing; Higgsfield generation.

*2026-10-11, later.* Decisions session (Claude Code). The owner resolved OD-01
(**UE 5.8.3**, D-07, against the 5.4.4 recommendation) and OD-02 (**GAS for
casting only**, D-08), and confirmed `D:\Wildwright\` (D-09). Updated the decision
log, GDD (header, 12.1, 12.2, 16, 16.3, change table), the README and the hub.
**Verified:** `D:\UE_5.8` is 5.8.3 (CL 58210709); its `Windows_SDK.json` bans MSVC
14.40–14.43; the only installed toolset was 14.43.34808 (VS 2022 17.13.3), so a
C++ project could not build yet; Git 2.47.1 and Git LFS 3.6.0 are installed.
**Next:** the owner updates Visual Studio, then the project is created.

*2026-10-11, later still.* The owner updated VS to 17.14.41 and created
`D:\Wildwright\` from the C++ Third Person template, then added HyperAIStudio, MCP
Client Toolset, Unreal MCP and Nwiro (Nwiro later disabled). Unreal MCP has
Runtime modules and was enabled for all targets, so all AI/MCP plugins were set to
`TargetAllowList: Editor`. Enabled `GameplayAbilities` and added
`GameplayAbilities`, `GameplayTags`, `GameplayTasks` to `Wildwright.Build.cs`.
Added `.gitignore` and `.gitattributes` (LFS for `.uasset`/`.umap`/media) and ran
`git init -b main` with `git lfs install --local`. **Verified:** editor target
builds (34 s) and game target builds (65 s) with MSVC 14.44.35229; the game link
contains GameplayAbilities and no MCP/AI plugin. HyperAIStudio emits 20 descriptor
warnings (vendor issue, harmless). The owner confirmed the player moves in PIE and
approved the baseline commit (`e33140c`). While the editor was open, HyperAIStudio
enabled 17 EditorOnly toolset plugins and wrote agent files (`.mcp.json`,
`.codex/config.toml`, `AGENTS.md`, `CLAUDE.md`, `.hyperai/`). These tell agents to log
decisions under `.hyperai/work/`, which conflicts with this folder's decision log.
The owner approved committing them with a hand-written "Wildwright project rules"
section in `AGENTS.md` (`27adc42`), and removing the template's Combat, Platforming
and SideScrolling variants (`c43a81a`, 591 files). **Verified:** both targets
rebuild; the game link has no variant code and no MCP/AI module; the editor
restarts with 0 errors. **Not verified:** that HyperAIStudio keeps the hand-written
`AGENTS.md` section when it regenerates its block.

*2026-10-12.* Licensing and M0 close-out. The owner supplied the Fab listing and
Epic's documentation for Valley of the Ancient, which produced D-10 (NoAI Fab
assets: read, classify, tag or organize only) and D-11 (Valley assets may ship
inside the game; repo private; cooked builds only), resolving OD-10. Both rules were
added to the game repo's `AGENTS.md` (`54c4520`). Ran the M0 clean-clone check in a
scratch folder (deleted afterwards). **Verified:** 269 tracked files, 238/238 LFS
assets restored, the clone builds, `CompileAllBlueprints` 0 errors and 0 warnings.
The commandlet exited 1 only because of HyperAIStudio's automation-probe error.
**M0 acceptance met.** **Not verified:** the Fab EULA text itself (owner-supplied
summaries only).

*2026-10-12, later.* Next action 3. Wrote `D:\Wildwright\Tools\Greybox\`
(`build_greybox.py`, `verify_greybox.py`, README): `L_TestRange` (stations ST01–ST08,
one per Appendix A.2 target, plus a range and line-of-sight lane), `L_Valley_Greybox`
(ravine, hot pass, west ledge behind burnable brush, side stream with a buildable
flow edge, depleted basin, dust hollow, spring and ruins) and 12 `MI_GB_*`
materials. Added the "Greybox maps" tab to the Workspace card with to-scale
diagrams, because the owner found the layout hard to read. **Verified:** Map Check
clean; 25/25 trace checks. **Learned:** see the gotchas in the engineering guide
(`MAP CHECK` with no world crashes the editor; delete-and-recreate of a map fails;
headless screenshots write nothing; 3D text faces +X). The owner reviewed the maps
and approved the commit (`54be2e4`).

*2026-10-12, action 4.* Element selection and the target interface, in C++
(`Source/Wildwright/Elements/`), data in `Data/Elements.csv` and `Data/Rules.csv`,
assets by `Tools/Elements/build_elements.py`. The greybox targets became
`AWildwrightTargetActor` (9 in the test range, 11 in the valley). Raised OD-11 (C++
and CSV data instead of Blueprint-first for agent-built systems). **Verified:** game
and editor targets build with no warnings in the new code; both CSVs import with 0
problems; automation tests `Wildwright.Elements.TargetCheck` and
`Wildwright.Elements.ProjectData` pass; `verify_greybox.py` 33/33 (including the game
mode using the new HUD and the character Blueprint having the element component
without either being edited). Recorded the owner's Niagara documentation link for
action 6.

*2026-10-12, later.* The owner play-tested action 4 in `L_TestRange`: elements only
took on targets they were allowed on, which is the intended behaviour. On the
owner's instruction, removed everything related to the earlier game idea from the
workspace: its project folder and an inbox note went to the Windows Recycle Bin
(recoverable), and its mentions were removed from the decision log and README.
Restructured the documentation for handoff between Claude Code and Codex: a
shorter README, [05-engineering-guide.md](05-engineering-guide.md), this log, and
[07-handoff-action-5.md](07-handoff-action-5.md). **Not done:** action 4 is not
committed yet (waiting for the owner's go-ahead); OD-11 is unanswered; the earlier
game's own Unreal project on D: (18.3 GB, separate Git repo), four files in the
owner's Downloads and the Mr. Mak app's own session history still mention it outside
this workspace; the owner was asked whether to remove them.

*2026-10-12, close of action 4.* The owner approved and action 4 was committed
(`7b9712f`, 40 files). The owner accepted OD-11 as **D-12**: agent-built systems are
C++ with CSV data and generated assets; Blueprints are for content the owner tunes,
with agent assistance. GDD 12.1 amended (change table updated). The owner will deal
with the earlier game's folders outside the workspace personally, and asked that
Codex never refer to that game. **Verified:** Codex's global folder has no
instruction file, and its memories and goals stores contain no mention of the
earlier game; its old session transcripts are only used if a chat is resumed. Added
a rule (D-02) to `D:\Wildwright\AGENTS.md`, the README and the engineering guide:
never use names, files, systems, lore or plans from an earlier game project. With
the owner's approval, committed the `AGENTS.md` changes in the game repo
(`44b82d9`) and the design record, handoff docs and Workspace card in the Mr. Mak
repo (`f0b7f02`, Wildwright paths only; the owner's own staged and pending changes
there were left untouched, including an un-pin of the "My Dream Game" sample card in
`workspace.json`). **Next:** action 5 ([brief](07-handoff-action-5.md)).

*2026-10-12, card progress.* The owner asked for everything done so far to be ticked
off on the Wildwright Workspace card, by Codex if possible. Two `codex exec` runs
failed: the first on an expired sign-in (the owner re-ran `codex login`), the second
because non-interactive Codex on this machine is forced to a read-only sandbox
(guide §7, items 22 and 23). Claude Code made the change instead: a Status column in
the GDD milestone table (M0 done, M1 in progress), and the hub generator now ticks,
strikes through and dims done milestones, done next actions and decided questions,
highlights M1, shows "M0 done · M1 in progress" in the rail, and points its handoff
example at action 5. The Greybox tab timeline shows actions 3 and 4 done and 5 next.
**Verified:** the generator runs (8 done rows; labels ✓ DONE, IN PROGRESS, 5× NOT
STARTED); both pages checked in headless Edge.
