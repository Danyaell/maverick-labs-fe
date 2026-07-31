import styles from "./GameCatalogPage.module.css";
import { useMemo } from "react";
import { GameCard } from "../components/GameCard";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { useGamesQuery } from "../hooks/gameQueries";

export function GameCatalogPage() {
  const { data: games, error, isLoading } = useGamesQuery();

  const sortedGames = useMemo(
    () =>
      (games ?? [])
        .slice()
        .sort((first, second) => first.releaseOrder - second.releaseOrder),
    [games],
  );

  if (isLoading) {
    return <LoadingState message="Loading games..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!games?.length) {
    return (
      <section>
        <h1>Game Catalog</h1>
        <p>No games are available right now. Please try again later.</p>
      </section>
    );
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
  );
}
