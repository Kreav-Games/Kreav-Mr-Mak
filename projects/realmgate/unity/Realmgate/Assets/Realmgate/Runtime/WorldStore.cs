// Worlds and characters saved on the device.
//   <persistentDataPath>/worlds/<id>/world.json        zones, links, hearth
//   <persistentDataPath>/worlds/<id>/world.arworldmap  ARKit map to recognise the home
// Only geometry is stored. No camera images are kept or uploaded.
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using AOT;
using Newtonsoft.Json;
using Realmgate.Core;
using UnityEngine;

namespace Realmgate
{
    public static class WorldStore
    {
        static string Root => Path.Combine(Application.persistentDataPath, "worlds");

        public static string Folder(World w) => Path.Combine(Root, w.id);
        public static string MapPath(World w) => Path.Combine(Folder(w), "world.arworldmap");
        public static bool HasMap(World w) => File.Exists(MapPath(w));

        public static List<World> All()
        {
            if (!Directory.Exists(Root)) return new List<World>();
            return Directory.GetDirectories(Root)
                .Select(d => Path.Combine(d, "world.json"))
                .Where(File.Exists)
                .Select(f => { try { return JsonConvert.DeserializeObject<World>(File.ReadAllText(f)); } catch { return null; } })
                .Where(w => w != null)
                .ToList();
        }

        public static void Save(World w)
        {
            Directory.CreateDirectory(Folder(w));
            File.WriteAllText(Path.Combine(Folder(w), "world.json"), JsonConvert.SerializeObject(w));
        }

        public static void Delete(World w)
        {
            if (Directory.Exists(Folder(w))) Directory.Delete(Folder(w), true);
        }

        // Characters use the same save blob as the web client.
        public static string LoadCharacter(string cls) => PlayerPrefs.GetString($"realmgate.char.{cls}", null);
        public static void SaveCharacter(string cls, string json) { PlayerPrefs.SetString($"realmgate.char.{cls}", json); PlayerPrefs.Save(); }
    }

    // Bridge to Assets/Plugins/iOS/RealmgateRoomPlan.swift.
    public static class RoomPlanBridge
    {
        delegate void ScanCallback(IntPtr json);
        static Action<RoomPlanResult> pending;
        static readonly ScanCallback Callback = OnScan; // kept alive while native code holds it

#if UNITY_IOS && !UNITY_EDITOR
        [DllImport("__Internal")] [return: MarshalAs(UnmanagedType.U1)] static extern bool RG_RoomPlanSupported();
        [DllImport("__Internal")] static extern void RG_RoomPlanStart(string outDir, string worldMapPath, ScanCallback cb);
#endif

        public static bool Supported
        {
            get
            {
#if UNITY_IOS && !UNITY_EDITOR
                return RG_RoomPlanSupported();
#else
                return false;
#endif
            }
        }

        // outDir receives world.arworldmap; worldMapPath (may be empty) is the
        // existing map to relocalize against first.
        public static void Start(string outDir, string worldMapPath, Action<RoomPlanResult> done)
        {
            pending = done;
#if UNITY_IOS && !UNITY_EDITOR
            RG_RoomPlanStart(outDir, worldMapPath ?? "", Callback);
#else
            done(new RoomPlanResult { ok = false, error = "Room scanning runs on a LiDAR iPhone or iPad." });
#endif
        }

        [MonoPInvokeCallback(typeof(ScanCallback))]
        static void OnScan(IntPtr json)
        {
            RoomPlanResult result;
            try { result = JsonConvert.DeserializeObject<RoomPlanResult>(Marshal.PtrToStringUTF8(json)); }
            catch (Exception e) { result = new RoomPlanResult { ok = false, error = e.Message }; }
            var cb = pending;
            pending = null;
            cb?.Invoke(result);
        }
    }
}
