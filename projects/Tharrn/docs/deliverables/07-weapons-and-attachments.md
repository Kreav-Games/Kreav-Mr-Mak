# Deliverable 7 — Weapon data and attachment table

Version 0.1, 2026-10-15. **Proposal for the owner:** the direction asks for a weapon CSV and an attachment table
(§5.6). The three weapons in the game's `Data/Weapons.csv` are the owner's; everything else below is a starting
point for tuning in P3, and goes into the game's data only once the owner agrees. Units: damage per hit, fire rate
in rounds per minute, magazine in rounds, weight in kg, range in metres (full damage up to it, then falling off),
projectile speed in m/s.

## 1. Weapons

The Prototype needs an SMG, a pistol and one heavy projectile weapon (GDD 02); the direction's fire modes also need
an energy weapon later. Damage per second is damage × fire rate ÷ 60 on the torso, before armour.

| weapon_id | Name | Type | Damage | Fire rate | Damage / s | Mag | Weight | Range | Speed | Hit | Role | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| AR01 | Assault Rifle AR-01 | Ballistic | 28 | 600 | 280 | 30 | 3.2 | 600 | — | hitscan | Balanced mid-range | Owner |
| SMG_A1 | SMG A1 | Ballistic | 16 | 900 | 240 | 40 | 2.1 | 200 | — | hitscan | Close quarters | Owner |
| SG01 | Shotgun SG-01 | Spread | 15 × 8 pellets | 70 | 140 | 8 | 4.5 | 30 | — | hitscan pellets | Close burst | Owner; **pellets proposed** |
| PS01 | Sidearm PS-01 | Ballistic | 34 | 300 (semi-automatic) | 170 | 12 | 1.1 | 60 | — | hitscan | Backup, quick to draw | **Proposal** |
| MR01 | Mass Driver MR-01 | Heavy | 95 | 50 | 79 | 5 | 6.0 | 800 | 420 | projectile | Long range; drop and lead to learn | **Proposal** |
| EB01 | Arc Beam EB-01 | Energy | 6 per tick | 1200 ticks | 120 | 100 charge | 3.8 | 25 | — | beam | Melts shields; overheats | **Proposal**, after the Prototype |

Notes:

- **SG-01:** stored today as a projectile with speed 0. Proposed: 8 hitscan pellets of 15 (the owner's 120 per
  shot), spread 6° from the hip, 4° aiming.
- **AR-01** also carries a projectile speed of 900 m/s in the data; it is unused while the rifle is hitscan.
- **MR-01** at 420 m/s drops about 2.5 m over 300 m (½ × 9.8 m/s² × (300 ÷ 420 s)²): you aim above a far target,
  which is what the heavy weapon is there to teach.
- The pistol is stronger per hit than the rifle but slower, so it is a backup and not a replacement.

**Added 2026-10-16 (D-24, in the game's data):** the grenade launcher replaces MR-01 in the heavy slot (MR-01 stays
in the data for later), and the hand grenade. Both explode: full damage within `blast_inner_m`, none past
`blast_outer_m`. Their radii and the grenade's fuse are the Multiplayer Shooter System's; the rest are **proposals**.

| weapon_id | Name | Type | Damage | Fire rate | Mag | Weight | Speed | Blast | Fuse | Role |
|---|---|---|---|---|---|---|---|---|---|---|
| GL01 | Grenade Launcher GL-01 | Explosive | 120 at the centre | 40 | 4 | 5.5 | 50 m/s | 1 m full, none past 5 m | on impact | Area denial; arcs, so lead and lift |
| HG01 | Frag Grenade HG-01 | Throwable | 150 at the centre | — | 3 carried | 0.4 | 15 m/s thrown | 1 m full, none past 5 m | 3 s from the pin | Clearing cover; G to take one out |

New columns in `Data/Weapons.csv`: `blast_inner_m`, `blast_outer_m`, `fuse_seconds`, and `ads_zoom` (magnification
through the sight while aiming; 1.25 for the SMG's and pistol's sights, the launcher's 1.25; an optic attachment such
as `OPT_SCOPE4` sets its own, below).

Columns to add for P3, as CSV: `reload_seconds`, `ads_seconds`, `hip_spread_deg`, `ads_spread_deg`,
`move_spread_mult`, `falloff_end_m`, `falloff_min_mult`, `pellets`, `rarity`.

| weapon_id | reload_seconds | ads_seconds | hip_spread_deg | ads_spread_deg | move_spread_mult | falloff_end_m | falloff_min_mult |
|---|---|---|---|---|---|---|---|
| AR01 | 2.2 | 0.25 | 2.0 | 0.3 | 1.6 | 900 | 0.6 |
| SMG_A1 | 1.8 | 0.18 | 2.6 | 0.6 | 1.3 | 300 | 0.5 |
| SG01 | 3.4 (shell by shell) | 0.22 | 6.0 | 4.0 | 1.2 | 45 | 0.2 |
| PS01 | 1.4 | 0.15 | 1.8 | 0.4 | 1.3 | 90 | 0.6 |
| MR01 | 3.0 | 0.35 | 3.5 | 0.05 | 2.5 | 1200 | 0.8 |

## 2. Recoil curves

The direction's form, one CSV for all weapons (`weapon_id,t,vx,vy`), read into curve tables. **Proposal:** `t` is
seconds since the trigger was pressed, `vx` the upward kick and `vy` the sideways kick in degrees per shot at that
time; recovery returns the sight at `recovery_deg_per_s` once firing stops.

| weapon_id | t | vx | vy |
|---|---|---|---|
| AR01 | 0.0 | 0.18 | 0.02 |
| AR01 | 0.1 | 0.16 | -0.01 |
| AR01 | 0.5 | 0.12 | 0.04 |
| AR01 | 1.5 | 0.10 | -0.03 |

The first two rows are the direction's example; the rest continue it (the kick settles as the spray goes on). QA
C-01 measures recoil within 5 % of this curve.

## 3. Attachments

Five slots (direction): barrel, stock, magazine, optic, core. Each attachment has a rarity (the loot tiers), needs
its blueprint, and fits a list of weapon types. Modifiers are multipliers (1.0 = no change) or added values.

| attachment_id | Slot | Name | Fits | Modifiers | Rarity |
|---|---|---|---|---|---|
| BRL_COMP | Barrel | Compensator | Ballistic | recoil × 0.85, hip spread × 1.1 | Common |
| BRL_LONG | Barrel | Long barrel | Ballistic, Heavy | range × 1.25, ads time × 1.1, weight + 0.4 | Uncommon |
| BRL_SUPP | Barrel | Suppressor | Ballistic | no muzzle flash; creatures hear the shot at half the distance ([deliverable 9](09-creature-behaviour.md)); range × 0.85 | Rare |
| STK_LIGHT | Stock | Skeleton stock | All but Energy | ads time × 0.85, recoil × 1.1, weight − 0.3 | Common |
| STK_HEAVY | Stock | Braced stock | Ballistic, Heavy | recoil × 0.8, ads time × 1.15, weight + 0.5 | Uncommon |
| MAG_EXT | Magazine | Extended magazine | Ballistic | magazine × 1.5, reload × 1.15, weight + 0.3 | Uncommon |
| MAG_QUICK | Magazine | Quick-release magazine | Ballistic, Heavy | reload × 0.8 | Rare |
| OPT_REFLEX | Optic | Reflex sight | All | ads time × 0.95, zoom 1.25× | Common |
| OPT_SCOPE4 | Optic | 4× scope | Ballistic, Heavy | zoom 4×, ads time × 1.25 | Advanced |
| CORE_THERM | Core | Thermal core | Ballistic, Heavy | + fire damage 10 % of the hit | Advanced |
| CORE_PHASE | Core | Phase core | Energy | shields take × 1.5 damage | Alien |

The core slot is where alien technology shows up, so its items sit in the top tiers. Attachment modifiers stack by
multiplying, applied on the server when the weapon's stats are built (never sent by the client, D-04).

## 4. Where it goes

| Data | Game repo file | Table |
|---|---|---|
| Weapons | `Data/Weapons.csv` (new rows and columns once agreed) | `DT_Weapons` |
| Recoil | `Data/WeaponRecoil.csv` | a curve table per weapon |
| Attachments | `Data/Attachments.csv` | `DT_Attachments` |

All imported by `Tools/Data/import_data_tables.py`, which gets a row type per new table (C++, `TharrnDataRows.h`).
