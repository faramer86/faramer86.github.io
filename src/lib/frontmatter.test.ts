import { describe, it, expect } from 'vitest'
import { parseFrontmatter } from './frontmatter'

describe('parseFrontmatter', () => {
  it('splits frontmatter data from body content', () => {
    const raw = `---\ntitle: Hello World\ndraft: false\n---\nBody text here.`
    const { data, content } = parseFrontmatter(raw)
    expect(data.title).toBe('Hello World')
    expect(data.draft).toBe(false)
    expect(content.trim()).toBe('Body text here.')
  })

  it('parses booleans, numbers, and quoted strings', () => {
    const raw = `---\ndraft: true\nyear: 2026\nsummary: "A: colon inside"\n---\nx`
    const { data } = parseFrontmatter(raw)
    expect(data.draft).toBe(true)
    expect(data.year).toBe(2026)
    expect(data.summary).toBe('A: colon inside')
  })

  it('parses inline arrays into string arrays', () => {
    const raw = `---\ntags: [genomics, statistics]\n---\nx`
    const { data } = parseFrontmatter(raw)
    expect(data.tags).toEqual(['genomics', 'statistics'])
  })

  it('returns empty data when no frontmatter block is present', () => {
    const { data, content } = parseFrontmatter('Just body, no frontmatter.')
    expect(data).toEqual({})
    expect(content).toBe('Just body, no frontmatter.')
  })
})
