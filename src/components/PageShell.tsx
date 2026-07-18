import type { ReactNode } from 'react'
import './PageShell.css'

// Wraps inner-page content in a solid card that floats on the dotted page.
export function PageShell({ children }: { children: ReactNode }) {
  return <div className="page-box">{children}</div>
}
