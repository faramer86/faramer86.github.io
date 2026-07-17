// The hero name's hover deletion animations. Each hover advances to the next
// one, so repeated hovers cycle bounce -> lightning -> glitch -> bounce ...
// CSS-driven styles name a `keyframes` (defined in AnimatedName.css). The
// glitch style is driven imperatively (character scramble) in AnimatedName.
export interface DeleteStyle {
  key: string
  dur: number // ms, per-letter animation length (collapse length for glitch)
  step: number // ms between successive letters
  keyframes?: string // CSS-driven styles only
  ease?: string
  glitch?: boolean // JS scramble instead of a CSS keyframe
}

export const DELETE_STYLES: DeleteStyle[] = [
  { key: 'bounce', keyframes: 'nk-bounceAway', dur: 480, step: 95, ease: 'cubic-bezier(.34,1.56,.64,1)' },
  { key: 'lightning', keyframes: 'nk-zapAway', dur: 200, step: 38, ease: 'ease-out' },
  { key: 'glitch', glitch: true, dur: 120, step: 62 },
]

export function nextStyleIndex(prev: number): number {
  return (prev + 1) % DELETE_STYLES.length
}
