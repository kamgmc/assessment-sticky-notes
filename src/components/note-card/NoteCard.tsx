import { memo, useRef } from 'react'
import { useNoteDrag } from '../../hooks/use-note-drag.ts'
import { useNoteResize } from '../../hooks/use-note-resize.ts'
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
  const bringToFront = useNotesStore((state) => state.bringToFront)
  const noteRef = useRef<HTMLDivElement>(null)
  const dragHandlers = useNoteDrag(id, noteRef)
  const resizeHandlers = useNoteResize(id, noteRef)

  return (
    <div
      ref={noteRef}
      className="note"
      style={{ ...toRectStyle(note), zIndex: note.zIndex }}
      onPointerDown={() => bringToFront(id)}
    >
      <div className="note__handle" title="Drag to move" {...dragHandlers} />
      <div className="note__resize" title="Drag to resize" {...resizeHandlers} />
    </div>
  )
})
