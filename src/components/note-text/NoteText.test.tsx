import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TEXT_COMMIT_DELAY_MS } from '../../constants.ts'
import { useNotesStore } from '../../store/notes.store.ts'
import type { NoteId } from '../../types/note.ts'
import { NoteText } from './NoteText.tsx'

const textOf = (id: NoteId) => useNotesStore.getState().notes[id].text

function setVisibility(state: DocumentVisibilityState) {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true })
}

describe('NoteText', () => {
  let id: NoteId

  beforeEach(() => {
    vi.useFakeTimers()
    useNotesStore.setState({ notes: {}, topZIndex: 0 })
    id = useNotesStore.getState().addNote({ x: 0, y: 0, width: 200, height: 160 }, 'yellow')
    useNotesStore.getState().setText(id, 'Hello')
  })

  afterEach(() => {
    cleanup()
    setVisibility('visible')
    vi.useRealTimers()
  })

  const renderText = () => {
    render(<NoteText id={id} />)
    return screen.getByRole<HTMLTextAreaElement>('textbox', { name: 'Note text' })
  }

  it("shows the note's saved text", () => {
    expect(renderText().value).toBe('Hello')
  })

  it('commits to the store only after typing pauses', () => {
    const textarea = renderText()

    fireEvent.change(textarea, { target: { value: 'Hello w' } })
    fireEvent.change(textarea, { target: { value: 'Hello world' } })
    vi.advanceTimersByTime(TEXT_COMMIT_DELAY_MS - 1)
    expect(textOf(id)).toBe('Hello')

    vi.advanceTimersByTime(1)
    expect(textOf(id)).toBe('Hello world')
  })

  it('commits right away on blur', () => {
    const textarea = renderText()
    textarea.focus()

    fireEvent.change(textarea, { target: { value: 'Typed' } })
    textarea.blur()

    expect(textOf(id)).toBe('Typed')
  })

  it('commits right away when the tab is hidden while editing', () => {
    const textarea = renderText()
    textarea.focus()

    fireEvent.change(textarea, { target: { value: 'Before reload' } })
    setVisibility('hidden')
    document.dispatchEvent(new Event('visibilitychange'))

    expect(textOf(id)).toBe('Before reload')
  })

  it('commits pending text when it unmounts', () => {
    const textarea = renderText()

    fireEvent.change(textarea, { target: { value: 'Unmounted' } })
    cleanup()

    expect(textOf(id)).toBe('Unmounted')
  })
})
