import type { RouteWarning } from '../types/routeAnalysis.types'
import styles from './RouteWarningsList.module.css'

interface RouteWarningsListProps {
  warnings: RouteWarning[]
}

export function RouteWarningsList({ warnings }: RouteWarningsListProps) {
  if (warnings.length === 0) {
    return <p className={styles.noWarnings}>No route warnings.</p>
  }

  return (
    <ul className={styles.list}>
      {warnings.map((warning, index) => (
        <li key={`${warning.type}-${warning.stageSlug ?? 'global'}-${index}`} className={styles.item}>
          <strong>{warning.type == 'MISSING_REQUIREMENT' ? 'Missing Requirement' : warning.type}</strong>: {warning.message}
        </li>
      ))}
    </ul>
  )
}
