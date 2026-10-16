# Dev Notes for Claude -> Unreal MCP

1. Import order:
   - Metahuman presets (data/metahuman_presets.json)
   - Zone definitions (data/zones_definition.csv) into Zone Manager
   - Blueprints pseudocode into Blueprint templates
   - Data tables (weapons.csv, creatures.csv) into DataTable assets
   - HUD JSON into UMG layout
   - Behavior trees into AI folder
   - Art briefs to artists; assets placed under Content/Art

2. Naming conventions:
   - Meshes: CH_, CR_, WP_, ENV_
   - Textures: T_<name>_diff, T_<name>_norm, T_<name>_rough, T_<name>_ao, T_<name>_subs
   - VFX: VFX_<name>
   - Audio: SFX_<name>, MUS_<name>, VO_<name>

3. Claude integration:
   - Provide these files to Claude as the canonical spec.
   - Instruct Claude to produce Unreal Blueprints and DataTables matching CSV/JSON schemas.
