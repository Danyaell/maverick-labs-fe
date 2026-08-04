import styles from "./BossSummary.module.css";
import { getGameAssetUrl } from "../../../utils/assets";
import type { Boss } from "../types/game.types";
import { useState } from "react";

interface BossSummaryProps {
  boss: Boss;
}

export function BossSummary({ boss }: BossSummaryProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const bossImageUrl = getGameAssetUrl(boss.imageAssetKey ?? "");

  return (
    <section className={styles.bossSummaryContainer}>
      <img
        className={styles.bossImage}
        src={bossImageUrl || undefined}
        width={size.width || undefined}
        height={size.height || undefined}
        alt={boss.name}
        onLoad={(event) => {
        const image = event.currentTarget;

        setSize({
          width: image.naturalWidth * 3,
          height: image.naturalHeight * 3,
        });
        }}
      />
      <div>
        <p className="helperText">MAVERICK</p>
        <h2>{boss.name}</h2>
      </div>
    </section>
  );
}
