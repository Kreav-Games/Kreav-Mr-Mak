# Realmgate AR (working title)

A multiplayer action RPG played in augmented reality on phones. A rift opens on
your real floor. You walk around your room to move and fight, step out of red
attack circles, gather shards from under the sofa, and bring friends to kill the
boss. The structure follows classic MMO conventions: classes with roles, quest
givers, levels, armour and loot rarities.

## Try it

```bash
cd projects/realmgate/game
npm install
npm test            # simulation tests
npm run dev         # game server on :8787 plus the HTTPS client on :5173
```

- **On your phone:** use Android Chrome with ARCore, on the same Wi‑Fi. Open
  `https://<your-computer-ip>:5173` and accept the self-signed certificate.
  Then choose **Play in AR**.
- **On a desktop or iPhone:** choose **Preview (no AR)**. It's the same game with a
  third-person camera, a virtual stick and WASD.
- **Production-style:** `npm start` builds the client and serves the game and the
  WebSocket from one port (8787). WebXR needs HTTPS, so put it behind a TLS
  proxy or tunnel.

To play with friends, one player picks **Create room** and shares the 4-letter code.
The others pick **Join room**, or open `…/?room=CODE`. In one physical room,
everyone places the rift on the same spot, facing the same way.

## What the prototype contains (v0.1)

| Area | Implemented |
| --- | --- |
| AR | WebXR `immersive-ar`, floor hit-test, tap to place the rift, phone position = your character, DOM-overlay HUD, shadows on the real floor. **AR tabletop** mode shrinks the world to 15% with a stick. |
| Multiplayer | Node + WebSocket rooms (max 6). Server-authoritative simulation at 20 Hz, snapshots at 10 Hz. Solo runs the same simulation in the browser. |
| Classes | Warrior (tank, rage, taunt), Mage (ranged, mana, root), Ranger (ranged, focus, slow, self/ally heal), Cleric (healer). Four abilities each, plus cooldowns, a global cooldown, threat and crits. |
| Combat | Every enemy attack is telegraphed as a red floor circle that fills up. **Physically step out to dodge.** Phones vibrate when a circle lands on you. |
| Enemies | Rift Imp, Void Wisp (ranged), Shade Hound, Rift Warden (elite), Rift Colossus (boss, summons imps). They scale with level and party size. |
| Quests | A six-step chain from the Keeper at the rift, plus a daily. Objectives are kill, collect (walk to glowing pickups) and boss. Kill credit is shared by the party. |
| Gear | 8 slots and 6 rarities (Poor → Legendary). Armour types are bound to class (plate, mail, cloth). Items are generated with names and stats. Equipped rarity tints your character's armour. Personal loot bags drop on the floor. |
| Economy | Gold, a vendor (potions; sell gear), 20 bag slots, potions on a shared cooldown. |
| Progression | XP, levels 1–20 and stats from level plus gear. Characters are saved per class on the device. |
| HUD | Unit and party frames, target frame, radar (finds enemies behind you), quest tracker, action bar, XP bar, nameplates, floating combat text, quest/character/vendor panels. |

Code map: `game/shared/data.js` (all tunable content), `game/shared/sim.js`
(rules), `game/server/server.js` (rooms), `game/client/*` (rendering, AR, HUD).
Content is data-driven: new quests, enemies and abilities are mostly entries in
`data.js`.

### Known limits

- No accounts. Saves live in the phone's browser storage, and the server trusts the save.
- Players in one room line up only by placing the rift by hand. There are no shared
  cloud anchors yet.
- The AR path has not been run on a real device in development. Only the preview
  path and the simulation have automated checks.
- The game doesn't know where your furniture is. Enemies can spawn "inside" a sofa.
- iPhone Safari has no WebXR AR, so iPhones get Preview only (see the questions below).
- The models are placeholder primitives, the sound is synthesized beeps, and there is no music.

## Design questions for the owner

See the conversation for the current list. Answers are recorded here as decisions.
