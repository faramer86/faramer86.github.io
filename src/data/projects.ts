import type { Project } from '../types'

export const projects: Project[] = [
  {
    name: 'PGS Browser',
    blurb:
      'A tool for personalized polygenic score analysis and interpretation. Available as a public web platform, a command-line tool, and integrated into the internal FinnGen Sandbox computing environment.',
    stack: ['Python', 'Docker', 'bash', 'scikit-survival'],
    year: 2026,
    date: '2026-06-20',
    repo: 'https://github.com/faramer86/PGS_Browser',
    url: 'https://pgs.nchigm.org',
  },
  {
    name: 'Russian Biobank PheWeb',
    blurb:
      'An interactive PheWeb browser of genome-wide association results for a Russian population biobank (Almazov Centre, St. Petersburg).',
    stack: ['Python', 'Flask'],
    year: 2024,
    date: '2024-07-23',
    repo: 'https://github.com/ArtomovLab/RusBB_pheweb',
    url: 'https://biobank.almazovcentre.ru/#',
  },
  {
    name: 'GPrior',
    blurb:
      'Gene-prioritization tool that uses positive-unlabeled (PU) learning to rank candidate disease genes from GWAS.',
    stack: ['Python', 'scikit-learn'],
    year: 2021,
    date: '2021-07-19',
    repo: 'https://github.com/faramer86/GPrior',
  },
]
