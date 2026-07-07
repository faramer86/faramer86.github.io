import type { Publication } from '../types'
import './PublicationItem.css'

function Authors({ authors }: { authors: string }) {
  // render **bold** segments as <strong> (author's own name)
  const parts = authors.split(/(\*\*[^*]+\*\*)/g)
  return (
    <span className="pub-authors">
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </span>
  )
}

export function PublicationItem({ pub }: { pub: Publication }) {
  const links: Array<[string, string | undefined]> = [
    ['DOI', pub.doi],
    ['PDF', pub.pdf],
    ['Code', pub.code],
    ['Link', pub.url],
  ]
  return (
    <li className="pub">
      <div className="pub-year">{pub.year}</div>
      <div className="pub-body">
        <h3 className="pub-title">{pub.title}</h3>
        <Authors authors={pub.authors} />
        <div className="pub-venue">{pub.venue}</div>
        <div className="pub-links">
          {links
            .filter(([, href]) => href)
            .map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>
            ))}
        </div>
      </div>
    </li>
  )
}
