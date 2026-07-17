import { describe, it, expect } from 'vitest'
import { DELETE_STYLES, nextStyleIndex } from './deleteStyles'

describe('delete styles', () => {
  it('lists the three styles in cycle order', () => {
    expect(DELETE_STYLES.map((s) => s.key)).toEqual(['bounce', 'lightning', 'erase'])
  })

  it('every style names a keyframes animation and has positive timing', () => {
    for (const s of DELETE_STYLES) {
      expect(s.keyframes).toMatch(/^nk-/)
      expect(s.dur).toBeGreaterThan(0)
      expect(s.step).toBeGreaterThan(0)
    }
  })

  it('cycles the index and wraps around', () => {
    expect(nextStyleIndex(0)).toBe(1)
    expect(nextStyleIndex(1)).toBe(2)
    expect(nextStyleIndex(2)).toBe(0)
  })
})
