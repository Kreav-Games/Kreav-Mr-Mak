// Realmgate > Set Up Project: creates the shared materials, the boot scene and
// the Android and iOS player settings, and turns on ARCore and ARKit in XR
// Plug-in Management.
// Run once after opening the project, and again after upgrading Unity.
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEditor.XR.Management;
using UnityEditor.XR.Management.Metadata;
using UnityEngine;
using UnityEngine.XR.Management;

namespace Realmgate.EditorTools
{
    public static class RealmgateSetup
    {
        const string MatDir = "Assets/Realmgate/Resources/Realmgate";
        const string ScenePath = "Assets/Realmgate/Scenes/Main.unity";

        [MenuItem("Realmgate/Set Up Project")]
        public static void SetUp()
        {
            Materials();
            Scene();
            Player();
            Xr();
            AssetDatabase.SaveAssets();
            Debug.Log("Realmgate: project set up. Switch the build target to Android (or iOS) and build (File > Build Profiles).");
        }

        static void Materials()
        {
            Directory.CreateDirectory(MatDir);
            Make("Lit", "Standard", Color.white);
            Make("Unlit", "Unlit/Color", Color.white);
            Make("Transparent", "Legacy Shaders/Transparent/Diffuse", new Color(1, 1, 1, 0.5f));
            Make("ScanWire", "Legacy Shaders/Transparent/Diffuse", new Color(0.5f, 0.97f, 1f, 0.15f));
        }

        static void Make(string name, string shader, Color color)
        {
            var path = $"{MatDir}/{name}.mat";
            if (AssetDatabase.LoadAssetAtPath<Material>(path) != null) return;
            var s = Shader.Find(shader);
            if (s == null) { Debug.LogError($"Realmgate: shader {shader} not found."); return; }
            AssetDatabase.CreateAsset(new Material(s) { color = color }, path);
        }

        static void Scene()
        {
            if (!File.Exists(ScenePath))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(ScenePath));
                // Empty on purpose: App.Boot builds everything at runtime.
                var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
                EditorSceneManager.SaveScene(scene, ScenePath);
            }
            EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(ScenePath, true) };
        }

        static void Player()
        {
            PlayerSettings.productName = "Realmgate";
            PlayerSettings.companyName = "Kreav Games";
            PlayerSettings.SetApplicationIdentifier(UnityEditor.Build.NamedBuildTarget.iOS, "com.kreavgames.realmgate");
            PlayerSettings.SetApplicationIdentifier(UnityEditor.Build.NamedBuildTarget.Android, "com.kreavgames.realmgate");
            PlayerSettings.iOS.targetOSVersionString = "17.0"; // RoomPlan with a custom ARSession
            PlayerSettings.iOS.cameraUsageDescription = "Realmgate uses the camera to scan your rooms and show the realm in them.";
            PlayerSettings.iOS.requiresPersistentWiFi = false;
            PlayerSettings.defaultInterfaceOrientation = UIOrientation.Portrait;
            PlayerSettings.colorSpace = ColorSpace.Linear;
            PlayerSettings.SetScriptingBackend(UnityEditor.Build.NamedBuildTarget.iOS, ScriptingImplementation.IL2CPP);
            // Android: ARCore needs Android 7.0 (API 24)+, 64-bit ARM, and OpenGL ES 3
            // (the most widely supported graphics API for ARCore in Unity).
            PlayerSettings.Android.minSdkVersion = AndroidSdkVersions.AndroidApiLevel24;
            PlayerSettings.SetScriptingBackend(UnityEditor.Build.NamedBuildTarget.Android, ScriptingImplementation.IL2CPP);
            PlayerSettings.Android.targetArchitectures = AndroidArchitecture.ARM64;
            PlayerSettings.SetUseDefaultGraphicsAPIs(BuildTarget.Android, false);
            PlayerSettings.SetGraphicsAPIs(BuildTarget.Android, new[] { UnityEngine.Rendering.GraphicsDeviceType.OpenGLES3 });
            PlayerSettings.Android.forceInternetPermission = true; // the game server
            // ws:// to a dev server on the LAN; use wss:// in production.
            PlayerSettings.insecureHttpOption = InsecureHttpOption.AlwaysAllowed;
        }

        static void Xr()
        {
            if (!EditorBuildSettings.TryGetConfigObject(XRGeneralSettings.k_SettingsKey, out XRGeneralSettingsPerBuildTarget perTarget) || perTarget == null)
            {
                Debug.LogWarning("Realmgate: open Project Settings > XR Plug-in Management once, then run Realmgate > Set Up Project again to enable ARKit.");
                return;
            }
            Assign(perTarget, BuildTargetGroup.iOS, "UnityEngine.XR.ARKit.ARKitLoader", "iOS", "ARKit");
            Assign(perTarget, BuildTargetGroup.Android, "UnityEngine.XR.ARCore.ARCoreLoader", "Android", "Google ARCore");
        }

        static void Assign(XRGeneralSettingsPerBuildTarget perTarget, BuildTargetGroup group, string loader, string tab, string name)
        {
            var general = perTarget.SettingsForBuildTarget(group);
            if (general == null || general.Manager == null)
            {
                Debug.LogWarning($"Realmgate: in Project Settings > XR Plug-in Management, open the {tab} tab and tick {name}.");
                return;
            }
            XRPackageMetadataStore.AssignLoader(general.Manager, loader, group);
            general.InitManagerOnStart = true;
        }
    }
}
