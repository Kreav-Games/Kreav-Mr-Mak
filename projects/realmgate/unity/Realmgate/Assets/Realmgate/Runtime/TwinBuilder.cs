// Builds the digital twin of a scanned world: floors, walls and furniture as
// simple shapes. Remote guests play inside it; the host can show it as a faint
// overlay to check that the world lines up with the real rooms.
using System.Linq;
using Realmgate.Core;
using UnityEngine;

namespace Realmgate
{
    public static class TwinBuilder
    {
        public static GameObject Build(World world, bool ghost)
        {
            var root = new GameObject($"Twin: {world.name}");
            foreach (var zone in world.zones)
            {
                var zg = new GameObject(zone.name);
                zg.transform.SetParent(root.transform, false);
                var tint = Models.ThemeColor(zone.theme);
                var floorMat = ghost ? Mats.Transparent(new Color(tint.r, tint.g, tint.b, 0.25f)) : Mats.Lit(tint);
                BuildFloor(zone, zg.transform, floorMat);
                if (ghost) continue; // in AR the real walls and furniture are already there

                var wallMat = Mats.Lit(Mats.Hex("#d8d0c0"));
                foreach (var w in zone.walls)
                {
                    var a = new Vector3(w.a[0], zone.floorY, w.a[1]);
                    var b = new Vector3(w.b[0], zone.floorY, w.b[1]);
                    var len = Vector3.Distance(a, b);
                    if (len < 0.05f) continue;
                    var wall = Models.Prim(PrimitiveType.Cube, zg.transform, (a + b) / 2 + Vector3.up * (w.h / 2), new Vector3(len, w.h, Mathf.Max(0.05f, w.t)), wallMat);
                    wall.transform.rotation = Quaternion.LookRotation(Vector3.Cross(b - a, Vector3.up), Vector3.up);
                    wall.name = "Wall";
                }
                foreach (var o in zone.objects)
                {
                    var color = o.cat == "stairs" ? Mats.Hex("#a05050") : Mats.Hex("#6b5a4a");
                    var go = Models.Prim(PrimitiveType.Cube, zg.transform, new Vector3(o.x, o.y, o.z), new Vector3(o.w, o.h, o.d), Mats.Lit(color));
                    go.transform.rotation = Quaternion.Euler(0, o.yaw * Mathf.Rad2Deg, 0);
                    go.name = o.cat;
                }
            }
            return root;
        }

        static void BuildFloor(Zone zone, Transform parent, Material mat)
        {
            var outline = zone.floor.Select(V2.From).ToList();
            var tris = Geometry.Triangulate(outline);
            var mesh = new Mesh { name = $"{zone.name} floor" };
            mesh.vertices = outline.Select(p => new Vector3(p.X, zone.floorY + 0.002f, p.Z)).ToArray();
            // Ear clipping works counter-clockwise in (x, z); Unity faces need
            // clockwise seen from above, so flip each triangle.
            var flipped = new int[tris.Count];
            for (int i = 0; i < tris.Count; i += 3) { flipped[i] = tris[i]; flipped[i + 1] = tris[i + 2]; flipped[i + 2] = tris[i + 1]; }
            mesh.triangles = flipped;
            mesh.RecalculateNormals();
            if (mesh.normals.Length > 0 && mesh.normals[0].y < 0) mesh.triangles = tris.ToArray();
            mesh.RecalculateNormals();
            mesh.RecalculateBounds();
            var go = new GameObject("Floor");
            go.transform.SetParent(parent, false);
            go.AddComponent<MeshFilter>().sharedMesh = mesh;
            go.AddComponent<MeshRenderer>().sharedMaterial = mat;
            go.AddComponent<MeshCollider>().sharedMesh = mesh;
        }
    }
}
