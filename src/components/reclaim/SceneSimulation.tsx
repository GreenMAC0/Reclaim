import { EnergyPreview } from "./EnergyPreview";
import { useState } from "react";
import { useReclaim } from "@/lib/reclaim/store-context";

export function SceneSimulation() {
  const { state, learnRule } = useReclaim();
  const [energyOpen, setEnergyOpen] = useState(false);
  const [place, setPlace] = useState("Welcome");
  const [position, setPosition] = useState({x:50,y:70});
  const move = (dx:number,dy:number) => setPosition(p => ({x:Math.max(12,Math.min(88,p.x+dx)),y:Math.max(40,Math.min(85,p.y+dy))}));
  const [answer, setAnswer] = useState("");
  return <section className="game-scene" aria-label="Interactive ReClaim scene">
    <div className="px-4 pb-3"><button onClick={() => setEnergyOpen(!energyOpen)} aria-expanded={energyOpen} className="w-full rounded-xl bg-[#c5ed8b] px-4 py-3 text-left font-bold text-[#15382b]">⚡ {energyOpen ? "Back to the room" : (state.energyMissionStep === 5 ? "Community center lit · view your reward" : state.energyMissionStep > 0 ? "Continue your energy mission →" : "Power the neighborhood →")}</button></div>
    {energyOpen ? <EnergyPreview /> : <>
    <div className="scene-room movable-room" tabIndex={0} aria-label="Move character with arrow keys or WASD" onKeyDown={e => {
      const directions:Record<string,[number,number]> = {ArrowLeft:[-3,0],a:[-3,0],ArrowRight:[3,0],d:[3,0],ArrowUp:[0,-3],w:[0,-3],ArrowDown:[0,3],s:[0,3]};
      const direction=directions[e.key]; if(direction){e.preventDefault();move(...direction);}
    }}>
      {state.energyMissionStep === 5 && <div className="absolute right-3 bottom-3 z-10 rounded-xl border border-yellow-200/70 bg-[#fff0ac] px-3 py-2 text-sm font-bold text-[#15382b] shadow-[0_0_35px_#ffe49688]">✦ Neighborhood light unlocked</div>}
      <span className="moving-character" role="img" aria-label="Purple ReClaim character" style={{left:position.x+"%",top:position.y+"%"}} />
      <button style={{left:"60%",top:"55%"}} onClick={() => setEnergyOpen(true)}>⚡ Energy center</button>
      <button style={{left:"22%",top:"15%"}} onClick={() => setPlace("Art gallery")}>Art gallery</button>
      <button style={{left:"63%",top:"26%"}} onClick={() => setPlace("Garden")}>Garden</button>
      <button style={{left:"8%",top:"52%"}} onClick={() => {setPlace("Sorting practice");setAnswer("");}}>Sorting practice</button>
    </div>
    <div className="movement-pad" role="group" aria-label="Character movement">
      <button onClick={() => move(-5,0)} aria-label="Move left">←</button>
      <button onClick={() => move(0,-5)} aria-label="Move up">↑</button>
      <button onClick={() => move(0,5)} aria-label="Move down">↓</button>
      <button onClick={() => move(5,0)} aria-label="Move right">→</button>
    </div>
    <p className="px-5 text-sm">Tap the arrows, or select the room and use arrow keys / WASD.</p>
    <div className="game-scene-caption" aria-live="polite">
      <h3>{place}</h3>
      {place === "Welcome" && <p>Choose a spot in the room to explore, learn and see your community’s progress.</p>}
      {place === "Art gallery" && <p>Your community has {state.artworkCount} demo contributions toward the shared artwork. Open Journey to see the current artwork reveal.</p>}
      {place === "Garden" && <p>Food scraps can support new growth after collection and composting. This room is a virtual reward, not a record of real compost deliveries.</p>}
      {place === "Sorting practice" && <><p>Does a plastic cup belong in this station’s organics?</p><div className="canvas-view-switch"><button onClick={() => setAnswer("Try again. Plastic cups stay out of this organics stream.")}>Yes</button><button onClick={() => {setAnswer("Correct! Keep the cup out. Check station guidance for your next item.");learnRule("Plastic cup");}}>No</button></div><p>{answer}</p></>}
      <small>Interactive browser simulation using your original scene. Practice does not count as a drop-off. Character movement is a 2D prototype using an adapted cutout of your original artwork.</small>
    </div>
    </>}
  </section>;
}
