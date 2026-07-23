import { writing } from '../data/writing'
import { WritingCard } from '../components/WritingCard'
import { PageShell } from '../components/PageShell'
import { Heatmap, type HeatmapEntry } from '../components/Heatmap'
import { sectionColor } from '../data/sectionColors'
import { Seo } from '../components/Seo'
import './Posts.css'

export default function Posts() {
  const sorted = [...writing].sort((a, b) => (a.date < b.date ? 1 : -1))
  const entries: HeatmapEntry[] = writing.map((w) => ({
    year: Number(w.date.slice(0, 4)),
    month: Number(w.date.slice(5, 7)) - 1,
    color: sectionColor['/posts'],
    label: w.title,
  }))
  return (
    <PageShell>
      <Seo title="Posts · Nikita Kolosov" description="Writing on Medium and Substack." />
      <div className="page-header">
        <h1>Posts</h1>
        <Heatmap entries={entries} ariaLabel="Posts by month" />
      </div>
      <p className="posts-intro">Notes and essays — published on Medium and Substack.</p>
      <ul style={{ padding: 0, margin: 0 }}>
        {sorted.map((w) => (
          <WritingCard key={w.url} post={w} />
        ))}
      </ul>
    </PageShell>
  )
}
