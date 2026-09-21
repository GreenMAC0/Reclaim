import { createContext, useContext } from "react";
import type { DemoState, DemoScenario } from "./model";
import type { GuidanceMessageId } from "./rules";
export type { DemoState } from "./model";

export type ReclaimStore = {
  state: DemoState;
  hydrated: boolean;
  startVisit: () => void;
  cancelVisit: () => void;
  recordDisposal: (options?: {
    participant?: "anonymous" | "resident";
    stationId?: string;
  }) => number | null;
  previewArtwork: (stageId: number, beforeMilestone?: boolean) => void;
  setGuidance: (messageId: GuidanceMessageId) => void;
  rejectGuidance: () => void;
  visitPlace: (placeId: string) => void;
  learnRule: (label: string) => void;
  readLoopStep: (stepId: string) => void;
  joinProject: (projectId: string) => void;
  reset: (scenario?: DemoScenario) => void;
};
export const ReclaimStoreContext = createContext<ReclaimStore | null>(null);
export function useReclaim() {
  const store = useContext(ReclaimStoreContext);
  if (!store) throw new Error("useReclaim must be used inside ReclaimProvider");
  return store;
}
