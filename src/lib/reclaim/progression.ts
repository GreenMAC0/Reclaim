export const STAGE_DEFINITIONS = [
  {
    id: 1,
    name: "Space",
    threshold: 10,
    caption: "Every beginning holds a universe of possibility.",
  },
  { id: 2, name: "First Light", threshold: 25, caption: "Big Bang Baby · reveal 1 of 4" },
  { id: 3, name: "Taking Shape", threshold: 50, caption: "Big Bang Baby · reveal 2 of 4" },
  { id: 4, name: "New Life", threshold: 100, caption: "Big Bang Baby · reveal 3 of 4" },
  { id: 5, name: "Big Bang Baby", threshold: 250, caption: "Big Bang Baby · reveal 4 of 4" },
  {
    id: 6,
    name: "Mother Earth",
    threshold: 500,
    caption: "Together, we bring the complete artwork into view.",
  },
];
export function stageIndexFor(contributions: number) {
  let index = -1;
  STAGE_DEFINITIONS.forEach((stage, i) => {
    if (contributions >= stage.threshold) index = i;
  });
  return index;
}
export function artworkProgress(contributions: number) {
  const index = stageIndexFor(contributions);
  const current = STAGE_DEFINITIONS[index];
  const next = STAGE_DEFINITIONS[index + 1];
  const from = current?.threshold ?? 0;
  if (!next) return { progress: 1, next: null, from };
  return {
    progress: Math.min(1, Math.max(0, (contributions - from) / (next.threshold - from))),
    next,
    from,
  };
}
