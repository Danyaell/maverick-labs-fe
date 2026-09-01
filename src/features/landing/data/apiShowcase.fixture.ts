import type {
  AnalyzeRouteRequest,
  RouteAnalysisResponse,
} from "../../route-builder/types/routeAnalysis.types";

/**
 * API showcase fixture — provenance
 * ===================================
 * Captured from the backend's published OpenAPI example for
 * POST /api/v1/routes/analyze (see https://github.com/Danyaell/maverick-labs-be),
 * cross-checked against the real captured response in
 * src/features/landing/data/routeAnalysisDemo.fixture.ts (adjusted-order state).
 *
 * Regenerate this fixture whenever the OpenAPI contract or analyzer rules change:
 * re-export the current OpenAPI example for this endpoint and update the objects
 * below to match. Do not hand-edit values without a source to verify them against.
 */

export interface ApiOperation {
  readonly method: "GET" | "POST";
  readonly path: string;
  readonly purpose: string;
}

export const API_OPERATIONS: readonly ApiOperation[] = [
  {
    method: "GET",
    path: "/api/v1/games",
    purpose: "List the eight Mega Man X catalog entries.",
  },
  {
    method: "GET",
    path: "/api/v1/games/{gameCode}",
    purpose:
      "Inspect the modeled stages, Mavericks, weapons, and collectibles for a game.",
  },
  {
    method: "POST",
    path: "/api/v1/routes/analyze",
    purpose:
      "Analyze an ordered stage route and return modeled scores, warnings, breakdowns, and recommendations.",
  },
] as const;

export const apiExampleRequest = {
  gameCode: "MMX",
  stageOrder: [
    "chill-penguin",
    "spark-mandrill",
    "storm-eagle",
    "flame-mammoth",
    "armored-armadillo",
    "launch-octopus",
    "boomer-kuwanger",
    "sting-chameleon",
  ],
  goal: "HUNDRED_PERCENT",
} satisfies AnalyzeRouteRequest;

/** Trimmed to one warning and one recommendation — a real response can include more. */
export const apiExampleResponseExcerpt = {
  gameCode: "MMX",
  difficultyScore: 47,
  difficultyLabel: "MEDIUM",
  backtrackingScore: 80,
  estimatedMinutes: 140,
  warnings: [
    {
      type: "MISSING_REQUIREMENT",
      message:
        "Collectible Heart Tank may require revisiting Chill Penguin Stage later.",
      stageSlug: "chill-penguin",
      collectibleSlug: "chill-penguin-heart-tank",
    },
  ],
  breakdown: {
    baseDifficultyAverage: 67,
    combatDifficulty: 47,
    weaknessReduction: 20,
    routeEfficiencyScore: 68,
    timePenaltyMinutes: 20,
  },
  recommendations: [
    {
      type: "BOSS_ORDER",
      severity: "INFO",
      message:
        "Good choice: Chill Penguin before Spark Mandrill reduces difficulty because you get Shotgun Ice.",
      relatedStages: ["chill-penguin", "spark-mandrill"],
    },
  ],
} satisfies RouteAnalysisResponse;
