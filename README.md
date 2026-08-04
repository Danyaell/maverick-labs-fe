# Maverick Labs FE

> Frontend for the Maverick Labs application. It is a React + TypeScript app built with Vite that presents a game catalog and a detailed game view backed by a separate backend API.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-19-darkblue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)

## Overview

The current experience includes:

- A game catalog page with game cards.
- A game detail page that loads stage data from the backend.
- Interactive stage selection so users can inspect a selected stage’s boss, weapon reward, and collectibles.
- Shared loading and error states for asynchronous requests.
- Asset loading from local game images via a helper in the frontend.

## Tech Stack

- React 19
- TypeScript 6
- Vite 8
- React Router 8
- ESLint
- Vitest
- Testing Library

## Project Structure

- `src/main.tsx` — application entry point.
- `src/app/` — app shell, router, and page-level routing.
  - `App.tsx` — root layout.
  - `router.tsx` — route definitions.
  - `pages/` — shared page components such as the not-found view.
- `src/features/games/` — game feature implementation.
  - `api/gameApi.ts` — API calls for game lists and detail payloads.
  - `components/` — game cards, stage cards, and stage detail UI components.
  - `pages/` — catalog and detail screens.
  - `types/game.types.ts` — domain types for games, stages, bosses, weapons, and collectibles.
- `src/shared/` — shared infrastructure.
  - `api/httpClient.ts` — common fetch wrapper with error handling.
  - `components/` — reusable loading and error state components.
  - `config/env.ts` — environment configuration for the API base URL.
- `src/utils/assets.ts` — helper that resolves frontend game asset paths from backend asset keys.
- `src/test/setup.ts` — global test configuration.

## Environment Variables

The frontend expects the API base URL to be provided through the following variable:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

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

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the required API environment variable.
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open the local URL shown by Vite in the browser.

## Production Build

```bash
npm run build
```

## Linting

```bash
npm run lint
```

## Testing

```bash
npm run test
npm run test:run
npm run test:coverage
```

## Conventions

- Use functional React components.
- Prefer `import type` for TypeScript-only imports.
- Avoid `any` unless clearly justified.
- Do not include `console.log` in production code.
- Keep route definitions centralized in `src/app/router.tsx`.
- Place API logic in feature services rather than in presentational components.
- Keep feature code within `src/features/<feature-name>/`.

## Notes

- The application is private and does not publish a package.
- The frontend consumes a separate backend API and expects the base URL to be configured through `VITE_API_BASE_URL`.
- The test environment is configured in `vite.config.ts` with the `jsdom` environment and the setup file in `src/test/setup.ts`.

## Contributing

Contributions and review suggestions are welcome.

1. Create a focused branch.
2. Keep structure thin and place components clean.
3. Add or update tests for behavioral changes.
4. Run the complete test suite before opening a pull request.

## License and disclaimer
Maverick Labs is a fan-made educational and portfolio project. Mega Man, Mega Man X, character names, and related properties belong to their respective trademark and copyright owners. This project is not affiliated with or endorsed by Capcom.


## Author

Created by [Danyaell Martínez Ortiz](https://github.com/Danyaell).
