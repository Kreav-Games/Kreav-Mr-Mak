# 01 — Player journey (direction §1)

The canonical flow from store page to endgame, with every UI moment, narrative beat and technical
handoff.

## 1.1 Pre-install and store

- Store assets: key art, a 30 s trailer, 10 screenshots, feature bullets, system requirements.
- Preload: core assets automatically; optional high-resolution texture pack prompt.
- Account linking: optional platform account link; privacy consent; cloud save opt-in.

## 1.2 First launch and main menu

- Cold boot: engine splash → studio logos → 10–15 s cinematic (convoy crash, alien signal).
- Main menu over an animated biome background: Continue, New Character, Multiplayer, Settings,
  Loadout Presets, Credits.
- First-time accessibility prompt: subtitles, colour-blind modes, HUD scale, control presets.

## 1.3 Character creation (MetaHuman)

Flow: **Preset → Face sculpt → Body → Implants/Scars → Voice → Origin → Loadout → Confirm.**

| Step | Spec |
|---|---|
| Presets | 12 curated MetaHumans with balanced diversity |
| Face sculpt | 120 morph sliders (jaw, brow, nose, cheek, lips), iris colour, sclera tint, micro-scars, alien biotech implants (glowing nodes, subdermal plates); real-time preview with breathing and eye tracking |
| Body | Height ±15 %, musculature, limb length, posture; the collision capsule adjusts |
| Materials | Subsurface skin parameters exposed; tattoo decals layered through mask textures |
| Voice | 8 voice packs with phoneme maps for lip sync; pitch modifier |
| Origin | Scientist, Soldier, Scavenger, Corporate Envoy: each sets a starting talent point, a unique starter item and a 3-step intro quest |
| Loadout | Weapon archetype and survival tool |
| Save | Compact JSON: preset, morphs, materials, tattoos, voice, origin, starter loadout |

```json
{
  "preset": "MH_Preset_07",
  "morphs": {"jaw_width": 0.12, "nose_length": -0.05},
  "materials": {"skin": "mat_skin_03", "eyes": "mat_eye_02"},
  "tattoos": ["tat_tribal_01"],
  "voice": "voice_pack_02",
  "origin": "Scavenger",
  "starter_loadout": {"weapon": "SMG_A1", "tool": "scanner"}
}
```

## 1.4 Intro cinematic and tutorial (0–40 minutes)

Hook: you are an Exodus Initiative operative; the convoy investigating an alien signal crashes,
scattering survivors and corrupting tech. Objective: survive, secure the extraction beacon, uncover the
mystery.

| Beat | Teaches |
|---|---|
| Crash site | Movement, sprint, crouch, mantle, basic aim, recoil demo |
| Vitals intro | HUD vitals appear; their effects (aim sway when dehydrated) |
| Scavenge and craft | Pick up organic and mineral; craft a bandage and basic ammo |
| First combat | A Skitterjaw pack; weak-point targeting and stagger *(the Skitterjaw is a desert creature, D-16; which creature the coastal tutorial uses is OQ-12)* |
| Shelter build | Place a foundation, deploy a generator, craft a bench |
| Beacon activation | A short mission; a nearby flagged PvP zone with a warning overlay |
| Optional co-op | An NPC companion or a friend joins to show team mechanics |

Success: the player survives a 10–15 minute expedition, crafts essentials and returns to a hub.

## 1.5 Open-world loop (midgame)

- Session: prep at a hub → expedition to a risk zone → dungeon or raid → extraction → return and
  upgrade.
- Cadence: daily missions; weekly world events (apex migrations, PvP hotspot rotations); seasonal
  content.
- Progression: XP, talent points, weapon mastery, blueprints, faction reputation.

## 1.6 Endgame and expansion

- Instanced high-risk raids, faction wars, territory control, seasonal events.
- New biomes as map extensions, reached by teleport gates or long-range vehicles.
- Persistent world: global boss kills unlock server-wide tech nodes.

## Build notes

- The tutorial is the Prototype's acceptance path: crash site, vitals, scavenge, Skitterjaw fight and
  shelter all exist in the Prototype in rough form; cinematic, beacon mission and co-op come with the
  vertical slice.
- Character creation depends on OQ-03 (runtime MetaHuman face sculpting). The Prototype uses presets.
- Store, preload and account linking are launch work (platform SDKs); not built before the beta.

## From the owner's package ([owner's package review](../reviews/owner-package-2026-10-15.md))

The preset schema extends the direction's JSON (deliverable 4; one preset of 12 so far):

```json
{
  "preset_id": "MH_Preset_01", "display_name": "Ari Voss", "base_preset": "mh_base_01",
  "morphs": {"jaw_width": 0.08, "nose_length": -0.02, "brow_height": 0.03, "cheekbone_prominence": 0.05},
  "materials": {"skin": "mat_skin_01", "eyes": "mat_eye_01", "hair": "mat_hair_01"},
  "tattoos": ["tat_geo_01"],
  "implants": [{"id": "imp_neural_node_01", "color": "#00FFCC", "glow": 0.6}],
  "voice": "voice_male_01",
  "body": {"height_meters": 1.82, "musculature": 0.6, "limb_proportion": 0.5},
  "origin": "Soldier", "starter_loadout": {"weapon": "AR01", "tool": "field_scanner"},
  "notes": "Balanced soldier preset with slight jaw and high cheekbones."
}
```

Key names follow the direction (`voice`, `eyes`). Height is stored in metres and limited to the base
preset's height ±15 %.
