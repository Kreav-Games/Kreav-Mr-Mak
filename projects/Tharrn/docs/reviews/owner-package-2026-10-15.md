# Review: the owner's package (2026-10-15)

The owner added `projects/Tharrn/source/owner-package-2026-10-15/` "for review to help": a scaffold of data,
pseudocode, HUD, dungeon and QA files that matches the direction's deliverable list (§5.6). It is kept
as received; this review says what is usable, what is broken, and what happens to each file.

## Verdict

Useful as a **first draft of deliverables 2–10**: the zone map, the flagging keys and RPCs, the preset
schema, three weapons, three creatures, a dungeon, the HUD layout and five QA tests are real content.
About half the files are one-line stubs or placeholders, every JSON file and two CSVs fail to parse as
written, and the zone map is about 16 times larger than the world in the direction. Nothing in the
package changes a decision; corrected copies are made when each file is first used (in the game repo's
`Data/`), and the package itself stays untouched.

## File by file

| File | Usable content | Problems | What happens |
|---|---|---|---|
| `dev_notes.md` | Import order; **naming conventions** (meshes `CH_`, `CR_`, `WP_`, `ENV_`; textures `T_<name>_diff/_norm/_rough/_ao/_subs`; `VFX_`, `SFX_`, `MUS_`, `VO_`; art under `Content/Art`) | — | Conventions adopted in the engineering guide §5 |
| `README.md`, `docs/GDD.md` | Title, genre, core promise | `GDD.md` is a stub ("full modular GDD included" is not); both show broken characters (`â€”` for "—", UTF-8 read as Windows-1252) | GDD 0.1 in `docs/gdd/` stands |
| `LICENSE.txt` | — | Placeholder ("Your Studio") | Ignored; the repo stays private (D-03) |
| `data/zones_definition.csv` | 15 zones with type, PvP flag, **consent buffer and exit cooldown per zone**, loot tier, spawn timer, **recommended level**, notes | Semicolon-separated (the other CSVs use commas); units not stated; **scale** (below); no buffer belts around 4 of 5 PvP zones; two safe hubs touch PvP zones | Draft of deliverable 2; its extra columns adopted in GDD 05 and 07; rescaled once the owner decides |
| `design/flagging_state_blueprint.txt` | State keys (`Flagged`, `InPvPZone`, `FlagExitTimer`, `FlagConsentTimer`, `ProxyActive`, `BountyValue`; zone `ZoneID`, `PvPFlag`, `ConsentBuffer`, `ExitCooldown`) and five server RPCs (enter, exit, extraction request and interrupt, disconnect) | Says the pseudocode is "included in" itself; it is not | Keys and RPCs adopted in GDD 05; the expanded pseudocode (deliverable 3) is still to write |
| `data/metahuman_presets.json` | One preset with a richer schema: `display_name`, `base_preset`, `implants` (id, colour, glow), `body` (height in metres, musculature, limb proportion), `notes` | Invalid JSON (a `/* */` comment); 1 of 12 presets; key names differ from the direction's example (`voice_pack` vs `voice`, `eye` vs `eyes`); absolute height vs the direction's ±15 % | Schema adopted for deliverable 4 (one naming, documented in GDD 01); 11 presets still to write |
| `data/weapons.csv` | AR-01, SMG A1, SG-01 with stats and notes | Every `notes` value has broken quoting (`""text""`), leaving stray quote characters; SG-01 is `projectile` with `projectile_speed` 0; no pistol, no heavy projectile, no energy weapon (the direction's fire modes); units unstated | Rows adopted for deliverable 7 with fixes: units fire rate per minute, range metres, weight kg, speed m/s; shotgun as hitscan pellets (damage per pellet × count) unless the owner prefers projectiles |
| `data/creatures.csv` | Skitterjaw, Lumivine Colossus, Phase Warden with resistances (`acid:0.2`), aggro radius, loot, AI profile, notes | Same broken quoting in three columns; `armor` is Light/Medium/Heavy while the direction defines armour by material (cloth 10 %, composite 30 %, alloy 50 %); **Skitterjaw is placed in the Fungal Forest** though the direction's tutorial fights it at the coastal crash site; 3 of 30 | Rows adopted for deliverable 5 with fixes: Light = cloth, Medium = composite, Heavy = alloy; resistances as damage reduction fractions; aggro radius in metres |
| `dungeons/dungeon_template_01.json` | "Ruins of the First Signal": 5 rooms, 3 modifiers, boss, loot pool | Invalid JSON (doubled quotes throughout); the direction names 6 room types (5 listed); the boss is CR006 Apex Titan (the direction's multi-phase world-class boss) at recommended level 12 in a biome whose zone recommends 15 | Draft of deliverable 6; boss and level to confirm when dungeons are built (vertical slice) |
| `hud/hud_layout.json` | Layout plus **crosshair variants** (default, precision, suppressed) | Invalid JSON (doubled quotes); key `position` vs the direction's `pos`, `temperature` vs `temp` | Adopted in GDD 10 with one naming; deliverable 8 |
| `hud/icons/*.txt` | List of 12 icons, 256 × 256 PNG recommended | Placeholders, no art | Icon art later (deliverable 8) |
| `behavior_trees/skitter_ai_bt.txt` | Patrol, Detect, Chase, Flank, Pounce; keys `TargetActor`, `AggroRadius` | One line | Adopted in GDD 08 as the Skitterjaw outline (deliverable 9) |
| `blueprints_pseudocode/crafting_pseudocode.txt`, `inventory_pseudocode.txt` | Recipes data table, `Server_RequestCraft`, craft queue; items data table, `AddItem`, `RemoveItem`, grid UI | One line each | Adopted in GDD 03 as the system outline |
| `art_briefs/creature_sketch_skitterjaw.md` | Headings only | One line | Superseded by the creature deliverables in GDD 08 |
| `qa/qa_matrix.csv` | 5 concrete tests with pass criteria (recoil within 5 %, flag replicates within 100 ms, extraction interrupt, preset round trip, streaming spikes) | QA005 "frame time spikes < 10 ms" is ambiguous (spike size or frame time) | Seeds deliverable 10; QA005 read as "no frame more than 10 ms over the median at a cell boundary" until the owner says otherwise |

## The zone scale

The zone bounds run from −15,360 to 15,360 on x and −10,240 to 10,240 on y in 5,120-unit squares. In
metres that is a 30.7 × 20.5 km box with **393 km² of zones**; each zone alone (26 km²) is larger than the
direction's whole world (16–25 km²). In Unreal units (centimetres) the whole map would be 307 × 205 m.

Dividing every bound by 4 keeps the layout and gives **1.28 × 1.28 km zones and 24.6 km² in total**, at
the top of the direction's range and close to its 45-minute walk. That is the recommendation (owner's
call).

## Formatting fixes applied to working copies

- CSV: one delimiter (comma); proper quoting (`"acid:0.2;fire:0.1"`).
- JSON: no comments, standard quotes, UTF-8 without BOM.
- Text: UTF-8 without BOM ("—" instead of `â€”`).

## Owner's answers (2026-10-15)

- **Scale:** "im thinkging more like 75 sq km" (D-14). The working copy scales every bound by 0.4375:
  2.24 × 2.24 km zones, 75.3 km².
- **Skitterjaw:** "a desert type creature" (D-16); the coastal tutorial's first fight is OQ-12.
- Found while converting: zone Z003's note ("Bioluminescent flora; spore hazards") contains a semicolon,
  which split it into an extra column in the semicolon-separated file; the working copy joins it back.
- Working copies: `../../data/` (zones, weapons, creatures, presets, dungeon, HUD), all valid.
