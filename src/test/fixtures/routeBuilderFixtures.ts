import type { GameDetail } from "../../features/games/types/game.types";
import type { RouteAnalysisResponse } from "../../features/route-builder/types/routeAnalysis.types";

export function createGameDetail(): GameDetail {
  return {
    code: "MMX",
    title: "Mega Man X",
    releaseOrder: 1,
    stages: [
      {
        slug: "chill-penguin",
        name: "Chill Penguin Stage",
        stageOrder: 1,
        imageAssetKey: "mmx.stage.chill-penguin",
        boss: {
          slug: "chill-penguin",
          name: "Chill Penguin",
          imageAssetKey: "mmx.boss.chill-penguin",
        },
        weaponReward: {
          slug: "shotgun-ice",
          name: "Shotgun Ice",
          description: "Fires ice projectiles.",
          imageAssetKey: "mmx.weapon.shotgun-ice",
        },
        collectibles: [],
      },
      {
        slug: "storm-eagle",
        name: "Storm Eagle Stage",
        stageOrder: 2,
        imageAssetKey: "mmx.stage.storm-eagle",
        boss: {
          slug: "storm-eagle",
          name: "Storm Eagle",
          imageAssetKey: "mmx.boss.storm-eagle",
        },
        weaponReward: {
          slug: "storm-tornado",
          name: "Storm Tornado",
          description: "Creates a tornado attack.",
          imageAssetKey: "mmx.weapon.storm-tornado",
        },
        collectibles: [],
      },
      {
        slug: "flame-mammoth",
        name: "Flame Mammoth Stage",
        stageOrder: 3,
        imageAssetKey: "mmx.stage.flame-mammoth",
        boss: {
          slug: "flame-mammoth",
          name: "Flame Mammoth",
          imageAssetKey: "mmx.boss.flame-mammoth",
        },
        weaponReward: {
          slug: "fire-wave",
          name: "Fire Wave",
          description: "Launches flames.",
          imageAssetKey: "mmx.weapon.fire-wave",
        },
        collectibles: [],
      },
    ],
  };
}

export function createRouteAnalysis(
  overrides: Partial<RouteAnalysisResponse> = {},
): RouteAnalysisResponse {
  return {
    gameCode: "MMX",
    difficultyScore: 71,
    difficultyLabel: "MEDIUM",
    backtrackingScore: 64,
    estimatedMinutes: 89,
    warnings: [],
    recommendations: [],
    breakdown: {
      baseDifficultyAverage: 50,
      combatDifficulty: 60,
      routeEfficiencyScore: 75,
      timePenaltyMinutes: 10,
      weaknessReduction: 20,
    },
    ...overrides,
  };
}

export const DEFAULT_STAGE_ORDER = [
  "chill-penguin",
  "storm-eagle",
  "flame-mammoth"
]