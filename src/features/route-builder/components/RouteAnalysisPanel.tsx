import styles from "./RouteAnalysisPanel.module.css";
import { useState } from "react";
import { RouteBreakdown } from "./RouteBreakdown";
import { RouteRecommendationsList } from "./RouteRecommendationsList";
import { RouteWarningsList } from "./RouteWarningsList";
import type { RouteAnalysisResponse } from "../types/routeAnalysis.types";

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
  const uniqueRecommendations = analysis.recommendations.filter(
    (recommendation) =>
      !warningMessages.has(normalizeMessage(recommendation.message)),
  );

  return uniqueRecommendations.slice(0, 8);
}

export function RouteAnalysisPanel({ analysis }: RouteAnalysisPanelProps) {
  const visibleRecommendations = getVisibleRecommendations(analysis);
  const [activeTab, setActiveTab] = useState<
    "summary" | "recommendations" | "breakdown"
  >("summary");

  return (
    <section className={styles.panel}>
      <p className="helperText">ANALYSIS FOR CURRENT ORDER</p>
      <h2>Route Analysis</h2>

      <div>
        <button
          className={styles.routeAnalysisNavButton}
          onClick={() => setActiveTab("summary")}
        >
          Summary
        </button>
        <button
          className={styles.routeAnalysisNavButton}
          onClick={() => setActiveTab("recommendations")}
        >
          Recommendations
        </button>
        <button
          className={styles.routeAnalysisNavButton}
          onClick={() => setActiveTab("breakdown")}
        >
          Breakdown
        </button>
      </div>

      {activeTab === "summary" && (
        <>
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
              {visibleRecommendations.length > 0
                ? visibleRecommendations[0].message
                : "No recommendations available."}
            </p>
          </div>
        </>
      )}

      {activeTab === "recommendations" && (
        <div className={styles.section}>
          <RouteRecommendationsList recommendations={visibleRecommendations} />
        </div>
      )}

      {activeTab === "breakdown" && (
        <>
          <div className={styles.section}>
            <RouteBreakdown breakdown={analysis.breakdown} />
          </div>
          <div className={styles.section}>
            <h4>Warnings</h4>
            <RouteWarningsList warnings={analysis.warnings} />
          </div>
        </>
      )}
    </section>
  );
}
