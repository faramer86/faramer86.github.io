import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Writing from './Writing'

describe('Writing', () => {
  it('lists posts with titles linking to their slug and shows reading time', () => {
    render(
      <MemoryRouter>
        <Writing />
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: /Calibrating pathogenicity scores/ })
    expect(link).toHaveAttribute('href', '/writing/calibrating-pathogenicity-scores')
    expect(screen.getAllByText(/min read/).length).toBeGreaterThanOrEqual(2)
  })
})
