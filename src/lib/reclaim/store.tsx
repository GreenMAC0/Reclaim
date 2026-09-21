import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ReclaimStoreContext, type ReclaimStore } from "./store-context";
import {
  createDemo,
  newlyRevealedStage,
  reduceDemo,
  restoreDemo,
  STATION_ID,
  summarizeDemo,
  type DemoAction,
} from "./model";

// v1 mixed anonymous and personal contributions; don't carry that history forward.
const STORAGE_KEY = "reclaim-demo-v2";

export function ReclaimProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState(createDemo);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(persisted);
  const readyRef = useRef(false);

  useEffect(() => {
    let restored = createDemo();
    try {
      restored = restoreDemo(localStorage.getItem(STORAGE_KEY));
    } catch {
      /* Memory-only demo still works. */
    }
    stateRef.current = restored;
    setPersisted(restored);
    readyRef.current = true;
    setHydrated(true);
  }, []);

  const commit = useCallback((action: DemoAction) => {
    const before = stateRef.current;
    if (!readyRef.current) return { before, after: before };
    const after = reduceDemo(before, action);
    // Update synchronously: rapid events must not share a stale artwork count.
    stateRef.current = after;
    setPersisted(after);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(after));
    } catch {
      /* Memory-only demo. */
    }
    return { before, after };
  }, []);

  const recordDisposal = useCallback<ReclaimStore["recordDisposal"]>(
    (options = {}) => {
      const stationId = options.stationId ?? STATION_ID;
      const { before, after } = commit({
        type: "disposal",
        event: {
          id: crypto.randomUUID(),
          stationId,
          participant: options.participant ?? "anonymous",
          at: Date.now(),
          depositedLb: 3.2,
        },
      });
      return newlyRevealedStage(before, after, stationId);
    },
    [commit],
  );

  const state = useMemo(() => summarizeDemo(persisted), [persisted]);
  const value = useMemo<ReclaimStore>(
    () => ({
      state,
      hydrated,
      recordDisposal,
      startVisit: () => {
        commit({ type: "start-visit" });
      },
      cancelVisit: () => {
        commit({ type: "cancel-visit" });
      },
      previewArtwork: (stageId, beforeMilestone = false) => {
        commit({ type: "preview-artwork", stageId, beforeMilestone });
      },
      setGuidance: (messageId) => {
        commit({ type: "guidance", messageId });
      },
      rejectGuidance: () => {
        commit({ type: "reject-guidance" });
      },
      visitPlace: (placeId) => {
        commit({ type: "visit", placeId });
      },
      learnRule: (label) => {
        commit({ type: "learn", label });
      },
      readLoopStep: (stepId) => {
        commit({ type: "loop", stepId });
      },
      joinProject: (projectId) => {
        commit({ type: "join", projectId });
      },
      reset: (scenario = "growing") => {
        commit({ type: "reset", scenario });
      },
    }),
    [state, hydrated, recordDisposal, commit],
  );

  return <ReclaimStoreContext.Provider value={value}>{children}</ReclaimStoreContext.Provider>;
}
