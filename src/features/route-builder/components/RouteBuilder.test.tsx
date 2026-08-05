import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import { RouteBuilder } from './RouteBuilder'
import type { GameDetail } from '../../games/types/game.types'

function createGameDetail(): GameDetail {
  return {
    code: 'MMX',
    title: 'Mega Man X',
    releaseOrder: 1,
    stages: [
      {
        slug: 'chill-penguin',
        name: 'Chill Penguin Stage',
        stageOrder: 1,
        imageAssetKey: 'mmx.stage.chill-penguin',
        boss: {
          slug: 'chill-penguin',
          name: 'Chill Penguin',
          imageAssetKey: 'mmx.boss.chill-penguin',
        },
        weaponReward: {
          slug: 'shotgun-ice',
          name: 'Shotgun Ice',
          description: 'Fires ice projectiles.',
          imageAssetKey: 'mmx.weapon.shotgun-ice',
        },
        collectibles: [],
      },
      {
        slug: 'storm-eagle',
        name: 'Storm Eagle Stage',
        stageOrder: 2,
        imageAssetKey: 'mmx.stage.storm-eagle',
        boss: {
          slug: 'storm-eagle',
          name: 'Storm Eagle',
          imageAssetKey: 'mmx.boss.storm-eagle',
        },
        weaponReward: {
          slug: 'storm-tornado',
          name: 'Storm Tornado',
          description: 'Creates a tornado attack.',
          imageAssetKey: 'mmx.weapon.storm-tornado',
        },
        collectibles: [],
      },
      {
        slug: 'flame-mammoth',
        name: 'Flame Mammoth Stage',
        stageOrder: 3,
        imageAssetKey: 'mmx.stage.flame-mammoth',
        boss: {
          slug: 'flame-mammoth',
          name: 'Flame Mammoth',
          imageAssetKey: 'mmx.boss.flame-mammoth',
        },
        weaponReward: {
          slug: 'fire-wave',
          name: 'Fire Wave',
          description: 'Launches flames.',
          imageAssetKey: 'mmx.weapon.fire-wave',
        },
        collectibles: [],
      },
    ],
  }
}

describe('RouteBuilder', () => {
  test('should render boss names', () => {
    render(<RouteBuilder game={createGameDetail()} />)

    expect(screen.getAllByText('Boss:')).toHaveLength(3)
    expect(screen.getByTestId('stage-card-chill-penguin')).toHaveTextContent('Chill Penguin')
    expect(screen.getByTestId('stage-card-storm-eagle')).toHaveTextContent('Storm Eagle')
    expect(screen.getByTestId('stage-card-flame-mammoth')).toHaveTextContent('Flame Mammoth')
  })

  test('should render weapon rewards', () => {
    render(<RouteBuilder game={createGameDetail()} />)

    expect(screen.getByText('Shotgun Ice')).toBeInTheDocument()
    expect(screen.getByText('Storm Tornado')).toBeInTheDocument()
    expect(screen.getByText('Fire Wave')).toBeInTheDocument()
  })

  test('should update order after drag/drop interaction', () => {
    render(<RouteBuilder game={createGameDetail()} />)

    const sourceCard = screen.getByTestId('stage-card-chill-penguin')
    const targetCard = screen.getByTestId('stage-card-flame-mammoth')

    fireEvent.dragStart(sourceCard, { dataTransfer: {} })
    fireEvent.dragOver(targetCard, { dataTransfer: {} })
    fireEvent.drop(targetCard, { dataTransfer: {} })
  })

  test('should reset route to default order', async () => {
    const user = userEvent.setup()

    render(<RouteBuilder game={createGameDetail()} />)

    const sourceCard = screen.getByTestId('stage-card-chill-penguin')
    const targetCard = screen.getByTestId('stage-card-flame-mammoth')

    fireEvent.dragStart(sourceCard, { dataTransfer: {} })
    fireEvent.dragOver(targetCard, { dataTransfer: {} })
    fireEvent.drop(targetCard, { dataTransfer: {} })

    await user.click(screen.getByRole('button', { name: 'Reset to default order' }))
  })
})
