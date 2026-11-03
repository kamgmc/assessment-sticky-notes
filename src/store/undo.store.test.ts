import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { UNDO_TIMEOUT_MS } from '../constants.ts'
import { useNotesStore } from './notes.store.ts'
import { useUndoStore } from './undo.store.ts'

const rect = { x: 0, y: 0, width: 200, height: 160 }

describe('undo store', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useNotesStore.setState({ notes: {}, topZIndex: 0 })
    useUndoStore.getState().dismiss()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('removes the note and remembers it', () => {
    const id = useNotesStore.getState().addNote(rect, 'yellow')
    const note = useNotesStore.getState().notes[id]

    useUndoStore.getState().deleteNote(id)

    expect(useNotesStore.getState().notes[id]).toBeUndefined()
    expect(useUndoStore.getState().lastDeleted).toEqual(note)
  })

  it('restores the note exactly as it was', () => {
    const id = useNotesStore.getState().addNote(rect, 'pink')
    useNotesStore.getState().setText(id, 'Keep me')
    const note = useNotesStore.getState().notes[id]

    useUndoStore.getState().deleteNote(id)
    useUndoStore.getState().undo()

    expect(useNotesStore.getState().notes[id]).toEqual(note)
    expect(useUndoStore.getState().lastDeleted).toBeNull()
  })

  it('makes the deletion final once the timeout passes', () => {
    const id = useNotesStore.getState().addNote(rect, 'yellow')

    useUndoStore.getState().deleteNote(id)
    vi.advanceTimersByTime(UNDO_TIMEOUT_MS)
    useUndoStore.getState().undo()

    expect(useUndoStore.getState().lastDeleted).toBeNull()
    expect(useNotesStore.getState().notes[id]).toBeUndefined()
  })

  it('only keeps the latest deletion, with a fresh timeout', () => {
    const { addNote } = useNotesStore.getState()
    const first = addNote(rect, 'yellow')
    const second = addNote(rect, 'blue')

    useUndoStore.getState().deleteNote(first)
    vi.advanceTimersByTime(UNDO_TIMEOUT_MS - 1)
    useUndoStore.getState().deleteNote(second)
    vi.advanceTimersByTime(UNDO_TIMEOUT_MS - 1)
    useUndoStore.getState().undo()

    const { notes } = useNotesStore.getState()
    expect(notes[second]).toBeDefined()
    expect(notes[first]).toBeUndefined()
  })

  it('ignores a note that does not exist', () => {
    useUndoStore.getState().deleteNote('missing')
    expect(useUndoStore.getState().lastDeleted).toBeNull()
  })
})
