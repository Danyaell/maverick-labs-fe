import styles from './CollectibleBadge.module.css'
import { getGameAssetUrl } from '../../../utils/assets'
import type { Collectible } from '../types/game.types'

interface CollectibleBadgeProps {
  collectible: Collectible,
  className?: string
}

export function CollectibleBadge({ collectible, className }: CollectibleBadgeProps) {
  const collectibleImageUrl = getGameAssetUrl(collectible.imageAssetKey ?? '')

  return (
    <li className={className ? `${className} ${styles.collectibleBadge}` : styles.collectibleBadge}>
      <img className={styles.collectibleImage} src={collectibleImageUrl || undefined} alt={collectible.name} />
      <h4>{collectible.name}</h4>
    </li>
  )
}
