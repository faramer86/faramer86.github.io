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
    name: 'Adjutant',
    blurb:
      'A PLINK2-derived C/C++ tool for core polygenic score pre- and post-processing steps.',
    stack: ['C', 'C++', 'Claude Code'],
    year: 2026,
    date: '2026-08-03',
    repo: 'https://github.com/faramer86/adjutant',
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
  {
    name: 'PaperPulse',
    blurb:
      'A Telegram bot that tracks new scientific-journal articles and posts them to topic-specific channels.',
    stack: ['Python'],
    year: 2021,
    date: '2021-06-13',
    repo: 'https://github.com/faramer86/PaperPulse',
    channels: [
      { label: 'Nature', href: 'https://t.me/NatureMain', group: 'nature' },
      { label: 'Nature Genetics', href: 'https://t.me/NatureGenetics', group: 'nature' },
      { label: 'Nature Machine Intelligence', href: 'https://t.me/NatureMachineIntelligence', group: 'nature' },
      { label: 'Reviews · Life', href: 'https://t.me/NatureReviewsLife', group: 'reviews' },
      { label: 'Reviews · Clinical', href: 'https://t.me/NatureReviewsClinical', group: 'reviews' },
      { label: 'Reviews · Physical', href: 'https://t.me/NatureReviewsPhysical', group: 'reviews' },
    ],
  },
]
