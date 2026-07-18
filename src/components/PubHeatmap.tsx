import { Fragment } from 'react'
import type { CSSProperties } from 'react'
import { publications } from '../data/publications'
import { venueColor } from '../data/venueColors'
import './PubHeatmap.css'

// GitHub-contribution-style matrix: rows = years, columns = months. Each cell
// lights in the month a paper was published, tinted with that journal's color
// (same palette as the venue badges). Everything is derived from `publications`.
const MONTH_INITIALS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

type Cell = { color: string; venue: string }

export function PubHeatmap() {
  const byYear = new Map<number, Map<number, Cell>>()
  let minYear = Infinity
  let maxYear = -Infinity
  for (const p of publications) {
    const year = Number(p.date.slice(0, 4))
    const month = Number(p.date.slice(5, 7)) - 1
    if (Number.isNaN(year) || Number.isNaN(month)) continue
    minYear = Math.min(minYear, year)
    maxYear = Math.max(maxYear, year)
    if (!byYear.has(year)) byYear.set(year, new Map())
    byYear.get(year)!.set(month, { color: venueColor[p.venue] ?? 'var(--accent)', venue: p.venue })
  }
  if (!Number.isFinite(minYear)) return null

  const years: number[] = []
  for (let y = maxYear; y >= minYear; y--) years.push(y) // newest first (top), matching the list

  return (
    <div className="pub-heatmap" role="img" aria-label={`Publications by month, ${minYear} to ${maxYear}`}>
      <div className="pub-heatmap-grid">
        <span className="pub-heatmap-corner" aria-hidden="true" />
        {MONTH_INITIALS.map((m, i) => (
          <span key={`m${i}`} className="pub-heatmap-mhead" aria-hidden="true">
            {m}
          </span>
        ))}
        {years.map((y) => (
          <Fragment key={y}>
            <span className="pub-heatmap-year" aria-hidden="true">
              {y}
            </span>
            {Array.from({ length: 12 }, (_, m) => {
              const cell = byYear.get(y)?.get(m)
              return (
                <span
                  key={m}
                  className={cell ? 'pub-heatmap-cell on' : 'pub-heatmap-cell'}
                  style={cell ? ({ '--cell': cell.color } as CSSProperties) : undefined}
                  title={cell ? `${cell.venue} · ${MONTH_NAMES[m]} ${y}` : undefined}
                />
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
