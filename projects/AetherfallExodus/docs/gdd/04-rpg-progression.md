# 04 — RPG progression and quests (direction §2.3)

## Progression

- Level cap 60 (configurable).
- XP to the next level: `XP(level) = baseXP × 1.12^(level − 1)`.
- One talent point per level; three trees (Combat, Survival, Tech); nodes have prerequisites and unlock
  mechanics.

| Tree | Example nodes |
|---|---|
| Combat | Precision Training (less recoil), Quick Reload (−15 % reload time), Suppressive Fire (area suppression) |
| Survival | Efficient Forager (+20 % resource yield), Advanced Filtration (less water used), Field Medic (faster healing) |
| Tech | Drone Control (deploy a drone), Power Optimization (generators use less), Alien Synthesis (craft alien cores) |

## Quests and dungeons

- Quest types: main, side, faction, timed, dungeon.
- Dungeon template: 6 room types, 3 puzzle archetypes, 2 trap archetypes, a mini-boss, a final boss;
  procedural modifiers gravity_shift, fog, enemy_variants (detail in [09](09-dungeons.md)).

## Loot tiers

Common, Uncommon, Rare, Advanced, Alien; higher tiers need blueprints.

## Build notes

- XP, level and talents on the player state, saved to the player's profile; talent nodes as a CSV
  (`node_id,tree,tier,prerequisites,effect`), each effect a gameplay effect or ability grant.
- With `baseXP` unset, a value is proposed when progression is built (for example the time to level 60
  at a target number of hours, OQ to raise then).
- Quests as data (stages, objectives, rewards) driven by a small server-side quest subsystem.
- Not in the Prototype; first appears in the vertical slice (one faction questline).
