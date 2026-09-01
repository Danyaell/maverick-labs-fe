/**
 * Directional roadmap only.
 * Keep aligned with issue #23, current product behavior, and unfinished
 * roadmap items in both repository READMEs.
 * Do not add dates, percentages, or delivery commitments.
 */
export type RoadmapPhaseId = "available" | "next" | "later";

export interface RoadmapItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly statusLabel?: "Coming soon";
}

export interface RoadmapPhase {
  readonly id: RoadmapPhaseId;
  readonly label: "Available now" | "Next" | "Later";
  readonly summary: string;
  readonly items: readonly RoadmapItem[];
}

export interface ProductCoverage {
  readonly summary: string;
  readonly plannedGames: string;
  readonly plannedStatus: "Coming soon";
  readonly plannedDescription: string;
}

export const PRODUCT_COVERAGE = {
  summary:
    "The catalog covers Mega Man X through Mega Man X8. Mega Man X is currently the only game with enabled stage details and route planning.",
  plannedGames: "MMX2–MMX8",
  plannedStatus: "Coming soon",
  plannedDescription:
    "These games are catalog entries only. Their stage-detail and route-planning experiences are not enabled yet.",
} as const satisfies ProductCoverage;

export const ROADMAP_PHASES = [
  {
    id: "available",
    label: "Available now",
    summary: "The complete product slice available today.",
    items: [
      {
        id: "catalog",
        title: "Eight-game catalog",
        description:
          "Browse Mega Man X through Mega Man X8 in release order.",
      },
      {
        id: "mmx-vertical-slice",
        title: "Complete Mega Man X experience",
        description:
          "Explore stages, bosses, weapons, and collectibles, build an eight-stage route, and analyze difficulty, backtracking, estimated time, warnings, and recommendations.",
      },
    ],
  },
  {
    id: "next",
    label: "Next",
    summary: "The next product improvements, without a committed delivery date.",
    items: [
      {
        id: "score-explanations",
        title: "Clearer analysis explanations",
        description:
          "Improve how score contributions, breakdown values, and recommendations are explained and grouped.",
      },
      {
        id: "additional-games",
        title: "Detailed data for additional games",
        description:
          "Add stages, bosses, weapons, collectibles, and requirements for MMX2 through MMX8 as backend modeling becomes available.",
        statusLabel: "Coming soon",
      },
    ],
  },
  {
    id: "later",
    label: "Later",
    summary: "Longer-term directions for route planning and quality.",
    items: [
      {
        id: "flexible-routes",
        title: "More flexible route analysis",
        description:
          "Support additional route goals and partial-stage routes.",
      },
      {
        id: "persistence-sharing",
        title: "Saved and shareable routes",
        description:
          "Persist, name, and share custom route configurations.",
      },
      {
        id: "comparison",
        title: "Route comparison",
        description:
          "Compare routes and their analysis results side by side.",
      },
      {
        id: "recommendation-rules",
        title: "Richer recommendation rules",
        description:
          "Expand recommendation prioritization and score explanations.",
      },
      {
        id: "browser-testing",
        title: "Real-browser E2E coverage",
        description:
          "Validate pointer, touch, keyboard, and responsive behavior in real browsers.",
      },
    ],
  },
] as const satisfies readonly RoadmapPhase[];
