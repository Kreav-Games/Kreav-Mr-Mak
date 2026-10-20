# 09 — Dungeons (direction §3.4)

Dungeon meta: `dungeon_id,name,biome,recommended_level,entry_requirements,boss_id,loot_pool`

## Room templates

| Room | Spec |
|---|---|
| Puzzle Room | Needs a crafted item or an environmental trigger |
| Combat Arena | Multi-wave enemies with cover and verticality |
| Traversal Chamber | Platforming, gravity shifts |
| Trap Corridor | Timed hazards and detection |
| Boss Arena | Multi-phase with environmental mechanics |

Procedural modifiers: GravityShift (low/high), FogOfWar, EnemyLoadoutVariation, TimeLimit.

## Bosses

Multi-phase with thresholds at 75, 50 and 25 % health; each phase adds mechanics (shield, minions, an
environmental hazard). Drops unique blueprints and rare loot.

## Build notes

- Dungeons as instanced levels (level instances streamed per group) assembled from room templates by a
  server-side generator with a seed; modifiers as gameplay effects on the instance.
- The direction lists 6 room types but names 5; the sixth is to be named (for example an entry or loot
  vault room). Proposed with the archetypes in [deliverable 6](../deliverables/06-dungeon-templates.md).
- Vertical slice: one full dungeon with a boss.

## From the owner's package ([owner's package review](../reviews/owner-package-2026-10-15.md))

Draft dungeon (deliverable 6): **DGN_001 "Ruins of the First Signal"**, Subterranean Caverns,
recommended level 12, entry by activation key or a group of 3; rooms puzzle → combat arena → traversal
chamber → trap corridor → boss arena; modifiers gravity_shift, fog_of_war, enemy_variation; boss CR006;
loot boss_blueprint, alien_core, rare_alloy. To confirm when built: Apex Titan (the direction's
multi-phase boss) at level 12, and the caverns zone recommending level 15.

## Dungeons in the story (2026-10-19)

The dungeons proposed for each region (DGN_002 to DGN_006), their bosses, the endgame difficulties and the raids are in
[story.md](../story.md) §11 and §12, the Story chat's page.
