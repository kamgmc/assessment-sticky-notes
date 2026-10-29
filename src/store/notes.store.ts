import { create } from 'zustand'
import type { Point, Rect, Size } from '../types/geometry.ts'
import type { Note, NoteColor, NoteId } from '../types/note.ts'

export interface NotesState {
  // Keyed by id so a single note can be read or replaced without scanning the collection.
  notes: Record<NoteId, Note>
  topZIndex: number
  addNote: (rect: Rect, color: NoteColor) => NoteId
  moveNote: (id: NoteId, position: Point) => void
  resizeNote: (id: NoteId, size: Size) => void
  setText: (id: NoteId, text: string) => void
  setColor: (id: NoteId, color: NoteColor) => void
  removeNote: (id: NoteId) => Note | undefined
  restoreNote: (note: Note) => void
  bringToFront: (id: NoteId) => void
}

export const useNotesStore = create<NotesState>()((set, get) => ({
  notes: {},
  topZIndex: 0,
  addNote: (rect, color) => {
    const id = crypto.randomUUID()
    set((state) => {
      const zIndex = state.topZIndex + 1
      return { topZIndex: zIndex, notes: { ...state.notes, [id]: { id, ...rect, text: '', color, zIndex } } }
    })
    return id
  },
  moveNote: (id, { x, y }) => {
    set((state) => ({ notes: { ...state.notes, [id]: { ...state.notes[id], x, y } } }))
  },
  resizeNote: (id, { width, height }) => {
    set((state) => ({ notes: { ...state.notes, [id]: { ...state.notes[id], width, height } } }))
  },
  setText: (id, text) => {
    set((state) => ({ notes: { ...state.notes, [id]: { ...state.notes[id], text } } }))
  },
  setColor: (id, color) => {
    set((state) => ({ notes: { ...state.notes, [id]: { ...state.notes[id], color } } }))
  },
  removeNote: (id) => {
    const { [id]: removed, ...rest } = get().notes
    set({ notes: rest })
    return removed
  },
  restoreNote: (note) => {
    set((state) => ({ notes: { ...state.notes, [note.id]: note } }))
  },
  bringToFront: (id) => {
    set((state) => {
      // Skipping the update keeps a click on the top note from re-rendering it.
      if (state.notes[id].zIndex === state.topZIndex) return state
      const zIndex = state.topZIndex + 1
      return { topZIndex: zIndex, notes: { ...state.notes, [id]: { ...state.notes[id], zIndex } } }
    })
  },
}))
