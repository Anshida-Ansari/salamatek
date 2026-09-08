# Architecture Decisions — Salamatek Monorepo

## Overview

This document records key architecture decisions made during the project build.

---

## ADR-001 — Monorepo Structure

**Decision**: Single repository with npm workspaces.

**Rationale**:
- Shared types and validation across frontend, admin, and API
- Single `npm install` for all dependencies
- Atomic commits across all packages
- Easier to enforce consistent tooling (ESLint, TypeScript)

**Structure**:
```
apps/      → Next.js applications (web, admin)
server/    → Express API
packages/  → Shared internal libraries
```

---

## ADR-002 — Package Manager: npm

**Decision**: npm with workspaces (npm >=10.0.0).

**Rationale**: Standard toolchain, no extra global installs required, native workspaces support since npm 7.

---

## ADR-003 — Next.js App Router

**Decision**: Next.js 14 with the App Router (not Pages Router).

**Rationale**:
- Current Next.js standard
- Server Components for improved performance
- Better SEO with server-side metadata generation
- Built-in layouts for shared UI

---

## ADR-004 — Strict TypeScript

**Decision**: `strict: true` in `tsconfig.base.json` plus additional strict flags.

**Rationale**: Prevents runtime bugs early, enforces consistent patterns across the team, makes refactoring safer.

Flags enabled:
- `strict`
- `noUncheckedIndexedAccess`
- `noImplicitOverride`
- `noUnusedLocals` / `noUnusedParameters`
- `exactOptionalPropertyTypes`

---

## ADR-005 — Shared Packages

**Decision**: Four internal packages under `packages/`.

| Package              | Purpose                                |
|----------------------|----------------------------------------|
| `@salamatek/types`   | TypeScript type definitions            |
| `@salamatek/validation` | Zod schemas (used by both API and frontend) |
| `@salamatek/config`  | Site constants, nav routes, locale config |
| `@salamatek/ui`      | Shared React components                |

Packages are consumed via workspace: `"@salamatek/types": "*"`.

Next.js apps use `transpilePackages` to handle TypeScript source directly (no build step required for packages in development).

---

## ADR-006 — i18n Strategy

**Decision**: Next.js built-in i18n routing for English (`en`) and Arabic (`ar`).

**Rationale**:
- No external i18n library needed for Phase 0-1
- RTL support via CSS `dir` attribute and `[dir='rtl']` selectors
- Arabic font (Noto Kufi Arabic) loaded separately via `next/font`

---

## ADR-007 — API Design

**Decision**: REST API with versioned routes (`/api/v1/`).

**Rationale**:
- Versioning allows non-breaking API evolution
- Express chosen for simplicity and ecosystem familiarity
- Helmet + CORS + Morgan for baseline security and observability

---

## ADR-008 — Environment Variables

**Decision**: Each app owns its own `.env.example`. Database credentials and secrets only live in the API server.

**Principles**:
- `NEXT_PUBLIC_*` vars are the only ones sent to browser
- No database URIs or secrets in frontend packages
- `.env` files are gitignored; `.env.example` is committed

---

## ADR-009 — Git Branching

| Branch        | Role                              |
|---------------|-----------------------------------|
| `main`        | Production — never commit directly |
| `dev`         | Integration — merge features here  |
| `feat/<name>` | Feature branches                  |

Every phase ends with a passing lint + typecheck + build before any merge.
