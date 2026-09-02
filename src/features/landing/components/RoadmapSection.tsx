import styles from "./RoadmapSection.module.css";
import { PRODUCT_COVERAGE, ROADMAP_PHASES } from "../data/roadmap.data";
import { GITHUB_KANBAN_URL } from "../../../shared/config/env";
import { LandingSection } from "./LandingSection";

export function RoadmapSection() {
  return (
    <LandingSection id="roadmap" labelledBy="roadmap-heading" tone="accent">
      <p className={`${styles.subtitle} eyebrow`}>Current coverage</p>
      <h2 className={styles.heading} id="roadmap-heading" tabIndex={-1}>
        Available today and planned next
      </h2>

      <p>{PRODUCT_COVERAGE.summary}</p>

      <aside className={styles.coverageNotice}>
        <strong>{PRODUCT_COVERAGE.plannedGames}</strong>
        <span className={styles.statusLabel}>
          {PRODUCT_COVERAGE.plannedStatus}
        </span>
        <p>{PRODUCT_COVERAGE.plannedDescription}</p>
      </aside>

      <p className={styles.disclaimer}>
        This roadmap communicates product direction, not committed delivery
        dates.
      </p>

      <ol className={styles.phaseList} aria-label="Product roadmap" role="list">
        {ROADMAP_PHASES.map((phase) => (
          <li key={phase.id} className={styles.phaseCard}>
            <h3>{phase.label}</h3>
            <p>{phase.summary}</p>

            <ul className={styles.itemList} role="list">
              {phase.items.map((item) => (
                <li key={item.id}>
                  <div className={styles.itemHeader}>
                    <strong>{item.title}</strong>

                    {"statusLabel" in item && item.statusLabel && (
                      <span className={styles.statusLabel}>
                        {item.statusLabel}
                      </span>
                    )}
                  </div>

                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <a
        className="button button--secondary"
        href={GITHUB_KANBAN_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>What's being developed?</span>
        <span> ↗</span>
        <span className="visually-hidden">— opens in a new tab</span>
      </a>
    </LandingSection>
  );
}
