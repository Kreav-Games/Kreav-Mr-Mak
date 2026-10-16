Executive Summary
Working title: Aetherfall: Exodus  
Genre: Sci‑fi Action‑RPG / Survival / Shooter (single + multiplayer)
Core promise: Deliver elite shooter gunfeel and high‑stakes survival on a vast alien archipelago, with Metahuman characters, flagged PvP hotspots, deep RPG dungeons/quests, and an extensible world for future expansions. Claude → Unreal MCP will build iteratively; each module must be polished and tested before the next begins.

High‑level specs (single line): 16–25 km² streamed open world; on‑foot cross map ≈45 minutes; vehicles reduce travel to ≈15–20 minutes; level cap 60; talent trees (Combat, Survival, Tech); PvP flagging on entry to designated zones; Metahumans for all player/NPC faces; server‑authoritative networking.

1. Complete Player Journey (Start → End) — Every Step, Every Touchpoint
This section is the canonical, step‑by‑step player flow with every UI/UX moment, narrative beat, and technical handoff.

1.1 Pre‑Install and Store Experience
Store assets: Key art, 30s trailer, 10 screenshots, feature bullets, system reqs.

Preload options: Core assets auto; optional high‑res texture pack prompt.

Account linking: Optional platform account link; privacy consent; cloud save opt‑in.

1.2 First Launch and Main Menu
Cold boot sequence: Engine splash → studio logos → 10–15s cinematic (convoy crash, alien signal).

Main menu: Animated biome background; options: Continue, New Character, Multiplayer, Settings, Loadout Presets, Credits.

Accessibility modal: first‑time prompt for subtitles, colorblind, HUD scale, control presets.

1.3 Character Creation (Metahuman) — Full Pipeline
Flow: Preset → Face sculpt → Body → Implants/Scars → Voice → Origin → Loadout → Confirm.
Details:

Presets: 12 curated Metahumans (balanced diversity).

Face sculpt: 120 morph sliders (jaw, brow, nose, cheek, lips), iris color, sclera tint, micro‑scars, alien biotech implants (glowing nodes, subdermal plates). Real‑time preview with breathing and eye tracking.

Body: height (±15%), musculature, limb length, posture. Collision capsule auto‑adjusts.

Materials: SSS skin shader parameters exposed; tattoo decals layered via mask textures.

Voice: 8 voice packs with phoneme maps for lip sync; choose pitch modifier.

Origin selection: 4 origins (Scientist, Soldier, Scavenger, Corporate Envoy). Each sets: starting talent point, unique starter item, and a 3‑step intro quest.

Starter loadout: choose weapon archetype and survival tool.

Save: customization exported as compact JSON (morphs, materials, tattoos, voice id).

Metahuman JSON example

json
{
  "preset":"MH_Preset_07",
  "morphs":{"jaw_width":0.12,"nose_length":-0.05},
  "materials":{"skin":"mat_skin_03","eyes":"mat_eye_02"},
  "tattoos":["tat_tribal_01"],
  "voice":"voice_pack_02",
  "origin":"Scavenger",
  "starter_loadout":{"weapon":"SMG_A1","tool":"scanner"}
}
1.4 Intro Cinematic + Tutorial (0–40 minutes)
Narrative hook: Player is an Exodus Initiative operative; convoy investigating alien signal; crash scatters survivors and corrupts tech. Objective: survive, secure extraction beacon, uncover alien mystery.
Tutorial beats (scripted sequence):

Crash site: movement, sprint, crouch, mantle, basic aim, recoil demo.

Vitals intro: HUD vitals appear; show effects (aim sway when dehydrated).

Scavenge & craft: pick up organic/mineral; craft bandage and basic ammo.

First combat: Skitterjaw pack encounter; teach weak‑point targeting and stagger.

Shelter build: place foundation, deploy generator, craft bench.

Beacon activation: short mission; introduces flagged PvP zone nearby (warning overlay).

Optional co‑op: NPC companion or friend join to demonstrate team mechanics.

Success criteria: Player can survive a 10–15 minute expedition, craft essentials, and return to hub.

1.5 Open World Loop (Midgame)
Session loop: Prep at hub → Expedition to risk zone → Dungeon/Raid → Extraction → Return & upgrade.
Daily/Weekly cadence: Daily missions, weekly world events (apex migrations, PvP hotspot rotations), seasonal content.
Progression: XP, talent points, weapon mastery, blueprints, faction reputation.

1.6 Endgame & Expansion
Endgame activities: instanced high‑risk raids, faction wars, territory control, seasonal events.

Expansions: new biomes added as map extensions; teleport gates or long‑range vehicles unlock travel.

Persistent world: global boss kills unlock server‑wide tech nodes.

2. Systems & Mechanics — Exhaustive Specs for Implementation
This section lists every system with parameters, formulas, data table examples, and integration notes.

2.1 Combat System (Shooter Fidelity)
Core models

Fire modes: hitscan (SMG, pistol), projectile (heavy rounds), beam/charge (energy weapons).

Recoil model: per‑weapon recoil curve defined as time‑series of vertical/horizontal offsets and recovery function. Example: AR01_recoil = [{t:0, vx:0.18, vy:0.02}, {t:0.1, vx:0.16, vy:-0.01}, ...].

Accuracy: hip_spread, ads_spread, movement_penalty multiplier.

Damage multipliers: head ×2.5, torso ×1.0, limb ×0.75. Armor reduces damage by material % (cloth 10%, composite 30%, alloy 50%).

Aim assist: controller only; magnetism radius 0.6°; strength 0.15 (configurable).

Ballistics: heavy projectiles have gravity drop and travel time; server authoritative sim with client prediction and lag compensation.

Weapon data CSV header

Code
weapon_id,name,type,damage,fire_rate,mag_size,weight,range,projectile_speed,hit_type
Attachment system

Slots: barrel, stock, magazine, optic, core.

Effects: modify recoil, accuracy, handling, weight. Attachments have rarity and require blueprints.

Advanced combat features

Stagger system: cumulative stagger meter per enemy; thresholds trigger stagger animations and interrupt attacks.

Weak points: specific bones with damage multipliers and VFX.

Movement tech: sprint, slide, mantle, short jetpack burst (consumes stamina), grapple tether. Movement modifiers per armor.

2.2 Survival Systems
Vitals

Hunger (0–100): below 30 reduces stamina regen by 40%.

Hydration (0–100): below 30 increases aim sway by 25%.

Temperature: optimal range per armor; outside range causes DOT and movement penalties.

Radiation: accumulative; thresholds cause long‑term stat penalties and require detox.

Neural stability (0–100): low values cause hallucinations (visual noise, phantom enemies) and aim jitter.

Formulas

Stamina Regen = BaseRegen × (1 − HungerPenalty) × (1 − TempPenalty)

AimSway = BaseSway × (1 + (30 − Hydration)/100 × 0.8 + (100 − Neural)/100 × 0.5)

Resource types

Organic, Mineral, Alloy, BiotechCore, EnergyCrystal. Nodes respawn on timers; rare nodes spawn in flagged PvP zones.

Base building

Modules: foundation, wall, door, turret, generator, filtration, crafting bench.

Power grid: generators produce energy units; devices consume units. Overload causes shutdown.

Decay: structures decay if not maintained; decay rate configurable (default 1% per day).

Claiming: claim plots in PvP zones with timers and upkeep costs.

2.3 RPG Systems
Progression

Level cap: 60 (configurable).

XP curve: exponential; XP per level = baseXP * (1.12)^(level−1).

Talent points: 1 per level; three trees: Combat, Survival, Tech. Each node has prerequisites and unlocks mechanics.

Talent tree examples

Combat: Precision Training (reduced recoil), Quick Reload (−15% reload), Suppressive Fire (AOE suppression).

Survival: Efficient Forager (+20% resource yield), Advanced Filtration (reduce water consumption), Field Medic (faster heal).

Tech: Drone Control (deploy drone), Power Optimization (reduce generator consumption), Alien Synthesis (craft alien cores).

Quests & Dungeons

Quest types: main, side, faction, timed, dungeon.

Dungeon template: 6 room types, 3 puzzle archetypes, 2 trap archetypes, 1 mini‑boss, final boss. Procedural modifiers: gravity_shift, fog, enemy_variants.

Loot tiers

Common, Uncommon, Rare, Advanced, Alien. Blueprints required for higher tiers.

2.4 PvP Flagged Zones (Detailed Rules)
Flagging mechanics

Entry: immediate server‑side flag on crossing zone boundary.

Cooldown: flag persists until player exits and remains outside for 60s (configurable).

Consent buffer: optional 10s consent buffer on entry for casual servers.

State: Player.Flagged = true/false; HUD shows red icon and timer.

Consequences

Combat: flagged players can damage each other; non‑flagged cannot be attacked.

Loot: default full‑loot on death in flagged zones; secured base storage safe unless raided.

Bounties: kills accrue bounties; bounty hunters can track flagged players with devices.

Extraction: extraction points with progress bars; interruptible by other players.

Anti‑abuse

Combat logging: disconnect spawns AI proxy with player's gear for 5 minutes.

Grief mitigation: newbie protection timers, safe respawn outside PvP zones.

Cheat detection: server‑side validation and automated reporting.

2.5 Vehicles & Traversal
Vehicle classes: hoverbike (solo), skiff (2–4 players), transport (armored).

Fuel: crafted or found; fuel consumption rates per vehicle.

Durability: vehicles take damage and require repair.

Traversal times: on‑foot ≈45 min across map; hoverbike ≈15–20 min.

3. World, Biomes, Creatures, Dungeons, and Assets
Complete world design, asset lists, creature specs, and dungeon templates.

3.1 World Scale & Layout
Playable area: 16–25 km² streamed with World Partition.

Biome layout: Coastal (start) → Fungal Forest → Crystalline Desert → High‑Gravity Plateau → Subterranean Caverns → Floating Archipelagos (endgame).

Hub towns: 6 hubs distributed; safe services, vendors, mission boards.

PvP zones: 8–12 hotspots of varying sizes; buffer belts (amber zones) surround them.

3.2 Biome Details (per biome)
Coastal (Starter)

Features: wreckage, shallow pools, small fauna.

Resources: organic, low‑tier minerals.

Threats: skitter packs, tidal storms.

Fungal Forest

Features: bioluminescent flora, spore clouds.

Resources: biotech cores, organic fiber.

Threats: spore bloom, Lumivine Colossus.

Crystalline Desert

Features: crystal fields, gravity anomalies.

Resources: energy crystals, alloy veins.

Threats: sand raptors, grav raptors.

High‑Gravity Plateau

Features: heavy fauna, slow movement.

Resources: rare alloys.

Threats: heavy grazers, territorial titans.

Subterranean Caverns

Features: oxygen limits, echo swarms.

Resources: alien cores, rare minerals.

Threats: Echo Swarm, cave collapses.

Floating Archipelagos

Features: aerial traversal, PvP warzones.

Resources: endgame blueprints.

Threats: aerial predators, faction fortresses.

3.3 Creature Design — Template & Examples
Creature data CSV header

Code
id,name,biome,size,hp,armor,resistances,aggro_radius,loot_table,ai_profile
Example creatures (first 6)

Skitterjaw (CR001) — Small; pack hunter; HP 120; loot: organic_fiber, teeth; AI: pack_flank.

Lumivine Colossus (CR002) — Large flora‑beast; stationary root attacks; HP 420; loot: biolum_core, sap; AI: root_burst.

Phase Warden (CR003) — Medium sentient; teleport dodge; HP 260; loot: alloy_shard; AI: teleport_shield.

Grav Raptor (CR004) — Aerial; divebomb; HP 180; loot: talon_membrane; AI: glide_dive.

Echo Swarm (CR005) — Swarm; audio disorientation; HP aggregated 300; loot: swarm_gland; AI: swarm_cloud.

Apex Titan (CR006) — Boss; multi‑phase; HP 4200; loot: boss_blueprint; AI: multi_phase.

Creature deliverables

Concept art (front/side/3‑quarter), silhouette, color palette.

LOD meshes (4 LODs), hitbox maps, audio cues, VFX triggers.

Behavior trees and blackboard keys.

Animation sets: idle, walk, run, attack variants, stagger, death, special.

3.4 Dungeon Template (Full)
Dungeon meta

dungeon_id,name,biome,recommended_level,entry_requirements,boss_id,loot_pool

Room templates

Puzzle Room: requires crafted item or environmental trigger.

Combat Arena: multi‑wave enemies with cover and verticality.

Traversal Chamber: platforming, gravity shifts.

Trap Corridor: timed hazards and detection.

Boss Arena: multi‑phase with environmental mechanics.

Procedural modifiers

GravityShift (low/high), FogOfWar, EnemyLoadoutVariation, TimeLimit.

Boss design

Multi‑phase with health thresholds at 75/50/25%; each phase adds mechanics (shield, summon minions, environmental hazard). Drops unique blueprints and rare loot.

4. UI / HUD / UX — Pixel‑Perfect Specs & Mockups
Complete HUD layout, UI states, JSON examples, and accessibility.

4.1 HUD Layout (Primary)
Top‑center: Compass (800×48) with PvP indicators and objective markers.

Top‑right: Mini‑map (240×240) toggleable; shows extraction points and flagged overlays.

Bottom‑left (Vitals cluster): Health bar (large), stamina ring, hunger %, hydration %, temperature gauge, neural stability bar.

Bottom‑center (Weapon HUD): weapon icon, mag/total ammo, fire mode icon, attachment icons.

Bottom‑right: quick‑use wheel (4 slots) with cooldown overlays.

Center: dynamic crosshair (scalable), hit markers, damage numbers, weak‑point indicators.

Top‑left: player name, level, active buffs/debuffs.

Notifications: top‑center transient messages (quest updates, PvP flagging).

Death screen: drop list, respawn options, recovery timer, teammate ping.

4.2 UI JSON Layout Example
json
{
  "hud": {
    "compass":{"pos":"top_center","size":"800x48"},
    "minimap":{"pos":"top_right","size":"240x240"},
    "vitals":{"pos":"bottom_left","elements":["health","stamina","hunger","hydration","temp","neural"]},
    "weapon":{"pos":"bottom_center","size":"420x120"},
    "quickwheel":{"pos":"bottom_right","slots":4}
  }
}
4.3 Menus & Flows
Character creation: full‑screen Metahuman preview with morph sliders; real‑time facial animation.

Inventory: grid + weight limit; quick craft recipes; filter by type.

Map: layered with PvP zones, resource nodes, dungeon entrances; zoom levels.

Quest log: objectives, stages, lore entries, map markers.

HUD accessibility: scalable UI, colorblind modes, subtitle sizes, controller remap.

4.4 Loading Screens & Cinematics
Loading screen: dynamic tips, server PvP hotspot status, last known base, active quests, Metahuman closeups with subtle facial animation.

Cinematics: use sequencer with Metahuman facial animation and Wwise audio events.

5. Technical Implementation — Unreal‑Ready, Claude‑Ingestible Artifacts
Detailed pipelines, file formats, Blueprints pseudocode, data tables, and integration notes.

5.1 Art & Asset Pipeline
Formats: FBX for meshes, PNG/TGA for textures, USD for scene assembly.

LOD: 4 LODs per character/creature; billboards for distant fauna.

Textures: PBR maps: T_diff, T_norm, T_rough, T_ao, T_subs.

Materials: layered PBR with masks for damage/dirt; subsurface scattering for skin.

VFX: Niagara; GPU particles for swarms/storms.

Audio: Wwise integration; event naming SFX_, MUS_, VO_.

5.2 Metahuman Integration
Pipeline: Metahuman Creator → export FBX + Alembic for facial animation → Control Rig for procedural adjustments.

Customization storage: JSON schema (see earlier).

LOD & performance: highest LOD for closeups; aggressive LOD for distant players.

5.3 Blueprints & Systems (Pseudocode)
Flagging State (server authoritative)

text
Event OnPlayerEnterZone(zone)
  if zone.type == "PvP"
    Player.Flagged = true
    Player.FlagTimer = 0
    Broadcast HUD update (red icon, timer)
  end

Tick(delta)
  if Player.Flagged and not Player.InPvPZone
    Player.FlagTimer += delta
    if Player.FlagTimer >= 60
      Player.Flagged = false
      Broadcast HUD update (clear)
    end
  end
Extraction RPCs

Server_RequestExtraction(player, extractionPointId) → validate, start progress, replicate to nearby players, allow interrupt via Server_InterruptExtraction(attackerId).

5.4 Data Tables & CSV Examples
Zone CSV header

Code
zone_id,name,type,bounds_min_x,bounds_min_y,bounds_max_x,bounds_max_y,pvp_flag,loot_tier,spawn_timer_seconds
Creature CSV header

Code
id,name,biome,size,hp,armor,resistances,aggro_radius,loot_table,ai_profile
Weapon CSV header

Code
weapon_id,name,type,damage,fire_rate,mag_size,weight,range,projectile_speed,hit_type
5.5 Networking & Server Architecture
Model: dedicated authoritative servers; interest management by proximity and zone.

PvP zones: higher tick rates (60–90Hz) and rollback/lag compensation for precision.

Persistence: shard servers for region ownership; cloud save for player progression and base state.

Anti‑abuse: server‑side validation, combat logging proxies, automated cheat detection.

5.6 Tools & Deliverables for Claude
Produce these artifacts, one at a time, for ingestion:

Full GDD (this doc modularized).

Zone Definition CSV — full map with PvP flags and spawn timers.

Flagging State Blueprint pseudocode (expanded).

Metahuman JSON schema + 12 presets.

Creature CSV roster (30 entries) with stat blocks.

Dungeon template pack (room templates, procedural modifiers, boss scripts).

Weapon CSV + attachment table.

HUD JSON + PNG icon pack.

Behavior Tree templates and blackboard keys.

QA test matrix and acceptance criteria.

6. Production Roadmap, QA, Metrics, and Acceptance Criteria
Concrete milestones, test plans, and live metrics.

6.1 Roadmap (High Level)
Prototype (0–3 months): core shooter feel, vitals, one biome, 3 creatures, Metahuman base.

Vertical Slice (3–9 months): full dungeon, boss, base building, flagged PvP zone, one faction questline, co‑op extraction.

Alpha (9–15 months): multiple biomes, creature roster, weapon mod system, vehicles, basic multiplayer.

Beta (15–18 months): polish, balancing, endgame content, server stress testing.

Launch + Live Ops (18+ months): seasonal events, expansions.

6.2 QA & Acceptance Criteria (Per Module)
Combat feel: 95th percentile player test reports responsive aim; server logs show <2% desync in controlled tests.

Survival balance: average expedition length matches design; vitals influence but do not punish.

PvP zones: flagging reliable; extraction interrupts function; combat logging proxies spawn correctly.

Metahuman fidelity: facial animation matches voice lines; LOD transitions seamless.

Performance: target 60 FPS consoles, 120 FPS high‑end PC with streaming and HLOD.

6.3 Testing Matrix (Sample)
Combat: recoil curves, hit registration, latency compensation.

Survival: vitals thresholds, resource spawn rates, base decay.

PvP: flagging, extraction, loot rules, combat logging.

AI: behavior trees, pack coordination, spawn scaling.

Network: tick rates, interest management, rollback tests.

6.4 Live Metrics to Monitor
Time in PvP zones, dungeon completion rates, loot flow, combat log incidents, grief reports, day‑1/7/30 retention, server load.
