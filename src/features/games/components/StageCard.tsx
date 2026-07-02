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
    <button type="button" onClick={() => onSelect(stage)} aria-pressed={isSelected}>
      <h3>{stage.name}</h3>
      <img src={stageImageUrl || undefined} alt={stage.name} />
    </button>
  )
}
