# 02 — Combat (direction §2.1)

## Core models

| Model | Spec |
|---|---|
| Fire modes | Hitscan (SMG, pistol); projectile (heavy rounds); beam or charge (energy weapons) |
| Recoil | Per-weapon curve: a time series of vertical and horizontal offsets plus a recovery function, e.g. `AR01_recoil = [{t:0, vx:0.18, vy:0.02}, {t:0.1, vx:0.16, vy:-0.01}, ...]` |
| Accuracy | `hip_spread`, `ads_spread`, `movement_penalty` multiplier |
| Damage | Head ×2.5, torso ×1.0, limb ×0.75. Armour reduces damage by material: cloth 10 %, composite 30 %, alloy 50 % |
| Aim assist | Controller only; magnetism radius 0.6°, strength 0.15 (configurable) |
| Ballistics | Heavy projectiles have gravity drop and travel time; server-authoritative simulation with client prediction and lag compensation |

Weapon data CSV header:

```
weapon_id,name,type,damage,fire_rate,mag_size,weight,range,projectile_speed,hit_type
```

## Attachments

Slots: barrel, stock, magazine, optic, core. They modify recoil, accuracy, handling and weight, have a
rarity, and need blueprints.

## Advanced features

- **Stagger:** a cumulative stagger meter per enemy; thresholds trigger stagger animations and
  interrupt attacks.
- **Weak points:** specific bones with damage multipliers and VFX.
- **Movement tech:** sprint, slide, mantle, a short jetpack burst (uses stamina), a grapple tether;
  movement modifiers per armour.

## Build notes (UE 5.8.3)

- **Server authority (D-04):** the client fires immediately for feel (muzzle, recoil, tracer, predicted
  hit marker) and sends the shot; the server validates and applies damage with hit boxes rewound to the
  shooter's view time (lag compensation is not built into the engine and is our own system, OQ-09).
  Projectiles are server actors with client-side prediction for the shooter.
- **Data:** `DT_Weapons` from the weapon CSV; recoil curves as their own CSV (`weapon_id,t,vx,vy`) into
  curve tables; attachments as a CSV of modifiers. Gameplay Ability System for damage effects, armour and
  stat modifiers; the firing loop itself is a C++ weapon component (complex, D-07); weapon definitions are
  data-only Blueprints.
- **Animation:** the Game Animation Sample's motion-matched locomotion plus rifle and pistol aim layers;
  weapon animation assets are missing (OQ-04). Camera: third person over the shoulder with aim-down-sights
  (D-15).
- **Movement tech** extends the character movement (C++); slide and mantle first (the sample has
  traversal), jetpack and grapple after.
- **Done when (Prototype):** SMG, pistol and one heavy projectile weapon from CSV; recoil and spread
  readable in a test range; head/torso/limb multipliers and armour reduction covered by automation
  tests; two clients at 100 ms simulated latency hit what they aim at (server logs under 2 % desync,
  direction §6.2); stagger and one weak point on the Skitterjaw.

## From the owner's package ([owner's package review](../reviews/owner-package-2026-10-15.md))

First weapon rows (deliverable 7; units: damage per hit, fire rate in rounds per minute, range in metres,
weight in kg, projectile speed in m/s):

| weapon_id | Name | Type | Damage | Fire rate | Mag | Weight | Range | Speed | Hit |
|---|---|---|---|---|---|---|---|---|---|
| AR01 | Assault Rifle AR-01 | Ballistic | 28 | 600 | 30 | 3.2 | 600 | — | hitscan |
| SMG_A1 | SMG A1 | Ballistic | 16 | 900 | 40 | 2.1 | 200 | — | hitscan |
| SG01 | Shotgun SG-01 | Spread | 120 | 70 | 8 | 4.5 | 30 | — | hitscan pellets *(proposed; the package says projectile with speed 0)* |

Still missing for the direction's fire modes: a pistol (hitscan), a heavy projectile weapon and an energy
beam or charge weapon. Proposed, with attachments, in [deliverable 7](../deliverables/07-weapons-and-attachments.md).
