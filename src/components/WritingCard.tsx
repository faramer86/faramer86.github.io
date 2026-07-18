import type { WritingLink } from '../types'
import { formatDate } from '../lib/formatDate'
import './WritingCard.css'

// A card that links out to an external article (Medium / Substack).
export function WritingCard({ post }: { post: WritingLink }) {
  return (
    <li className="writing-card">
      <a className="writing-card-link" href={post.url} target="_blank" rel="noreferrer">
        <div className="writing-card-head">
          <h2 className="writing-card-title">{post.title}</h2>
          <span className="writing-card-arrow" aria-hidden="true">↗</span>
        </div>
        <div className="writing-card-meta">
          <span className="writing-card-platform">{post.platform}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(post.date)}</span>
        </div>
        {post.summary ? <p className="writing-card-summary">{post.summary}</p> : null}
      </a>
    </li>
  )
}
