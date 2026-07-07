import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { RouteBuilderPage } from './RouteBuilderPage'
import type { GameDetail } from '../../games/types/game.types'

const { mockFetchGameDetail } = vi.hoisted(() => ({
  mockFetchGameDetail: vi.fn(),
}))

vi.mock('../../games/api/gameApi', () => ({
  fetchGameDetail: mockFetchGameDetail,
}))

function createGameDetail(): GameDetail {
  return {
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
        collectibles: [],
      },
    ],
  }
}

describe('RouteBuilderPage', () => {
  beforeEach(() => {
    mockFetchGameDetail.mockReset()
  })

  test('should render loading state while fetching game detail', () => {
    mockFetchGameDetail.mockReturnValue(new Promise<never>(() => undefined))

    render(
      <MemoryRouter initialEntries={['/games/MMX/route-builder']}>
        <Routes>
          <Route path="/games/:gameCode/route-builder" element={<RouteBuilderPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Loading route builder...')).toBeInTheDocument()
  })

  test('should render error state when API fails', async () => {
    mockFetchGameDetail.mockRejectedValue(new Error('Request failed'))

    render(
      <MemoryRouter initialEntries={['/games/MMX/route-builder']}>
        <Routes>
          <Route path="/games/:gameCode/route-builder" element={<RouteBuilderPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Request failed')).toBeInTheDocument()
  })

  test('should render route builder when game detail loads', async () => {
    mockFetchGameDetail.mockResolvedValue(createGameDetail())

    render(
      <MemoryRouter initialEntries={['/games/MMX/route-builder']}>
        <Routes>
          <Route path="/games/:gameCode/route-builder" element={<RouteBuilderPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Mega Man X Route Builder')).toBeInTheDocument()
    expect(screen.getByText('Current Route')).toBeInTheDocument()
  })
})
