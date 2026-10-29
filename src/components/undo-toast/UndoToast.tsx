import { useUndoStore } from '../../store/undo.store.ts'
import './UndoToast.css'

export function UndoToast() {
  const lastDeleted = useUndoStore((state) => state.lastDeleted)
  const undo = useUndoStore((state) => state.undo)
  const dismiss = useUndoStore((state) => state.dismiss)

  // The live region stays mounted so screen readers announce the message when it appears.
  return (
    <div className="undo-toast" role="status">
      {lastDeleted && (
        <div className="undo-toast__body">
          <span>Note deleted</span>
          <button type="button" className="undo-toast__undo" onClick={undo}>
            Undo
          </button>
          <button
            type="button"
            className="undo-toast__close"
            aria-label="Dismiss"
            onClick={dismiss}
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
