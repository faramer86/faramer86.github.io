import { publications } from '../data/publications'
import { PublicationItem } from '../components/PublicationItem'
import { PageShell } from '../components/PageShell'
import { Heatmap, type HeatmapEntry } from '../components/Heatmap'
import { venueColor } from '../data/venueColors'
import { Seo } from '../components/Seo'

export default function Publications() {
  const sorted = [...publications].sort((a, b) => (a.date < b.date ? 1 : -1))
  const entries: HeatmapEntry[] = publications.map((p) => ({
    year: Number(p.date.slice(0, 4)),
    month: Number(p.date.slice(5, 7)) - 1,
    color: venueColor[p.venue] ?? 'var(--accent)',
    label: p.venue,
  }))
  return (
    <PageShell>
      <Seo title="Publications · Nikita Kolosov" />
      <div className="page-header">
        <h1>Publications</h1>
        <Heatmap entries={entries} ariaLabel="Publications by month, colored by journal" />
      </div>
      <ul style={{ padding: 0, margin: 0 }}>
        {sorted.map((pub) => (
          <PublicationItem key={pub.title} pub={pub} />
        ))}
      </ul>
    </PageShell>
  )
}
