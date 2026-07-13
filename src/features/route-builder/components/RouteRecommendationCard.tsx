import type { RouteRecommendation } from '../types/routeAnalysis.types'
import styles from './RouteRecommendationCard.module.css'

interface RouteRecommendationCardProps {
  recommendation: RouteRecommendation
}

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => `${word[0]?.toUpperCase() ?? ''}${word.slice(1)}`)
    .join(' ')
}

function getSeverityClassName(severity: RouteRecommendation['severity']): string {
  if (severity === 'WARNING') {
    return styles.severityWarning
  }
  if (severity === 'SUCCESS') {
    return styles.severitySuccess
  }
  return styles.severityInfo
}

export function RouteRecommendationCard({ recommendation }: RouteRecommendationCardProps) {
  const formattedType = formatLabel(recommendation.type)
  const relatedStages = recommendation.relatedStages?.filter((stage) => stage.trim().length > 0) ?? []

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <span className={`${styles.severityBadge} ${getSeverityClassName(recommendation.severity)}`}>
          {recommendation.severity}
        </span>
        <strong className={styles.type}>{formattedType}</strong>
      </header>

      <p className={styles.message}>{recommendation.message}</p>

      {relatedStages.length > 0 ? (
        <p className={styles.relatedStages}>Related stages: {relatedStages.join(', ')}</p>
      ) : null}
    </article>
  )
}
