export type RouteGoal = 'HUNDRED_PERCENT'

export type DifficultyLabel = 'VERY_EASY' | 'EASY' | 'NORMAL' | 'HARD' | 'VERY_HARD'

export type RouteWarningType = 'MISSING_REQUIREMENT' | 'BACKTRACKING' | 'TIME_RISK' | 'DIFFICULTY_SPIKE'

export interface AnalyzeRouteRequest {
  gameCode: string
  stageOrder: string[]
  goal: RouteGoal
}

export interface RouteWarning {
  type: RouteWarningType
  message: string
  stageSlug?: string | null
}

export interface RouteBreakdown {
  bossDifficulty: number
  weaknessOptimization: number
  backtrackingPenalty: number
  timePenalty: number
}

export interface RouteAnalysisResponse {
  gameCode: string
  difficultyScore: number
  difficultyLabel: DifficultyLabel
  backtrackingScore: number
  estimatedMinutes: number
  warnings: RouteWarning[]
  breakdown: RouteBreakdown
}
