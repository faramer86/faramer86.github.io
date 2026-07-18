import type { CSSProperties } from 'react'
import { NavLink } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { sectionColor } from '../data/sectionColors'
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
      <div className="nav-pill">
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                style={{ '--section-color': sectionColor[l.to] } as CSSProperties}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="nav-toggle"><ThemeToggle /></div>
      </div>
    </nav>
  )
}
