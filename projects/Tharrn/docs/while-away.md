# Tharrn — report for when the owner is home

Started 2026-10-16. The owner is on the phone for a few days and can't test in the editor: "Might as well commit, I
can't do testing, using phone for next few days, we dont want to lose progress. Continue with whats next and when im
home we can revisit. Make sure to make notes or a report for when I get home incase we need a roll back." Claude
builds P4 (the hotbar, inventory and UI, D-25; [plan](tasks.md#p4-inventory-hotbar-and-ui-plan-2026-10-16)) in the
meantime. This file says what was done, what to look at first, and how to go back.

## Rollback points

| Repo | Commit | Tag | What it holds |
|---|---|---|---|
| Game `D:\Tharrn` | `883a04d` | `p4-checkpoint-1` | P4 so far: the inventory, hotbar, pickups, the HUD and the inventory screen in MSS's look; Easy Game UI's HUD class in place, its menus not yet. Checked: 84 automation tests, the network test, the inventory network test (listen and dedicated server), the MSS test |
| Game `D:\Tharrn` | `f2e695d` | `d24-before-p4` | D-24: grenade launcher, hand grenades, the view through the sight, the mouse wheel, no slide. Everything checked (80 tests, network test, MSS test, Shipping build). The last state before P4 |
| Game | `a470f3f` | — | P3's first build with MSS (the slide and the Mass Driver still in) |
| Mr. Mak | `d2bff9f` | — | The design record for D-24, decision D-25 and the P4 plan |

P4's commits are added to the table above as they happen. Asked on 2026-10-16 whether Claude may commit verified P4
checkpoints on its own while they are away (local only, never pushed, each tagged), the owner said "Commit".

## How to go back

Simplest: tell Claude "roll Tharrn back to `d24-before-p4`" (or to any commit or tag above). Claude closes the
editor, keeps the newer work on a branch so nothing is lost, resets, rebuilds and checks.

By hand, with the Unreal Editor closed (PowerShell):

```powershell
git -C D:\Tharrn branch p4-kept               # keeps the newer work on a branch
git -C D:\Tharrn reset --hard d24-before-p4   # the game files as they were at that point
```

Then open `D:\Tharrn\Tharrn.uproject`; it offers to rebuild the C++ (say yes).

**What Git does not cover.** Store packs stay outside Git (D-08). Some of Tharrn's tool scripts change pack files
in place: `Tools/Weapons/setup_mss.py` (MSS's shooter component, its projectile and throwable masters, the sample's
animation Blueprint, the UEFN skeleton). Every pack file P4 changes is listed below, and a copy of it as it was is
kept first in `D:\Tharrn\Saved\PackBackups\`. To undo pack changes: copy those files back, or stage the pack again
(`Tools/Packs/stage_packs.py`) and run `setup_mss.py` again.

## P4 progress

| Step | State | Commit | Notes |
|---|---|---|---|
| P4.1 MSS from a slot | Done 2026-10-16 | — | The server makes the picked weapon and MSS draws it with its own animation; the old one is put away and removed; nothing shows on the back (pictures: nothing on the body, only the weapon in the hands) |
| P4.2 Data | Done | — | `Data/Items.csv` (14 items), `Data/StartingKit.csv`, `ammo_item` in `Weapons.csv`; two placeholder icons (bandage, armour) |
| P4.3 Inventory (C++) | Done | — | `UTharrnInventoryComponent`: 12 hotbar + 30 grid + 4 worn slots, 60 kg; reloads take rounds from it; grenades are items; worn armour sets the armour |
| P4.4 Hotbar | Done | — | Keys 1 to 9, 0, - and =; the wheel steps through the weapons; a grenade slot readies a grenade; a bandage heals 25 (refused at full health) |
| P4.5 Pickups and drops | Done (single player) | — | E picks up what the player looks at; the server refuses a pick-up from 10 m; items lie on the test range (right of the starts) |
| P4.6 to P4.8 Look, HUD, inventory screen | Done | `883a04d` | In MSS's look (its panel and text styles, pale blue-white on dark): the hotbar along the bottom with the item in the hands named above it, health and weight bottom left, the pick-up prompt, the inventory screen on Tab (worn, grid, hotbar row, drag and drop, details); MSS's weapon selector and its X, Z, F and G hints hidden (its ammunition, R and V stay) |
| P4.9 Menus (Easy Game UI) | In progress | — | Easy Game UI's HUD class in place (Tharrn's widgets now come from the player controller); its main menu, pause menu (Esc) and options next |
| P4.10 Checks | Partly | `883a04d` | 84 automation tests; the network test and the inventory network test pass as listen and dedicated server; the MSS test passes on the hotbar |

The owner pointed at MST Pro (Hyper's Multiplayer Survival Template) on 2026-10-16: it has an inventory, hotbar,
crafting, vitals, building, farming and more. Claude recommended keeping Tharrn's own inventory (built and working,
the server checks every move, it draws MSS weapons directly) and taking MST Pro's parts that fit, module by module;
the owner can say "2" to switch to MST Pro's inventory instead.

## Pack files changed in P4

None yet. (Planned: Easy Game UI's `BP_EGUI_GlobalConfigSelector`, one value pointing at Tharrn's settings asset;
backed up first.)

## Pictures (2026-10-16)

The HUD [hud.jpg](pictures/p4/hud.jpg), the inventory screen [inventory.jpg](pictures/p4/inventory.jpg), the pick-up
prompt at the test range's items [pickup_prompt.jpg](pictures/p4/pickup_prompt.jpg), empty hands with nothing on the
back [hands_empty_back_clear.jpg](pictures/p4/hands_empty_back_clear.jpg), aiming through the SMG's sight in a client's
small play window [aiming_client_window.jpg](pictures/p4/aiming_client_window.jpg).

## Things that happened

- 2026-10-16, evening: a rebuild could not close the editor (Unreal's "Save Content" box was open). Claude's attempt
  to press Esc on it was declined; the owner chose to force-close and rebuild ("#2"). The editor then offered to
  restore three Easy Game UI Blueprints (`BP_EasyMainGameHUD`, `GI_EasyMainGameInstance`,
  `BPFL_EGUI_EasyFunctionUtilities`) that only reading their graphs had marked as changed; the restore was skipped by
  moving Unreal's restore list aside (kept in `D:\Tharrn\Saved\ClaudeScratch\restore_2026-10-16\`). The pack files
  were not changed. Claude read "#2" as that option, not as switching to MST Pro's inventory.

## Chosen for the owner (proposals in the P4 plan; say if any is wrong)

- G (grenade) and Z (drop) leave MSS's keys too: grenades go on the hotbar, dropping happens in the inventory.
- 12 hotbar slots, 30 in the grid; 60 kg carried, over it no sprinting.
- The starting kit: SMG, pistol and launcher with four magazines each, three grenades, two bandages; armour to pick
  up on the test range.
- The crafting and death screens come with P5, the map with P6.

## To look at first, when home

1. Play-test P2 and P3 ([steps](tasks.md#p3-weapons-results-2026-10-16)): the slide is gone, the launcher and
   grenades, aiming through the sight, the wheel.
2. P4's play-test steps (written when P4 is built).
3. This file's "Chosen for the owner" and "Questions" sections.

## Questions for the owner

None yet.
