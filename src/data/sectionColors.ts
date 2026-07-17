// One accent color per section, used for hover states in BOTH the top nav and
// the home quick-link buttons (keyed by route so the two always match).
export const sectionColor: Record<string, string> = {
  // Home shares the brand blue with the name dot and the Download CV button.
  '/': 'var(--accent)',
  '/publications': '#FFD166',
  '/software': '#06D6A0',
  // Posts uses the red that Home used to have.
  '/posts': '#EF476F',
}
