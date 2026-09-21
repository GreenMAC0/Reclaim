import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Camera, Check, X, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findRule, ruleByLabel, type ItemRule } from "@/lib/reclaim/rules";

import { CameraView, CAMERA_SAMPLES } from "./CameraView";

type Props = {
  guidance: string;
  onClose: () => void;
  onLearn?: (label: string) => void;
  onDeposit?: (() => void) | undefined;
};
type Verdict = { rule: ItemRule | null };

export function HelperOverlay({ guidance, onClose, onLearn, onDeposit }: Props) {
  const [query, setQuery] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [sample, setSample] = useState<string>(CAMERA_SAMPLES[0]!);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const showVerdict = (rule: ItemRule | null) => {
    setVerdict({ rule });
    if (rule) onLearn?.(rule.label);
    // Public kiosk returns home. Personal practice stays open for the next item.
    if (!onLearn && !onDeposit) timers.current.push(setTimeout(onClose, 10000));
  };
  const ask = () => {
    if (query.trim()) showVerdict(findRule(query));
  };
  const scan = () => {
    setScanned(true);
    setScanning(true);
    timers.current.push(
      setTimeout(() => {
        setScanning(false);
        showVerdict(ruleByLabel(sample));
      }, 2200),
    );
  };
  const again = () => {
    clearTimers();
    setVerdict(null);
    setScanned(false);
    setQuery("");
  };

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-background" />
        <Dialog.Content
          className="fixed inset-0 z-50 overflow-y-auto bg-background px-5 py-6 outline-none sm:px-8 sm:py-8"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="mx-auto flex min-h-full max-w-5xl flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Dialog.Title className="font-display text-3xl font-semibold sm:text-4xl">
                  {onLearn ? "Sorting practice" : "Not sure?"}
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-base text-muted-foreground sm:text-lg">
                  {guidance}
                </Dialog.Description>
                <p className="mt-2 text-xs text-muted-foreground">
                  Demo processor policy · illustrative rules
                </p>
              </div>
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  className="size-12 shrink-0 rounded-full"
                  aria-label="Close helper"
                >
                  <X className="size-7" />
                </Button>
              </Dialog.Close>
            </div>
            {verdict ? (
              <>
                {scanned && <CameraView item={sample} accepted={verdict.rule?.accepted} />}
                <VerdictPanel verdict={verdict} />
                {onDeposit && verdict.rule?.accepted && (
                  <Button
                    className="mt-4 min-h-16 rounded-2xl text-lg"
                    onClick={() => {
                      clearTimers();
                      onDeposit();
                    }}
                  >
                    Confirm drop-off · simulation
                  </Button>
                )}
                {onDeposit && !verdict.rule?.accepted && (
                  <p className="mt-3 text-center text-sm">
                    Keep this item out. Check an accepted food scrap to continue.
                  </p>
                )}
                {onLearn && (
                  <p className="mt-3 text-center text-sm">
                    Practice builds familiarity. No drop-off or artwork credit is added.
                  </p>
                )}
                <Button
                  variant="secondary"
                  className="mt-4 min-h-14 shrink-0 rounded-2xl"
                  onClick={again}
                >
                  <ArrowLeft className="mr-2 size-4" /> Check another item
                </Button>
                {!onLearn && !onDeposit && (
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Returns to the artwork after 10 seconds.
                  </p>
                )}
              </>
            ) : scanning ? (
              <CameraView item={sample} scanning />
            ) : (
              <div className="mt-6 flex flex-1 flex-col gap-5">
                <div className="flex flex-col gap-3 md:flex-row">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && ask()}
                    placeholder="Can this banana peel go in here?"
                    className="h-16 rounded-2xl bg-card px-5 text-base md:text-xl"
                    aria-label="Ask about an item"
                  />
                  <Button
                    onClick={ask}
                    disabled={!query.trim()}
                    className="h-16 gap-3 rounded-2xl px-8 text-lg"
                  >
                    <Search className="size-6" /> Ask
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Name one item. If the material or contents are unclear, ask station staff.
                </p>
                <section className="rounded-[1.75rem] bg-secondary p-5 sm:p-7">
                  <label htmlFor="scan-sample" className="block text-base font-semibold">
                    Choose a sample to scan
                  </label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Simulated scan; your camera is not used.
                  </p>
                  <select
                    id="scan-sample"
                    value={sample}
                    onChange={(e) => setSample(e.target.value)}
                    className="mt-4 h-14 w-full rounded-xl border border-border bg-card px-4 text-base"
                  >
                    {CAMERA_SAMPLES.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <CameraView item={sample} />
                  <Button onClick={scan} className="mt-4 min-h-16 w-full gap-3 rounded-2xl text-lg">
                    <Camera className="size-7" /> Scan sample
                  </Button>
                </section>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
function VerdictPanel({ verdict }: { verdict: Verdict }) {
  if (!verdict.rule)
    return (
      <div
        role="status"
        className="mt-6 flex min-h-64 flex-1 flex-col items-center justify-center gap-5 rounded-[1.75rem] bg-muted p-6 text-center"
      >
        <p className="font-display text-3xl font-semibold sm:text-5xl">Not sure yet</p>
        <p className="max-w-2xl text-lg text-muted-foreground">
          We couldn’t identify one approved item. Leave it out and ask station staff.
        </p>
      </div>
    );
  const { accepted, label, reason } = verdict.rule;
  return (
    <div
      role="status"
      className={`mt-6 flex min-h-64 flex-1 flex-col items-center justify-center gap-5 rounded-[1.75rem] p-6 text-center sm:gap-7 ${accepted ? "bg-primary text-primary-foreground" : "bg-soil text-soil-foreground"}`}
    >
      <div
        className={`flex size-20 items-center justify-center rounded-full ${accepted ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"}`}
      >
        {accepted ? <Check className="size-11" /> : <X className="size-11" />}
      </div>
      <p className="font-display text-3xl font-semibold tracking-tight sm:text-6xl">
        {accepted ? "ACCEPTED" : "NOT ACCEPTED"}
      </p>
      <p className="text-xl sm:text-3xl">
        {accepted ? "Place this in organics." : "This does not belong in organics."}
      </p>
      <p className="text-base opacity-80 sm:text-xl">
        {label} — {reason}
      </p>
    </div>
  );
}
