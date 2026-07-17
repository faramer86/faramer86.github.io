// The hero name's hover deletion animations. Each hover advances to the next
// one, so repeated hovers cycle bounce -> lightning -> erase -> bounce ...
// `keyframes` names are defined in AnimatedName.css.
export interface DeleteStyle {
  key: string
  keyframes: string
  dur: number // ms, per-letter animation length
  step: number // ms between successive letters
  ease: string
}

export const DELETE_STYLES: DeleteStyle[] = [
  { key: 'bounce', keyframes: 'nk-bounceAway', dur: 480, step: 95, ease: 'cubic-bezier(.34,1.56,.64,1)' },
  { key: 'lightning', keyframes: 'nk-zapAway', dur: 200, step: 38, ease: 'ease-out' },
  { key: 'erase', keyframes: 'nk-eraseAway', dur: 150, step: 55, ease: 'ease' },
]

export function nextStyleIndex(prev: number): number {
  return (prev + 1) % DELETE_STYLES.length
}
