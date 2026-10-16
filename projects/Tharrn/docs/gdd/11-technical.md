# 11 — Technical implementation (direction §5)

## Art and asset pipeline

- Formats: FBX meshes, PNG/TGA textures, USD for scene assembly.
- 4 LODs per character and creature; billboards for distant fauna.
- PBR maps `T_diff`, `T_norm`, `T_rough`, `T_ao`, `T_subs`; layered materials with damage and dirt masks;
  subsurface scattering for skin.
- VFX in Niagara; GPU particles for swarms and storms.
- Audio: Wwise with event names `SFX_`, `MUS_`, `VO_` (MetaSounds until then, D-05).

## MetaHumans

- Pipeline: MetaHuman Creator → FBX plus Alembic for facial animation → Control Rig for procedural
  adjustment. Customisation stored as JSON ([01](01-player-journey.md)). Highest LOD for close-ups,
  aggressive LOD for distant players.
- *Build note:* in UE 5.8 MetaHuman creation is inside the editor and characters are assembled there;
  facial animation can come from MetaHuman Animator. Runtime face sculpting at the direction's scale is
  OQ-03. The Game Animation Sample in the project already brings MetaHuman content.

## Data tables

```
zone_id,name,type,bounds_min_x,bounds_min_y,bounds_max_x,bounds_max_y,pvp_flag,loot_tier,spawn_timer_seconds
id,name,biome,size,hp,armor,resistances,aggro_radius,loot_table,ai_profile
weapon_id,name,type,damage,fire_rate,mag_size,weight,range,projectile_speed,hit_type
```

Each CSV gets a matching C++ row struct and a `DT_` table; the CSV is the source (D-07).

## Networking and servers

- Dedicated authoritative servers; interest management by proximity and zone.
- PvP zones at higher tick rates (60–90 Hz) with rollback and lag compensation.
- Persistence: shard servers for region ownership; cloud save for progression and base state.
- Anti-abuse: server validation, combat-logging proxies, automated cheat detection.

### Build notes (UE 5.8.3)

- Development uses PIE with a server inside the editor; packaged dedicated servers need a source-built
  engine (OQ-02).
- Interest management: replication graph or Iris (UE's newer replication system) once actor counts
  demand it; start with standard replication and net cull distances per actor class.
- Per-zone tick rates are a server configuration question (several server processes or one with
  adaptive rates); measured in the vertical slice.
- Shards, cloud save and live ops need backend services (for example Epic Online Services) beyond the
  engine; planned at alpha.

## Deliverables for Claude (direction §5.6)

Ten artifacts, one at a time; tracked in [00-overview](00-overview.md).
