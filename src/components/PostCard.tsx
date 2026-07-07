import { Link } from 'react-router-dom'
import type { PostMeta } from '../types'
import './PostCard.css'

function formatDate(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <li className="post-card">
      <h3 className="post-card-title">
        <Link to={`/writing/${post.slug}`}>{post.title}</Link>
      </h3>
      <div className="post-card-meta">
        {formatDate(post.date)} · {post.readingMinutes} min read
      </div>
      <p className="post-card-summary">{post.summary}</p>
    </li>
  )
}
