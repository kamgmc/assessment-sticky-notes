import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { readStorage, removeStorage, writeStorage } from './local-storage.ts'

const KEY = 'test-key'
const parseNumber = (value: unknown) => (typeof value === 'number' ? value : null)

describe('local storage helpers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null for a missing key', () => {
    expect(readStorage(KEY, parseNumber)).toBeNull()
  })

  it('reads back what was written', () => {
    expect(writeStorage(KEY, 42)).toBe(true)
    expect(readStorage(KEY, parseNumber)).toBe(42)
  })

  it('returns null for corrupt JSON', () => {
    localStorage.setItem(KEY, '{not json')
    expect(readStorage(KEY, parseNumber)).toBeNull()
  })

  it('returns null when the parser rejects the value', () => {
    writeStorage(KEY, 'not a number')
    expect(readStorage(KEY, parseNumber)).toBeNull()
  })

  it('returns null when storage cannot be read', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError')
    })
    expect(readStorage(KEY, parseNumber)).toBeNull()
  })

  it('returns false and warns when a write fails', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    })
    expect(writeStorage(KEY, 42)).toBe(false)
    expect(warn).toHaveBeenCalledOnce()
  })

  it('removes a key', () => {
    writeStorage(KEY, 42)
    removeStorage(KEY)
    expect(readStorage(KEY, parseNumber)).toBeNull()
  })
})
