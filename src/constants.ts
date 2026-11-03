import type { Size } from './types/geometry.ts'
import type { NoteColor } from './types/note.ts'

// Drawn rectangles smaller than this area treated as accidental clicks.
export const MIN_NOTE_SIZE: Size = { width: 80, height: 60 }

export const DEFAULT_NOTE_SIZE: Size = { width: 200, height: 160 }

// A dragged note counts as over the trash when the overlap covers at least this share
// of the smaller of the two, so small notes can trigger it too.
export const TRASH_OVERLAP_RATIO = 0.5

// How long a deleted note can be restored from the undo toast.
export const UNDO_TIMEOUT_MS = 5000

export const NOTE_COLORS = ['yellow', 'pink', 'blue', 'green', 'purple'] as const

export const DEFAULT_NOTE_COLOR: NoteColor = 'yellow'
