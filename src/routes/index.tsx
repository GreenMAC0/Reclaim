import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Leaf,
  HelpCircle,
  Users,
  Check,
  ArrowUpRight,
  SlidersHorizontal,
  Plus,
  SkipForward,
  RotateCcw,
  Smartphone,
  Sprout,
  Coffee,
  Flower2,
  Camera,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CameraView } from "@/components/reclaim/CameraView";
import { ContaminationAlert } from "@/components/reclaim/ContaminationAlert";
import { Artwork } from "@/components/reclaim/Artwork";
import { HelperOverlay } from "@/components/reclaim/HelperOverlay";
import { ARTWORK_STAGES } from "@/lib/reclaim/data";
import { artworkProgress, stageIndexFor } from "@/lib/reclaim/progression";
import { useReclaim } from "@/lib/reclaim/store-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReClaim Waste — Our shared station" },
      {
        name: "description",
        content:
          "A community canvas that grows together. ReClaim's shared organics station in Detroit.",
      },
    ],
  }),
  component: Station,
});

function Station() {
  const { state, hydrated, recordDisposal, previewArtwork, reset, cancelVisit } = useReclaim();
  const [contamination, setContamination] = useState(false);
  const [helper, setHelper] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [visitComplete, setVisitComplete] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { next, progress } = artworkProgress(state.artworkCount);
  const currentIndex = Math.max(0, stageIndexFor(state.artworkCount));
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const clearFeedback = () => {
    if (timer.current) clearTimeout(timer.current);
    setNotice(null);
    setRevealed(null);
  };
  const fireDisposal = (personal = false) => {
    if (!hydrated || contamination) return;
    if (timer.current) clearTimeout(timer.current);
    const stageId = recordDisposal({ participant: personal ? "resident" : "anonymous" });
    setHelper(false);
    if (personal) setVisitComplete(true);
    setRevealed(stageId);
    setNotice(
      stageId
        ? `Together, we unlocked ${ARTWORK_STAGES.find((s) => s.id === stageId)?.name}.`
        : "One small act. A little more shared growth.",
    );
    timer.current = setTimeout(() => {
      setNotice(null);
      setRevealed(null);
    }, 6000);
  };
  const chooseStage = (stageId: number) => {
    clearFeedback();
    previewArtwork(stageId);
  };
  const nextMilestone = () => {
    if (!next || contamination) return;
    previewArtwork(next.id, true);
    fireDisposal();
  };

  return (
    <main className="station-shell">
      <header className="station-header">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#64e2b5] text-[#073b4b]">
            <Leaf className="size-7" />
          </span>
          <div>
            <p className="font-display text-2xl font-bold tracking-tight">
              ReClaim<span className="text-[#75d7cb]">.</span>
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#acced6]">
              Our shared station
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Livernois &amp; Curtis</p>
          <p className="mt-1 flex items-center justify-end gap-2 text-xs text-[#a9d7ce]">
            <span className="size-1.5 rounded-full bg-[#64e2b5]" /> Station ready · Detroit
          </p>
        </div>
      </header>

      <div className="station-layout">
        <div className="relative min-h-0">
          <Artwork
            contributions={state.artworkCount}
            revealedStage={revealed}
            className="station-art"
            shared
          />
          {notice && (
            <div role="status" className="station-toast">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0b7155] text-white">
                <Check className="size-4" />
              </span>
              <span className="text-sm font-semibold">{notice}</span>
            </div>
          )}
        </div>
        <aside className="station-side" aria-label="Participate together">
          {state.activeVisit && (
            <section className="rounded-3xl bg-[#d0ece1] p-5 text-[#073b4b]">
              <p className="text-xs font-bold uppercase tracking-widest">Your connected visit</p>
              <h2 className="mt-2 text-xl font-semibold">Check it. Drop it. Watch it grow.</h2>
              <p className="mt-2 text-sm">
                One accepted food scrap adds one step toward {next?.name ?? "our shared artwork"}.
              </p>
              <Button className="mt-4 min-h-14 w-full rounded-2xl" onClick={() => setHelper(true)}>
                Check my item
              </Button>
              <button className="mt-3 min-h-10 text-xs underline" onClick={cancelVisit}>
                End this demo visit
              </button>
            </section>
          )}
          {visitComplete && (
            <section
              className="rounded-3xl bg-[#d0ece1] p-5 text-[#073b4b]"
              aria-label="Contribution saved"
            >
              <h2 className="text-xl font-semibold">Your small act is part of the picture.</h2>
              <p className="mt-2 text-sm">
                {next
                  ? `${next.threshold - state.artworkCount} more shared contributions to reveal ${next.name}.`
                  : "The complete artwork is now in view."}
              </p>
              <Link to="/app" className="mt-4 block font-semibold underline">
                See progress on my phone →
              </Link>
            </section>
          )}
          <section className="shared-count">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#aed2dc]">
              <Users className="size-4" /> Made by all of us
            </p>
            <p className="font-display mt-1 text-3xl font-semibold tracking-tight">
              {hydrated ? state.contributions.toLocaleString() : "—"}
              <span className="ml-2 text-sm font-normal tracking-normal text-[#bdd9df]">
                small acts of care
              </span>
            </p>
            <p className="mt-2 text-xs text-[#bdd9df]">Every neighbor helps this artwork grow.</p>
          </section>
          <section className="station-camera" aria-label="Tablet camera item check">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Camera className="size-5" /> Tablet camera · item check
              </span>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[9px] uppercase">
                Simulation
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHelper(true)}
              className="w-full text-left"
              aria-label="Open camera scanner"
            >
              <CameraView item="Banana peel" />
              <span className="mt-2 block text-xs font-semibold text-[#9defd2]">
                Open scanner · choose an item →
              </span>
            </button>
            <p className="mt-2 text-xs text-[#bdd9df]">
              The camera checks for items that don’t belong before drop-off.
            </p>
            <p className="mt-1 text-[10px] text-[#9bbbc6]">
              Demo preview · camera is off. No video is captured.
            </p>
          </section>
          <section className="station-guidance">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d0ece1] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em]">
              <Sprout className="size-3.5" /> Give your scraps a new beginning
            </span>
            <h1 className="font-display mt-3 text-[24px] leading-[1.1] font-semibold tracking-tight">
              Drop it off.
              <br />
              Watch us grow.
            </h1>
            <p className="mt-3 text-[13px] leading-snug">{state.guidance}</p>
            <p className="mt-3 text-xs text-[#426d6b]">
              No sign-in needed. Keep items in view before dropping them in.
            </p>
          </section>
          <Button className="station-help" onClick={() => setHelper(true)}>
            <HelpCircle className="mr-2 size-7" /> Not sure?
            <ArrowUpRight className="ml-auto size-5" />
          </Button>
          <Button
            disabled={!hydrated || contamination || helper}
            onClick={() => fireDisposal()}
            className="min-h-14 w-full rounded-2xl bg-[#64e2b5] text-base font-semibold text-[#073b4b] hover:bg-[#89eccb]"
          >
            <Plus className="mr-2 size-5" /> Simulate food-waste drop
          </Button>
          <p className="text-center text-xs text-[#bdd9df]">
            Adds one shared demo contribution and advances the artwork.
          </p>
        </aside>
      </div>

      {showControls && (
        <section className="presenter-panel" aria-label="Artwork presentation controls">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold">
                <SlidersHorizontal className="size-4 text-[#71e2bd]" /> Artwork studio{" "}
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-normal uppercase tracking-wider text-[#b8d8df]">
                  Manual demo
                </span>
              </p>
              <p className="mt-1 text-[10px] text-[#a9cbd5]">
                Choose the artwork. Stage previews don’t add participation.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={!hydrated || contamination}
                onClick={() => {
                  clearFeedback();
                  setContamination(true);
                }}
                className="flex min-h-10 items-center gap-1.5 rounded-xl border border-amber-300/50 bg-amber-300/10 px-3 text-xs font-semibold text-amber-100 disabled:opacity-40"
              >
                <ShieldAlert className="size-4" /> Simulate contamination
              </button>
              <button
                type="button"
                disabled={!hydrated || contamination}
                onClick={() => fireDisposal()}
                className="flex min-h-10 items-center gap-1.5 rounded-xl border border-[#78b2bd55] px-3 text-xs font-semibold hover:bg-white/10 disabled:opacity-40"
              >
                <Plus className="size-4" /> Drop-off
              </button>
              <button
                type="button"
                disabled={!hydrated || !next}
                onClick={nextMilestone}
                className="flex min-h-10 items-center gap-1.5 rounded-xl bg-[#64e2b5] px-3 text-xs font-semibold text-[#073b4b] hover:bg-[#89eccb] disabled:opacity-40"
              >
                <SkipForward className="size-4" /> Next milestone
              </button>
              <button
                type="button"
                aria-label="Reset demo"
                title="Reset demo"
                disabled={!hydrated}
                onClick={() => {
                  clearFeedback();
                  reset();
                }}
                className="flex size-10 items-center justify-center rounded-xl border border-[#78b2bd55] hover:bg-white/10"
              >
                <RotateCcw className="size-4" />
              </button>
            </div>
          </div>
          <div className="art-stage-picker">
            {ARTWORK_STAGES.map((stage, index) => (
              <button
                type="button"
                key={stage.id}
                aria-label={`Show ${stage.name} artwork`}
                aria-pressed={index === currentIndex}
                disabled={!hydrated}
                onClick={() => chooseStage(stage.id)}
              >
                <img src={stage.image} alt="" />
                <span>
                  {String(stage.id).padStart(2, "0")} · {stage.name}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap justify-between gap-2 text-[10px] text-[#94b9c6]">
            <span>
              {next
                ? `${Math.round(progress * 100)}% toward ${next.name} · Next milestone fast-forwards the artwork and adds one demo drop-off.`
                : "Final stage · choose an earlier artwork to replay the journey."}
            </span>
            <Link to="/operator" className="underline underline-offset-2">
              Operator tools
            </Link>
          </div>
        </section>
      )}
      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#a4c9d4]">
        <div className="flex items-center gap-4">
          <Link to="/app" className="flex min-h-8 items-center gap-1.5 hover:text-white">
            <Smartphone className="size-3.5" /> Your personal companion
          </Link>
          <Link to="/impact" className="hover:text-white">
            Our impact
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#86aebb]">Prototype · simulated activity</span>
          <button
            type="button"
            className="min-h-8 underline underline-offset-4 hover:text-white"
            aria-expanded={showControls}
            onClick={() => setShowControls((s) => !s)}
          >
            {showControls ? "Hide controls" : "Show controls"}
          </button>
        </div>
      </footer>
      {contamination && <ContaminationAlert onRemoved={() => setContamination(false)} />}
      {helper && (
        <HelperOverlay
          guidance={state.guidance}
          onClose={() => setHelper(false)}
          onDeposit={state.activeVisit ? () => fireDisposal(true) : undefined}
        />
      )}
    </main>
  );
}
