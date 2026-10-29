import { useRef, type PointerEvent } from 'react'
import { MIN_NOTE_SIZE } from '../constants.ts'
import { useNotesStore } from '../store/notes.store.ts'
import type { Point } from '../types/geometry.ts'
import { isAtLeast, rectFromPoints, toLocalPoint, toRectStyle } from '../utils/geometry.ts'

interface DrawGesture {
  start: Point
  // Measured once on pointerdown so pointermove never reads layout.
  bounds: DOMRect
}

// Draw a new note by dragging a rectangle on empty board space.
// The preview is updated straight on the DOM; the store only changes on release.
export function useDrawToCreate() {
  const addNote = useNotesStore((state) => state.addNote)
  const previewRef = useRef<HTMLDivElement>(null)
  const gestureRef = useRef<DrawGesture | null>(null)

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || e.target !== e.currentTarget) return
    const bounds = e.currentTarget.getBoundingClientRect()
    gestureRef.current = { start: toLocalPoint(e, bounds), bounds }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const gesture = gestureRef.current
    const preview = previewRef.current
    if (!gesture || !preview) return

    const rect = rectFromPoints(gesture.start, toLocalPoint(e, gesture.bounds))
    Object.assign(preview.style, toRectStyle(rect))
    preview.toggleAttribute('data-valid', isAtLeast(rect, MIN_NOTE_SIZE))
    preview.hidden = false
  }

  const endGesture = (e: PointerEvent<HTMLElement>, commit: boolean) => {
    const gesture = gestureRef.current
    if (!gesture) return
    gestureRef.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    if (previewRef.current) previewRef.current.hidden = true

    const rect = rectFromPoints(gesture.start, toLocalPoint(e, gesture.bounds))
    if (commit && isAtLeast(rect, MIN_NOTE_SIZE)) addNote(rect)
  }

  return {
    previewRef,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: (e: PointerEvent<HTMLElement>) => endGesture(e, true),
      onPointerCancel: (e: PointerEvent<HTMLElement>) => endGesture(e, false),
    },
  }
}
