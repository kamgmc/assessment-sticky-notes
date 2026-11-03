import { NOTE_COLORS } from '../../constants.ts'
import type { Note, NoteColor, NoteId } from '../../types/note.ts'
import { isFiniteNumber } from '../numbers.ts'

function isNoteColor(value: unknown): value is NoteColor {
  return NOTE_COLORS.some((color) => color === value)
}

// Input is untrusted, so each field is checked and a fresh object is built from it.
export function parseNote(value: unknown): Note | null {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('id' in value && 'x' in value && 'y' in value && 'width' in value) ||
    !('height' in value && 'text' in value && 'color' in value && 'zIndex' in value)
  ) {
    return null
  }
  const { id, x, y, width, height, text, color, zIndex } = value
  if (
    typeof id !== 'string' ||
    !isFiniteNumber(x) ||
    !isFiniteNumber(y) ||
    !isFiniteNumber(width) ||
    !isFiniteNumber(height) ||
    width <= 0 ||
    height <= 0 ||
    typeof text !== 'string' ||
    !isNoteColor(color) ||
    !isFiniteNumber(zIndex)
  ) {
    return null
  }
  return { id, x, y, width, height, text, color, zIndex }
}

// Keeps the valid notes and drops the rest, so one bad entry doesn't discard the whole board.
export function parseNotes(value: unknown): Record<NoteId, Note> | null {
  if (!Array.isArray(value)) return null
  const items: unknown[] = value
  const notes: Record<NoteId, Note> = {}
  for (const item of items) {
    const note = parseNote(item)
    if (note) notes[note.id] = note
  }
  return notes
}
