import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'

export default function NotFound() {
  return (
    <section>
      <Seo title="Not found · Nikita Kolosov" />
      <h1>404</h1>
      <p>That page doesn't exist.</p>
      <p><Link to="/">← Home</Link></p>
    </section>
  )
}
