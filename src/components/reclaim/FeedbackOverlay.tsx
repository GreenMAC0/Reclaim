import { artworkProgress } from "@/lib/reclaim/progression";
import { ARTWORK_STAGES } from "@/lib/reclaim/data";

type Props = {
  contributions: number;
  revealedStage: number | null;
};

/** Takes over the screen for a few seconds after a disposal. No weight, no scores. */
export function FeedbackOverlay({ contributions, revealedStage }: Props) {
  const { progress, next } = artworkProgress(contributions);
  const revealed = revealedStage ? ARTWORK_STAGES.find((s) => s.id === revealedStage) : null;

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-primary px-6 text-center duration-300 sm:gap-10 sm:px-10">
      <p className="font-display text-3xl leading-tight font-semibold text-primary-foreground sm:text-5xl md:text-7xl">
        Thanks for helping ReClaim this.
      </p>

      <div className="w-full max-w-3xl">
        <div className="h-4 w-full overflow-hidden rounded-full bg-primary-foreground/20 sm:h-5">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-1000 ease-out"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <p className="mt-4 text-base text-primary-foreground/85 sm:mt-5 sm:text-xl">
          {revealed
            ? `A new stage of the community artwork is revealed: ${revealed.name}.`
            : next
              ? "Your contribution grows the community artwork."
              : "The neighborhood milestone is complete."}
        </p>
      </div>

      {revealed ? (
        <img
          src={revealed.image}
          alt={`Community artwork, ${revealed.name} stage`}
          width={1536}
          height={1024}
          loading="lazy"
          className="animate-in zoom-in-95 fade-in max-h-[30vh] w-auto rounded-[1.75rem] shadow-2xl duration-1000 sm:max-h-[38vh] sm:rounded-[2rem]"
        />
      ) : null}
    </div>
  );
}
