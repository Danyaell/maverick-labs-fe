import styles from "./LiveRouteAnalysis.module.css";
import { useRouteAnalysisQuery } from "../hooks/routeAnalysisQueries";
import { RouteAnalysisPanel } from "./RouteAnalysisPanel";

interface LiveRouteAnalysisProps {
  gameCode: string;
  stageOrder: string[];
}

export function LiveRouteAnalysis({
  gameCode,
  stageOrder,
}: LiveRouteAnalysisProps) {
  const {
    data: analysis,
    error,
    isPending,
    isError,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useRouteAnalysisQuery(gameCode, stageOrder);

  const isUpdating = !isPending && (isFetching || isPlaceholderData);

  let statusMessage = "Live analysis is up to date.";

  if (isPending) {
    statusMessage = "Analyzing current route...";
  } else if (isUpdating) {
    statusMessage = "Updating analysis...";
  } else if (isError) {
    statusMessage = "Route analysis is unavailable.";
  }

  return (
    <div
      id="route-analysis"
      className={styles.container}
      aria-busy={isPending || isUpdating}
    >
      <div className={styles.panelHeader}>
        <div className={styles.statusBar}>
          <span
            className={
              isError
                ? styles.errorIndicator
                : isUpdating
                  ? styles.updatingIndicator
                  : styles.liveIndicator
            }
            aria-hidden="true"
          />

          <p className={styles.statusMessage} role="status" aria-live="polite">
            {statusMessage}
          </p>
        </div>
      </div>

      {isPending ? <RouteAnalysisSkeleton /> : null}

      {isError ? (
        <div className={styles.statePanel} role="alert">
          <p className="helperText">LIVE ROUTE ANALYSIS</p>

          <h2>Unable to analyze route</h2>

          <p className={`${styles.errorMessage} helperText`}>
            {error instanceof Error
              ? error.message
              : "The route analyzer is currently unavailable."}
          </p>

          <button
            type="button"
            className="button--primary"
            onClick={() => void refetch()}
          >
            Retry analysis
          </button>
        </div>
      ) : null}

      {!isPending && !isError && analysis ? (
        <div className={isUpdating ? styles.updatingContent : undefined}>
          <RouteAnalysisPanel analysis={analysis} />
        </div>
      ) : null}
    </div>
  );
}

function RouteAnalysisSkeleton() {
  return (
    <div className={styles.statePanel} aria-label="Loading route analysis">
      <p className="helperText">LIVE ROUTE ANALYSIS</p>

      <div className={styles.skeletonTitle} />

      <div className={styles.skeletonCards}>
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
      </div>

      <div className={styles.skeletonMessage} />
    </div>
  );
}
