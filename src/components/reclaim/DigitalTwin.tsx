import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Gamepad2, Sprout, Trees, Palette, ArrowRight } from "lucide-react";
import { NeighborhoodMap } from "./NeighborhoodMap";
import { SceneSimulation } from "./SceneSimulation";
import { PLACES } from "@/lib/reclaim/catalog";
import { useReclaim } from "@/lib/reclaim/store-context";

const milestones = [
  { at: 1, name: "Plant a seed", description: "Your first virtual seedling", Icon: Sprout },
  { at: 3, name: "Grow a garden", description: "A little green becomes a shared space", Icon: Trees },
  { at: 5, name: "Color the block", description: "Art celebrates your continued participation", Icon: Palette },
];

export function DigitalTwin() {
  const [mode, setMode] = useState<"neighborhood" | "play">("play");
  const [selectedId, setSelectedId] = useState("st-04");
  const { state, startVisit } = useReclaim();
  const selected = PLACES.find(place => place.id === selectedId)!;
  const next = milestones.find(m => state.myDrops < m.at);
  return <section className="mt-5 space-y-5" aria-label="Digital twin">
    <div className="rounded-3xl bg-[#143f36] p-6 text-white">
      <p className="text-xs font-bold uppercase tracking-widest text-[#bde9df]">Your digital twin</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight">One neighborhood.<br />Two ways to grow.</h1>
      <p className="mt-3 text-sm leading-relaxed text-[#d2eee6]">Discover how scraps become resources. Build habits in your playable world, then connect them to change on your block.</p>
      <p className="mt-4 text-xs text-[#d2eee6]">Prototype · sample locations and simulated activity</p>
    </div>
    <div className="grid grid-cols-2 gap-2" role="group" aria-label="Digital twin view">
      {([{ id: "neighborhood", label: "Neighborhood", Icon: MapPin }, { id: "play", label: "Playable world", Icon: Gamepad2 }] as const).map(({ id, label, Icon }) => <button key={id} aria-pressed={mode === id} onClick={() => setMode(id)} className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 px-2 text-sm font-bold ${mode === id ? "border-[#143f36] bg-[#143f36] text-white" : "border-[#c7dcd4] bg-white text-[#143f36]"}`}><Icon className="size-5" />{label}</button>)}
    </div>
    {mode === "neighborhood" ? <>
      <div><h2 className="text-xl font-bold">Follow the neighborhood loop</h2><p className="mt-1 text-sm text-muted-foreground">Tap a place to explore its role. This illustrated Detroit model is not a live map or a list of confirmed partners.</p></div>
      <NeighborhoodMap places={PLACES} selectedId={selectedId} onSelect={setSelectedId} />
      <div className="rounded-2xl border border-border bg-white p-5" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#34716e]">Sample {selected.kind} · {selected.neighborhood}</p>
        <h3 className="mt-2 text-lg font-bold">{selected.name}</h3>
        <p className="mt-2 text-sm">{selected.kind === "station" ? "Collection connects everyday participation to the recovery system." : selected.kind === "compost" ? "Processing turns accepted organics into usable compost." : selected.kind === "garden" ? "A garden can put finished compost to work building healthier soil." : "Community spaces show where future neighborhood improvements could take shape."}</p>
        <p className="mt-3 rounded-xl bg-[#f3f6ef] p-3 text-sm">Live status: not connected. Collection weights, processor reports and project updates will be needed to verify physical change.</p>
      </div>
      <div className="rounded-2xl border border-border bg-white p-5">
        <h3 className="font-bold">Scraps → compost → neighborhood</h3>
        <p className="mt-1 text-xs text-muted-foreground">Illustrative flow · no verified shipment or delivery</p>
        <div className="mt-4 space-y-2">{["1. Station records an accepted drop", "2. Processor confirms recovered material", "3. Garden confirms compost received"].map(step => <p key={step} className="rounded-xl bg-[#edf5f0] p-3 text-sm">{step}</p>)}</div>
        <button onClick={() => setMode("play")} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#143f36] px-3 font-bold text-white">See your playable world <ArrowRight className="size-4" /></button>
      </div>
    </> : <>
      <div className="overflow-hidden rounded-3xl bg-[#080d19] text-white"><SceneSimulation /></div>
      <div className="rounded-3xl bg-[#e3efdf] p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-[#34716e]">Your growing virtual block</p>
        <div className="my-5 flex min-h-24 items-end justify-center gap-5" aria-label={`${milestones.filter(m => state.myDrops >= m.at).length} virtual improvements unlocked`}>
          {milestones.map(({ at, name, Icon }) => <div key={at} className={`text-center ${state.myDrops >= at ? "text-[#176147]" : "text-[#7a897e] opacity-50"}`}><Icon className="mx-auto mb-2 size-12" /><span className="text-xs font-semibold">{state.myDrops >= at ? name : `${at} drops`}</span></div>)}
        </div>
        <h2 className="text-xl font-bold">{state.myDrops} personal demo {state.myDrops === 1 ? "drop" : "drops"}</h2>
        <p className="mt-2 text-sm">{next ? `${next.at - state.myDrops} more to unlock “${next.name}”.` : "Your seedling, garden and community art are unlocked."} Virtual milestones use your simulated personal drops on this device.</p>
        <Link to="/station" onClick={startVisit} className="mt-4 flex min-h-12 items-center justify-center rounded-xl bg-[#143f36] px-3 font-bold text-white">Start a simulated station visit</Link>
      </div>
      <div className="rounded-2xl border border-border bg-white p-5"><h3 className="font-bold">Practice. Participate. See growth.</h3><p className="mt-2 text-sm leading-relaxed">Sorting practice gives immediate feedback. Repeated station visits build a routine. Visible virtual growth makes progress easier to recognize and gives you a reason to return.</p><p className="mt-3 text-xs text-muted-foreground">Practice never counts as a drop. Virtual gardens and rewards do not represent real planting, compost delivery or measured environmental impact.</p></div>
    </>}
  </section>;
}
