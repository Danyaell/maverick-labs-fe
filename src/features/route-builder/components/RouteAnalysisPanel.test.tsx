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
            baseDifficultyAverage: 40,
            weaknessReduction: 26,
            combatDifficulty: -8,
            timePenaltyMinutes: -6,
            routeEfficiencyScore: 0,
          },
        }}
      />,
    )

    expect(screen.getByText(/DIFFICULTY/)).toBeInTheDocument()
    expect(screen.getByText(/74 \/ 100/i)).toBeInTheDocument()
    expect(screen.getByText(/BACKTRACKING/)).toBeInTheDocument()
    expect(screen.getByText(/62 \/ 100/i)).toBeInTheDocument()
    expect(screen.getByText(/ESTIMATED TIME/)).toBeInTheDocument()
    expect(screen.getByText(/87 min/i)).toBeInTheDocument()
    expect(screen.getByText('Recommendations')).toBeInTheDocument()
    expect(screen.getAllByText('Move Spark Mandrill later for safer progression.')).toHaveLength(2)
    expect(screen.getByText('Warnings')).toBeInTheDocument()
    expect(screen.getByText('Breakdown')).toBeInTheDocument()
    expect(screen.getByText('Base Difficulty')).toBeInTheDocument()
    expect(screen.getByText('Combat Difficulty')).toBeInTheDocument()
    expect(screen.getByText('Weakness Reduction')).toBeInTheDocument()
    expect(screen.getByText('Time Penalty')).toBeInTheDocument()
    expect(screen.getByText('Route Efficiency')).toBeInTheDocument()
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
            {
              type: 'BOSS_ORDER',
              severity: 'INFO',
              message: 'Recommendation 7',
              relatedStages: null,
            },
            {
              type: 'BOSS_ORDER',
              severity: 'INFO',
              message: 'Recommendation 8',
              relatedStages: null,
            },
            {
              type: 'BOSS_ORDER',
              severity: 'INFO',
              message: 'Recommendation 9',
              relatedStages: null,
            },
          ],
          breakdown: {
            combatDifficulty: 35,
            weaknessReduction: 30,
            baseDifficultyAverage: -5,
            timePenaltyMinutes: -10,
            routeEfficiencyScore: 0,
          },
        }}
      />,
    )

    expect(screen.queryByText('You should avoid this heavy backtracking path.')).not.toBeInTheDocument()
    expect(screen.getAllByText('Recommendation 1')).toHaveLength(2)
    expect(screen.getByText('Recommendation 5')).toBeInTheDocument()
    expect(screen.queryByText('Recommendation 9')).not.toBeInTheDocument()
  })
})
