import { lazy, Suspense, useState } from "react";
const EnergyModel = lazy(() => import("./EnergyModel"));
const process = [
  { title: "01 / Prepare the feed", text: "Remove packaging and contaminants. Food scraps are prepared into a feed suited to the facility. The green line carries that material into the reactor.", part: "Feed inlet" },
  { title: "02 / Look inside the reactor", text: "In this sealed, oxygen-free vessel, communities of microbes break down organic material. Biogas collects above the liquid. A mixer helps distribute material; the lifted roof reveals the inside.", part: "Digester" },
  { title: "03 / Condition the gas", text: "The gold line carries biogas through treatment equipment. Moisture and other contaminants may need removal to meet the engine’s requirements. This model simplifies the treatment train.", part: "Gas treatment" },
  { title: "04 / Recover useful energy", text: "An engine uses the gas and drives a generator. Blue represents electricity. Orange represents heat that can be recovered for a suitable nearby use. The green outlet carries digestate for further treatment and appropriate use.", part: "Engine + generator" },
];
export default function EnergyLab() {
  const [mode,setMode]=useState("Look inside");
  const [cutaway,setCutaway]=useState(true);
  const [stage,setStage]=useState(1);
  const [heat,setHeat]=useState(false);
  const [prediction,setPrediction]=useState("");
  const [tested,setTested]=useState(false);
  const current=process[stage]!;
  return <section className="mx-3 my-5 rounded-3xl bg-[#f4f5ef] p-4 text-[#203b32]" aria-label="Energy center engineering lab">
    <div className="mb-4 flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#5e7565]">ReClaim / Field lab 01</p><h3 className="mt-1 text-2xl font-bold">Inside the energy center</h3></div><span className="rounded-full bg-[#dde8d4] px-3 py-1 text-xs font-bold">3D</span></div>
    <div className="mb-4 grid grid-cols-3 gap-1 rounded-xl bg-[#e1e7dc] p-1" role="group" aria-label="Learning mode">{["Look inside","Follow the process","Try an experiment"].map(label=><button key={label} aria-pressed={mode===label} onClick={()=>setMode(label)} className={`min-h-12 rounded-lg px-2 text-xs font-bold ${mode===label?"bg-[#203b32] text-white":"text-[#203b32]"}`}>{label}</button>)}</div>
    <Suspense fallback={<div className="flex h-[340px] items-center justify-center rounded-2xl bg-[#e6ebe1]">Preparing your 3D exhibit…</div>}><EnergyModel cutaway={cutaway} stage={mode==="Try an experiment"?3:stage} heat={heat}/></Suspense>
    <div className="my-2 flex flex-wrap gap-3 text-[11px] font-semibold"><span>🟢 Material</span><span>🟡 Biogas</span><span>🔵 Electricity</span><span>🟠 Heat</span></div>
    <button className="my-3 min-h-11 w-full rounded-xl border border-[#7c9785] px-3 py-2 text-sm font-bold" aria-pressed={cutaway} onClick={()=>setCutaway(!cutaway)}>{cutaway?"Close the cutaway":"Open the digester cutaway"}</button>
    {mode!=="Try an experiment" ? <>
      <div className="my-3 grid grid-cols-2 gap-2">{process.map((p,i)=><button key={p.part} aria-pressed={stage===i} onClick={()=>{setStage(i);setCutaway(i===1);}} className={`min-h-11 rounded-xl border px-3 py-2 text-left text-xs font-bold ${stage===i?"border-[#203b32] bg-[#dcebc9]":"border-[#cbd6c6] bg-white"}`}>{p.part}</button>)}</div>
      <div aria-live="polite"><h4 className="mt-4 font-bold">{current.title}</h4><p className="mt-2 text-sm leading-relaxed text-[#4b6055]">{current.text}</p></div>
      {mode==="Follow the process" && <button onClick={()=>{setStage((stage+1)%4);setCutaway((stage+1)%4===1);}} className="mt-4 min-h-12 w-full rounded-xl bg-[#203b32] px-4 font-bold text-white">{stage===3?"Follow it again":"Next step →"}</button>}
    </> : <div>
      <h4 className="mt-4 text-lg font-bold">Can the same gas do more useful work?</h4><p className="mt-2 text-sm leading-relaxed">Keep the fuel input the same. Compare a generator with a system that also recovers heat for a nearby building.</p>
      <p className="mt-4 text-sm font-bold">Predict: what does recovering heat add?</p><div className="mt-2 grid grid-cols-2 gap-2">{["More biogas","Another useful energy output"].map(answer=><button key={answer} aria-pressed={prediction===answer} onClick={()=>{setPrediction(answer);setTested(false);}} className={`min-h-12 rounded-xl border p-2 text-xs font-bold ${prediction===answer?"bg-[#dcebc9] border-[#203b32]":"bg-white border-[#bdcdbf]"}`}>{answer}</button>)}</div>
      <button disabled={!prediction} onClick={()=>{setHeat(!heat);setTested(true);}} className="mt-3 min-h-12 w-full rounded-xl bg-[#203b32] px-3 font-bold text-white disabled:opacity-40">{heat?"Compare electricity only":"Try electricity + recovered heat"}</button>
      {tested && <div role="status" className="mt-3 rounded-xl bg-[#e2ebd8] p-4"><strong>{heat?"Two useful outputs: electricity + heat":"Electricity only: heat is not put to use here"}</strong><p className="mt-2 text-sm">{prediction==="More biogas"?"Recovering heat does not create more biogas. ":"Yes — heat can be another useful output. "}The orange route shows a possible heat use. Real benefits depend on equipment efficiency, losses and a nearby demand for that heat.</p></div>}
      <p className="mt-3 text-xs text-[#596c5f]">Qualitative learning experiment. No calculated yield, measured output or operating settings.</p>
    </div>}
    <details className="mt-5 border-t border-[#cbd6c6] pt-3 text-sm"><summary className="cursor-pointer font-bold">Go deeper · science & model limits</summary><p className="mt-3 leading-relaxed">Anaerobic digestion uses microbes in the absence of oxygen. Biogas includes methane and carbon dioxide. Digestate remains after digestion and needs appropriate processing and use. Composting is a separate, oxygen-dependent pathway.</p><p className="mt-2 leading-relaxed">This is a conceptual exhibit, not an engineering design or a live digital twin. Equipment is simplified; motion is accelerated. Facility data would be needed to calculate performance.</p><a className="mt-3 inline-block underline" href="https://www.epa.gov/anaerobic-digestion/basic-information-about-anaerobic-digestion" target="_blank" rel="noreferrer">Read the science · US EPA ↗</a></details>
  </section>;
}
