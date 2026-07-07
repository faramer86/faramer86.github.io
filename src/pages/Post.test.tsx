import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Post from './Post'

function renderPost(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/writing/${slug}`]}>
      <Routes>
        <Route path="/writing/:slug" element={<Post />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Post', () => {
  it('renders the post title, metadata, and body', () => {
    renderPost('calibrating-pathogenicity-scores')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Calibrating pathogenicity scores',
    )
    expect(screen.getByText(/min read/)).toBeInTheDocument()
    expect(screen.getByText(/uncalibrated/)).toBeInTheDocument()
  })

  it('shows a not-found message for an unknown slug', () => {
    renderPost('nope')
    expect(screen.getByText(/not found/i)).toBeInTheDocument()
  })
})
