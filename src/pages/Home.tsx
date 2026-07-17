import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import { Seo } from '../components/Seo'
import { AnimatedName } from '../components/AnimatedName'
import { BrandIcon } from '../components/BrandIcon'
import './Home.css'

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
        <Link to="/publications">Publications →</Link>
        <Link to="/software">Software →</Link>
        <Link to="/posts">Posts →</Link>
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
