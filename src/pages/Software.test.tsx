import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Software from './Software'

describe('Software', () => {
  it('lists projects with their stack and a repo link', () => {
    render(<Software />)
    expect(screen.getByText('ClinVin')).toBeInTheDocument()
    expect(screen.getByText('trio-prior')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /repo/i }).length).toBeGreaterThanOrEqual(2)
  })
})
