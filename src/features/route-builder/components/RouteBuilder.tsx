import styles from "./RouteBuilder.module.css";
import type { GameDetail } from "../../games/types/game.types";
import { useRouteBuilder } from "../hooks/useRouteBuilder";
import { DraggableStageCard } from "./DraggableStageCard";
import { RouteBuilderActions } from "./RouteBuilderActions";
import { RouteOrderPreview } from "./RouteOrderPreview";
import { analyzeRoute } from "../api/routeAnalysisApi";
import { RouteAnalysisPanel } from "./RouteAnalysisPanel";
import type { RouteAnalysisResponse } from "../types/routeAnalysis.types";
import { useState } from "react";

interface RouteBuilderProps {
  game: GameDetail;
}

export function RouteBuilder({ game }: RouteBuilderProps) {
  const {
    orderedStages,
    draggingIndex,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    onReset,
  } = useRouteBuilder(game);
  const [routeAnalysis, setRouteAnalysis] =
    useState<RouteAnalysisResponse | null>(null);
  const [routeAnalysisError, setRouteAnalysisError] = useState<string | null>(
    null,
  );
  const [isAnalyzingRoute, setIsAnalyzingRoute] = useState(false);

  async function handleAnalyzeRoute() {
    setRouteAnalysisError(null);
    setIsAnalyzingRoute(true);
    try {
      const analysis = await analyzeRoute({
        gameCode: game.code,
        stageOrder: orderedStages.map((stage) => stage.slug),
        goal: "HUNDRED_PERCENT",
      });

      setRouteAnalysis(analysis);
    } catch (analysisError) {
      setRouteAnalysis(null);
      setRouteAnalysisError(
        analysisError instanceof Error
          ? analysisError.message
          : "Unable to analyze route.",
      );
    } finally {
      setIsAnalyzingRoute(false);
    }
  }

  return (
    <section className={styles.builderContainer}>
      <RouteBuilderActions onReset={onReset} />
      <button
        type="button"
        className={styles.analyzeButton}
        onClick={() => void handleAnalyzeRoute()}
        disabled={isAnalyzingRoute || orderedStages.length === 0}
      >
        {isAnalyzingRoute ? "Analyzing route..." : "Analyze Route"}
      </button>
      {routeAnalysisError ? (
        <p role="alert" className={styles.analysisError}>
          {routeAnalysisError}
        </p>
      ) : null}

      {routeAnalysis ? <RouteAnalysisPanel analysis={routeAnalysis} /> : null}

      <div className={styles.layout}>
        <ul className={styles.stageList}>
          {orderedStages.map((stage, index) => (
            <li key={stage.slug} className={styles.stageItem}>
              <DraggableStageCard
                stage={stage}
                index={index}
                isDragging={draggingIndex === index}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
              />
            </li>
          ))}
        </ul>

        <RouteOrderPreview orderedStages={orderedStages} />
      </div>
    </section>
  );
}
