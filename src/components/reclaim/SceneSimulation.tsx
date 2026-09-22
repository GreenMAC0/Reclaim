import { useState } from "react";
import { useReclaim } from "@/lib/reclaim/store-context";

export function SceneSimulation() {
  const { state, learnRule } = useReclaim();
  const [place, setPlace] = useState("Welcome");
  const [answer, setAnswer] = useState("");
  return <section className="game-scene" aria-label="Interactive ReClaim scene">
    <div className="scene-room">
      <img src="/artwork/gameplay-poster.png" alt="Original ReClaim room with a purple character, plants and framed artwork" />
      <button style={{left:"22%",top:"15%"}} onClick={() => setPlace("Art gallery")}>Art gallery</button>
      <button style={{left:"63%",top:"26%"}} onClick={() => setPlace("Garden")}>Garden</button>
      <button style={{left:"8%",top:"52%"}} onClick={() => {setPlace("Sorting practice");setAnswer("");}}>Sorting practice</button>
    </div>
    <div className="game-scene-caption" aria-live="polite">
      <h3>{place}</h3>
      {place === "Welcome" && <p>Choose a spot in the room to explore, learn and see your community’s progress.</p>}
      {place === "Art gallery" && <p>Your community has {state.artworkCount} demo contributions toward the shared artwork. Open Journey to see the current artwork reveal.</p>}
      {place === "Garden" && <p>Food scraps can support new growth after collection and composting. This room is a virtual reward, not a record of real compost deliveries.</p>}
      {place === "Sorting practice" && <><p>Does a plastic cup belong in this station’s organics?</p><div className="canvas-view-switch"><button onClick={() => setAnswer("Try again. Plastic cups stay out of this organics stream.")}>Yes</button><button onClick={() => {setAnswer("Correct! Keep the cup out. Check station guidance for your next item.");learnRule("Plastic cup");}}>No</button></div><p>{answer}</p></>}
      <small>Interactive browser simulation using your original scene. Practice does not count as a drop-off. The character and arrows in the background are part of the artwork.</small>
    </div>
  </section>;
}
