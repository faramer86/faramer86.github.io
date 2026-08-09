import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import { publications } from '../data/publications'
import { projects } from '../data/projects'
import { writing } from '../data/writing'
import { sectionColor } from '../data/sectionColors'
import { Seo } from '../components/Seo'
import { AnimatedName } from '../components/AnimatedName'
import { BrandIcon } from '../components/BrandIcon'
import './Home.css'

// Counts come from the data itself, so they can't drift as entries are added.
const quickLinks = [
  { to: '/publications', label: 'Publications', count: publications.length },
  { to: '/software', label: 'Software', count: projects.length },
  { to: '/posts', label: 'Posts', count: writing.length },
]

// Palette color per badge (cycles).
const BADGE_COLORS = ['#EF476F', '#06D6A0', '#FFD166', '#118AB2']

export default function Home() {
  return (
    <div className="home">
      <Seo title={profile.name} description={profile.summary} />
      <div className="home-text">
        <AnimatedName />
        <div className="home-badges">
          {profile.badges.map((b, i) => (
            <span
              key={b}
              className="home-badge"
              style={{ '--badge-color': BADGE_COLORS[i % BADGE_COLORS.length] } as CSSProperties}
            >
              {b}
            </span>
          ))}
        </div>
        <p className="home-summary">{profile.summary}</p>
        <div className="home-quick">
          {quickLinks.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="home-link"
              style={{ '--section-color': sectionColor[q.to] } as CSSProperties}
            >
              {q.label}{' '}
              <span className="home-link-count">{q.count}</span>
            </Link>
          ))}
          <a className="home-cv-btn" href={`${import.meta.env.BASE_URL}cv.pdf`} download="Nikita-Kolosov-CV.pdf">Download CV ↓</a>
        </div>
      </div>
      <div className="home-aside">
        <div className="home-portrait">
          <img src={`${import.meta.env.BASE_URL}portrait.jpg`} alt={profile.name} />
        </div>
        <div className="home-social">
          {profile.links.map((l) => (
            <a
              key={l.label}
              className="home-social-link"
              href={l.href}
              target="_blank"
              rel="noreferrer"
              aria-label={l.label}
              title={l.label}
            >
              <BrandIcon name={l.icon} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
