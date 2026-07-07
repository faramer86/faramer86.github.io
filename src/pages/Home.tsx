import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import { Seo } from '../components/Seo'
import { AnimatedName } from '../components/AnimatedName'
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
        <Link to="/posts">Posts →</Link>
        <Link to="/publications">Publications →</Link>
        <Link to="/software">Software →</Link>
        <a className="home-cv-btn" href={`${import.meta.env.BASE_URL}cv.pdf`} download>Download CV ↓</a>
      </div>
      <div className="home-social">
        {profile.links.map((l) => {
          const isExternal = !l.href.startsWith('mailto:') && !l.href.startsWith('tel:')
          return isExternal ? (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
          ) : (
            <a key={l.label} href={l.href}>{l.label}</a>
          )
        })}
      </div>
    </div>
  )
}
