import { memo } from 'react'
import { TEXT_COMMIT_DELAY_MS } from '../../constants.ts'
import { useDebouncedField } from '../../hooks/use-debounced-field.ts'
import { useNotesStore } from '../../store/notes.store.ts'
import type { NoteId } from '../../types/note.ts'
import './NoteText.css'

interface NoteTextProps {
  id: NoteId
}

// Uncontrolled and not subscribed to the store, so typing re-renders nothing.
export const NoteText = memo(function NoteText({ id }: NoteTextProps) {
  const fieldProps = useDebouncedField({
    initialValue: useNotesStore.getState().notes[id].text,
    onCommit: (text) => useNotesStore.getState().setText(id, text),
    delayMs: TEXT_COMMIT_DELAY_MS,
  })

  return (
    <textarea
      className="note-text"
      aria-label="Note text"
      placeholder="Write something…"
      {...fieldProps}
      onKeyDown={(e) => {
        if (e.key === 'Escape') e.currentTarget.blur()
      }}
    />
  )
})
