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

export function GameDetailPage() {
  const { gameCode } = useParams<{ gameCode: string }>();
  const [gameDetail, setGameDetail] = useState<GameDetail | null>(null);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setError(null);
    setIsLoading(true);

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
    </section>
  );
}
