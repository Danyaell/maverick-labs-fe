import { getGameAssetUrl } from '../../../utils/assets'
import type { Collectible } from '../types/game.types'

interface CollectibleBadgeProps {
  collectible: Collectible
}

export function CollectibleBadge({ collectible }: CollectibleBadgeProps) {
  const collectibleImageUrl = getGameAssetUrl(collectible.imageAssetKey ?? '')

  return (
    <li>
      <img src={collectibleImageUrl || undefined} alt={collectible.name} />
      <h4>{collectible.name}</h4>
      <p>{collectible.description}</p>
    </li>
  )
}
