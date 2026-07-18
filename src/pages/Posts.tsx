import { writing } from '../data/writing'
import { WritingCard } from '../components/WritingCard'
import { PageShell } from '../components/PageShell'
import { Seo } from '../components/Seo'
import './Posts.css'

export default function Posts() {
  const sorted = [...writing].sort((a, b) => (a.date < b.date ? 1 : -1))
  return (
    <PageShell>
      <Seo title="Posts · Nikita Kolosov" description="Writing on Medium and Substack." />
      <h1>Posts</h1>
      <p className="posts-intro">Notes and essays — published on Medium and Substack.</p>
      <ul style={{ padding: 0, margin: 0 }}>
        {sorted.map((w) => (
          <WritingCard key={w.url} post={w} />
        ))}
      </ul>
    </PageShell>
  )
}
