# 06 — Vehicles and traversal (direction §2.5)

| Spec | Value |
|---|---|
| Classes | Hoverbike (solo), skiff (2–4 players), transport (armoured) |
| Fuel | Crafted or found; consumption rate per vehicle |
| Durability | Vehicles take damage and need repair |
| Travel | On foot ≈ 45 min across the map; hoverbike ≈ 15–20 min |

## Build notes

- The Sci-Fi Complete Bundle has a hoverbike with Blueprints, effects and sound; it is the starting point
  for the hoverbike, rebuilt for replication (vehicle movement on the server with client prediction).
- At about 75 km² (D-14) the map is about 13 km across: ≈ 45 minutes on foot means about 5 m/s average
  (mostly running), and the hoverbike's 15–20 minutes about 11–15 m/s. Movement and vehicle speeds are
  tuned against these targets (OQ-13).
- Alpha milestone in the direction's roadmap; not in the Prototype.
