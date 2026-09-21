import { useEffect, useRef } from "react";
import { Camera, ShieldAlert, Check } from "lucide-react";

type Props = { onRemoved: () => void };

export function ContaminationAlert({ onRemoved }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    element?.showModal();
    return () => {
      element?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="contamination-dialog"
      aria-labelledby="contamination-title"
      aria-describedby="contamination-description"
      onCancel={(event) => event.preventDefault()}
    >
      <div role="alert" className="contamination-card">
        <div className="mb-5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Camera className="size-4" /> Tablet camera · simulated alert
        </div>
        <ShieldAlert className="mx-auto mb-5 size-16" aria-hidden="true" />
        <h2 id="contamination-title" className="font-display text-3xl font-bold sm:text-5xl">
          Pause. Plastic doesn’t belong here.
        </h2>
        <p id="contamination-description" className="mt-5 text-lg">
          Plastic cup detected in the demo. Remove the cup from the organics opening before
          continuing.
        </p>
        <p className="mt-3 text-sm">
          Keep the cup out of this bin. Follow local disposal guidance for plastic packaging.
        </p>
        <button
          type="button"
          autoFocus
          onClick={onRemoved}
          className="mt-7 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#153c43] px-6 py-3 font-semibold text-white"
        >
          <Check className="size-5" /> Item removed · resume
        </button>
        <p className="mt-4 text-xs">No contribution counted. Artwork stays at its current stage.</p>
      </div>
    </dialog>
  );
}
