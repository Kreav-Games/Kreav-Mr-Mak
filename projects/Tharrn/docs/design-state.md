# State of the design (2026-10-23)

The facts to write the game's two pages against: what the owner wrote, what the chats built from it, what is
decided, what is still open, what the story currently claims and what exists in the build. Written by the Setup
chat at the owner's request, after the owner said the game "is not working out" and the story "was not really
thought out". Rebuilt into the wiki's Design state tab by `python projects/Tharrn/tools/build_wiki.py`; the
decisions and open questions on that tab are read live from [decisions.md](decisions.md) at every rebuild.

## Where it stands

Tharrn is eight days old. It was created on 2026-10-15, the day it replaced Wildwright as the only active game
(D-01), from one direction document the owner wrote that day: 2,353 words, six sections, the design source (D-02).
In the week since, the chats wrote GDD 0.1 in thirteen modules, a story bible of thirteen sections, a decision log,
a task list and five engineering records, and built the prototype's first five modules in C++.

The honest reading of those files: the fiction is coherent but nobody signed it, the foundations are still open
questions in the log, and production ran ahead of both. The code does not depend on the fiction, so none of the
technical work is lost whichever way the story goes.

## What you wrote, and what the agents built from it

| Topic | Your direction (2026-10-15) | What the chats made of it |
|---|---|---|
| **Title** | Aetherfall: Exodus | Tharrn (D-17) |
| **Premise** | One line in section 1.4: an Exodus Initiative operative; the convoy investigating an alien signal; the crash scatters the survivors and corrupts their tech; survive, secure the extraction beacon, uncover the alien mystery | The story bible: the signal that says "Tharrn", Convoy Meridian lost twelve years ago, Convoy Lantern (you), the Lattice under the island, the Choir who built it, the keeper it calls for, four factions, five acts, raids and seasons. A proposal, not signed (OQ-25) |
| **World** | A streamed open world of 16 to 25 km²; 45 minutes on foot across it; vehicles cut that to 15 or 20 | 75 km² (D-14), then an island of 15 zones at 100 km² (D-26, D-27), then an island 46 km from south to north, 714 km² of land (D-34). On foot south to north now takes about 2.5 hours (OQ-23); vehicles about 35 minutes (OQ-29) |
| **Progression** | Level cap 60; talent trees Combat, Survival and Tech; weapon mastery, blueprints, faction reputation | Kept, and worked out in the story bible's sections 8 to 10; the XP curve waits on you (OQ-26) |
| **Session loop** | Prepare at a hub, expedition to a risk zone, dungeon or raid, extraction, return and upgrade | Kept in GDD 01. Designed, not built: the build has the shooting, the inventory, the vitals and the first quest data, not the loop |
| **Endgame** | Instanced high-risk raids, faction wars, territory control, seasonal events | Proposed in detail: raids of eight players with a weekly lockout, three difficulties, seasons of three months (OQ-27). Not signed |
| **Platform** | 60 fps on consoles (section 6.2) | A PC game for keyboard and mouse (D-42); consoles open (OQ-01); dedicated servers open (OQ-02) |
| **Roadmap** | Prototype first: core shooter feel, vitals, one biome, three creatures, a MetaHuman base (section 6.1); then a vertical slice of 3 to 9 months | The prototype's modules P1 to P5 were built in three days; the coastal slice P6 is under way; the scope question (OQ-07) is still open |

## Where the build drifted from the direction

- **The map grew thirty times** across three decisions, from 16 to 25 km² to 714 km², while the 45-minute crossing
  from your direction stayed on paper as a target (D-19) and the real crossing became 2.5 hours (OQ-23).
- **The name changed** from Aetherfall: Exodus to Tharrn (D-17), and the lore grew from one sentence in your direction
  to a 38 KB story bible that carries its own question in the log (OQ-25).
- **The build order left the roadmap.** Section 6.1 asked for core shooter feel, vitals, one biome, three creatures
  and a MetaHuman base. After P5 the chats decided five weapon tiers (D-37, D-38), four building tiers (D-33), hand
  tools (D-39), a 3D generation route for the arsenal (D-40), a radial build menu (D-44) and a restyle of the whole
  interface (D-31, D-36), each as a decision, while scope (OQ-07) stayed open.
- **The decisions outran the owner.** Many decisions in the log record "as proposed" on a chat's recommendation
  rather than a choice you made first; the open questions below are the ones the chats could not close that way.

## What the story currently claims

The story bible's one page, in short. Thirty-one years ago the Exodus Initiative heard a structured signal from a
star nobody had looked at; one sound in it everybody wrote down the same way: Tharrn. A probe found an ocean world
with one great island and the signal coming from under its rock. Convoy Meridian went twelve years ago, lost two of
its four landers, transmitted for fourteen months from the great mesa, said the signal had changed, and went silent.
Convoy Lantern is yours: a carrier, twelve landers, eight hundred operatives. As the landers came down a pulse from
under the rock took every ship's electronics; the landers fell across the island, each starting location is where
one hit (D-28), and you wake in the wreck of yours.

The island is held together by a buried crystal machine the Remnant call the Lattice, left singing the signal by
its makers, the Choir, as an invitation and an instruction set: a call for someone to come and take over as its
keeper. The ending is a choice made with every other survivor on the server about what to do with it.

| Faction | Who |
|---|---|
| **The Initiative** | Lantern's surviving officers and anyone who still follows orders |
| **The Remnant** | Meridian's survivors, eleven years on the mesa, half of them with crystal grown into their skin |
| **The Consortium** | The corporations that paid for both convoys, through their envoys and their security contractors |
| **The Free Camps** | Scavengers, settlers and deserters who answer to nobody |

The acts and milestones: the prototype plays Act I's *Wreck*; the vertical slice adds *Beacon*, the Remnant's
questline (Act III's *Mesa* and *First Signal*, with the Apex Titan) and the first extraction; the alpha fills Acts
II and IV with the other factions; the beta builds Act V and the raid. All of this is the Story chat's proposal of
2026-10-19. The log still lists the story itself as a question for you (OQ-25).

## What is decided

The decisions fall into seven groups. Identity and rules: the only active game, the direction as source, the new
project and its repository, no content from earlier games, the name, a PC game (D-01 to D-09, D-13, D-17, D-42).
The world: its size, the island, the zones, the starting locations and how the landscape goes into the editor
(D-14, D-19, D-26 to D-28, D-34, D-43). The player and camera (D-15, D-18). Combat and the arsenal (D-22 to D-24,
D-32, D-37 to D-40). Base building (D-30, D-33, D-41, D-44). The interface (D-21, D-25, D-31, D-36). Performance
and the pipeline (D-04, D-05, D-11, D-12, D-20, D-35). The full list, read live from the log:

## What is still open

Two kinds of question wait on you. The foundations: scope (OQ-07), the story (OQ-25), the endgame's shape (OQ-27),
where players start (OQ-16), travel across the new map and how its zones fit it (OQ-23, OQ-24), consoles and
dedicated servers (OQ-01, OQ-02). The rest are technical or content questions the chats can carry once the
foundations are set: hit detection, anti-cheat, the ocean, the terrain, the tutorial's first fight, the XP curve, the
vehicles' speeds, the title screen, the building pieces. The full list, read live from the log:

## What exists and survives any change of story

- **148 C++ files** in the game module and its editor module, in the folders Building, Combat, Data, Inventory, Net,
  Player, Progression, Survival and Tests. The last clean build was 2026-10-22.
- **P1 Foundation:** data tables from CSV files, 31 automation tests, the multiplayer test harness (listen server,
  two clients, dedicated server) and a grey test range.
- **P2 Shooter character:** the motion-matched player with sprint, slide, mantle and vault, the movement rules on the
  server so the game holds up under lag.
- **P3 Weapons:** shots predicted on the player's machine and decided on the server, with hit zones, armour, falloff,
  recoil curves and bodies rewound to the moment of the shot.
- **P4 Inventory, hotbar and UI:** twelve hotbar slots, a thirty-slot grid, worn slots, a weight limit, items and the
  starting kit from CSV files, the server owning all of it.
- **P5 Vitals and crafting:** stamina, hunger, hydration, felt temperature and neural stability, run on the server, and
  the first recipes.
- **P6 Coastal slice:** a 1 km test coast with the bundle's jungle, Unreal's ocean and sky, measured against the
  frame budget.
- **Base building:** four tiers, the piece factory, the gallery level, server-placed pieces, corner posts, a build
  tool and a radial menu under way.
- **Story track:** the quest, quest stage, lore and progression tables and their row types, Act I's first chapter on
  the test range.

Only names bind this work to the fiction: weapon rows, tier labels, faction and quest text in CSV files. Renaming is
cheap; the systems do not care who the Choir were.

## The two pages only you can write

- **The premise in one paragraph,** in your words. The chats have one; the question is whether it is yours.
- **The player fantasy:** who the player is, and what they feel doing the loop for an hour.
- **The core loop in one line,** and what one session of thirty to sixty minutes looks like.
- **Three pillars.** Keep, change or replace the five the GDD lists: elite gunfeel, high-stakes survival, deep RPG,
  consensual danger, an extensible world.
- **How it ends:** the endgame's shape and the ending, in a paragraph (OQ-27, and the last act of OQ-25).
- **What is cut** for the first playable: the answer to scope (OQ-07), as a list of what is not in it.

Write these before deciding whether Tharrn stays. They are the cure whichever game they describe.

## Suggested order

- The Master chat runs a design round instead of a build round: no new features until the two pages exist.
- You write the two pages. Dictation into one chat is fine; the chat only transcribes.
- The Story chat reconciles the story bible, the GDD and the decision log to them: keep what fits, rewrite or delete
  what does not, and close or explicitly defer every open question.
- Engine work resumes on the fresh 5.8.4 install with Visual Studio 2026, starting with the Interface chat's round.
