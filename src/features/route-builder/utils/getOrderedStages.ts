import type { Stage } from '../../games/types/game.types'

export function getOrderedStages(stages: Stage[], stageOrder: string[]): Stage[] {
  const stagesBySlug = new Map(stages.map((stage) => [stage.slug, stage]))

  return stageOrder
    .map((slug) => stagesBySlug.get(slug))
    .filter((stage): stage is Stage => Boolean(stage))
}
