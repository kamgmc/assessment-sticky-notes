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

So far there's only the static layout: `App` stacks a `Toolbar` header above a full-height `Board` canvas with a dotted grid. Page-level layout components live in `src/layout/`. Each component gets its own directory named in lowercase kebab-case (e.g. `trash-zone/`), holding `<Name>.tsx` and a matching BEM-style `<Name>.css`, and the design tokens (colors, fonts) are CSS custom properties on `:root` in `src/index.css`.

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
