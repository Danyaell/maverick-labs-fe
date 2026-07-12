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
      <dt>Boss difficulty</dt>
      <dd>{formatSignedValue(breakdown.bossDifficulty)}</dd>

      <dt>Weakness optimization</dt>
      <dd>{formatSignedValue(breakdown.weaknessOptimization)}</dd>

      <dt>Base difficulty</dt>
      <dd>{formatSignedValue(breakdown.baseDifficulty)}</dd>

      <dt>Time penalty</dt>
      <dd>{formatSignedValue(breakdown.timePenalty)}</dd>
    </dl>
  )
}
