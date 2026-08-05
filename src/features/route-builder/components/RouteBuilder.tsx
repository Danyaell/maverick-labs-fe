import styles from "./RouteBuilder.module.css";
import type { GameDetail } from "../../games/types/game.types";
import { useRouteBuilder } from "../hooks/useRouteBuilder";
import { SortableStageCard } from "./SortableStageCard";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { PointerActivationConstraints, PointerSensor } from "@dnd-kit/dom";
import { LiveRouteAnalysis } from "./LiveRouteAnalysis";
import { RouteBuilderActions } from "./RouteBuilderActions";

interface RouteBuilderProps {
  game: GameDetail;
}

export function RouteBuilder({ game }: RouteBuilderProps) {
  const { routeState, orderedStages, moveStage, onReset } =
    useRouteBuilder(game);

  return (
    <section className={styles.builderContainer}>
      <div className={styles.layout}>
        <div>
          <RouteBuilderActions onReset={onReset} />
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
        </div>

        <LiveRouteAnalysis
          gameCode={routeState.gameCode}
          stageOrder={routeState.stageOrder}
          onReset={onReset}
        />
      </div>
    </section>
  );
}
