import { NewNoteColorPicker } from '../../components/new-note-color-picker/NewNoteColorPicker.tsx'
import './Toolbar.css'

export function Toolbar() {
  return (
    <header className="toolbar">
      <h1 className="toolbar__title">Sticky Notes</h1>

      <NewNoteColorPicker />

      <p className="toolbar__hint">
        Drag on the board to draw a note or double-click to drop one · Drag the top bar to move
      </p>
    </header>
  )
}
