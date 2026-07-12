import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { RouteAnalysisPanel } from './RouteAnalysisPanel'

describe('RouteAnalysisPanel', () => {
  test('renders recommendations section and preserves summary/breakdown data', () => {
    render(
      <RouteAnalysisPanel
        analysis={{
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
              message: 'Move Spark Mandrill later for safer progression.',
              relatedStages: ['spark-mandrill'],
            },
          ],
          breakdown: {
            bossDifficulty: 40,
            weaknessOptimization: 26,
            baseDifficulty: -8,
            timePenalty: -6,
          },
        }}
      />,
    )

    expect(screen.getByText(/Difficulty: 74 \/ 100/i)).toBeInTheDocument()
    expect(screen.getByText(/Backtracking: 62 \/ 100/i)).toBeInTheDocument()
    expect(screen.getByText(/Estimated time: 87 min/i)).toBeInTheDocument()
    expect(screen.getByText('Recommendations')).toBeInTheDocument()
    expect(screen.getByText('Move Spark Mandrill later for safer progression.')).toBeInTheDocument()
    expect(screen.getByText('Warnings')).toBeInTheDocument()
    expect(screen.getByText('Breakdown')).toBeInTheDocument()
    expect(screen.getByText('Boss difficulty')).toBeInTheDocument()
    expect(screen.getByText('Weakness optimization')).toBeInTheDocument()
    expect(screen.getByText('Base difficulty')).toBeInTheDocument()
    expect(screen.getByText('Time penalty')).toBeInTheDocument()
  })

  test('deduplicates warning-equivalent recommendations and limits rendered recommendations to 5', () => {
    render(
      <RouteAnalysisPanel
        analysis={{
          gameCode: 'MMX',
          difficultyScore: 70,
          difficultyLabel: 'MEDIUM',
          backtrackingScore: 55,
          estimatedMinutes: 90,
          warnings: [
            {
              type: 'BACKTRACKING',
              message: 'You should avoid this heavy backtracking path.',
              stageSlug: null,
            },
          ],
          recommendations: [
            {
              type: 'BACKTRACKING',
              severity: 'WARNING',
              message: 'You should avoid this heavy backtracking path.',
              relatedStages: null,
            },
            {
              type: 'BOSS_ORDER',
              severity: 'INFO',
              message: 'Recommendation 1',
              relatedStages: null,
            },
            {
              type: 'BOSS_ORDER',
              severity: 'INFO',
              message: 'Recommendation 2',
              relatedStages: null,
            },
            {
              type: 'BOSS_ORDER',
              severity: 'INFO',
              message: 'Recommendation 3',
              relatedStages: null,
            },
            {
              type: 'BOSS_ORDER',
              severity: 'INFO',
              message: 'Recommendation 4',
              relatedStages: null,
            },
            {
              type: 'BOSS_ORDER',
              severity: 'INFO',
              message: 'Recommendation 5',
              relatedStages: null,
            },
            {
              type: 'BOSS_ORDER',
              severity: 'INFO',
              message: 'Recommendation 6',
              relatedStages: null,
            },
          ],
          breakdown: {
            bossDifficulty: 35,
            weaknessOptimization: 30,
            baseDifficulty: -5,
            timePenalty: -10,
          },
        }}
      />,
    )

    expect(screen.queryByText('You should avoid this heavy backtracking path.')).not.toBeInTheDocument()
    expect(screen.getByText('Recommendation 1')).toBeInTheDocument()
    expect(screen.getByText('Recommendation 5')).toBeInTheDocument()
    expect(screen.queryByText('Recommendation 6')).not.toBeInTheDocument()
  })
})
