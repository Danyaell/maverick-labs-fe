import styles from './GameCatalogPage.module.css'
import { useEffect, useMemo, useState } from 'react'
import { GameCard } from '../components/GameCard'
import { fetchGames } from '../api/gameApi'
import { ErrorState } from '../../../shared/components/ErrorState'
import { LoadingState } from '../../../shared/components/LoadingState'
import type { GameSummary } from '../types/game.types'

export function GameCatalogPage() {
  const [games, setGames] = useState<GameSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setError(null)
    setIsLoading(true)

    fetchGames({ signal: controller.signal })
      .then((data) => setGames(data))
      .catch((fetchError) => {
        if (controller.signal.aborted) {
          return
        }

        setError(fetchError instanceof Error ? fetchError.message : 'Unable to load games.')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  const sortedGames = useMemo(
    () => (games ?? []).slice().sort((first, second) => first.releaseOrder - second.releaseOrder),
    [games],
  )

  if (isLoading) {
    return <LoadingState message="Loading games..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (!games?.length) {
    return (
      <section>
        <h1>Game Catalog</h1>
        <p>No games are available right now. Please try again later.</p>
      </section>
    )
  }

  return (
    <section>
      <h1>Game Catalog</h1>
      <ul className={styles.gameList}>
        {sortedGames.map((game) => (
          <li className={styles.gameItem} key={game.code}>
            <GameCard game={game} />
          </li>
        ))}
      </ul>
    </section>
  )
}
