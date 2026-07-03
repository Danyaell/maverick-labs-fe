import styles from './StageCard.module.css'
import { getGameAssetUrl } from '../../../utils/assets'
import type { Stage } from '../types/game.types'

interface StageCardProps {
  stage: Stage
  isSelected?: boolean
  onSelect: (stage: Stage) => void
}

export function StageCard({ stage, isSelected = false, onSelect }: StageCardProps) {
  const stageImageUrl = getGameAssetUrl(stage.imageAssetKey)

  return (
    <button className={isSelected ? styles.selected : styles.card} type="button" onClick={() => onSelect(stage)} aria-pressed={isSelected}>
      <img className={styles.stageImage} src={stageImageUrl || undefined} alt={stage.name} />
    </button>
  )
}
