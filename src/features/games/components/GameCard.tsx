import styles from './GameCard.module.css'
import { Link } from 'react-router'
import type { GameSummary } from '../types/game.types'
import { getGameAssetUrl } from '../../../utils/assets'

interface GameCardProps {
  game: GameSummary
}

export function GameCard({ game }: GameCardProps) {
  const stageImageUrl = getGameAssetUrl(`${game.code.toLowerCase()}.title.logo`)

  return (
    <Link to={`/games/${game.code}`}>
      <article className={styles.gameCard}>
        <img className={styles.gameImage} src={stageImageUrl || undefined} alt={game.title} />
      </article>
    </Link>
  )
}
