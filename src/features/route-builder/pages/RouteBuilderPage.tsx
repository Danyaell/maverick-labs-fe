import styles from "./RouteBuilderPage.module.css";
import { Link, useParams } from "react-router";
import { NotFoundPage } from "../../../app/pages/NotFoundPage";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { useGameDetailQuery } from "../../games/hooks/gameQueries";
import { RouteBuilder } from "../components/RouteBuilder";

export function RouteBuilderPage() {
  const { gameCode } = useParams<{ gameCode: string }>();

  const { data: gameDetail, error, isLoading } = useGameDetailQuery(gameCode);

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
