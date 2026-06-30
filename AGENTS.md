# AGENTS.md

## Project overview

This is the frontend for Maverick Labs.

The app is built with:

* React
* TypeScript
* Vite
* React Router
* ESLint

The frontend consumes a separate Java 21 + Spring Boot backend API.

## Project structure

Use this structure unless there is a strong reason to change it:

```txt
src/
  main.tsx
  index.css
  app/
    App.tsx
    router.tsx
    pages/
  features/
    games/
      components/
      pages/
      services/
      types/
  shared/
    api/
    components/
    hooks/
    utils/
```

## Development commands

From the frontend root:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

Before considering a task complete, run:

```bash
npm run lint
npm run build
```

## Coding rules

* Use React function components.
* Use TypeScript strictly.
* Prefer named exports for components, pages, services, hooks, and types.
* Keep `main.tsx` as the app entry point.
* Keep route definitions centralized in `src/app/router.tsx`.
* Keep feature-specific code inside `src/features/<feature-name>/`.
* Keep reusable generic code inside `src/shared/`.
* Use `import type` when importing TypeScript-only types.
* Do not use `enum`; prefer literal unions or `as const` objects.
* Do not leave `console.log` in production code.
* Do not use `any` unless there is a clear justification.
* Do not create large refactors unless explicitly requested.

## React rules

* Use React Router for routing.
* Pages should live inside `pages/`.
* Reusable UI elements should live inside `components/`.
* Do not put API calls directly inside presentational components.
* Keep components small and focused.

## API rules

* Backend API calls should be isolated in feature service files, for example:

```txt
src/features/games/services/gameService.ts
```

* API response types should be defined in feature `types/` folders.
* Do not hardcode backend URLs inside components.
* Use environment variables for API base URLs when needed.

## Dependency rules

* Do not add new production dependencies without explaining why.
* Prefer built-in React and TypeScript patterns before adding libraries.
* Do not add state management libraries like Redux, Zustand, or Jotai unless the project clearly needs them.
* Do not replace Vite with Next.js unless explicitly requested.

## Style

* Prioritize simple, readable, maintainable code.
* Prefer explicit names over clever abstractions.
* Avoid premature abstraction.
* Keep changes small and easy to review.
