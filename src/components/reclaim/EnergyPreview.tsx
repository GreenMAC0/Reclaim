import { lazy, Suspense, useState } from "react";
const EnergyLab = lazy(() => import("./EnergyLab"));
import { useReclaim } from "@/lib/reclaim/store-context";
import { Zap, ArrowRight } from "lucide-react";

const steps = [
  { title: "Scraps with a second life", copy: "Start with food scraps that can’t be eaten. Explore how their stored energy could help a neighborhood.", button: "Follow scraps into the digester" },
  { title: "Tiny microbes. Big possibility.", copy: "Inside a sealed digester, microbes break down food scraps without oxygen and produce biogas. This takes time in real life.", button: "Collect the biogas" },
  { title: "Turn gas into useful energy", copy: "Captured biogas can fuel a generator to produce electricity and heat. This is a different process from ordinary composting.", button: "Power the community center" },
  { title: "A brighter place to gather", copy: "Imagine recovered energy supporting a neighborhood space. The lights here are a virtual illustration, not a claim of energy produced.", button: "Explore again" },
];
export function EnergyPreview() {
  const { state, hydrated, advanceEnergyMission, recordDisposal, learnRule } = useReclaim();
  const [feedback, setFeedback] = useState("");
  const mission = state.energyMissionStep;
  const step = Math.max(0, mission - 2);
  const lit = step === 3;
  const current = steps[step]!;
  return <section className="overflow-hidden rounded-3xl border border-white/15 bg-[#102624] text-white" aria-label="Power the neighborhood preview">
    <div className="px-5 pt-5"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#b9e88e]"><Zap size={15} /> Food scraps → possibility</p><h2 className="mt-2 text-2xl font-bold">Power the neighborhood</h2><p className="mt-2 text-xs text-white/65">Your first mission · simulated energy pathway</p></div>
    <div className="mx-5 mt-4 flex gap-2 text-xs" aria-label="Mission progress">{["Sort", "Demo drop", "Energy", "Reward"].map((label, i) => <span key={label} className={`flex-1 rounded-lg px-2 py-2 text-center ${mission >= [1,2,5,5][i]! ? "bg-[#c5ed8b] text-[#15382b]" : "bg-white/10 text-white"}`}>{label}</span>)}</div>
    {mission < 2 && <div className="m-5 rounded-2xl bg-white/10 p-5">
      <h3 className="text-xl font-bold">{mission === 0 ? "First, keep the scraps clean" : "Make your first demo drop"}</h3>
      <p className="my-3 text-sm leading-relaxed">{mission === 0 ? "Your food scraps are in a plastic cup. What goes into the organics station?" : "Sorting complete. Simulate a food-scrap drop at Station 04 to follow its possible energy journey."}</p>
      {mission === 0 ? <div className="grid gap-3">
        <button disabled={!hydrated} onClick={() => { learnRule("Plastic cup"); advanceEnergyMission(); setFeedback(""); }} className="min-h-12 rounded-xl bg-[#c5ed8b] p-3 font-bold text-[#15382b]">Food scraps only · keep the cup out</button>
        <button onClick={() => setFeedback("Keep plastic out: it contaminates the organics stream. Empty the scraps and follow local guidance for the cup.")} className="min-h-12 rounded-xl border border-white/40 p-3 font-semibold">Scraps and the plastic cup</button>
        <p role="status" className="text-sm text-[#f8d477]">{feedback}</p>
      </div> : <button disabled={!hydrated} onClick={() => recordDisposal({participant: "resident"})} className="min-h-12 w-full rounded-xl bg-[#c5ed8b] p-3 font-bold text-[#15382b]">Simulate my station drop →</button>}
      <p className="mt-3 text-xs text-white/65">Practice builds the habit: separate scraps, keep contaminants out, repeat. This mission records demo participation only.</p>
    </div>}
    <Suspense fallback={<p className="p-5">Opening the energy center…</p>}><EnergyLab /></Suspense>
    {lit && <svg viewBox="0 0 500 330" className="mt-4 w-full" role="img" aria-label={lit ? "Community center glowing with virtual recovered energy" : "Food scraps, a digester, a generator and an unlit community center"}>
      <defs><linearGradient id="energySky" x2="0" y2="1"><stop stopColor={lit ? "#283c52" : "#0c1a2b"}/><stop offset="1" stopColor="#294b47"/></linearGradient><radialGradient id="energyGlow"><stop stopColor="#fbd477" stopOpacity=".5"/><stop offset="1" stopColor="#fbd477" stopOpacity="0"/></radialGradient></defs>
      <rect width="500" height="330" fill="url(#energySky)"/><circle cx="422" cy="40" r="16" fill="#efe4b4"/>
      {[45,102,198,280,350].map((x,i)=><circle key={x} cx={x} cy={28+i%3*18} r="1.5" fill="#c7e5d5"/>)}
      <path d="M0 200 Q100 158 190 190 T500 183 V330 H0Z" fill="#315e4b"/><path d="M0 278 Q230 235 500 287" fill="none" stroke="#789582" strokeWidth="25"/>
      {lit && <ellipse cx="389" cy="189" rx="125" ry="118" fill="url(#energyGlow)"/>}
      <g transform="translate(25 145)"><rect y="18" width="63" height="77" rx="9" fill="#7ca97a"/><rect x="-4" y="12" width="71" height="12" rx="4" fill="#b8d8a0"/><path d="M20 51 Q28 31 43 43 Q40 64 20 65Z" fill="#daedb0"/><text x="31" y="119" textAnchor="middle" fill="white" fontSize="12">SCRAPS</text></g>
      <path d="M92 204 H124" stroke={step>0 ? '#c5ed8b':'#628777'} strokeWidth="6" strokeDasharray="7 5"/>
      <g transform="translate(132 120)"><path d="M0 48 Q0 0 51 0 Q102 0 102 48 V112 H0Z" fill="#609d91" stroke="#b4d7ba" strokeWidth="3"/><rect y="58" width="102" height="54" fill="#376f62"/><path d="M9 74 Q30 62 51 74 T94 74" fill="none" stroke="#b6d291" strokeWidth="3"/>
      {step>0 && [25,51,76].map((x,i)=><circle key={x} cx={x} cy={40+i*8} r="5" fill="#d9f9a0"><animate attributeName="cy" values={`${65+i*5};20;65`} dur={`${2+i*.4}s`} repeatCount="indefinite"/></circle>)}
      <text x="51" y="142" textAnchor="middle" fill="white" fontSize="12">DIGESTER</text></g>
      <path d="M184 119 V92 H277 V189" fill="none" stroke={step>1?'#f8d477':'#628777'} strokeWidth="7"/>
      <text x="234" y="80" textAnchor="middle" fill="#e5e5be" fontSize="11">BIOGAS</text>
      <g transform="translate(250 190)"><rect width="54" height="43" rx="7" fill="#c6b27e"/><path d="M31 7 L18 25 H29 L24 37 L40 18 H28Z" fill={step>1?'#fff4a8':'#62573e'}/><text x="27" y="73" textAnchor="middle" fill="white" fontSize="10">GENERATOR</text></g>
      <path d="M306 211 H328" stroke={lit?'#ffe89a':'#628777'} strokeWidth="5"/>
      <g transform="translate(331 133)"><rect y="25" width="144" height="105" rx="3" fill="#b18068"/><path d="M-8 25 L72 -9 L153 25Z" fill="#d6b894"/><rect x="17" y="38" width="110" height="20" rx="3" fill="#223c39"/><text x="72" y="52" textAnchor="middle" fill="#e4ecd4" fontSize="9">COMMUNITY CENTER</text>
      {[16,57,98].map(x=><rect key={x} x={x} y="69" width="28" height="35" rx="2" fill={lit?'#ffe496':'#344e53'}/>)}<rect x="60" y="108" width="24" height="22" fill="#4b5545"/></g>
      <text x="250" y="311" textAnchor="middle" fill="#d7e7d5" fontSize="11">{lit ? "A virtual glimpse of what recovery could make possible" : "Follow the energy from scraps to shared spaces"}</text>
    </svg>}
    {mission >= 2 && <div className="p-5"><div className="mb-4 flex gap-2" aria-label={`Step ${step+1} of 4`}>{steps.map((_,i)=><span key={i} className={`h-1.5 flex-1 rounded-full ${i<=step?'bg-[#c5ed8b]':'bg-white/15'}`}/>)}</div><div aria-live="polite"><h3 className="text-lg font-bold">{current.title}</h3><p className="mt-2 min-h-20 text-sm leading-relaxed text-[#d1dfd7]">{current.copy}</p></div>
      {!lit && <button disabled={!hydrated} onClick={advanceEnergyMission} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#c5ed8b] px-4 font-bold text-[#15382b]">{current.button}<ArrowRight size={18}/></button>}
      {lit && <p role="status" className="mt-4 rounded-xl bg-[#c5ed8b] p-4 font-bold text-[#15382b]">✓ Neighborhood light unlocked · progress saved on this device</p>}
      <p className="mt-3 text-xs leading-relaxed text-white/60">Your drop is simulated. No real energy production is recorded. Remaining digested material needs appropriate treatment and use. <a className="underline" href="https://www.epa.gov/anaerobic-digestion/basic-information-about-anaerobic-digestion" target="_blank" rel="noreferrer">How it works · EPA</a></p>
    </div>}
  </section>;
}
