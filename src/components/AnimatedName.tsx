import { profile } from '../data/profile'
import { useCaretPhase } from '../lib/useCaretPhase'
import './AnimatedName.css'

// Hover deletes everything after the first letter, right-to-left, until only
// the first initial + the dot remain (e.g. "Nikita Kolosov." -> "N."). The dot
// rides the frontier and blinks like a terminal caret.
const FIRST = profile.name.charAt(0)
const REST = profile.name.slice(1)
const MAX_PHASE = REST.length

export function AnimatedName() {
  const { phase, onEnter, onLeave } = useCaretPhase(MAX_PHASE)

  return (
    <h1 className="home-name" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <span className="home-name-first">{FIRST}</span>
      {REST.split('').map((ch, i) => {
        // rightmost letter has deleteRank 0, so it's eaten first
        const deleteRank = REST.length - 1 - i
        const gone = phase > deleteRank
        return (
          <span key={i} className="home-letter" data-gone={gone ? '' : undefined}>
            {ch}
          </span>
        )
      })}
      <span className="home-dot" aria-hidden="true">.</span>
    </h1>
  )
}
