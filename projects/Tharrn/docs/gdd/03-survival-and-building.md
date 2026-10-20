# 03 — Survival and base building (direction §2.2)

## Vitals

| Vital | Range and effect |
|---|---|
| Hunger | 0–100; below 30, stamina regeneration −40 % |
| Hydration | 0–100; below 30, aim sway +25 % |
| Temperature | Optimal range per armour; outside it, damage over time and movement penalties |
| Radiation | Accumulates; thresholds give long-term stat penalties and need detox |
| Neural stability | 0–100; low values cause hallucinations (visual noise, phantom enemies) and aim jitter |

## Formulas

```
StaminaRegen = BaseRegen × (1 − HungerPenalty) × (1 − TempPenalty)
AimSway      = BaseSway × (1 + (30 − Hydration)/100 × 0.8 + (100 − Neural)/100 × 0.5)
```

## Resources

Organic, Mineral, Alloy, BiotechCore, EnergyCrystal. Nodes respawn on timers; rare nodes spawn in
flagged PvP zones.

## Base building

| Part | Spec |
|---|---|
| Modules | Foundation, wall, door, turret, generator, filtration, crafting bench |
| Power grid | Generators produce energy units, devices consume them; overload shuts down |
| Decay | Unmaintained structures decay; configurable rate, default 1 % per day |
| Claiming | Plots in PvP zones can be claimed, with timers and upkeep costs |

## Build notes (UE 5.8.3)

- **Vitals** are Gameplay Ability System attributes on the player state (replicated, server-owned); drain
  and recovery as periodic gameplay effects with rates in a CSV. The formulas live in one C++ calculation
  with unit tests at the 30 thresholds. *Build note:* as written, the hydration term is negative above
  30, so a well-hydrated player sways less than `BaseSway` (at 100 hydration and full neural stability
  the multiplier is 1 − 0.56 = 0.44). If the penalty should only apply below 30, the term becomes
  `max(0, 30 − Hydration)`. To confirm with the owner when the module is built.
- **Resources:** harvestable node actors (or PCG instances converted on hit) with a server-side respawn
  timer; node types and yields in a CSV.
- **Building:** the Sci-Fi Complete Bundle's modular structures (its building Blueprints have parent
  classes for pieces) as the kit; snapping, ghost preview and validity in C++; power grid as a server
  subsystem summing producers and consumers per connected network; decay as a slow server tick.
- **The kit and tiers (D-30, 2026-10-19):** the bundle's pieces are remade into individual parts that snap on its 3 m
  grid (foundations, floors, walls, doors, windows, roofs, stairs and more), in four tiers: Wooden Fiber, Salvaged Mineral, Enhanced Alloy and Biotech (D-33); its machines
  become the work stations. Plan, tools and progress: [building.md](../building.md).
- **Done when (Prototype):** hunger, hydration and temperature replicate and drive the two formulas
  (tested); bandage and ammo crafting; foundation, generator and bench placeable by two clients, seen the
  same by both.

## From the owner's package ([owner's package review](../reviews/owner-package-2026-10-15.md))

- **Inventory:** items data table; `PlayerInventory` with `AddItem` and `RemoveItem`; a grid UI.
- **Crafting:** recipes data table; `Server_RequestCraft` RPC; a craft queue.

Both are server-owned: the client asks, the server checks recipes and inventory, then changes both.
