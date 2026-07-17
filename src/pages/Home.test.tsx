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
    expect(screen.getByRole('link', { name: /Posts/ })).toHaveAttribute('href', '/posts')
    expect(screen.getByRole('link', { name: /Publications/ })).toHaveAttribute('href', '/publications')
    expect(screen.getByRole('link', { name: /Software/ })).toHaveAttribute('href', '/software')
  })

  it('renders a Download CV button linking to cv.pdf', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    const cvLink = screen.getByRole('link', { name: /Download CV/i })
    expect(cvLink.getAttribute('href')).toMatch(/cv\.pdf$/)
    expect(cvLink).toHaveAttribute('download')
  })

  it('does not duplicate contact links in the hero (they live in the footer)', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'ORCID' })).not.toBeInTheDocument()
  })
})
