import type { Rect } from './geometry.ts'

export type NoteId = string

export interface Note extends Rect {
  id: NoteId
  // Stacking order among notes; higher values render on top.
  zIndex: number
}
