// Force a non-UTC timezone to prove the fix is timezone-robust.
// In a machine set to America/Los_Angeles (UTC-7/UTC-8), parsing '2026-05-01'
// as UTC midnight and rendering in local time would produce "Apr 30, 2026" without
// the timeZone: 'UTC' fix.
process.env.TZ = 'America/Los_Angeles'

import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats 2026-05-01 as "May 1, 2026" regardless of local timezone', () => {
    expect(formatDate('2026-05-01')).toBe('May 1, 2026')
  })

  it('formats 2026-04-12 as "Apr 12, 2026" regardless of local timezone', () => {
    expect(formatDate('2026-04-12')).toBe('Apr 12, 2026')
  })

  it('passes through invalid date strings unchanged', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })
})
