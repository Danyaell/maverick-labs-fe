import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { GameCard } from './GameCard'

test('renders GameCard title and link', () => {
  const game = { code: 'mmx', title: 'Mega Man X', releaseOrder: 1 }

  render(
    <MemoryRouter>
      <GameCard game={game} />
    </MemoryRouter>
  )

  expect(screen.getByAltText('Mega Man X')).toBeInTheDocument()
  const link = screen.getByAltText('Mega Man X').closest('a')
  expect(link).toHaveAttribute('href', `/games/${game.code}`)
})
