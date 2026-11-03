// Safe wrappers around localStorage. Access can throw (privacy mode, blocked site data, full quota),
// and stored data is untrusted, so callers get a typed value or null instead of an exception.

// `parse` validates the decoded JSON and returns null to reject it.
export function readStorage<T>(key: string, parse: (value: unknown) => T | null): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    const value: unknown = JSON.parse(raw)
    return parse(value)
  } catch {
    return null
  }
}

// Returns false when the value couldn't be saved.
export function writeStorage(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`Could not save "${key}" to localStorage`, error)
    return false
  }
}

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // Nothing to remove when storage is unavailable.
  }
}
