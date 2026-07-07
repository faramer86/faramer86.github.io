import { useTheme } from '../theme/useTheme'
import './ThemeToggle.css'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? '☀' : '☾'}
    </button>
  )
}
