# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Recipot is a recipe recommendation app built as a **Turborepo monorepo** with:
- **apps/web**: Next.js 15 (App Router) web application
- **apps/mobile**: Expo + expo-router React Native app
- **packages/api**: Axios-based API client layer
- **packages/contexts**: Auth context and Zustand stores
- **packages/types**: Shared TypeScript types
- **packages/utils**: Shared utilities (cookie management)

## Commands

```bash
# Development
pnpm dev              # Run web + mobile in parallel
pnpm dev:web          # Web dev server (localhost:3000)
pnpm dev:mobile       # Mobile dev server (Expo)

# Quality
pnpm lint             # ESLint
pnpm lint:fix         # Auto-fix linting issues
pnpm typecheck        # TypeScript checking
pnpm test             # Run tests with coverage
pnpm format           # Prettier formatting

# Build
pnpm build            # Build all apps

# Web-specific
pnpm web storybook    # Storybook dev server (port 6006)
```

## Architecture

### State Management (Three Layers)

1. **Component State (useState)**: Form inputs, modal open/close, local UI
2. **Global State (Zustand)**: User auth (`packages/contexts/authStore.ts`), UI stores (`apps/web/src/stores/`)
3. **Server State (TanStack React Query)**: API data with caching

### API Layer (`packages/api`)

- `createApiInstance.ts` factory creates Axios instances with:
  - Auto-switching between MSW (local), dev backend, production OAuth
  - Token refresh via interceptors (stored in `auth-storage` localStorage)
  - Guest session support via `X-Guest-Session` header
  - Global error handler integration

### Environment Modes

```
NEXT_PUBLIC_APP_ENV:
- "local"       → MSW mocking enabled, debug API
- "development" → Real API + debug tokens
- "production"  → Real API + OAuth cookies
```

### Key Patterns

**Container-Presenter**: For complex components with server data
```typescript
// Container handles logic
export function RecipeCardContainer({ recipeId }) {
  const { data } = useRecipeQuery(recipeId);
  return <RecipeCardPresenter recipe={data} />;
}
// Presenter is pure UI
export function RecipeCardPresenter({ recipe }) { /* JSX only */ }
```

**Custom Hooks**: Extract reusable logic to `apps/web/src/hooks/`

**Page Components**: Page-specific components go in `_components/` directories within the route folder

### Component Organization

- `components/ui/`: shadcn components (do not modify)
- `components/common/`: Wrapped reusable components
- `app/*/_components/`: Page-specific components

### Route Groups (Next.js App Router)

- `(auth)/`: Authentication flows
- `(main)/`: Main content pages
- `(recipeRecommend)/`: Recipe recommendation flow

### Path Aliases

```
@/*              → apps/web/src/*
@recipot/api     → packages/api
@recipot/types   → packages/types
@recipot/contexts → packages/contexts
@recipot/utils   → packages/utils
```

## Code Quality Thresholds

- File size: max 200 lines (refactor immediately)
- Function size: max 50 lines
- Props per component: max 8
- useState per component: max 5
- Nesting depth: max 4 levels (use early returns)

## Branch Strategy

```
feat/<domain>/<task>  →  feat/<domain>  →  dev  →  main (tag: v1.0.x)
```

PR title format: `[<app>] <domain>: <task>`

## Testing

- **Unit**: Vitest + React Testing Library
- **E2E**: Playwright
- **Visual**: Storybook
- **API Mocking**: MSW (handlers in `apps/web/src/mocks/handlers/`)
