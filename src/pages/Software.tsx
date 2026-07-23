import { projects } from '../data/projects'
import { ProjectItem } from '../components/ProjectItem'
import { PageShell } from '../components/PageShell'
import { Heatmap, type HeatmapEntry } from '../components/Heatmap'
import { sectionColor } from '../data/sectionColors'
import { Seo } from '../components/Seo'

export default function Software() {
  const sorted = [...projects].sort((a, b) => b.year - a.year)
  const entries: HeatmapEntry[] = projects.flatMap((p) => {
    if (!p.date) return []
    return [
      {
        year: Number(p.date.slice(0, 4)),
        month: Number(p.date.slice(5, 7)) - 1,
        color: sectionColor['/software'],
        label: p.name,
      },
    ]
  })
  return (
    <PageShell>
      <Seo title="Software · Nikita Kolosov" />
      <div className="page-header">
        <h1>Software</h1>
        <Heatmap entries={entries} ariaLabel="Projects by month" />
      </div>
      <ul style={{ padding: 0, margin: 0 }}>
        {sorted.map((p) => (
          <ProjectItem key={p.name} project={p} />
        ))}
      </ul>
    </PageShell>
  )
}
