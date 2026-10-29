import { memo } from 'react'
import { useNotesStore } from '../../store/notes.store.ts'
import type { NoteId } from '../../types/note.ts'
import './NoteText.css'

interface NoteTextProps {
  id: NoteId
}

// Subscribes to the text only, so typing doesn't re-render the surrounding card.
export const NoteText = memo(function NoteText({ id }: NoteTextProps) {
  const text = useNotesStore((state) => state.notes[id].text)
  const setText = useNotesStore((state) => state.setText)

  return (
    <textarea
      className="note-text"
      aria-label="Note text"
      placeholder="Write something…"
      value={text}
      onChange={(e) => setText(id, e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') e.currentTarget.blur()
      }}
    />
  )
})
