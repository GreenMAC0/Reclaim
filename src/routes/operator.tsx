import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bot, RotateCcw, Check, X, Pencil } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { GUIDANCE_MESSAGES, type GuidanceMessageId } from "@/lib/reclaim/rules";
import { Badge } from "@/components/ui/badge";
import {
  AGENT_RECOMMENDATION,
  ARTWORK_STAGES,
  CONTAMINATION_ITEMS,
  GUIDANCE_BEFORE_AFTER,
  PARTICIPATION_TREND,
  PROCESSOR_REPORTS,
  STATION_STATUS,
} from "@/lib/reclaim/data";
import { artworkProgress, stageIndexFor } from "@/lib/reclaim/progression";
import { useReclaim } from "@/lib/reclaim/store-context";

export const Route = createFileRoute("/operator")({
  head: () => ({
    meta: [
      { title: "Operator Dashboard — ReClaim Waste" },
      {
        name: "description",
        content:
          "Mock operations view: disposal events, recorded weight, contamination patterns, processor reports, and agent guidance review.",
      },
      { property: "og:title", content: "Operator Dashboard — ReClaim Waste" },
      {
        property: "og:description",
        content:
          "Problem spotted, guidance changed, performance measured — the ReClaim operations loop.",
      },
    ],
  }),
  component: Operator,
});

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 12,
} as const;

function Operator() {
  const { state, hydrated, reset } = useReclaim();
  const stageIndex = stageIndexFor(state.artworkCount);
  const { progress, next } = artworkProgress(state.artworkCount);

  return (
    <main className="min-h-screen bg-background px-8 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Operator dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            {STATION_STATUS.station} · All figures are mock demo data.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => reset()} className="gap-2 rounded-full">
            <RotateCcw className="size-4" /> Reset demo
          </Button>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm ring-1 ring-border"
          >
            <ArrowLeft className="size-4" /> Station
          </Link>
        </div>
      </header>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Disposal events"
          value={hydrated ? state.contributions.toLocaleString() : "—"}
        />
        <Stat
          label="Simulated deposited weight"
          value={hydrated ? `${Math.round(state.depositedLb).toLocaleString()} lb` : "—"}
          note="Internal operational metric."
        />
        <Stat
          label="Reported recovered · mock"
          value={hydrated ? `${Math.round(state.recoveredLb).toLocaleString()} lb` : "—"}
        />
        <Stat label="Contamination rate" value={`${state.contaminationRate}%`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-[2rem] bg-card p-7 ring-1 ring-border">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Participation trend
          </h2>
          <div className="mt-5 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PARTICIPATION_TREND}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="events" stroke="var(--chart-1)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[2rem] bg-card p-7 ring-1 ring-border">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Contamination before vs. after guidance change
            </h2>
            <Badge variant="secondary">Mock data</Badge>
          </div>
          <div className="mt-5 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GUIDANCE_BEFORE_AFTER}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} unit="%" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="rate" fill="var(--chart-2)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Illustrative historical comparison; approving a message does not generate a measured
            improvement.
          </p>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <section className="rounded-[2rem] bg-card p-7 ring-1 ring-border">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Most common contamination items
          </h2>
          <ul className="mt-5 space-y-4">
            {CONTAMINATION_ITEMS.map((c) => (
              <li key={c.item}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{c.item}</span>
                  <span className="text-muted-foreground">{c.count}</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-soil"
                    style={{ width: `${(c.count / 12) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <AgentPanel />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="rounded-[2rem] bg-card p-7 ring-1 ring-border">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Current station guidance
          </h2>
          <p className="mt-4 text-lg text-foreground">{state.guidance}</p>
        </section>

        <section className="rounded-[2rem] bg-card p-7 ring-1 ring-border">
          <h2 className="font-display text-xl font-semibold text-foreground">Artwork progress</h2>
          <p className="mt-4 text-lg text-foreground">
            {ARTWORK_STAGES[Math.max(0, stageIndex)]?.name} stage · {Math.round(progress * 100)}%
            toward {next ? next.name : "complete"}
          </p>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </section>

        <section className="rounded-[2rem] bg-card p-7 ring-1 ring-border">
          <h2 className="font-display text-xl font-semibold text-foreground">Station status</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Bin level" value={STATION_STATUS.bin} />
            <Row label="Last serviced" value={STATION_STATUS.lastServiced} />
            <Row label="Scale" value={STATION_STATUS.scale} />
          </dl>
        </section>
      </div>

      <section className="mt-6 rounded-[2rem] bg-card p-7 ring-1 ring-border">
        <h2 className="font-display text-xl font-semibold text-foreground">Processor reports</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-3 font-medium">Date</th>
                <th className="py-3 font-medium">Deposited</th>
                <th className="py-3 font-medium">Reported recovered · mock</th>
                <th className="py-3 font-medium">Compost produced</th>
                <th className="py-3 font-medium">Delivered to</th>
              </tr>
            </thead>
            <tbody>
              {PROCESSOR_REPORTS.map((r) => (
                <tr key={r.date} className="border-b border-border/60 last:border-0">
                  <td className="py-3 font-medium text-foreground">{r.date}</td>
                  <td className="py-3 text-muted-foreground">{r.deposited}</td>
                  <td className="py-3 text-muted-foreground">{r.recovered}</td>
                  <td className="py-3 text-muted-foreground">{r.compost}</td>
                  <td className="py-3 text-muted-foreground">{r.delivered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function AgentPanel() {
  const { state, setGuidance, rejectGuidance } = useReclaim();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<GuidanceMessageId>(
    state.agentHandled === "approved" ? state.guidanceMessageId : "cups",
  );

  return (
    <section className="rounded-[2rem] bg-primary p-7 text-primary-foreground">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Bot className="size-6" />
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold">ReClaim Agent</h2>
          <p className="text-sm text-primary-foreground/70">Recommendation for operator review</p>
        </div>
      </div>

      <p className="mt-5 text-sm text-primary-foreground/80">
        Contamination is concentrated in plastic cups (12), utensils (7), and foil (3). The demo
        recommendation emphasizes these exclusions while preserving the same accepted materials.
      </p>

      <div className="mt-5 rounded-2xl bg-primary-foreground/10 p-5">
        <p className="text-xs font-semibold tracking-widest text-primary-foreground/60 uppercase">
          Recommended resident guidance
        </p>
        {editing ? (
          <label className="mt-3 block text-sm">
            Choose a rule-consistent message
            <select
              aria-label="Guidance message"
              value={draft}
              onChange={(e) => setDraft(e.target.value as GuidanceMessageId)}
              className="mt-2 min-h-12 w-full rounded-xl bg-card px-3 text-foreground"
            >
              <option value="standard">Accepted materials</option>
              <option value="cups">Emphasize cups and utensils</option>
            </select>
            <span className="mt-3 block text-base">{GUIDANCE_MESSAGES[draft]}</span>
          </label>
        ) : (
          <p className="mt-3 text-xl leading-snug font-medium">{GUIDANCE_MESSAGES[draft]}</p>
        )}
      </div>

      {state.agentHandled === "pending" ? (
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            onClick={() => {
              setGuidance(draft);
              setEditing(false);
            }}
            className="gap-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Check className="size-4" /> Approve
          </Button>
          <Button
            variant="outline"
            onClick={() => setEditing((v) => !v)}
            className="gap-2 rounded-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Pencil className="size-4" /> {editing ? "Done editing" : "Edit"}
          </Button>
          <Button
            variant="outline"
            onClick={rejectGuidance}
            className="gap-2 rounded-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            <X className="size-4" /> Reject
          </Button>
        </div>
      ) : (
        <p className="mt-5 text-sm text-primary-foreground/80">
          {state.agentHandled === "approved"
            ? "Approved — station guidance updated immediately."
            : "Rejected — station guidance unchanged."}
        </p>
      )}

      <p className="mt-4 text-xs text-primary-foreground/60">
        Scripted demo recommendation. Messages and helper answers use one fixed demo policy;
        changing the message never changes acceptance rules.
      </p>
    </section>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-[2rem] bg-card p-7 ring-1 ring-border">
      <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-3 font-display text-3xl font-semibold text-foreground">{value}</p>
      {note ? <p className="mt-2 text-sm text-muted-foreground">{note}</p> : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
