import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Nav } from './Nav'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Nav />
    </MemoryRouter>,
  )
}

describe('Nav', () => {
  it('renders all four section links with correct hrefs', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Publications' })).toHaveAttribute('href', '/publications')
    expect(screen.getByRole('link', { name: 'Software' })).toHaveAttribute('href', '/software')
    expect(screen.getByRole('link', { name: 'Posts' })).toHaveAttribute('href', '/posts')
  })

  it('marks the active route with aria-current', () => {
    renderAt('/publications')
    expect(screen.getByRole('link', { name: 'Publications' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('does not mark Home as active when on /publications (end prop)', () => {
    renderAt('/publications')
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })
})
