// Floor-paint scanning in Unity (any AR phone). While the player walks, a grid
// of screen rays and the floor planes ARCore/ARKit find paint 20 cm cells in
// the rift frame (the world root's local space, real metres during a scan).
// Painted cells are drawn as one mesh of flat squares.
using System.Collections.Generic;
using Realmgate.Core;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

namespace Realmgate
{
    public class FloorPaintScanner : MonoBehaviour
    {
        public ArRig Rig;
        public Transform WorldRoot;
        public readonly HashSet<(int i, int j)> Cells = new HashSet<(int, int)>(); // current area
        readonly HashSet<(int, int)> all = new HashSet<(int, int)>();
        readonly List<Vector3> verts = new List<Vector3>();
        readonly List<int> tris = new List<int>();
        Mesh mesh;
        MeshRenderer meshRenderer;
        bool dirty;
        float planesAt;
        public float LastFloorAt { get; private set; }

        public static FloorPaintScanner Create(ArRig rig, Transform worldRoot)
        {
            var go = new GameObject("Floor Paint");
            go.transform.SetParent(worldRoot, false);
            var s = go.AddComponent<FloorPaintScanner>();
            s.Rig = rig; s.WorldRoot = worldRoot;
            s.mesh = new Mesh { name = "Painted floor" };
            go.AddComponent<MeshFilter>().sharedMesh = s.mesh;
            s.meshRenderer = go.AddComponent<MeshRenderer>();
            s.SetColor(new Color(1f, 0.83f, 0.29f, 0.45f));
            s.LastFloorAt = Time.time;
            return s;
        }

        public void SetColor(Color c) => meshRenderer.sharedMaterial = Mats.Transparent(c);

        public void NewArea() => Cells.Clear();

        void Update()
        {
            if (!Rig.Tracking) return;
            // A 5 x 3 grid over the lower two thirds of the screen.
            for (int gx = 0; gx < 5; gx++)
                for (int gy = 0; gy < 3; gy++)
                {
                    var screen = new Vector2(Screen.width * (0.1f + gx * 0.2f), Screen.height * (0.12f + gy * 0.2f));
                    if (Rig.Hit(screen, out var p, out bool onFloor) && onFloor) Brush(p);
                }
            // Whole floor planes twice a second.
            if (Time.time - planesAt > 0.5f)
            {
                planesAt = Time.time;
                var floor = Rig.FloorY;
                if (floor != null)
                    foreach (var plane in Rig.Planes.trackables)
                    {
                        if (plane.alignment != PlaneAlignment.HorizontalUp || Mathf.Abs(plane.transform.position.y - floor.Value) > FloorScan.FloorTolerance) continue;
                        var poly = new List<V2>();
                        foreach (var b in plane.boundary)
                        {
                            var local = WorldRoot.InverseTransformPoint(plane.transform.TransformPoint(new Vector3(b.x, 0, b.y)));
                            poly.Add(new V2(local.x, local.z));
                        }
                        if (poly.Count >= 3) Fill(poly);
                    }
            }
            if (dirty) Rebuild();
        }

        void Brush(Vector3 worldPoint)
        {
            var l = WorldRoot.InverseTransformPoint(worldPoint);
            const float c = FloorScan.Cell;
            Paint(l.x, l.z); Paint(l.x + c, l.z); Paint(l.x - c, l.z); Paint(l.x, l.z + c); Paint(l.x, l.z - c);
            LastFloorAt = Time.time;
        }

        void Fill(List<V2> poly)
        {
            float x0 = float.MaxValue, x1 = float.MinValue, z0 = float.MaxValue, z1 = float.MinValue;
            foreach (var p in poly) { x0 = Mathf.Min(x0, p.X); x1 = Mathf.Max(x1, p.X); z0 = Mathf.Min(z0, p.Z); z1 = Mathf.Max(z1, p.Z); }
            const float c = FloorScan.Cell;
            for (float x = x0 + c / 2; x < x1; x += c)
                for (float z = z0 + c / 2; z < z1; z += c)
                    if (Geometry.Contains(poly, new V2(x, z))) Paint(x, z);
            LastFloorAt = Time.time;
        }

        void Paint(float x, float z)
        {
            var k = FloorScan.Key(x, z);
            if (all.Count > 20000 || !all.Add(k)) return;
            Cells.Add(k);
            const float c = FloorScan.Cell, m = c * 0.05f;
            int n = verts.Count;
            float ax = k.Item1 * c + m, az = k.Item2 * c + m, bx = (k.Item1 + 1) * c - m, bz = (k.Item2 + 1) * c - m;
            verts.Add(new Vector3(ax, 0.005f, az)); verts.Add(new Vector3(ax, 0.005f, bz));
            verts.Add(new Vector3(bx, 0.005f, bz)); verts.Add(new Vector3(bx, 0.005f, az));
            tris.Add(n); tris.Add(n + 1); tris.Add(n + 2); tris.Add(n); tris.Add(n + 2); tris.Add(n + 3);
            dirty = true;
        }

        void Rebuild()
        {
            dirty = false;
            mesh.indexFormat = verts.Count > 65000 ? UnityEngine.Rendering.IndexFormat.UInt32 : UnityEngine.Rendering.IndexFormat.UInt16;
            mesh.Clear();
            mesh.SetVertices(verts);
            mesh.SetTriangles(tris, 0);
            mesh.RecalculateBounds();
        }

        public float AreaM2 => Cells.Count * FloorScan.Cell * FloorScan.Cell;
    }
}
