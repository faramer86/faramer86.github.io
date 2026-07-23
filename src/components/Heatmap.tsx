import { Fragment } from 'react'
import type { CSSProperties } from 'react'
import './Heatmap.css'

// A GitHub-contribution-style matrix: rows = years, columns = months. Each cell
// lights in the month of an entry, tinted with that entry's color; hover a cell
// for its label + date. Fully data-driven — shared by Publications and Software.
const MONTH_INITIALS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export type HeatmapEntry = {
  year: number
  month: number // 0-11
  color: string
  label: string // shown in the hover tooltip
}

export function Heatmap({ entries, ariaLabel }: { entries: HeatmapEntry[]; ariaLabel: string }) {
  const byYear = new Map<number, Map<number, HeatmapEntry>>()
  let minYear = Infinity
  let maxYear = -Infinity
  for (const e of entries) {
    if (!Number.isFinite(e.year) || !Number.isFinite(e.month)) continue
    minYear = Math.min(minYear, e.year)
    maxYear = Math.max(maxYear, e.year)
    if (!byYear.has(e.year)) byYear.set(e.year, new Map())
    byYear.get(e.year)!.set(e.month, e)
  }
  if (!Number.isFinite(minYear)) return null

  const years: number[] = []
  for (let y = maxYear; y >= minYear; y--) years.push(y) // newest first (top)

  return (
    <div className="heatmap" role="img" aria-label={ariaLabel}>
      <div className="heatmap-grid">
        <span className="heatmap-corner" aria-hidden="true" />
        {MONTH_INITIALS.map((m, i) => (
          <span key={`m${i}`} className="heatmap-mhead" aria-hidden="true">
            {m}
          </span>
        ))}
        {years.map((y) => (
          <Fragment key={y}>
            <span className="heatmap-year" aria-hidden="true">
              {y}
            </span>
            {Array.from({ length: 12 }, (_, m) => {
              const cell = byYear.get(y)?.get(m)
              return (
                <span
                  key={m}
                  className={cell ? 'heatmap-cell on' : 'heatmap-cell'}
                  style={cell ? ({ '--cell': cell.color } as CSSProperties) : undefined}
                  title={cell ? `${cell.label} · ${MONTH_NAMES[m]} ${y}` : undefined}
                />
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
