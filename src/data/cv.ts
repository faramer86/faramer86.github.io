import type { CvSection } from '../types'

export const cvPdf: string | null = null // set to '/cv.pdf' once public/cv.pdf exists

export const cv: CvSection[] = [
  {
    heading: 'Education',
    entries: [
      { when: '2023–', what: 'PhD, Clinical Genomics & Biomedical Informatics', where: '[Institution]' },
    ],
  },
  {
    heading: 'Positions',
    entries: [
      { when: '2023–', what: 'Graduate Researcher', where: '[Lab / Institution]' },
    ],
  },
  {
    heading: 'Awards',
    entries: [{ when: '2024', what: '[Award name]' }],
  },
]
