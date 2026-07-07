import styles from './RouteOrderPreview.module.css'
import type { Stage } from '../../games/types/game.types'

interface RouteOrderPreviewProps {
  orderedStages: Stage[]
}

export function RouteOrderPreview({ orderedStages }: RouteOrderPreviewProps) {
  return (
    <section className={styles.previewContainer} aria-label="Current Route">
      <h3>Current Route</h3>
      <ol className={styles.routeList}>
        {orderedStages.map((stage) => (
          <li key={stage.slug}>{stage.boss.name}</li>
        ))}
      </ol>
    </section>
  )
}
