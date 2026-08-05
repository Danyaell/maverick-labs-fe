import styles from "./RouteBuilderPage.module.css";
import { useParams } from "react-router";
import { NotFoundPage } from "../../../app/pages/NotFoundPage";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { useGameDetailQuery } from "../../games/hooks/gameQueries";
import { RouteBuilder } from "../components/RouteBuilder";

export function RouteBuilderPage() {
  const { gameCode } = useParams<{ gameCode: string }>();

  const {
    data: gameDetail,
    error,
    isPending,
    isError,
  } = useGameDetailQuery(gameCode);

  if (!gameCode) {
    return <NotFoundPage />;
  }

  if (isPending) {
    return <LoadingState message="Loading route builder..." />;
  }

  if (isError) {
    return <ErrorState message={error.message} />;
  }

  if (!gameDetail) {
    return <NotFoundPage />;
  }

  return (
    <section className={styles.pageContainer}>
      <div className={styles.header}>
        <h4>MEGA MAN X</h4>
        <h2>{gameDetail.title} Route Builder</h2>
        <p>Reorder the eight stages, then analyze the route.</p>
      </div>

      <div>
        <h3>Stage order</h3>
        <p className="helperText">
          Drag and drop the stages or use the arrow controls. This list is the
          current route.
        </p>
      </div>
      <RouteBuilder key={gameDetail.code} game={gameDetail} />
    </section>
  );
}
