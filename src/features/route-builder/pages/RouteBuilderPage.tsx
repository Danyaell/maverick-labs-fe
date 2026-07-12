import styles from "./RouteBuilderPage.module.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { NotFoundPage } from "../../../app/pages/NotFoundPage";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { fetchGameDetail } from "../../games/api/gameApi";
import type { GameDetail } from "../../games/types/game.types";
import { RouteBuilder } from "../components/RouteBuilder";

export function RouteBuilderPage() {
  const { gameCode } = useParams<{ gameCode: string }>();
  const [gameDetail, setGameDetail] = useState<GameDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!gameCode) {
      return;
    }

    const controller = new AbortController();
    const loadGameDetail = async () => {
      setIsLoading(true);

      try {
        const game = await fetchGameDetail(gameCode, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        setGameDetail(game);
        setError(null);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load game data.",
        );
        setGameDetail(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadGameDetail();

    return () => controller.abort();
  }, [gameCode]);

  if (!gameCode) {
    return <NotFoundPage />;
  }

  if (isLoading) {
    return <LoadingState message="Loading route builder..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!gameDetail) {
    return <NotFoundPage />;
  }

  return (
    <section className={styles.pageContainer}>
      <div className={styles.header}>
        <Link className={styles.backLink} to={`/games/${gameCode}`}>
          Return to game detail
        </Link>

        <h2>{gameDetail.title} Route Builder</h2>
      </div>

      <RouteBuilder key={gameDetail.code} game={gameDetail} />
    </section>
  );
}
