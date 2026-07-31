import styles from "./GameDetailPage.module.css";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { BossSummary } from "../components/BossSummary";
import { CollectibleList } from "../components/CollectibleList";
import { StageCard } from "../components/StageCard";
import { WeaponReward } from "../components/WeaponReward";
import { LoadingState } from "../../../shared/components/LoadingState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { NotFoundPage } from "../../../app/pages/NotFoundPage";
import { getGameAssetUrl } from "../../../utils/assets";
import { useGameDetailQuery } from "../hooks/gameQueries";

export function GameDetailPage() {
  const { gameCode } = useParams<{ gameCode: string }>();
  const [selectedStageSlug, setSelectedStageSlug] = useState<string | null>(
    null,
  );

  const { data: gameDetail, error, isLoading } = useGameDetailQuery(gameCode);

  const sortedStages = useMemo(
    () =>
      (gameDetail?.stages ?? [])
        .slice()
        .sort((first, second) => first.stageOrder - second.stageOrder),
    [gameDetail],
  );

  const selectedStage = useMemo(
    () =>
      sortedStages.find((stage) => stage.slug === selectedStageSlug) ??
      sortedStages[0] ??
      null,
    [selectedStageSlug, sortedStages],
  );

  if (!gameCode) {
    return <NotFoundPage />;
  }

  if (isLoading) {
    return <LoadingState message="Loading game..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!gameDetail) {
    return <NotFoundPage />;
  }

  const gameImageUrl = getGameAssetUrl(`${gameCode.toLowerCase()}.title.logo`);

  return (
    <section>
      <div className={styles.pageActions}>
        <Link className={styles.backLink} to="/games">
          Return
        </Link>

        <Link
          className={styles.buildRouteLink}
          to={`/games/${gameCode}/route-builder`}
        >
          Build Route
        </Link>
      </div>

      <img
        className={styles.gameImage}
        src={gameImageUrl || undefined}
        alt={gameDetail.title}
      />

      <div>
        <h3>Stages</h3>

        <ul className={styles.stageList}>
          {sortedStages.map((stage) => (
            <li key={stage.slug} className={styles.stageItem}>
              <StageCard
                stage={stage}
                isSelected={selectedStage?.slug === stage.slug}
                onSelect={(selected) => setSelectedStageSlug(selected.slug)}
              />
            </li>
          ))}
        </ul>
      </div>

      {selectedStage && (
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
      )}
    </section>
  );
}
