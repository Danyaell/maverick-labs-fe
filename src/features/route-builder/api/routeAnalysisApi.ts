import { fetchJson } from '../../../shared/api/httpClient'
import { API_BASE_URL } from '../../../shared/config/env'
import type {
  AnalyzeRouteRequest,
  DifficultyLabel,
  RouteAnalysisResponse,
  RouteBreakdown,
  RouteWarning,
  RouteWarningType,
} from '../types/routeAnalysis.types'

const DIFFICULTY_LABELS = new Set<DifficultyLabel>(['VERY_EASY', 'EASY', 'MEDIUM', 'HARD', 'VERY_HARD'])
const WARNING_TYPES = new Set<RouteWarningType>(['MISSING_REQUIREMENT', 'BACKTRACKING', 'TIME_RISK', 'DIFFICULTY_SPIKE', 'BOSS_WITHOUT_WEAKNESS'])

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
    typeof value.bossDifficulty === 'number' &&
    typeof value.weaknessOptimization === 'number' &&
    typeof value.baseDifficulty === 'number' && //backtrackingPenalty
    typeof value.timePenalty === 'number'
  )
}

function isRouteAnalysisResponse(value: RouteAnalysisResponse): value is RouteAnalysisResponse {
  return (
    isObject(value) &&
    typeof value.gameCode === 'string' &&
    typeof value.difficultyScore === 'number' &&
    DIFFICULTY_LABELS.has(value.difficultyLabel as DifficultyLabel) &&
    typeof value.backtrackingScore === 'number' &&
    typeof value.estimatedMinutes === 'number' &&
    Array.isArray(value.warnings) &&
    value.warnings.every((warning) => isRouteWarning(warning)) &&
    isRouteBreakdown(value.breakdown)
  )
}

function validateRouteAnalysisResponse(value: RouteAnalysisResponse): RouteAnalysisResponse {
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

  return validateRouteAnalysisResponse(response as RouteAnalysisResponse)
}
