# Realmgate — Unity client (iOS, LiDAR first)

The native app for scanned worlds ([world-design.md](../world-design.md)). The
host scans their home on a LiDAR iPhone or iPad and plays in it in AR. Remote
guests join with a room code and play inside a digital twin of the host's home.
The game rules and multiplayer stay on the Node server in `../game`.

> **Status: written but never opened in Unity.** It has not been compiled in the
> editor or run on a device. The Unity editor can't run in the development
> container. Expect a first pass of compile fixes when you open it. These parts
> **are** compiled and tested: the core world logic (`Assets/Realmgate/Core`, 8
> tests with `dotnet test`) and the server side of scanned worlds (`../game`, 12
> tests plus a WebSocket check of host and guest).

## What you need

- A Mac with Xcode 15 or later, and Unity 6 LTS with iOS Build Support.
- An iPhone 12 Pro or later Pro model, or an iPad Pro with LiDAR, on iOS 17 or later.
- The game server running on your network: `cd ../game && npm install && npm run server`.

## First open

1. In Unity Hub, choose **Add → Add project from disk** and pick `unity/Realmgate`.
   Then open it with Unity 6 LTS. Unity resolves the packages in
   `Packages/manifest.json` (AR Foundation, ARKit, Input System, Newtonsoft
   JSON). If Package Manager offers newer 6.x versions of AR Foundation or ARKit,
   take them.
2. If the Input System asks to enable the new input backend, choose **Yes**.
3. Open **Project Settings → XR Plug-in Management** once, so its settings exist.
4. Run **Realmgate → Set Up Project**. It does the following:
   - creates the materials in `Resources`;
   - creates an empty boot scene and adds it to the build;
   - sets iOS 17, IL2CPP, portrait and the camera permission text;
   - enables ARKit.
5. Switch the platform to iOS and build. Open the Xcode project, set your signing
   team and run on the device. The post-build step links `RoomPlan.framework` and
   sets Swift.
6. In the app, under **Server**, enter `ws://<your-mac-ip>:8787/ws`.

## How it plays

| Screen | What happens |
| --- | --- |
| Home | Choose a name and class. Play or edit a world, make a new world, or join a friend's room code. |
| World | **Scan a room** or **Scan a hallway** opens Apple's RoomPlan scanner. **Scan an outdoor area** walks a deck or yard with the LiDAR mesh. **Move the rift** places the hearth where you tap. |
| Host (AR) | The app recognises your home from the saved ARKit map. Then it opens a room on the server and you play in AR. Real walls and furniture hide monsters (LiDAR occlusion). |
| Guest (twin) | Join with a code. The host's scanned rooms are rebuilt as a 3D level. Move with the on-screen stick (or WASD), and tap to target. |

## Code map

| Path | Role |
| --- | --- |
| `Assets/Realmgate/Core/` | No Unity dependency. World format (same as the server's), geometry, RoomPlan and area-scan import, zone linking, themes. |
| `Assets/Plugins/iOS/RealmgateRoomPlan.swift` | RoomPlan capture. Saves the ARWorldMap, relocalizes before adding a room, and returns the room as JSON. |
| `Assets/Realmgate/Runtime/ArRig.cs` | AR session, camera, planes, LiDAR mesh, occlusion, world-map save and load, area scans. |
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
- Guests who are in the host's home (co-located) still join as twin players.
  Sharing the ARWorldMap with them is next.
- Worlds aren't stored on the server. The host's phone uploads its world each time
  it opens a room.
- The models are placeholder primitives.
- Android (ARCore depth and Cloud Anchors) isn't wired up. The ARKit-only code is
  behind `#if UNITY_IOS`.
- Unity's ARKit world-map serialization and the plugin's `NSKeyedArchiver` file
  should be compatible (both archive `ARWorldMap`). This needs confirming on a device.
