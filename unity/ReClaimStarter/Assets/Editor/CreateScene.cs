using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
public static class CreateScene {
 [MenuItem("ReClaim/Create starter scene")]
 public static void Build() {
  var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene,NewSceneMode.Single);
  var camera = new GameObject("Main Camera").AddComponent<Camera>();
  camera.backgroundColor = new Color(.03f,.1f,.12f);
  camera.clearFlags = CameraClearFlags.SolidColor;
  new GameObject("ReclaimRoom").AddComponent<ReclaimRoom>();
  System.IO.Directory.CreateDirectory("Assets/Scenes");
  EditorSceneManager.SaveScene(scene,"Assets/Scenes/ReclaimRoom.unity");
  EditorBuildSettings.scenes = new[]{new EditorBuildSettingsScene("Assets/Scenes/ReclaimRoom.unity",true)};
 }
}
