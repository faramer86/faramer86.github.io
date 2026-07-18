import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Software from './Software'
import { projects } from '../data/projects'

describe('Software', () => {
  it('lists every project with its name and a repo link', () => {
    render(<Software />)
    for (const p of projects) {
      expect(screen.getByText(p.name)).toBeInTheDocument()
    }
    const repos = screen.getAllByRole('link', { name: /repo/i })
    expect(repos.length).toBe(projects.filter((p) => p.repo).length)
  })
})
