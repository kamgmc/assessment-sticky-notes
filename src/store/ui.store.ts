import { create } from 'zustand'
import { DEFAULT_NOTE_COLOR } from '../constants.ts'
import type { NoteColor } from '../types/note.ts'

interface UiState {
  newNoteColor: NoteColor
  setNewNoteColor: (color: NoteColor) => void
}

export const useUiStore = create<UiState>()((set) => ({
  newNoteColor: DEFAULT_NOTE_COLOR,
  setNewNoteColor: (newNoteColor) => set({ newNoteColor }),
}))
