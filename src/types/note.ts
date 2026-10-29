import type { NOTE_COLORS } from '../constants.ts'
import type { Rect } from './geometry.ts'

export type NoteId = string

export type NoteColor = (typeof NOTE_COLORS)[number]

export interface Note extends Rect {
  id: NoteId
  text: string
  color: NoteColor
  // Stacking order among notes; higher values render on top.
  zIndex: number
}
