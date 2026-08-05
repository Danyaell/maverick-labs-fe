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
    <Link to={game.code == 'MMX' ? `/games/${game.code}` : '#'} style={{ cursor: game.code !== 'MMX' ? 'not-allowed' : 'pointer' }}>
      <article className={`${styles.gameCard} ${game.code !== 'MMX' ? styles.disabledGameCard : ''}`}>
        {/* Temporally disable other games */}
        {game.code !== 'MMX' && <h4 className={styles.gameCardText}>Coming soon...</h4>}
        <img className={styles.gameImage} src={stageImageUrl || undefined} alt={game.title} />
      </article>
    </Link>
  )
}
