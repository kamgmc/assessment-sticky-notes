import type { Rect } from './geometry.ts'

export type NoteId = string

export interface Note extends Rect {
  id: NoteId
}
