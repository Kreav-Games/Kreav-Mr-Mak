// Realmgate app flow, built entirely from code at startup:
//   Home    -> pick name/class, open a world, make a new world, or join a friend
//   World   -> scan rooms (RoomPlan), halls, or outdoor areas (LiDAR mesh); set the rift
//   Host    -> recognise the home (ARWorldMap), open a room on the server, play in AR
//   Guest   -> join by code and play inside the host's digital twin with a stick
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Realmgate.Core;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.InputSystem;
using UnityEngine.UI;

namespace Realmgate
{
    public class App : MonoBehaviour
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static void Boot()
        {
            if (FindAnyObjectByType<App>() != null) return;
            Application.targetFrameRate = 60;
            Screen.sleepTimeout = SleepTimeout.NeverSleep;
            new GameObject("Realmgate").AddComponent<App>();
        }

        static readonly string[] ClassIds = { "warrior", "mage", "ranger", "cleric" };
        static readonly Dictionary<string, string> ClassNames = new Dictionary<string, string>
        {
            { "warrior", "Warrior · tank" }, { "mage", "Mage · ranged" }, { "ranger", "Ranger · ranged" }, { "cleric", "Cleric · healer" },
        };

        Canvas canvas;
        RectTransform screen;
        ArRig rig;
        World world;

        string playerName;
        string cls;
        string serverUrl;

        // ------------------------------------------------------------- setup ---

        void Start()
        {
            playerName = PlayerPrefs.GetString("realmgate.name", "Adventurer");
            cls = PlayerPrefs.GetString("realmgate.cls", "warrior");
            serverUrl = PlayerPrefs.GetString("realmgate.server", "ws://192.168.1.10:8787/ws");
            canvas = Ui.Canvas();
            ShowHome();
        }

        RectTransform NewScreen(bool opaque = true)
        {
            if (screen) Destroy(screen.gameObject);
            screen = Ui.Fill(canvas.transform, "Screen");
            if (opaque) Ui.Box(screen, new Color(0.08f, 0.07f, 0.11f, 1f));
            return screen;
        }

        RectTransform ScrollColumn(RectTransform parent)
        {
            var view = Ui.Fill(parent, "Scroll");
            var sr = view.gameObject.AddComponent<ScrollRect>();
            view.gameObject.AddComponent<RectMask2D>();
            var content = Ui.Rect(view, "Content", new Vector2(0, 1), new Vector2(1, 1), Vector2.zero, Vector2.zero);
            content.pivot = new Vector2(0.5f, 1);
            var v = content.gameObject.AddComponent<VerticalLayoutGroup>();
            v.spacing = 20; v.padding = new RectOffset(48, 48, 120, 80);
            v.childControlHeight = true; v.childControlWidth = true; v.childForceExpandHeight = false;
            content.gameObject.AddComponent<ContentSizeFitter>().verticalFit = ContentSizeFitter.FitMode.PreferredSize;
            sr.content = content; sr.horizontal = false; sr.viewport = view;
            return content;
        }

        // -------------------------------------------------------------- home ---

        void ShowHome()
        {
            var col = ScrollColumn(NewScreen());
            Ui.Heading(col, "Realmgate", 96, 140);
            Ui.Paragraph(col, "Your world, your way. Scan your home and it becomes the realm.", 38);

            Ui.Heading(col, "You", 48, 80);
            var nameInput = Ui.Input(col, "Your name", playerName);
            nameInput.onEndEdit.AddListener(v => { playerName = string.IsNullOrWhiteSpace(v) ? "Adventurer" : v.Trim(); PlayerPrefs.SetString("realmgate.name", playerName); });
            foreach (var c in ClassIds)
            {
                var id = c;
                Ui.Button(col, (cls == id ? "▶ " : "") + ClassNames[id], () => { cls = id; PlayerPrefs.SetString("realmgate.cls", cls); ShowHome(); }, 100,
                    cls == id ? new Color(0.35f, 0.27f, 0.12f) : (Color?)null);
            }

            Ui.Heading(col, "Your worlds", 48, 80);
            var worlds = WorldStore.All();
            if (!worlds.Any()) Ui.Paragraph(col, "No worlds yet. Make one and scan your first room.");
            foreach (var w in worlds)
            {
                var ww = w;
                Ui.Button(col, $"Play {w.name}  ({w.zones.Count} zone{(w.zones.Count == 1 ? "" : "s")})", () => StartCoroutine(Host(ww)), 120, new Color(0.45f, 0.32f, 0.08f));
                Ui.Button(col, $"Edit {w.name}", () => ShowWorld(ww), 90);
            }
            Ui.Button(col, "+ New world", () =>
            {
                var w = WorldBuilder.NewWorld($"{playerName}'s Home");
                WorldStore.Save(w);
                ShowWorld(w);
            });
            if (!RoomPlanBridge.Supported) Ui.Paragraph(col, "Room scanning needs an iPhone or iPad with LiDAR (iOS 17+). You can still join friends.", 32);

            Ui.Heading(col, "Join a friend", 48, 80);
            var code = Ui.Input(col, "Room code (4 letters)", "");
            Ui.Button(col, "Join their world", () => StartCoroutine(Guest(code.text.Trim().ToUpperInvariant())));

            Ui.Heading(col, "Server", 40, 70);
            var url = Ui.Input(col, "ws://host:8787/ws", serverUrl);
            url.onEndEdit.AddListener(v => { serverUrl = v.Trim(); PlayerPrefs.SetString("realmgate.server", serverUrl); });
        }

        void Message(string title, string body, Action back)
        {
            var col = ScrollColumn(NewScreen());
            Ui.Heading(col, title, 64);
            Ui.Paragraph(col, body);
            Ui.Button(col, "OK", back);
        }

        // ------------------------------------------------------------- world ---

        void ShowWorld(World w)
        {
            world = w;
            var col = ScrollColumn(NewScreen());
            Ui.Heading(col, w.name, 72);
            Ui.Paragraph(col, "Each scan adds a zone. Zones that touch are joined at their doorways. The further a zone is from the rift, the harder it is.");
            foreach (var z in w.zones)
            {
                int links = w.links.Count(l => l.a == z.id || l.b == z.id);
                string hearth = w.hearth?.zone == z.id ? " · rift" : "";
                Ui.Paragraph(col, $"• {z.name} — {Themes.DisplayName(z.theme)} ({z.kind}, {z.objects.Count} objects, {links} doorway{(links == 1 ? "" : "s")}){hearth}", 34);
            }
            if (RoomPlanBridge.Supported)
            {
                Ui.Button(col, "Scan a room", () => ScanRoom(ZoneKind.Room));
                Ui.Button(col, "Scan a hallway", () => ScanRoom(ZoneKind.Hall));
            }
            Ui.Button(col, "Scan an outdoor area (deck, yard)", () => StartCoroutine(ScanArea()));
            if (w.zones.Any()) Ui.Button(col, "Move the rift", () => StartCoroutine(PlaceHearth()));
            if (w.zones.Any()) Ui.Button(col, "Delete last zone", () =>
            {
                w.zones.RemoveAt(w.zones.Count - 1);
                if (w.zones.Count == 0) w.hearth = null; else if (w.zones.All(z => z.id != w.hearth?.zone)) w.hearth = null;
                if (w.zones.Count > 0) WorldBuilder.AddZone(w, w.zones[w.zones.Count - 1]);
                WorldStore.Save(w);
                ShowWorld(w);
            }, 90);
            Ui.Button(col, "Back", ShowHome, 90);
            Ui.Paragraph(col, "Only the shape of your rooms is saved, on this device. No photos are kept. Guests see the shapes only while you host.", 30);
        }

        void ScanRoom(string kind)
        {
            EnsureRig();
            rig.SetSessionRunning(false); // RoomPlan runs its own ARSession
            var existing = WorldStore.HasMap(world) ? WorldStore.MapPath(world) : "";
            NewScreen();
            RoomPlanBridge.Start(WorldStore.Folder(world), existing, result =>
            {
                if (!result.ok)
                {
                    if (result.error == "cancelled") ShowWorld(world);
                    else Message("Scan failed", result.error, () => ShowWorld(world));
                    return;
                }
                try
                {
                    var room = result.rooms[0];
                    string id = $"z{world.zones.Count + 1}-{DateTime.UtcNow.Ticks % 100000}";
                    string name = kind == ZoneKind.Hall ? $"Hallway {world.zones.Count(z => z.kind == ZoneKind.Hall) + 1}" : RoomName(room, world);
                    var zone = RoomPlanImport.ToZone(room, id, name);
                    zone.kind = kind;
                    zone.theme = Themes.ForSection(room.sections.FirstOrDefault(), kind);
                    WorldBuilder.AddZone(world, zone);
                    WorldStore.Save(world);
                    ShowWorld(world);
                }
                catch (Exception e) { Message("Scan failed", e.Message, () => ShowWorld(world)); }
            });
        }

        static string RoomName(RoomPlanRoom room, World w)
        {
            var s = room.sections.FirstOrDefault();
            string nice = s switch
            {
                "livingRoom" => "Living room", "bedroom" => "Bedroom", "kitchen" => "Kitchen",
                "bathroom" => "Bathroom", "diningRoom" => "Dining room", _ => "Room",
            };
            int n = w.zones.Count(z => z.name.StartsWith(nice)) + 1;
            return n > 1 ? $"{nice} {n}" : nice;
        }

        // Outdoor and open areas: relocalize (if the world has a map), then walk
        // the space while LiDAR measures the ground and obstacles.
        IEnumerator ScanArea()
        {
            EnsureRig();
            rig.SetSessionRunning(true);
            var s = NewScreen(false);
            var status = Ui.Label(Ui.Rect(s, "Status", new Vector2(0, 0.75f), new Vector2(1, 0.95f), new Vector2(40, 0), new Vector2(-40, 0)), "", 40, TextAnchor.MiddleCenter);
            if (WorldStore.HasMap(world))
            {
                string err = null;
                yield return rig.LoadWorldMap(WorldStore.MapPath(world), e => err = e);
                if (err != null) { Message("Could not load your world", err, () => ShowWorld(world)); yield break; }
                status.text = "Look at a part of your home you already scanned, so this area lines up with it…";
                yield return WaitRelocalized();
            }
            rig.BeginAreaScan();
            bool done = false, cancel = false;
            status.text = "Walk the area slowly with the phone pointed at the ground and anything you'd bump into. Tap Done when finished.";
            var buttons = Ui.Rect(s, "Buttons", new Vector2(0, 0), new Vector2(1, 0.12f), new Vector2(40, 40), new Vector2(-40, 0));
            var h = buttons.gameObject.AddComponent<HorizontalLayoutGroup>();
            h.spacing = 30; h.childForceExpandWidth = true; h.childControlWidth = true;
            Ui.Button(buttons, "Cancel", () => cancel = true);
            Ui.Button(buttons, "Done", () => done = true, 120, new Color(0.45f, 0.32f, 0.08f));
            while (!done && !cancel) yield return null;
            if (cancel) { rig.EndAreaScanDiscard(); rig.SetSessionRunning(false); ShowWorld(world); yield break; }
            try
            {
                int n = world.zones.Count(z => z.kind == ZoneKind.Outdoor) + 1;
                var zone = rig.EndAreaScan($"z{world.zones.Count + 1}-{DateTime.UtcNow.Ticks % 100000}", n > 1 ? $"Outdoors {n}" : "Outdoors", ZoneKind.Outdoor);
                WorldBuilder.AddZone(world, zone);
            }
            catch (Exception e) { Message("Scan failed", e.Message, () => ShowWorld(world)); rig.SetSessionRunning(false); yield break; }
            status.text = "Saving…";
            string saveErr = null;
            yield return rig.SaveWorldMap(WorldStore.MapPath(world), e => saveErr = e);
            WorldStore.Save(world);
            rig.SetSessionRunning(false);
            if (saveErr != null) Message("Saved, but…", $"The area was added, but the map could not be updated: {saveErr}", () => ShowWorld(world));
            else ShowWorld(world);
        }

        IEnumerator PlaceHearth()
        {
            if (!WorldStore.HasMap(world)) { Message("Scan first", "Scan a room before placing the rift.", () => ShowWorld(world)); yield break; }
            EnsureRig();
            rig.SetSessionRunning(true);
            string err = null;
            yield return rig.LoadWorldMap(WorldStore.MapPath(world), e => err = e);
            if (err != null) { Message("Could not load your world", err, () => ShowWorld(world)); yield break; }
            var s = NewScreen(false);
            var status = Ui.Label(Ui.Rect(s, "Status", new Vector2(0, 0.75f), new Vector2(1, 0.95f), new Vector2(40, 0), new Vector2(-40, 0)), "Look around your home until it is recognised…", 40, TextAnchor.MiddleCenter);
            yield return WaitRelocalized();
            var twin = TwinBuilder.Build(world, true);
            status.text = "Tap the floor where the rift should open.";
            while (true)
            {
                yield return null;
                var p = Pointer.current;
                if (p == null || !p.press.wasPressedThisFrame) continue;
                if (rig.FloorHit(p.position.ReadValue(), out var hit) && WorldBuilder.ZoneAt(world, hit.x, hit.z) != null)
                {
                    WorldBuilder.SetHearth(world, hit.x, hit.z);
                    break;
                }
                status.text = "That spot is outside your scanned zones. Tap inside a scanned room.";
            }
            Destroy(twin);
            WorldStore.Save(world);
            rig.SetSessionRunning(false);
            ShowWorld(world);
        }

        void EnsureRig()
        {
            if (rig == null) rig = ArRig.Create();
        }

        IEnumerator WaitRelocalized()
        {
            float normal = 0;
            while (normal < 1f)
            {
                normal = rig.Relocalizing || UnityEngine.XR.ARFoundation.ARSession.state != UnityEngine.XR.ARFoundation.ARSessionState.SessionTracking ? 0 : normal + Time.deltaTime;
                yield return null;
            }
        }

        // -------------------------------------------------------------- play ---

        NetClient net;
        GameView view;
        Snapshot snap;
        PrivateState me;
        JObject defs;
        string selfId, roomCode;
        bool twinMode;
        Camera twinCam;
        GameObject twinRoot;
        Vector3 selfPos;
        float facing, camYaw, lastMoveSent;
        Stick stick;
        Text hudTop, hudTarget, hudQuests, hudToast;
        RectTransform dialog;
        float toastUntil;
        readonly Dictionary<string, Button> abilityButtons = new Dictionary<string, Button>();

        IEnumerator Host(World w)
        {
            world = w;
            if (!w.zones.Any() || !WorldStore.HasMap(w)) { Message("Scan first", "This world has no scanned rooms yet.", () => ShowWorld(w)); yield break; }
            EnsureRig();
            rig.SetSessionRunning(true);
            string err = null;
            yield return rig.LoadWorldMap(WorldStore.MapPath(w), e => err = e);
            if (err != null) { Message("Could not load your world", err, ShowHome); yield break; }
            var s = NewScreen(false);
            Ui.Label(Ui.Rect(s, "Status", new Vector2(0, 0.4f), new Vector2(1, 0.6f), new Vector2(40, 0), new Vector2(-40, 0)),
                $"Look around {w.zones.First(z => z.id == w.hearth.zone).name} until it is recognised…", 44, TextAnchor.MiddleCenter);
            yield return WaitRelocalized();
            twinMode = false;
            yield return Connect(new JObject
            {
                ["t"] = "hello", ["name"] = playerName, ["cls"] = cls, ["mode"] = "ar", ["create"] = true, ["room"] = "",
                ["defs"] = true, ["world"] = JObject.FromObject(w), ["save"] = SavedCharacter(),
            });
        }

        IEnumerator Guest(string code)
        {
            if (code.Length != 4) { Message("Room code", "Ask your friend for their 4-letter room code.", ShowHome); yield break; }
            twinMode = true;
            yield return Connect(new JObject
            {
                ["t"] = "hello", ["name"] = playerName, ["cls"] = cls, ["mode"] = "twin", ["room"] = code, ["defs"] = true, ["save"] = SavedCharacter(),
            });
        }

        JToken SavedCharacter()
        {
            var json = WorldStore.LoadCharacter(cls);
            try { return string.IsNullOrEmpty(json) ? null : JToken.Parse(json); } catch { return null; }
        }

        IEnumerator Connect(JObject hello)
        {
            NewScreen();
            net?.Dispose();
            net = new NetClient();
            var task = net.ConnectAsync(serverUrl);
            while (!task.IsCompleted) yield return null;
            if (task.IsFaulted) { Message("Can't reach the server", $"{serverUrl}\n{task.Exception?.GetBaseException().Message}", ShowHome); yield break; }
            net.Send(hello);
            float timeout = Time.time + 8;
            JObject welcome = null;
            while (welcome == null && Time.time < timeout)
            {
                while (net.TryReceive(out var m))
                {
                    if ((string)m["t"] == "welcome") { welcome = m; break; }
                    if ((string)m["t"] == "error" || (string)m["t"] == "closed") { Message("Couldn't join", (string)m["text"] ?? "The server closed the connection.", ShowHome); yield break; }
                }
                yield return null;
            }
            if (welcome == null) { Message("Couldn't join", "The server did not answer.", ShowHome); yield break; }
            selfId = (string)welcome["id"];
            roomCode = (string)welcome["room"];
            defs = welcome["defs"] as JObject;
            var worldJson = welcome["world"] as JObject;
            if (worldJson != null) world = worldJson.ToObject<World>();
            StartGame();
        }

        void StartGame()
        {
            var root = new GameObject("Game");
            view = root.AddComponent<GameView>();
            view.SelfId = selfId;
            view.Defs = defs;
            view.HideSelf = !twinMode;
            view.FloorAt = (x, z) =>
            {
                var id = world != null ? WorldBuilder.ZoneAt(world, x, z) : null;
                return id != null ? world.zones.First(zz => zz.id == id).floorY : (world?.zones.FirstOrDefault()?.floorY ?? 0f);
            };
            Camera cam;
            if (twinMode)
            {
                rig?.SetSessionRunning(false);
                twinRoot = world != null ? TwinBuilder.Build(world, false) : null;
                var camGo = new GameObject("Twin Camera") { tag = "MainCamera" };
                twinCam = camGo.AddComponent<Camera>();
                twinCam.clearFlags = CameraClearFlags.SolidColor;
                twinCam.backgroundColor = new Color(0.11f, 0.09f, 0.15f);
                var light = new GameObject("Sun").AddComponent<Light>();
                light.type = LightType.Directional;
                light.transform.rotation = Quaternion.Euler(50, 30, 0);
                cam = twinCam;
                if (world?.hearth != null) selfPos = new Vector3(world.hearth.x, 0, world.hearth.z + 1);
            }
            else
            {
                cam = rig.Camera;
                var light = new GameObject("Sun").AddComponent<Light>();
                light.type = LightType.Directional;
                light.transform.rotation = Quaternion.Euler(50, 30, 0);
            }
            view.Init(cam);
            BuildHud();
        }

        void BuildHud()
        {
            var s = NewScreen(false);
            hudTop = Ui.Label(Ui.Rect(s, "Top", new Vector2(0, 0.86f), new Vector2(0.6f, 1), new Vector2(30, 0), new Vector2(0, -60)), "", 36);
            hudTarget = Ui.Label(Ui.Rect(s, "Target", new Vector2(0.4f, 0.86f), new Vector2(1, 1), new Vector2(0, 0), new Vector2(-30, -60)), "", 36, TextAnchor.UpperRight);
            hudQuests = Ui.Label(Ui.Rect(s, "Quests", new Vector2(0.5f, 0.55f), new Vector2(1, 0.85f), new Vector2(0, 0), new Vector2(-30, 0)), "", 32, TextAnchor.UpperRight, Ui.Gold);
            hudToast = Ui.Label(Ui.Rect(s, "Toast", new Vector2(0, 0.45f), new Vector2(1, 0.55f), new Vector2(40, 0), new Vector2(-40, 0)), "", 40, TextAnchor.MiddleCenter);

            var bar = Ui.Rect(s, "Abilities", new Vector2(0, 0), new Vector2(1, 0), new Vector2(30, 40), new Vector2(-30, 200));
            var h = bar.gameObject.AddComponent<HorizontalLayoutGroup>();
            h.spacing = 16; h.childControlWidth = true; h.childForceExpandWidth = true; h.childControlHeight = true;
            abilityButtons.Clear();
            Ui.Button(bar, "Target", NextTarget, 160);
            var classDef = defs?["classes"]?[cls];
            foreach (var ab in classDef?["abilities"]?.Values<string>() ?? Enumerable.Empty<string>())
            {
                var id = ab;
                var name = (string)defs["abilities"][id]["name"];
                abilityButtons[id] = Ui.Button(bar, name.Replace(' ', '\n'), () => Cast(id), 160);
                abilityButtons[id].GetComponentInChildren<Text>().fontSize = 30;
            }
            Ui.Button(bar, "Potion", DrinkPotion, 160);

            var leave = Ui.Rect(s, "Leave", new Vector2(0.75f, 0.8f), new Vector2(1, 0.85f), new Vector2(0, 0), new Vector2(-30, 0));
            Ui.Button(leave, "Leave", Leave, 80);
            if (twinMode) stick = Stick.Create(s);
            Toast(roomCode != null ? $"Room {roomCode} — share this code" : "");
        }

        void Toast(string text, float secs = 3)
        {
            if (hudToast == null) return;
            hudToast.text = text;
            toastUntil = Time.time + secs;
        }

        void Update()
        {
            if (net == null || view == null) return;
            while (net.TryReceive(out var m)) OnMessage(m);
            if (hudToast != null && Time.time > toastUntil) hudToast.text = "";
            if (snap == null) return;
            UpdateMovement();
            HandleTap();
            UpdateHud();
        }

        void OnMessage(JObject m)
        {
            switch ((string)m["t"])
            {
                case "snap":
                    snap = m["s"].ToObject<Snapshot>();
                    if (snap.me != null)
                    {
                        me = snap.me;
                        SaveCharacter();
                    }
                    view.Apply(snap);
                    foreach (var ev in snap.events ?? Array.Empty<JObject>()) OnEvent(ev);
                    if (twinMode)
                    {
                        var self = snap.players.FirstOrDefault(p => p.id == selfId);
                        if (self != null && (new Vector2(self.x - selfPos.x, self.z - selfPos.z).magnitude > 0.75f || !self.alive)) selfPos = new Vector3(self.x, 0, self.z);
                    }
                    break;
                case "save":
                    if (m["save"] != null && m["save"].Type != JTokenType.Null) WorldStore.SaveCharacter(cls, m["save"].ToString(Formatting.None));
                    break;
                case "closed":
                    Message("Disconnected", net.Error ?? "The connection to the world was lost.", Leave);
                    break;
            }
        }

        void SaveCharacter()
        {
            var self = snap.players.FirstOrDefault(p => p.id == selfId);
            if (self == null || me == null) return;
            var save = new JObject
            {
                ["v"] = 1, ["name"] = playerName, ["cls"] = cls, ["level"] = self.level, ["xp"] = me.xp, ["gold"] = me.gold,
                ["equipment"] = me.equipment, ["bag"] = me.bag, ["quests"] = JObject.FromObject(me.quests ?? new Dictionary<string, QuestState>()),
            };
            WorldStore.SaveCharacter(cls, save.ToString(Formatting.None));
        }

        void OnEvent(JObject ev)
        {
            string type = (string)ev["type"];
            string to = (string)ev["to"];
            if (to != null && to != selfId) return;
            switch (type)
            {
                case "error": Toast((string)ev["text"], 2); break;
                case "quest": case "banner": Toast((string)ev["text"], 3.5f); break;
                case "levelup": if ((string)ev["id"] == selfId) Toast($"Level {(int)ev["level"]}!", 3); break;
                case "looted": if (ev["item"] != null && ev["item"].Type != JTokenType.Null) Toast($"Looted {(string)ev["item"]}", 2.5f); break;
                case "join": if ((string)ev["id"] != selfId) Toast($"{(string)ev["name"]} entered your world", 3); break;
                case "telegraph":
                    var self = snap.players.FirstOrDefault(p => p.id == selfId);
                    if (self != null && Mathf.Hypot(self.x - (float)ev["x"], self.z - (float)ev["z"]) <= (float)ev["r"]) Handheld.Vibrate();
                    break;
            }
        }

        void UpdateMovement()
        {
            bool moved = false;
            if (!twinMode)
            {
                var p = rig.CameraPosition;
                selfPos = new Vector3(p.x, 0, p.z);
                facing = rig.CameraYaw;
                moved = true;
            }
            else
            {
                var self = snap.players.FirstOrDefault(pp => pp.id == selfId);
                bool rooted = self == null || !self.alive || (self.buffs != null && self.buffs.Contains("root"));
                var v = stick ? stick.Value : Vector2.zero;
                var kb = Keyboard.current;
                if (kb != null)
                {
                    if (kb.wKey.isPressed) v.y += 1;
                    if (kb.sKey.isPressed) v.y -= 1;
                    if (kb.aKey.isPressed) v.x -= 1;
                    if (kb.dKey.isPressed) v.x += 1;
                    v = Vector2.ClampMagnitude(v, 1);
                }
                if (!rooted && v.sqrMagnitude > 0.01f)
                {
                    var fwd = new Vector3(Mathf.Sin(camYaw), 0, Mathf.Cos(camYaw));
                    var right = new Vector3(fwd.z, 0, -fwd.x);
                    var dir = fwd * v.y + right * v.x;
                    selfPos += dir * 1.6f * Time.deltaTime;
                    facing = Mathf.Atan2(dir.x, dir.z);
                    moved = true;
                    camYaw = Mathf.LerpAngle(camYaw * Mathf.Rad2Deg, facing * Mathf.Rad2Deg, Time.deltaTime * 1.5f) * Mathf.Deg2Rad;
                }
                // third-person camera
                float floor = view.FloorAt(selfPos.x, selfPos.z);
                var target = new Vector3(selfPos.x, floor + 1.0f, selfPos.z);
                var back = new Vector3(-Mathf.Sin(camYaw), 0, -Mathf.Cos(camYaw));
                twinCam.transform.position = target + back * 4.5f + Vector3.up * 3.2f;
                twinCam.transform.LookAt(target);
            }
            if (moved && Time.time - lastMoveSent > 0.066f)
            {
                lastMoveSent = Time.time;
                net.Send(new { t = "move", x = selfPos.x, z = selfPos.z, facing });
            }
        }

        void HandleTap()
        {
            var p = Pointer.current;
            if (p == null || !p.press.wasPressedThisFrame) return;
            var pos = p.position.ReadValue();
            if (OverUi(pos)) return;
            var cam = twinMode ? twinCam : rig.Camera;
            var hit = view.Pick(cam.ScreenPointToRay(pos));
            if (hit == null) return;
            var (id, kind) = hit.Value;
            if (kind == "enemy" || kind == "player") SetTarget(id);
            else if (kind == "loot") net.Send(new { t = "loot", id });
            else if (kind == "npc") { if (id == "keeper") ShowKeeper(); else Toast("Bram trades from the web client for now.", 2.5f); }
            else if (kind == "pickup") Toast("Walk over it to pick it up", 2);
        }

        static bool OverUi(Vector2 pos)
        {
            if (EventSystem.current == null) return false;
            var results = new List<RaycastResult>();
            EventSystem.current.RaycastAll(new PointerEventData(EventSystem.current) { position = pos }, results);
            return results.Count > 0;
        }

        void SetTarget(string id)
        {
            view.TargetId = id;
            net.Send(new { t = "target", id });
        }

        void NextTarget()
        {
            var alive = snap.enemies.Where(e => e.alive).OrderBy(e => Mathf.Hypot(e.x - selfPos.x, e.z - selfPos.z)).ToList();
            if (!alive.Any()) { Toast("No enemies nearby", 1.5f); return; }
            int i = alive.FindIndex(e => e.id == view.TargetId);
            SetTarget(alive[(i + 1) % alive.Count].id);
        }

        void Cast(string ability)
        {
            var ab = defs["abilities"][ability];
            if ((string)ab["target"] == "enemy" && !snap.enemies.Any(e => e.id == view.TargetId && e.alive)) NextTarget();
            net.Send(new { t = "cast", ability, target = view.TargetId });
        }

        void DrinkPotion()
        {
            if (me?.bag == null) return;
            int idx = -1;
            for (int i = 0; i < me.bag.Count; i++) if ((string)me.bag[i]["kind"] == "consumable") { idx = i; break; }
            if (idx < 0) { Toast("No potions left", 2); return; }
            net.Send(new { t = "use", index = idx });
        }

        void ShowKeeper()
        {
            if (dialog) Destroy(dialog.gameObject);
            dialog = Ui.Rect(screen, "Keeper", new Vector2(0.05f, 0.25f), new Vector2(0.95f, 0.8f), Vector2.zero, Vector2.zero);
            Ui.Box(dialog, Ui.Panel);
            var col = Ui.Column(dialog, "Col", 14);
            Ui.Heading(col, "Ysolde, Keeper of the Threshold", 46, 80);
            bool any = false;
            foreach (var q in defs["quests"])
            {
                string qid = (string)q["id"];
                QuestState st = null;
                me?.quests?.TryGetValue(qid, out st);
                if (st?.state == "done") { any = true; Ui.Button(col, $"Complete: {(string)q["name"]}", () => { net.Send(new { t = "turnin", id = qid }); CloseDialog(); }, 100, new Color(0.45f, 0.32f, 0.08f)); }
                else if (me?.available != null && me.available.Contains(qid))
                {
                    any = true;
                    Ui.Paragraph(col, (string)q["text"], 30);
                    Ui.Button(col, $"Accept: {(string)q["name"]}", () => { net.Send(new { t = "accept", id = qid }); CloseDialog(); }, 100);
                }
            }
            if (!any) Ui.Paragraph(col, "Nothing new for now. Finish what you carry, or come back stronger.");
            Ui.Button(col, "Close", CloseDialog, 90);
        }

        void CloseDialog() { if (dialog) Destroy(dialog.gameObject); }

        void UpdateHud()
        {
            var self = snap.players.FirstOrDefault(p => p.id == selfId);
            if (self == null) return;
            string zone = world != null ? world.zones.FirstOrDefault(z => z.id == WorldBuilder.ZoneAt(world, selfPos.x, selfPos.z))?.name : null;
            hudTop.text = $"<b>{self.name}</b>  lvl {self.level}\nHP {Mathf.RoundToInt(self.hp)}/{self.maxHp}   {Mathf.RoundToInt(self.res)}/{self.maxRes}\n{(zone ?? "Outside your world")}{(roomCode != null ? $"   ·   Room {roomCode}" : "")}{(self.alive ? "" : "\n<color=#ff6a5a>You have fallen…</color>")}";
            var enemy = snap.enemies.FirstOrDefault(e => e.id == view.TargetId && e.alive);
            var ally = snap.players.FirstOrDefault(p => p.id == view.TargetId);
            hudTarget.text = enemy != null ? $"<b>{enemy.name}</b> {enemy.level}\nHP {Mathf.RoundToInt(enemy.hp)}/{enemy.maxHp}"
                : ally != null ? $"<b>{ally.name}</b>\nHP {Mathf.RoundToInt(ally.hp)}/{ally.maxHp}" : "";
            var lines = new List<string>();
            if (me?.quests != null)
                foreach (var kv in me.quests)
                {
                    if (kv.Value.state != "active" && kv.Value.state != "done") continue;
                    var q = defs["quests"].FirstOrDefault(x => (string)x["id"] == kv.Key);
                    if (q == null) continue;
                    lines.Add($"<b>{(string)q["name"]}</b>");
                    if (kv.Value.state == "done") lines.Add("Return to the Keeper");
                    else
                    {
                        var objs = q["objectives"].ToArray();
                        for (int i = 0; i < objs.Length; i++) lines.Add($"{(string)objs[i]["target"]}: {kv.Value.progress[i]}/{(int)objs[i]["count"]}");
                    }
                }
            if (lines.Count == 0 && me?.available?.Length > 0) lines.Add("Tap the Keeper for a quest");
            hudQuests.text = string.Join("\n", lines);
            foreach (var kv in abilityButtons)
            {
                float cd = snap.cds != null && snap.cds.TryGetValue(kv.Key, out var c) ? c : 0;
                int cost = (int?)defs["abilities"][kv.Key]["cost"] ?? 0;
                kv.Value.interactable = cd <= 0.05f && self.res >= cost && self.alive;
            }
        }

        void Leave()
        {
            net?.Dispose();
            net = null;
            if (view) Destroy(view.gameObject);
            if (twinRoot) Destroy(twinRoot);
            if (twinCam) Destroy(twinCam.gameObject);
            foreach (var l in FindObjectsByType<Light>(FindObjectsSortMode.None)) Destroy(l.gameObject);
            rig?.SetSessionRunning(false);
            view = null; snap = null; me = null; stick = null;
            ShowHome();
        }

        void OnApplicationPause(bool paused)
        {
            if (paused && snap != null) SaveCharacter();
        }

        void OnDestroy() => net?.Dispose();
    }
}
