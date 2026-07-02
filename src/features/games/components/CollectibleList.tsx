import { CollectibleBadge } from './CollectibleBadge'
import type { Collectible } from '../types/game.types'

interface CollectibleListProps {
  collectibles: Collectible[]
}

export function CollectibleList({ collectibles }: CollectibleListProps) {
  const sortedCollectibles = [...collectibles].sort((first, second) => first.sortOrder - second.sortOrder)

  return (
    <ul>
      {sortedCollectibles.map((collectible) => (
        <CollectibleBadge key={collectible.slug} collectible={collectible} />
      ))}
    </ul>
  )
}
