import type { Note, NoteId } from '../types/note.ts'
import { debounce } from '../utils/debounce.ts'
import { readStorage, writeStorage } from '../utils/local-storage.ts'
import { parseNotes } from '../utils/notes/note-parsers.ts'

// Bump the version when the saved shape changes, so old data is ignored instead of misread.
const STORAGE_KEY = 'sticky-notes:v1'
const SAVE_DELAY_MS = 300

export function loadNotes(): Record<NoteId, Note> {
  return readStorage(STORAGE_KEY, parseNotes) ?? {}
}

// Debounced so bursts of changes, like typing, cause a single write.
export const scheduleSave = debounce((notes: Record<NoteId, Note>) => {
  writeStorage(STORAGE_KEY, Object.values(notes))
}, SAVE_DELAY_MS)

// Write any pending change before the page is closed or reloaded.
window.addEventListener('pagehide', scheduleSave.flush)
