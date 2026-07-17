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

  it('renders contact links in the hero', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: 'ORCID' })).toHaveAttribute('target', '_blank')
    const email = screen.getByRole('link', { name: 'Email' })
    expect(email).toHaveAttribute('href', 'mailto:nikolosov86@gmail.com')
    expect(email).not.toHaveAttribute('target')
  })
})
