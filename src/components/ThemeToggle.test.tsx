import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  it('exposes an accessible label and toggles the document theme on click', async () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /theme/i })
    await userEvent.click(button)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    await userEvent.click(button)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
