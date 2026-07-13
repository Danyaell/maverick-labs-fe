import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { GameDetailPage } from '../pages/GameDetailPage'
import type { GameDetail } from '../types/game.types'

const { mockFetchGameDetail } = vi.hoisted(() => ({
  mockFetchGameDetail: vi.fn(),
}))

const { mockAnalyzeRoute } = vi.hoisted(() => ({
  mockAnalyzeRoute: vi.fn(),
}))

vi.mock('../api/gameApi', () => ({
  fetchGameDetail: mockFetchGameDetail,
}))

vi.mock('../../route-builder/api/routeAnalysisApi', () => ({
  analyzeRoute: mockAnalyzeRoute,
}))

describe('GameDetailPage', () => {
  beforeEach(() => {
    mockFetchGameDetail.mockReset()
    mockAnalyzeRoute.mockReset()
  })

  test('shows the selected stage boss, weapon reward, and collectibles', async () => {
    const gameDetail: GameDetail = {
      code: 'MMX',
      title: 'Mega Man X',
      releaseOrder: 1,
      stages: [
        {
          slug: 'chill-penguin',
          name: 'Chill Penguin Stage',
          stageOrder: 1,
          imageAssetKey: 'mmx.stage.chill-penguin',
          boss: {
            slug: 'chill-penguin',
            name: 'Chill Penguin',
            imageAssetKey: 'mmx.boss.chill-penguin',
          },
          weaponReward: {
            slug: 'shotgun-ice',
            name: 'Shotgun Ice',
            description: 'Fires ice projectiles.',
            imageAssetKey: 'mmx.weapon.shotgun-ice',
          },
          collectibles: [
            {
              slug: 'heart-tank',
              name: 'Heart Tank',
              type: 'HEART_TANK',
              description: 'Increases maximum health.',
              imageAssetKey: 'mmx.collectible.heart-tank',
              sortOrder: 1,
            },
          ],
        },
        {
          slug: 'storm-eagle',
          name: 'Storm Eagle Stage',
          stageOrder: 2,
          imageAssetKey: 'mmx.stage.storm-eagle',
          boss: {
            slug: 'storm-eagle',
            name: 'Storm Eagle',
            imageAssetKey: 'mmx.boss.storm-eagle',
          },
          weaponReward: {
            slug: 'storm-tornado',
            name: 'Storm Tornado',
            description: 'Creates a tornado attack.',
            imageAssetKey: 'mmx.weapon.storm-tornado',
          },
          collectibles: [
            {
              slug: 'sub-tank',
              name: 'Sub Tank',
              type: 'SUB_TANK',
              description: 'Provides extra health reserve.',
              imageAssetKey: 'mmx.collectible.sub-tank',
              sortOrder: 1,
            },
          ],
        },
      ],
    }

    mockFetchGameDetail.mockResolvedValue(gameDetail)

    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/games/MMX']}>
        <Routes>
          <Route path="/games/:gameCode" element={<GameDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByAltText('Mega Man X')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /storm eagle stage/i }))

    expect(screen.getByText('Storm Eagle')).toBeInTheDocument()
    expect(screen.getByText('Storm Tornado')).toBeInTheDocument()
    expect(screen.getByText('Sub Tank')).toBeInTheDocument()
  })

  test('analyzes route only when clicking the button and uses visual stage order', async () => {
    const gameDetail: GameDetail = {
      code: 'MMX',
      title: 'Mega Man X',
      releaseOrder: 1,
      stages: [
        {
          slug: 'storm-eagle',
          name: 'Storm Eagle Stage',
          stageOrder: 2,
          imageAssetKey: 'mmx.stage.storm-eagle',
          boss: {
            slug: 'storm-eagle',
            name: 'Storm Eagle',
            imageAssetKey: 'mmx.boss.storm-eagle',
          },
          weaponReward: null,
          collectibles: [],
        },
        {
          slug: 'chill-penguin',
          name: 'Chill Penguin Stage',
          stageOrder: 1,
          imageAssetKey: 'mmx.stage.chill-penguin',
          boss: {
            slug: 'chill-penguin',
            name: 'Chill Penguin',
            imageAssetKey: 'mmx.boss.chill-penguin',
          },
          weaponReward: null,
          collectibles: [],
        },
      ],
    }

    mockFetchGameDetail.mockResolvedValue(gameDetail)
    mockAnalyzeRoute.mockResolvedValue({
      gameCode: 'MMX',
      difficultyScore: 71,
      difficultyLabel: 'MEDIUM',
      backtrackingScore: 64,
      estimatedMinutes: 89,
      warnings: [
        {
          type: 'MISSING_REQUIREMENT',
          message: 'You are missing a required item.',
          stageSlug: 'storm-eagle',
        },
      ],
      recommendations: [
        {
          type: 'BOSS_ORDER',
          severity: 'INFO',
          message: 'This route order is stable for first attempts.',
          relatedStages: ['chill-penguin'],
        },
      ],
      breakdown: {
        bossDifficulty: 36,
        weaknessOptimization: 28,
        baseDifficulty: -9,
        timePenalty: -7,
      },
    })

    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/games/MMX']}>
        <Routes>
          <Route path="/games/:gameCode" element={<GameDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await screen.findByRole('button', { name: /analyze route/i })
    expect(mockAnalyzeRoute).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /analyze route/i }))

    await waitFor(() =>
      expect(mockAnalyzeRoute).toHaveBeenCalledWith({
        gameCode: 'MMX',
        stageOrder: ['chill-penguin', 'storm-eagle'],
        goal: 'HUNDRED_PERCENT',
      }),
    )

    expect(await screen.findByText(/difficulty: 71 \/ 100/i)).toBeInTheDocument()
    expect(screen.getByText(/backtracking: 64 \/ 100/i)).toBeInTheDocument()
    expect(screen.getByText(/estimated time: 89 min/i)).toBeInTheDocument()
    expect(screen.getByText(/Recommendations/i)).toBeInTheDocument()
    expect(screen.getByText(/This route order is stable for first attempts/i)).toBeInTheDocument()
    expect(screen.getByText(/MISSING_REQUIREMENT/)).toBeInTheDocument()
    expect(screen.getByText(/Boss difficulty/)).toBeInTheDocument()
    expect(screen.getByText(/Weakness optimization/)).toBeInTheDocument()
    expect(screen.getByText(/Base difficulty/)).toBeInTheDocument()
    expect(screen.getByText(/Time penalty/)).toBeInTheDocument()
  })

  test('shows loading and error states for route analysis', async () => {
    const gameDetail: GameDetail = {
      code: 'MMX',
      title: 'Mega Man X',
      releaseOrder: 1,
      stages: [
        {
          slug: 'chill-penguin',
          name: 'Chill Penguin Stage',
          stageOrder: 1,
          imageAssetKey: 'mmx.stage.chill-penguin',
          boss: {
            slug: 'chill-penguin',
            name: 'Chill Penguin',
            imageAssetKey: 'mmx.boss.chill-penguin',
          },
          weaponReward: null,
          collectibles: [],
        },
      ],
    }

    mockFetchGameDetail.mockResolvedValue(gameDetail)

    let resolveRequest: (value: unknown) => void = () => {
      throw new Error('Resolve handler not initialized')
    }
    mockAnalyzeRoute.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve
      }),
    )

    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/games/MMX']}>
        <Routes>
          <Route path="/games/:gameCode" element={<GameDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await screen.findByRole('button', { name: /analyze route/i })
    await user.click(screen.getByRole('button', { name: /analyze route/i }))

    expect(screen.getByRole('button', { name: /analyzing route/i })).toBeDisabled()

    resolveRequest({
      gameCode: 'MMX',
      difficultyScore: 80,
      difficultyLabel: 'HARD',
      backtrackingScore: 50,
      estimatedMinutes: 95,
      warnings: [],
      recommendations: [],
      breakdown: {
        bossDifficulty: 50,
        weaknessOptimization: 20,
        baseDifficulty: -10,
        timePenalty: -10,
      },
    })

    await screen.findByText(/difficulty: 80 \/ 100/i)

    mockAnalyzeRoute.mockRejectedValueOnce(new Error('Analyzer unavailable'))
    await user.click(screen.getByRole('button', { name: /analyze route/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Analyzer unavailable')
  })
})
