# Tharrn — Weapons and tools

The owner opened a **Weapons and Tools chat** on 2026-10-19: "Here we will disect the assets we have for guns, we will
use other AI that can help us Build the assests we need. we can access Blender. We will add Higgsfield, Tripo 3d or
better as needed for higher quality trilple A assets." (D-32). The wiki's Combat and arsenal tab is this chat's space.

This page is that chat's home: what the Multiplayer Shooter System (MSS) gives today, taken apart; what Tharrn's own
weapons, tools and attachments have to be (D-22); which AI and tools do which job and what is missing; the arsenal to
make; the steps. A new chat on this work reads this page, [GDD 02](gdd/02-combat.md), [deliverable 7](deliverables/07-weapons-and-attachments.md)
(the weapon and attachment data) and the [MSS reference](mss.md).

## 1. What the shooter pack has (measured 2026-10-19)

Read from the open editor through Unreal MCP without changing anything: every weapon's vertices per LOD, parts, bones,
sockets, size, materials and textures, and a thumbnail of each (section 9). The pack's weapons stand in for Tharrn's
(D-22, D-23): its rifle is the SMG A1, its pistol the Sidearm PS-01, its grenade launcher the GL-01, and Epic's demo
grenade the HG-01 (`Data/Items.csv`).

| Weapon (`/Game/DMD/Meshes/Weapon/`, MK1 bullet variant) | Stands in for | Vertices LOD0 to LOD3 | Parts (vertices) | Bones | Size | Material slots |
|---|---|---|---|---|---|---|
| Rifle (`SKM_LW_Rifle_Bullet_MK1`) | SMG A1 | 21,850 → 13,270 → 6,630 → 2,946 | Body 13,459; Grip 2,260; Magazine 1,066; Muzzle 1,182; Sight 1,047; Stock 2,820 | Root, Grip, Door, Trigger, Magazine, Barrel, Bolt | 109 × 30 × 8 cm | Weapon, Glass |
| Pistol (`SKM_LW_Pistol_Bullet_MK1`) | Sidearm PS-01 | 9,596 → 5,833 → 3,476 → 1,677 | Body 4,853; Grip 3,734; Magazine 141; Sight 868 | Root, Grip, Slide, Door, Trigger, Magazine, Barrel | 25 × 21 × 4 cm | Weapon, Glass |
| Grenade launcher (`SKM_GL_Impact_MK1`) | Grenade Launcher GL-01 | 14,004 → 7,850 → 4,421 → 1,994 | Barrel 3,804; Body 3,922; Grenade 1,216; Grip 927; Sight 2,428; Stock 1,707 | Root, Grip, Trigger, Barrel, Magazine | 65 × 27 × 6 cm | Weapon, Glass, Grenade |
| Shotgun (`SKM_LW_Shotgun_Bullet_MK1`) | nothing yet (SG-01 has no item) | 19,476 → 11,581 → 6,441 → 2,944 | Body 4,966; Grip 2,257; Magazine 1,266; Muzzle 7,788; Sight 953; Stock 2,246 | Root, Grip, Bolt, Trigger, Magazine, Barrel, Door | 76 × 34 × 19 cm | Weapon, Glass |
| Heavy weapon (`SKM_HW_Bullet_MK1`) | nothing (for turrets and vehicles) | 30,156 → 15,118 → 8,113 → 3,745 | one piece | Root, Grip, Door, Trigger, Magazine, Barrel, Bolt | 295 × 89 × 42 cm | Weapon |
| Hand grenade (`EpicGames_Demo/Meshes/Grenade/SM_Grenade`) | Frag Grenade HG-01 | a static mesh | — | — | — | — |

**How the pack builds a weapon.** Each gun is **modular**: one skeletal mesh per part (body, grip, magazine, muzzle,
sight, stock; the launcher has a barrel and a loaded grenade instead of a muzzle and magazine), all skinned to one
weapon skeleton per class (`SK_Rifle_Weapon`, `SK_Pistol_Weapon`, `SK_Shotgun_Weapon`, `SK_Grenade_Launcher`,
`SK_Heavy_Weapon`), plus the assembled mesh. The bones are what MSS's weapon animations move: the magazine drops and a
new one goes in on reload, the bolt or slide works on each shot, the trigger pulls. The pistol has a slide, the rifle
and shotgun a bolt. Every weapon also comes as an **energy** and a **laser** variant with its own parts and textures,
and the pack has a turret (`SK_Turret`) that fires the heavy weapon.

**Where things attach.** The weapon meshes have **no sockets**. The hand (`Weapon_TPS`), the magazine hands
(`Rifle_Magazine` and the like) and the throw hand are sockets on the character's skeleton (copied to Tharrn's player
by `setup_mss.py`); the muzzle is a child actor (`BP_Muzzle`) in the weapon Blueprint; and where the eye sits to look
through the sight (D-24) is a number tuned per weapon in Tharrn's `build_mss_weapons.py` (`EyeDistanceCm`), because
there is no sight socket to read.

**Materials and textures.** The gun's slot `Weapon` uses a white instance of a master instance of `M_Layer_Master`: a
layered material whose `Mask_Primary` texture picks which parts take which colour, so a weapon recolours without new
textures (the pack's "white" is its default paint). The sight's `Glass` is `M_Holographic_Sight` (the floating ring).
Every weapon has a **4K texture set**: `_D` colour (DXT1, sRGB), `_N` normal (BC5), `_R`, `_M`, `_E`, `_S` (roughness,
metal, emissive, specular; the "Optimized" set) plus the "Cinematic" masks for the layer master, all in Unreal's
`Weapon` texture groups. Four LODs come from the pack's LOD settings assets (`LS_Rifle` and the like: about 60 %, 30 %
and 13 % of LOD0), with a physics asset per part for dropped weapons.

**What this means for Tharrn.** The pack is already built the way the direction's attachments work: its muzzle,
stock, magazine and sight parts are the barrel, stock, magazine and optic slots of deliverable 7, one mesh each, swapped
on one skeleton. Tharrn's own models keep that construction (section 3) and gain what the pack lacks: Tharrn's look,
sockets, a core slot, scopes and tools.

## 2. What exists in the game today

- `BP_TharrnWeapon_SMG`, `_Pistol` and `_Heavy` (`/Game/Tharrn/Weapons/MSS`): children of MSS's rifle, pistol and
  grenade launcher MK1, driven by Tharrn's C++ weapon component (D-23); `BP_TharrnGrenadeRound` and
  `BP_TharrnHandGrenade` (D-24). Built by `Tools/Weapons/build_mss_weapons.py`.
- Data: `Data/Weapons.csv` (AR01, SMG_A1, SG01, PS01, MR01, GL01, HG01 with reload, aim, spread, falloff, blast and
  zoom columns), `Data/WeaponRecoil.csv`, the weapon and ammunition items in `Data/Items.csv`. No `Attachments.csv`
  yet (deliverable 7 proposes 11 attachments in five slots).
- Hits, zones, armour, falloff, recoil, spread, projectiles and blasts in C++ (P3), checked by the network and MSS tests.
- Not built: picking weapons up from the ground (MSS's interaction), attachments and scopes, the energy fire mode (beam
  or charge), melee and tools, Tharrn's own models, sounds of Tharrn's own.

## 3. What a Tharrn weapon model has to be (proposal)

The contract every model meets before it goes into the game, so MSS's handling, Tharrn's C++ and the attachments keep
working with no per-weapon code:

| Point | Rule (proposal) |
|---|---|
| Construction | Parts as separate skeletal meshes on **MSS's weapon skeleton for the class** (the rifle skeleton for SMGs and rifles, the pistol skeleton for sidearms, the launcher skeleton for the GL-01), with the same bone names, so MSS's reload, fire and magazine animations play unchanged. New classes (the Mass Driver, the Arc Beam) get a skeleton of their own on the same pattern |
| Parts | Body, grip, magazine, muzzle, sight, stock, and a **core** (a module in the body for the alien-technology slot); a part is one mesh, one material, one physics body. An attachment is a part file that replaces the default part |
| Sockets on the skeleton | `Muzzle` (flash, tracer and shot origin), `Sight` (the eye for the view through the sight, D-24, replacing the hand-tuned numbers), `Magazine` (MSS's magazine drop), `IK_Hand_Left` (the front hand), `Shell` (ejection), `Core` (the core's glow) |
| Scale and pivot | Real-world centimetres, Root at the grip where the hand holds it, the barrel along +X (as the pack's) |
| Triangles | About 40,000 to 80,000 for the whole gun at LOD0 with its parts (the pack's rifle is about 40,000: the mark to beat, not to multiply), 4 LODs through LOD settings assets like the pack's; Nanite is not used for skeletal meshes |
| Textures | One 4K set for the body (colour, normal, packed roughness, metal and ambient occlusion, emissive where there is a glow), 2K per part; Tharrn's weapon master material with the pack's idea of colour layers, so rarity and tiers tint a gun without new textures |
| Look | Tharrn's own (OQ-20, section 5), not the pack's and not copied art |
| Checks | Imported through the import tool (W4) with no warnings; the same picture through the sight on every weapon; the MSS test (draw, fire, reload, swap, aim, wheel) passes with the new model; the owner's yes on pictures in the game |

## 4. Which AI and tools, and what is missing

The project's 3D skills (`3d-production-routing` and the ones it points to: `image-reference-workflow`,
`character-sheet-pipeline`, `higgsfield-workflow`, `fal-ai-generation`, `materials-to-game`, `blender-game-animation`,
`gameplay-visual-review`) already cover each step; what matters is which service is connected and what it costs.

| Job | Tool | Connected now? | Cost |
|---|---|---|---|
| Concept sheets per weapon (three-quarter view, strict side and top views, the parts laid out) and inventory icons | Higgsfield's image models through its MCP (this chat); or Lychee Studio's text-to-image step | Yes: Higgsfield free plan, **10 credits** (2026-10-19) | Credits |
| Image to a high-detail 3D model | Higgsfield's 3D models: **Tripo H3.1** (one image or 2 to 4 views; PBR), **Tripo P2** (FBX or GLB, quad mesh, up to 50,000 faces, "extreme" texture quality), Meshy 7 (PBR, low-poly mode), Hunyuan3D v3.1 Pro, SAM 3 3D; Meshy remesh and retexture | Yes, through the MCP | 5 to 25 credits a model (Higgsfield's prices on 2026-10-19: Tripo 5, Hunyuan3D 3.1 Pro 16, Meshy with PBR 25) |
| The same, in the owner's Lychee Studio project | [Lychee Studio](https://lychee-studio.ai/): a node workspace from text to image to 3D ("Image to 3D", "Multiview", "Texture Model", "Props Extraction", "Game Export (FBX/glTF)"); its page says props can be textured, rigged and exported to GLB and FBX | The owner's account, in the browser; no MCP or CLI found | Per seat and credits: Starter 20 €/seat/month (its page, 2026-10-19) |
| Retopology to the budget, UVs, baking the high-poly's detail, splitting into parts, rigging to MSS's weapon skeleton, sockets, LODs, FBX export | **Blender 4.1** (installed under Program Files), scripted by Claude and run headless (`blender.exe --background --python`) | Yes | Free |
| Import, materials, LOD settings, physics asset, the weapon Blueprint child, the data row, pictures in the game | Unreal MCP (`SkeletalMeshTools.import_file`, materials, Blueprints) and `Tools/Weapons/` scripts | Yes | Free |
| Sounds of Tharrn's own | MSS's for now; later the `game-audio-workflow` skill | — | Later |

**What is missing, and what is not (the owner asked):**

- **Nothing new is needed to start.** The trial of one weapon (W2) runs on the Higgsfield MCP's free credits, the owner's
  Lychee project and Blender.
- **Higgsfield CLI:** installed as `@higgsfield/cli` 1.1.26, but its program file (`vendor/hf.exe`) is missing, so it
  does not run; `npm i -g @higgsfield/cli` reinstalls it. Only needed for the Blender-side route or scripted batches;
  the MCP does the same jobs from this chat.
- **A paid plan, once the arsenal is made for real:** about 8 weapons, 11 attachments and 5 tools at two or three 3D
  tries each is roughly 300 to 800 Higgsfield credits plus concept pictures, far past the free 10. Either a Higgsfield
  plan or a Lychee Studio seat, chosen after W2 shows which service's meshes split into parts and bake best (OQ-22).
- **fal.ai** (`FAL_KEY`, the `fal-ai-generation` skill): not connected. The same Tripo, Meshy and Hunyuan models through
  another account, plus material-map generation; optional, only if Higgsfield's plan is not taken.
- **Not needed:** a Blender MCP (Blender runs headless from scripts), a direct Tripo account (its H3.1 and P2 are in
  Higgsfield; a direct account only adds Tripo's own extras), Substance (bakes happen in Blender, the material in Unreal).

**Why generated meshes are not dropped into the game as they come.** Image-to-3D gives one sculpted mesh with baked
textures: no parts, no bones, no sockets, uneven topology, and a texture that does not recolour. The generators are
for the **high-poly source**; the game mesh is made from it in Blender (W3), the way a studio bakes a sculpt down. That
is also what keeps the attachments working: a part is only a part if it is a separate mesh on the shared skeleton.

## 5. The arsenal and the look (proposal, OQ-20)

**Look.** Tharrn's weapons are **colony-made**: printed at the convoy's fabricators from alloy and polymer, clean
sci-fi that sits beside the Sci-Fi Complete Bundle's outposts (D-20), with the interface's Exodus orange as the one
accent (D-31). The same tiers as building (OQ-17): **Salvage** (scrap-built, mismatched, from the wreck), **Colony**
(the fabricator's clean print, the base look), **Fortified** (plated, darker), **Alien** (crystal cores and glowing
seams, the core slot). Tiers tint and swap parts on the same model, as the building tiers do on the same shapes.

**Order of making (proposal).** First the guns in the Prototype's hands, so the placeholders go: the SMG A1, the
Sidearm PS-01, the Grenade Launcher GL-01 and the Frag Grenade HG-01. Then the Assault Rifle AR-01 and the Shotgun
SG-01 with the attachments and scopes. Then the Mass Driver MR-01 and the Arc Beam EB-01 (the energy fire mode comes
with it, C++). Tools run beside the guns once the pipeline works (section 6).

| weapon_id | Weapon | Class skeleton | Wave | Note |
|---|---|---|---|---|
| SMG_A1 | SMG A1 | Rifle | 1 | Replaces MSS's rifle in the hands |
| PS01 | Sidearm PS-01 | Pistol | 1 | Replaces MSS's pistol |
| GL01 | Grenade Launcher GL-01 | Grenade launcher | 1 | Replaces MSS's launcher; its round too |
| HG01 | Frag Grenade HG-01 | static mesh | 1 | Replaces Epic's demo grenade |
| AR01 | Assault Rifle AR-01 | Rifle | 2 | No item yet |
| SG01 | Shotgun SG-01 | Shotgun | 2 | Pellets still proposed (deliverable 7) |
| MR01 | Mass Driver MR-01 | new (heavy rifle) | 3 | In the data, out of the heavy slot (D-24) |
| EB01 | Arc Beam EB-01 | new (energy) | 3 | Needs the beam fire mode in C++ |

Attachments (wave 2): deliverable 7's eleven, as part files on the class skeletons: two barrels and a suppressor
(muzzle part), two stocks, two magazines, a reflex sight and a 4× scope (sight part; the scope sets its own `ads_zoom`
and the view through it, D-24), two cores (the new core part). `Data/Attachments.csv` and the swap on the server come
with them (W6).

## 6. Tools (proposal, OQ-21)

"Tools" are the hand tools of the survival loop. The design names them in three places: the map's harvesting (trees cut
with a **hatchet**, rocks mined with a **pickaxe**, plants gathered by hand or with a **knife**; [map-design.md](map-design.md#4-harvesting-built-into-the-map-from-the-start)),
the starter loadout's **field scanner** (GDD 01) and the **build tool** on the hotbar (D-30, [building.md](building.md#7-the-building-system)).

| Tool | Use | Logic lives in | Model from this chat |
|---|---|---|---|
| Hatchet | Cutting trees; a weak melee weapon | Harvesting (map chat, M5) | Yes |
| Pickaxe | Mining rocks, ore and crystal | Harvesting (M5) | Yes |
| Knife | Harvesting plants and hides; the quietest melee weapon | Harvesting (M5), combat (P3) | Yes |
| Field scanner | Shows resource nodes and creatures' weak points nearby (proposal: what it does is open) | New, with the HUD (UI chat) | Yes |
| Build tool | Placing building pieces (the ghost preview) | Building (B4) | Yes |

Proposal: a tool is a row in `Data/Weapons.csv` with a new hit type, `melee`: a short-range swing the server checks
like a shot (the same rewind and checks as C-04), so the harvest system only has to listen for the hit. Tools use
MSS's one-hand pose and a Tharrn swing animation (a montage on the player's skeleton, made in Blender with the
`blender-game-animation` skill). Which tools, and what the scanner does: the owner's call.

## 7. Steps

| Step | What | Done when | State |
|---|---|---|---|
| W0 | The pack's weapons taken apart and pictured; the model contract, the AI and tools, the arsenal, the tools and the steps proposed (this page); the wiki's Combat and arsenal tab | The owner has read it | Done 2026-10-19 |
| W1 | The owner's choices: the look and order (OQ-20), the tools (OQ-21), the generation service and plan (OQ-22) | Decisions logged | Next |
| W2 | Trial on one weapon (the SMG A1): a concept sheet, then the same sheet through Tripo H3.1, Tripo P2, Meshy 7 (Higgsfield) and Lychee Studio; each result split, retopologised and baked in Blender; compared on parts, topology, texture and time | A picture of the four side by side; the owner picks the service | Later |
| W3 | The Blender tool: `Tools/Weapons/Blender/weapon_build.py` turns a high-poly into parts on the class skeleton with sockets, LODs, bakes and an FBX per part, from a small JSON spec per weapon | The SMG rebuilds from its spec with no hand steps; a check script measures triangles, sockets and bone names | Later |
| W4 | The import tool: `Tools/Weapons/import_weapon.py` imports the FBX parts under `/Game/Art/Weapons/<id>/` (`WP_` meshes, `T_` textures, the owner's conventions), makes the material instances, LOD settings and physics assets, and the Tharrn weapon Blueprint child that uses them | Import with no warnings; the MSS test passes with the new model | Later |
| W5 | Wave 1 in the game: SMG A1, Sidearm PS-01, Grenade Launcher GL-01 and its round, Frag Grenade HG-01; the view through each sight from its `Sight` socket; pictures in the game | The owner's play-test | Later |
| W6 | Attachments: `Data/Attachments.csv` (deliverable 7), part files for the eleven, the swap on the server with the stats rebuilt (D-04), scopes with their zoom, the weapon mod screen with the UI chat | Tests; the network test with two clients; made-up swaps refused | Later |
| W7 | Wave 2 and 3: AR-01, SG-01 (pellets decided), MR-01, EB-01 with the beam fire mode in C++ | Each passes the MSS and network tests | Later |
| W8 | Tools: hatchet, pickaxe, knife, scanner, build tool models and the `melee` hit type; the swing animation; wired to harvesting (map chat) and building (building chat) | Harvest a tree and a rock with two clients | Later |
| W9 | Icons in the interface's style and Tharrn's own weapon sounds | The UI chat's yes; the sound bank | Later |

## 8. Working beside the other chats

Three chats share one editor (the map, the interface, the building; the engineering guide's gotcha 4). This chat only
reads the open editor while others work, and makes models outside it (Blender, the generation services). Imports (W4)
touch assets, not the open level, and go under `/Game/Art/Weapons/` and `/Game/Tharrn/Weapons/`; nothing is saved
under the pack's folders (D-08). Play sessions for pictures and tests wait for the owner's go while another chat is
using the editor.

## 9. Pictures

- ![The shooter pack's weapons in the game today, from the editor's thumbnails: the rifle, pistol and grenade launcher that stand in for the SMG A1, Sidearm PS-01 and GL-01, the unused shotgun and heavy weapon, and the demo grenade (2026-10-19)](pictures/weapons/mss_weapons_today.jpg)
- ![The rifle taken apart: the pack's part split, one skeletal mesh per part on one weapon skeleton (body, grip, magazine, muzzle, sight, stock), the ejected shell and the bullet](pictures/weapons/mss_rifle_parts.jpg)
- ![The view through the pack's holographic sight today (P4): the open sight of the rifle that stands in for the SMG A1, the ring about 2° above where shots go](pictures/p4/aiming_client_window.jpg)
