"""Build the Tharrn Wiki, a pinned Mr. Mak Workspace card, from the design record and the game's data files.

    python projects/Tharrn/tools/build_wiki.py [--data D:\\Tharrn\\Data]

Writes the pages and wiki.css to workspace/2026-10-15_tharrn-wiki/ and keeps the card in workspace/workspace.json
(pinned). The prose below follows GDD 0.1 (docs/gdd/); the zone, weapon, creature, dungeon, preset and HUD tables are
read from the game repo's Data/ folder, so a data change only needs a rebuild. When the GDD changes, change the
matching page here and rebuild. The card's "updated" date changes only when a page's content changes.
"""
import argparse
import csv
import datetime
import html
import io
import json
import os

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, "..", "..", ".."))
FOLDER = "2026-10-15_tharrn-wiki"
OUT = os.path.join(REPO, "workspace", FOLDER)
REGISTRY = os.path.join(REPO, "workspace", "workspace.json")
CARD_ID = "tharrn-wiki"

E = html.escape

ZONE_TYPES = {  # CSV type -> (label, what it means)
    "SafeHub": ("Safe hub", "Vendors, mission boards and safe services; no combat between players."),
    "OpenPvE": ("Open PvE", "Creatures and resources; players cannot attack each other."),
    "FlaggedPvP": ("Flagged PvP", "Entering flags you for PvP; richer loot, full loot on death."),
    "BufferZone": ("Amber buffer", "A warning belt around a PvP zone; not flagged."),
}
ICONS = ["health", "stamina", "hunger", "hydration", "temperature", "neural", "weapon", "ammo", "crosshair",
         "compass", "minimap", "quickwheel"]  # rendered by build_hud_icons.mjs into docs/deliverables/08-hud-icons
ICON_SRC = os.path.join(HERE, "..", "docs", "deliverables", "08-hud-icons")
ARMOUR = {"Light": "cloth, 10 %", "Medium": "composite, 30 %", "Heavy": "alloy, 50 %"}


# ---------------------------------------------------------------------------------------------------------------
# Small HTML helpers

def tag(kind, text):
    return '<span class="tag tag-%s">%s</span>' % (kind, E(text))


BUILT = tag("built", "In the build")
DESIGN = tag("design", "Designed")
OPEN = tag("open", "Open question")


def table(headers, rows, cls=""):
    head = "".join("<th>%s</th>" % h for h in headers)
    body = "".join("<tr>%s</tr>" % "".join("<td>%s</td>" % c for c in r) for r in rows)
    return '<table%s><thead><tr>%s</tr></thead><tbody>%s</tbody></table>' % (' class="%s"' % cls if cls else "", head, body)


def chain(items):
    parts = []
    for i, item in enumerate(items):
        if i:
            parts.append('<span class="chain-arrow" aria-hidden="true">→</span>')
        parts.append('<span class="chain-step">%s</span>' % item)
    return '<p class="chain">%s</p>' % "".join(parts)


def minutes(seconds):
    s = int(seconds)
    if s <= 0:
        return "—"
    if s % 3600 == 0:
        return "%d h" % (s // 3600)
    return "%d min" % round(s / 60)


def page(tab, title, subtitle, body, sources):
    return """<!doctype html>
<html lang="en" data-mak-report="document">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tharrn Wiki · %s</title>
<link rel="stylesheet" href="../_shared/report.css">
<link rel="stylesheet" href="../_shared/examples.css">
<link rel="stylesheet" href="wiki.css">
<script defer src="../_shared/report.js"></script>
</head>
<body>
<main class="container">
<div class="eyebrow">Tharrn Wiki · %s</div>
<h1>%s</h1>
<p class="subtitle">%s</p>
%s
<footer class="wiki-foot">%s</footer>
</main>
</body>
</html>
""" % (E(tab), E(tab), title, subtitle, body.strip(), sources)


def read_csv(path):
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


# ---------------------------------------------------------------------------------------------------------------
# Pages

def overview():
    body = """
<div class="callout"><strong>Where it stands, 2026-10-15:</strong> design stage. GDD 0.1 is written and the
first build module, the foundation (data tables, tests, the multiplayer test harness and a grey test range), is built
and checked. Nothing is playable as a game yet. Everything in this wiki is the design unless it carries the
""" + BUILT + """ label.</div>

<h2>The premise</h2>
<p class="lead">You are an operative of the <strong>Exodus Initiative</strong>. Your convoy was investigating an alien
signal when it crashed on a vast alien archipelago, scattering the survivors and corrupting their tech. Survive,
secure an extraction beacon and find out what the signal is.</p>
<p>Tharrn is a sci-fi action-RPG survival shooter for one player or many: precise shooting, survival that changes how
you fight, sixty levels of RPG progression with dungeons and quests, and player-versus-player danger only where you
choose to go.</p>

<div class="stats">
<div><strong>100 km²</strong><small>main map, in 15 zones</small></div>
<div><strong>6</strong><small>biomes, from coast to floating islands</small></div>
<div><strong>60</strong><small>levels, 3 talent trees</small></div>
<div><strong>6</strong><small>creatures designed so far</small></div>
<div><strong>5</strong><small>loot tiers, Common to Alien</small></div>
<div><strong>PvP</strong><small>only in flagged zones</small></div>
</div>

<h2>At a glance</h2>
""" + table(["", ""], [
        ["Genre", "Sci-fi action-RPG, survival, third-person shooter"],
        ["Players", "Single player and multiplayer; co-op; PvP only in flagged zones"],
        ["World", "An island of about 100 km² with sea all around, streamed as you travel"],
        ["Camera", "Third person over the shoulder, with aim-down-sights"],
        ["Characters", "MetaHumans for every player and NPC face; 12 presets planned"],
        ["Online", "The server decides everything that matters (damage, loot, flags); built that way from the first system"],
        ["Platform", "PC first; consoles not decided"],
        ["Performance target", "60 fps on an RTX 3060 at 1440p with DLSS Quality; 120 fps on high-end PCs"],
        ["Engine", "Unreal Engine 5.8.3; C++ for complex systems, Blueprints for simple ones"],
    ], "kv") + """

<h2>Five pillars</h2>
<div class="grid-cards">
<div class="mak-card"><h3>Elite gunfeel</h3><p>Recoil curves, weak points, stagger and movement tech that feel precise,
on a model the server checks.</p></div>
<div class="mak-card"><h3>High-stakes survival</h3><p>Vitals that change how you fight, resources worth risking a PvP
zone for, and a base to hold.</p></div>
<div class="mak-card"><h3>Deep RPG</h3><p>Sixty levels, three talent trees, quests, dungeons, blueprints and loot
tiers.</p></div>
<div class="mak-card"><h3>Consensual danger</h3><p>PvP only where you choose to go: flagged zones with richer
loot.</p></div>
<div class="mak-card"><h3>A world that grows</h3><p>Biomes, hubs and endgame regions added later as map
extensions.</p></div>
</div>

<h2>A session</h2>
""" + chain(["Prepare at a hub", "Expedition into a risk zone", "Dungeon or raid", "Extract", "Return and upgrade"]) + """
<p>Daily missions; weekly world events such as apex migrations and rotating PvP hotspots; seasonal content. You earn
XP, talent points, weapon mastery, blueprints and faction reputation.</p>

<h2>The first 40 minutes</h2>
""" + table(["Beat", "What it teaches"], [
        ["Crash site", "Moving, sprinting, crouching, mantling, basic aim, recoil"],
        ["Vitals", "The vitals appear on the HUD, and what they do (aim sway when dehydrated)"],
        ["Scavenge and craft", "Picking up organic and mineral resources; crafting a bandage and basic ammo"],
        ["First fight", "A creature pack: aiming at weak points, staggering. " + OPEN + " The direction names the "
         "Skitterjaw, which is a desert creature, while the crash site is on the coast (OQ-12)"],
        ["Shelter", "Placing a foundation, deploying a generator, crafting a bench"],
        ["Beacon", "A short mission next to a flagged PvP zone, with a warning overlay"],
        ["Co-op (optional)", "An NPC companion or a friend joins to show team play"],
    ]) + """
<p>It ends when you have survived a 10 to 15 minute expedition, crafted the essentials and returned to a hub.</p>

<h2>Endgame</h2>
<p>Instanced high-risk raids, faction wars, territory control and seasonal events. New biomes arrive as map
extensions reached by teleport gates or long-range vehicles. The world is persistent: killing a global boss unlocks
tech for the whole server.</p>

<h2>In this wiki</h2>
""" + table(["Tab", "What is in it"], [
        ["World and zones", "Scale, the six biomes, the zone map and every zone"],
        ["Bestiary", "The creatures designed so far, with their stats"],
        ["Combat and arsenal", "Damage, armour, accuracy, the weapons, attachments, movement"],
        ["Survival and building", "Vitals and their formulas, resources, base building, crafting"],
        ["Progression and dungeons", "Levels, talents, quests, loot tiers, dungeons and bosses"],
        ["PvP and travel", "How flagging works, extraction, fair-play rules, vehicles"],
        ["Characters and HUD", "Character creation, origins, presets, the HUD and menus"],
        ["Development", "How the game is built, the roadmap, what is done, decisions and open questions"],
    ]) + """

<h2>Glossary</h2>
""" + table(["Term", "Meaning"], [
        ["Exodus Initiative", "The organisation the player works for"],
        ["Hub", "A safe town with vendors, services and a mission board"],
        ["Flagged", "Open to attack by other flagged players; you are flagged inside a PvP zone and for a while after leaving"],
        ["Consent buffer", "A short delay before the flag applies on entering a PvP zone (10 s where a zone has one)"],
        ["Exit cooldown", "How long you must stay outside a PvP zone before the flag clears (60 s)"],
        ["Amber buffer", "A warning belt around a PvP zone"],
        ["Extraction", "Leaving a dangerous area with your loot at an extraction point; others can interrupt it"],
        ["Neural stability", "A vital; when it runs low you see hallucinations and your aim jitters"],
        ["Stagger", "A meter on each enemy; filling it interrupts the enemy's attack"],
        ["Weak point", "A part of a creature that takes extra damage"],
        ["Blueprint", "Needed to craft or attach higher-tier items"],
    ])
    return page("Overview", "Tharrn",
                "A sci-fi action-RPG survival shooter on a vast alien archipelago, for one player or many. "
                "The guide to the game as designed, and as built so far.",
                body, "Source: GDD 0.1, modules 00 and 01 (design record <code>projects/Tharrn/docs/gdd/</code>).")


def world(zones):
    # Zone map: inline SVG in kilometres from Data/Zones.csv (metres); x to the right, y up (SVG y is flipped), so
    # Amber Buffer North sits north of the archipelago.
    xs = [float(z[k]) / 1000 for z in zones for k in ("bounds_min_x", "bounds_max_x")]
    ys = [float(z[k]) / 1000 for z in zones for k in ("bounds_min_y", "bounds_max_y")]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    pad_l, pad_t, pad_r, pad_b = 0.95, 0.25, 0.3, 0.65
    vb = (x0 - pad_l, -y1 - pad_t, (x1 - x0) + pad_l + pad_r, (y1 - y0) + pad_t + pad_b)
    parts = ['<svg class="zone-map" viewBox="%.2f %.2f %.2f %.2f" role="img" aria-labelledby="zm-title zm-desc">' % vb,
             '<title id="zm-title">Tharrn zone map</title>',
             '<desc id="zm-desc">%d zones of the world drawn to scale from the zone data; colour shows the zone type.</desc>' % len(zones)]
    step = (float(zones[0]["bounds_max_x"]) - float(zones[0]["bounds_min_x"])) / 1000  # one zone's width, km
    k = x0
    while k <= x1 + 1e-6:
        parts.append('<line class="grid" x1="%.2f" y1="%.2f" x2="%.2f" y2="%.2f"/>' % (k, -y1, k, -y0))
        parts.append('<text class="axis" x="%.2f" y="%.2f" text-anchor="middle">%.1f</text>' % (k, -y0 + 0.3, k))
        k += step
    k = y0
    while k <= y1 + 1e-6:
        parts.append('<line class="grid" x1="%.2f" y1="%.2f" x2="%.2f" y2="%.2f"/>' % (x0, -k, x1, -k))
        parts.append('<text class="axis" x="%.2f" y="%.2f" text-anchor="end">%.1f</text>' % (x0 - 0.1, -k + 0.07, k))
        k += step
    parts.append('<text class="axis" x="%.2f" y="%.2f" text-anchor="middle">x (km)</text>' % ((x0 + x1) / 2, -y0 + 0.58))
    parts.append('<text class="axis ytitle" x="%.2f" y="%.2f" text-anchor="middle" transform="rotate(-90 %.2f %.2f)">y (km)</text>' % (
        x0 - 0.75, -(y0 + y1) / 2, x0 - 0.75, -(y0 + y1) / 2))
    for z in zones:
        zx0, zy0 = float(z["bounds_min_x"]) / 1000, float(z["bounds_min_y"]) / 1000
        zx1, zy1 = float(z["bounds_max_x"]) / 1000, float(z["bounds_max_y"]) / 1000
        cx = (zx0 + zx1) / 2
        top, bottom = -zy1, -zy0  # drawn edges, y flipped
        parts.append('<g><rect class="cell %s" x="%.2f" y="%.2f" width="%.2f" height="%.2f"/>' % (
            E(z["type"]), zx0, top, zx1 - zx0, zy1 - zy0))
        parts.append('<text class="zid" x="%.2f" y="%.2f" text-anchor="middle">%s</text>' % (cx, top + 0.62, E(z["zone_id"])))
        words = z["name"].split()
        lines = [z["name"]]
        if len(z["name"]) > 13 and len(words) > 1:
            cut = max(range(1, len(words)), key=lambda i: -abs(len(" ".join(words[:i])) - len(" ".join(words[i:]))))
            lines = [" ".join(words[:cut]), " ".join(words[cut:])]
        for i, line in enumerate(lines):
            parts.append('<text class="zname" x="%.2f" y="%.2f" text-anchor="middle">%s</text>' % (cx, top + 1.0 + i * 0.24, E(line)))
        meta = "Lv %s" % z["recommended_level"] + (" · PvP" if z["pvp_flag"].lower() == "true" else "")
        parts.append('<text class="zmeta" x="%.2f" y="%.2f" text-anchor="middle">%s</text></g>' % (cx, bottom - 0.22, E(meta)))
    parts.append("</svg>")
    legend = '<ul class="legend">' + "".join(
        '<li><i class="sw %s"></i>%s</li>' % (t, E(label)) for t, (label, _) in ZONE_TYPES.items()) + "</ul>"

    area = sum((float(z["bounds_max_x"]) - float(z["bounds_min_x"])) * (float(z["bounds_max_y"]) - float(z["bounds_min_y"]))
               for z in zones) / 1e6
    counts = {t: sum(1 for z in zones if z["type"] == t) for t in ZONE_TYPES}
    rows = []
    for z in zones:
        flagged = z["pvp_flag"].lower() == "true"
        pvp = (tag("pvp", "Flagged") + " %s s consent · %s s exit" % (z["entry_consent_buffer_seconds"], z["exit_cooldown_seconds"])) if flagged else "—"
        rows.append(["<code>%s</code>" % E(z["zone_id"]), "<strong>%s</strong>" % E(z["name"]), E(ZONE_TYPES.get(z["type"], (z["type"],))[0]),
                     E(z["recommended_level"]), E(z["loot_tier"]), pvp, minutes(z["spawn_timer_seconds"]), E(z["notes"])])

    body = """
<p>%s The main map is an island of about <strong>%.1f km²</strong> with sea all around: %d zones of %.2f × %.2f km, within a box of %.1f × %.1f km.
It streams in as you travel. Crossing it should take about 45 minutes on foot and 15 to 20 minutes by hoverbike
(targets for tuning speeds).</p>

<h2>Six biomes</h2>
<p>You start on the coast and push inland and upward, toward the floating islands of the endgame.</p>
""" % (DESIGN, area, len(zones), step, step, x1 - x0, y1 - y0) + chain(["Coastal", "Fungal Forest", "Crystalline Desert", "High-Gravity Plateau",
                                                            "Subterranean Caverns", "Floating Archipelagos"]) + table(
        ["Biome", "What it is like", "Resources", "Threats"], [
            ["<strong>Coastal</strong> (start)", "Wreckage, shallow pools, small fauna", "Organic, low-tier minerals", "Skitter packs, tidal storms"],
            ["<strong>Fungal Forest</strong>", "Bioluminescent flora, spore clouds", "Biotech cores, organic fibre", "Spore bloom, Lumivine Colossus"],
            ["<strong>Crystalline Desert</strong>", "Crystal fields, gravity anomalies", "Energy crystals, alloy veins", "Sand raptors, grav raptors, Skitterjaws"],
            ["<strong>High-Gravity Plateau</strong>", "Heavy fauna, slow movement", "Rare alloys", "Heavy grazers, territorial titans"],
            ["<strong>Subterranean Caverns</strong>", "Oxygen limits, echo swarms", "Alien cores, rare minerals", "Echo Swarm, cave collapses"],
            ["<strong>Floating Archipelagos</strong> (endgame)", "Aerial traversal, PvP warzones", "Endgame blueprints", "Aerial predators, faction fortresses"],
        ]) + """
<p class="wiki-note">The world will be built from the Sci-Fi Complete Bundle's biome presets, put together the way
its own example level is: the coast from its jungle shore, swamp and jungle; the Fungal Forest from the jungle; the
desert from its desert, acid and moon sets; the plateau from its columnar rock. The caves cannot be ordinary terrain
(it has no overhangs), and the floating islands will be their own streamed levels.</p>

<h2>Zone map</h2>
<p>Drawn to scale from the zone data, with y increasing upward (so Amber Buffer North is north of the archipelago).
Each square is 2.24 km across; the numbers along the edges are kilometres from the world's centre.</p>
<figure class="map-figure">""" + "".join(parts) + legend + """</figure>

<h2>Zone types</h2>
""" + table(["Type", "Zones", "Meaning"], [["<strong>%s</strong>" % E(label), str(counts[t]), E(text)] for t, (label, text) in ZONE_TYPES.items()]) + """

<h2>Every zone</h2>
<p>Level is the recommended level. Respawn is how often its resources and creatures come back.</p>
""" + table(["ID", "Zone", "Type", "Level", "Loot", "PvP", "Respawn", "Notes"], rows) + """

<h2>Still to settle</h2>
<ul>
<li>""" + OPEN + """ The direction asks for 6 hubs and 8 to 12 PvP hotspots, each inside an amber buffer belt. The map has
%d hubs, %d flagged zones and %d buffer; some hubs border PvP zones directly.</li>
<li>""" % (counts["SafeHub"], counts["FlaggedPvP"], counts["BufferZone"]) + OPEN + """ The terrain source: real coastal survey data where a landform fits, generated terrain elsewhere (OQ-06),
and a test of the ocean (OQ-05).</li>
</ul>
"""
    return page("World and zones", "World and zones",
                "About 100 km² of alien archipelago in six biomes, laid out as %d zones." % len(zones), body,
                "Sources: GDD 0.1 module 07; decisions D-14, D-26 and D-27; zones from the game's <code>Data/Zones.csv</code>.")


def bestiary(creatures):
    data = {c["id"]: c for c in creatures}

    def stats(cid):
        c = data.get(cid)
        if not c:
            return ""
        res = ", ".join("%s %d %%" % (k, round(float(v) * 100)) for k, v in
                        (p.split(":") for p in c["resistances"].split(";") if ":" in p))
        loot = ", ".join("<code>%s</code>" % E(x) for x in c["loot_table"].split(";") if x)
        return table(["", ""], [
            ["Size", E(c["size"])], ["Health", E(c["hp"])],
            ["Armour", "%s (%s less damage)" % (E(c["armor"]), ARMOUR.get(c["armor"], "?"))],
            ["Resists", E(res) or "—"], ["Notices you at", "%s m" % E(c["aggro_radius"])],
            ["Drops", loot], ["Behaviour", E(c["notes"])]], "kv")

    def card(cid, name, role, where, extra=""):
        detail = stats(cid)
        return """<div class="mak-card creature"><p class="card-num">%s</p><h3>%s</h3><p><strong>%s</strong></p>
<p class="wiki-note">%s</p>%s%s</div>""" % (cid, name, role, where, detail, extra)

    body = """
<p>%s The direction names six creatures; three have full stats so far. No creature has art or animation yet: they
need concept art, meshes with four levels of detail, hit-box maps, sounds, effects, behaviour and animation sets
(idle, walk, run, attacks, stagger, death, a special move).</p>
<div class="grid-cards creatures">
""" % DESIGN + card("CR001", "Skitterjaw", "Small pack hunter. Flanks you.", "Crystalline Desert (D-16)",
                    "<p>Behaviour outline: patrol → detect → chase → flank → pounce.</p>") + \
        card("CR002", "Lumivine Colossus", "Large flora-beast. Roots in place and attacks with roots; bursts spores.", "Fungal Forest; spawns in Lumivine Grove (Z005)") + \
        card("CR003", "Phase Warden", "Medium, sentient. Teleports to dodge and raises a shield bubble.", "Crystalline Desert") + \
        card("CR004", "Grav Raptor", "Aerial. Dives on you from above.", "Crystalline Desert",
             table(["", ""], [["Health", "180"], ["Drops", "<code>talon_membrane</code>"]], "kv")) + \
        card("CR005", "Echo Swarm", "A swarm that disorients you with sound.", "Subterranean Caverns; swarm events in Echo Caverns (Z009)",
             table(["", ""], [["Health", "300, shared by the swarm"], ["Drops", "<code>swarm_gland</code>"]], "kv")) + \
        card("CR006", "Apex Titan", "A multi-phase boss.", "Boss of the dungeon Ruins of the First Signal",
             table(["", ""], [["Health", "4200"], ["Drops", "<code>boss_blueprint</code>"]], "kv")) + """
</div>

<h2>Armour classes</h2>
""" + table(["Class", "Material", "Damage reduction"], [["Light", "Cloth", "10 %"], ["Medium", "Composite", "30 %"], ["Heavy", "Alloy", "50 %"]]) + """
<p>Resistances reduce one kind of damage (acid, fire, poison, energy) by the fraction shown.</p>

<h2>How they will be built</h2>
<ul>
<li>Behaviour runs on the server only (Unreal's StateTree, with perception); your game receives their movement and
animations.</li>
<li>Every bone has a hit box; weak points are tagged hit boxes with their own damage multiplier.</li>
<li>The first three to build are the Skitterjaw, the Phase Warden and the Grav Raptor: a pack, a teleporter and a
flyer, three different problems.</li>
<li>""" + OPEN + """ Which creature the coastal tutorial fights first (OQ-12).</li>
</ul>
"""
    return page("Bestiary", "Bestiary", "The creatures designed so far.", body,
                "Sources: GDD 0.1 module 08; decision D-16; stats from the game's <code>Data/Creatures.csv</code>.")


def combat(weapons):
    rows = []
    for w in weapons:
        thrown = w["hit_type"] == "thrown"  # a hand grenade: no fire rate, and its "magazine" is how many you carry
        dps = "—" if thrown else "%.0f" % (float(w["damage"]) * float(w["fire_rate"]) / 60)
        rows.append(["<code>%s</code>" % E(w["weapon_id"]), "<strong>%s</strong>" % E(w["name"]), E(w["type"]), E(w["damage"]),
                     "—" if thrown else E(w["fire_rate"]), dps, E(w["mag_size"]) + (" carried" if thrown else ""), E(w["weight"]),
                     "—" if thrown else E(w["range"]), E(w["hit_type"]), E(w["notes"])])
    body = """
<h2>How a shot works online</h2>
<p>%s Your game fires at once, so it feels instant: muzzle flash, recoil, tracer and a predicted hit marker. The
server then checks the shot against where the targets were at the moment you fired, and only the server applies
damage. Heavy rounds are real projectiles with drop and travel time, simulated on the server.</p>

<h2>Explosions</h2>
<p>The grenade launcher's rounds and hand grenades explode: full damage within 1 m, falling evenly to nothing at 5 m,
reduced by armour. A wall between you and the blast shields you completely, and your own grenades hurt you too. Only
the server decides who the blast reaches (D-24).</p>

<h2>Damage</h2>
<div class="grid-2 two">
""" % DESIGN + table(["Hit", "Multiplier"], [["Head", "× 2.5"], ["Torso", "× 1.0"], ["Limb", "× 0.75"]]) + \
        table(["Armour", "Damage reduction"], [["Cloth", "10 %"], ["Composite", "30 %"], ["Alloy", "50 %"]]) + """
</div>
<p>Weak points on creatures add their own multipliers, and each enemy has a stagger meter: fill it and the enemy
staggers, which interrupts its attack.</p>

<h2>Fire modes</h2>
""" + table(["Mode", "Weapons", "How it hits"], [
        ["Hitscan", "SMG, pistol, rifle", "Instantly along the aim line"],
        ["Projectile", "Grenade launcher", "A travelling round with gravity drop that explodes where it lands"],
        ["Thrown", "Hand grenades", "Thrown where you aim; explodes 3 seconds after the pin is pulled"],
        ["Beam or charge", "Energy weapons", "A continuous beam, or a shot you charge up"],
    ]) + """

<h2>Weapons</h2>
<p>The weapons with data so far. Damage is per hit; fire rate is rounds per minute; damage per second is damage ×
fire rate ÷ 60, on the torso and before armour; weight is kg; range is metres.</p>
""" + table(["ID", "Weapon", "Type", "Damage", "Fire rate", "Damage / s", "Magazine", "Weight", "Range", "Hit", "Role"], rows) + """
<p class="wiki-note">""" + OPEN + """ The shotgun SG-01 is stored as a projectile with a speed of 0; the GDD proposes hitscan
pellets. Still missing for the fire modes above: an energy weapon. The Mass Driver MR-01 stays in the data; the
grenade launcher took its place in the heavy slot (D-24).</p>

<h2>Accuracy and recoil</h2>
<ul>
<li><strong>Recoil</strong> is a curve per weapon: how far the sight kicks up and sideways over time, and how it
recovers.</li>
<li><strong>Spread</strong> has three numbers per weapon: from the hip, aiming down sights, and a penalty for
moving.</li>
<li><strong>Aiming</strong> looks through the weapon's sight, zoomed a little per weapon; the game stays third person
otherwise (D-24). Scopes come with the optic attachments.</li>
<li><strong>Aim assist</strong> on controllers only: a gentle pull within 0.6° of a target, strength 0.15, both
adjustable.</li>
<li><strong>Vitals</strong> change your aim: thirst and low neural stability add sway (see Survival and building).</li>
</ul>

<h2>Attachments</h2>
<p>Five slots: <strong>barrel, stock, magazine, optic and core</strong>. Attachments change recoil, accuracy,
handling and weight, come in rarities, and need blueprints. They come later, with Tharrn's own weapon models (D-22,
D-24).</p>

<h2>Movement</h2>
""" + chain(["Sprint", "Mantle", "Jetpack burst (uses stamina)", "Grapple tether"]) + """
<p>Your armour changes how you move. Mantling comes first; the jetpack and the grapple come later. There is no slide
(D-24).</p>

<h2>The first milestone</h2>
<p>An SMG, a pistol and one heavy projectile weapon from the data; recoil and spread you can read on the test range;
the damage multipliers and armour covered by automated tests; two players at 100 ms of lag hitting what they aim at
(under 2 % disagreement between them); stagger and one weak point on the first creature.</p>
"""
    return page("Combat and arsenal", "Combat and arsenal",
                "Precise third-person shooting that the server checks: damage, armour, the weapons and how you move.",
                body, "Sources: GDD 0.1 module 02; weapons from the game's <code>Data/Weapons.csv</code>.")


def survival():
    body = """
<h2>Vitals</h2>
<p>%s Five vitals change how you fight, not only whether you live.</p>
""" % DESIGN + table(["Vital", "Range", "What it does"], [
        ["<strong>Hunger</strong>", "0–100", "Below 30, stamina recovers 40 % slower"],
        ["<strong>Hydration</strong>", "0–100", "Below 30, aim sway grows by 25 %"],
        ["<strong>Temperature</strong>", "Comfort range set by your armour", "Outside it you take damage over time and move slower"],
        ["<strong>Radiation</strong>", "Builds up", "Past thresholds it lowers your stats for a long time; needs detox"],
        ["<strong>Neural stability</strong>", "0–100", "Low values bring hallucinations (visual noise, phantom enemies) and aim jitter"],
    ]) + """

<h2>The formulas</h2>
<pre><code>StaminaRegen = BaseRegen × (1 − HungerPenalty) × (1 − TempPenalty)
AimSway      = BaseSway × (1 + (30 − Hydration)/100 × 0.8 + (100 − Neural)/100 × 0.5)</code></pre>
<p class="wiki-note">""" + OPEN + """ As written, a well-hydrated player sways less than normal (at full hydration and
neural stability the sway multiplier is 0.44). The build (P5) counts the hydration term only below 30,
<code>max(0, 30 − Hydration)</code>, so thirst only ever adds sway: a proposal to confirm with the owner.</p>

<h2>Resources</h2>
""" + chain(["Organic", "Mineral", "Alloy", "Biotech core", "Energy crystal"]) + """
<p>Resource nodes grow back on timers (each zone has its own, see World and zones). Rare nodes appear in flagged PvP
zones.</p>

<h2>Base building</h2>
""" + table(["Part", "How it works"], [
        ["Modules", "Foundation, wall, door, turret, generator, filtration, crafting bench"],
        ["Power", "Generators make energy, devices use it; too many devices on one network overloads it and it shuts down"],
        ["Decay", "Structures nobody maintains decay, by default 1 % a day"],
        ["Claims", "Plots in PvP zones can be claimed, with timers and upkeep costs"],
    ]) + """
<p>The building pieces come from the Sci-Fi Complete Bundle's modular outpost kit. Placing shows a ghost preview that
snaps to other pieces; the server checks every placement.</p>

<h2>Inventory and crafting</h2>
<ul>
<li>A grid inventory with a weight limit, filters by type and quick-craft recipes.</li>
<li>You ask to craft; the server checks the recipe and your inventory, then changes both. Crafts wait in a
queue.</li>
<li>""" + BUILT + """ The prototype crafts a bandage from organic fibre and rounds from mineral and alloy
scrap, five crafts at a time; cancelling gives the inputs back.</li>
</ul>

<h2>The first milestone</h2>
<p>Hunger, hydration and temperature working online and driving the two formulas (with tests at the thresholds);
crafting a bandage and ammo; a foundation, a generator and a bench that two players can place and both see.</p>
"""
    return page("Survival and building", "Survival and building",
                "Vitals that change how you fight, resources worth the risk, and a base to hold.", body,
                "Source: GDD 0.1 module 03.")


def progression(dungeon):
    rooms = " → ".join(r["type"].replace("_", " ") for r in dungeon.get("rooms", []))
    body = """
<h2>Levels and talents</h2>
<p>%s Sixty levels. The XP for each next level grows by 12 %%:</p>
<pre><code>XP(level) = baseXP × 1.12^(level − 1)</code></pre>
<p class="wiki-note">%s <code>baseXP</code> is not set yet; it will be chosen from how long reaching level 60 should take.</p>
<p>Each level gives one talent point for one of three trees. Nodes have prerequisites and unlock new mechanics.</p>
""" % (DESIGN, OPEN) + table(["Tree", "Example talents"], [
        ["<strong>Combat</strong>", "Precision Training (less recoil) · Quick Reload (15 % faster) · Suppressive Fire (suppresses an area)"],
        ["<strong>Survival</strong>", "Efficient Forager (+20 % resources) · Advanced Filtration (uses less water) · Field Medic (faster healing)"],
        ["<strong>Tech</strong>", "Drone Control (deploy a drone) · Power Optimization (generators use less) · Alien Synthesis (craft alien cores)"],
    ]) + """

<h2>Loot tiers</h2>
""" + chain(["Common", "Uncommon", "Rare", "Advanced", "Alien"]) + """
<p>Higher tiers need blueprints. Each zone has a loot tier (see World and zones).</p>

<h2>Quests</h2>
<p>Five kinds: main, side, faction, timed and dungeon quests, each in stages with objectives and rewards. The first
faction questline comes with the vertical slice.</p>

<h2>Dungeons</h2>
<p>Instanced and assembled from room templates, with a seed and modifiers that change each run.</p>
""" + table(["Room", "What happens"], [
        ["Puzzle room", "Needs a crafted item or a trigger in the room"],
        ["Combat arena", "Waves of enemies, with cover and height"],
        ["Traversal chamber", "Platforming and shifting gravity"],
        ["Trap corridor", "Timed hazards and detection"],
        ["Boss arena", "A boss in several phases, using the room against you"],
    ]) + """
<p>Modifiers: gravity shift (low or high), fog of war, enemy loadout variation, a time limit. Bosses change at 75, 50
and 25 %% health, adding a shield, minions or a hazard, and drop unique blueprints and rare loot. %s The direction counts
six room types but names five.</p>

<div class="mak-card"><p class="card-num">%s</p><h3>%s</h3>
""" % (OPEN, E(dungeon.get("dungeon_id", "")), E(dungeon.get("name", ""))) + table(["", ""], [
        ["Where", E(dungeon.get("biome", ""))],
        ["Recommended level", E(str(dungeon.get("recommended_level", "")))],
        ["Entry", E(dungeon.get("entry_requirements", ""))],
        ["Rooms", E(rooms)],
        ["Modifiers", E(", ".join(m.replace("_", " ") for m in dungeon.get("procedural_modifiers", [])))],
        ["Boss", "Apex Titan (<code>%s</code>)" % E(dungeon.get("boss_id", ""))],
        ["Loot", ", ".join("<code>%s</code>" % E(x) for x in dungeon.get("loot_pool", []))],
    ], "kv") + """
<p class="wiki-note">""" + OPEN + """ The Apex Titan is the direction's big multi-phase boss, here at level 12, and the
caverns zone recommends level 15.</p></div>
"""
    return page("Progression and dungeons", "Progression and dungeons",
                "Sixty levels, three talent trees, five loot tiers, and dungeons built from rooms.", body,
                "Sources: GDD 0.1 modules 04 and 09; the dungeon from the game's <code>Data/Dungeons/DGN_001.json</code>.")


def pvp(zones):
    flagged = [z for z in zones if z["pvp_flag"].lower() == "true"]
    body = """
<h2>Flagging</h2>
<p>%s Player-versus-player only happens in flagged zones. The server flags you; nothing on your side can change
it.</p>
<ol class="steps">
<li><strong>You cross into a PvP zone.</strong> A red icon and a timer appear. Where a zone has a consent buffer you
get 10 seconds first.</li>
<li><strong>You are flagged.</strong> Other flagged players can damage you and you them. Players who are not flagged
cannot be attacked.</li>
<li><strong>You leave.</strong> The flag stays until you have been outside for 60 seconds.</li>
</ol>
<p>The flagged zones today: %s. Each zone sets its own consent buffer and exit cooldown, so casual and hardcore zones
can differ.</p>

<h2>What is at stake</h2>
""" % (DESIGN, ", ".join("<strong>%s</strong>" % E(z["name"]) for z in flagged)) + table(["", ""], [
        ["Loot", "Full loot on death in flagged zones (default). Secured base storage is safe unless raided"],
        ["Bounties", "Kills build a bounty; bounty hunters can track flagged players with devices"],
        ["Extraction", "Extraction points take time to complete, shown as a progress bar; other players can interrupt"],
    ], "kv") + """

<h2>Fair play</h2>
""" + table(["Problem", "Answer"], [
        ["Logging off mid-fight", "Your character stays as an AI-controlled stand-in, with your gear, for 5 minutes"],
        ["Griefing new players", "Protection timers for new players; respawning safely outside PvP zones"],
        ["Cheating", "The server checks everything that matters; automatic reports"],
    ]) + """

<h2>Vehicles</h2>
""" + table(["Vehicle", "Seats"], [["Hoverbike", "1"], ["Skiff", "2–4"], ["Transport (armoured)", "Not set yet"]]) + """
<p>Vehicles run on fuel you craft or find, take damage and need repair. The Sci-Fi Complete Bundle's hoverbike is the
starting point, rebuilt to work online. Vehicles arrive in the alpha phase.</p>
<p>Travel targets across the map: about 45 minutes on foot and 15 to 20 minutes by hoverbike. At about 13 km across,
that means about 5 m/s on foot and 11 to 15 m/s on the hoverbike. The character's run speed is already 5 m/s (walk 2,
sprint 7), so a straight run across takes about 45 minutes and a real route with detours about an hour.
45 minutes is the straight-line target (D-19).</p>
"""
    return page("PvP and travel", "PvP and travel",
                "Danger by consent: how flagging works, what you can lose, and how you get around.", body,
                "Sources: GDD 0.1 modules 05 and 06; flagged zones from the game's <code>Data/Zones.csv</code>.")


def characters(presets, hud):
    p = presets[0] if presets else {}
    h = hud.get("hud", {})
    cross = h.get("crosshair", {}).get("variants", [])
    preset_rows = [
        ["Name", E(p.get("display_name", ""))], ["Origin", E(p.get("origin", ""))],
        ["Height", "%.2f m" % p.get("body", {}).get("height_meters", 0)],
        ["Implant", "<code>%s</code>, colour %s, glow %s" % (E(p.get("implants", [{}])[0].get("id", "")), E(p.get("implants", [{}])[0].get("color", "")),
                                                          E(str(p.get("implants", [{}])[0].get("glow", ""))))],
        ["Starter weapon", "<code>%s</code>" % E(p.get("starter_loadout", {}).get("weapon", ""))],
        ["Starter tool", "<code>%s</code>" % E(p.get("starter_loadout", {}).get("tool", ""))],
        ["Notes", E(p.get("notes", ""))],
    ]
    body = """
<h2>Creating your character</h2>
<p>%s Every face is a MetaHuman.</p>
""" % DESIGN + chain(["Preset", "Face", "Body", "Implants and scars", "Voice", "Origin", "Loadout", "Confirm"]) + table(["Step", "Choices"], [
        ["Preset", "12 curated MetaHumans with a balanced range of looks"],
        ["Face", "Sliders for jaw, brow, nose, cheeks and lips; iris colour, sclera tint, small scars; live preview with breathing and eye movement"],
        ["Body", "Height within ±15 %, musculature, limb length, posture"],
        ["Implants and scars", "Alien biotech: glowing nodes, plates under the skin; tattoos"],
        ["Voice", "8 voice packs with lip sync; pitch"],
        ["Origin", "Sets a starting talent point, a unique starter item and a three-step intro quest"],
        ["Loadout", "A weapon type and a survival tool"],
    ]) + """
<p class="wiki-note">""" + OPEN + """ The direction asks for 120 face sliders while you play. MetaHuman creation is an
editor tool, so the prototype starts with the presets plus body, materials, tattoos and implants; changing faces
in the game is its own research step (OQ-03).</p>

<h2>Origins</h2>
<div class="grid-cards">
<div class="mak-card"><h3>Scientist</h3></div><div class="mak-card"><h3>Soldier</h3></div>
<div class="mak-card"><h3>Scavenger</h3></div><div class="mak-card"><h3>Corporate Envoy</h3></div>
</div>
<p>Each gives a starting talent point, a starter item and an intro quest; the details are still to be written.</p>

<h2>The first preset</h2>
<p>One of the twelve presets exists as data so far.</p>
""" + table(["", ""], preset_rows, "kv") + """

<h2>The HUD</h2>
<p>Layout for a 1920 × 1080 screen; it scales with resolution.</p>
<div class="hud-mock" role="img" aria-label="HUD layout: buffs top left, compass top centre, minimap top right, crosshair in the centre, vitals bottom left, weapon bottom centre, quick-use wheel bottom right">
<div class="tl"><strong>Top left</strong>Name, level, buffs and debuffs</div>
<div class="tc"><strong>Top centre</strong>Compass (%s) with PvP and objective markers; notifications</div>
<div class="tr"><strong>Top right</strong>Minimap (%s), extraction points, flagged areas</div>
<div class="cc"><strong>Centre</strong>Dynamic crosshair (%s), hit markers, damage numbers, weak-point indicators</div>
<div class="bl"><strong>Bottom left</strong>Vitals: %s</div>
<div class="bc"><strong>Bottom centre</strong>Weapon (%s): ammo, fire mode, attachments</div>
<div class="br"><strong>Bottom right</strong>Quick-use wheel, %s slots with cooldowns</div>
</div>
""" % (E(h.get("compass", {}).get("size", "")), E(h.get("minimap", {}).get("size", "")), E(", ".join(cross)),
       E(", ".join(h.get("vitals", {}).get("elements", []))), E(h.get("weapon", {}).get("size", "")),
       E(str(h.get("quickwheel", {}).get("slots", "")))) + """
<p>The death screen lists what you dropped, the respawn options, a recovery timer and a ping for teammates.</p>

<h2>HUD icons</h2>
<p>""" + DESIGN + """ Twelve placeholder line icons for the Prototype HUD, white on a clear background so the HUD can
tint them; shown here on a dark tile. Select one to see it full size; the PNG link under each is the transparent
file the game uses. The art direction is still the owner's.</p>
<div class="icon-grid">
""" + "".join('<figure><img src="icons/%s_preview.png" alt="%s HUD icon on a dark tile" loading="lazy" width="256" height="256">'
              '<figcaption>%s · <a href="icons/%s.png" download>PNG</a></figcaption></figure>'
              % (n, n, n, n) for n in ICONS) + """
</div>

<h2>Menus</h2>
<ul>
<li><strong>Hotbar:</strong> twelve slots on keys 1 to 9, 0, − and = choose what is in your hands: weapons, grenades, things to use (D-25).</li>
<li><strong>Inventory:</strong> a grid with a weight limit, equipment slots and the hotbar row, quick-craft recipes and filters.</li>
<li><strong>Map:</strong> layers for PvP zones, resource nodes and dungeon entrances; several zoom levels.</li>
<li><strong>Quest log:</strong> objectives, stages, lore entries and map markers.</li>
<li><strong>Loading screens:</strong> tips, the status of PvP hotspots, your last base and active quests, with
MetaHuman close-ups.</li>
<li><strong>Accessibility:</strong> UI scale, colour-blind modes, subtitle sizes, controller remapping; offered at
first launch.</li>
</ul>
"""
    return page("Characters and HUD", "Characters and HUD",
                "Who you play, how you make them, and what you see on screen.", body,
                "Sources: GDD 0.1 modules 01 and 10; the preset from <code>Data/MetaHumanPresets.json</code> and the layout from "
                "<code>Data/UI/HudLayout.json</code>.")


def development():
    modules = [
        ["P1", "Foundation: data tables from the data files, automated tests, the multiplayer test harness, a grey test range",
         BUILT + " Built and checked 2026-10-15; closed 2026-10-16"],
        ["P2", "Shooter character: motion-matched movement, third-person aim-down-sights camera, sprint, crouch, mantle; online", BUILT + " Built and checked 2026-10-16; waits for the owner's play-test"],
        ["P3", "Weapons: SMG, pistol, a grenade launcher and hand grenades; recoil, spread, damage and armour; hits checked by the server", BUILT + " Built and checked 2026-10-16 with the Multiplayer Shooter System (D-23); waits for the owner's play-test"],
        ["P4", "Inventory, hotbar and UI: an inventory the server owns, a 12-slot hotbar, pickups, the HUD, inventory screen and menus in the shooter pack's look; the main menu, pause menu and options", BUILT + " Built 2026-10-16 while the owner was away; waits for the owner's play-test"],
        ["P5", "Vitals and crafting: health, stamina, hunger, hydration, temperature; the formulas; crafting a bandage and ammo; the vitals on the HUD; the death screen", BUILT + " Built 2026-10-16 while the owner was away; waits for the owner's play-test"],
        ["P6", "Coastal slice: the first 1–2 km² of the 100 km² main map, in the starter biome, at full quality and within the performance budget", "Started 2026-10-17"],
        ["P7", "Creatures: Skitterjaw, Phase Warden, Grav Raptor with behaviour, stagger and weak points", "—"],
        ["P8", "MetaHuman base: the player from presets, customisation saved and loaded", "—"],
        ["P9", "Prototype play-through: crash site, vitals, scavenge and craft, the first fight, shelter", "—"],
    ]
    decisions = [
        ["D-01", "Tharrn is the owner's only active game; the earlier game was deleted"],
        ["D-02", "The owner's direction document is the design source; the GDD splits it into modules"],
        ["D-03", "A new Unreal project, private, never published; cooked builds only"],
        ["D-04", "The server decides, from the very first system; every system is tested with a server and clients"],
        ["D-05", "Audio with MetaSounds now, Wwise later"],
        ["D-06", "Built one module at a time in the live editor; each is polished and tested before the next"],
        ["D-07", "C++ for complex systems, Blueprints for simple ones, notes in both; data in CSV files"],
        ["D-08", "Store packs stay outside Git"],
        ["D-09", "No Valley of the Ancient content, nothing from earlier games' designs or lore"],
        ["D-11", "60 fps on an RTX 3060 at 1440p with DLSS Quality; 120 fps on high-end PCs"],
        ["D-12", "DLSS 4.5 upscaling, with Unreal's TSR when DLSS is not available"],
        ["D-13", "No AI or LLM calls in the game itself; AI tools are for the editor only"],
        ["D-14", "The world is about 75 km² (size superseded by D-26)"],
        ["D-15", "Third-person camera over the shoulder, with aim-down-sights"],
        ["D-16", "The Skitterjaw is a desert creature"],
        ["D-17", "The game is called Tharrn"],
        ["D-18", "The player is the Game Animation Sample's motion-matched character on Character Movement, not the template's character"],
        ["D-19", "45 minutes on foot across the map in a straight line"],
        ["D-20", "The Sci-Fi Complete Bundle is the environment kit; its documentation is the go-to reference"],
        ["D-21", "Menus and the HUD are built with Easy Game UI Ultimate 3.0"],
        ["D-22", "Weapons, clothing and armour are made for Tharrn (Blender, Higgsfield); placeholders until then"],
        ["D-23", "Weapons combine the Multiplayer Shooter System (looks, animation, handling) with Tharrn's C++ (hits, damage, data)"],
        ["D-24", "No slide; hip fire kept; a grenade launcher in the heavy slot and hand grenades; aiming looks through the sight; the mouse wheel picks weapons"],
        ["D-25", "A 12-slot survival hotbar replaces the weapon keys and holsters; an inventory the server owns; the game's UI in the shooter pack's look"],
        ["D-26", "The main map is about 100 km², its biomes put together the way the Sci-Fi bundle's example level is"],
        ["D-27", "The main map is an island: the 15 zones, 2.56 km each, with sea all around"],
    ]
    questions = [
        ["OQ-01", "Consoles", "PC first; decide once the prototype is fun"],
        ["OQ-02", "Dedicated servers", "Develop with a server inside the editor; packaging a server needs Unreal built from source"],
        ["OQ-03", "Changing faces while playing", "Presets first; research face changes in the game as its own step"],
        ["OQ-04", "Missing art: creatures (weapons and armour: D-22; weapon animations: D-23)", "The owner picks store packs; Claude checks fit and cost"],
        ["OQ-05", "Ocean and coast", "Test Unreal's water early in the coastal slice; the Sci-Fi bundle's own water if it fails"],
        ["OQ-06", "Terrain source", "Real coastal survey data where it fits, generated terrain elsewhere"],
        ["OQ-07", "Scope", "Build the prototype first, then re-plan"],
        ["OQ-09", "Hit checking under lag", "The server rewinds hit boxes to the moment of the shot"],
        ["OQ-10", "Anti-cheat", "Server checks from the start; Easy Anti-Cheat for an online build"],
        ["OQ-11", "Day length", "Propose with the coastal slice"],
        ["OQ-12", "The tutorial's first creature", "A coastal cousin of the Skitterjaw, a crash site at the desert's edge, or another creature"],
    ]
    body = """
<h2>How Tharrn is built</h2>
<ul>
<li><strong>One module at a time</strong>, in the live Unreal Editor through Unreal MCP. Each module is polished
and passes every check before the next starts, and the owner's play-test closes it when there is something to
play.</li>
<li><strong>Online from the first system.</strong> Every feature is tested with a server and two clients, with
simulated lag and packet loss, and with a player joining late.</li>
<li><strong>C++ for complex systems, Blueprints for simple ones</strong>, and both carry notes you can read when you
open them: comment boxes in Blueprints, a description on every variable.</li>
<li><strong>Game data lives in CSV and JSON files</strong> (<code>D:\\Tharrn\\Data</code>) and is imported into
Unreal's data tables; the files are the source.</li>
</ul>

<h2>Roadmap</h2>
""" + table(["Phase", "Months", "What it adds"], [
        ["<strong>Prototype</strong>", "0–3", "Core shooter feel, vitals, one biome, three creatures, the MetaHuman base"],
        ["Vertical slice", "3–9", "A full dungeon and boss, base building, a flagged PvP zone, a faction questline, co-op extraction"],
        ["Alpha", "9–15", "Several biomes, the creature roster, weapon mods, vehicles, basic multiplayer"],
        ["Beta", "15–18", "Polish, balancing, endgame content, server stress tests"],
        ["Launch", "18+", "Seasonal events and expansions"],
    ]) + """

<h2>Prototype modules</h2>
""" + table(["#", "Module", "State"], modules) + """

<h2>What P1 built</h2>
<ul>
<li>""" + BUILT + """ <strong>Data:</strong> weapons, creatures and zones import into Unreal's data tables and are read
back and compared, with no problems.</li>
<li>""" + BUILT + """ <strong>Tests:</strong> 31 automated tests pass.</li>
<li>""" + BUILT + """ <strong>Multiplayer test:</strong> a server with two clients, as a host who plays and as a
server with no player, with 50 ms of lag each way and 1 % packet loss; a third player joins halfway and gets the
current state. Round trips 119–172 ms.</li>
<li>""" + BUILT + """ <strong>Test range:</strong> a grey map with targets at 10, 25, 50 and 100 m and a network probe
that shows what each player receives.</li>
</ul>

<h2>What P2 built</h2>
<ul>
<li>""" + BUILT + """ <strong>The player:</strong> the Game Animation Sample's motion-matched character, with its camera,
mantle and vault, made ready for online play: sprinting, walking, strafing and aiming travel with every movement update,
so the server agrees with the player at all times.</li>
<li><strong>Slide:</strong> built, then removed by the owner on 2026-10-16 (D-24); crouching only crouches.</li>
<li>""" + BUILT + """ <strong>Mantle and vault, checked by the server:</strong> the server looks for the ledge itself and
refuses a climb where there is none, so a cheating client cannot climb thin air.</li>
<li>""" + BUILT + """ <strong>Aim:</strong> the camera comes in over the shoulder.</li>
<li>""" + BUILT + """ <strong>Checked online</strong> with 50 ms of lag each way and 1 % packet loss: every player's
scripted run and climbs match on every machine to the centimetre.</li>
</ul>

<div class="mak-card"><h3>Play-test P2 (about 10 minutes)</h3>
<ol>
<li>Open Tharrn; the editor opens the test range. Press Play.</li>
<li>The sign on the left lists the keys. Run with W A S D, hold Shift to sprint, Ctrl to walk, C to crouch.</li>
<li>Run at the three blocks on the left and press Space in front of each: a hurdle (1 m), a mantle (1.5 m), a climb
(2.5 m).</li>
<li>Hold the right mouse button to aim. The middle mouse button switches between facing the camera and turning towards
where you run.</li>
<li>Three dots next to Play: <em>Number of Players</em> 2, <em>Net Mode</em> "Play As Listen Server"; Play. Move in one
window and watch the other.</li>
<li>Set it back to 1 player and "Play Standalone", then tell Claude what feels wrong or good.</li>
</ol></div>

<h2>What P3 built</h2>
<ul>
<li>""" + BUILT + """ <strong>Three weapons from the data files:</strong> the SMG, the pistol and the grenade launcher
(D-24), every number from <code>Data/Weapons.csv</code> and the recoil curves from <code>Data/WeaponRecoil.csv</code>.</li>
<li>""" + BUILT + """ <strong>Hits decided by the server:</strong> the shot shows at once on the player's screen; the
server checks it, rewinds the other players to the moment of the shot, and applies head, body and limb damage and the
target's armour. A cheating client cannot fire faster, from elsewhere, or without ammunition.</li>
<li>""" + BUILT + """ <strong>The launcher's round</strong> flies in an arc and takes its time to arrive, the same on
every machine, and explodes where it lands with the Multiplayer Shooter System's fireball; only the server deals the
blast.</li>
<li>""" + BUILT + """ <strong>Hand grenades:</strong> three each, thrown with MSS's throw; the server counts them, throws
them where you aim and deals the blast.</li>
<li>""" + BUILT + """ <strong>Aiming through the sight:</strong> the right mouse button with a weapon out moves the view
into a first-person look through the weapon's sight.</li>
<li>""" + BUILT + """ <strong>The mouse wheel</strong> picks the next or previous weapon.</li>
<li>""" + BUILT + """ <strong>Weapons in the hands:</strong> the Multiplayer Shooter System's weapon handling on the
motion-matched character: drawing from holsters on the thigh and back, aiming, recoil on the arms, reloads, its HUD.
Its weapon models stand in until Tharrn's own (D-22).</li>
<li>""" + BUILT + """ <strong>Checked online</strong> with 50 ms of lag each way and 1 % packet loss: 0 to 1.2 % of
shots differ between the shooter's screen and the server (the target is under 2 %).</li>
</ul>

<div class="mak-card"><h3>Play-test P3 (about 10 minutes)</h3>
<ol>
<li>Press Play on the test range. X draws the pistol from the thigh; the left mouse button fires, one shot a click.</li>
<li>Shoot the targets (10, 25, 50, 100 m): the number above each drops, more for the head, less through armour; at 0
it shows DOWN and stands up 3 seconds later.</li>
<li>R reloads. The mouse wheel (or F) brings out the SMG from the back (hold to fire) and then the grenade launcher;
the right mouse button aims through the sight.</li>
<li>G takes a grenade into the hand; hold the right mouse button to see the arc, hold the left to pull the pin, let go
to throw. Three each.</li>
<li>Run, sprint and climb with a weapon out: the movement should feel as before.</li>
<li>Play with 2 players (Listen Server) and shoot each other: the same on both screens.</li>
</ol></div>

<h2>Decisions</h2>
<p>Binding once made; the full log, with the owner's words, is <code>projects/Tharrn/docs/decisions.md</code>.</p>
""" + table(["ID", "Decision"], [["<code>%s</code>" % d, E(t)] for d, t in decisions]) + """

<h2>Open questions</h2>
""" + table(["ID", "Question", "Recommendation"], [["<code>%s</code>" % q, E(a), E(b)] for q, a, b in questions]) + """

<h2>Where things are</h2>
""" + table(["What", "Where"], [
        ["Design record (GDD, decisions, tasks, guide)", "<code>projects/Tharrn/</code> in the Mr. Mak repository"],
        ["The owner's direction document", "<code>projects/Tharrn/source/</code>"],
        ["Deliverables written so far: PvP flagging state (3), creature behaviour (9), QA matrix (10), HUD icons (8); proposals for creatures (5), dungeon templates (6) and weapons (7)", "<code>projects/Tharrn/docs/deliverables/</code>"],
        ["Unreal project", "<code>D:\\Tharrn</code>, a private Git repository with no remote"],
        ["Game data", "<code>D:\\Tharrn\\Data</code>"],
        ["Easy Game UI Ultimate, for menus and the HUD", "<code>projects/Tharrn/docs/easy-game-ui.md</code>"],
        ["The Sci-Fi Complete Bundle's guides (the go-to reference for world building)", "<a href=\"https://docs.google.com/document/d/1lFjRKIKaGpnxRJgw_aDCGNAif1RqJk6e4APHl3Pbz5o/edit\">Main guide</a>; all of them in <code>projects/Tharrn/docs/scifi-bundle.md</code>"],
        ["This wiki", "Rebuilt by <code>python projects/Tharrn/tools/build_wiki.py</code>"],
    ], "kv")
    return page("Development", "Development",
                "How Tharrn is made, where it stands, and what is still open.", body,
                "Sources: GDD 0.1 modules 00 and 12; <code>projects/Tharrn/docs/tasks.md</code> and <code>decisions.md</code>.")


CSS = """/* Tharrn Wiki: additions to the shared report styles. Each colour has a light-theme rule below. */
.lead{font-size:18px;max-width:70ch}
.wiki-note{font-size:13px;color:var(--mak-muted)}
.tag{display:inline-block;font-size:11px;font-weight:600;letter-spacing:.03em;line-height:1.5;padding:1px 8px;border-radius:999px;border:1px solid;vertical-align:1px;white-space:nowrap;margin-right:4px}
.tag-built{color:#7fdcae;border-color:#7fdcae66;background:#7fdcae14}
.tag-design{color:#c9c1d2;border-color:#ffffff2a;background:#ffffff08}
.tag-open{color:#f3c76b;border-color:#f3c76b66;background:#f3c76b14}
.tag-pvp{color:#ff8fa3;border-color:#ff8fa366;background:#ff8fa314}
.stats{margin:24px 0}
.stats strong{font-size:26px;line-height:1.2}
.grid-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:16px;margin:18px 0}
.grid-cards>.mak-card{margin:0}
.grid-cards h3{margin:0 0 6px}
.grid-cards p{margin:6px 0}
.creatures{grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))}
.creature .card-num{margin:0;font-size:12px;letter-spacing:.08em}
html[data-mak-report=document] table.kv td code{white-space:normal;overflow-wrap:anywhere}
.creature table{margin-top:10px}
.chain{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:14px 0 18px}
.chain-step{padding:5px 12px;border:1px solid var(--mak-border);border-radius:8px;background:#ffffff06;line-height:1.5;font-size:14px}
.chain-arrow{color:var(--mak-muted)}
/* Wrap table text between words only, so a wide table scrolls inside its frame instead of splitting words. */
html[data-mak-report=document] :is(th,td){overflow-wrap:break-word}
html[data-mak-report=document] td code{overflow-wrap:normal;white-space:nowrap}
table.kv th:empty{display:none}
table.kv thead{display:none}
table.kv td:first-child{color:var(--mak-muted);white-space:nowrap;width:1%}
.two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.map-figure{margin:12px 0 8px;padding:14px;border:1px solid var(--mak-border);border-radius:12px;background:#0c0d11}
.zone-map{display:block;width:100%;height:auto;color:inherit}
.zone-map .grid{stroke:currentColor;stroke-opacity:.12;stroke-width:.012}
.zone-map .cell{stroke:currentColor;stroke-opacity:.45;stroke-width:.02}
.zone-map .SafeHub,.legend .SafeHub{fill:#3fbf7f;fill-opacity:.32;background:#3fbf7f80}
.zone-map .OpenPvE,.legend .OpenPvE{fill:#6b8afd;fill-opacity:.2;background:#6b8afd55}
.zone-map .FlaggedPvP,.legend .FlaggedPvP{fill:#f0506e;fill-opacity:.36;background:#f0506e8c}
.zone-map .BufferZone,.legend .BufferZone{fill:#f0b429;fill-opacity:.34;background:#f0b42985}
.zone-map text{fill:currentColor}
.zone-map .zid{font-size:.34px;font-weight:700}
.zone-map .zname{font-size:.185px}
.zone-map .zmeta{font-size:.16px;fill-opacity:.75}
.zone-map .axis{font-size:.19px;fill-opacity:.55}
.legend{display:flex;flex-wrap:wrap;gap:8px 20px;list-style:none;padding:0;margin:12px 0 0;font-size:13px}
.legend i{display:inline-block;width:14px;height:14px;border-radius:3px;vertical-align:-2px;margin-right:7px}
.steps li{margin:8px 0}
.hud-mock{display:grid;grid-template-columns:1fr 1.3fr 1fr;grid-template-areas:"tl tc tr" ". cc ." "bl bc br";gap:10px;padding:12px;border:1px solid var(--mak-border);border-radius:12px;background:#0c0d11;margin:14px 0}
.hud-mock>div{border:1px dashed #ffffff2e;border-radius:8px;padding:8px 10px;font-size:12.5px;line-height:1.5}
.hud-mock strong{display:block;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mak-muted);margin-bottom:2px}
.hud-mock .tl{grid-area:tl}.hud-mock .tc{grid-area:tc}.hud-mock .tr{grid-area:tr}.hud-mock .cc{grid-area:cc;text-align:center;margin:18px 0}
.hud-mock .bl{grid-area:bl}.hud-mock .bc{grid-area:bc}.hud-mock .br{grid-area:br}
.icon-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:12px;margin:14px 0}
.icon-grid figure{margin:0;padding:12px 10px 8px;border:1px solid var(--mak-border);border-radius:10px;background:#14161c;text-align:center}
.icon-grid img{width:64px;height:64px;display:block;margin:0 auto}
.icon-grid figcaption{font-size:12px;color:#b9b2c2;margin-top:6px}
.wiki-foot{margin-top:52px;padding-top:16px;border-top:1px solid var(--mak-border);font-size:12px;color:var(--mak-muted);line-height:1.7}
@media(max-width:680px){
.two{grid-template-columns:1fr}
.stats{grid-template-columns:repeat(2,minmax(0,1fr))}
.lead{font-size:16.5px}
.zone-map .zname,.zone-map .zmeta{display:none}
.zone-map .zid{font-size:.52px}
.zone-map .axis{font-size:.3px}
.zone-map .ytitle{display:none}
.map-figure{padding:8px}
.hud-mock{grid-template-columns:1fr;grid-template-areas:"tl" "tc" "tr" "cc" "bl" "bc" "br"}
.hud-mock .cc{margin:0;text-align:left}
}
html[data-mrmak-theme=light]:not([data-mak-theme=custom]) .tag-built{color:#16794a!important;border-color:#16794a59;background:#16794a12}
html[data-mrmak-theme=light]:not([data-mak-theme=custom]) .tag-design{color:#505b70!important;border-color:#202a4033;background:#202a4008}
html[data-mrmak-theme=light]:not([data-mak-theme=custom]) .tag-open{color:#8a5a00!important;border-color:#b07a0059;background:#b07a0012}
html[data-mrmak-theme=light]:not([data-mak-theme=custom]) .tag-pvp{color:#b3263f!important;border-color:#b3263f59;background:#b3263f10}
html[data-mrmak-theme=light]:not([data-mak-theme=custom]) :is(.chain-step){background:#f5f6f9;border-color:#202a4026}
html[data-mrmak-theme=light]:not([data-mak-theme=custom]) :is(.map-figure,.hud-mock){background:#f7f8fb;border-color:#202a4026}
html[data-mrmak-theme=light]:not([data-mak-theme=custom]) .hud-mock>div{border-color:#202a4040}
html[data-mrmak-theme=light]:not([data-mak-theme=custom]) :is(.wiki-foot,.wiki-note,.chain-arrow,table.kv td:first-child,.hud-mock strong){color:#505b70!important;border-color:#202a4026}
html[data-mrmak-theme=light]:not([data-mak-theme=custom]) .zone-map{color:#232735}
html[data-mrmak-theme=light]:not([data-mak-theme=custom]) .card-num{color:#98445e!important}
html[data-mrmak-theme=light]:not([data-mak-theme=custom]) .icon-grid figure{background:#14161c!important;border-color:#202a4026}
html[data-mrmak-theme=light]:not([data-mak-theme=custom]) .icon-grid figcaption{color:#c9c1d2!important}
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default=r"D:\Tharrn\Data", help="the game repo's Data folder")
    args = ap.parse_args()
    zones = read_csv(os.path.join(args.data, "Zones.csv"))
    weapons = read_csv(os.path.join(args.data, "Weapons.csv"))
    creatures = read_csv(os.path.join(args.data, "Creatures.csv"))
    with open(os.path.join(args.data, "Dungeons", "DGN_001.json"), encoding="utf-8") as f:
        dungeon = json.load(f)
    with open(os.path.join(args.data, "MetaHumanPresets.json"), encoding="utf-8") as f:
        presets = json.load(f)
    with open(os.path.join(args.data, "UI", "HudLayout.json"), encoding="utf-8") as f:
        hud = json.load(f)

    pages = [  # (tab name, file, html)
        ("Overview", "index.html", overview()),
        ("World and zones", "world.html", world(zones)),
        ("Bestiary", "bestiary.html", bestiary(creatures)),
        ("Combat and arsenal", "combat.html", combat(weapons)),
        ("Survival and building", "survival.html", survival()),
        ("Progression and dungeons", "progression.html", progression(dungeon)),
        ("PvP and travel", "pvp.html", pvp(zones)),
        ("Characters and HUD", "characters.html", characters(presets, hud)),
        ("Development", "development.html", development()),
    ]
    os.makedirs(OUT, exist_ok=True)
    changed = []
    os.makedirs(os.path.join(OUT, "icons"), exist_ok=True)
    for n in ICONS:
        icon = Image.open(os.path.join(ICON_SRC, n + ".png")).convert("RGBA")
        preview = Image.new("RGBA", icon.size, (20, 22, 28, 255))  # the white icon on a dark tile, for viewing
        preview.alpha_composite(icon)
        buf = io.BytesIO()
        preview.save(buf, "PNG")
        for name, data in ((n + ".png", open(os.path.join(ICON_SRC, n + ".png"), "rb").read()), (n + "_preview.png", buf.getvalue())):
            path = os.path.join(OUT, "icons", name)
            if not os.path.isfile(path) or open(path, "rb").read() != data:
                open(path, "wb").write(data)
                changed.append("icons/" + name)
    for name, text in [("wiki.css", CSS)] + [(f, h) for _, f, h in pages]:
        path = os.path.join(OUT, name)
        old = open(path, encoding="utf-8").read() if os.path.isfile(path) else None
        if old != text:
            with open(path, "w", encoding="utf-8", newline="\n") as f:
                f.write(text)
            changed.append(name)

    today = datetime.date.today().isoformat()
    with open(REGISTRY, encoding="utf-8") as f:
        registry = json.load(f)
    entities = registry["entities"]
    card = next((e for e in entities if e.get("id") == CARD_ID), None)
    steps = [{"name": n, "path": f} for n, f, _ in pages]
    if card is None:
        card = {"id": CARD_ID, "title": "Tharrn Wiki",
                "description": "The game's wiki: world and zones, creatures, combat, survival, progression, PvP, characters, and where development stands.",
                "type": "group", "category": "project", "created": today, "updated": today, "folder": FOLDER,
                "steps": steps, "status": "active", "pinned": True, "defaultStep": 0}
        entities.insert(0, card)
        changed.append("workspace.json (new card)")
    else:
        if card.get("steps") != steps:
            card["steps"] = steps
            changed.append("workspace.json (steps)")
        if changed:
            card["updated"] = today
        card["pinned"] = True
    with open(REGISTRY, "w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(registry, indent=2, ensure_ascii=False) + "\n")
    print("[THWiki] %d pages in workspace/%s; changed: %s" % (len(pages), FOLDER, ", ".join(changed) or "nothing"))
    print("[THWiki] RESULT ok")


if __name__ == "__main__":
    main()
