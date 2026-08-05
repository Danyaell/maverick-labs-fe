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

  const {
    data: gameDetail,
    error,
    isPending,
    isError,
  } = useGameDetailQuery(gameCode);

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

  if (isPending) {
    return <LoadingState message="Loading route builder..." />;
  }

  if (isError) {
    return <ErrorState message={error.message} />;
  }

  if (!gameDetail) {
    return <NotFoundPage />;
  }

  const gameImageUrl = getGameAssetUrl(`${gameCode.toLowerCase()}.title.logo`);

  return (
    <section className={styles.gameDetailBody}>
      <div className={styles.pageActions}>
        <div>
          <img
            className={styles.gameImage}
            src={gameImageUrl || undefined}
            alt={gameDetail.title}
          />
          <p className="helperText">
            Compare stages and prepare the order you want to analyze.
          </p>

          <h2 className="title">Select a stage</h2>
          <p className="helperText">
            The selected stage updates the details below.
          </p>
        </div>
        <Link
          className="button--primary"
          to={`/games/${gameCode}/route-builder`}
        >
          Build Route
        </Link>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.stageSelect}>
          <img
            className={styles.stageSelectImage}
            src={"/src/assets/games/mmx/stage/stage-select.png"}
          />

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
            {/* <li className={styles.stageCenter} aria-hidden="true">
              Select a stage to view details
            </li> */}
          </ul>
        </div>

        <div className={styles.detailContainer}>
          <p className="helperText">STAGE CONTENT</p>
          {selectedStage && (
            <>
              <div className={styles.detailContent}>
                <h2 className={styles.detailTitle}>{selectedStage.name}</h2>
                <div className={styles.detailItem}>
                  <BossSummary boss={selectedStage.boss} />
                </div>

                <div className={styles.detailItem}>
                  <WeaponReward weaponReward={selectedStage.weaponReward} />
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.collectibleListContainer}>
          <p className="helperText">EXTRA INFORMATION</p>
          <CollectibleList collectibles={selectedStage.collectibles} />
        </div>
      </div>
    </section>
  );
}
