import { useRef, type PointerEvent, type RefObject } from 'react'
import { useTrashZoneRef } from '../context/trash-zone.context.ts'
import { useNotesStore } from '../store/notes.store.ts'
import { useUndoStore } from '../store/undo.store.ts'
import type { Point, Rect, Size } from '../types/geometry.ts'
import type { NoteId } from '../types/note.ts'
import { clamp, containsPoint, toTransform } from '../utils/geometry.ts'

interface DragGesture {
  pointerStart: Point
  noteStart: Rect
  // Measured once on pointerdown so pointermove never reads layout.
  bounds: Size
  trashBounds: DOMRect | null
  position: Point
  overTrash: boolean
}

// Move a note by dragging its handle; releasing over the trash deletes it.
// The note element is moved straight on the DOM; the store only changes on release.
export function useNoteDrag(id: NoteId, noteRef: RefObject<HTMLElement | null>) {
  const moveNote = useNotesStore((state) => state.moveNote)
  const deleteNote = useUndoStore((state) => state.deleteNote)
  const trashRef = useTrashZoneRef()
  const gestureRef = useRef<DragGesture | null>(null)

  const setOverTrash = (gesture: DragGesture, overTrash: boolean) => {
    if (gesture.overTrash === overTrash) return
    gesture.overTrash = overTrash
    trashRef.current?.toggleAttribute('data-active', overTrash)
    noteRef.current?.toggleAttribute('data-over-trash', overTrash)
  }

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    const board = noteRef.current?.parentElement
    // Presses on controls inside the handle (e.g. the color picker) aren't drags.
    if (e.button !== 0 || e.target !== e.currentTarget || !noteRef.current || !board) return
    // Read from the store directly so the gesture always starts from the latest rect.
    const note = useNotesStore.getState().notes[id]
    gestureRef.current = {
      pointerStart: { x: e.clientX, y: e.clientY },
      noteStart: note,
      bounds: { width: board.clientWidth, height: board.clientHeight },
      trashBounds: trashRef.current?.getBoundingClientRect() ?? null,
      position: { x: note.x, y: note.y },
      overTrash: false,
    }
    noteRef.current.toggleAttribute('data-dragging', true)
    trashRef.current?.toggleAttribute('data-armed', true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const gesture = gestureRef.current
    if (!gesture || !noteRef.current) return

    const { pointerStart, noteStart, bounds, trashBounds } = gesture
    gesture.position = {
      x: clamp(noteStart.x + e.clientX - pointerStart.x, 0, bounds.width - noteStart.width),
      y: clamp(noteStart.y + e.clientY - pointerStart.y, 0, bounds.height - noteStart.height),
    }
    noteRef.current.style.transform = toTransform(gesture.position)
    // Hit-test the pointer, not the note, so the drop target matches where the user aims.
    const pointer = { x: e.clientX, y: e.clientY }
    setOverTrash(gesture, trashBounds !== null && containsPoint(trashBounds, pointer))
  }

  const endGesture = (e: PointerEvent<HTMLElement>, commit: boolean) => {
    const gesture = gestureRef.current
    if (!gesture) return
    gestureRef.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    const dropOnTrash = commit && gesture.overTrash
    setOverTrash(gesture, false)
    noteRef.current?.toggleAttribute('data-dragging', false)
    trashRef.current?.toggleAttribute('data-armed', false)

    if (dropOnTrash) {
      deleteNote(id)
    } else if (commit) {
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
