// Floor-paint scanning for any AR phone (ARCore or ARKit, no LiDAR needed).
// Same rules as game/shared/floorscan.js: floor hits paint 20 cm cells; an
// area's floor is the outline of its cells; unpainted gaps inside the outline
// (under the sofa) become obstacles. Coordinates are in the rift frame, metres.
using System;
using System.Collections.Generic;
using System.Linq;

namespace Realmgate.Core
{
    public static class FloorScan
    {
        public const float Cell = 0.2f;
        public const float FloorTolerance = 0.12f;

        // Heroes are action-figure sized in a real room: the scan (real metres)
        // is played in game metres scaled by 1 / HeroScale, and AR shows the game
        // world scaled down by HeroScale.
        public const float HeroScale = 0.4f;

        public static (int i, int j) Key(float x, float z) => ((int)MathF.Floor(x / Cell), (int)MathF.Floor(z / Cell));

        public static Zone ZoneFromCells(ICollection<(int i, int j)> cells, string id, string name, string kind)
        {
            if (cells.Count < 6) throw new InvalidOperationException("Paint more of the floor first.");
            var corners = new List<V2>();
            foreach (var (i, j) in cells)
            {
                corners.Add(new V2(i * Cell, j * Cell)); corners.Add(new V2((i + 1) * Cell, j * Cell));
                corners.Add(new V2(i * Cell, (j + 1) * Cell)); corners.Add(new V2((i + 1) * Cell, (j + 1) * Cell));
            }
            var floor = Geometry.ConvexHull(corners);
            var painted = new HashSet<(int, int)>(cells);
            int i0 = cells.Min(c => c.i), i1 = cells.Max(c => c.i), j0 = cells.Min(c => c.j), j1 = cells.Max(c => c.j);
            var zone = new Zone
            {
                id = id, name = name, kind = kind, theme = Themes.ForSection(null, kind), floorY = 0,
                floor = floor.Select(p => p.ToArray()).ToList(),
            };
            // Unpainted cells inside the outline, merged into runs along x per row.
            for (int j = j0; j <= j1; j++)
            {
                int runStart = int.MinValue;
                for (int i = i0; i <= i1 + 1; i++)
                {
                    var c = new V2((i + 0.5f) * Cell, (j + 0.5f) * Cell);
                    bool gap = i <= i1 && !painted.Contains((i, j)) && Geometry.Contains(floor, c);
                    if (gap) { if (runStart == int.MinValue) runStart = i; continue; }
                    if (runStart == int.MinValue) continue;
                    float w = (i - runStart) * Cell;
                    zone.objects.Add(new WorldObject { cat = "clutter", x = runStart * Cell + w / 2, y = 0.4f, z = (j + 0.5f) * Cell, w = w, h = 0.8f, d = Cell });
                    runStart = int.MinValue;
                }
            }
            if (zone.objects.Count > 250) zone.objects.RemoveRange(250, zone.objects.Count - 250);
            return zone;
        }

        // A copy of the world with every length multiplied by f.
        public static World Scale(World w, float f)
        {
            float[] P(float[] p) => new[] { p[0] * f, p[1] * f };
            return new World
            {
                v = w.v, id = w.id, name = w.name, frame = w.frame,
                hearth = w.hearth == null ? null : new Hearth { x = w.hearth.x * f, z = w.hearth.z * f, zone = w.hearth.zone },
                zones = w.zones.Select(z => new Zone
                {
                    id = z.id, name = z.name, kind = z.kind, theme = z.theme, floorY = z.floorY * f,
                    floor = z.floor.Select(P).ToList(),
                    walls = z.walls.Select(k => new Wall { a = P(k.a), b = P(k.b), h = k.h * f, t = k.t * f }).ToList(),
                    openings = z.openings.Select(o => new Opening { kind = o.kind, x = o.x * f, y = o.y * f, z = o.z * f, w = o.w * f, h = o.h * f, yaw = o.yaw }).ToList(),
                    objects = z.objects.Select(o => new WorldObject { cat = o.cat, x = o.x * f, y = o.y * f, z = o.z * f, w = o.w * f, h = o.h * f, d = o.d * f, yaw = o.yaw }).ToList(),
                }).ToList(),
                links = w.links.Select(l => new Link { a = l.a, b = l.b, x = l.x * f, z = l.z * f, w = l.w * f }).ToList(),
            };
        }

        // Scanned worlds in real metres -> the game's hero-sized metres.
        public static World ForPlay(World real) => Scale(real, 1f / HeroScale);
    }
}
