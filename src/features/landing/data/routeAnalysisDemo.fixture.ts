import type {
  AnalyzeRouteRequest,
  RouteAnalysisResponse,
} from "../../route-builder/types/routeAnalysis.types";

/**
 * Route analysis demo fixture — provenance
 * ==========================================
 * Endpoint:        POST {VITE_API_BASE_URL}/api/v1/routes/analyze
 * Environment:     Local development backend
 * API base URL:    http://localhost:8080
 * Capture date:    2026-08-27
 * Backend repo:    https://github.com/Danyaell/maverick-labs-be
 *
 * Both responses below are complete, unmodified response bodies returned by
 * the backend commit documented above.
 */

export const initialOrderRequest = {
  gameCode: "MMX",
  stageOrder: [
    "spark-mandrill",
    "chill-penguin",
    "storm-eagle",
    "flame-mammoth",
    "armored-armadillo",
    "launch-octopus",
    "boomer-kuwanger",
    "sting-chameleon",
  ],
  goal: "HUNDRED_PERCENT",
} satisfies AnalyzeRouteRequest;

export const initialOrderResponse = {
  gameCode: "MMX",
  difficultyScore: 50,
  difficultyLabel: "MEDIUM",
  backtrackingScore: 100,
  estimatedMinutes: 148,
  warnings: [
    {
      type: "MISSING_REQUIREMENT",
      message:
        "Collectible Heart Tank may require revisiting Spark Mandrill Stage later.",
      stageSlug: "spark-mandrill",
      collectibleSlug: "spark-mandrill-heart-tank",
    },
    {
      type: "MISSING_REQUIREMENT",
      message:
        "Collectible Sub Tank may require revisiting Spark Mandrill Stage later.",
      stageSlug: "spark-mandrill",
      collectibleSlug: "spark-mandrill-sub-tank",
    },
    {
      type: "MISSING_REQUIREMENT",
      message:
        "Collectible Heart Tank may require revisiting Chill Penguin Stage later.",
      stageSlug: "chill-penguin",
      collectibleSlug: "chill-penguin-heart-tank",
    },
    {
      type: "MISSING_REQUIREMENT",
      message:
        "Collectible Hadouken may require revisiting Armored Armadillo Stage later.",
      stageSlug: "armored-armadillo",
      collectibleSlug: "armored-armadillo-hadouken",
    },
    {
      type: "MISSING_REQUIREMENT",
      message:
        "Collectible Heart Tank may require revisiting Boomer Kuwanger Stage later.",
      stageSlug: "boomer-kuwanger",
      collectibleSlug: "boomer-kuwanger-heart-tank",
    },
  ],
  breakdown: {
    baseDifficultyAverage: 67,
    combatDifficulty: 50,
    routeEfficiencyScore: 47,
    timePenaltyMinutes: 28,
    weaknessReduction: 17,
  },
  recommendations: [
    {
      type: "BACKTRACKING",
      severity: "WARNING",
      message:
        "You may need to revisit Armored Armadillo to collect all items.",
      relatedStages: ["armored-armadillo"],
    },
    {
      type: "BACKTRACKING",
      severity: "WARNING",
      message: "You may need to revisit Boomer Kuwanger to collect all items.",
      relatedStages: ["boomer-kuwanger"],
    },
    {
      type: "BACKTRACKING",
      severity: "WARNING",
      message: "You may need to revisit Chill Penguin to collect all items.",
      relatedStages: ["chill-penguin"],
    },
    {
      type: "BACKTRACKING",
      severity: "WARNING",
      message: "You may need to revisit Spark Mandrill to collect all items.",
      relatedStages: ["spark-mandrill"],
    },
    {
      type: "BOSS_ORDER",
      severity: "WARNING",
      message:
        "Move Chill Penguin before Spark Mandrill to reduce difficulty because Chill Penguin gives you Shotgun Ice.",
      relatedStages: ["chill-penguin", "spark-mandrill"],
    },
    {
      type: "BOSS_ORDER",
      severity: "WARNING",
      message:
        "Move Flame Mammoth before Chill Penguin to reduce difficulty because Flame Mammoth gives you Fire Wave.",
      relatedStages: ["flame-mammoth", "chill-penguin"],
    },
    {
      type: "BOSS_ORDER",
      severity: "WARNING",
      message:
        "Move Sting Chameleon before Storm Eagle to reduce difficulty because Sting Chameleon gives you Chameleon Sting.",
      relatedStages: ["sting-chameleon", "storm-eagle"],
    },
    {
      type: "BOSS_ORDER",
      severity: "INFO",
      message:
        "Good choice: Spark Mandrill before Armored Armadillo reduces difficulty because you get Electric Spark.",
      relatedStages: ["spark-mandrill", "armored-armadillo"],
    },
    {
      type: "BOSS_ORDER",
      severity: "INFO",
      message:
        "Good choice: Storm Eagle before Flame Mammoth reduces difficulty because you get Storm Tornado.",
      relatedStages: ["storm-eagle", "flame-mammoth"],
    },
  ],
} satisfies RouteAnalysisResponse;

export const adjustedOrderRequest = {
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

export const adjustedOrderResponse = {
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
    {
      type: "MISSING_REQUIREMENT",
      message:
        "Collectible Sub Tank may require revisiting Spark Mandrill Stage later.",
      stageSlug: "spark-mandrill",
      collectibleSlug: "spark-mandrill-sub-tank",
    },
    {
      type: "MISSING_REQUIREMENT",
      message:
        "Collectible Hadouken may require revisiting Armored Armadillo Stage later.",
      stageSlug: "armored-armadillo",
      collectibleSlug: "armored-armadillo-hadouken",
    },
    {
      type: "MISSING_REQUIREMENT",
      message:
        "Collectible Heart Tank may require revisiting Boomer Kuwanger Stage later.",
      stageSlug: "boomer-kuwanger",
      collectibleSlug: "boomer-kuwanger-heart-tank",
    },
  ],
  breakdown: {
    baseDifficultyAverage: 67,
    combatDifficulty: 47,
    routeEfficiencyScore: 68,
    timePenaltyMinutes: 20,
    weaknessReduction: 20,
  },
  recommendations: [
    {
      type: "BACKTRACKING",
      severity: "WARNING",
      message:
        "You may need to revisit Armored Armadillo to collect all items.",
      relatedStages: ["armored-armadillo"],
    },
    {
      type: "BACKTRACKING",
      severity: "WARNING",
      message: "You may need to revisit Boomer Kuwanger to collect all items.",
      relatedStages: ["boomer-kuwanger"],
    },
    {
      type: "BACKTRACKING",
      severity: "WARNING",
      message: "You may need to revisit Chill Penguin to collect all items.",
      relatedStages: ["chill-penguin"],
    },
    {
      type: "BACKTRACKING",
      severity: "WARNING",
      message: "You may need to revisit Spark Mandrill to collect all items.",
      relatedStages: ["spark-mandrill"],
    },
    {
      type: "BOSS_ORDER",
      severity: "WARNING",
      message:
        "Move Flame Mammoth before Chill Penguin to reduce difficulty because Flame Mammoth gives you Fire Wave.",
      relatedStages: ["flame-mammoth", "chill-penguin"],
    },
    {
      type: "BOSS_ORDER",
      severity: "WARNING",
      message:
        "Move Sting Chameleon before Storm Eagle to reduce difficulty because Sting Chameleon gives you Chameleon Sting.",
      relatedStages: ["sting-chameleon", "storm-eagle"],
    },
    {
      type: "BOSS_ORDER",
      severity: "INFO",
      message:
        "Good choice: Chill Penguin before Spark Mandrill reduces difficulty because you get Shotgun Ice.",
      relatedStages: ["chill-penguin", "spark-mandrill"],
    },
    {
      type: "BOSS_ORDER",
      severity: "INFO",
      message:
        "Good choice: Storm Eagle before Flame Mammoth reduces difficulty because you get Storm Tornado.",
      relatedStages: ["storm-eagle", "flame-mammoth"],
    },
  ],
} satisfies RouteAnalysisResponse;

export interface RouteAnalysisDemoState {
  id: "initial" | "adjusted";
  label: string;
  request: AnalyzeRouteRequest;
  response: RouteAnalysisResponse;
  explanation: string;
}

export const routeAnalysisDemoStates: readonly [
  RouteAnalysisDemoState,
  RouteAnalysisDemoState,
] = [
  {
    id: "initial",
    label: "Initial order",
    request: initialOrderRequest,
    response: initialOrderResponse,
    explanation:
      "Spark Mandrill comes first, so Shotgun Ice and the Leg Upgrade are not yet available. The analyzer applies the boss's full difficulty and flags both the Heart Tank and Sub Tank for a later visit.",
  },
  {
    id: "adjusted",
    label: "Recommended adjustment",
    request: adjustedOrderRequest,
    response: adjustedOrderResponse,
    explanation:
      "Chill Penguin now comes first, unlocking Shotgun Ice and the Leg Upgrade before Spark Mandrill. The boss becomes easier and the Heart Tank is available on the first visit; the Sub Tank still requires Boomerang Cutter.",
  },
];

/** Display names for the MMX Mavericks, keyed by stage slug. */
export const MMX_STAGE_NAMES: Record<string, string> = {
  "chill-penguin": "Chill Penguin",
  "spark-mandrill": "Spark Mandrill",
  "storm-eagle": "Storm Eagle",
  "flame-mammoth": "Flame Mammoth",
  "armored-armadillo": "Armored Armadillo",
  "launch-octopus": "Launch Octopus",
  "boomer-kuwanger": "Boomer Kuwanger",
  "sting-chameleon": "Sting Chameleon",
};
