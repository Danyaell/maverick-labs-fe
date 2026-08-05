import styles from "./RouteBuilder.module.css";
import type { GameDetail } from "../../games/types/game.types";
import { useRouteBuilder } from "../hooks/useRouteBuilder";
import { SortableStageCard } from "./SortableStageCard";
import { RouteBuilderActions } from "./RouteBuilderActions";
import { analyzeRoute } from "../api/routeAnalysisApi";
import { RouteAnalysisPanel } from "./RouteAnalysisPanel";
import type { RouteAnalysisResponse } from "../types/routeAnalysis.types";
import { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { PointerActivationConstraints, PointerSensor } from "@dnd-kit/dom";

interface RouteBuilderProps {
  game: GameDetail;
}

export function RouteBuilder({ game }: RouteBuilderProps) {
  const { orderedStages, moveStage, onReset } = useRouteBuilder(game);
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

      <div className={styles.layout}>
        <DragDropProvider
          sensors={(defaultSensors) => [
            ...defaultSensors.filter((sensor) => sensor !== PointerSensor),

            PointerSensor.configure({
              activationConstraints(event) {
                if (event.pointerType === "touch") {
                  return [
                    new PointerActivationConstraints.Delay({
                      value: 250,
                      tolerance: 5,
                    }),
                  ];
                }

                return [
                  new PointerActivationConstraints.Distance({
                    value: 5,
                  }),
                ];
              },
            }),
          ]}
          onDragEnd={(event) => {
            if (event.canceled) {
              return;
            }

            const { source } = event.operation;

            if (!isSortable(source)) {
              return;
            }

            const { initialIndex, index } = source;

            if (initialIndex !== index) {
              moveStage(initialIndex, index);
            }
          }}
        >
          <ul className={styles.stageList} aria-label="Stage order">
            {orderedStages.map((stage, index) => (
              <SortableStageCard
                key={stage.slug}
                stage={stage}
                index={index}
                totalStages={orderedStages.length}
                onMoveUp={() => moveStage(index, index - 1)}
                onMoveDown={() => moveStage(index, index + 1)}
              />
            ))}
          </ul>
        </DragDropProvider>

        {routeAnalysis ? <RouteAnalysisPanel analysis={routeAnalysis} /> : null}
      </div>
    </section>
  );
}
