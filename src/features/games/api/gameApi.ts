import type { GameDetail, GameSummary } from '../types/game.types'
import { fetchJson } from '../../../shared/api/httpClient'
import { API_BASE_URL } from '../../../shared/config/env'

function isGameSummary(value: unknown): value is GameSummary {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).code === 'string' &&
    typeof (value as Record<string, unknown>).title === 'string' &&
    typeof (value as Record<string, unknown>).releaseOrder === 'number'
  )
}

function validateGameSummaries(value: unknown): GameSummary[] {
  if (!Array.isArray(value)) {
    throw new Error('Invalid response format: expected an array of games.')
  }

  return value.map((item, index) => {
    if (!isGameSummary(item)) {
      throw new Error(`Invalid game item at index ${index}.`)
    }

    return item
  })
}

export async function fetchGames(init?: RequestInit): Promise<GameSummary[]> {
  const url = `${API_BASE_URL}/api/v1/games`

  const response = await fetchJson<unknown>(url, init)
  return validateGameSummaries(response)
}

export async function fetchGameDetail(code: string, init?: RequestInit): Promise<GameDetail> {
  const url = `${API_BASE_URL}/api/v1/games/${code}`

  const response = await fetchJson<GameDetail>(url, init)
  return response
}
