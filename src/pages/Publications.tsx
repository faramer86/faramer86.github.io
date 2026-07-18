import { publications } from '../data/publications'
import { PublicationItem } from '../components/PublicationItem'
import { PageShell } from '../components/PageShell'
import { PubHeatmap } from '../components/PubHeatmap'
import { Seo } from '../components/Seo'

export default function Publications() {
  const sorted = [...publications].sort((a, b) => (a.date < b.date ? 1 : -1))
  return (
    <PageShell>
      <Seo title="Publications · Nikita Kolosov" />
      <div className="pub-header">
        <h1>Publications</h1>
        <PubHeatmap />
      </div>
      <ul style={{ padding: 0, margin: 0 }}>
        {sorted.map((pub) => (
          <PublicationItem key={pub.title} pub={pub} />
        ))}
      </ul>
    </PageShell>
  )
}
