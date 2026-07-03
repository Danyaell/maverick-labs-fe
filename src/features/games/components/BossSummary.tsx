import styles from './BossSummary.module.css'
import { getGameAssetUrl } from '../../../utils/assets'
import type { Boss } from '../types/game.types'

interface BossSummaryProps {
  boss: Boss
}

export function BossSummary({ boss }: BossSummaryProps) {
  const bossImageUrl = getGameAssetUrl(boss.imageAssetKey ?? '')

  return (
    <section className={styles.bossSummaryContainer}>
      <h3>Boss</h3>
      <img className={styles.bossImage} src={bossImageUrl || undefined} alt={boss.name} />
      <p>{boss.name}</p>
    </section>
  )
}
