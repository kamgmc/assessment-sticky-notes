import { create } from 'zustand'
import { loadNotes, scheduleSave } from '../services/notes-storage.ts'
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

const initialNotes = loadNotes()

export const useNotesStore = create<NotesState>()((set, get) => ({
  notes: initialNotes,
  topZIndex: Math.max(0, ...Object.values(initialNotes).map((note) => note.zIndex)),
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
    set((state) => {
      // A pending text commit can arrive after its note was deleted.
      if (!(id in state.notes)) return state
      return { notes: { ...state.notes, [id]: { ...state.notes[id], text } } }
    })
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

// Every action replaces `notes` with a new object, so a reference check detects any change.
useNotesStore.subscribe((state, prev) => {
  if (state.notes !== prev.notes) scheduleSave(state.notes)
})
