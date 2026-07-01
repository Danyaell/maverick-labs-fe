# Maverick Labs FE

`maverick-labs` web application frontend.

## Description

React + TypeScript application built with Vite. It provides a catalog of games and details for each game, consuming an external API from the frontend.

## Tech Stack

- React 19
- TypeScript 6
- Vite 8
- React Router 8
- ESLint
- Vitest

## Structure

- `src/main.tsx` - application entry point.
- `src/app/App.tsx` - root component.
- `src/app/router.tsx` - routes definer.
- `src/app/pages/` - main pages of the app.
- `src/features/games/` - game selection feature.
  - `api/` - HTTP calls service.
  - `components/` - shared components.
  - `pages/` - selection and detail screens.
  - `types/` - types definitions.
- `src/shared/` - utilities and shared components.
  - `api/httpClient.ts` - common HTTP client.
  - `components/` - load and error states.
  - `types/` - shared global types.
- `src/test/setup.ts` - tests global config.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run test
npm run test:run
npm run test:coverage
```

## Execute on dev

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start Vite server:
   ```bash
   npm run dev
   ```
3. Open url on browser.

## Production build

```bash
npm run build
```

## Linter

```bash
npm run lint
```

## Tests

```bash
npm run test
npm run test:run
npm run test:coverage
```

## Conventions

- Use functional React components.
- Prefer `import type` for TypeScript types.
- Avoid `any` unless clearly justified.
- Do not include `console.log` in production code.
- Keep routes centralized in `src/app/router.tsx`.
- Place API logic in services, not presentational components.
- Keep feature code within `src/features/<feature-name>/`.

## Additional notes

- The project is private and does not publish a package.
- The frontend consumes a separate backend API.
- The test configuration is in `vite.config.ts` with the `jsdom` environment and the setup file is in `src/test/setup.ts`.
