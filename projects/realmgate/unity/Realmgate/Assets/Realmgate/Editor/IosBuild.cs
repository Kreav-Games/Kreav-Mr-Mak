// Links RoomPlan and ARKit into the Xcode project and sets Swift for the
// RoomPlan bridge (Assets/Plugins/iOS/RealmgateRoomPlan.swift).
#if UNITY_IOS
using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;

namespace Realmgate.EditorTools
{
    public static class IosBuild
    {
        [PostProcessBuild(100)]
        public static void OnPostprocess(BuildTarget target, string path)
        {
            if (target != BuildTarget.iOS) return;
            var projPath = PBXProject.GetPBXProjectPath(path);
            var proj = new PBXProject();
            proj.ReadFromFile(projPath);
            var framework = proj.GetUnityFrameworkTargetGuid();
            var main = proj.GetUnityMainTargetGuid();
            proj.AddFrameworkToProject(framework, "RoomPlan.framework", false);
            proj.AddFrameworkToProject(framework, "ARKit.framework", false);
            foreach (var t in new[] { framework, main })
            {
                proj.SetBuildProperty(t, "SWIFT_VERSION", "5.0");
                proj.SetBuildProperty(t, "IPHONEOS_DEPLOYMENT_TARGET", "17.0");
            }
            proj.SetBuildProperty(main, "ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES", "YES");
            proj.SetBuildProperty(framework, "ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES", "NO");
            proj.WriteToFile(projPath);

            // LiDAR is required: only offer the app on devices with ARKit.
            var plistPath = Path.Combine(path, "Info.plist");
            var plist = new PlistDocument();
            plist.ReadFromFile(plistPath);
            var caps = plist.root["UIRequiredDeviceCapabilities"]?.AsArray() ?? plist.root.CreateArray("UIRequiredDeviceCapabilities");
            caps.AddString("arkit");
            plist.WriteToFile(plistPath);
        }
    }
}
#endif
