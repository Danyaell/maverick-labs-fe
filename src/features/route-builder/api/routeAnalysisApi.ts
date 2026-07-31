import { fetchJson } from '../../../shared/api/httpClient'
import { API_BASE_URL } from '../../../shared/config/env'
import type {
  AnalyzeRouteRequest,
  DifficultyLabel,
  RecommendationSeverity,
  RecommendationType,
  RouteAnalysisResponse,
  RouteBreakdown,
  RouteRecommendation,
  RouteWarning,
  RouteWarningType,
} from '../types/routeAnalysis.types'

const DIFFICULTY_LABELS = new Set<DifficultyLabel>(['VERY_EASY', 'EASY', 'MEDIUM', 'HARD', 'VERY_HARD'])
const WARNING_TYPES = new Set<RouteWarningType>(['MISSING_REQUIREMENT', 'BACKTRACKING', 'TIME_RISK', 'DIFFICULTY_SPIKE', 'BOSS_WITHOUT_WEAKNESS'])
const RECOMMENDATION_TYPES = new Set<RecommendationType>(['BOSS_ORDER', 'BACKTRACKING', 'ROUTE_EFFICIENCY'])
const RECOMMENDATION_SEVERITIES = new Set<RecommendationSeverity>(['INFO', 'WARNING', 'SUCCESS'])

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isRouteWarning(value: unknown): value is RouteWarning {
  return (
    isObject(value) &&
    WARNING_TYPES.has(value.type as RouteWarningType) &&
    typeof value.message === 'string' &&
    (value.stageSlug === undefined || value.stageSlug === null || typeof value.stageSlug === 'string')
  )
}

function isRouteBreakdown(value: unknown): value is RouteBreakdown {
  return (
    isObject(value) &&
    typeof value.baseDifficultyAverage === 'number' &&
    typeof value.combatDifficulty === 'number' &&
    typeof value.routeEfficiencyScore === 'number' &&
    typeof value.timePenaltyMinutes === 'number' &&
    typeof value.weaknessReduction === 'number'
  )
}

function isRouteRecommendation(value: unknown): value is RouteRecommendation {
  return (
    isObject(value) &&
    RECOMMENDATION_TYPES.has(value.type as RecommendationType) &&
    RECOMMENDATION_SEVERITIES.has(value.severity as RecommendationSeverity) &&
    typeof value.message === 'string' &&
    (value.relatedStages === undefined ||
      value.relatedStages === null ||
      (Array.isArray(value.relatedStages) && value.relatedStages.every((stage) => typeof stage === 'string')))
  )
}

function isRouteAnalysisResponse(value: unknown): value is RouteAnalysisResponse {
  return (
    isObject(value) &&
    typeof value.gameCode === 'string' &&
    typeof value.difficultyScore === 'number' &&
    DIFFICULTY_LABELS.has(value.difficultyLabel as DifficultyLabel) &&
    typeof value.backtrackingScore === 'number' &&
    typeof value.estimatedMinutes === 'number' &&
    Array.isArray(value.warnings) &&
    value.warnings.every((warning) => isRouteWarning(warning)) &&
    Array.isArray(value.recommendations) &&
    value.recommendations.every((recommendation) => isRouteRecommendation(recommendation)) &&
    isRouteBreakdown(value.breakdown)
  )
}

function validateRouteAnalysisResponse(value: unknown): RouteAnalysisResponse {
  if (!isRouteAnalysisResponse(value)) {
    throw new Error('Invalid route analysis response payload.')
  }
  return value
}

export async function analyzeRoute(request: AnalyzeRouteRequest, init?: RequestInit): Promise<RouteAnalysisResponse> {
  const url = `${API_BASE_URL}/api/v1/routes/analyze`
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')

  const response = await fetchJson<unknown>(url, {
    ...init,
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  })

  return validateRouteAnalysisResponse(response)
}
