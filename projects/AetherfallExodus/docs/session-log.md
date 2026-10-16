# Aetherfall: Exodus — Session log

*2026-10-15.* Project start (Claude Code). The owner replaced Wildwright with a new game and supplied
its direction document (kept verbatim in `source/`). Owner's choices: delete Wildwright; a new project
with the setup carried over; server-authoritative networking from the first system; MetaSounds now,
Wwise later. Created `D:\AetherfallExodus` from the wizard-made third-person template content (238
files, as tracked in the old repo), the old project's config, source and tools, renamed to module
`AetherfallExodus` and class prefix `Aetherfall` with redirects for the template's classes; dropped the
template variants and the old project's region data, set-piece script and HyperAI Studio files;
re-pointed comments at the new decision numbers; new ProjectID. Git initialised with LFS (files staged,
nothing committed); `stage_packs.py` staged the Game Animation Sample and the Sci-Fi Complete Bundle
outside Git. Wrote the design record: GDD 0.1 in 13 modules (deliverable 1), decisions D-01 to D-13,
open questions OQ-01 to OQ-11, engineering guide with the carried gotchas, task list with Prototype
modules P1 to P8. **Verified:** both targets build; plugin check PASS; the editor opens with DLSS
supported and MCP answering; PIE on the template level runs with no errors. Then deleted Wildwright's
design record, Workspace card and card entry; deleting `D:\Wildwright` itself (31 GB, its local-only Git
history included) was refused by Claude Code's path guard, so the owner deletes that folder by hand. **Not verified:** the terrain tools in the new
project; anything multiplayer beyond the template. **Next:** owner review and first commit; P1
Foundation.

*2026-10-15, later.* Owner's package reviewed (Claude Code). The owner added `Aetherfall/`, a scaffold of
deliverables 2–10. Reviewed every file ([review](reviews/owner-package-2026-10-15.md)): real drafts of the
zone map (15 zones with per-zone consent and cooldown), flagging keys and RPCs, the preset schema (1 of
12), 3 weapons, 3 creatures, a dungeon, the HUD layout with crosshair variants, 5 QA tests and naming
conventions; the rest are one-line stubs or placeholders. Problems found by parsing: all three JSON files
invalid (doubled quotes, a comment, a BOM), broken quoting in two CSVs, mojibake in two text files; the
zone map is about 16 times the direction's world as written (÷4 gives 24.6 km²); Skitterjaw's biome
differs from the tutorial; weapon and armour units unstated. Adopted the usable content into GDD modules
01, 02, 03, 05, 07, 08, 09, 10, 12 and the naming conventions into the engineering guide; the package is
kept as received.
Owner's answers: a world of about 75 km² (D-14; zone map scaled by 0.4375 to 75.3 km²), the Skitterjaw
is a desert creature (D-16; the coastal tutorial's first fight becomes OQ-12), third-person camera with
aim-down-sights (D-15), and approval for the first commits. Corrected, valid working copies of the
package data in `data/` (zones, weapons, creatures, presets, dungeon, HUD); a semicolon in zone Z003's
note had split it into an extra column.
