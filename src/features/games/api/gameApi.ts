import type { GameSummary } from '../types/game.types'
import { fetchJson } from '../../../shared/api/httpClient'

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

const DEFAULT_API_BASE_URL = 'http://localhost:8080'

export async function fetchGames(init?: RequestInit): Promise<GameSummary[]> {
  const baseUrl = String(import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '')
  const url = `${baseUrl}/api/v1/games`

  const response = await fetchJson<unknown>(url, init)
  return validateGameSummaries(response)
}
