import { useEffect, useRef } from 'react'
import { profile } from '../data/profile'
import { DELETE_STYLES, nextStyleIndex, type DeleteStyle } from '../lib/deleteStyles'
import './AnimatedName.css'

// Hover deletes everything after the first letter, right-to-left, until only the
// initial + dot remain ("Nikita Kolosov." -> "N."), then retypes on mouse-leave.
// Each hover advances to the next deletion style, so repeated hovers cycle
// bounce -> lightning -> glitch -> ...
// The same erase→retype also plays once on load (see the intro effect) so the
// interaction is discoverable on touch devices (no hover) and to first-time
// desktop visitors who wouldn't otherwise know to hover.
const FIRST = profile.name.charAt(0)
const REST = profile.name.slice(1)
const GLITCH_CHARS = '01<>/\\{}[]#$%&*+=~^:;'

// The one-time intro uses a snappier bounce than the (slower) hover default.
const INTRO_STYLE: DeleteStyle = {
  key: 'intro',
  keyframes: 'nk-bounceAway',
  dur: 380,
  step: 46,
  ease: 'cubic-bezier(.34,1.56,.64,1)',
}
const INTRO_DELAY = 700 // ms — let the full name register before it animates
const INTRO_FLAG = 'nk-intro-played' // sessionStorage: play once per tab session

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

// Read/write the session flag defensively — sessionStorage can throw (private
// mode, disabled storage). On any failure, fall through and just play the intro.
function introAlreadyPlayed(): boolean {
  try {
    return window.sessionStorage.getItem(INTRO_FLAG) === '1'
  } catch {
    return false
  }
}
function markIntroPlayed(): void {
  try {
    window.sessionStorage.setItem(INTRO_FLAG, '1')
  } catch {
    /* ignore */
  }
}

export function AnimatedName() {
  const ref = useRef<HTMLHeadingElement>(null)
  const styleIdx = useRef(0) // style the NEXT hover will use
  const timers = useRef<number[]>([])
  const intervals = useRef<number[]>([])
  const introTimers = useRef<number[]>([])
  const introScheduled = useRef(false) // guards against StrictMode double-schedule

  const clearAll = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    intervals.current.forEach(clearInterval)
    intervals.current = []
  }
  const clearIntro = () => {
    introTimers.current.forEach(clearTimeout)
    introTimers.current = []
  }
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  const letters = () =>
    Array.from(ref.current?.querySelectorAll<HTMLElement>('.home-letter') ?? [])

  // Scramble one letter through random glyphs, then collapse it away.
  const glitchLetter = (el: HTMLElement) => {
    const orig = el.dataset.char ?? el.textContent ?? ''
    if (orig === ' ') {
      el.style.animation = 'nk-eraseAway 100ms ease forwards'
      return
    }
    let n = 0
    const iv = window.setInterval(() => {
      el.textContent = GLITCH_CHARS[(Math.random() * GLITCH_CHARS.length) | 0]
      el.style.color = n % 2 ? '#5b9dff' : '#eaf3ff'
      el.style.transform = `translateY(${(Math.random() * 4 - 2) | 0}px) skewX(${(Math.random() * 14 - 7) | 0}deg)`
      if (++n > 6) {
        clearInterval(iv)
        el.style.color = ''
        el.style.transform = ''
        el.textContent = orig
        el.style.animation = 'nk-eraseAway 120ms ease forwards'
      }
    }, 34)
    intervals.current.push(iv)
  }

  // Erase every letter after the first, right-to-left, with the given style.
  const erase = (style: DeleteStyle) => {
    const rightToLeft = letters().reverse()
    let i = 0
    const tick = () => {
      if (i >= rightToLeft.length) return
      const el = rightToLeft[i]
      el.dataset.gone = '1'
      if (style.glitch) {
        glitchLetter(el)
      } else {
        el.style.animation = `${style.keyframes} ${style.dur}ms ${style.ease ?? 'ease'} forwards`
      }
      i += 1
      later(tick, style.step)
    }
    tick()
  }

  // Retype the erased letters left-to-right.
  const retype = (stagger = 40) => {
    letters().forEach((el, k) => {
      if (el.dataset.gone !== '1') return
      later(() => {
        el.style.color = ''
        el.style.transform = ''
        if (el.dataset.char !== undefined) el.textContent = el.dataset.char
        el.style.animation = 'nk-appearIn .26s ease'
        el.addEventListener(
          'animationend',
          () => {
            el.style.animation = ''
            delete el.dataset.gone
          },
          { once: true },
        )
      }, k * stagger)
    })
  }

  const onEnter = () => {
    if (prefersReducedMotion()) return
    clearIntro()
    clearAll()
    const style = DELETE_STYLES[styleIdx.current]
    styleIdx.current = nextStyleIndex(styleIdx.current)
    erase(style)
  }

  const onLeave = () => {
    if (prefersReducedMotion()) return
    clearIntro()
    clearAll()
    retype()
  }

  // One-time intro: after a beat, play the signature erase→retype so the
  // interaction is discoverable. Skipped for reduced-motion and after the first
  // play in a session; cancelled the moment the visitor hovers.
  useEffect(() => {
    if (prefersReducedMotion() || introScheduled.current || introAlreadyPlayed()) return
    introScheduled.current = true
    markIntroPlayed()
    const eraseMs = (REST.length - 1) * INTRO_STYLE.step + INTRO_STYLE.dur + 80
    // The intro timers are intentionally NOT cancelled on cleanup: their
    // callbacks are safe no-ops once the node is gone (letters() -> []). This
    // lets the one-shot intro survive StrictMode's dev-only unmount/remount,
    // which would otherwise cancel the pending timer during the interim cleanup.
    introTimers.current.push(
      window.setTimeout(() => {
        styleIdx.current = nextStyleIndex(0) // first hover continues the cycle
        clearAll()
        erase(INTRO_STYLE)
        introTimers.current.push(window.setTimeout(() => retype(32), eraseMs))
      }, INTRO_DELAY),
    )
    return () => {
      clearAll()
    }
  }, [])

  return (
    <h1 className="home-name" ref={ref} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <span className="home-name-first">{FIRST}</span>
      {REST.split('').map((ch, i) => (
        <span key={i} className="home-letter" data-char={ch}>
          {ch}
        </span>
      ))}
      <span className="home-dot" aria-hidden="true">.</span>
    </h1>
  )
}
