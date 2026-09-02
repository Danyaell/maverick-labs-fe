import { useId, useMemo, useState } from "react";
import { Link } from "react-router";
import styles from "./RouteAnalysisComparison.module.css";
import {
  MMX_STAGE_NAMES,
  routeAnalysisDemoStates,
  type RouteAnalysisDemoState,
} from "../data/routeAnalysisDemo.fixture";
import { getGameAssetUrl } from "../../../utils/assets";
import type { RouteRecommendation } from "../../route-builder/types/routeAnalysis.types";

type StateId = RouteAnalysisDemoState["id"];

function getMovedStageSlugs(a: string[], b: string[]): Set<string> {
  const moved = new Set<string>();

  a.forEach((slug, index) => {
    if (b[index] !== slug) {
      moved.add(slug);
    }
  });

  return moved;
}

function findKeyRecommendation(
  recommendations: RouteRecommendation[],
): RouteRecommendation | undefined {
  return recommendations.find(
    (recommendation) =>
      recommendation.relatedStages?.includes("chill-penguin") &&
      recommendation.relatedStages?.includes("spark-mandrill"),
  );
}

function formatDelta(
  current: number,
  baseline: number,
  unit: string,
): string | null {
  const delta = current - baseline;

  if (delta === 0) {
    return null;
  }

  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta}${unit} vs initial order`;
}

export function RouteAnalysisComparison() {
  const [selectedId, setSelectedId] = useState<StateId>("initial");
  const liveRegionId = useId();

  const [initialState, adjustedState] = routeAnalysisDemoStates;
  const selectedState = selectedId === "initial" ? initialState : adjustedState;
  const baselineResponse = initialState.response;

  const movedStageSlugs = useMemo(
    () =>
      getMovedStageSlugs(
        initialState.request.stageOrder,
        adjustedState.request.stageOrder,
      ),
    [initialState, adjustedState],
  );

  const keyRecommendation = findKeyRecommendation(
    selectedState.response.recommendations,
  );

  const announcement = `${selectedState.label} selected. Difficulty ${selectedState.response.difficultyScore}, backtracking ${selectedState.response.backtrackingScore}, estimated time ${selectedState.response.estimatedMinutes} minutes.`;

  const metrics = [
    {
      key: "difficulty",
      label: "Difficulty",
      value: `${selectedState.response.difficultyScore} / 100`,
      delta: formatDelta(
        selectedState.response.difficultyScore,
        baselineResponse.difficultyScore,
        "",
      ),
    },
    {
      key: "backtracking",
      label: "Backtracking",
      value: `${selectedState.response.backtrackingScore} / 100`,
      delta: formatDelta(
        selectedState.response.backtrackingScore,
        baselineResponse.backtrackingScore,
        "",
      ),
    },
    {
      key: "estimatedTime",
      label: "Estimated time",
      value: `${selectedState.response.estimatedMinutes} min`,
      delta: formatDelta(
        selectedState.response.estimatedMinutes,
        baselineResponse.estimatedMinutes,
        " min",
      ),
    },
    {
      key: "weaknessReduction",
      label: "Weakness reduction",
      value: `${selectedState.response.breakdown.weaknessReduction} / 100`,
      delta: formatDelta(
        selectedState.response.breakdown.weaknessReduction,
        baselineResponse.breakdown.weaknessReduction,
        "",
      ),
    },
  ];

  return (
    <div className={styles.comparison}>
      <div className={styles.controls} role="group" aria-label="Route order">
        {routeAnalysisDemoStates.map((state) => {
          const isSelected = state.id === selectedId;

          return (
            <button
              key={state.id}
              type="button"
              className={`button button--secondary ${styles.controlButton} ${
                isSelected ? styles.controlButtonSelected : ""
              }`}
              aria-pressed={isSelected}
              onClick={() => setSelectedId(state.id)}
            >
              {isSelected ? <span aria-hidden="true">&#10003; </span> : null}
              {state.label}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" id={liveRegionId} className={styles.visuallyHidden}>
        {announcement}
      </p>

      <ol className={styles.stageOrder}>
        {selectedState.request.stageOrder.map((slug, index) => {
          const stageName = MMX_STAGE_NAMES[slug] ?? slug;
          const hasMoved = movedStageSlugs.has(slug);

          return (
            <li
              key={slug}
              className={`${styles.stageItem} ${hasMoved ? styles.stageItemMoved : ""}`}
            >
              <span className={styles.stageNumber}>{index + 1}</span>
              <img
                className={styles.stageIcon}
                src={getGameAssetUrl(`mmx.stage.${slug}`)}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
              <span className={styles.stageName}>{stageName}</span>
              {hasMoved ? <span className={styles.movedTag}>Moved</span> : null}
            </li>
          );
        })}
      </ol>

      <dl className={styles.metrics}>
        {metrics.map((metric) => (
          <div className={styles.metric} key={metric.key}>
            <dt className="helperText">{metric.label}</dt>
            <dd className={styles.metricValue}>{metric.value}</dd>
            {metric.delta ? (
              <dd className={styles.metricDelta}>{metric.delta}</dd>
            ) : (
              <dd className={styles.metricDelta}>Baseline</dd>
            )}
          </div>
        ))}
      </dl>

      {keyRecommendation ? (
        <p className={styles.callout}>
          <strong>
            {keyRecommendation.severity === "INFO"
              ? "Good choice: "
              : "Recommendation: "}
          </strong>
          {keyRecommendation.message}
        </p>
      ) : null}

      <p className={styles.explanation}>{selectedState.explanation}</p>

      <Link className="button button--primary" to="/games/MMX/route-builder">
        Try your own MMX route
      </Link>
    </div>
  );
}
