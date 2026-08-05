import styles from "./RouteAnalysisPanel.module.css";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { RouteBreakdown } from "./RouteBreakdown";
import { RouteRecommendationsList } from "./RouteRecommendationsList";
import { RouteWarningsList } from "./RouteWarningsList";
import type { RouteAnalysisResponse } from "../types/routeAnalysis.types";

const TABS = [
  { id: "summary", label: "Summary" },
  { id: "recommendations", label: "Recommendations" },
  { id: "breakdown", label: "Breakdown" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface RouteAnalysisPanelProps {
  analysis: RouteAnalysisResponse;
}

function formatDifficultyLabel(label: string): string {
  return label
    .toLowerCase()
    .split("_")
    .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
    .join(" ");
}

function normalizeMessage(value: string): string {
  return value.trim().toLowerCase();
}

function getVisibleRecommendations(analysis: RouteAnalysisResponse) {
  const warningMessages = new Set(
    analysis.warnings.map((warning) => normalizeMessage(warning.message)),
  );

  return analysis.recommendations
    .filter(
      (recommendation) =>
        !warningMessages.has(normalizeMessage(recommendation.message)),
    )
    .slice(0, 8);
}

export function RouteAnalysisPanel({ analysis }: RouteAnalysisPanelProps) {
  const visibleRecommendations = getVisibleRecommendations(analysis);
  const tabsId = useId();
  const [activeTab, setActiveTab] = useState<TabId>("summary");
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    summary: null,
    recommendations: null,
    breakdown: null,
  });

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) {
    let nextIndex: number;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % TABS.length;
        break;

      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
        break;

      case "Home":
        nextIndex = 0;
        break;

      case "End":
        nextIndex = TABS.length - 1;
        break;

      default:
        return;
    }

    event.preventDefault();

    const nextTab = TABS[nextIndex];

    setActiveTab(nextTab.id);
    tabRefs.current[nextTab.id]?.focus();
  }

  return (
    <section className={styles.panel}>
      <p className="helperText">ANALYSIS FOR CURRENT ORDER</p>
      <h2>Route Analysis</h2>

      <div
        className={styles.tabList}
        role="tablist"
        aria-label="Route analysis sections"
      >
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[tab.id] = element;
              }}
              id={`${tabsId}-${tab.id}-tab`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tabsId}-${tab.id}-panel`}
              tabIndex={isActive ? 0 : -1}
              className={`${styles.routeAnalysisNavButton} ${
                isActive ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${tabsId}-summary-panel`}
        role="tabpanel"
        aria-labelledby={`${tabsId}-summary-tab`}
        className={styles.tabPanel}
        hidden={activeTab !== "summary"}
      >
        <div className={styles.analysisSummary}>
          <div className={styles.analysisCard}>
            <p className="helperText">DIFFICULTY</p>
            <h2>{analysis.difficultyScore} / 100</h2>
            <p className="helperText">
              {formatDifficultyLabel(analysis.difficultyLabel)}
            </p>
          </div>

          <div className={styles.analysisCard}>
            <p className="helperText">BACKTRACKING</p>
            <h2>{analysis.backtrackingScore} / 100</h2>
          </div>

          <div className={styles.analysisCard}>
            <p className="helperText">ESTIMATED TIME</p>
            <h2>{analysis.estimatedMinutes} min</h2>
            <p className="helperText">Full route</p>
          </div>
        </div>

        <div className={styles.priorRecommendationContainer}>
          <h3>Highest-impact change</h3>
          <p className={styles.priorRecommendationMessage}>
            {visibleRecommendations[0]?.message ??
              "No recommendations available."}
          </p>
        </div>
      </div>

      <div
        id={`${tabsId}-recommendations-panel`}
        role="tabpanel"
        aria-labelledby={`${tabsId}-recommendations-tab`}
        className={styles.tabPanel}
        hidden={activeTab !== "recommendations"}
      >
        <div className={styles.section}>
          <RouteRecommendationsList
            recommendations={visibleRecommendations}
          />
        </div>
      </div>

      <div
        id={`${tabsId}-breakdown-panel`}
        role="tabpanel"
        aria-labelledby={`${tabsId}-breakdown-tab`}
        className={styles.tabPanel}
        hidden={activeTab !== "breakdown"}
      >
        <div className={styles.section}>
          <RouteBreakdown breakdown={analysis.breakdown} />
        </div>

        <div className={styles.section}>
          <h3>Warnings</h3>
          <RouteWarningsList warnings={analysis.warnings} />
        </div>
      </div>
    </section>
  );
}
