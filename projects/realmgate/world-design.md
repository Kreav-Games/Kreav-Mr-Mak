# "Your world, your way": scanned worlds

Decision (owner, 2026-11-07): players scan the spaces they play in with their
phone. Their living room, hallway, deck and yard become *their world*. Each new
scanned space extends it, so the open world grows as far as the player is
willing to walk. Other players can join a host's world.

## Core ideas

- **A world is a graph of zones.** Each zone is a scanned space: a room, a hallway, a
  deck, a yard. Doorways and stairs found in the scan become the links between
  zones. They are natural chokepoints, gates and boss doors.
- **The scan drives gameplay, not just looks.**
  - Walkable floor becomes the navigation mesh, so enemies path around the real couch.
  - Furniture becomes cover and hiding spots for loot and collectibles.
  - Walls and furniture hide monsters behind them (occlusion).
  - Room size sets how many enemies spawn.
- **Zones get a theme and level from what they are.** A room-type or object scan can
  theme a zone: bedroom becomes Barracks, kitchen the Forge, yard the Wilds. The
  further a zone is from the rift (the "Hearth"), the higher its level. Outdoor
  zones are the high-level frontier.
- **Visiting worlds is the MMO loop.** Every player's world is a zone set that
  others can visit. Visiting friends' worlds gives new layouts, higher tiers and
  their world bosses. A world levels up as its owner and visitors clear it.

## Scan once, then play seated

Decision (owner, 2026-11-07). Walking happens only while **scanning**. That's a
calm, one-time setup with no monsters, done at a walking pace. After that the
scan is the map, and the player **sits** (on the sofa, say) and steers a
character around it with the stick. No one runs through the house looking at a
phone, so stairs, pools and furniture are never a danger during a fight.

- **Live view (AR):** the host sees their hero running around the real room at full
  size, hidden behind the real sofa (LiDAR occlusion). If the hero runs out of
  sight (into the hallway or the yard), the game suggests turning the phone or
  switching to Map.
- **Map view:** the scanned world rebuilt as a 3D level with a follow camera. It
  covers rooms you can't see from your seat. Remote guests always use it.
- Characters collide with scanned walls and furniture. Doorways are the only way
  between zones.
- Walk-around play (the phone is your body) stays as an opt-in mode in the web
  prototype. The server keeps its safety rules for that mode only.

## Android and iPhone

Decision (owner, 2026-11-07): it must work on Android and iPhone. The owner
plays on Android. Scanning therefore has a baseline that every AR phone can do,
and LiDAR is an upgrade:

- **Floor-paint scan (all phones):** floor hit-tests paint 20 cm cells. A zone's
  floor is the outline of the painted cells. Unpainted gaps inside it (under the
  sofa) become obstacles. Areas join where they touch (`game/shared/floorscan.js`).
- **LiDAR upgrade (iPhone/iPad Pro):** RoomPlan walls, doors and furniture
  categories (`unity/`).
- **Lining up again without a cloud service:** the scan's frame is set by two taps,
  the rift spot and the spot it faces. Playing in AR later means sitting down
  and tapping the same two spots. Map view needs no alignment at all.

## Privacy: maps are private, sharing is by consent

Decision (owner, 2026-11-07):

- A scanned home stays on the owner's device. The server never writes it to disk.
- **Hosting is consent.** Before a room opens with your home, you confirm that
  players you let in will see its layout (shapes only, never camera images).
- **Joining is by code, then approval.** A player with the code only knocks. The
  host sees their name and class and taps **Let them in** or **No**. The layout
  is sent only after that.
- Sharing stops the moment the host leaves: the room closes for everyone.
- Guests are told the layout belongs to the host and asked not to record or
  share it.

## How others join

| Mode | Guest is | Guest sees |
| --- | --- | --- |
| Co-located | in the host's home | the host's scan, aligned to the real rooms (shared anchors or map) |
| Remote | anywhere | the host's world as a **digital twin**: the scanned geometry rendered as a 3D level, played with a stick or as a tabletop hologram |

The host always plays in AR. Remote guests make "join a friend's world" work
across cities.

## Technology consequences

The current WebXR prototype can't do the core of this:

- Browser AR on Android gives floor hits and anchors that last for one session.
- It has no saved maps to relocalize a room tomorrow.
- It has no room meshes on phones, and nothing on iPhone.

Persistent, scanned, shareable worlds point to a **native app (Unity + AR Foundation)**:

- **iPhone Pro and iPad Pro with LiDAR:** ARKit scene mesh, RoomPlan (walls, doors,
  windows, furniture types, multi-room capture) and ARWorldMap (save a space and
  relocalize in it later; share it with co-located peers).
- **Android:** ARCore Depth API for meshes, Cloud Anchors for persistence and
  sharing, and the Geospatial API for outdoor zones.
- **Other options:** third-party spatial SDKs (meshing, visual positioning,
  shared AR) are worth evaluating against these.

The game rules (`game/shared/`) and the room server can stay as they are. A native
client would render and send the same messages.

## Risks to design for

- **Privacy:** a home scan is a floor plan of someone's house.
  - Store geometry only, never camera images.
  - Keep scans on the device or encrypted.
  - Share with invited friends only.
  - Never show a world's real location to strangers.
- **Safety:** players walk between rooms and outdoors while looking at a phone.
  - Never put telegraphs or spawns on stairs, steps or near pools.
  - Use pause zones and edge warnings.
  - Have a "stay in this room" setting.
- **Scan quality:** scans can be partial, furniture moves and outdoor light
  changes. The game must accept a rescan of one zone without losing progress.
- **Device spread:** LiDAR phones give the best scans. Other phones need a simpler
  path (floor outline only).

## Phases

1. **Zone capture in the prototype.** The phone outlines walkable floor per zone
   (walk the edges with floor hit-tests).
   - Name the zone and link zones by doorways.
   - Spawns and pathing stay inside the outline.
   - The world is saved on the device and realigned by placing the rift on a
     remembered spot.
   - This proves multi-room play cheaply.
2. **Native client** *(started: `unity/`)*. Room meshes, persistent relocalization, occlusion and
   navmesh from the scan, plus zone themes from room and object types.
3. **Hosted worlds.** World storage, invites, co-located joining with shared maps,
   and remote twin mode.
