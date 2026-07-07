import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CV from './CV'

describe('CV', () => {
  it('renders each section heading and its entries', () => {
    render(<CV />)
    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Positions' })).toBeInTheDocument()
    expect(screen.getByText(/PhD, Clinical Genomics/)).toBeInTheDocument()
  })
})
