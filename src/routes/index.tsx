import { createFileRoute } from "@tanstack/react-router";
import { SceneSimulation } from "@/components/reclaim/SceneSimulation";
import { ViewNavigation } from "@/components/reclaim/ViewNavigation";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "ReClaim — Playable world" }] }),
  component: Home,
});
function Home() {
  return <main className="min-h-dvh bg-[#080d19] text-white">
    <div className="mx-auto max-w-lg"><h1 className="px-5 py-3 text-lg font-bold">ReClaim · Playable world</h1><SceneSimulation /></div>
    <ViewNavigation />
  </main>;
}
