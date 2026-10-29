import { NOTE_COLORS } from '../../constants.ts'
import type { NoteColor } from '../../types/note.ts'
import './ColorPicker.css'

interface ColorPickerProps {
  label: string
  value: NoteColor
  onChange: (color: NoteColor) => void
  size?: 'small' | 'medium'
}

export function ColorPicker({ label, value, onChange, size = 'medium' }: ColorPickerProps) {
  return (
    <div className="color-picker" role="group" aria-label={label} data-size={size}>
      {NOTE_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className="color-picker__swatch"
          data-color={color}
          aria-label={color}
          aria-pressed={color === value}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  )
}
