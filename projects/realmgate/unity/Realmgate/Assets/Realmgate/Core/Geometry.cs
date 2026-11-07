// Floor-plane geometry with no Unity dependency, so it is unit-tested with dotnet.
using System;
using System.Collections.Generic;
using System.Linq;

namespace Realmgate.Core
{
    public readonly struct V2
    {
        public readonly float X, Z;
        public V2(float x, float z) { X = x; Z = z; }
        public static V2 operator +(V2 a, V2 b) => new V2(a.X + b.X, a.Z + b.Z);
        public static V2 operator -(V2 a, V2 b) => new V2(a.X - b.X, a.Z - b.Z);
        public static V2 operator *(V2 a, float k) => new V2(a.X * k, a.Z * k);
        public float Length => MathF.Sqrt(X * X + Z * Z);
        public static float Dot(V2 a, V2 b) => a.X * b.X + a.Z * b.Z;
        public static float Cross(V2 a, V2 b) => a.X * b.Z - a.Z * b.X;
        public float[] ToArray() => new[] { X, Z };
        public static V2 From(float[] p) => new V2(p[0], p[1]);
        public override string ToString() => $"({X:0.00}, {Z:0.00})";
    }

    public static class Geometry
    {
        public static float SignedArea(IReadOnlyList<V2> poly)
        {
            float a = 0;
            for (int i = 0, j = poly.Count - 1; i < poly.Count; j = i++)
                a += (poly[j].X + poly[i].X) * (poly[j].Z - poly[i].Z);
            return a / 2f;
        }

        public static float Area(IReadOnlyList<V2> poly) => MathF.Abs(SignedArea(poly));

        public static bool Contains(IReadOnlyList<V2> poly, V2 p)
        {
            bool inside = false;
            for (int i = 0, j = poly.Count - 1; i < poly.Count; j = i++)
            {
                var a = poly[i]; var b = poly[j];
                if ((a.Z > p.Z) != (b.Z > p.Z) && p.X < (b.X - a.X) * (p.Z - a.Z) / (b.Z - a.Z) + a.X) inside = !inside;
            }
            return inside;
        }

        public static V2 Centroid(IReadOnlyList<V2> poly)
        {
            float x = 0, z = 0;
            foreach (var p in poly) { x += p.X; z += p.Z; }
            return new V2(x / poly.Count, z / poly.Count);
        }

        // Andrew's monotone chain; counter-clockwise result without repeats.
        public static List<V2> ConvexHull(IEnumerable<V2> points)
        {
            var pts = points.Distinct().OrderBy(p => p.X).ThenBy(p => p.Z).ToList();
            if (pts.Count < 3) return pts;
            var hull = new List<V2>();
            for (int pass = 0; pass < 2; pass++)
            {
                int start = hull.Count;
                foreach (var p in pts)
                {
                    while (hull.Count >= start + 2 && V2.Cross(hull[^1] - hull[^2], p - hull[^2]) <= 0) hull.RemoveAt(hull.Count - 1);
                    hull.Add(p);
                }
                hull.RemoveAt(hull.Count - 1);
                pts.Reverse();
            }
            return hull;
        }

        public static V2 ClosestOnSegment(V2 a, V2 b, V2 p)
        {
            var ab = b - a;
            float len2 = V2.Dot(ab, ab);
            if (len2 < 1e-9f) return a;
            float t = Math.Clamp(V2.Dot(p - a, ab) / len2, 0f, 1f);
            return a + ab * t;
        }

        // Closest pair of points between two polygon outlines (edge to vertex both ways).
        public static (V2 a, V2 b, float dist) ClosestPoints(IReadOnlyList<V2> p, IReadOnlyList<V2> q)
        {
            (V2, V2, float) best = (p[0], q[0], float.MaxValue);
            void Check(IReadOnlyList<V2> verts, IReadOnlyList<V2> edges, bool swap)
            {
                foreach (var v in verts)
                    for (int i = 0, j = edges.Count - 1; i < edges.Count; j = i++)
                    {
                        var c = ClosestOnSegment(edges[j], edges[i], v);
                        float d = (c - v).Length;
                        if (d < best.Item3) best = swap ? (c, v, d) : (v, c, d);
                    }
            }
            Check(p, q, false);
            Check(q, p, true);
            return best;
        }

        // Ear-clipping triangulation of a simple polygon; returns index triples.
        // Used to build floor meshes for the remote-guest digital twin.
        public static List<int> Triangulate(IReadOnlyList<V2> poly)
        {
            var result = new List<int>();
            int n = poly.Count;
            if (n < 3) return result;
            var idx = Enumerable.Range(0, n).ToList();
            if (SignedArea(poly) > 0) idx.Reverse(); // SignedArea is negative for counter-clockwise outlines
            int guard = n * n;
            while (idx.Count > 3 && guard-- > 0)
            {
                bool clipped = false;
                for (int i = 0; i < idx.Count; i++)
                {
                    int i0 = idx[(i + idx.Count - 1) % idx.Count], i1 = idx[i], i2 = idx[(i + 1) % idx.Count];
                    V2 a = poly[i0], b = poly[i1], c = poly[i2];
                    if (V2.Cross(b - a, c - b) <= 1e-7f) continue; // reflex
                    bool contains = false;
                    foreach (int k in idx)
                    {
                        if (k == i0 || k == i1 || k == i2) continue;
                        if (InTriangle(poly[k], a, b, c)) { contains = true; break; }
                    }
                    if (contains) continue;
                    result.Add(i0); result.Add(i1); result.Add(i2);
                    idx.RemoveAt(i);
                    clipped = true;
                    break;
                }
                if (!clipped) break; // degenerate input: fall back below
            }
            if (idx.Count == 3) { result.Add(idx[0]); result.Add(idx[1]); result.Add(idx[2]); }
            else if (idx.Count > 3) for (int i = 1; i < idx.Count - 1; i++) { result.Add(idx[0]); result.Add(idx[i]); result.Add(idx[i + 1]); }
            return result;
        }

        static bool InTriangle(V2 p, V2 a, V2 b, V2 c)
        {
            float d1 = V2.Cross(b - a, p - a), d2 = V2.Cross(c - b, p - b), d3 = V2.Cross(a - c, p - c);
            return d1 >= 0 && d2 >= 0 && d3 >= 0;
        }

        // Douglas-Peucker on a closed outline, to keep scanned floors light.
        public static List<V2> Simplify(IReadOnlyList<V2> poly, float tolerance)
        {
            if (poly.Count <= 4) return poly.ToList();
            var keep = new bool[poly.Count];
            keep[0] = true;
            int far = 0; float fd = 0;
            for (int i = 1; i < poly.Count; i++) { float d = (poly[i] - poly[0]).Length; if (d > fd) { fd = d; far = i; } }
            keep[far] = true;
            void Rec(int s, int e)
            {
                if (e <= s + 1) return;
                int best = -1; float bd = tolerance;
                for (int i = s + 1; i < e; i++)
                {
                    float d = (ClosestOnSegment(poly[s], poly[e % poly.Count], poly[i]) - poly[i]).Length;
                    if (d > bd) { bd = d; best = i; }
                }
                if (best < 0) return;
                keep[best] = true;
                Rec(s, best); Rec(best, e);
            }
            Rec(0, far); Rec(far, poly.Count);
            var outp = new List<V2>();
            for (int i = 0; i < poly.Count; i++) if (keep[i]) outp.Add(poly[i]);
            return outp;
        }
    }
}
