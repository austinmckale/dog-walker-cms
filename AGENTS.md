# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages, API routes, layouts, and styles (`globals.css`).
- `components/`: Reusable React components (e.g., `Navigation.tsx`, `WalkPlanCard.tsx`).
- `hooks/`: Custom React hooks (e.g., `useWalkTracker.ts`).
- `lib/`: Client utilities (`sanity.ts`, `supabase/`).
- `schemaTypes/`: Sanity schema definitions (`dog.ts`, `walkPlan.ts`, `walkReport.ts`).
- `db/migrations/`: Database migrations.
- `static/`, `types/`: Static assets and shared TypeScript types.

## Build, Test, and Development Commands
- `npm run dev`: Start Next.js dev server at `http://localhost:3000`.
- `npm run build`: Production build (type-checks and optimizes).
- `npm start`: Run the production build locally.
- `npm run lint`: Lint project using Next.js ESLint config.
- `npm run sanity:dev|start|build|deploy`: Sanity Studio workflows.

Node: use `nvm use` (see `.nvmrc`, Node 20). Env: copy `.env.example` to `.env.local` and fill values.

## Coding Style & Naming Conventions
- Language: TypeScript + React (App Router).
- Formatting: Prettier (no semicolons, single quotes, 100 col width). Run via your editor.
- Linting: Next.js ESLint (`.eslintrc.json`, `eslint.config.mjs`). Fix warnings before PR.
- Indentation: 2 spaces; filenames `PascalCase` for components, `camelCase` for functions/variables.
- Imports: prefer alias `@` to project root (see `next.config.js`).

## Testing Guidelines
- No test runner is configured yet. Recommended: Vitest for unit tests and Playwright for e2e.
- Place unit tests in `__tests__/` or alongside files as `*.test.ts(x)`.
- Cover critical flows: booking, auth, walk tracking, Sanity/Supabase clients.
- Aim for >80% coverage on core lib/hooks once tests exist.

## Commit & Pull Request Guidelines
- Commits: prefer Conventional Commits (`feat:`, `fix:`, `chore:`). Imperative, present tense.
  - Example: `feat: add GPS live tracking to WalkPlanCard`
- Branches: `feature/<short-desc>` or `fix/<short-desc>`.
- PRs: clear description, linked issue(s), before/after screenshots for UI, and checklist:
  - Updated docs if behavior changes; ran `npm run lint`; verified build (`npm run build`).

## Security & Configuration Tips
- Secrets live in `.env.local` (never commit). Required keys in `.env.example`.
- Sanity IDs/tokens and map tokens are needed for full functionality.
- Images are served from `cdn.sanity.io` (see `next.config.js`).
