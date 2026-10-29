import { create } from 'zustand'
import { UNDO_TIMEOUT_MS } from '../constants.ts'
import type { Note, NoteId } from '../types/note.ts'
import { useNotesStore } from './notes.store.ts'

interface UndoState {
  // Only the most recent deletion can be undone; a new deletion makes the previous one final.
  lastDeleted: Note | null
  deleteNote: (id: NoteId) => void
  undo: () => void
  dismiss: () => void
}

let expiryTimer: ReturnType<typeof setTimeout> | undefined

export const useUndoStore = create<UndoState>()((set, get) => ({
  lastDeleted: null,
  deleteNote: (id) => {
    const removed = useNotesStore.getState().removeNote(id)
    if (!removed) return
    clearTimeout(expiryTimer)
    expiryTimer = setTimeout(() => set({ lastDeleted: null }), UNDO_TIMEOUT_MS)
    set({ lastDeleted: removed })
  },
  undo: () => {
    const { lastDeleted } = get()
    if (!lastDeleted) return
    clearTimeout(expiryTimer)
    useNotesStore.getState().restoreNote(lastDeleted)
    set({ lastDeleted: null })
  },
  dismiss: () => {
    clearTimeout(expiryTimer)
    set({ lastDeleted: null })
  },
}))
