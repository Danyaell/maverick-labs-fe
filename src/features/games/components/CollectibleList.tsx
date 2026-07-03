import styles from "./CollectibleList.module.css";
import { CollectibleBadge } from "./CollectibleBadge";
import type { Collectible } from "../types/game.types";

interface CollectibleListProps {
  collectibles: Collectible[];
}

export function CollectibleList({ collectibles }: CollectibleListProps) {
  const sortedCollectibles = [...collectibles].sort(
    (first, second) => first.sortOrder - second.sortOrder,
  );

  return (
    <div className={styles.collectibleListContainer}>
      <h3>Items</h3>
      <ul className={styles.collectibleList}>
        {sortedCollectibles.map((collectible) => (
          <CollectibleBadge
            className={
              collectible.type == "ARMOR_UPGRADE"
                ? styles.largeCollectible
                : styles.smallCollectible
            }
            key={collectible.slug}
            collectible={collectible}
          />
        ))}
      </ul>
    </div>
  );
}
