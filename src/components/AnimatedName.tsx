import { useEffect, useRef } from 'react'
import { profile } from '../data/profile'
import { DELETE_STYLES, nextStyleIndex } from '../lib/deleteStyles'
import './AnimatedName.css'

// Hover deletes everything after the first letter, right-to-left, until only the
// initial + dot remain ("Nikita Kolosov." -> "N."), then retypes on mouse-leave.
// Each hover advances to the next deletion style, so repeated hovers cycle
// bounce -> lightning -> erase -> ...
const FIRST = profile.name.charAt(0)
const REST = profile.name.slice(1)

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

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  const letters = () =>
    Array.from(ref.current?.querySelectorAll<HTMLElement>('.home-letter') ?? [])

  useEffect(() => clearTimers, [])

  const onEnter = () => {
    if (prefersReducedMotion()) return
    clearTimers()
    const style = DELETE_STYLES[styleIdx.current]
    styleIdx.current = nextStyleIndex(styleIdx.current)

    const rightToLeft = letters().reverse()
    let i = 0
    const tick = () => {
      if (i >= rightToLeft.length) return
      const el = rightToLeft[i]
      el.dataset.gone = '1'
      el.style.animation = `${style.keyframes} ${style.dur}ms ${style.ease} forwards`
      i += 1
      later(tick, style.step)
    }
    tick()
  }

  const onLeave = () => {
    if (prefersReducedMotion()) return
    clearTimers()
    letters().forEach((el, k) => {
      if (el.dataset.gone !== '1') return
      later(() => {
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
        <span key={i} className="home-letter">
          {ch}
        </span>
      ))}
      <span className="home-dot" aria-hidden="true">.</span>
    </h1>
  )
}
