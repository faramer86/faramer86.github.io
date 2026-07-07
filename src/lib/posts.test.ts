import { describe, it, expect } from 'vitest'
import { allPosts, getPost } from './posts'

describe('posts index', () => {
  it('returns published posts sorted by date descending', () => {
    expect(allPosts.length).toBeGreaterThanOrEqual(2)
    const dates = allPosts.map((p) => p.date)
    const sorted = [...dates].sort((a, b) => (a < b ? 1 : -1))
    expect(dates).toEqual(sorted)
  })

  it('excludes drafts', () => {
    expect(allPosts.every((p) => p.draft === false)).toBe(true)
  })

  it('derives slug and reading time', () => {
    const post = getPost('welcome')
    expect(post).toBeDefined()
    expect(post!.slug).toBe('welcome')
    expect(post!.readingMinutes).toBeGreaterThanOrEqual(1)
    expect(post!.content).toContain('clinical genomics')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getPost('does-not-exist')).toBeUndefined()
  })
})
