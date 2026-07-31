import type { RouteBreakdown as RouteBreakdownType } from '../types/routeAnalysis.types'
import styles from './RouteBreakdown.module.css'

interface RouteBreakdownProps {
  breakdown: RouteBreakdownType
}

function formatSignedValue(value: number): string {
  if (value > 0) {
    return `+${value}`
  }

  return `${value}`
}

export function RouteBreakdown({ breakdown }: RouteBreakdownProps) {
  return (
    <dl className={styles.grid}>
      <dt>Base Difficulty</dt>
      <dd>{formatSignedValue(breakdown.baseDifficultyAverage)}</dd>

      <dt>Combat Difficulty</dt>
      <dd>{formatSignedValue(breakdown.combatDifficulty)}</dd>

      <dt>Weakness Reduction</dt>
      <dd>{formatSignedValue(breakdown.weaknessReduction)}</dd>

      <dt>Time Penalty</dt>
      <dd>{formatSignedValue(breakdown.timePenaltyMinutes)}</dd>

      <dt>Route Efficiency</dt>
      <dd>{formatSignedValue(breakdown.routeEfficiencyScore)}</dd>
    </dl>
  )
}
