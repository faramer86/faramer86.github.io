import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCaretPhase, DELETE_STEP_MS } from './useCaretPhase'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useCaretPhase', () => {
  it('starts at phase 0', () => {
    const { result } = renderHook(() => useCaretPhase(5))
    expect(result.current.phase).toBe(0)
  })

  it('steps up to maxPhase one tick at a time on enter', () => {
    const { result } = renderHook(() => useCaretPhase(3))
    act(() => result.current.onEnter())
    expect(result.current.phase).toBe(1)
    act(() => vi.advanceTimersByTime(DELETE_STEP_MS))
    expect(result.current.phase).toBe(2)
    act(() => vi.advanceTimersByTime(DELETE_STEP_MS))
    expect(result.current.phase).toBe(3)
    // holds at max
    act(() => vi.advanceTimersByTime(DELETE_STEP_MS * 3))
    expect(result.current.phase).toBe(3)
  })

  it('reverses back to 0 on leave (retype)', () => {
    const { result } = renderHook(() => useCaretPhase(3))
    act(() => result.current.onEnter())
    act(() => vi.advanceTimersByTime(DELETE_STEP_MS * 3))
    expect(result.current.phase).toBe(3)
    act(() => result.current.onLeave())
    expect(result.current.phase).toBe(2)
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.phase).toBe(0)
  })

  it('is interruptible mid-flight (leave before fully deleted)', () => {
    const { result } = renderHook(() => useCaretPhase(6))
    act(() => result.current.onEnter())
    act(() => vi.advanceTimersByTime(DELETE_STEP_MS * 2)) // phase ~3
    expect(result.current.phase).toBe(3)
    act(() => result.current.onLeave())
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.phase).toBe(0)
  })
})
