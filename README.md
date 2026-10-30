# Sticky Notes

A single-page sticky notes board built with React 19 and TypeScript. Notes can be created, moved, resized, edited, recolored and deleted.

## Features

**Core**

- **Create a note** at a chosen position and size. Drag on empty board space to draw its rectangle, or double-click to drop a default-size note.
- **Move a note** by dragging its top bar.
- **Resize a note** by dragging its bottom-right corner.
- **Delete a note** by dropping it on the trash zone in the bottom-right corner. An undo message lets you restore it for 5 seconds.

**Optional**

- **Edit note text** directly in the note.
- **Bring to front:** pressing a note raises it above overlapping notes.
- **Colors:** pick the color for new notes in the toolbar, or change a note's color from the swatches in its top bar.

## Getting started

Requirements: [Node.js](https://nodejs.org/) `^20.19.0 || >=22.12.0` and [pnpm](https://pnpm.io/).

```bash
pnpm install     # install dependencies
pnpm dev         # start the dev server at http://localhost:5173
```

Other scripts:

```bash
pnpm build       # type-check (tsc -b) and build for production into dist/
pnpm preview     # serve the production build locally
pnpm lint        # lint with oxlint
```

The app is built for desktop browsers (latest Chrome, Firefox and Edge) at a resolution of 1024×768 or larger.

## Usage

| Action | How |
| --- | --- |
| Create a note | Drag on empty board space, or double-click it |
| Move | Drag the note's top bar |
| Resize | Drag the note's bottom-right corner |
| Edit text | Click inside the note; press Esc to stop editing |
| Change color | Hover over the note and pick a swatch in its top bar |
| Color for new notes | Pick a swatch in the toolbar |
| Delete | Drag the note onto the trash, then use **Undo** within 5 seconds if needed |

## Architecture

The UI is split into page-level layout components (`Toolbar`, `Board`) and reusable components (`NoteCard`, `NoteText`, `TrashZone`, `ColorPicker`, `UndoToast`). Application state lives in small [Zustand](https://github.com/pmndrs/zustand) stores outside the React tree. The notes store keeps notes in a dictionary keyed by ID (`Record<NoteId, Note>`), so a note can be read, updated or removed without scanning a list. A UI store holds the color for new notes, and an undo store keeps the most recently deleted note for five seconds. Rendering is isolated per note: the board subscribes only to the list of note IDs (shallow-compared), each memoized `NoteCard` subscribes only to its own position, size, stacking order and color, and the `NoteText` inside it subscribes only to its text. As a result, typing re-renders only one text area, and moving or resizing a note never re-renders the others.

Every pointer interaction (draw-to-create, double-click-to-create, drag, resize) is its own custom hook in `src/hooks/`, and they all follow the same pattern. On `pointerdown` the hook measures the board once, captures the pointer, and keeps the gesture's working values in a ref. On `pointermove` it writes directly to the element's style, positioning with `transform: translate()` so moves skip layout. On `pointerup` it saves the result to the store in a single update. No React state changes while the pointer moves, which keeps dragging smooth. Coordinates are clamped so notes stay inside the board. The trash zone is shared with the drag hook through a context holding a stable ref, and the hook hit-tests the pointer against the trash's bounds measured when the drag starts. Stacking order is a `zIndex` stored on each note instead of DOM order, so raising a note never moves its element in the middle of a gesture.

Deletion is optimistic. Dropping a note on the trash removes it from the board immediately, with no confirmation dialog, while the undo store keeps it for five seconds so the toast can restore it exactly as it was. Types are strict throughout: geometry is modeled as `Point`, `Size` and `Rect`, a `Note` extends `Rect`, and `NoteColor` is derived from the `NOTE_COLORS` constant, so the list of colors is defined in one place. Styling is plain CSS: design tokens are CSS custom properties, each component has a BEM-style stylesheet, and note colors are applied with `data-color` attributes rather than inline styles.

## Project structure

```
src/
├── components/   # reusable UI components, one kebab-case folder each
├── context/      # React context for the trash zone ref
├── hooks/        # gesture hooks (create, drag, resize)
├── layout/       # page-level layout: board, toolbar
├── store/        # Zustand stores (notes, ui, undo)
├── types/        # geometry and note types
├── utils/        # geometry helpers
├── constants.ts  # sizes, colors, timings
└── main.tsx      # entry point
```
