import styles from './RouteAnalysisPanel.module.css'
import { RouteBreakdown } from './RouteBreakdown'
import { RouteWarningsList } from './RouteWarningsList'
import type { RouteAnalysisResponse } from '../types/routeAnalysis.types'

interface RouteAnalysisPanelProps {
  analysis: RouteAnalysisResponse
}

function formatDifficultyLabel(label: string): string {
  return label
    .toLowerCase()
    .split('_')
    .map((word) => `${word[0]?.toUpperCase() ?? ''}${word.slice(1)}`)
    .join(' ')
}

export function RouteAnalysisPanel({ analysis }: RouteAnalysisPanelProps) {
  return (
    <section className={styles.panel}>
      <h3>Route Analysis</h3>
      <p>Difficulty: {analysis.difficultyScore} / 100 — {formatDifficultyLabel(analysis.difficultyLabel)}</p>
      <p>Backtracking: {analysis.backtrackingScore} / 100</p>
      <p>Estimated time: {analysis.estimatedMinutes} min</p>

      <div className={styles.section}>
        <h4>Warnings</h4>
        <RouteWarningsList warnings={analysis.warnings} />
      </div>

      <div className={styles.section}>
        <h4>Breakdown</h4>
        <RouteBreakdown breakdown={analysis.breakdown} />
      </div>
    </section>
  )
}
