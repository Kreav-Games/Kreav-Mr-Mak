// The AR rig built in code: ARSession, XR Origin with the camera, planes,
// LiDAR scene mesh and depth occlusion. Also saves and loads ARKit world maps
// (to recognise a scanned home) and runs LiDAR "area scans" for decks and yards.
//
// The XR Origin stays at the identity transform, so session space is world
// space and equals the world file's frame once a world map is relocalized.
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using Realmgate.Core;
using Unity.Collections;
using Unity.XR.CoreUtils;
using UnityEngine;
using UnityEngine.InputSystem.XR;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;
#if UNITY_IOS
using UnityEngine.XR.ARKit;
#endif

namespace Realmgate
{
    public class ArRig : MonoBehaviour
    {
        public ARSession Session { get; private set; }
        public XROrigin Origin { get; private set; }
        public Camera Camera { get; private set; }
        public ARPlaneManager Planes { get; private set; }
        public ARMeshManager Meshes { get; private set; }
        public AROcclusionManager Occlusion { get; private set; }
        public ARRaycastManager Raycasts { get; private set; }

        public static ArRig Create()
        {
            var go = new GameObject("AR Rig");
            var rig = go.AddComponent<ArRig>();
            rig.Build();
            return rig;
        }

        void Build()
        {
            var sessionGo = new GameObject("AR Session");
            sessionGo.transform.SetParent(transform);
            Session = sessionGo.AddComponent<ARSession>();
            sessionGo.AddComponent<ARInputManager>();

            var originGo = new GameObject("XR Origin");
            originGo.transform.SetParent(transform);
            Origin = originGo.AddComponent<XROrigin>();
            var offset = new GameObject("Camera Offset");
            offset.transform.SetParent(originGo.transform, false);

            var camGo = new GameObject("AR Camera") { tag = "MainCamera" };
            camGo.transform.SetParent(offset.transform, false);
            Camera = camGo.AddComponent<Camera>();
            Camera.clearFlags = CameraClearFlags.SolidColor;
            Camera.backgroundColor = Color.black;
            Camera.nearClipPlane = 0.05f;
            Camera.farClipPlane = 60f;
            camGo.AddComponent<ARCameraManager>();
            camGo.AddComponent<ARCameraBackground>();
            var tpd = camGo.AddComponent<TrackedPoseDriver>();
            tpd.positionInput = new UnityEngine.InputSystem.InputActionProperty(
                new UnityEngine.InputSystem.InputAction("Position", binding: "<HandheldARInputDevice>/devicePosition"));
            tpd.rotationInput = new UnityEngine.InputSystem.InputActionProperty(
                new UnityEngine.InputSystem.InputAction("Rotation", binding: "<HandheldARInputDevice>/deviceRotation"));
            tpd.positionInput.action.Enable();
            tpd.rotationInput.action.Enable();
            Occlusion = camGo.AddComponent<AROcclusionManager>();
            Occlusion.requestedEnvironmentDepthMode = EnvironmentDepthMode.Best;
            Occlusion.requestedOcclusionPreferenceMode = OcclusionPreferenceMode.PreferEnvironmentOcclusion;

            Origin.Camera = Camera;
            Origin.CameraFloorOffsetObject = offset;
            Origin.RequestedTrackingOriginMode = XROrigin.TrackingOriginMode.Device;

            Raycasts = originGo.AddComponent<ARRaycastManager>();
            Planes = originGo.AddComponent<ARPlaneManager>();
            Planes.requestedDetectionMode = PlaneDetectionMode.Horizontal;
            Planes.planePrefab = null; // planes are only measured, never drawn
            Planes.enabled = false;

            // The mesh manager must sit on a child of the origin and have its
            // prefab before it is enabled, so build it on an inactive object.
            var meshGo = new GameObject("LiDAR Mesh");
            meshGo.SetActive(false);
            meshGo.transform.SetParent(originGo.transform, false);
            Meshes = meshGo.AddComponent<ARMeshManager>();
            Meshes.meshPrefab = MeshChunkPrefab();
            Meshes.density = 0.5f;
            Meshes.enabled = false;
            meshGo.SetActive(true);
        }

        static MeshFilter MeshChunkPrefab()
        {
            var go = new GameObject("Mesh Chunk");
            go.SetActive(false);
            DontDestroyOnLoad(go);
            var mf = go.AddComponent<MeshFilter>();
            var mr = go.AddComponent<MeshRenderer>();
            mr.sharedMaterial = Mats.ScanWire;
            return mf;
        }

        public void SetSessionRunning(bool on)
        {
            Session.enabled = on;
            Camera.gameObject.SetActive(on);
        }

        public Vector3 CameraPosition => Camera.transform.position;
        public float CameraYaw => Camera.transform.eulerAngles.y * Mathf.Deg2Rad;

        // ------------------------------------------------------- world maps ---

        public bool Relocalizing =>
            ARSession.state == ARSessionState.SessionInitializing || ARSession.notTrackingReason == NotTrackingReason.Relocalizing;

        public IEnumerator LoadWorldMap(string path, Action<string> done)
        {
#if UNITY_IOS && !UNITY_EDITOR
            if (!(Session.subsystem is ARKitSessionSubsystem arkit)) { done("ARKit is not running."); yield break; }
            var bytes = File.ReadAllBytes(path);
            var data = new NativeArray<byte>(bytes, Allocator.Temp);
            bool ok = ARWorldMap.TryDeserialize(data, out var map);
            data.Dispose();
            if (!ok) { done("The saved map could not be read. Rescan a room."); yield break; }
            arkit.ApplyWorldMap(map);
            done(null);
#else
            done("World maps need ARKit on an iPhone or iPad.");
            yield break;
#endif
        }

        public IEnumerator SaveWorldMap(string path, Action<string> done)
        {
#if UNITY_IOS && !UNITY_EDITOR
            if (!(Session.subsystem is ARKitSessionSubsystem arkit)) { done("ARKit is not running."); yield break; }
            var request = arkit.GetARWorldMapAsync();
            while (!request.status.IsDone()) yield return null;
            if (request.status.IsError()) { done($"Could not save the map ({request.status})."); request.Dispose(); yield break; }
            var map = request.GetWorldMap();
            request.Dispose();
            var data = map.Serialize(Allocator.Temp);
            Directory.CreateDirectory(Path.GetDirectoryName(path));
            File.WriteAllBytes(path, data.ToArray());
            data.Dispose();
            map.Dispose();
            done(null);
#else
            done("World maps need ARKit on an iPhone or iPad.");
            yield break;
#endif
        }

        // -------------------------------------------------------- area scan ---
        // For spaces RoomPlan can't read (decks, yards): measure the ground plane
        // and the LiDAR mesh while the player walks around.

        public void BeginAreaScan()
        {
            Planes.enabled = true;
            Meshes.enabled = true;
            Meshes.DestroyAllMeshes();
        }

        public Zone EndAreaScan(string id, string name, string kind)
        {
            // The ground: the largest horizontal plane, plus planes at its height.
            ARPlane ground = null;
            foreach (var p in Planes.trackables)
                if (p.alignment == PlaneAlignment.HorizontalUp && (ground == null || Area(p) > Area(ground))) ground = p;
            if (ground == null) throw new InvalidOperationException("No ground was found. Point the phone at the floor and walk slowly.");
            float floorY = ground.transform.position.y;
            var floorPts = new List<V2>();
            foreach (var p in Planes.trackables)
            {
                if (p.alignment != PlaneAlignment.HorizontalUp || Mathf.Abs(p.transform.position.y - floorY) > 0.15f) continue;
                foreach (var b in p.boundary)
                {
                    var w = p.transform.TransformPoint(new Vector3(b.x, 0, b.y));
                    floorPts.Add(new V2(w.x, w.z));
                }
            }
            var meshPts = new List<(float, float, float)>();
            foreach (var mf in Meshes.meshes)
            {
                if (mf == null || mf.sharedMesh == null) continue;
                var verts = mf.sharedMesh.vertices;
                for (int i = 0; i < verts.Length; i += 2) // every other vertex is plenty
                {
                    var w = mf.transform.TransformPoint(verts[i]);
                    meshPts.Add((w.x, w.y, w.z));
                }
            }
            Planes.enabled = false;
            Meshes.enabled = false;
            Meshes.DestroyAllMeshes();
            return AreaScanImport.ToZone(floorPts, meshPts, floorY, id, name, kind);
        }

        public void EndAreaScanDiscard()
        {
            Planes.enabled = false;
            Meshes.enabled = false;
            Meshes.DestroyAllMeshes();
        }

        static float Area(ARPlane p) => p.size.x * p.size.y;

        // Floor hit under a screen point (used to place the hearth).
        public bool FloorHit(Vector2 screen, out Vector3 point)
        {
            var hits = new List<ARRaycastHit>();
            if (Raycasts.Raycast(screen, hits, TrackableType.PlaneWithinPolygon | TrackableType.PlaneEstimated))
            {
                point = hits[0].pose.position;
                return true;
            }
            point = default;
            return false;
        }
    }
}
