import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { RouteRecommendationCard } from './RouteRecommendationCard'

describe('RouteRecommendationCard', () => {
  test('renders INFO recommendation details', () => {
    render(
      <RouteRecommendationCard
        recommendation={{
          type: 'BOSS_ORDER',
          severity: 'INFO',
          message: 'Your current boss order is efficient.',
          relatedStages: ['chill-penguin', 'storm-eagle'],
        }}
      />,
    )

    expect(screen.getByText('INFO')).toBeInTheDocument()
    expect(screen.getByText('Boss Order')).toBeInTheDocument()
    expect(screen.getByText('Your current boss order is efficient.')).toBeInTheDocument()
    expect(screen.getByText('Related stages: chill-penguin, storm-eagle')).toBeInTheDocument()
  })

  test('renders WARNING recommendation details', () => {
    render(
      <RouteRecommendationCard
        recommendation={{
          type: 'BACKTRACKING',
          severity: 'WARNING',
          message: 'This route causes repeated backtracking.',
          relatedStages: null,
        }}
      />,
    )

    expect(screen.getByText('WARNING')).toBeInTheDocument()
    expect(screen.getByText('Backtracking')).toBeInTheDocument()
    expect(screen.getByText('This route causes repeated backtracking.')).toBeInTheDocument()
    expect(screen.queryByText(/Related stages:/)).not.toBeInTheDocument()
  })
})
