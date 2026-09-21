import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, ArrowLeft } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Artwork } from "@/components/reclaim/Artwork";
import { CONTAMINATION_TREND, PROCESSOR_REPORTS } from "@/lib/reclaim/data";
import { useReclaim } from "@/lib/reclaim/store-context";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Community Impact — ReClaim Waste" },
      {
        name: "description",
        content:
          "Verified participation, material collected, recovered material, contamination trend, and where finished compost was delivered.",
      },
      { property: "og:title", content: "Community Impact — ReClaim Waste" },
      {
        property: "og:description",
        content: "An illustrative community recovery report using clearly labeled mock data.",
      },
    ],
  }),
  component: Impact,
});

function Impact() {
  const { state, hydrated } = useReclaim();
  const totalCompost = PROCESSOR_REPORTS.reduce((sum, r) => sum + parseInt(r.compost, 10), 0);

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-8 sm:py-8">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground sm:size-11">
            <Leaf className="size-5 sm:size-6" />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-xl leading-tight font-semibold tracking-tight text-foreground sm:text-3xl">
              Community impact
            </h1>
            <p className="truncate text-xs text-muted-foreground sm:text-sm">
              Livernois &amp; Curtis · mock demo data
            </p>
          </div>
        </div>
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 rounded-full bg-card px-3 py-2 text-xs ring-1 ring-border sm:px-5 sm:py-2.5 sm:text-sm"
        >
          <ArrowLeft className="size-4" /> <span className="hidden sm:inline">Back to station</span>
          <span className="sm:hidden">Station</span>
        </Link>
      </header>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <Stat
          label="Community contributions · demo"
          value={hydrated ? state.contributions.toLocaleString() : "—"}
        />
        <Stat
          label="Material collected (deposited)"
          value={hydrated ? `${Math.round(state.depositedLb).toLocaleString()} lb` : "—"}
        />
        <Stat
          label="Reported recovered material · mock"
          value={hydrated ? `${Math.round(state.recoveredLb).toLocaleString()} lb` : "—"}
          note="Historical sample processor total. New simulated deposits do not change it."
        />
        <Stat
          label="Compost produced"
          value={`${totalCompost.toLocaleString()} lb`}
          note="From sample processor records."
        />
      </div>

      <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-[1.75rem] bg-card p-5 ring-1 ring-border sm:rounded-[2rem] sm:p-7">
          <h2 className="font-display text-lg font-semibold text-foreground sm:text-xl">
            Contamination trend
          </h2>
          <p className="text-sm text-muted-foreground">Share of loads with non-organic items.</p>
          <div className="mt-5 h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CONTAMINATION_TREND}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--chart-1)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <Artwork contributions={state.artworkCount} className="min-h-72" />
      </div>

      <section className="mt-4 rounded-[1.75rem] bg-card p-5 ring-1 ring-border sm:mt-6 sm:rounded-[2rem] sm:p-7">
        <h2 className="font-display text-lg font-semibold text-foreground sm:text-xl">
          Where finished compost went
        </h2>
        <div className="-mx-5 mt-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-3 font-medium">Processor report</th>
                <th className="py-3 font-medium">Deposited</th>
                <th className="py-3 font-medium">Reported recovered</th>
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
        <p className="mt-5 text-sm text-muted-foreground">
          All figures are illustrative demo data. New drop-offs change deposited totals only;
          recovered material and compost remain tied to the sample processor reports.
        </p>
      </section>
    </main>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-[1.75rem] bg-card p-5 ring-1 ring-border sm:rounded-[2rem] sm:p-7">
      <p className="text-[0.7rem] font-semibold tracking-widest text-muted-foreground uppercase sm:text-xs">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold text-foreground sm:mt-3 sm:text-4xl">
        {value}
      </p>
      {note ? <p className="mt-2 text-sm text-muted-foreground">{note}</p> : null}
    </div>
  );
}
