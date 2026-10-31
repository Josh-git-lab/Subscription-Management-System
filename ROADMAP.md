# Brightloop Subscription Management: Roadmap

AUTO_ADVANCE: ask

Current step: 8 (DONE — thin review pass)

## Project summary (do not lose this)

One Next.js app at **repo root** (`src/`, single `package.json`) for Brightloop Software: accounts, plans, subscribe, billing runs, invoice payments, admin/staff views. **Prisma at repo-root `prisma/`**. Stack: SQLite dev, Auth.js credentials (JWT), bcryptjs, Zod, Tailwind + shadcn/ui, Vitest. Money as integer minor units. Secrets in env only.

## Demo spine — SHIPPED

- [x] Prisma, auth, customer + admin flows, idempotent billing, dashboard KPIs
- [x] Quote-to-cash extensions: lifecycle, tax/discount on invoices, staff, reset password, my invoices

## Steps (original plan)

| Step | Status | Notes |
|------|--------|-------|
| 1 Scaffold | DONE | |
| 2 Database | DONE | |
| 3 Auth | DONE | in-memory rate limit |
| 4 Plans | DONE | |
| 5 Subscribe | DONE | |
| 6 My subs + cancel | DONE | |
| 7 Admin subs list | DONE | |
| 8 Review pass | DONE | 2026-10-31 thin pass: SITE_URL reset links, robots/sitemap, public SEO, README, a11y spot-check |

## Detours log

- 2026-10-31: Production build fix (post step 8). `favicon.ico` is a file; Windows `readlink` returns EISDIR for normal files. Build runs `prisma generate` then Next with a readlink shim. Pages that read the database, session, or search params set `instant = false`. Header session is behind Suspense. `DATABASE_URL` must be set for generate and must be a `file:` URL while the provider is sqlite.

## Backlog

- `og:image` and richer marketing SEO
- Redis rate limiter + MFA for admin
- Real email (password reset, invoices) and payment gateway
- Product variant / quotation template **UI** (rules exist in admin settings)
- Move repo to path without spaces for Turbopack

## Decisions

- **Git:** `origin` → `Josh-git-lab/Subscription-Management-System`; demo commit on `main`.
- **Prisma:** `prisma/` at repo root; `*.db` gitignored.
- **Dev/build:** `--webpack` on Windows path with spaces.
- **Seed:** `admin@gmail.com`, `staff@brightloop.local`, `customer@brightloop.local`; passwords from `SEED_*_PASSWORD` only.
