import { afterEach, describe, expect, test, vi } from 'vitest'
import type { RouteAnalysisResponse } from '../types/routeAnalysis.types'

vi.mock('../../../shared/config/env', () => ({
  API_BASE_URL: 'http://localhost:8080',
}))

describe('analyzeRoute', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('posts to /api/v1/routes/analyze with gameCode, stageOrder, and goal', async () => {
    const { analyzeRoute } = await import('./routeAnalysisApi')

    const mockResponse: RouteAnalysisResponse ={
      gameCode: 'MMX',
      difficultyScore: 74,
      difficultyLabel: 'MEDIUM',
      backtrackingScore: 62,
      estimatedMinutes: 87,
      warnings: [
        {
          type: 'MISSING_REQUIREMENT',
          message: 'Ride armor requirement is missing for this stage.',
          stageSlug: 'spark-mandrill',
        },
      ],
      recommendations: [
        {
          type: 'BOSS_ORDER',
          severity: 'WARNING',
          message: 'Consider moving Spark Mandrill after Chill Penguin for safer progression.',
          relatedStages: ['chill-penguin', 'spark-mandrill'],
        },
      ],
      breakdown: {
        baseDifficultyAverage: 64,
        combatDifficulty: 45,
        routeEfficiencyScore: 67,
        timePenaltyMinutes: 20,
        weaknessReduction: 19,
      },
    }

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => await Promise.resolve(mockResponse),
    })

    vi.stubGlobal('fetch', mockFetch)

    const payload = {
      gameCode: 'MMX',
      stageOrder: ['chill-penguin', 'storm-eagle', 'flame-mammoth', 'spark-mandrill', 'armored-armadillo', 'launch-octopus', 'boomer-kwang', 'sting-chameleon'],
      goal: 'HUNDRED_PERCENT' as const,
    }

    await analyzeRoute(payload)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('http://localhost:8080/api/v1/routes/analyze')
    expect(init.method).toBe('POST')
    expect(init.body).toBe(JSON.stringify(payload))
    expect((init.headers as Headers).get('Content-Type')).toBe('application/json')
  })
})
