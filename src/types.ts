// An external article (Medium / Substack) linked from the Posts page.
export interface WritingLink {
  title: string
  platform: string      // e.g. 'Medium' | 'Substack'
  url: string
  date: string          // ISO 'YYYY-MM-DD'
  summary?: string
}

export interface Publication {
  title: string
  authors: string       // full author string; own name wrapped in **bold** is fine
  venue: string
  year: number
  date: string          // ISO 'YYYY-MM-DD', used for sorting
  doi?: string
  url?: string
  pdf?: string
  code?: string
  tags?: string[]
}

export interface Project {
  name: string
  blurb: string
  stack: string[]
  year: number
  repo?: string
  url?: string
}

export interface ProfileLink {
  label: string
  href: string
  icon: string
}

export interface Profile {
  name: string
  initials: string
  role: string
  affiliation: string
  summary: string
  badges: string[]
  links: ProfileLink[]
}
