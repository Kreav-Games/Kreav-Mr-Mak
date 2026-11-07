// Renders server snapshots: players, enemies, NPCs, pickups, loot, attack
// telegraphs and nameplates, with smoothing between snapshots. Taps are
// resolved to entities here.
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using UnityEngine;

namespace Realmgate
{
    public class GameView : MonoBehaviour
    {
        class Entity
        {
            public string id, kind;
            public GameObject go;
            public Vector3 target;
            public float facing;
            public Transform plate;
            public TextMesh label;
            public Transform hpFill;
            public GameObject tele;
            public Transform teleFill;
            public float teleLeft, teleDur;
            public bool alive = true;
            public float dyingFor = -1;
        }

        readonly Dictionary<string, Entity> entities = new Dictionary<string, Entity>();
        public string SelfId;
        public bool HideSelf; // only for walk-around play, where the phone is the character
        public Vector3? SelfPos; // locally steered position, drawn without network lag
        public string TargetId;
        // Floor height at a position (zones can sit at different heights: deck, yard).
        public System.Func<float, float, float> FloorAt = (x, z) => 0f;
        public JObject Defs;
        Camera cam;
        GameObject selection;

        public void Init(Camera camera)
        {
            cam = camera;
            selection = Models.Disc(transform, 0.5f, new Color(1f, 0.83f, 0.29f, 0.7f));
            selection.SetActive(false);
        }

        public void SetCamera(Camera camera) => cam = camera;

        public void SetSelfFacing(float yaw)
        {
            if (SelfId != null && entities.TryGetValue(SelfId, out var e)) e.facing = yaw;
        }

        public Vector3 PositionOf(string id) => entities.TryGetValue(id, out var e) ? e.go.transform.position : Vector3.zero;

        public void Apply(Snapshot s)
        {
            var seen = new HashSet<string>();
            foreach (var p in s.players)
            {
                var e = Ensure(p.id, "player", () => Models.Humanoid(p.cls), p.x, p.z, seen);
                e.facing = p.f;
                e.alive = p.alive;
                SetPlate(e, $"{p.name}", p.hp / Mathf.Max(1, p.maxHp), new Color(0.3f, 1f, 0.45f));
                e.go.SetActive(!(HideSelf && p.id == SelfId));
            }
            foreach (var en in s.enemies)
            {
                var def = Defs?["enemies"]?[en.type];
                float scale = def?["scale"]?.Value<float>() ?? 0.5f;
                string color = def?["color"]?.Value<string>() ?? "#e0482f";
                var e = Ensure(en.id, "enemy", () => Models.Enemy(en.type, scale, color), en.x, en.z, seen);
                e.facing = en.f;
                if (e.alive && !en.alive) e.dyingFor = 0;
                e.alive = en.alive;
                SetPlate(e, en.alive ? $"{en.name} {en.level}" : "", en.hp / Mathf.Max(1, en.maxHp), new Color(1f, 0.3f, 0.25f));
                UpdateTelegraph(e, en.wind);
            }
            foreach (var n in s.npcs)
            {
                var e = Ensure(n.id, "npc", () => Models.Npc(n.kind), n.x, n.z, seen);
                SetPlate(e, n.kind == "questgiver" ? "Ysolde <Keeper>" : "Bram <Pedlar>", -1, Color.white);
            }
            foreach (var k in s.pickups) Ensure(k.id, "pickup", () => Models.Pickup(k.type), k.x, k.z, seen);
            foreach (var l in s.loot) Ensure(l.id, "loot", () => Models.Loot(l.rarity), l.x, l.z, seen);

            var gone = new List<string>();
            foreach (var kv in entities) if (!seen.Contains(kv.Key)) gone.Add(kv.Key);
            foreach (var id in gone)
            {
                var e = entities[id];
                if (e.tele) Destroy(e.tele);
                Destroy(e.go);
                entities.Remove(id);
            }
        }

        Entity Ensure(string id, string kind, System.Func<GameObject> build, float x, float z, HashSet<string> seen)
        {
            seen.Add(id);
            if (!entities.TryGetValue(id, out var e))
            {
                var go = build();
                go.transform.SetParent(transform, false);
                go.transform.position = new Vector3(x, FloorAt(x, z), z);
                // One generous collider per entity for tapping on a phone.
                var col = go.AddComponent<CapsuleCollider>();
                col.center = new Vector3(0, 0.8f / Mathf.Max(0.01f, go.transform.localScale.y), 0);
                col.height = 1.6f / Mathf.Max(0.01f, go.transform.localScale.y);
                col.radius = 0.45f / Mathf.Max(0.01f, go.transform.localScale.x);
                go.AddComponent<EntityTag>().Id = id;
                e = new Entity { id = id, kind = kind, go = go };
                entities[id] = e;
            }
            e.target = new Vector3(x, FloorAt(x, z), z);
            return e;
        }

        void SetPlate(Entity e, string text, float hp, Color hpColor)
        {
            if (e.plate == null)
            {
                var plate = new GameObject("Plate").transform;
                plate.SetParent(transform, false);
                var label = new GameObject("Label").AddComponent<TextMesh>();
                label.transform.SetParent(plate, false);
                label.anchor = TextAnchor.LowerCenter;
                label.alignment = TextAlignment.Center;
                label.characterSize = 0.02f;
                label.fontSize = 48;
                label.color = Color.white;
                label.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
                label.GetComponent<MeshRenderer>().sharedMaterial = label.font.material;
                e.label = label;
                if (hp >= 0)
                {
                    Models.Prim(PrimitiveType.Quad, plate, new Vector3(0, -0.05f, 0), new Vector3(0.5f, 0.05f, 1), Mats.Unlit(Color.black));
                    var fill = Models.Prim(PrimitiveType.Quad, plate, new Vector3(0, -0.05f, -0.001f), new Vector3(0.5f, 0.05f, 1), Mats.Unlit(hpColor));
                    e.hpFill = fill.transform;
                }
                e.plate = plate;
            }
            e.label.text = text;
            if (e.hpFill != null)
            {
                float k = Mathf.Clamp01(hp);
                e.hpFill.localScale = new Vector3(0.5f * k, 0.05f, 1);
                e.hpFill.localPosition = new Vector3(-0.25f * (1 - k), -0.05f, -0.001f);
                e.hpFill.parent.gameObject.SetActive(text.Length > 0);
            }
        }

        void UpdateTelegraph(Entity e, Windup w)
        {
            if (w == null)
            {
                if (e.tele) { Destroy(e.tele); e.tele = null; }
                return;
            }
            if (e.tele == null)
            {
                e.tele = new GameObject("Telegraph");
                e.tele.transform.SetParent(transform, false);
                Models.Disc(e.tele.transform, w.r, new Color(1f, 0.15f, 0.1f, 0.25f));
                e.teleFill = Models.Disc(e.tele.transform, w.r, new Color(1f, 0.2f, 0.1f, 0.45f)).transform;
            }
            e.tele.transform.position = new Vector3(w.x, FloorAt(w.x, w.z), w.z);
            e.teleLeft = w.left;
            e.teleDur = Mathf.Max(0.1f, w.dur);
        }

        void Update()
        {
            float dt = Time.deltaTime;
            foreach (var e in entities.Values)
            {
                var t = e.go.transform;
                if (e.id == SelfId && SelfPos.HasValue)
                {
                    var sp = SelfPos.Value;
                    e.target = new Vector3(sp.x, FloorAt(sp.x, sp.z), sp.z);
                    t.position = e.target;
                }
                else t.position = Vector3.Lerp(t.position, e.target, Mathf.Min(1, dt * 10));
                if (e.kind == "player" || e.kind == "enemy")
                    t.rotation = Quaternion.Slerp(t.rotation, Quaternion.Euler(0, e.facing * Mathf.Rad2Deg, 0), Mathf.Min(1, dt * 12));
                if (e.kind == "player" && !e.alive) t.rotation = Quaternion.Euler(-90, t.eulerAngles.y, 0);
                if (e.dyingFor >= 0)
                {
                    e.dyingFor += dt;
                    t.position = new Vector3(t.position.x, e.target.y - Mathf.Min(1.5f, e.dyingFor * 0.4f), t.position.z);
                }
                if (e.tele)
                {
                    e.teleLeft -= dt;
                    float k = 1 - Mathf.Clamp01(e.teleLeft / e.teleDur);
                    e.teleFill.localScale = new Vector3(Mathf.Max(0.01f, k) * e.tele.transform.GetChild(0).localScale.x, 0.002f, Mathf.Max(0.01f, k) * e.tele.transform.GetChild(0).localScale.z);
                }
                if (e.plate)
                {
                    float h = e.kind == "enemy" ? 1.6f * t.localScale.y + 0.25f : e.kind == "npc" ? 1.9f : 1.95f;
                    e.plate.position = t.position + Vector3.up * h;
                    if (cam) e.plate.rotation = Quaternion.LookRotation(e.plate.position - cam.transform.position);
                    e.plate.gameObject.SetActive(e.go.activeSelf);
                }
            }
            if (TargetId != null && entities.TryGetValue(TargetId, out var tgt))
            {
                selection.SetActive(true);
                selection.transform.position = new Vector3(tgt.go.transform.position.x, tgt.target.y + 0.012f, tgt.go.transform.position.z);
                var c = tgt.kind == "enemy" ? new Color(1f, 0.3f, 0.25f, 0.6f) : new Color(0.3f, 1f, 0.45f, 0.6f);
                selection.GetComponent<Renderer>().sharedMaterial = Mats.Transparent(c);
            }
            else selection.SetActive(false);
        }

        // What did the player tap? Returns (id, kind) or null.
        public (string id, string kind)? Pick(Ray ray)
        {
            var hits = Physics.RaycastAll(ray, 60f);
            System.Array.Sort(hits, (a, b) => a.distance.CompareTo(b.distance));
            foreach (var h in hits)
            {
                var tag = h.collider.GetComponentInParent<EntityTag>();
                if (tag != null && tag.Id != SelfId && entities.TryGetValue(tag.Id, out var e)) return (e.id, e.kind);
            }
            return null;
        }

        public string KindOf(string id) => entities.TryGetValue(id, out var e) ? e.kind : null;
    }

    public class EntityTag : MonoBehaviour { public string Id; }
}
