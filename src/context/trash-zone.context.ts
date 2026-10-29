import { createContext, useContext, type RefObject } from 'react'

// Shares the trash element with note drag gestures for hit-testing. The ref object never
// changes, so consumers don't re-render when the trash element mounts.
export const TrashZoneContext = createContext<RefObject<HTMLElement | null>>({ current: null })

export function useTrashZoneRef() {
  return useContext(TrashZoneContext)
}
