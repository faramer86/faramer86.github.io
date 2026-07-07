import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Nav } from './Nav'
import { profile } from '../data/profile'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Nav />
    </MemoryRouter>,
  )
}

describe('Nav', () => {
  it('renders the brand initials and all section links', () => {
    renderAt('/')
    expect(screen.getByText(profile.initials)).toBeInTheDocument()
    for (const label of ['About', 'Publications', 'Software', 'Writing', 'CV']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('marks the active route with aria-current', () => {
    renderAt('/publications')
    expect(screen.getByRole('link', { name: 'Publications' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
