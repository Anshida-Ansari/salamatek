# Salamatek Medical Centre — Monorepo

A production-ready bilingual (English/Arabic) healthcare website for **Salamatek Medical Centre**, built as a full-stack monorepo.

---

## Tech Stack

| Layer      | Technology                       |
|------------|----------------------------------|
| Frontend   | Next.js 14, TypeScript, Tailwind CSS |
| Admin      | Next.js 14, TypeScript, Tailwind CSS |
| Backend    | Node.js, Express, TypeScript     |
| Database   | MongoDB                          |
| Monorepo   | npm workspaces                   |

---

## Repository Structure

```
salamatek/
├── apps/
│   ├── web/          # Public-facing website (@salamatek/web)
│   └── admin/        # Admin dashboard (@salamatek/admin)
├── server/
│   └── api/          # Express REST API (@salamatek/api)
├── packages/
│   ├── types/        # Shared TypeScript types (@salamatek/types)
│   ├── validation/   # Shared Zod schemas (@salamatek/validation)
│   ├── config/       # Shared config & constants (@salamatek/config)
│   └── ui/           # Shared React components (@salamatek/ui)
├── docs/             # Architecture & phase documentation
├── tsconfig.base.json
├── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** >= 20.0.0 ([nvm](https://github.com/nvm-sh/nvm): `nvm use`)
- **npm** >= 10.0.0

---

## Getting Started

```bash
# Install all dependencies
npm install

# Start all apps in development mode
npm run dev

# Or start individual apps
npm run dev -w @salamatek/web      # Public website   → http://localhost:3000
npm run dev -w @salamatek/admin    # Admin dashboard  → http://localhost:3001
npm run dev -w @salamatek/api      # API server       → http://localhost:4000
```

---

## API Health Check

```bash
curl http://localhost:4000/api/v1/health
# → { "status": "ok", "timestamp": "...", "version": "...", "environment": "development" }
```

---

## Available Scripts

| Command               | Description                                  |
|-----------------------|----------------------------------------------|
| `npm run dev`         | Start all apps in development mode           |
| `npm run build`       | Build all apps for production                |
| `npm run lint`        | Lint all packages                            |
| `npm run typecheck`   | TypeScript type-check all packages           |
| `npm run clean`       | Remove all build artifacts                   |

---

## Environment Variables

Each app has a `.env.example` file. Copy to `.env.local` and fill in values:

```bash
cp apps/web/.env.example        apps/web/.env.local
cp apps/admin/.env.example      apps/admin/.env.local
cp server/api/.env.example      server/api/.env
```

---

## Git Branching Strategy

| Branch            | Purpose                         |
|-------------------|---------------------------------|
| `main`            | Production — never commit directly |
| `dev`             | Integration — merge feature branches here |
| `feat/<name>`     | Feature development             |

---

## Documentation

- [Architecture Decisions](./docs/architecture.md)
- [Phase Roadmap](./docs/phases.md)

---

## Phases

| Phase | Status   | Description                          |
|-------|----------|--------------------------------------|
| 0     | ✅ Done  | Monorepo foundation & tooling setup  |
| 1     | ⏳ Next  | Public website — Home page           |
| 2     | 🔜 Later | Remaining public pages               |
| 3     | 🔜 Later | Admin dashboard                      |
| 4     | 🔜 Later | Backend API & database integration   |
