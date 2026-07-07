import type { Project } from '../types'
import './ProjectItem.css'

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
    </li>
  )
}
