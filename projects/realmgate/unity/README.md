# Realmgate — Unity client (Android and iPhone)

The native app for scanned worlds ([world-design.md](../world-design.md)). You
scan your home once, then sit down and steer an action-figure-sized hero
around it in AR. Friends join with your room code, after you let them in, and
play on a 3D map of your home. The game rules and multiplayer stay on the Node
server in `../game`.

- **Any AR phone (Android ARCore, iPhone ARKit):** floor-paint scanning. Two taps
  (the rift spot, then the spot it faces) line the world up with the room each
  time, and an AR anchor keeps it there.
- **LiDAR iPhone/iPad Pro, optional:** RoomPlan room scans with a saved ARKit
  world map.

> **Status: never opened in Unity.** The Unity editor can't run in the
> development container. Two checks did run:
> - the Unity-free core (`Assets/Realmgate/Core`) is compiled and tested with
>   `dotnet test` (12 tests);
> - every C# file passes a Roslyn syntax check for both the Android and iOS
>   code paths.
>
> Expect a round of compile fixes on the first open.

## Android build from a Windows PC

1. Install **Unity Hub**. Then install **Unity 6.6** (the version the packages are set for) with **Android Build Support**,
   including the OpenJDK and Android SDK & NDK tools it offers.
2. Pull this branch. In Unity Hub, choose **Add → Add project from disk** and pick
   `projects/realmgate/unity/Realmgate`. Packages resolve from
   `Packages/manifest.json`, pinned to the Unity 6.6 releases: AR Foundation, ARCore
   and ARKit 6.6.2, Input System 1.19.0, XR Plug-in Management 4.5.4, and
   Newtonsoft JSON. If Package Manager offers a newer patch (for example AR
   Foundation 6.7.x), take it. If the Input System asks to enable its backend, choose **Yes**.
3. Open **Project Settings → XR Plug-in Management** once, then run
   **Realmgate → Set Up Project**. It does the following:
   - sets Android 7.0+, 64-bit ARM, IL2CPP and OpenGL ES 3;
   - turns on Google ARCore;
   - creates the materials and the boot scene.
4. On the phone, turn on **Developer options → USB debugging**, then connect it by
   USB. In **File → Build Profiles**, choose **Android**, then **Switch Platform**,
   then **Build And Run**.
5. Run the game server (`cd ../game && npm install && npm run server`). In the
   app, under **Server**, enter `ws://<pc-ip>:8787/ws`. Solo scanning needs no
   server, but playing does: solo play currently also goes through the server.

## iPhone build

The steps are the same with **iOS Build Support**, except that you need a Mac
with Xcode to sign and install the build. Run **Set Up Project**, switch to
iOS, build, then open the Xcode project and run it. The post-build step links
RoomPlan.

## How it plays

| Screen | What happens |
| --- | --- |
| Home | Choose a name and class. Play or edit a world, make a new world (or a LiDAR world on iPhone Pro), or join a friend's code. |
| World (any phone) | **Scan areas:** tap the rift spot and the spot it faces, then sweep the floor. Use **Type** (room, hallway or outdoors) and **Next area** for each space, then **Finish**. **Floor ▲/▼** corrects a misread floor height. |
| World (LiDAR) | **Scan a room** or **Scan a hallway** opens Apple's RoomPlan scanner. **Scan an outdoor area** walks a deck or yard with the LiDAR mesh. |
| Host (seated) | Sit down and tap the same two spots (on LiDAR worlds, the saved map is recognised instead). You confirm that you want to share the layout, then approve each player who knocks. Steer your hero with the stick. **Live** shows it in your real room; **Map** shows the scanned world as a 3D level. The world hides whenever the phone loses track of the room. |
| Guest (map) | Join with a code. The host's scanned rooms are rebuilt as a 3D level. Move with the stick (or WASD), and tap to target. |

## Code map

| Path | Role |
| --- | --- |
| `Assets/Realmgate/Core/` | No Unity dependency. World format (same as the server's), geometry, RoomPlan and area-scan import, zone linking, themes. |
| `Assets/Plugins/iOS/RealmgateRoomPlan.swift` | RoomPlan capture. Saves the ARWorldMap, relocalizes before adding a room, and returns the room as JSON. |
| `Assets/Realmgate/Runtime/ArRig.cs` | AR session, camera, planes, floor detection and ring, anchors, occlusion; ARKit world maps and LiDAR area scans. |
| `Assets/Realmgate/Runtime/FloorPaintScanner.cs` | Floor-paint scanning (screen-ray grid plus floor planes) on any phone. |
| `Assets/Realmgate/Core/FloorScan.cs` | Turns painted cells into zones (gaps become obstacles), and hero scale. |
| `Assets/Realmgate/Runtime/App.cs` | Screens, host and guest flow, input, HUD. |
| `Assets/Realmgate/Runtime/GameView.cs` | Draws server snapshots: entities, telegraphs, nameplates. Resolves taps. |
| `Assets/Realmgate/Runtime/TwinBuilder.cs` | Digital twin meshes for guests, and a ghost overlay for the host. |
| `Assets/Realmgate/Runtime/Net.cs` | WebSocket client and snapshot types. |
| `Assets/Realmgate/Editor/` | Project setup menu and the iOS post-build step. |

All coordinates are in Unity's frame. RoomPlan's right-handed values are
mirrored on z in `Core/Scans.cs`. That frame matches the saved ARWorldMap, so
once ARKit relocalizes, the server's world, the AR camera and the scans line up.

## Known gaps (next steps)

- Bags, gear and the vendor exist on the server, but they're only in the web
  client's UI. The Unity HUD has abilities, targeting, quests and the Keeper.
- Guests who are in the host's home (co-located) still join as map players.
  Sharing the ARWorldMap with them is next.
- Worlds aren't stored on the server. The host's phone uploads its world each time
  it opens a room.
- The models are placeholder primitives.
- Android uses no cloud anchors; the two taps line the world up instead.
  Occlusion uses ARCore depth where the phone supports it.
- Solo play needs the server running. A local mode like the web version's isn't
  ported yet.
- Unity's ARKit world-map serialization and the plugin's `NSKeyedArchiver` file
  should be compatible (both archive `ARWorldMap`). This needs confirming on a device.
