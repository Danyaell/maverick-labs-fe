import { Link, useParams } from 'react-router'

export function GameDetailPage() {
  const { gameCode } = useParams<{ gameCode: string }>()

  return (
    <section>
      <Link to="/games">Back to catalog</Link>

      <h1>Game Detail</h1>
      <p>Game: {gameCode}</p>
    </section>
  )
}