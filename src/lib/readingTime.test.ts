import { describe, it, expect } from 'vitest'
import { readingTime } from './readingTime'

describe('readingTime', () => {
  it('counts words', () => {
    expect(readingTime('one two three').words).toBe(3)
  })

  it('rounds up to at least 1 minute at 200 wpm', () => {
    expect(readingTime('a b c').minutes).toBe(1)
    const long = Array.from({ length: 401 }, () => 'word').join(' ')
    expect(readingTime(long).minutes).toBe(3)
  })

  it('strips markdown syntax from the count', () => {
    const md = '# Title\n\n`code` and [link](https://x.com) and **bold**'
    // words counted: Title, code, and, link, and, bold => 6
    expect(readingTime(md).words).toBe(6)
  })
})
