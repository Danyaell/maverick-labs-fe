import { getGameAssetUrl } from '../../../utils/assets'
import type { Stage } from '../types/game.types'

interface StageCardProps {
  stage: Stage,
}

export function StageCard({ stage }: StageCardProps) {
  const imageUrl = getGameAssetUrl(stage.imageAssetKey)

  return (
    <>
      <button onClick={() => {console.log('Stage clicked:', stage.name)}}>
        <h2>{stage.name}</h2>
        <img src={imageUrl} alt={stage.name} />
      </button>
    </>
  )
}
