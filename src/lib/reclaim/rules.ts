export type ItemRule = {
  /** Canonical display name. */
  label: string;
  accepted: boolean;
  /** One short line of why. */
  reason: string;
  /** Keywords used for plain-words matching. */
  keywords: string[];
};

/**
 * Illustrative processor rules for the demo, not a real processor approval. Answers come only from this list —
 * never free-form AI.
 */
export const ITEM_RULES: ItemRule[] = [
  {
    label: "Banana peel",
    accepted: true,
    reason: "Food scraps are accepted.",
    keywords: ["banana", "peel", "fruit skin"],
  },
  {
    label: "Apple core",
    accepted: true,
    reason: "Food scraps are accepted.",
    keywords: ["apple", "core", "fruit", "pear", "orange"],
  },
  {
    label: "Vegetable trimmings",
    accepted: true,
    reason: "Food scraps are accepted.",
    keywords: ["vegetable", "veggie", "lettuce", "carrot", "potato", "onion", "greens", "salad"],
  },
  {
    label: "Coffee grounds",
    accepted: true,
    reason: "Grounds and loose tea are accepted.",
    keywords: ["coffee grounds", "grounds", "loose tea", "loose tea leaves"],
  },
  {
    label: "Bread and grains",
    accepted: true,
    reason: "Cooked and baked food is accepted.",
    keywords: ["bread", "rice", "pasta", "grain", "tortilla", "cereal"],
  },
  {
    label: "Eggshells",
    accepted: true,
    reason: "Eggshells are accepted.",
    keywords: ["eggshell", "eggshells"],
  },
  {
    label: "Paper napkin",
    accepted: true,
    reason: "Unlined paper napkins and towels are accepted.",
    keywords: ["napkin", "paper napkins", "paper towel", "paper towels", "unlined paper napkin"],
  },
  {
    label: "Cut flowers and plant trimmings",
    accepted: true,
    reason: "Plant material is accepted.",
    keywords: ["flower", "cut flowers", "leaves", "plant trimmings", "grass"],
  },
  {
    label: "Plastic cup",
    accepted: false,
    reason: "Cups are not accepted in this demo organics stream.",
    keywords: ["cup", "plastic cup", "coffee cup", "lid", "straw", "bottle", "plastic"],
  },
  {
    label: "Plastic fork or utensil",
    accepted: false,
    reason: "Utensils belong in trash, even compostable-looking ones.",
    keywords: ["fork", "spoon", "knife", "utensil", "cutlery", "spork"],
  },
  {
    label: "Foil wrapper",
    accepted: false,
    reason: "Foil and wrappers belong in trash.",
    keywords: ["foil", "wrapper", "aluminum", "candy wrapper", "chip bag"],
  },
  {
    label: "Glass or can",
    accepted: false,
    reason: "Glass and metal are not accepted in this demo organics stream.",
    keywords: ["glass", "jar", "aluminum can", "tin can", "metal can", "metal"],
  },
  {
    label: "Diaper or wipes",
    accepted: false,
    reason: "These belong in trash.",
    keywords: ["diaper", "wipe", "sanitary", "pet waste", "litter"],
  },
  {
    label: "Meat and bones",
    accepted: false,
    reason: "This processor does not accept meat or bones.",
    keywords: ["meat", "bone", "chicken", "fish", "steak"],
  },
  {
    label: "Dairy",
    accepted: false,
    reason: "This processor does not accept dairy.",
    keywords: ["dairy", "milk", "cheese", "yogurt", "butter"],
  },
];

/** The small demo set the simulated camera recognizes. */
export const SCAN_ITEMS = [
  "Banana peel",
  "Apple core",
  "Paper napkin",
  "Plastic cup",
  "Plastic fork or utensil",
  "Foil wrapper",
] as const;

// Only whole item names/aliases and a small set of question forms are supported.
// Mixtures, packaging qualifiers, negation and unidentified objects stay unknown.
export function findRule(query: string): ItemRule | null {
  let item = query
    .toLowerCase()
    .trim()
    .replace(/[?.!]+$/g, "")
    .replace(/\s+/g, " ");
  const forms = [
    /^can (?:i|we) (?:put|place|drop|compost|recycle) (.+?)(?: (?:in|into) (?:the )?(?:organics|bin|compost|here))?$/,
    /^can (.+?) go (?:in|into) (?:the )?(?:organics|bin|compost|here)$/,
    /^is (.+?) (?:accepted|compostable)$/,
    /^what about (.+)$/,
  ];
  for (const form of forms) {
    const match = item.match(form);
    if (match?.[1]) {
      item = match[1];
      break;
    }
  }
  item = item.replace(/^(?:a|an|the|this|these|my) /, "");
  return (
    ITEM_RULES.find((rule) => [rule.label.toLowerCase(), ...rule.keywords].includes(item)) ?? null
  );
}

export function ruleByLabel(label: string): ItemRule | null {
  return ITEM_RULES.find((rule) => rule.label === label) ?? null;
}

// Both resident messages describe the SAME rule set. Operators choose emphasis,
// not arbitrary acceptance rules. Add a new processor policy as a reviewed unit.
export const GUIDANCE_MESSAGES = {
  standard:
    "Food scraps (no meat or dairy), unlined paper napkins and towels, and plant trimmings.",
  cups: "No cups or utensils. Food scraps (no meat or dairy), unlined paper napkins and towels, and plant trimmings are welcome.",
} as const;
export type GuidanceMessageId = keyof typeof GUIDANCE_MESSAGES;
export const DEFAULT_GUIDANCE = GUIDANCE_MESSAGES.standard;
export const AGENT_RECOMMENDATION = GUIDANCE_MESSAGES.cups;
