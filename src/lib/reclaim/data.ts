import { STAGE_DEFINITIONS } from "./progression";
export * from "./catalog";
export * from "./rules";

const images = [
  "space.png",
  "reveal-1.png",
  "reveal-2.png",
  "reveal-3.png",
  "reveal-4.png",
  "mother-earth.png",
];
export const ARTWORK_STAGES = STAGE_DEFINITIONS.map((stage, index) => ({
  ...stage,
  image: `/artwork/${images[index]}`,
  motion: index > 0 && index < 5 ? `/artwork/reveal-${index}.gif` : null,
}));
export type ArtworkStage = (typeof ARTWORK_STAGES)[number];
