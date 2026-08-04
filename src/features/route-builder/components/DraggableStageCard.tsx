import styles from "./DraggableStageCard.module.css";
import { getGameAssetUrl } from "../../../utils/assets";
import type { Stage } from "../../games/types/game.types";

interface DraggableStageCardProps {
  stage: Stage;
  index: number;
  isDragging: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
}

export function DraggableStageCard({
  stage,
  index,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: DraggableStageCardProps) {
  const stageImageUrl = getGameAssetUrl(stage.imageAssetKey);

  return (
    <article
      className={isDragging ? styles.draggingCard : styles.card}
      data-testid={`stage-card-${stage.slug}`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        onDragStart(index);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        onDragOver(index);
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(index);
      }}
      onDragEnd={onDragEnd}
      aria-label={`${stage.name} draggable card`}
    >
      <p className="helperText">0{index}</p>

      <img
        className={styles.stageImage}
        src={stageImageUrl || undefined}
        alt={stage.name}
      />

      <div className={styles.content}>
        <div className={styles.detailRow}>
          <p>
            Boss: <strong>{stage.boss.name}</strong>
          </p>
        </div>
        <div className={styles.detailRow}>
          <p>
            Weapon: <strong>{stage.weaponReward?.name ?? "None"}</strong>
          </p>
        </div>
      </div>

      {/* <div>
        <button className="button--secondary">Up</button>
        <button className="button--secondary">Down</button>
      </div> */}
    </article>
  );
}
