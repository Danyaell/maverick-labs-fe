import styles from './RouteBuilder.module.css'
import type { GameDetail } from '../../games/types/game.types'
import { useRouteBuilder } from '../hooks/useRouteBuilder'
import { DraggableStageCard } from './DraggableStageCard'
import { RouteBuilderActions } from './RouteBuilderActions'
import { RouteOrderPreview } from './RouteOrderPreview'

interface RouteBuilderProps {
  game: GameDetail
}

export function RouteBuilder({ game }: RouteBuilderProps) {
  const { orderedStages, draggingIndex, onDragStart, onDragOver, onDrop, onDragEnd, onReset } =
    useRouteBuilder(game)

  return (
    <section className={styles.builderContainer}>
      <RouteBuilderActions onReset={onReset} />

      <div className={styles.layout}>
        <ul className={styles.stageList}>
          {orderedStages.map((stage, index) => (
            <li key={stage.slug} className={styles.stageItem}>
              <DraggableStageCard
                stage={stage}
                index={index}
                isDragging={draggingIndex === index}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
              />
            </li>
          ))}
        </ul>

        <RouteOrderPreview orderedStages={orderedStages} />
      </div>
    </section>
  )
}
