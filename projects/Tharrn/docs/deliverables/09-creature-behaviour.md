# Deliverable 9 — Creature behaviour templates and keys

Version 0.1, 2026-10-15. The direction asks for behaviour tree templates and blackboard keys (§5.6). GDD 08
recommends Unreal's **StateTree** for creature logic (the newer equivalent; it works with perception and EQS), so
the templates below are written as StateTree states; the keys play the blackboard's part. Behaviour runs on the
**server only** (D-04); clients receive movement, montages and effects. The owner's Skitterjaw outline (Patrol →
Detect → Chase → Flank → Pounce, keys `TargetActor`, `AggroRadius`) is kept. Numbers and moves the direction does not
give are marked **Proposal**.

## 1. Shared creature template

Every creature runs the same outer states; its own combat state plugs in where marked.

```
Root
├─ Dead                      (health 0: ragdoll or death montage, drop loot from the loot table, despawn later)
├─ Staggered                 (stagger meter full: interrupt montage, no attacks for StaggerSeconds)
├─ Combat  ◄── <creature's own combat subtree>
│     enter: TargetActor set and within LeashRadius of HomeLocation
├─ Search                    (target lost: go to LastKnownTargetLocation, look around SearchSeconds)
├─ Return                    (beyond LeashRadius, or search over: walk home, heal to full)
└─ Idle                      (patrol or wander near HomeLocation; the default)
```

Transitions are evaluated top-down: `Dead` and `Staggered` win over everything; `Combat` needs a target.

| Key | Type | Set by | Meaning |
|---|---|---|---|
| `TargetActor` | actor | perception | The player being fought (owner's key) |
| `AggroRadius` | metres | `DT_Creatures.aggro_radius` | Sight radius for noticing a player (owner's key) |
| `HomeLocation` | vector | spawn | Where it spawned; patrol and leash centre |
| `LeashRadius` | metres | **Proposal:** 3 × `AggroRadius` | Farther than this from home it gives up |
| `LastKnownTargetLocation` | vector | perception | Where the target was last seen or heard |
| `StaggerMeter` | 0–1 | damage | Fills with damage; full → `Staggered` |
| `StaggerSeconds` | seconds | **Proposal:** 1.5 | How long a stagger lasts |
| `SearchSeconds` | seconds | **Proposal:** 8 | How long it searches before returning |
| `ThreatTable` | map actor → threat | damage taken | Who hurt it most; may switch `TargetActor` |

**Perception:** sight radius `AggroRadius`, lose-sight radius `AggroRadius` + 30 % (**Proposal**), 140° view;
hearing for gunshots at 2 × `AggroRadius` (**Proposal**) that sets `LastKnownTargetLocation` only. Unflagged and
flagged players are treated alike: PvP flags do not concern creatures ([deliverable 3](03-flagging-state.md) §5).

## 2. Skitterjaw (CR001) — pack flanker, Crystalline Desert

Small, 120 health, light armour, acid 20 % and fire 10 % resistance, notices you at 12 m.

```
Combat (Skitterjaw)
├─ Pounce                    (in a flank slot, within PounceRange, target not facing it: leap with motion warping,
│                             bite on landing; then Recover)
├─ Recover                   (back off 4–6 m, PounceCooldown)
├─ Flank                     (move to the slot the pack gave it: left, right or behind the target)
└─ Chase                     (no slot yet or target running: close in, keep 3–5 m apart from packmates)
```

| Key | Type | Meaning |
|---|---|---|
| `PackId` | int | The pack it belongs to; the pack is a small server object, not a creature |
| `FlankSlot` | none, left, right, rear | Slot assigned by the pack (an EQS query around the target picks free, reachable points) |
| `PounceRange` | metres | **Proposal:** 6 m |
| `PounceCooldown` | seconds | **Proposal:** 4 s |
| `FacingAngleToTarget` | degrees | Pounce only when over 60° off the target's aim (**Proposal**): it attacks from where you are not looking |

Pack rules (**Proposal**): 3–5 per pack; the first to notice you alerts the others within 25 m; at most two pounce
at once; when two thirds of the pack are dead the rest flee. Weak point: the head (multiplier in the creature data,
P6).

## 3. Phase Warden (CR003) — teleporting sentinel, Crystalline Desert

Medium, 260 health, medium armour, energy 40 % resistance, notices you at 18 m.

```
Combat (Phase Warden)
├─ PhaseDodge                (shot at or aimed at for AimedAtSeconds: teleport 6–10 m sideways to a point with sight
│                             of the target (EQS); PhaseCooldown)
├─ ShieldUp                  (shield broken or health below 50 %: raise the shield bubble for ShieldSeconds)
├─ Attack                    (keep 12–18 m: ranged energy bolts, projectile)
└─ Reposition                (no line of sight: move to a point that has one)
```

| Key | Type | Meaning |
|---|---|---|
| `AimedAtSeconds` | seconds | **Proposal:** 0.6 s of a player aiming down sights at it triggers a dodge |
| `PhaseCooldown` | seconds | **Proposal:** 5 s |
| `ShieldHealth` | points | **Proposal:** 80, regrows after 6 s without damage |
| `ShieldSeconds` | seconds | **Proposal:** 4 s |
| `PreferredRange` | metres | **Proposal:** 12–18 m |

Network: the teleport is a server move with a replicated effect at both points. Shots that clients fired at the old
position arrive after the server has moved it, and the server's hit check (rewound to the shot's time, OQ-09)
decides them: this creature is the test of hit validation (QA A-05).

## 4. Grav Raptor (CR004) — aerial diver, Crystalline Desert

180 health, notices you from the air. Stats beyond health and loot are not in the data yet.

```
Combat (Grav Raptor)
├─ Dive                      (lined up above and behind the target: dive along a predicted path, rake on contact)
├─ Exposed                   (after a dive, ExposedSeconds low and slow: its weak point is open)
├─ Climb                     (back up to CircleAltitude)
└─ Circle                    (orbit the target at CircleAltitude, CircleRadius; screech to warn before a dive)
```

| Key | Type | Meaning |
|---|---|---|
| `CircleAltitude` | metres | **Proposal:** 15 m above the ground |
| `CircleRadius` | metres | **Proposal:** 12 m |
| `DiveCooldown` | seconds | **Proposal:** 6 s |
| `ExposedSeconds` | seconds | **Proposal:** 2 s, the moment to shoot it |
| `DiveWarning` | seconds | **Proposal:** 0.8 s screech before every dive (fair for the player) |

Flight uses the Flying movement mode with its own path checks (no navigation mesh in the air).

## 5. The other three (outlines; built after the Prototype)

**Proposal** as a whole: these states are built from the direction's one-line descriptions.

| Creature | States | Keys |
|---|---|---|
| **Lumivine Colossus** (CR002), Fungal Forest, stationary, 420 health, heavy armour | `RootSlam` (telegraphed circles on the ground where roots erupt), `SporeBurst` at 66 % and 33 % health (a cloud that drains neural stability), `Recover` (core exposed) | `RootTargets`, `SporePhase`, `CoreExposed` |
| **Echo Swarm** (CR005), Subterranean Caverns, 300 health shared | `Gather` (one cloud), `Split` (several clouds when hit by area damage), `Disorient` (a sound attack: muffled audio, HUD shake for the target), `Rejoin` | `SwarmHealth`, `CloudCount`, `DisorientCooldown` |
| **Apex Titan** (CR006), boss of *Ruins of the First Signal*, 4200 health | Phase 1 melee and charge; at 75 % a shield; at 50 % minions; at 25 % an arena hazard (GDD 09) | `Phase`, `ShieldActive`, `MinionCount`, `HazardActive` |

## 6. Building it (P6)

| Part | How |
|---|---|
| Logic | One StateTree per creature with the shared outer states as a linked subtree; tasks in C++ where they are complex (pack slots, dive prediction, teleport search), simple ones in Blueprint with notes (D-07) |
| Data | Health, armour, resistances, aggro radius and loot from `DT_Creatures`; the Proposal numbers above go into new CSV columns once the owner settles them |
| Placeholders | The template mannequin scaled and tinted until creature art exists (OQ-04) |
| Tests | QA matrix A-01 to A-05 ([deliverable 10](10-qa-matrix.md)) |
