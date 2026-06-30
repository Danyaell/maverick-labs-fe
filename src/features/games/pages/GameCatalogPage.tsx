import { Link } from 'react-router'

const games = [
  {
    code: 'MMX',
    title: 'Mega Man X',
    releaseOrder: 1,
  },
  {
    code: 'MMX2',
    title: 'Mega Man X2',
    releaseOrder: 2,
  },
  {
    code: 'MMX3',
    title: 'Mega Man X3',
    releaseOrder: 3,
  },
  {
    code: 'MMX4',
    title: 'Mega Man X4',
    releaseOrder: 4,
  },
]

export function GameCatalogPage() {
  return (
    <section>
      <h1>Game Catalog</h1>

      <ul>
        {games.map((game) => (
          <li key={game.code}>
            <Link to={`/games/${game.code}`}>
              {game.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}