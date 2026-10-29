import { useRef, type PointerEvent, type RefObject } from 'react'
import { useNotesStore } from '../store/notes.store.ts'
import type { Point, Rect, Size } from '../types/geometry.ts'
import type { NoteId } from '../types/note.ts'
import { clamp, toTransform } from '../utils/geometry.ts'

interface DragGesture {
  pointerStart: Point
  noteStart: Rect
  // Measured once on pointerdown so pointermove never reads layout.
  bounds: Size
  position: Point
}

// Move a note by dragging its handle. The note element is moved straight on the DOM;
// the store only changes on release.
export function useNoteDrag(id: NoteId, noteRef: RefObject<HTMLElement | null>) {
  const moveNote = useNotesStore((state) => state.moveNote)
  const gestureRef = useRef<DragGesture | null>(null)

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    const board = noteRef.current?.parentElement
    if (e.button !== 0 || !noteRef.current || !board) return
    // Read from the store directly so the gesture always starts from the latest rect.
    const note = useNotesStore.getState().notes[id]
    gestureRef.current = {
      pointerStart: { x: e.clientX, y: e.clientY },
      noteStart: note,
      bounds: { width: board.clientWidth, height: board.clientHeight },
      position: { x: note.x, y: note.y },
    }
    noteRef.current.toggleAttribute('data-dragging', true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const gesture = gestureRef.current
    if (!gesture || !noteRef.current) return

    const { pointerStart, noteStart, bounds } = gesture
    gesture.position = {
      x: clamp(noteStart.x + e.clientX - pointerStart.x, 0, bounds.width - noteStart.width),
      y: clamp(noteStart.y + e.clientY - pointerStart.y, 0, bounds.height - noteStart.height),
    }
    noteRef.current.style.transform = toTransform(gesture.position)
  }

  const endGesture = (e: PointerEvent<HTMLElement>, commit: boolean) => {
    const gesture = gestureRef.current
    if (!gesture) return
    gestureRef.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    noteRef.current?.toggleAttribute('data-dragging', false)

    if (commit) {
      moveNote(id, gesture.position)
    } else if (noteRef.current) {
      noteRef.current.style.transform = toTransform(gesture.noteStart)
    }
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: (e: PointerEvent<HTMLElement>) => endGesture(e, true),
    onPointerCancel: (e: PointerEvent<HTMLElement>) => endGesture(e, false),
  }
}
