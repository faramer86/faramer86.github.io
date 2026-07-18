import type { Project } from '../types'

export const projects: Project[] = [
  {
    name: 'PGS Browser',
    blurb:
      'A public web platform for personalized polygenic score analysis and interpretation, benchmarked across ancestries in FinnGen.',
    stack: ['Python', 'Docker', 'bash', 'scikit-survival'],
    year: 2026,
    repo: 'https://github.com/faramer86/PGS_Browser',
    url: 'https://pgs.nchigm.org',
  },
  {
    name: 'GPrior',
    blurb:
      'Gene-prioritization tool that uses positive-unlabeled (PU) learning to rank candidate disease genes from GWAS.',
    stack: ['Python', 'scikit-learn'],
    year: 2021,
    repo: 'https://github.com/faramer86/GPrior',
  },
]
