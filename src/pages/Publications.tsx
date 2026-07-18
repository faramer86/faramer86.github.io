import { publications } from '../data/publications'
import { PublicationItem } from '../components/PublicationItem'
import { PageShell } from '../components/PageShell'
import { Seo } from '../components/Seo'

export default function Publications() {
  const sorted = [...publications].sort((a, b) => b.year - a.year)
  return (
    <PageShell>
      <Seo title="Publications · Nikita Kolosov" />
      <h1>Publications</h1>
      <ul style={{ padding: 0, margin: 0 }}>
        {sorted.map((pub) => (
          <PublicationItem key={pub.title} pub={pub} />
        ))}
      </ul>
    </PageShell>
  )
}
