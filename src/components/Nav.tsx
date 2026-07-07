import { Link, NavLink } from 'react-router-dom'
import { profile } from '../data/profile'
import { ThemeToggle } from './ThemeToggle'
import './Nav.css'

const links = [
  { to: '/about', label: 'About' },
  { to: '/publications', label: 'Publications' },
  { to: '/software', label: 'Software' },
  { to: '/writing', label: 'Writing' },
  { to: '/cv', label: 'CV' },
]

export function Nav() {
  const mid = Math.ceil(links.length / 2)
  const left = links.slice(0, mid)
  const right = links.slice(mid)

  return (
    <nav className="nav">
      <ul className="nav-group">
        {left.map((l) => (
          <li key={l.to}>
            <NavLink to={l.to}>{l.label}</NavLink>
          </li>
        ))}
      </ul>
      <Link to="/" className="nav-brand" aria-label="Home">{profile.initials}</Link>
      <ul className="nav-group">
        {right.map((l) => (
          <li key={l.to}>
            <NavLink to={l.to}>{l.label}</NavLink>
          </li>
        ))}
      </ul>
      <div className="nav-toggle"><ThemeToggle /></div>
    </nav>
  )
}
