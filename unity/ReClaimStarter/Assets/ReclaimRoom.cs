using UnityEngine;
public class ReclaimRoom : MonoBehaviour {
  Texture2D room;
  string message = "Choose a place to explore.";
  int contributions;
  void Awake() { room = Resources.Load<Texture2D>("ReclaimScene"); }
  // Browser bridge: unityInstance.SendMessage("ReclaimRoom", "SetContributions", "250")
  public void SetContributions(string value) { if (int.TryParse(value, out int count)) contributions = Mathf.Max(0,count); }
  void OnGUI() {
    float scale = Mathf.Min(Screen.width / 1000f, Screen.height / 1000f);
    GUI.matrix = Matrix4x4.TRS(new Vector3((Screen.width-1000*scale)/2,0,0),Quaternion.identity,new Vector3(scale,scale,1));
    if(room) GUI.DrawTexture(new Rect(0,0,1000,800),room,ScaleMode.ScaleToFit);
    if(GUI.Button(new Rect(200,120,200,60),"Art gallery")) message = contributions+" shared contributions. Progress supplied by ReClaim.";
    if(GUI.Button(new Rect(630,260,200,60),"Garden")) message = "Virtual garden: real compost deliveries are recorded separately.";
    if(GUI.Button(new Rect(50,520,220,60),"Sorting practice")) message = "Plastic cup: keep it out of this station's organics.";
    GUI.Box(new Rect(20,820,960,100),message);
    GUI.Label(new Rect(20,930,960,50),"ReClaim prototype | Original artwork | Practice is not a verified drop-off");
  }
}
