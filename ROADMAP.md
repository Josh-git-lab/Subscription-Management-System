# Brightloop Subscription Management: Roadmap

AUTO_ADVANCE: ask

Current step: — **DEMO SPINE COMPLETE — STOP for review** (was Steps 2–7 timebox)

## Project summary (do not lose this)

One Next.js app at **repo root** (`src/`, single `package.json`) for Brightloop Software: accounts, plans, subscribe, billing runs, invoice payments, admin/staff views. **Prisma at repo-root `prisma/`** (sibling to `src/`). Stack: SQLite dev, Auth.js credentials (JWT), bcryptjs, Zod, Tailwind + shadcn/ui, Vitest. Money as integer minor units. Secrets in env only.

## Demo spine (2026-10-31 timebox) — SHIPPED for review

- [x] Prisma: User (ADMIN|STAFF|CUSTOMER), Plan, Subscription, Invoice, Payment; seed + `db:*`
- [x] Auth.js credentials; register = CUSTOMER only; middleware role gates
- [x] Customer: `/plans`, subscribe (planId → ACTIVE), `/my-subscriptions`, cancel → CLOSED
- [x] Admin/Staff: `/admin/subscriptions` (search, status, pagination), `/admin/invoices`, billing run (idempotent)
- [x] Record payment → updates amountDue/amountPaid → PAID when due = 0
- [x] `/admin/dashboard` cards: activeSubs, outstanding, overdueCount

**Not built (explicit):** product variants UI, quotation templates, discount rules UI, real payment gateway, second frontend/backend apps, full SEO pass.

## Original steps (reference)

| Step | Status | Notes |
|------|--------|-------|
| 1 Scaffold | DONE | |
| 2 Database | DONE | via demo spine |
| 3 Auth | DONE | rate limit in-memory; no MFA |
| 4 Plans | DONE | `/plans` metadata partial |
| 5 Subscribe | DONE | |
| 6 My subs + cancel | DONE | |
| 7 Admin subs list | DONE | |
| 8 Review pass | NOT STARTED | deferred |

## Detours log

- 2026-10-31 | git init | a | .git | none
- 2026-10-31 | brightloop-platform folders | b/c | superseded |
- 2026-10-31 | Single app at root + `prisma/` at root (not only under backend) | b | layout |
- 2026-10-31 | **3h timebox demo spine** (Steps 2–7 merged) | b | see git diff | Step 8 only remaining from original plan
- 2026-10-31 | P0: fix corrupted `jose`/`@panva/hkdf`, pin deps, `dev --webpack` | a | package.json, next.config.ts | none
- 2026-10-31 | Admin login email `admin@gmail.com`; password only in `SEED_ADMIN_PASSWORD` | a | prisma/seed.ts, .env | none
- 2026-10-31 | Demo UI polish (shell, pages, INR formatting, role nav; same server actions) | a | src/app, src/components, src/lib/money, src/actions/auth.ts | none
- 2026-10-31 | Full SaaS UI pass (admin shell, marketing home/footer, skeletons, 404, router.refresh) | a | src/app, src/components | none
- 2026-10-31 | Tailwind CSS not compiled under webpack; add @tailwindcss/postcss | a | postcss.config.mjs, package.json, next.config.ts | none
- 2026-10-31 | Quote-to-cash pack: reset password, staff role, my invoices, idempotent billing, lifecycle, tax/discount, collected KPI | a | prisma, src/actions, src/app | none |

## Backlog

- Step 8 security/SEO/a11y pass
- `og:image`, sitemap, robots
- Redis rate limiter
- MFA for admin
- Product / Tax / Discount models (only Invoice/Payment shipped)
- **Windows path with spaces:** prefer `E:\Projects\brightloop` (no spaces). Turbopack junction panic + webpack readlink issues on `Subscription Management System`. Dev/build use `--webpack` until relocated.

## Decisions and assumptions

- **Prisma home:** `prisma/schema.prisma`, `prisma/migrations/`, `prisma/seed.ts`, DB file `prisma/dev.db`. Client: `src/lib/db/prisma.ts`.
- **Billing run:** server action `runBillingAction` (not API route — build workaround).
- **Build:** `npm run build` uses `--webpack`; Turbopack build fails with Prisma on this Windows path.
- **Seed users:** `admin@gmail.com`, `staff@brightloop.local`, `customer@brightloop.local` — passwords from `SEED_*_PASSWORD` env vars only.

## How to demo locally

```powershell
cd "e:\Projects\Subscription Management System"
# .env: DATABASE_URL, AUTH_SECRET, SITE_URL, SEED_* passwords
npm run db:migrate
npm run db:seed
npm run dev
```

1. Log in as customer → `/plans` → Subscribe → `/my-subscriptions`
2. Log in as admin/staff → Run billing on `/admin/invoices` (second run → 0 new)
3. Record payment → invoice PAID; check `/admin/dashboard`
