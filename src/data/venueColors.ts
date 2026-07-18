// Accent color per journal, used for the colored venue badge on Publications
// (same badge treatment as the platform badge on Posts). Keyed by the exact
// `venue` string in publications.ts. Unmapped venues fall back to --accent.
export const venueColor: Record<string, string> = {
  'Nat Commun': '#E07B2E', // Nature Communications — orange
  'Nat Genet': '#2B8A3E', // Nature Genetics — green
  'Am J Hum Genet': '#6AB023', // Am J Hum Genet (AJHG) — light green
  'PLOS ONE': '#EF476F', // PLOS ONE — pink
  'Eur J Hum Genet': '#118AB2', // Eur J Hum Genet (EJHG) — blue
}
