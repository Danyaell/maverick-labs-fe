import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { RouteOrderPreview } from './RouteOrderPreview'
import type { Stage } from '../../games/types/game.types'

function createStage(slug: string, bossName: string): Stage {
  return {
    slug,
    name: `${bossName} Stage`,
    stageOrder: 1,
    imageAssetKey: `mmx.stage.${slug}`,
    boss: {
      slug,
      name: bossName,
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

describe('RouteOrderPreview', () => {
  test('should display ordered boss route', () => {
    render(
      <RouteOrderPreview
        orderedStages={[
          createStage('chill-penguin', 'Chill Penguin'),
          createStage('storm-eagle', 'Storm Eagle'),
        ]}
      />,
    )

    const routeItems = screen.getAllByRole('listitem').map((item) => item.textContent)
    expect(routeItems).toEqual(['Chill Penguin', 'Storm Eagle'])
  })

  test('should update when stage order changes', () => {
    const { rerender } = render(
      <RouteOrderPreview
        orderedStages={[
          createStage('chill-penguin', 'Chill Penguin'),
          createStage('storm-eagle', 'Storm Eagle'),
        ]}
      />,
    )

    rerender(
      <RouteOrderPreview
        orderedStages={[
          createStage('storm-eagle', 'Storm Eagle'),
          createStage('chill-penguin', 'Chill Penguin'),
        ]}
      />,
    )

    const routeItems = screen.getAllByRole('listitem').map((item) => item.textContent)
    expect(routeItems).toEqual(['Storm Eagle', 'Chill Penguin'])
  })
})
