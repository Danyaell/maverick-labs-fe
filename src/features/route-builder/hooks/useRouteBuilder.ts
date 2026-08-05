import { useCallback, useMemo, useState } from "react";
import type { GameDetail } from "../../games/types/game.types";
import type { RouteBuilderState } from "../types/routeBuilder.types";
import { createInitialStageOrder } from "../utils/createInitialStageOrder";
import { getOrderedStages } from "../utils/getOrderedStages";
import { reorderStages } from "../utils/reorderStages";

interface UseRouteBuilderResult {
  routeState: RouteBuilderState;
  orderedStages: GameDetail["stages"];
  moveStage: (fromIndex: number, toIndex: number) => void;
  onReset: () => void;
}

export function useRouteBuilder(game: GameDetail): UseRouteBuilderResult {
  const defaultStageOrder = useMemo(
    () => createInitialStageOrder(game.stages),
    [game.stages],
  );
  const [stageOrder, setStageOrder] = useState<string[]>(
    () => defaultStageOrder,
  );

  const routeState = useMemo<RouteBuilderState>(
    () => ({
      gameCode: game.code,
      stageOrder,
    }),
    [game.code, stageOrder],
  );

  const orderedStages = useMemo(
    () => getOrderedStages(game.stages, stageOrder),
    [game.stages, stageOrder],
  );

  const moveStage = useCallback(
    (fromIndex: number, toIndex: number) => {
      setStageOrder((currentOrder) =>
        reorderStages(currentOrder, fromIndex, toIndex),
      );
    },
    [],
  );

  const onReset = useCallback(() => {
    setStageOrder(defaultStageOrder);
  }, [defaultStageOrder]);

  return {
    routeState,
    orderedStages,
    moveStage,
    onReset,
  };
}
