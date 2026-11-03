import { useEffect, useLayoutEffect, useState, type ChangeEvent } from 'react'
import { debounce } from '../utils/debounce.ts'

type CommitHandler = (value: string) => void

function createField(delayMs: number) {
  // Replaced after every render, so a commit always calls the latest handler.
  let onCommit: CommitHandler = () => {}
  const commit = debounce((value: string) => onCommit(value), delayMs)
  // `visibilitychange` fires before `pagehide`, so a commit made here lands before
  // anything that saves on `pagehide` when the tab is closed or reloaded.
  const flushWhenHidden = () => {
    if (document.visibilityState === 'hidden') {
      commit.flush()
    }
  }
  const setOnCommit = (handler: CommitHandler) => {
    onCommit = handler
  }
  return { commit, flushWhenHidden, setOnCommit }
}

interface DebouncedFieldOptions {
  // Read on mount only; afterwards the field is the source of truth for its own value.
  initialValue: string
  onCommit: CommitHandler
  // Read on mount only.
  delayMs: number
}

// Props for an uncontrolled input or text area. The browser keeps the value while the user
// types, so keystrokes cause no React renders. `onCommit` runs after a pause in typing,
// on blur, and when the tab is hidden.
export function useDebouncedField({ initialValue, onCommit, delayMs }: DebouncedFieldOptions) {
  const [defaultValue] = useState(initialValue)
  const [field] = useState(() => createField(delayMs))

  useLayoutEffect(() => {
    field.setOnCommit(onCommit)
  })

  useEffect(() => {
    const { commit, flushWhenHidden } = field
    return () => {
      document.removeEventListener('visibilitychange', flushWhenHidden)
      commit.flush()
    }
  }, [field])

  return {
    defaultValue,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => field.commit(e.target.value),
    // Only a focused field can have an uncommitted value, so it listens only while focused.
    onFocus: () => document.addEventListener('visibilitychange', field.flushWhenHidden),
    onBlur: () => {
      document.removeEventListener('visibilitychange', field.flushWhenHidden)
      field.commit.flush()
    },
  }
}
