import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import { profile } from '../data/profile'

describe('Home', () => {
  it('renders name, role, summary, and quick links', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(profile.name)
    expect(screen.getByText(new RegExp(profile.role))).toBeInTheDocument()
    expect(screen.getByText(profile.summary)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Writing/ })).toHaveAttribute('href', '/writing')
    expect(screen.getByRole('link', { name: /Publications/ })).toHaveAttribute('href', '/publications')
    expect(screen.getByRole('link', { name: /Software/ })).toHaveAttribute('href', '/software')
  })
})
