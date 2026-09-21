/** Mock operations data. */
export const CONTAMINATION_ITEMS = [
  { item: "Plastic cups", count: 12 },
  { item: "Utensils", count: 7 },
  { item: "Foil wrappers", count: 3 },
];

export const PARTICIPATION_TREND = [
  { day: "Mon", events: 38 },
  { day: "Tue", events: 44 },
  { day: "Wed", events: 41 },
  { day: "Thu", events: 52 },
  { day: "Fri", events: 61 },
  { day: "Sat", events: 74 },
  { day: "Sun", events: 58 },
];

export const CONTAMINATION_TREND = [
  { week: "W1", rate: 9.4 },
  { week: "W2", rate: 8.8 },
  { week: "W3", rate: 9.1 },
  { week: "W4", rate: 6.2 },
  { week: "W5", rate: 4.7 },
  { week: "W6", rate: 4.1 },
];

export const GUIDANCE_BEFORE_AFTER = [
  { label: "Before guidance change", rate: 9.1 },
  { label: "After guidance change", rate: 4.1 },
];

export const PROCESSOR_REPORTS = [
  {
    date: "Sep 12",
    deposited: "1,940 lb",
    recovered: "1,806 lb",
    compost: "612 lb",
    delivered: "Brightmoor community garden",
  },
  {
    date: "Sep 5",
    deposited: "1,725 lb",
    recovered: "1,588 lb",
    compost: "544 lb",
    delivered: "Eastern Market grower plots",
  },
  {
    date: "Aug 29",
    deposited: "1,610 lb",
    recovered: "1,402 lb",
    compost: "491 lb",
    delivered: "Springwells school garden",
  },
];

/** Nearby drop-off bins shown in the phone app. Mock data. */
export type BinLocation = {
  id: string;
  name: string;
  address: string;
  distanceMi: number;
  fullness: number;
  hours: string;
  accepts: string;
  /** Rough position (0-100%) on the simplified neighborhood map. */
  x: number;
  y: number;
};

export const BIN_LOCATIONS: BinLocation[] = [
  {
    id: "st-04",
    name: "Station 04 — Livernois & Curtis",
    address: "19340 Livernois Ave",
    distanceMi: 0.2,
    fullness: 38,
    hours: "Open 24 hours",
    accepts: "Food scraps, coffee grounds, paper napkins",
    x: 32,
    y: 40,
  },
  {
    id: "st-07",
    name: "Station 07 — Eastern Market Shed 5",
    address: "2934 Russell St",
    distanceMi: 1.4,
    fullness: 71,
    hours: "6 AM – 9 PM",
    accepts: "Food scraps, plant trimmings",
    x: 68,
    y: 24,
  },
  {
    id: "st-11",
    name: "Station 11 — Brightmoor garden",
    address: "13939 Burt Rd",
    distanceMi: 2.1,
    fullness: 19,
    hours: "7 AM – 8 PM",
    accepts: "Food scraps, coffee grounds",
    x: 20,
    y: 72,
  },
  {
    id: "st-15",
    name: "Station 15 — Springwells school",
    address: "4800 Cabot St",
    distanceMi: 3.3,
    fullness: 54,
    hours: "8 AM – 6 PM",
    accepts: "Food scraps only",
    x: 74,
    y: 66,
  },
];

export const STATION_STATUS = {
  station: "Station 04 — Livernois & Curtis",
  bin: "38% full",
  lastServiced: "Sep 18, 7:20 AM",
  scale: "Calibrated",
};

/* ---------------------------------------------------------------
 * Phone app (exploration mode) — mock Detroit data
 * ------------------------------------------------------------- */

export type PlaceKind = "station" | "garden" | "compost" | "building" | "project" | "future";

export type Place = {
  id: string;
  name: string;
  kind: PlaceKind;
  neighborhood: string;
  accepts: string;
  progressLabel: string;
  progress: number;
  artwork: string;
  challenge: string | null;
  distanceMi: number;
  x: number;
  y: number;
};

export const PLACE_KIND_LABELS: Record<PlaceKind, string> = {
  station: "Recovery station",
  garden: "Community garden",
  compost: "Compost destination",
  building: "Participating building",
  project: "Neighborhood project",
  future: "Future green site",
};

export const PLACES: Place[] = [
  {
    id: "st-04",
    name: "Station 04 — Livernois & Curtis",
    kind: "station",
    neighborhood: "Bagley",
    accepts: "Food scraps, coffee grounds, paper napkins",
    progressLabel: "Community artwork",
    progress: 82,
    artwork: "Livernois mural — stage 5 of 6",
    challenge: "Visit this station this week",
    distanceMi: 0.2,
    x: 30,
    y: 38,
  },
  {
    id: "st-07",
    name: "Station 07 — Eastern Market Shed 5",
    kind: "station",
    neighborhood: "Eastern Market",
    accepts: "Food scraps, plant trimmings",
    progressLabel: "Community artwork",
    progress: 46,
    artwork: "Market harvest panels — stage 3 of 6",
    challenge: "Drop off at a second location",
    distanceMi: 1.4,
    x: 70,
    y: 22,
  },
  {
    id: "gd-02",
    name: "Brightmoor community garden",
    kind: "garden",
    neighborhood: "Brightmoor",
    accepts: "Receives finished compost",
    progressLabel: "Beds built with ReClaim compost",
    progress: 64,
    artwork: "Painted fence project by local youth",
    challenge: "Visit the garden receiving your compost",
    distanceMi: 2.1,
    x: 18,
    y: 70,
  },
  {
    id: "cp-01",
    name: "Southwest compost yard",
    kind: "compost",
    neighborhood: "Springwells",
    accepts: "Processing site — no public drop-off",
    progressLabel: "Material recovered this month",
    progress: 91,
    artwork: "Loop mural on the yard wall",
    challenge: null,
    distanceMi: 3.3,
    x: 74,
    y: 68,
  },
  {
    id: "bl-09",
    name: "Grand River Lofts",
    kind: "building",
    neighborhood: "Core City",
    accepts: "Residents-only organics chute",
    progressLabel: "Households participating",
    progress: 57,
    artwork: "Lobby artwork tracks the building's stage",
    challenge: null,
    distanceMi: 1.1,
    x: 46,
    y: 54,
  },
  {
    id: "pj-03",
    name: "Chene Street pocket park",
    kind: "project",
    neighborhood: "McDougall-Hunt",
    accepts: "Neighborhood project site",
    progressLabel: "Soil delivered toward the build",
    progress: 35,
    artwork: "Mosaic planter benches in progress",
    challenge: "Join a Saturday build day",
    distanceMi: 2.6,
    x: 60,
    y: 84,
  },
  {
    id: "fu-01",
    name: "Future rain garden — Warren & 24th",
    kind: "future",
    neighborhood: "Hubbard Richard",
    accepts: "Planned green infrastructure",
    progressLabel: "Community support",
    progress: 22,
    artwork: "Artwork concept in design",
    challenge: null,
    distanceMi: 4.0,
    x: 24,
    y: 18,
  },
];

export type Challenge = {
  id: string;
  title: string;
  detail: string;
  reward: string;
  steps: number;
};

export const CHALLENGES: Challenge[] = [
  {
    id: "ch-visit",
    title: "Visit a ReClaim station",
    detail: "Find any station on the map and drop off food scraps.",
    reward: "Explorer badge",
    steps: 1,
  },
  {
    id: "ch-learn",
    title: "Learn what belongs in organics",
    detail: "Use sorting practice to check three different items.",
    reward: "Sorting badge",
    steps: 3,
  },
  {
    id: "ch-three",
    title: "Participate at three locations",
    detail: "Take part at three different ReClaim sites.",
    reward: "Neighborhood badge",
    steps: 3,
  },
  {
    id: "ch-garden",
    title: "Visit the garden receiving compost",
    detail: "Visit the garden and explore every step of the recovery loop.",
    reward: "Full-loop badge",
    steps: 7,
  },
  {
    id: "ch-season",
    title: "Neighborhood sustainability challenge",
    detail: "Check in at Chene Street pocket park and join its build day in this demo.",
    reward: "Season badge",
    steps: 1,
  },
];

export type LoopStep = {
  id: string;
  title: string;
  detail: string;
};

export const LOOP_STEPS: LoopStep[] = [
  {
    id: "scraps",
    title: "Food scraps",
    detail: "Peels, grounds, and plate scrapings go into the organics bin at a station.",
  },
  {
    id: "collection",
    title: "Collection",
    detail: "Each bin is collected on a route and weighed before it leaves the block.",
  },
  {
    id: "processing",
    title: "Processing",
    detail: "The processor removes contamination and records what was actually recovered.",
  },
  {
    id: "compost",
    title: "Compost",
    detail: "Recovered material becomes finished compost after curing.",
  },
  {
    id: "soil",
    title: "Soil",
    detail: "Compost is blended into soil for beds, planters, and street trees.",
  },
  {
    id: "gardens",
    title: "Gardens and green space",
    detail: "Soil goes to gardens, pocket parks, and rain gardens across the neighborhood.",
  },
];

export const BADGES = [
  { id: "bg-first", name: "Explorer", challengeId: "ch-visit" },
  { id: "bg-sorter", name: "Careful sorter", challengeId: "ch-learn" },
  { id: "bg-explorer", name: "Neighborhood", challengeId: "ch-three" },
  { id: "bg-loop", name: "Full loop", challengeId: "ch-garden" },
  { id: "bg-season", name: "Season champion", challengeId: "ch-season" },
];
