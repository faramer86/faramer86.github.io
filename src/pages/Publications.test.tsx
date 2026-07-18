import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Publications from './Publications'
import { publications } from '../data/publications'

describe('Publications', () => {
  it('renders every publication with a DOI link', () => {
    render(<Publications />)
    for (const p of publications) {
      expect(screen.getByText(p.title)).toBeInTheDocument()
    }
    const dois = screen.getAllByRole('link', { name: /doi/i })
    expect(dois.length).toBe(publications.filter((p) => p.doi).length)
  })

  it('lists publications newest first (by date)', () => {
    render(<Publications />)
    const rendered = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    const expected = [...publications]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .map((p) => p.title)
    expect(rendered).toEqual(expected)
  })
})
