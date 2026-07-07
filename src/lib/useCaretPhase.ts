import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Drives a "console caret" delete/retype animation as an integer phase that
 * steps toward a target (maxPhase on hover, 0 on leave). Pure timers + state,
 * no DOM measurement, so it's unit-testable. Reversible and interruptible
 * mid-flight, and a no-op for reduced-motion users.
 *
 * Ported from the clinvin Logo animation.
 */
export const DELETE_STEP_MS = 52
export const RETYPE_STEP_MS = 42

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function useCaretPhase(maxPhase: number): {
  phase: number
  onEnter: () => void
  onLeave: () => void
} {
  const [phase, setPhase] = useState(0)
  const phaseRef = useRef(0)
  const targetRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setBoth = useCallback((p: number) => {
    phaseRef.current = p
    setPhase(p)
  }, [])

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const tick = useCallback(() => {
    const target = targetRef.current
    const current = phaseRef.current
    if (current === target) {
      timerRef.current = null
      return
    }
    const goingUp = target > current
    setBoth(current + (goingUp ? 1 : -1))
    timerRef.current = setTimeout(tick, goingUp ? DELETE_STEP_MS : RETYPE_STEP_MS)
  }, [setBoth])

  const run = useCallback(
    (target: number) => {
      targetRef.current = target
      if (timerRef.current === null) tick()
    },
    [tick],
  )

  const onEnter = useCallback(() => {
    if (prefersReducedMotion()) return
    run(maxPhase)
  }, [run, maxPhase])

  const onLeave = useCallback(() => {
    if (prefersReducedMotion()) return
    run(0)
  }, [run])

  useEffect(() => stop, [stop])

  return { phase, onEnter, onLeave }
}
