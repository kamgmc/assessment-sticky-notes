import type { Size } from './types/geometry.ts'

// Drawn rectangles smaller than this area treated as accidental clicks.
export const MIN_NOTE_SIZE: Size = { width: 80, height: 60 }

export const DEFAULT_NOTE_SIZE: Size = { width: 200, height: 160 }

// How long a deleted note can be restored from the undo toast.
export const UNDO_TIMEOUT_MS = 5000
