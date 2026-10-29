import { create } from 'zustand'
import type { Point, Rect } from '../types/geometry.ts'
import type { Note, NoteId } from '../types/note.ts'

export interface NotesState {
  // Keyed by id so a single note can be read or replaced without scanning the collection.
  notes: Record<NoteId, Note>
  addNote: (rect: Rect) => NoteId
  moveNote: (id: NoteId, position: Point) => void
}

export const useNotesStore = create<NotesState>()((set) => ({
  notes: {},
  addNote: (rect) => {
    const id = crypto.randomUUID()
    set((state) => ({ notes: { ...state.notes, [id]: { id, ...rect } } }))
    return id
  },
  moveNote: (id, { x, y }) => {
    set((state) => ({ notes: { ...state.notes, [id]: { ...state.notes[id], x, y } } }))
  },
}))
