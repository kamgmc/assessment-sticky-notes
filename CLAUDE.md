# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-page sticky notes app built for a take-home task. The full spec is in `docs/REQUIREMENTS.md`. In short:

- Implement at least 3 of: create a note at a given position and size, resize by dragging, move by dragging, delete by dragging onto a trash zone. Optional extras: text editing, bring to front, localStorage persistence, colors, and a mocked REST API (the mock **must be async**).
- Use React **without stock or third-party UI components or drag-and-drop libraries**. Drag, resize and hit-testing are built by hand.
- Desktop only, 1024×768 minimum. Must work in the latest Chrome, Firefox and Edge.
- Graded on architecture, performance (smooth dragging with no needless re-renders of other notes), code quality, accuracy of static types, and usability.
- Comments in English, only where they really help a reader.
- The submission also needs a 2–3 paragraph architecture description.

## Architecture

- **Layout:** `App` stacks a `Toolbar` header above a full-height `Board` canvas. Page-level layout components live in `src/layout/` and other components in `src/components/`. Each component gets its own directory named in lowercase kebab-case (e.g. `note-card/`), holding `<Name>.tsx` and a matching BEM-style `<Name>.css`. Design tokens (colors, fonts) are CSS custom properties on `:root` in `src/index.css`.
- **File naming:** hooks use kebab-case file names (`src/hooks/use-draw-to-create.ts`). Stores use kebab-case plus a `.store` suffix (`src/store/notes.store.ts`).
- **State:** a Zustand store in `src/store/notes.store.ts` keeps notes as `Record<NoteId, Note>`. A `Note` is a `Rect` (`x`, `y`, `width`, `height` in board-relative pixels) plus an `id`. `Board` selects only the list of IDs (with `useShallow`), and each memoized `NoteCard` reads its own note by ID, so changing one note re-renders only that note.
- **Stacking:** each note has a `zIndex`, and the store tracks `topZIndex`. Pressing anywhere on a note calls `bringToFront`, which does nothing if the note is already on top. Stacking is done with `z-index` instead of reordering the DOM, so pointer capture isn't disturbed.
- **Deletion:** dropping a note on the trash calls `deleteNote` in `src/store/undo.store.ts`. That removes the note from the notes store right away and keeps it for `UNDO_TIMEOUT_MS` so `UndoToast` can restore it. Only the latest deletion can be undone. The trash element reaches the drag hook through `TrashZoneContext` (a stable ref, so it never causes re-renders), and the hook hit-tests the pointer against the trash's position measured on pointerdown.
- **Gestures:** each interaction is its own hook in `src/hooks/` (e.g. `useDrawToCreate`, `useDoubleClickToCreate`). Pointer gestures measure the board once on pointerdown, use pointer capture, and keep in-progress values in refs. Visuals during the gesture are written straight to the DOM. The store is updated only on pointerup, so no React state changes while the pointer moves.
- **Positioning:** elements are placed with `transform: translate()` (via `toRectStyle` in `src/utils/geometry.ts`), never `top`/`left`. Coordinates are clamped so notes stay inside the board.
- **Board pointer routing:** the notes layer has `pointer-events: none` (notes opt back in), so a pointer event whose target is the board itself means the user pressed on empty space. Creation hooks rely on that check.

## Commands

Package manager is **pnpm**.

```bash
pnpm dev       # Vite dev server with HMR
pnpm build     # tsc -b (type-check via project references) then vite build → dist/
pnpm lint      # oxlint (not ESLint)
pnpm preview   # serve dist/
```

There's no test runner yet.

## Tooling notes

- Uses TypeScript ~7 and Vite 8 with `@vitejs/plugin-react` (Oxc). React 19 renders under `StrictMode`, so effects run twice in dev.
- `tsconfig.json` only references `tsconfig.app.json` (covers `src/`, DOM libs) and `tsconfig.node.json` (covers `vite.config.ts`). `verbatimModuleSyntax` and `erasableSyntaxOnly` are on, so use `import type` for types and avoid `enum`, `namespace` and constructor parameter properties. `noUnusedLocals` and `noUnusedParameters` are enforced.
- `allowImportingTsExtensions` is on, and the existing code imports with explicit `.tsx` extensions (e.g. `./App.tsx`).
- Oxlint rules are in `.oxlintrc.json`: `react/rules-of-hooks` is an error, and `react/only-export-components` warns. Keep one component per module so fast refresh keeps working.

## Commits

Format: `<type>(<scope>): <subject>`
- type: feat | fix | refactor | perf | docs | style | test | build | ci | chore
- scope: optional, one lowercase word naming the area touched
- subject: imperative mood, lowercase, no trailing period, 72 characters max
