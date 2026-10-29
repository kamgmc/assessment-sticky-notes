import { useShallow } from 'zustand/react/shallow'
import { NoteCard } from '../../components/note-card/NoteCard.tsx'
import { useDoubleClickToCreate } from '../../hooks/use-double-click-to-create.ts'
import { useDrawToCreate } from '../../hooks/use-draw-to-create.ts'
import { useNotesStore, type NotesState } from '../../store/notes.store.ts'
import './Board.css'

// Shallow-compared, so the board re-renders only when notes are added or removed.
const selectNoteIds = (state: NotesState) => Object.keys(state.notes)

export function Board() {
  const noteIds = useNotesStore(useShallow(selectNoteIds))
  const { previewRef, handlers } = useDrawToCreate()
  const onDoubleClick = useDoubleClickToCreate()

  return (
    <main
      className="board"
      aria-label="Sticky notes board"
      {...handlers}
      onDoubleClick={onDoubleClick}
    >
      <div className="board__notes">
        {noteIds.map((id) => (
          <NoteCard key={id} id={id} />
        ))}
        <div ref={previewRef} className="board__draw-preview" hidden />
      </div>

      {noteIds.length === 0 && (
        <p className="board__message">
          Drag on empty space to draw a note, or double-click to drop one.
        </p>
      )}
    </main>
  )
}
