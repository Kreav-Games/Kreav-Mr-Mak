# 08 — Creatures (direction §3.3)

Creature data CSV header:

```
id,name,biome,size,hp,armor,resistances,aggro_radius,loot_table,ai_profile
```

## The first six

| ID | Name | Size and role | HP | Loot | AI profile |
|---|---|---|---|---|---|
| CR001 | Skitterjaw | Small pack hunter | 120 | organic_fiber, teeth | pack_flank |
| CR002 | Lumivine Colossus | Large flora-beast; stationary root attacks | 420 | biolum_core, sap | root_burst |
| CR003 | Phase Warden | Medium sentient; teleport dodge | 260 | alloy_shard | teleport_shield |
| CR004 | Grav Raptor | Aerial; divebomb | 180 | talon_membrane | glide_dive |
| CR005 | Echo Swarm | Swarm; audio disorientation | 300 (aggregated) | swarm_gland | swarm_cloud |
| CR006 | Apex Titan | Boss; multi-phase | 4200 | boss_blueprint | multi_phase |

## Deliverables per creature

Concept art (front, side, three-quarter), silhouette, colour palette; LOD meshes (4 LODs), hit-box maps,
audio cues, VFX triggers; behaviour trees and blackboard keys; animation sets (idle, walk, run, attack
variants, stagger, death, special).

## Build notes

- **Prototype creatures:** Skitterjaw (desert pack flanker, D-16; the tutorial's first fight is OQ-12), Phase Warden
  (teleport dodge tests hit validation) and Grav Raptor (aerial) give three distinct AI problems. The
  owner may prefer another trio.
- **AI:** the direction says behaviour trees; UE 5.8's StateTree is the newer equivalent and both work
  with perception and EQS. Recommendation: StateTree for creature logic (Smart Objects for nests and
  feeding), behaviour trees where an Epic sample gives a head start. Server-side only; clients get
  replicated movement and montages.
- **Hit boxes:** per-bone physics bodies; weak points as tagged bodies with multipliers from the CSV.
- **Assets:** no creature meshes or animations are in the project yet (OQ-04). Placeholder: the template
  mannequin scaled and tinted, so behaviour can be built before art arrives.

## From the owner's package ([owner's package review](../reviews/owner-package-2026-10-15.md))

First rows (deliverable 5; armour Light = cloth 10 %, Medium = composite 30 %, Heavy = alloy 50 %;
resistances are damage reduction fractions; aggro radius in metres):

| id | Name | Biome | Size | HP | Armour | Resistances | Aggro | Loot | AI |
|---|---|---|---|---|---|---|---|---|---|
| CR001 | Skitterjaw | Crystalline Desert (D-16) | Small | 120 | Light | acid 0.2, fire 0.1 | 12 | organic_fiber, teeth | skitter_ai_v1 |
| CR002 | Lumivine Colossus | Fungal Forest | Large | 420 | Heavy | poison 0.5, fire 0.2 | 20 | biolum_core, sap | lumivine_ai_v1 |
| CR003 | Phase Warden | Crystalline Desert | Medium | 260 | Medium | energy 0.4 | 18 | alloy_shard | phase_warden_ai |

Skitterjaw behaviour outline (deliverable 9): Patrol → Detect → Chase → Flank → Pounce; blackboard keys
`TargetActor`, `AggroRadius`.
