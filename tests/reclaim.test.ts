import { describe, expect, test } from "bun:test";
import {
  createDemo,
  newlyRevealedStage,
  reduceDemo,
  restoreDemo,
  summarizeDemo,
  type ParticipationEvent,
} from "../src/lib/reclaim/model";
import { artworkProgress, stageIndexFor } from "../src/lib/reclaim/progression";
import { findRule, GUIDANCE_MESSAGES, ruleByLabel, SCAN_ITEMS } from "../src/lib/reclaim/rules";
import { LOOP_STEPS } from "../src/lib/reclaim/catalog";
const event = (
  id: string,
  participant: ParticipationEvent["participant"] = "anonymous",
  stationId = "st-04",
): ParticipationEvent => ({ id, participant, stationId, at: 1000, depositedLb: 3.2 });

describe("participation and artwork", () => {
  test("anonymous activity advances only community and the event's station", () => {
    const initial = summarizeDemo(createDemo());
    const next = summarizeDemo(reduceDemo(createDemo(), { type: "disposal", event: event("one") }));
    expect(next.contributions).toBe(initial.contributions + 1);
    expect(next.artworkCount).toBe(249);
    expect(next.stationArtworkCounts["st-07"]).toBe(98);
    expect(next.myDrops).toBe(0);
    expect(next.visitedPlaceIds).toEqual([]);
    expect(next.completedChallengeIds).toEqual([]);
    expect(next.badges.every((b) => !b.earned)).toBe(true);
  });
  test("resident activity credits the right station and personal journey", () => {
    const next = summarizeDemo(
      reduceDemo(createDemo(), { type: "disposal", event: event("one", "resident", "st-07") }),
    );
    expect(next.myDrops).toBe(1);
    expect(next.visitedPlaceIds).toEqual(["st-07"]);
    expect(next.stationArtworkCounts["st-07"]).toBe(99);
    expect(next.artworkCount).toBe(248);
    expect(next.completedChallengeIds).toContain("ch-visit");
    expect(next.badges.find((b) => b.id === "bg-first")?.earned).toBe(true);
  });
  test("deposits never invent recovered material or compost", () => {
    const before = summarizeDemo(createDemo());
    const after = summarizeDemo(
      reduceDemo(createDemo(), { type: "disposal", event: event("one") }),
    );
    expect(after.depositedLb).toBe(before.depositedLb + 3.2);
    expect(after.recoveredLb).toBe(before.recoveredLb);
    expect(after.compostLb).toBe(before.compostLb);
  });
  test("repeated delivery of one event is idempotent", () => {
    const action = { type: "disposal" as const, event: event("one") };
    const state = reduceDemo(createDemo(), action);
    expect(reduceDemo(state, action)).toBe(state);
  });
  test("rapid events each count and reveal a milestone only once", () => {
    let state = createDemo();
    const reveals = ["one", "two", "three"].map((id) => {
      const next = reduceDemo(state, { type: "disposal", event: event(id) });
      const reveal = newlyRevealedStage(state, next, "st-04");
      state = next;
      return reveal;
    });
    expect(reveals).toEqual([null, 5, null]);
    expect(summarizeDemo(state).artworkCount).toBe(251);
  });
  test("reset returns a fresh replayable scenario without personal credit", () => {
    const state = reduceDemo(createDemo(), { type: "disposal", event: event("one", "resident") });
    const final = reduceDemo(state, { type: "reset", scenario: "final" });
    expect(summarizeDemo(final).myDrops).toBe(0);
    expect(summarizeDemo(final).artworkCount).toBe(499);
    const next = reduceDemo(final, { type: "disposal", event: event("last") });
    expect(newlyRevealedStage(final, next, "st-04")).toBe(6);
    expect(artworkProgress(500).progress).toBe(1);
  });
  test("invalid station/weight doesn't change totals", () => {
    const state = createDemo();
    expect(reduceDemo(state, { type: "disposal", event: event("one", "resident", "gd-02") })).toBe(
      state,
    );
    expect(
      reduceDemo(state, { type: "disposal", event: { ...event("one"), depositedLb: -2 } }),
    ).toBe(state);
  });
  test("milestones reflect boundaries, not every event", () => {
    expect(stageIndexFor(9)).toBe(-1);
    expect(stageIndexFor(10)).toBe(0);
    expect(stageIndexFor(24)).toBe(0);
    expect(stageIndexFor(25)).toBe(1);
    expect(artworkProgress(249).progress).toBeCloseTo(149 / 150);
  });
});

describe("earned challenges", () => {
  test("three distinct public check-ins earn neighborhood badge; repeat visits don't", () => {
    let state = createDemo();
    for (const placeId of ["st-04", "st-04", "st-07"])
      state = reduceDemo(state, { type: "visit", placeId });
    expect(summarizeDemo(state).completedChallengeIds).not.toContain("ch-three");
    state = reduceDemo(state, { type: "visit", placeId: "gd-02" });
    expect(summarizeDemo(state).completedChallengeIds).toContain("ch-three");
    expect(summarizeDemo(state).completedChallengeIds).not.toContain("ch-visit");
  });
  test("future/private/processing places cannot award check-ins", () => {
    for (const placeId of ["fu-01", "cp-01", "bl-09", "not-a-place"]) {
      expect(reduceDemo(createDemo(), { type: "visit", placeId }).visitedPlaceIds).toEqual([]);
    }
  });
  test("sorting requires three different recognized items, not repeated or unknown queries", () => {
    let state = createDemo();
    for (const label of ["Banana peel", "Banana peel", "unknown", "Plastic cup"])
      state = reduceDemo(state, { type: "learn", label });
    expect(summarizeDemo(state).challengeSteps["ch-learn"]).toBe(2);
    state = reduceDemo(state, { type: "learn", label: "Apple core" });
    expect(summarizeDemo(state).completedChallengeIds).toContain("ch-learn");
  });
  test("full loop needs both the garden visit and every educational step", () => {
    let state = createDemo();
    for (const step of LOOP_STEPS) state = reduceDemo(state, { type: "loop", stepId: step.id });
    expect(summarizeDemo(state).completedChallengeIds).not.toContain("ch-garden");
    state = reduceDemo(state, { type: "visit", placeId: "gd-02" });
    expect(summarizeDemo(state).completedChallengeIds).toContain("ch-garden");
  });
  test("joining the build day requires its check-in and doesn't award waste credit", () => {
    let state = createDemo();
    expect(reduceDemo(state, { type: "join", projectId: "pj-03" })).toBe(state);
    state = reduceDemo(state, { type: "visit", placeId: "pj-03" });
    state = reduceDemo(state, { type: "join", projectId: "pj-03" });
    expect(summarizeDemo(state).completedChallengeIds).toContain("ch-season");
    expect(summarizeDemo(state).myDrops).toBe(0);
  });
});

describe("sorting policy and saved state", () => {
  test("questions match whole recognized items", () => {
    expect(findRule("Can this banana peel go in here?")?.label).toBe("Banana peel");
    expect(findRule("Can I put a coffee cup in the bin?")?.accepted).toBe(false);
    expect(findRule("Is a paper napkin accepted?")?.accepted).toBe(true);
  });
  test("ambiguous questions, mixtures and packaging never inherit an accepted food substring", () => {
    for (const q of [
      "can this go in here?",
      "plastic coffee grounds bag",
      "chicken salad",
      "tea bag",
      "banana peel in a plastic bag",
      "not plastic",
      "a",
      "",
      "candy",
      "paper",
    ])
      expect(findRule(q)).toBeNull();
  });
  test("scan samples resolve deterministically; unknown labels do not default to banana", () => {
    for (const item of SCAN_ITEMS) expect(ruleByLabel(item)?.label).toBe(item);
    expect(ruleByLabel("unknown")).toBeNull();
  });
  test("approved message changes emphasis while accepted items remain consistent", () => {
    const state = summarizeDemo(reduceDemo(createDemo(), { type: "guidance", messageId: "cups" }));
    expect(state.guidance).toBe(GUIDANCE_MESSAGES.cups);
    expect(state.agentHandled).toBe("approved");
    expect(findRule("Paper napkin")?.accepted).toBe(true);
    expect(findRule("Plastic cup")?.accepted).toBe(false);
  });
  test("rejecting a recommendation preserves active guidance", () => {
    const state = summarizeDemo(reduceDemo(createDemo(), { type: "reject-guidance" }));
    expect(state.guidance).toBe(GUIDANCE_MESSAGES.standard);
  });
  test("valid saved progress survives restoration without advancing artwork", () => {
    const state = reduceDemo(createDemo("early"), {
      type: "disposal",
      event: event("one", "resident"),
    });
    expect(restoreDemo(JSON.stringify(state))).toEqual(state);
    expect(summarizeDemo(restoreDemo(JSON.stringify(state))).artworkCount).toBe(10);
  });
  test("corrupt, incompatible and invalid stored values fall back to a fresh demo", () => {
    for (const raw of [
      null,
      "broken",
      '{"version":1}',
      JSON.stringify({ ...createDemo(), visitedPlaceIds: ["fake"] }),
      JSON.stringify({ ...createDemo(), events: [event("one"), event("one")] }),
    ])
      expect(restoreDemo(raw)).toEqual(createDemo());
  });
});

describe("manual artwork presentation", () => {
  test("each stage is selectable without creating community or personal events", () => {
    let state = reduceDemo(createDemo(), {
      type: "disposal",
      event: event("personal", "resident"),
    });
    const before = summarizeDemo(state);
    for (const [stageId, threshold] of [
      [1, 10],
      [2, 25],
      [3, 50],
      [4, 100],
      [5, 250],
      [6, 500],
    ]) {
      state = reduceDemo(state, {
        type: "preview-artwork",
        stageId: stageId!,
        beforeMilestone: false,
      });
      const summary = summarizeDemo(state);
      expect(summary.artworkCount).toBe(threshold!);
      expect(summary.contributions).toBe(before.contributions);
      expect(summary.myDrops).toBe(before.myDrops);
      expect(summary.completedChallengeIds).toEqual(before.completedChallengeIds);
      expect(summary.stationArtworkCounts["st-07"]).toBe(before.stationArtworkCounts["st-07"]);
    }
  });
  test("next milestone positions artwork and one anonymous event reveals it", () => {
    const state = reduceDemo(createDemo(), {
      type: "preview-artwork",
      stageId: 2,
      beforeMilestone: true,
    });
    expect(summarizeDemo(state).artworkCount).toBe(24);
    const after = reduceDemo(state, { type: "disposal", event: event("reveal") });
    expect(newlyRevealedStage(state, after, "st-04")).toBe(2);
    expect(summarizeDemo(after).contributions).toBe(2482);
    expect(summarizeDemo(after).myDrops).toBe(0);
  });
  test("manual selection and subsequent drops survive reload", () => {
    let state = reduceDemo(createDemo(), {
      type: "preview-artwork",
      stageId: 3,
      beforeMilestone: false,
    });
    state = reduceDemo(state, { type: "disposal", event: event("one") });
    expect(summarizeDemo(restoreDemo(JSON.stringify(state))).artworkCount).toBe(51);
  });
  test("previous stage-one data is upgraded without discarding progress", () => {
    const state = reduceDemo(createDemo(), { type: "disposal", event: event("one", "resident") });
    const { artworkOffsets, ...legacy } = state;
    expect(restoreDemo(JSON.stringify(legacy))).toEqual(state);
  });
  test("invalid stage selections do not mutate the demo", () => {
    const state = createDemo();
    expect(
      reduceDemo(state, { type: "preview-artwork", stageId: 99, beforeMilestone: false }),
    ).toBe(state);
  });
});


describe("connected visit", () => {
  test("starting and practicing do not award contributions; completing closes visit", () => {
    let state = reduceDemo(createDemo(), { type: "start-visit" });
    state = reduceDemo(state, { type: "learn", label: "Banana peel" });
    expect(state.activeVisit).toBe(true);
    expect(state.events).toHaveLength(0);
    state = restoreDemo(JSON.stringify(state));
    expect(state.activeVisit).toBe(true);
    state = reduceDemo(state, { type: "disposal", event: event("connected", "resident") });
    expect(state.activeVisit).toBe(false);
    expect(summarizeDemo(state).myDrops).toBe(1);
    expect(summarizeDemo(state).artworkCount).toBe(249);
  });
  test("ending a visit adds no credit and anonymous events cannot complete it", () => {
    let state = reduceDemo(createDemo(), { type: "start-visit" });
    state = reduceDemo(state, { type: "disposal", event: event("public") });
    expect(state.activeVisit).toBe(true);
    state = reduceDemo(state, { type: "cancel-visit" });
    expect(state.activeVisit).toBe(false);
    expect(summarizeDemo(state).myDrops).toBe(0);
  });
});
