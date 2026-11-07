// Materials and placeholder models built from primitives. The materials live in
// Resources (created by Realmgate > Set Up Project) so their shaders are always
// included in the build.
using System.Collections.Generic;
using Realmgate.Core;
using UnityEngine;

namespace Realmgate
{
    public static class Mats
    {
        static Material lit, unlit, transparent, scanWire;
        static readonly Dictionary<(string, Color), Material> cache = new Dictionary<(string, Color), Material>();

        static Material Load(ref Material m, string name)
        {
            if (m == null) m = Resources.Load<Material>($"Realmgate/{name}");
            return m;
        }

        public static Material Lit(Color c) => Tint("Lit", c);
        public static Material Unlit(Color c) => Tint("Unlit", c);
        public static Material Transparent(Color c) => Tint("Transparent", c);
        public static Material ScanWire => Load(ref scanWire, "ScanWire");

        static Material Tint(string kind, Color c)
        {
            if (cache.TryGetValue((kind, c), out var m) && m != null) return m;
            Material baseMat = kind == "Lit" ? Load(ref lit, "Lit") : kind == "Unlit" ? Load(ref unlit, "Unlit") : Load(ref transparent, "Transparent");
            m = new Material(baseMat) { color = c };
            cache[(kind, c)] = m;
            return m;
        }

        public static Color Hex(string hex) => ColorUtility.TryParseHtmlString(hex, out var c) ? c : Color.magenta;
    }

    public static class Models
    {
        public static GameObject Prim(PrimitiveType type, Transform parent, Vector3 pos, Vector3 scale, Material mat, bool collider = false)
        {
            var go = GameObject.CreatePrimitive(type);
            if (!collider) Object.Destroy(go.GetComponent<Collider>());
            go.transform.SetParent(parent, false);
            go.transform.localPosition = pos;
            go.transform.localScale = scale;
            go.GetComponent<Renderer>().sharedMaterial = mat;
            return go;
        }

        static readonly Dictionary<string, string> ClassColors = new Dictionary<string, string>
        {
            { "warrior", "#c79c6e" }, { "mage", "#69ccf0" }, { "ranger", "#abd473" }, { "cleric", "#f0ebe0" },
        };

        public static GameObject Humanoid(string cls)
        {
            var root = new GameObject($"Player ({cls})");
            var c = Mats.Lit(Mats.Hex(ClassColors.TryGetValue(cls, out var hex) ? hex : "#cccccc"));
            var skin = Mats.Lit(Mats.Hex("#e9c3a0"));
            Prim(PrimitiveType.Capsule, root.transform, new Vector3(0, 0.75f, 0), new Vector3(0.45f, 0.55f, 0.3f), c);
            Prim(PrimitiveType.Sphere, root.transform, new Vector3(0, 1.5f, 0), Vector3.one * 0.28f, skin);
            Prim(PrimitiveType.Cube, root.transform, new Vector3(0, 1.52f, 0.13f), new Vector3(0.16f, 0.04f, 0.04f), Mats.Lit(Color.black));
            return root;
        }

        public static GameObject Enemy(string type, float scale, string colorHex)
        {
            var root = new GameObject($"Enemy ({type})");
            var body = new GameObject("Body").transform;
            body.SetParent(root.transform, false);
            var c = Mats.Lit(Mats.Hex(colorHex));
            var eye = Mats.Unlit(Mats.Hex("#ffef5a"));
            switch (type)
            {
                case "wisp":
                    Prim(PrimitiveType.Sphere, body, new Vector3(0, 1.1f, 0), Vector3.one * 0.6f, Mats.Unlit(Mats.Hex(colorHex)));
                    break;
                case "hound":
                    Prim(PrimitiveType.Cube, body, new Vector3(0, 0.55f, 0), new Vector3(0.4f, 0.4f, 0.9f), c);
                    Prim(PrimitiveType.Cube, body, new Vector3(0, 0.7f, 0.55f), new Vector3(0.32f, 0.3f, 0.38f), c);
                    Prim(PrimitiveType.Cube, body, new Vector3(0, 0.76f, 0.75f), new Vector3(0.22f, 0.05f, 0.02f), eye);
                    break;
                case "warden":
                case "colossus":
                    Prim(PrimitiveType.Cube, body, new Vector3(0, 1.25f, 0), new Vector3(0.8f, 0.9f, 0.5f), c);
                    Prim(PrimitiveType.Cube, body, new Vector3(0, 1.9f, 0), new Vector3(0.4f, 0.38f, 0.4f), c);
                    Prim(PrimitiveType.Cube, body, new Vector3(0, 1.92f, 0.21f), new Vector3(0.25f, 0.05f, 0.02f), eye);
                    for (int s = -1; s <= 1; s += 2)
                    {
                        Prim(PrimitiveType.Cube, body, new Vector3(s * 0.22f, 0.4f, 0), new Vector3(0.28f, 0.8f, 0.3f), c);
                        Prim(PrimitiveType.Cube, body, new Vector3(s * 0.56f, 1.15f, 0), new Vector3(0.24f, 0.9f, 0.26f), c);
                    }
                    break;
                default: // imp
                    Prim(PrimitiveType.Sphere, body, new Vector3(0, 0.5f, 0), Vector3.one * 0.7f, c);
                    Prim(PrimitiveType.Sphere, body, new Vector3(0, 0.95f, 0.05f), Vector3.one * 0.44f, c);
                    Prim(PrimitiveType.Cube, body, new Vector3(0, 0.98f, 0.24f), new Vector3(0.2f, 0.04f, 0.02f), eye);
                    break;
            }
            root.transform.localScale = Vector3.one * scale * 1.2f;
            return root;
        }

        public static GameObject Npc(string kind)
        {
            var root = new GameObject(kind == "questgiver" ? "Keeper" : "Pedlar");
            var robe = Mats.Lit(Mats.Hex(kind == "questgiver" ? "#2e4a6b" : "#7a5230"));
            Prim(PrimitiveType.Cylinder, root.transform, new Vector3(0, 0.65f, 0), new Vector3(0.55f, 0.65f, 0.55f), robe);
            Prim(PrimitiveType.Sphere, root.transform, new Vector3(0, 1.42f, 0), Vector3.one * 0.3f, Mats.Lit(Mats.Hex("#e9c3a0")));
            if (kind == "questgiver")
            {
                // the rift behind the Keeper
                var ring = Prim(PrimitiveType.Cylinder, root.transform, new Vector3(0, 0.9f, -0.9f), new Vector3(1.5f, 0.02f, 1.5f), Mats.Transparent(new Color(0.42f, 0.24f, 1f, 0.6f)));
                ring.transform.localRotation = Quaternion.Euler(90, 0, 0);
            }
            return root;
        }

        public static GameObject Pickup(string type)
        {
            var root = new GameObject($"Pickup ({type})");
            var col = Mats.Unlit(Mats.Hex(type == "shard" ? "#7ef9ff" : "#ffb347"));
            var gem = Prim(PrimitiveType.Cube, root.transform, new Vector3(0, 0.3f, 0), new Vector3(0.12f, 0.24f, 0.12f), col);
            gem.transform.localRotation = Quaternion.Euler(0, 45, 45);
            Prim(PrimitiveType.Cylinder, root.transform, new Vector3(0, 0.7f, 0), new Vector3(0.06f, 0.7f, 0.06f), Mats.Transparent(new Color(col.color.r, col.color.g, col.color.b, 0.3f)));
            return root;
        }

        public static GameObject Loot(string rarity)
        {
            var root = new GameObject("Loot");
            Prim(PrimitiveType.Sphere, root.transform, new Vector3(0, 0.1f, 0), Vector3.one * 0.2f, Mats.Lit(Mats.Hex("#8a5a2b")));
            var color = Mats.Hex(RarityColor(rarity));
            Prim(PrimitiveType.Cylinder, root.transform, new Vector3(0, 0.75f, 0), new Vector3(0.08f, 0.75f, 0.08f), Mats.Transparent(new Color(color.r, color.g, color.b, 0.35f)));
            return root;
        }

        public static string RarityColor(string rarity)
        {
            switch (rarity)
            {
                case "poor": return "#9d9d9d";
                case "uncommon": return "#1eff00";
                case "rare": return "#0070dd";
                case "epic": return "#a335ee";
                case "legendary": return "#ff8000";
                case "common": return "#ffffff";
                default: return "#ffd34a";
            }
        }

        // Flat disc on the floor (telegraphs, selection).
        public static GameObject Disc(Transform parent, float radius, Color color)
        {
            var go = Prim(PrimitiveType.Cylinder, parent, Vector3.up * 0.01f, new Vector3(radius * 2, 0.002f, radius * 2), Mats.Transparent(color));
            return go;
        }

        public static Color ThemeColor(string theme)
        {
            switch (theme)
            {
                case Themes.Barracks: return Mats.Hex("#5a4a6b");
                case Themes.Forge: return Mats.Hex("#7a4a2a");
                case Themes.Grotto: return Mats.Hex("#2f5a6b");
                case Themes.Feast: return Mats.Hex("#6b5a2f");
                case Themes.Gloam: return Mats.Hex("#3a3550");
                case Themes.Wilds: return Mats.Hex("#3f6b2f");
                default: return Mats.Hex("#8a6a4a");
            }
        }
    }
}
