import { NavLink } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import './Nav.css'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/publications', label: 'Publications', end: false },
  { to: '/software', label: 'Software', end: false },
  { to: '/posts', label: 'Posts', end: false },
]

export function Nav() {
  return (
    <nav className="nav">
      <ul className="nav-links">
        {links.map((l) => (
          <li key={l.to}>
            <NavLink to={l.to} end={l.end}>{l.label}</NavLink>
          </li>
        ))}
      </ul>
      <div className="nav-toggle"><ThemeToggle /></div>
    </nav>
  )
}
