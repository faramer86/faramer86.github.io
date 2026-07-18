import type { Profile } from '../types'

export const profile: Profile = {
  name: 'Nikita Kolosov',
  initials: 'NK',
  role: 'PhD candidate',
  affiliation: 'Clinical Genomics & Biomedical Informatics',
  summary:
    'I build computational methods for interpreting rare-disease variants — turning genomic signal into clinical answers.',
  badges: ['PhD candidate', 'Biomedical Informatics', 'Machine Learning'],
  // Replace the placeholder profile URLs below with your real profiles.
  links: [
    { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/', icon: 'scholar' },
    { label: 'ORCID', href: 'https://orcid.org/', icon: 'orcid' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
    { label: 'ResearchGate', href: 'https://www.researchgate.net/', icon: 'researchgate' },
  ],
}
