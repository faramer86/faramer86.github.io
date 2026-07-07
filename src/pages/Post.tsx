import { Link, useParams } from 'react-router-dom'
import { getPost } from '../lib/posts'
import { formatDate } from '../lib/formatDate'
import { Prose } from '../components/Prose'
import { Seo } from '../components/Seo'
import './Post.css'

export default function Post() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined

  if (!post) {
    return (
      <section>
        <Seo title="Not found · Nikita Kolosov" />
        <h1>Post not found</h1>
        <p><Link to="/posts">← Back to posts</Link></p>
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
      <p className="post-back"><Link to="/posts">← Back to posts</Link></p>
    </article>
  )
}
