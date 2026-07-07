import { useMemo, useState } from 'react'
import type { GameDetail } from '../../games/types/game.types'
import type { RouteBuilderState } from '../types/routeBuilder.types'
import { createInitialStageOrder } from '../utils/createInitialStageOrder'
import { getOrderedStages } from '../utils/getOrderedStages'
import { reorderStages } from '../utils/reorderStages'

interface UseRouteBuilderResult {
  routeState: RouteBuilderState
  orderedStages: GameDetail['stages']
  draggingIndex: number | null
  onDragStart: (index: number) => void
  onDragOver: (index: number) => void
  onDrop: (index: number) => void
  onDragEnd: () => void
  onReset: () => void
}

export function useRouteBuilder(game: GameDetail): UseRouteBuilderResult {
  const defaultStageOrder = useMemo(() => createInitialStageOrder(game.stages), [game.stages])
  const [stageOrder, setStageOrder] = useState<string[]>(() => defaultStageOrder)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)

  const routeState = useMemo<RouteBuilderState>(
    () => ({
      gameCode: game.code,
      stageOrder,
    }),
    [game.code, stageOrder],
  )

  const orderedStages = useMemo(
    () => getOrderedStages(game.stages, stageOrder),
    [game.stages, stageOrder],
  )

  const onDragStart = (index: number) => {
    setDraggingIndex(index)
  }

  const onDragOver = (index: number) => {
    void index
    // Native drag-and-drop requires a dragover handler on targets.
  }

  const onDrop = (index: number) => {
    if (draggingIndex === null) {
      return
    }

    setStageOrder((currentStageOrder) => reorderStages(currentStageOrder, draggingIndex, index))
    setDraggingIndex(null)
  }

  const onDragEnd = () => {
    setDraggingIndex(null)
  }

  const onReset = () => {
    setStageOrder(defaultStageOrder)
    setDraggingIndex(null)
  }

  return {
    routeState,
    orderedStages,
    draggingIndex,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    onReset,
  }
}
