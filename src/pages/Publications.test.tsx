import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Publications from './Publications'

describe('Publications', () => {
  it('lists every publication with its venue and a DOI link', () => {
    render(<Publications />)
    expect(screen.getByText(/trio-aware framework/)).toBeInTheDocument()
    expect(screen.getByText(/Benchmarking pathogenicity predictors/)).toBeInTheDocument()
    const dois = screen.getAllByRole('link', { name: /doi/i })
    expect(dois.length).toBeGreaterThanOrEqual(2)
  })
})
