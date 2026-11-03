import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Note } from '../types/note.ts'
import { useNotesStore } from './notes.store.ts'

const rect = { x: 10, y: 20, width: 200, height: 160 }

describe('notes store', () => {
  beforeEach(() => {
    useNotesStore.setState({ notes: {}, topZIndex: 0 })
  })

  it('adds notes with empty text, stacking each new one on top', () => {
    const { addNote } = useNotesStore.getState()
    const first = addNote(rect, 'yellow')
    const second = addNote(rect, 'blue')

    const { notes, topZIndex } = useNotesStore.getState()
    expect(notes[first]).toEqual({ id: first, ...rect, text: '', color: 'yellow', zIndex: 1 })
    expect(notes[second].zIndex).toBe(2)
    expect(topZIndex).toBe(2)
  })

  it('moves, resizes, recolors and edits a note', () => {
    const { addNote, moveNote, resizeNote, setColor, setText } = useNotesStore.getState()
    const id = addNote(rect, 'yellow')

    moveNote(id, { x: 50, y: 60 })
    resizeNote(id, { width: 300, height: 250 })
    setColor(id, 'green')
    setText(id, 'Hello')

    expect(useNotesStore.getState().notes[id]).toMatchObject({
      x: 50,
      y: 60,
      width: 300,
      height: 250,
      color: 'green',
      text: 'Hello',
    })
  })

  it('brings a lower note to the front', () => {
    const { addNote, bringToFront } = useNotesStore.getState()
    const lower = addNote(rect, 'yellow')
    addNote(rect, 'yellow')

    bringToFront(lower)

    const { notes, topZIndex } = useNotesStore.getState()
    expect(notes[lower].zIndex).toBe(3)
    expect(topZIndex).toBe(3)
  })

  it('leaves the state untouched when the note is already on top', () => {
    const id = useNotesStore.getState().addNote(rect, 'yellow')
    const before = useNotesStore.getState()

    useNotesStore.getState().bringToFront(id)

    expect(useNotesStore.getState()).toBe(before)
  })

  it('ignores text for a note that no longer exists', () => {
    const before = useNotesStore.getState().notes

    useNotesStore.getState().setText('missing', 'late commit')

    expect(useNotesStore.getState().notes).toBe(before)
  })

  it('removes a note and restores it exactly', () => {
    const { addNote, removeNote, restoreNote } = useNotesStore.getState()
    const id = addNote(rect, 'pink')
    const original = useNotesStore.getState().notes[id]

    const removed = removeNote(id)
    expect(removed).toEqual(original)
    expect(useNotesStore.getState().notes[id]).toBeUndefined()

    restoreNote(original)
    expect(useNotesStore.getState().notes[id]).toEqual(original)
  })
})

describe('notes store persistence', () => {
  const STORAGE_KEY = 'sticky-notes:v1'
  const saved: Note = { id: 'saved', ...rect, text: 'Kept', color: 'blue', zIndex: 7 }

  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts from the saved notes, above their highest z-index', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([saved]))

    const { useNotesStore: freshStore } = await import('./notes.store.ts')

    expect(freshStore.getState().notes).toEqual({ saved })
    expect(freshStore.getState().topZIndex).toBe(7)
  })

  it('saves changes once they settle', async () => {
    vi.useFakeTimers()
    const { useNotesStore: freshStore } = await import('./notes.store.ts')

    const id = freshStore.getState().addNote(rect, 'green')
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()

    vi.runAllTimers()
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    expect(stored).toEqual([freshStore.getState().notes[id]])
  })
})
