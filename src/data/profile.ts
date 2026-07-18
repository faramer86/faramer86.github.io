import type { Profile } from '../types'

export const profile: Profile = {
  name: 'Nikita Kolosov',
  initials: 'NK',
  role: 'PhD candidate',
  affiliation: 'Clinical Genomics & Biomedical Informatics',
  summary:
    'I build computational methods for interpreting rare-disease variants — turning genomic signal into clinical answers.',
  badges: ['PhD candidate', 'Biomedical Informatics', 'Machine Learning'],
  links: [
    { label: 'GitHub', href: 'https://github.com/faramer86', icon: 'github' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=5erZl3wAAAAJ&hl=en', icon: 'scholar' },
    { label: 'ORCID', href: 'https://orcid.org/0000-0002-2139-6775', icon: 'orcid' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nikolosov', icon: 'linkedin' },
    { label: 'ResearchGate', href: 'https://www.researchgate.net/profile/Nikita-Kolosov', icon: 'researchgate' },
  ],
}
