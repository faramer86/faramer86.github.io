import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

describe('Home', () => {
  it('renders name, role, summary, and quick links', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Nikita Kolosov')
    expect(screen.getByText(/PhD student/)).toBeInTheDocument()
    expect(screen.getByText(/rare-disease variants/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Writing/ })).toHaveAttribute('href', '/writing')
    expect(screen.getByRole('link', { name: /Publications/ })).toHaveAttribute('href', '/publications')
    expect(screen.getByRole('link', { name: /Software/ })).toHaveAttribute('href', '/software')
  })
})
