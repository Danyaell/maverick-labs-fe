import styles from "./SortableStageCard.module.css";
import { getGameAssetUrl } from "../../../utils/assets";
import type { Stage } from "../../games/types/game.types";
import { useSortable } from "@dnd-kit/react/sortable";

interface SortableStageCardProps {
  stage: Stage;
  index: number;
  totalStages: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function SortableStageCard({
  stage,
  index,
  totalStages,
  onMoveUp,
  onMoveDown,
}: SortableStageCardProps) {
  const stageImageUrl = getGameAssetUrl(stage.imageAssetKey);
  const {
    ref,
    handleRef,
    isDragging,
    isDropping,
    isDropTarget,
  } = useSortable({
    id: stage.slug,
    index,
  });

  const cardClassName = [
    styles.card,
    isDragging ? styles.dragging : "",
    isDropping ? styles.dropping : "",
    isDropTarget ? styles.dropTarget : "",
  ]
    .filter(Boolean)
    .join(" ");

  const position = index + 1;

  return (
    <li
      ref={ref}
      data-stage-slug={stage.slug}
    >
      <article
        className={cardClassName}
        data-testid={`stage-card-${stage.slug}`}
      >
        <button
          ref={handleRef}
          type="button"
          className={styles.dragHandle}
          aria-label={`Reorder ${stage.name}, position ${position} of ${totalStages}`}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="8" cy="6" r="1.5" fill="currentColor" />
            <circle cx="16" cy="6" r="1.5" fill="currentColor" />
            <circle cx="8" cy="12" r="1.5" fill="currentColor" />
            <circle cx="16" cy="12" r="1.5" fill="currentColor" />
            <circle cx="8" cy="18" r="1.5" fill="currentColor" />
            <circle cx="16" cy="18" r="1.5" fill="currentColor" />
          </svg>
        </button>

        <p className={styles.position} aria-hidden="true">
          {String(position).padStart(2, "0")}
        </p>

        <img
          className={styles.stageImage}
          src={stageImageUrl || undefined}
          alt={`${stage.name} preview`}
        />

        <div className={styles.content}>
          <h3 className={styles.bossName}>{stage.boss.name}</h3>
          <p className="helperText">
            {stage.weaponReward?.name ?? ""}
          </p>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.moveButton}
            aria-label={`Move ${stage.name} up`}
            disabled={index === 0}
            onClick={onMoveUp}
          >
            ↑
          </button>

          <button
            type="button"
            className={styles.moveButton}
            aria-label={`Move ${stage.name} down`}
            disabled={index === totalStages - 1}
            onClick={onMoveDown}
          >
            ↓
          </button>
        </div>
      </article>
    </li>
  );
}
