import { memo } from 'react'
import { useNotesStore } from '../../store/notes.store.ts'
import type { NoteId } from '../../types/note.ts'
import { toRectStyle } from '../../utils/geometry.ts'
import './NoteCard.css'

interface NoteCardProps {
  id: NoteId
}

// Subscribes to its own note only, so changes to other notes don't re-render it.
export const NoteCard = memo(function NoteCard({ id }: NoteCardProps) {
  const note = useNotesStore((state) => state.notes[id])

  return <div className="note" style={toRectStyle(note)} />
})
