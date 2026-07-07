import type { Post } from '../types'
import { parseFrontmatter } from './frontmatter'
import { readingTime } from './readingTime'

const modules = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function toSlug(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '')
}

function build(): Post[] {
  const posts: Post[] = []
  for (const [path, raw] of Object.entries(modules)) {
    const { data, content } = parseFrontmatter(raw)
    if (data.draft === true) continue
    posts.push({
      slug: toSlug(path),
      title: String(data.title ?? toSlug(path)),
      date: String(data.date ?? ''),
      summary: String(data.summary ?? ''),
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      draft: false,
      readingMinutes: readingTime(content).minutes,
      content,
    })
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export const allPosts: Post[] = build()

export function getPost(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug)
}
