import { useUiStore } from '../../store/ui.store.ts'
import { ColorPicker } from '../color-picker/ColorPicker.tsx'
import './NewNoteColorPicker.css'

// Owns the new-note color subscription so picking a color doesn't re-render the toolbar.
export function NewNoteColorPicker() {
  const newNoteColor = useUiStore((state) => state.newNoteColor)
  const setNewNoteColor = useUiStore((state) => state.setNewNoteColor)

  return (
    <div className="new-note-color-picker">
      <span className="new-note-color-picker__label" aria-hidden="true">
        New note color
      </span>
      <ColorPicker label="New note color" value={newNoteColor} onChange={setNewNoteColor} />
    </div>
  )
}
