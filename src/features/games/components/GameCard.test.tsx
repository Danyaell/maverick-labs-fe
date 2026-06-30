import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { GameCard } from './GameCard'

test('renders GameCard title and link', () => {
  const game = { code: 'abc123', title: 'Test Game', releaseOrder: 1 }

  render(
    <MemoryRouter>
      <GameCard game={game} />
    </MemoryRouter>
  )

  expect(screen.getByText('Test Game')).toBeInTheDocument()
  const link = screen.getByText('Test Game').closest('a')
  expect(link).toHaveAttribute('href', `/games/${game.code}`)
})
