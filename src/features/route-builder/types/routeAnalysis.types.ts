export type RouteGoal = 'HUNDRED_PERCENT'

export type DifficultyLabel = 'VERY_EASY' | 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD'
export type RouteWarningType =
  | 'MISSING_REQUIREMENT'
  | 'BACKTRACKING'
  | 'TIME_RISK'
  | 'DIFFICULTY_SPIKE'
  | 'BOSS_WITHOUT_WEAKNESS'
export type RecommendationType = 'BOSS_ORDER' | 'BACKTRACKING' | 'ROUTE_EFFICIENCY'
export type RecommendationSeverity = 'INFO' | 'WARNING' | 'SUCCESS'

export interface AnalyzeRouteRequest {
  gameCode: string
  stageOrder: string[]
  goal: RouteGoal
}

export interface RouteWarning {
  type: RouteWarningType
  message: string
  stageSlug?: string | null
  collectibleSlug?: string | null
}

export interface RouteBreakdown {
  baseDifficultyAverage: number
  combatDifficulty: number
  routeEfficiencyScore: number
  timePenaltyMinutes: number
  weaknessReduction: number
}

export interface RouteRecommendation {
  type: RecommendationType
  severity: RecommendationSeverity
  message: string
  relatedStages?: string[] | null
}

export interface RouteAnalysisResponse {
  gameCode: string
  difficultyScore: number
  difficultyLabel: DifficultyLabel
  backtrackingScore: number
  estimatedMinutes: number
  warnings: RouteWarning[]
  recommendations: RouteRecommendation[]
  breakdown: RouteBreakdown
}
