import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import { sectionColor } from '../data/sectionColors'
import { Seo } from '../components/Seo'
import { AnimatedName } from '../components/AnimatedName'
import { BrandIcon } from '../components/BrandIcon'
import './Home.css'

const quickLinks = [
  { to: '/publications', label: 'Publications' },
  { to: '/software', label: 'Software' },
  { to: '/posts', label: 'Posts' },
]

export default function Home() {
  return (
    <div className="home">
      <Seo title={profile.name} description={profile.summary} />
      <AnimatedName />
      <p className="home-role">
        {profile.role} <span>· {profile.affiliation}</span>
      </p>
      <p className="home-summary">{profile.summary}</p>
      <div className="home-quick">
        {quickLinks.map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="home-link"
            style={{ '--section-color': sectionColor[q.to] } as CSSProperties}
          >
            {q.label} →
          </Link>
        ))}
        <a className="home-cv-btn" href={`${import.meta.env.BASE_URL}cv.pdf`} download>Download CV ↓</a>
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
  )
}
