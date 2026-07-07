import { profile } from '../data/profile'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <ul className="footer-links">
        {profile.links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
          </li>
        ))}
      </ul>
      <p className="footer-copy">© {new Date().getFullYear()} {profile.name}</p>
    </footer>
  )
}
