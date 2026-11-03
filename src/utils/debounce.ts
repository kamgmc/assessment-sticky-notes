export interface Debounced<Args extends unknown[]> {
  (...args: Args): void
  // Runs the pending call right away, if there is one.
  flush: () => void
}

// Delays `fn` until `delayMs` has passed without another call, then runs it with the latest arguments.
export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delayMs: number): Debounced<Args> {
  let timer: ReturnType<typeof setTimeout> | undefined
  let pendingArgs: Args | null = null

  const flush = () => {
    clearTimeout(timer)
    if (!pendingArgs) return
    const args = pendingArgs
    pendingArgs = null
    fn(...args)
  }

  const debounced = (...args: Args) => {
    pendingArgs = args
    clearTimeout(timer)
    timer = setTimeout(flush, delayMs)
  }

  return Object.assign(debounced, { flush })
}
