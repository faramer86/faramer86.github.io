import { Link } from 'react-router-dom'
import type { PostMeta } from '../types'
import { formatDate } from '../lib/formatDate'
import './PostCard.css'

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <li className="post-card">
      <h2 className="post-card-title">
        <Link to={`/writing/${post.slug}`}>{post.title}</Link>
      </h2>
      <div className="post-card-meta">
        {formatDate(post.date)} · {post.readingMinutes} min read
      </div>
      <p className="post-card-summary">{post.summary}</p>
    </li>
  )
}
