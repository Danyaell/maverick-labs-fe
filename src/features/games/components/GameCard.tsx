import { Link } from 'react-router'
import type { GameSummary } from '../types/game.types'

interface GameCardProps {
  game: GameSummary
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link to={`/games/${game.code}`}>
      <article>
        <h2>{game.title}</h2>
        <p>Release order: {game.releaseOrder}</p>
      </article>
    </Link>
  )
}
