import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Leaf,
  MapPin,
  Compass,
  Trophy,
  User,
  Repeat,
  Monitor,
  Check,
  Navigation,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  Trees,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NeighborhoodMap } from "@/components/reclaim/NeighborhoodMap";
import { Artwork } from "@/components/reclaim/Artwork";
import {
  ARTWORK_STAGES,
  CHALLENGES,
  LOOP_STEPS,
  PLACES,
  PLACE_KIND_LABELS,
  type Place,
} from "@/lib/reclaim/data";
import { artworkProgress, stageIndexFor } from "@/lib/reclaim/progression";
import { HelperOverlay } from "@/components/reclaim/HelperOverlay";
import { canCheckIn } from "@/lib/reclaim/model";
import { useReclaim } from "@/lib/reclaim/store-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "ReClaim Waste — Explore your neighborhood" },
      {
        name: "description",
        content:
          "Find ReClaim stations, gardens, and compost sites across Detroit, take on community challenges, and watch the neighborhood artwork grow.",
      },
      { property: "og:title", content: "ReClaim Waste — Explore your neighborhood" },
      {
        property: "og:description",
        content: "A map-driven companion for food-waste recovery in Detroit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PhoneApp,
});

type Tab = "explore" | "challenges" | "journey" | "loop";

function PhoneApp() {
  const [tab, setTab] = useState<Tab>("explore");
  const [practice, setPractice] = useState(false);
  const { state, hydrated, learnRule } = useReclaim();

  return (
    <main className="phone-shell mx-auto flex min-h-dvh max-w-md flex-col px-5 pt-6 pb-28">
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#176786] text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="font-display truncate text-xl leading-none font-bold tracking-tight text-foreground">
              ReClaim.
            </p>
            <p className="truncate text-xs text-muted-foreground">Your personal companion</p>
          </div>
        </div>
        <Link
          to="/"
          title="Open the shared station"
          aria-label="Open the shared station"
          className="flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-card px-3 text-[10px] font-semibold text-primary ring-1 ring-border"
        >
          <Monitor className="size-3.5" /> Shared station
        </Link>
      </header>

      <div className="mt-6 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#34716e]">
          <span className="size-1.5 rounded-full bg-[#21a77b]" /> Detroit, Michigan
        </span>
        <span className="text-[9px] text-muted-foreground">Prototype · mock activity</span>
      </div>
      {!hydrated ? (
        <p role="status" className="mt-6">
          Loading your demo journey…
        </p>
      ) : (
        <>
          {tab === "explore" && <ExploreTab onLoop={() => setTab("loop")} />}
          {tab === "challenges" && (
            <ChallengesTab
              onExplore={() => setTab("explore")}
              onPractice={() => setPractice(true)}
              onLoop={() => setTab("loop")}
            />
          )}
          {tab === "journey" && <JourneyTab />}
          {tab === "loop" && <LoopTab />}
        </>
      )}
      {practice && (
        <HelperOverlay
          guidance={state.guidance}
          onClose={() => setPractice(false)}
          onLearn={learnRule}
        />
      )}

      <nav className="phone-nav fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md gap-1.5 border-t border-border bg-card/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <TabButton
          active={tab === "explore"}
          onClick={() => setTab("explore")}
          icon={<Compass className="size-5" />}
        >
          Explore
        </TabButton>
        <TabButton
          active={tab === "challenges"}
          onClick={() => setTab("challenges")}
          icon={<Trophy className="size-5" />}
        >
          Challenges
        </TabButton>
        <TabButton
          active={tab === "journey"}
          onClick={() => setTab("journey")}
          icon={<User className="size-5" />}
        >
          Journey
        </TabButton>
        <TabButton
          active={tab === "loop"}
          onClick={() => setTab("loop")}
          icon={<Repeat className="size-5" />}
        >
          The loop
        </TabButton>
      </nav>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const { hydrated } = useReclaim();
  return (
    <button
      type="button"
      disabled={!hydrated}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[0.65rem] font-semibold transition-colors",
        active ? "bg-[#d4f1e6] text-[#105844]" : "text-muted-foreground hover:bg-secondary",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function ExploreTab({ onLoop }: { onLoop: () => void }) {
  const { state, visitPlace, joinProject, startVisit } = useReclaim();
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("all");
  const visiblePlaces = PLACES.filter((p) => filter === "all" || p.kind === filter);
  const [selectedId, setSelectedId] = useState(PLACES[0]!.id);
  const selected = PLACES.find((p) => p.id === selectedId) ?? PLACES[0]!;
  const visited = state.visitedPlaceIds.includes(selected.id);
  const count = state.stationArtworkCounts[selected.id];
  const artwork = count == null ? null : artworkProgress(count);
  const stage = count == null ? null : ARTWORK_STAGES[Math.max(0, stageIndexFor(count))];
  const percent = artwork ? Math.round(artwork.progress * 100) : selected.progress;
  const pickPlace = (id: string) => {
    setSelectedId(id);
    setNotice("");
  };

  return (
    <div className="mt-3 flex flex-col gap-4">
      <div>
        <h1 className="font-display text-[34px] leading-[1.08] font-semibold tracking-[-0.04em] text-[#123d58]">
          A little exploring.
          <br />
          <span className="text-[#22836e]">A greener block.</span>
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
          Find your place in a neighborhood that grows together.
        </p>
      </div>
      <section className="rounded-3xl bg-[#164e70] p-5 text-white">
        <p className="text-xs uppercase tracking-widest text-[#9cf0ca]">Your next small act</p>
        <h2 className="mt-2 text-xl font-semibold">
          {state.activeVisit
            ? "Your station visit is ready"
            : state.myDrops
              ? "Come back with your next food scraps"
              : "Help your neighborhood artwork grow"}
        </h2>
        <p className="mt-2 text-sm text-white/80">
          {state.myDrops
            ? `${state.myDrops} simulated drop-off${state.myDrops === 1 ? "" : "s"} saved. Next time, try another item and see what changes together.`
            : "Find a station, check what belongs, then add your small act to a shared canvas."}
        </p>
        {state.myDrops > 0 && (
          <Artwork contributions={state.artworkCount} className="mt-4 aspect-[4/3] rounded-2xl" />
        )}
        <p className="mt-3 text-xs text-white/70">
          Art progress is a game reward. Compost deliveries are recorded separately.
        </p>
      </section>
      <div className="flex gap-2" aria-label="Filter locations">
        {[
          ["all", "All places"],
          ["station", "Stations"],
          ["garden", "Gardens"],
          ["project", "Projects"],
        ].map(([id, label]) => (
          <button
            type="button"
            key={id}
            aria-pressed={filter === id}
            onClick={() => {
              setFilter(id!);
              const first = PLACES.find((p) => id === "all" || p.kind === id);
              if (first) pickPlace(first.id);
            }}
            className={cn(
              "min-h-10 rounded-full px-3.5 text-[11px] font-semibold transition-colors",
              filter === id
                ? "bg-[#164e70] text-white shadow-sm"
                : "bg-white/80 text-[#537686] ring-1 ring-[#d9e8eb]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <NeighborhoodMap places={visiblePlaces} selectedId={selected.id} onSelect={pickPlace} />

      <section className="phone-card relative rounded-[1.75rem] bg-card p-5">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-[#278573] uppercase">
          <span className="size-1.5 rounded-full bg-[#42c399]" />
          {PLACE_KIND_LABELS[selected.kind]} · {selected.neighborhood}
        </p>
        <p className="font-display mt-2 text-xl leading-snug font-semibold text-foreground">
          {selected.name.replace(/^Station \d+ — /, "")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground">
            <Navigation className="size-3.5" /> {selected.distanceMi} mi away
          </span>
          {visited ? (
            <span className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-primary-foreground">
              <Check className="size-3.5" /> Visited
            </span>
          ) : null}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {selected.kind === "station" ? state.guidance : selected.accepts}
        </p>

        <div className="mt-4">
          <div className="flex items-baseline justify-between text-xs text-muted-foreground">
            <span>
              {artwork
                ? artwork.next
                  ? `Toward ${artwork.next.name}`
                  : "Artwork complete"
                : selected.progressLabel}
            </span>
            <span className="font-semibold text-foreground">{percent}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <p className="mt-4 text-sm text-foreground">
          {stage
            ? `${selected.name.split(" — ")[1]} artwork · ${stage.name} · stage ${stage.id} of ${ARTWORK_STAGES.length}`
            : selected.artwork}
        </p>

        {selected.challenge ? (
          <p className="mt-4 rounded-2xl bg-[#edf7f2] px-4 py-3 text-xs font-medium text-[#286955]">
            Active challenge · {selected.challenge}
          </p>
        ) : null}

        {canCheckIn(selected.id) && !visited ? (
          <Button
            onClick={() => {
              visitPlace(selected.id);
              setNotice("Demo check-in saved to your journey.");
            }}
            className="mt-5 min-h-14 w-full rounded-2xl text-base font-semibold"
          >
            Check in here · demo
          </Button>
        ) : null}
        {selected.kind === "station" && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-primary">
              {selected.id === "st-04"
                ? "Ready for a demo visit"
                : "Not available in this pilot demo"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sample station availability · not live operating hours.
            </p>
            {selected.id === "st-04" && (
              <Link
                to="/"
                onClick={startVisit}
                className="mt-4 flex min-h-14 items-center justify-center rounded-2xl bg-primary px-4 text-center font-semibold text-primary-foreground"
              >
                {state.activeVisit ? "Continue at the station" : "Start my station visit"}
              </Link>
            )}
          </div>
        )}
        {selected.id === "pj-03" && visited && !state.joinedProjectIds.includes(selected.id) && (
          <Button
            variant="secondary"
            className="mt-3 min-h-14 w-full rounded-2xl"
            onClick={() => {
              joinProject(selected.id);
              setNotice("Build day joined in this demo. Season badge earned.");
            }}
          >
            Join build day · demo
          </Button>
        )}
        {state.joinedProjectIds.includes(selected.id) && (
          <p className="mt-3 text-sm text-primary">Build day joined · demo</p>
        )}
        {selected.kind === "station" && (
          <p className="mt-3 text-xs text-muted-foreground">
            This walkthrough connects your visit in this browser. No GPS or hardware verification.
          </p>
        )}
        {notice && (
          <p role="status" className="mt-3 text-sm font-medium text-primary">
            {notice}
          </p>
        )}
      </section>

      <button
        type="button"
        onClick={onLoop}
        className="personal-hero flex items-center gap-4 rounded-[24px] p-5 text-left text-white"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
          <Repeat className="size-6 text-[#9cf0ca]" />
        </span>
        <span className="flex-1">
          <span className="text-[9px] uppercase tracking-[0.16em] text-[#b5e3e7]">
            Follow the good
          </span>
          <span className="font-display mt-1 block text-lg font-semibold">
            From your scraps to new life.
          </span>
        </span>
        <ArrowUpRight className="size-5 shrink-0 text-[#b3f5db]" />
      </button>
      <div className="mt-2 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Places to make a difference</h2>
        <span className="text-xs text-muted-foreground">{visiblePlaces.length} places</span>
      </div>
      <ul className="flex flex-col gap-3">
        {visiblePlaces.map((place) => (
          <li key={place.id}>
            <button
              type="button"
              onClick={() => pickPlace(place.id)}
              className={cn(
                "flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left ring-1 transition-colors",
                place.id === selected.id
                  ? "bg-secondary ring-transparent"
                  : "bg-card ring-border hover:bg-secondary/60",
              )}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {place.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {PLACE_KIND_LABELS[place.kind]}
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-primary">
                {place.distanceMi} mi
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChallengesTab({
  onExplore,
  onPractice,
  onLoop,
}: {
  onExplore: () => void;
  onPractice: () => void;
  onLoop: () => void;
}) {
  const { state } = useReclaim();
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold">Community challenges</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {state.completedChallengeIds.length} of {CHALLENGES.length} complete · rewards come from
          taking part, not from throwing more away.
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {CHALLENGES.map((challenge) => {
          const complete = state.completedChallengeIds.includes(challenge.id);
          return (
            <li
              key={challenge.id}
              className={cn(
                "rounded-[1.75rem] p-5 ring-1",
                complete
                  ? "bg-primary text-primary-foreground ring-transparent"
                  : "bg-card ring-border",
              )}
            >
              <div className="flex items-start gap-3">
                {complete ? (
                  <Check className="mt-1 size-5 shrink-0" />
                ) : (
                  <Trophy className="mt-1 size-5 shrink-0 text-primary" />
                )}
                <div>
                  <h2 className="font-sans text-base font-semibold">{challenge.title}</h2>
                  <p className="mt-1 text-sm opacity-80">{challenge.detail}</p>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold">
                {complete
                  ? "Completed"
                  : `${state.challengeSteps[challenge.id] ?? 0} of ${challenge.steps} steps`}{" "}
                · {challenge.reward}
              </p>
              {!complete && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    className="min-h-11 rounded-xl"
                    onClick={challenge.id === "ch-learn" ? onPractice : onExplore}
                  >
                    {challenge.id === "ch-learn" ? "Practice sorting" : "Explore locations"}
                  </Button>
                  {challenge.id === "ch-garden" && (
                    <Button variant="outline" className="min-h-11 rounded-xl" onClick={onLoop}>
                      Discover the loop
                    </Button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted-foreground">
        Progress comes from your demo actions. Station visitors are counted separately.
      </p>
    </div>
  );
}

function JourneyTab() {
  const { state, hydrated } = useReclaim();
  const index = stageIndexFor(state.artworkCount);
  const { progress, next } = artworkProgress(state.artworkCount);

  return (
    <div className="mt-6 flex flex-col gap-4">
      <section className="personal-hero rounded-[1.75rem] p-6 text-primary-foreground">
        <p className="text-[0.7rem] font-semibold tracking-widest uppercase opacity-80">
          Your personal journey
        </p>
        <p className="font-display mt-2 text-5xl leading-none font-semibold">
          {hydrated ? state.myDrops : "—"}
        </p>
        <p className="mt-2 text-sm opacity-90">times you helped ReClaim something</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <span className="rounded-2xl bg-primary-foreground/15 px-4 py-3">
            {state.visitedPlaceIds.length} locations visited
          </span>
          <span className="rounded-2xl bg-primary-foreground/15 px-4 py-3">
            {state.completedChallengeIds.length} challenges done
          </span>
        </div>
      </section>

      <Artwork contributions={state.artworkCount} className="aspect-[4/3]" />
      <section className="rounded-[1.75rem] bg-card p-5 ring-1 ring-border">
        <p className="text-sm text-muted-foreground">
          {next
            ? `Your neighborhood is ${Math.round(progress * 100)}% of the way to the next artwork milestone (stage ${Math.max(1, index + 1)} of ${ARTWORK_STAGES.length}).`
            : "Your neighborhood reached its final artwork milestone."}
        </p>
      </section>

      <section className="rounded-[1.75rem] bg-secondary p-5">
        <p className="text-[0.7rem] font-semibold tracking-widest text-secondary-foreground/70 uppercase">
          Badges
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {state.badges.map((badge) => (
            <li
              key={badge.id}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold",
                badge.earned
                  ? "bg-accent text-accent-foreground"
                  : "bg-background/60 text-muted-foreground",
              )}
            >
              {badge.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[1.75rem] bg-card p-5 ring-1 ring-border">
        <p className="text-[0.7rem] font-semibold tracking-widest text-muted-foreground uppercase">
          Our neighborhood
        </p>
        <ul className="mt-3 grid grid-cols-2 gap-3">
          {[
            { label: "Community contributions", value: state.contributions.toLocaleString() },
            { label: "Material recovered", value: `${state.recoveredLb.toLocaleString()} lb` },
            { label: "Compost produced", value: `${state.compostLb.toLocaleString()} lb` },
            { label: "Sites receiving compost", value: "3" },
          ].map((m) => (
            <li key={m.label} className="rounded-2xl bg-secondary px-4 py-3">
              <p className="font-display text-xl font-semibold text-secondary-foreground">
                {m.value}
              </p>
              <p className="mt-1 text-xs text-secondary-foreground/70">{m.label}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-xs text-muted-foreground">
        Community totals include mock historical data. Recovery figures are sample processor
        records, not estimates from new drop-offs.
      </p>
    </div>
  );
}

function LoopTab() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { state, readLoopStep } = useReclaim();

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div>
        <h1 className="font-display text-2xl leading-tight font-semibold text-foreground">
          Where your scraps go
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Tap a step to learn more.</p>
      </div>

      <ol className="flex flex-col gap-3">
        {LOOP_STEPS.map((step, i) => {
          const open = openId === step.id;
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => {
                  setOpenId(open ? null : step.id);
                  if (!open) readLoopStep(step.id);
                }}
                aria-expanded={open}
                className={cn(
                  "w-full rounded-[1.75rem] p-5 text-left ring-1 transition-colors",
                  open
                    ? "bg-primary text-primary-foreground ring-transparent"
                    : "bg-card ring-border",
                )}
              >
                <span className="flex items-center gap-4">
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                      open ? "bg-primary-foreground/20" : "bg-secondary text-secondary-foreground",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-base font-semibold">
                    {step.title}
                    {state.loopStepIds.includes(step.id) ? " · explored" : ""}
                  </span>
                  <ChevronRight
                    className={cn("size-5 shrink-0 transition-transform", open && "rotate-90")}
                  />
                </span>
                {open ? (
                  <span className="mt-3 block text-sm text-primary-foreground/85">
                    {step.detail}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>

      <p className="rounded-[1.75rem] bg-secondary p-5 text-sm text-secondary-foreground">
        Food scraps → collection → processing → compost → soil → gardens and green infrastructure.
      </p>
    </div>
  );
}
