import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce } from './debounce.ts'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('runs once with the latest arguments after the delay', () => {
    const fn = vi.fn<(value: number) => void>()
    const debounced = debounce(fn, 300)

    debounced(1)
    debounced(2)
    vi.advanceTimersByTime(299)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledOnce()
    expect(fn).toHaveBeenCalledWith(2)
  })

  it('restarts the delay on every call', () => {
    const fn = vi.fn<(value: number) => void>()
    const debounced = debounce(fn, 300)

    debounced(1)
    vi.advanceTimersByTime(200)
    debounced(2)
    vi.advanceTimersByTime(200)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledWith(2)
  })

  it('flush runs the pending call right away, and only once', () => {
    const fn = vi.fn<(value: number) => void>()
    const debounced = debounce(fn, 300)

    debounced(1)
    debounced.flush()
    expect(fn).toHaveBeenCalledWith(1)

    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledOnce()
  })

  it('flush does nothing when no call is pending', () => {
    const fn = vi.fn<(value: number) => void>()
    const debounced = debounce(fn, 300)

    debounced.flush()
    debounced(1)
    vi.advanceTimersByTime(300)
    debounced.flush()
    expect(fn).toHaveBeenCalledOnce()
  })
})
