import { Link, useParams } from 'react-router-dom'
import { getPost } from '../lib/posts'
import { Prose } from '../components/Prose'
import { Seo } from '../components/Seo'
import './Post.css'

function formatDate(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function Post() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined

  if (!post) {
    return (
      <section>
        <Seo title="Not found · Nikita Kolosov" />
        <h1>Post not found</h1>
        <p><Link to="/writing">← Back to writing</Link></p>
      </section>
    )
  }

  return (
    <article className="post">
      <Seo title={`${post.title} · Nikita Kolosov`} description={post.summary} />
      <h1 className="post-title">{post.title}</h1>
      <div className="post-meta">
        {formatDate(post.date)} · {post.readingMinutes} min read
      </div>
      <Prose>{post.content}</Prose>
      <p className="post-back"><Link to="/writing">← Back to writing</Link></p>
    </article>
  )
}
