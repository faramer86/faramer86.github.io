import { useTheme } from '../theme/useTheme'
import './ThemeToggle.css'

// Feather-icon sun/moon glyphs (MIT). Stroke-based so they stay crisp and
// unambiguous at small sizes — unlike the ☀/☾ text glyphs, which render as a
// tiny asterisk-like mark in a monospace font.
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4.2" />
      <line x1="12" y1="1.5" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22.5" />
      <line x1="3.5" y1="3.5" x2="5.3" y2="5.3" />
      <line x1="18.7" y1="18.7" x2="20.5" y2="20.5" />
      <line x1="1.5" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22.5" y2="12" />
      <line x1="3.5" y1="20.5" x2="5.3" y2="18.7" />
      <line x1="18.7" y1="5.3" x2="20.5" y2="3.5" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
