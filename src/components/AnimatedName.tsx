import { useEffect, useRef } from 'react'
import { profile } from '../data/profile'
import { DELETE_STYLES, nextStyleIndex } from '../lib/deleteStyles'
import './AnimatedName.css'

// Hover deletes everything after the first letter, right-to-left, until only the
// initial + dot remain ("Nikita Kolosov." -> "N."), then retypes on mouse-leave.
// Each hover advances to the next deletion style, so repeated hovers cycle
// bounce -> lightning -> glitch -> ...
const FIRST = profile.name.charAt(0)
const REST = profile.name.slice(1)
const GLITCH_CHARS = '01<>/\\{}[]#$%&*+=~^:;'

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function AnimatedName() {
  const ref = useRef<HTMLHeadingElement>(null)
  const styleIdx = useRef(0) // style the NEXT hover will use
  const timers = useRef<number[]>([])
  const intervals = useRef<number[]>([])

  const clearAll = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    intervals.current.forEach(clearInterval)
    intervals.current = []
  }
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  const letters = () =>
    Array.from(ref.current?.querySelectorAll<HTMLElement>('.home-letter') ?? [])

  useEffect(() => clearAll, [])

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

  const onEnter = () => {
    if (prefersReducedMotion()) return
    clearAll()
    const style = DELETE_STYLES[styleIdx.current]
    styleIdx.current = nextStyleIndex(styleIdx.current)

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

  const onLeave = () => {
    if (prefersReducedMotion()) return
    clearAll()
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
      }, k * 40)
    })
  }

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
