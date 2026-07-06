import { describe, expect, test } from 'vitest'
import type { Stage } from '../../games/types/game.types'
import { createInitialStageOrder } from './createInitialStageOrder'

function createStage(slug: string, stageOrder: number): Stage {
  return {
    slug,
    name: `${slug} stage`,
    stageOrder,
    imageAssetKey: `mmx.stage.${slug}`,
    boss: {
      slug,
      name: slug,
      imageAssetKey: `mmx.boss.${slug}`,
    },
    weaponReward: {
      slug: `weapon-${slug}`,
      name: `weapon-${slug}`,
      description: 'test',
      imageAssetKey: `mmx.weapon.weapon-${slug}`,
    },
    collectibles: [],
  }
}

describe('createInitialStageOrder', () => {
  test('should return stage slugs ordered by stageOrder', () => {
    const stages = [createStage('storm-eagle', 2), createStage('chill-penguin', 1)]

    const result = createInitialStageOrder(stages)

    expect(result).toEqual(['chill-penguin', 'storm-eagle'])
  })

  test('should not mutate original stages array', () => {
    const stages = [createStage('storm-eagle', 2), createStage('chill-penguin', 1)]

    createInitialStageOrder(stages)

    expect(stages.map((stage) => stage.slug)).toEqual(['storm-eagle', 'chill-penguin'])
  })

  test('should return empty array when stages are empty', () => {
    const result = createInitialStageOrder([])

    expect(result).toEqual([])
  })
})
