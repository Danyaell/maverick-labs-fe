import type { Stage } from '../../games/types/game.types'

export function createInitialStageOrder(stages: Stage[]): string[] {
  return [...stages]
    .sort((first, second) => first.stageOrder - second.stageOrder)
    .map((stage) => stage.slug)
}
