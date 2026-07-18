import { projects } from '../data/projects'
import { ProjectItem } from '../components/ProjectItem'
import { PageShell } from '../components/PageShell'
import { Seo } from '../components/Seo'

export default function Software() {
  const sorted = [...projects].sort((a, b) => b.year - a.year)
  return (
    <PageShell>
      <Seo title="Software · Nikita Kolosov" />
      <h1>Software</h1>
      <ul style={{ padding: 0, margin: 0 }}>
        {sorted.map((p) => (
          <ProjectItem key={p.name} project={p} />
        ))}
      </ul>
    </PageShell>
  )
}
