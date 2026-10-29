import { memo, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useNoteDrag } from '../../hooks/use-note-drag.ts'
import { useNoteResize } from '../../hooks/use-note-resize.ts'
import { useNotesStore } from '../../store/notes.store.ts'
import type { NoteId } from '../../types/note.ts'
import { toRectStyle } from '../../utils/geometry.ts'
import { NoteText } from '../note-text/NoteText.tsx'
import './NoteCard.css'

interface NoteCardProps {
  id: NoteId
}

// Subscribes only to its own note's layout (shallow-compared), so neither changes to other
// notes nor edits to its own text re-render it.
export const NoteCard = memo(function NoteCard({ id }: NoteCardProps) {
  const layout = useNotesStore(
    useShallow((state) => {
      const { x, y, width, height, zIndex } = state.notes[id]
      return { x, y, width, height, zIndex }
    }),
  )
  const bringToFront = useNotesStore((state) => state.bringToFront)
  const noteRef = useRef<HTMLDivElement>(null)
  const dragHandlers = useNoteDrag(id, noteRef)
  const resizeHandlers = useNoteResize(id, noteRef)

  return (
    <div
      ref={noteRef}
      className="note"
      style={{ ...toRectStyle(layout), zIndex: layout.zIndex }}
      onPointerDown={() => bringToFront(id)}
    >
      <div className="note__handle" title="Drag to move" {...dragHandlers} />
      <NoteText id={id} />
      <div className="note__resize" title="Drag to resize" {...resizeHandlers} />
    </div>
  )
})
