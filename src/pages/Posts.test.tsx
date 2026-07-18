import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Posts from './Posts'
import { writing } from '../data/writing'

describe('Posts', () => {
  it('links each entry out to its external article (new tab)', () => {
    render(<Posts />)
    for (const w of writing) {
      const link = screen.getByRole('link', { name: new RegExp(w.title, 'i') })
      expect(link).toHaveAttribute('href', w.url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
    }
  })
})
