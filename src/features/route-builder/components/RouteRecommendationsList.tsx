import type { RouteRecommendation } from '../types/routeAnalysis.types'
import { RouteRecommendationCard } from './RouteRecommendationCard'
import styles from './RouteRecommendationsList.module.css'

interface RouteRecommendationsListProps {
  recommendations: RouteRecommendation[]
}

export function RouteRecommendationsList({ recommendations }: RouteRecommendationsListProps) {
  if (recommendations.length === 0) {
    return <p className={styles.emptyState}>No major recommendations for this route.</p>
  }

  return (
    <ul className={styles.list}>
      {recommendations.map((recommendation, index) => (
        <li key={`${recommendation.type}-${recommendation.severity}-${recommendation.message}-${index}`}>
          <RouteRecommendationCard recommendation={recommendation} />
        </li>
      ))}
    </ul>
  )
}
