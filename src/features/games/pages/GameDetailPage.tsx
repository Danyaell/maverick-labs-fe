import styles from "./GameDetailPage.module.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { fetchGameDetail } from "../api/gameApi";
import { BossSummary } from "../components/BossSummary";
import { CollectibleList } from "../components/CollectibleList";
import { StageCard } from "../components/StageCard";
import { WeaponReward } from "../components/WeaponReward";
import type { GameDetail, Stage } from "../types/game.types";
import { LoadingState } from "../../../shared/components/LoadingState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { getGameAssetUrl } from "../../../utils/assets";
import { analyzeRoute } from "../../route-builder/api/routeAnalysisApi";
import { RouteAnalysisPanel } from "../../route-builder/components/RouteAnalysisPanel";
import type { RouteAnalysisResponse } from "../../route-builder/types/routeAnalysis.types";

export function GameDetailPage() {
  const { gameCode } = useParams<{ gameCode: string }>();
  const [gameDetail, setGameDetail] = useState<GameDetail | null>(null);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [routeAnalysis, setRouteAnalysis] = useState<RouteAnalysisResponse | null>(
    null,
  );
  const [routeAnalysisError, setRouteAnalysisError] = useState<string | null>(null);
  const [isAnalyzingRoute, setIsAnalyzingRoute] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setError(null);
    setIsLoading(true);
    setRouteAnalysis(null);
    setRouteAnalysisError(null);

    fetchGameDetail(gameCode ?? "", { signal: controller.signal })
      .then((data) => {
        setGameDetail(data);
        setSelectedStage(data.stages[0] ?? null);
      })
      .catch((fetchError) => {
        if (controller.signal.aborted) {
          return;
        }
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load game data.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });
    return () => controller.abort();
  }, [gameCode]);

  const stageImageUrl = getGameAssetUrl(
    `${gameCode?.toLowerCase()}.title.logo`,
  );

  const sortedStages = useMemo(
    () =>
      (gameDetail?.stages ?? [])
        .slice()
        .sort((first, second) => first.stageOrder - second.stageOrder),
    [gameDetail],
  );

  async function handleAnalyzeRoute() {
    if (!gameDetail) {
      return;
    }

    setRouteAnalysisError(null);
    setIsAnalyzingRoute(true);

    try {
      const analysis = await analyzeRoute({
        gameCode: gameDetail.code,
        stageOrder: sortedStages.map((stage) => stage.slug),
        goal: "HUNDRED_PERCENT",
      });

      setRouteAnalysis(analysis);
    } catch (analysisError) {
      setRouteAnalysis(null);
      setRouteAnalysisError(
        analysisError instanceof Error
          ? analysisError.message
          : "Unable to analyze route.",
      );
    } finally {
      setIsAnalyzingRoute(false);
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading games..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <section>
      <div className={styles.pageActions}>
        <Link className={styles.backLink} to="/games">
          Return
        </Link>

        <Link className={styles.buildRouteLink} to={`/games/${gameCode}/route-builder`}>
          Build Route
        </Link>
      </div>

      <img
        className={styles.gameImage}
        src={stageImageUrl || undefined}
        alt={gameDetail?.title}
      />

      <div>
        <h3>Stages</h3>
        <button
          type="button"
          className={styles.analyzeButton}
          onClick={handleAnalyzeRoute}
          disabled={isAnalyzingRoute || sortedStages.length === 0}
        >
          {isAnalyzingRoute ? "Analyzing route..." : "Analyze Route"}
        </button>
        {routeAnalysisError ? (
          <p role="alert" className={styles.analysisError}>
            {routeAnalysisError}
          </p>
        ) : null}

        <ul className={styles.stageList}>
          {sortedStages.map((stage) => (
            <li key={stage.slug} className={styles.stageItem}>
              <StageCard
                stage={stage}
                isSelected={selectedStage?.slug === stage.slug}
                onSelect={setSelectedStage}
              />
            </li>
          ))}
        </ul>
      </div>

      {selectedStage ? (
        <div className={styles.detailContainer}>
          <h3>{selectedStage.name}</h3>
          <div className={styles.detailContent}>
            <div className={styles.detailItem}>
              <BossSummary boss={selectedStage.boss} />
            </div>
            <div className={styles.detailItem}>
              <WeaponReward weaponReward={selectedStage.weaponReward} />
            </div>
            <div className={styles.detailItem}>
              <CollectibleList collectibles={selectedStage.collectibles} />
            </div>
          </div>
        </div>
      ) : null}

      {routeAnalysis ? <RouteAnalysisPanel analysis={routeAnalysis} /> : null}
    </section>
  );
}
