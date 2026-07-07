import { describe, expect, test } from 'vitest'
import type { Stage } from '../../games/types/game.types'
import { getOrderedStages } from './getOrderedStages'

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

describe('getOrderedStages', () => {
  const stages = [
    createStage('chill-penguin', 1),
    createStage('storm-eagle', 2),
    createStage('flame-mammoth', 3),
  ]

  test('should return stages matching stageOrder', () => {
    const result = getOrderedStages(stages, ['storm-eagle', 'chill-penguin'])

    expect(result.map((stage) => stage.slug)).toEqual(['storm-eagle', 'chill-penguin'])
  })

  test('should preserve order from stageOrder', () => {
    const result = getOrderedStages(stages, ['flame-mammoth', 'chill-penguin', 'storm-eagle'])

    expect(result.map((stage) => stage.slug)).toEqual([
      'flame-mammoth',
      'chill-penguin',
      'storm-eagle',
    ])
  })

  test('should ignore unknown slugs safely', () => {
    const result = getOrderedStages(stages, ['unknown-slug', 'storm-eagle'])

    expect(result.map((stage) => stage.slug)).toEqual(['storm-eagle'])
  })

  test('should handle empty stageOrder', () => {
    const result = getOrderedStages(stages, [])

    expect(result).toEqual([])
  })
})
