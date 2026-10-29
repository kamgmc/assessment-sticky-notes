import type { MouseEvent } from 'react'
import { DEFAULT_NOTE_SIZE } from '../constants.ts'
import { useNotesStore } from '../store/notes.store.ts'
import { centeredRect, toLocalPoint } from '../utils/geometry.ts'

// Drop a default-size note centered on a double-click on empty board space.
export function useDoubleClickToCreate() {
  const addNote = useNotesStore((state) => state.addNote)

  return (e: MouseEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return
    const bounds = e.currentTarget.getBoundingClientRect()
    addNote(centeredRect(toLocalPoint(e, bounds), DEFAULT_NOTE_SIZE, bounds))
  }
}
