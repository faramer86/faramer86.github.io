import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import { Seo } from '../components/Seo'
import { AnimatedName } from '../components/AnimatedName'
import './Home.css'

// Contact links live once, in the global Footer (shown on every page), so the
// home hero doesn't duplicate them.

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
    </div>
  )
}
