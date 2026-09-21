import { useState } from "react";
import { ARTWORK_STAGES } from "@/lib/reclaim/data";
import { artworkProgress, stageIndexFor } from "@/lib/reclaim/progression";
import { cn } from "@/lib/utils";

type Props = {
  contributions: number;
  revealedStage?: number | null;
  className?: string;
  shared?: boolean;
};

export function Artwork({ contributions, className, shared = false }: Props) {
  const [scene, setScene] = useState(false);
  const [replay, setReplay] = useState(0);
  const index = Math.max(0, stageIndexFor(contributions));
  const stage = ARTWORK_STAGES[index];
  const { progress, next } = artworkProgress(contributions);
  if (!stage) return null;
  return (
    <figure
      className={cn(
        "artist-canvas overflow-hidden rounded-[2rem] bg-[#080d19] text-white shadow-xl",
        className,
      )}
    >
      {shared && (
        <header className="flex items-center justify-between px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white/70">
          <span>The community canvas</span>
          <span>Space → Mother Earth</span>
        </header>
      )}
      <div className="canvas-view-switch" role="group" aria-label="Choose artwork or game scene">
        <button type="button" aria-pressed={!scene} onClick={() => setScene(false)}>Community artwork</button>
        <button type="button" aria-pressed={scene} onClick={() => setScene(true)}>Explore the game scene</button>
      </div>
      {scene ? <div className="game-scene">
        <video controls playsInline preload="none" poster="/artwork/gameplay-poster.png" aria-label="Original ReClaim game scene, recorded gameplay">
          <source src="/artwork/gameplay.mp4" type="video/mp4" />
          Your browser does not support this video.
        </video>
        <div className="game-scene-caption">
          <h3>Step inside the ReClaim world</h3>
          <p>Original art + actual gameplay</p>
          <p>Play the clip to explore the custom scene. Your drop-offs advance the shared artwork below.</p>
          <small>Recorded gameplay preview · movement controls shown in the clip are not interactive.</small>
        </div>
      </div> : <div className="artist-image-area">
        <picture key={`${stage.id}-${replay}`}>
          <source media="(prefers-reduced-motion: reduce)" srcSet={stage.image} />
          <img
            src={stage.motion ?? stage.image}
            alt={`Community artwork, ${stage.name} stage`}
            width={2160}
            height={1620}
          />
        </picture>
      </div>}
      <figcaption className="px-5 py-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">{stage.name}</h2>
          <span className="text-xs text-white/70">
            Stage {index + 1} of {ARTWORK_STAGES.length}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-xs text-white/70">{stage.caption}</p>
          {stage.motion && (
            <button
              type="button"
              onClick={() => setReplay((value) => value + 1)}
              className="shrink-0 rounded-full border border-white/30 px-3 py-2 text-xs hover:bg-white/10 motion-reduce:hidden"
            >
              Replay reveal
            </button>
          )}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-[#71e2bd] transition-[width]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="mt-2 text-[10px] uppercase tracking-wide text-white/60">
          {next ? `Revealing next: ${next.name}` : "Mother Earth · complete"}
        </p>
      </figcaption>
    </figure>
  );
}
