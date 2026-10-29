# Sticky Notes — Requirements

A single-page web application for creating and arranging sticky notes on a board.

## 1. Constraints

| Item | Requirement |
| --- | --- |
| Time budget | Target 3–4 hours. Stop at 6 hours and submit what exists, even if it doesn't work. |
| Language | TypeScript, with accurate static typing (no `any`, no unchecked casts). |
| UI framework | React, **without stock or third-party UI components**. Interactions (drag, resize, drop zones) are built by hand, with no drag-and-drop or component libraries. |
| Platform | Desktop only. Minimum screen resolution **1024×768**. |
| Browsers | Latest versions of Google Chrome (Windows and macOS), Mozilla Firefox (all platforms), Microsoft Edge. |
| Build | If the project needs a build step, document the build and run instructions (see §6). |
| Comments | English only. Comment only where it noticeably helps someone read the code; don't comment everything. |

## 2. Core features (implement at least 3 of 4)

- [ ] **F1. Create a note**: create a new note of a specified size at a specified position (e.g. click-and-drag on empty board space to define its rectangle).
- [ ] **F2. Resize a note**: change a note's size by dragging (e.g. a resize handle).
- [ ] **F3. Move a note**: change a note's position by dragging.
- [ ] **F4. Delete a note**: remove a note by dragging it over a predefined "trash" zone.

The UI for these features should be intuitive and achievable within the time budget.

## 3. Optional features (bonus)

- [ ] **O1. Edit note text**: enter and edit the text of a note.
- [ ] **O2. Bring to front**: the note being interacted with moves above overlapping notes.
- [ ] **O3. Local persistence**: save notes to `localStorage` and restore them on page load.
- [ ] **O4. Note colors**: support different note colors.
- [ ] **O5. REST API persistence**: save notes through a REST API. The API itself may be mocked, but **the mock must be asynchronous**.

## 4. Evaluation criteria

Reviewers will focus most on:

1. **Architecture and design**: clear separation of concerns (state, interaction logic, rendering, persistence).
2. **Performance**: smooth dragging and resizing, with no needless re-renders of unaffected notes.
3. **Code quality**: readable, consistent, idiomatic code.
4. **Static typing accuracy**: precise types for domain models, events, and state transitions.
5. **Usability**: discoverable interactions and clear visual feedback (hover, drag, trash zone highlighting).

## 5. Deliverables

- [ ] Source code of the application.
- [ ] A short **architecture description** (2–3 paragraphs, in English).
- [ ] Build and run instructions (§6).

## 6. Build and run instructions

The project uses Vite + pnpm.

```bash
pnpm install     # install dependencies
pnpm dev         # start dev server
pnpm build       # type-check and produce production build in dist/
pnpm preview     # serve the production build locally
pnpm lint        # run oxlint
```
