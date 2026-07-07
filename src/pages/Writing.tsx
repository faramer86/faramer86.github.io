import { allPosts } from '../lib/posts'
import { PostCard } from '../components/PostCard'
import { Seo } from '../components/Seo'

export default function Writing() {
  return (
    <section>
      <Seo title="Writing · Nikita Kolosov" description="Notes on clinical genomics and biomedical informatics." />
      <h1>Writing</h1>
      <ul style={{ padding: 0, margin: 0 }}>
        {allPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>
    </section>
  )
}
