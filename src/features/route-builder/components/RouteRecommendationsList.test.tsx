import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { RouteRecommendationsList } from './RouteRecommendationsList'

describe('RouteRecommendationsList', () => {
  test('renders multiple recommendations', () => {
    render(
      <RouteRecommendationsList
        recommendations={[
          {
            type: 'BOSS_ORDER',
            severity: 'INFO',
            message: 'Order is stable.',
            relatedStages: ['chill-penguin'],
          },
          {
            type: 'ROUTE_EFFICIENCY',
            severity: 'SUCCESS',
            message: 'Route is time efficient.',
            relatedStages: ['chill-penguin', 'storm-eagle'],
          },
        ]}
      />,
    )

    expect(screen.getByText('Order is stable.')).toBeInTheDocument()
    expect(screen.getByText('Route is time efficient.')).toBeInTheDocument()
  })

  test('renders empty state when recommendations are not present', () => {
    render(<RouteRecommendationsList recommendations={[]} />)

    expect(screen.getByText('No major recommendations for this route.')).toBeInTheDocument()
  })
})
