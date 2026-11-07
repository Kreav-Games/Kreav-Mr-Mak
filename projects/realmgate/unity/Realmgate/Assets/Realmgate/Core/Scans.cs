// Turning raw scans into zones.
//   RoomPlanImport: the iOS RoomPlan plugin's output (ARKit right-handed frame)
//   AreaScanImport: LiDAR floor plane + scene mesh (decks, yards, open areas)
//   WorldBuilder:   adds a zone to a world, links doorways, picks a hearth
using System;
using System.Collections.Generic;
using System.Linq;

namespace Realmgate.Core
{
    // ---------------------------------------------------------------- DTOs ---
    // Written by Assets/Plugins/iOS/RealmgateRoomPlan.swift. Matrices are
    // simd_float4x4 in column-major order, in ARKit's right-handed frame.

    [Serializable]
    public class RoomPlanResult
    {
        public bool ok;
        public string error;
        public string worldMapPath;
        public List<RoomPlanRoom> rooms = new List<RoomPlanRoom>();
    }

    [Serializable]
    public class RoomPlanRoom
    {
        public List<string> sections = new List<string>(); // livingRoom, bedroom, kitchen, ...
        public List<RoomPlanItem> floors = new List<RoomPlanItem>();
        public List<RoomPlanItem> walls = new List<RoomPlanItem>();
        public List<RoomPlanItem> doors = new List<RoomPlanItem>();
        public List<RoomPlanItem> openings = new List<RoomPlanItem>();
        public List<RoomPlanItem> windows = new List<RoomPlanItem>();
        public List<RoomPlanItem> objects = new List<RoomPlanItem>();
    }

    [Serializable]
    public class RoomPlanItem
    {
        public string category; // objects only
        public float[] t; // 16 floats, column-major transform
        public float[] dim; // width (x), height (y), depth (z)
        public List<float[]> corners; // floors: world-space corners [x, y, z]
    }

    public static class Frames
    {
        // ARKit/RoomPlan is right-handed, Unity left-handed: mirror z.
        public static (float x, float y, float z) Position(float[] t) => (t[12], t[13], -t[14]);

        // Yaw of the item's local x axis, in Unity's convention.
        public static float Yaw(float[] t)
        {
            // column 0 is the local x axis; mirrored z becomes (x, y, -z)
            float ax = t[0], az = -t[2];
            return MathF.Atan2(-az, ax);
        }

        public static V2 Corner(float[] c) => new V2(c[0], -c[2]);
    }

    public static class RoomPlanImport
    {
        public static Zone ToZone(RoomPlanRoom room, string id, string name)
        {
            var zone = new Zone { id = id, name = name, kind = ZoneKind.Room };
            zone.theme = Themes.ForSection(room.sections.FirstOrDefault(), ZoneKind.Room);

            foreach (var w in room.walls)
            {
                var (x, _, z) = Frames.Position(w.t);
                float yaw = Frames.Yaw(w.t);
                var dir = new V2(MathF.Cos(yaw), -MathF.Sin(yaw)) * (w.dim[0] / 2f);
                var c = new V2(x, z);
                zone.walls.Add(new Wall { a = (c - dir).ToArray(), b = (c + dir).ToArray(), h = w.dim[1], t = 0.1f });
            }

            void AddOpenings(List<RoomPlanItem> items, string kind)
            {
                foreach (var o in items)
                {
                    var (x, y, z) = Frames.Position(o.t);
                    zone.openings.Add(new Opening { kind = kind, x = x, y = y, z = z, w = o.dim[0], h = o.dim[1], yaw = Frames.Yaw(o.t) });
                }
            }
            AddOpenings(room.doors, "door");
            AddOpenings(room.openings, "opening");
            AddOpenings(room.windows, "window");

            foreach (var o in room.objects)
            {
                var (x, y, z) = Frames.Position(o.t);
                zone.objects.Add(new WorldObject { cat = o.category ?? "storage", x = x, y = y, z = z, w = o.dim[0], h = o.dim[1], d = o.dim[2], yaw = Frames.Yaw(o.t) });
            }

            // Floor outline: RoomPlan's floor polygon (iOS 17), else the hull of the walls.
            List<V2> outline = null;
            var floor = room.floors.OrderByDescending(f => f.corners?.Count ?? 0).FirstOrDefault();
            if (floor?.corners != null && floor.corners.Count >= 3)
            {
                outline = floor.corners.Select(Frames.Corner).ToList();
                zone.floorY = floor.corners.Average(c => c[1]);
            }
            else if (zone.walls.Count >= 2)
            {
                outline = Geometry.ConvexHull(zone.walls.SelectMany(w => new[] { V2.From(w.a), V2.From(w.b) }));
                zone.floorY = room.walls.Min(w => w.t[13] - w.dim[1] / 2f);
            }
            if (outline == null || outline.Count < 3) throw new InvalidOperationException("The scan has no floor or walls.");
            zone.floor = Geometry.Simplify(outline, 0.05f).Select(p => p.ToArray()).ToList();
            return zone;
        }
    }

    // LiDAR area scan for spaces RoomPlan can't read (decks, yards): the floor
    // is the hull of the detected ground plane, and obstacles are scene-mesh
    // points between knee and head height, grouped into boxes.
    public static class AreaScanImport
    {
        public const float Cell = 0.3f;

        public static Zone ToZone(IReadOnlyList<V2> floorPoints, IReadOnlyList<(float x, float y, float z)> meshPoints,
            float floorY, string id, string name, string kind)
        {
            var hull = Geometry.ConvexHull(floorPoints);
            if (hull.Count < 3) throw new InvalidOperationException("Not enough floor was found. Walk the area slowly.");
            var zone = new Zone
            {
                id = id, name = name, kind = kind, floorY = floorY,
                theme = Themes.ForSection(null, kind),
                floor = Geometry.Simplify(hull, 0.1f).Select(p => p.ToArray()).ToList(),
            };

            // Occupied grid cells: mesh points from 0.25 m to 2 m above the floor.
            var cells = new Dictionary<(int, int), float>();
            foreach (var (x, y, z) in meshPoints)
            {
                float above = y - floorY;
                if (above < 0.25f || above > 2f) continue;
                if (!Geometry.Contains(hull, new V2(x, z))) continue;
                var key = ((int)MathF.Floor(x / Cell), (int)MathF.Floor(z / Cell));
                cells[key] = cells.TryGetValue(key, out var h) ? MathF.Max(h, above) : above;
            }
            // Connected groups of cells become box obstacles.
            var seen = new HashSet<(int, int)>();
            foreach (var start in cells.Keys)
            {
                if (seen.Contains(start)) continue;
                var stack = new Stack<(int, int)>();
                stack.Push(start); seen.Add(start);
                int minX = start.Item1, maxX = start.Item1, minZ = start.Item2, maxZ = start.Item2;
                float maxH = 0; int count = 0;
                while (stack.Count > 0)
                {
                    var c = stack.Pop();
                    count++;
                    maxH = MathF.Max(maxH, cells[c]);
                    minX = Math.Min(minX, c.Item1); maxX = Math.Max(maxX, c.Item1);
                    minZ = Math.Min(minZ, c.Item2); maxZ = Math.Max(maxZ, c.Item2);
                    foreach (var (dx, dz) in new[] { (1, 0), (-1, 0), (0, 1), (0, -1) })
                    {
                        var n = (c.Item1 + dx, c.Item2 + dz);
                        if (cells.ContainsKey(n) && seen.Add(n)) stack.Push(n);
                    }
                }
                if (count < 2) continue; // single cells are usually noise
                float w = (maxX - minX + 1) * Cell, d = (maxZ - minZ + 1) * Cell;
                zone.objects.Add(new WorldObject
                {
                    cat = "clutter", w = w, d = d, h = maxH,
                    x = minX * Cell + w / 2f, z = minZ * Cell + d / 2f, y = floorY + maxH / 2f,
                });
            }
            return zone;
        }
    }

    public static class WorldBuilder
    {
        public const float LinkDistance = 0.6f;

        public static World NewWorld(string name) => new World { id = Guid.NewGuid().ToString("N"), name = name };

        // Add or replace a zone (a rescan keeps its id), then relink doorways.
        public static void AddZone(World world, Zone zone)
        {
            int existing = world.zones.FindIndex(z => z.id == zone.id);
            if (existing >= 0) world.zones[existing] = zone; else world.zones.Add(zone);
            if (world.hearth == null || world.zones.All(z => z.id != world.hearth.zone))
            {
                var c = Geometry.Centroid(zone.floor.Select(V2.From).ToList());
                world.hearth = new Hearth { x = c.X, z = c.Z, zone = zone.id };
            }
            Relink(world);
        }

        // Zones whose outlines come within 0.6 m are joined. The link sits at a
        // door or opening near that spot when there is one, else at the midpoint.
        public static void Relink(World world)
        {
            world.links.Clear();
            for (int i = 0; i < world.zones.Count; i++)
                for (int j = i + 1; j < world.zones.Count; j++)
                {
                    var a = world.zones[i]; var b = world.zones[j];
                    var pa = a.floor.Select(V2.From).ToList();
                    var pb = b.floor.Select(V2.From).ToList();
                    var (ca, cb, dist) = Geometry.ClosestPoints(pa, pb);
                    bool overlap = pa.Any(p => Geometry.Contains(pb, p)) || pb.Any(p => Geometry.Contains(pa, p));
                    if (dist > LinkDistance && !overlap) continue;
                    var mid = (ca + cb) * 0.5f;
                    var door = a.openings.Concat(b.openings).Where(o => o.kind != "window")
                        .OrderBy(o => (new V2(o.x, o.z) - mid).Length).FirstOrDefault();
                    if (door != null && (new V2(door.x, door.z) - mid).Length < 1.5f)
                        world.links.Add(new Link { a = a.id, b = b.id, x = door.x, z = door.z, w = Math.Max(0.7f, door.w) });
                    else
                        world.links.Add(new Link { a = a.id, b = b.id, x = mid.X, z = mid.Z, w = 0.9f });
                }
        }

        public static void SetHearth(World world, float x, float z)
        {
            var zone = world.zones.FirstOrDefault(zz => Geometry.Contains(zz.floor.Select(V2.From).ToList(), new V2(x, z)));
            if (zone == null) return;
            world.hearth = new Hearth { x = x, z = z, zone = zone.id };
        }

        // Same rule as the server's navigation grid (game/shared/world.js): on a
        // zone floor or in a doorway, and not inside furniture (plus 0.15 m).
        public static bool IsWalkable(World world, float x, float z, float pad = 0.15f)
        {
            var p = new V2(x, z);
            bool onFloor = world.zones.Any(zz => Geometry.Contains(zz.floor.Select(V2.From).ToList(), p))
                || world.links.Any(l => (new V2(l.x, l.z) - p).Length <= Math.Max(0.45f, l.w / 2f));
            if (!onFloor) return false;
            foreach (var zone in world.zones)
                foreach (var o in zone.objects)
                {
                    float c = MathF.Cos(o.yaw), s = MathF.Sin(o.yaw);
                    float dx = x - o.x, dz = z - o.z;
                    float lx = dx * c - dz * s, lz = dx * s + dz * c;
                    if (MathF.Abs(lx) <= o.w / 2f + pad && MathF.Abs(lz) <= o.d / 2f + pad) return false;
                }
            return true;
        }

        public static string ZoneAt(World world, float x, float z) =>
            world.zones.FirstOrDefault(zz => Geometry.Contains(zz.floor.Select(V2.From).ToList(), new V2(x, z)))?.id;
    }

    public static class Themes
    {
        public const string Hearth = "hearth";
        public const string Barracks = "barracks";
        public const string Forge = "forge";
        public const string Grotto = "grotto";
        public const string Feast = "feasthall";
        public const string Gloam = "gloam";
        public const string Wilds = "wilds";

        // A RoomPlan section label (or the zone kind) sets the zone's look.
        public static string ForSection(string section, string kind)
        {
            if (kind == ZoneKind.Outdoor) return Wilds;
            if (kind == ZoneKind.Hall) return Gloam;
            switch (section)
            {
                case "bedroom": return Barracks;
                case "kitchen": return Forge;
                case "bathroom": return Grotto;
                case "diningRoom": return Feast;
                default: return Hearth;
            }
        }

        public static string DisplayName(string theme)
        {
            switch (theme)
            {
                case Barracks: return "The Barracks";
                case Forge: return "The Forge";
                case Grotto: return "The Grotto";
                case Feast: return "The Feast Hall";
                case Gloam: return "The Gloam";
                case Wilds: return "The Wilds";
                default: return "The Hearth";
            }
        }
    }
}
