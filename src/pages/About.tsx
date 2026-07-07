import aboutRaw from '../content/about.md?raw'
import { Prose } from '../components/Prose'
import { Seo } from '../components/Seo'

export default function About() {
  return (
    <article>
      <Seo title="About · Nikita Kolosov" />
      <h1>About</h1>
      <Prose>{aboutRaw}</Prose>
    </article>
  )
}
