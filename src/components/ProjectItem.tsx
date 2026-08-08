import type { CSSProperties } from 'react'
import type { Channel, Project } from '../types'
import { BrandIcon } from './BrandIcon'
import './ProjectItem.css'

// Group consecutive channels that share a `group` so each group renders on its
// own row (e.g. Nature channels on one line, Reviews on the next).
function channelRows(channels: Channel[]): Channel[][] {
  const rows: Channel[][] = []
  for (const ch of channels) {
    const last = rows[rows.length - 1]
    if (last && last[0].group === ch.group) last.push(ch)
    else rows.push([ch])
  }
  return rows
}

export function ProjectItem({ project }: { project: Project }) {
  return (
    <li className="proj">
      <div className="proj-head">
        <h2 className="proj-name">{project.name}</h2>
        <span className="proj-year">{project.year}</span>
      </div>
      <p className="proj-blurb">{project.blurb}</p>
      <div className="proj-stack">
        {project.stack.map((s) => (
          <span key={s} className="proj-tag">{s}</span>
        ))}
      </div>
      {(project.repo || project.url) && (
        <div className="proj-links">
          {project.repo && <a href={project.repo} target="_blank" rel="noreferrer">Repo</a>}
          {project.url && <a href={project.url} target="_blank" rel="noreferrer">Link</a>}
        </div>
      )}
      {project.channels && project.channels.length > 0 && (
        <div className="proj-channels">
          <div className="proj-channels-label">Channels</div>
          {channelRows(project.channels).map((row, i) => (
            <div key={i} className="proj-channels-row">
              {row.map((ch) => (
                <a
                  key={ch.href}
                  className="proj-channel"
                  href={ch.href}
                  target="_blank"
                  rel="noreferrer"
                  style={ch.color ? ({ '--ch-color': ch.color } as CSSProperties) : undefined}
                >
                  <BrandIcon name="telegram" />
                  {ch.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </li>
  )
}
