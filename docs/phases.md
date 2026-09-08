# Phase Roadmap — Salamatek Medical Centre

## Phase 0 — Monorepo Foundation ✅

**Branch**: `feat/project-setup`

- Monorepo initialized with npm workspaces
- Shared packages scaffolded: types, validation, config, ui
- Express API with health-check endpoint
- Next.js public website shell (bilingual-ready)
- Next.js admin dashboard shell
- TypeScript, ESLint, Tailwind CSS configured
- Environment variable structure established
- README and architecture docs

---

## Phase 1 — Public Website: Home Page

**Branch**: `feat/web-home`

- Header / navigation (EN + AR, RTL)
- Hero section
- Key services section
- Why choose us section
- Departments preview
- Doctors preview
- CTA sections
- Footer
- WhatsApp button
- SEO metadata

---

## Phase 2 — Public Website: Remaining Pages

**Branch**: `feat/web-pages`

- About page
- Departments listing + detail
- Services listing + detail
- Doctors listing + detail
- Health Packages & Offers
- SARC page
- Careers + Job Vacancies
- News & Blog listing + article
- Contact page with Google Maps

---

## Phase 3 — Admin Dashboard

**Branch**: `feat/admin-dashboard`

- Authentication (NextAuth)
- Dashboard layout with sidebar
- CRUD for all content entities
- Image upload
- Job applications management
- Appointment enquiries inbox

---

## Phase 4 — Backend API & Database

**Branch**: `feat/api-database`

- MongoDB models for all entities
- REST endpoints for all resources
- Authentication middleware (JWT)
- File upload (media)
- Input validation (Zod)
- Rate limiting
- API documentation

---

## Phase 5 — Integrations & Polish

**Branch**: `feat/integrations`

- Analytics (Google Analytics / Matomo)
- Live chat integration (TBD)
- Appointment booking / enquiry flow
- Performance optimisation
- Lighthouse audit pass
- Staging deployment
- SEO final audit
