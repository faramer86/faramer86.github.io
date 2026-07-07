import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import { Seo } from '../components/Seo'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <Seo title={profile.name} description={profile.summary} />
      <h1 className="home-name">{profile.name}<span className="home-dot">.</span></h1>
      <p className="home-role">
        {profile.role} <span>· {profile.affiliation}</span>
      </p>
      <p className="home-summary">{profile.summary}</p>
      <div className="home-quick">
        <Link to="/writing">Writing →</Link>
        <Link to="/publications">Publications →</Link>
        <Link to="/software">Software →</Link>
      </div>
    </div>
  )
}
