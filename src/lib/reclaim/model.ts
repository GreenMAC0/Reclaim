import { z } from "zod";
import { BADGES, CHALLENGES, LOOP_STEPS, PLACES, PROCESSOR_REPORTS } from "./catalog";
import { GUIDANCE_MESSAGES, ITEM_RULES, type GuidanceMessageId } from "./rules";
import { stageIndexFor, STAGE_DEFINITIONS } from "./progression";

export const STATION_ID = "st-04";
export const DEMO_SCENARIOS = {
  growing: { name: "Garden milestone", count: 248 },
  early: { name: "First seed", count: 9 },
  final: { name: "Neighborhood milestone", count: 499 },
} as const;
export type DemoScenario = keyof typeof DEMO_SCENARIOS;
const stationIds = PLACES.filter((p) => p.kind === "station").map((p) => p.id);
export const canCheckIn = (id: string) =>
  PLACES.some((p) => p.id === id && ["station", "garden", "project"].includes(p.kind));
const unique = (values: string[]) => [...new Set(values)];
const knownList = (ids: string[]) =>
  z
    .array(z.string().refine((id) => ids.includes(id)))
    .max(100)
    .transform(unique);
const eventSchema = z.object({
  id: z.string().min(1).max(100),
  stationId: z.string().refine((id) => stationIds.includes(id)),
  participant: z.enum(["anonymous", "resident"]),
  at: z.number().finite().nonnegative(),
  depositedLb: z.number().finite().positive().max(100),
});
export type ParticipationEvent = z.infer<typeof eventSchema>;
const persistedSchema = z.object({
  energyMissionStep: z.number().int().min(0).max(5).default(0),
  activeVisit: z.boolean().default(false),
  version: z.literal(2),
  artworkOffsets: z
    .record(z.number().int().min(-10000).max(10000))
    .refine((offsets) => Object.keys(offsets).every((id) => stationIds.includes(id)))
    .default({}),
  scenario: z.enum(["growing", "early", "final"]),
  events: z
    .array(eventSchema)
    .max(10000)
    .refine((events) => new Set(events.map((e) => e.id)).size === events.length),
  visitedPlaceIds: knownList(PLACES.filter((p) => canCheckIn(p.id)).map((p) => p.id)),
  learnedRuleLabels: knownList(ITEM_RULES.map((r) => r.label)),
  loopStepIds: knownList(LOOP_STEPS.map((s) => s.id)),
  joinedProjectIds: knownList(["pj-03"]),
  guidanceMessageId: z.enum(["standard", "cups"]),
  agentHandled: z.enum(["pending", "approved", "rejected"]),
});
export type PersistedDemo = z.infer<typeof persistedSchema>;

export function createDemo(scenario: DemoScenario = "growing"): PersistedDemo {
  return {
    energyMissionStep: 0,
    activeVisit: false,
    version: 2,
    artworkOffsets: {},
    scenario,
    events: [],
    visitedPlaceIds: [],
    learnedRuleLabels: [],
    loopStepIds: [],
    joinedProjectIds: [],
    guidanceMessageId: "standard",
    agentHandled: "pending",
  };
}
export function restoreDemo(raw: string | null): PersistedDemo {
  try {
    const parsed = persistedSchema.safeParse(JSON.parse(raw ?? "null"));
    return parsed.success ? parsed.data : createDemo();
  } catch {
    return createDemo();
  }
}

export type DemoAction =
  | { type: "energy-next" }
  | { type: "start-visit" }
  | { type: "cancel-visit" }
  | { type: "disposal"; event: ParticipationEvent }
  | { type: "preview-artwork"; stageId: number; beforeMilestone: boolean }
  | { type: "visit"; placeId: string }
  | { type: "learn"; label: string }
  | { type: "loop"; stepId: string }
  | { type: "join"; projectId: string }
  | { type: "guidance"; messageId: GuidanceMessageId }
  | { type: "reject-guidance" }
  | { type: "reset"; scenario: DemoScenario };

export function reduceDemo(state: PersistedDemo, action: DemoAction): PersistedDemo {
  switch (action.type) {
    case "energy-next":
      return state.energyMissionStep === 1 || state.energyMissionStep === 5
        ? state
        : { ...state, energyMissionStep: state.energyMissionStep + 1 };
    case "start-visit":
      return { ...state, activeVisit: true };
    case "cancel-visit":
      return { ...state, activeVisit: false };
    case "preview-artwork": {
      const stage = STAGE_DEFINITIONS.find((s) => s.id === action.stageId);
      if (!stage) return state;
      const target = stage.threshold - (action.beforeMilestone ? 1 : 0);
      const base =
        DEMO_SCENARIOS[state.scenario].count +
        state.events.filter((event) => event.stationId === STATION_ID).length;
      return { ...state, artworkOffsets: { ...state.artworkOffsets, [STATION_ID]: target - base } };
    }
    case "disposal": {
      if (
        !eventSchema.safeParse(action.event).success ||
        state.events.some((e) => e.id === action.event.id) ||
        state.events.length >= 10000
      )
        return state;
      return {
        ...state,
        activeVisit: action.event.participant === "resident" ? false : state.activeVisit,
        events: [...state.events, action.event],
        energyMissionStep: state.energyMissionStep === 1 && action.event.participant === "resident"
          ? 2 : state.energyMissionStep,
        visitedPlaceIds:
          action.event.participant === "resident"
            ? unique([...state.visitedPlaceIds, action.event.stationId])
            : state.visitedPlaceIds,
      };
    }
    case "visit":
      return canCheckIn(action.placeId)
        ? { ...state, visitedPlaceIds: unique([...state.visitedPlaceIds, action.placeId]) }
        : state;
    case "learn":
      return ITEM_RULES.some((r) => r.label === action.label)
        ? { ...state, learnedRuleLabels: unique([...state.learnedRuleLabels, action.label]) }
        : state;
    case "loop":
      return LOOP_STEPS.some((s) => s.id === action.stepId)
        ? { ...state, loopStepIds: unique([...state.loopStepIds, action.stepId]) }
        : state;
    case "join":
      return action.projectId === "pj-03" && state.visitedPlaceIds.includes(action.projectId)
        ? { ...state, joinedProjectIds: unique([...state.joinedProjectIds, action.projectId]) }
        : state;
    case "guidance":
      return Object.hasOwn(GUIDANCE_MESSAGES, action.messageId)
        ? { ...state, guidanceMessageId: action.messageId, agentHandled: "approved" }
        : state;
    case "reject-guidance":
      return { ...state, agentHandled: "rejected" };
    case "reset":
      return createDemo(action.scenario);
  }
}

export function summarizeDemo(state: PersistedDemo) {
  const personalDrops = state.events.filter((e) => e.participant === "resident");
  const stationArtworkCounts: Record<string, number> = {
    [STATION_ID]: DEMO_SCENARIOS[state.scenario].count,
    "st-07": 98,
  };
  for (const event of state.events)
    stationArtworkCounts[event.stationId] = (stationArtworkCounts[event.stationId] ?? 0) + 1;
  for (const [id, offset] of Object.entries(state.artworkOffsets))
    stationArtworkCounts[id] = Math.max(0, (stationArtworkCounts[id] ?? 0) + offset);
  const challengeSteps: Record<string, number> = {
    "ch-visit": Math.min(1, personalDrops.length),
    "ch-learn": Math.min(3, state.learnedRuleLabels.length),
    "ch-three": Math.min(3, state.visitedPlaceIds.length),
    "ch-garden": Number(state.visitedPlaceIds.includes("gd-02")) + state.loopStepIds.length,
    "ch-season": Number(state.joinedProjectIds.includes("pj-03")),
  };
  const completedChallengeIds = CHALLENGES.filter(
    (c) => (challengeSteps[c.id] ?? 0) >= c.steps,
  ).map((c) => c.id);
  return {
    ...state,
    stationArtworkCounts,
    artworkCount: stationArtworkCounts[STATION_ID]!,
    contributions: 2481 + state.events.length,
    depositedLb:
      Math.round((18420 + state.events.reduce((n, e) => n + e.depositedLb, 0)) * 10) / 10,
    // Historical mock processor figures never increase on an unverified deposit.
    recoveredLb: 17165,
    compostLb: PROCESSOR_REPORTS.reduce((n, r) => n + Number(r.compost.replace(/[^\d.]/g, "")), 0),
    contaminationRate: 4.1,
    myDrops: personalDrops.length,
    lastEventAt: state.events.at(-1)?.at ?? null,
    guidance: GUIDANCE_MESSAGES[state.guidanceMessageId],
    challengeSteps,
    completedChallengeIds,
    badges: BADGES.map((b) => ({ ...b, earned: completedChallengeIds.includes(b.challengeId) })),
  };
}
export type DemoState = ReturnType<typeof summarizeDemo>;

export function newlyRevealedStage(before: PersistedDemo, after: PersistedDemo, stationId: string) {
  const a = summarizeDemo(before).stationArtworkCounts[stationId] ?? 0;
  const b = summarizeDemo(after).stationArtworkCounts[stationId] ?? 0;
  return stageIndexFor(b) > stageIndexFor(a) ? STAGE_DEFINITIONS[stageIndexFor(b)]!.id : null;
}
