import type { Ref } from 'react'
import './TrashZone.css'

interface TrashZoneProps {
  ref: Ref<HTMLDivElement>
}

export function TrashZone({ ref }: TrashZoneProps) {
  return (
    <div ref={ref} className="trash">
      <svg className="trash__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
      </svg>
      <span className="trash__label">Drop to delete</span>
    </div>
  )
}
