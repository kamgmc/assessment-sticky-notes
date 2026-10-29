import { useRef, type PointerEvent, type RefObject } from 'react'
import { MIN_NOTE_SIZE } from '../constants.ts'
import { useNotesStore } from '../store/notes.store.ts'
import type { Point, Rect, Size } from '../types/geometry.ts'
import type { NoteId } from '../types/note.ts'
import { clamp } from '../utils/geometry.ts'

interface ResizeGesture {
  pointerStart: Point
  noteStart: Rect
  // Measured once on pointerdown so pointermove never reads layout.
  bounds: Size
  size: Size
}

const applySize = (el: HTMLElement, { width, height }: Size) => {
  el.style.width = `${width}px`
  el.style.height = `${height}px`
}

// Resize a note by dragging its bottom-right corner. The note element is resized straight
// on the DOM; the store only changes on release.
export function useNoteResize(id: NoteId, noteRef: RefObject<HTMLElement | null>) {
  const resizeNote = useNotesStore((state) => state.resizeNote)
  const gestureRef = useRef<ResizeGesture | null>(null)

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    const board = noteRef.current?.parentElement
    if (e.button !== 0 || !noteRef.current || !board) return
    // Read from the store directly so the gesture always starts from the latest rect.
    const note = useNotesStore.getState().notes[id]
    gestureRef.current = {
      pointerStart: { x: e.clientX, y: e.clientY },
      noteStart: note,
      bounds: { width: board.clientWidth, height: board.clientHeight },
      size: { width: note.width, height: note.height },
    }
    noteRef.current.toggleAttribute('data-resizing', true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const gesture = gestureRef.current
    if (!gesture || !noteRef.current) return

    const { pointerStart, noteStart, bounds } = gesture
    gesture.size = {
      width: clamp(
        noteStart.width + e.clientX - pointerStart.x,
        MIN_NOTE_SIZE.width,
        bounds.width - noteStart.x,
      ),
      height: clamp(
        noteStart.height + e.clientY - pointerStart.y,
        MIN_NOTE_SIZE.height,
        bounds.height - noteStart.y,
      ),
    }
    applySize(noteRef.current, gesture.size)
  }

  const endGesture = (e: PointerEvent<HTMLElement>, commit: boolean) => {
    const gesture = gestureRef.current
    if (!gesture) return
    gestureRef.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    noteRef.current?.toggleAttribute('data-resizing', false)

    if (commit) {
      resizeNote(id, gesture.size)
    } else if (noteRef.current) {
      applySize(noteRef.current, gesture.noteStart)
    }
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: (e: PointerEvent<HTMLElement>) => endGesture(e, true),
    onPointerCancel: (e: PointerEvent<HTMLElement>) => endGesture(e, false),
  }
}
