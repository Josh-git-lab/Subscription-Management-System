# Brightloop Subscription Management (demo)

Fictional **Brightloop Software** console: plan catalog, customer subscriptions, idempotent invoice billing, and role-based admin/staff tools. Single Next.js app (App Router), Prisma + SQLite, Auth.js credentials, Zod-validated server actions.

## Setup

```powershell
cd "e:\Projects\Subscription Management System"
copy .env.example .env
# Set: AUTH_SECRET, DATABASE_URL, SITE_URL (HTTPS in prod), SEED_* passwords
npm install --legacy-peer-deps
npm run db:migrate
npm run db:seed
npm run dev
```

Dev uses `next dev --webpack` (recommended on Windows paths with spaces).

`npm run build` runs `prisma generate`, then `next build --webpack`. Generate reads `DATABASE_URL` and does not open a connection. The datasource provider is SQLite, so that URL must start with `file:`. A hosted Postgres URL fails generate until the provider is changed.

## Seed accounts (passwords only via env)

| Role     | Email                     | Env var                 |
|----------|---------------------------|-------------------------|
| Admin    | `admin@gmail.com`         | `SEED_ADMIN_PASSWORD`   |
| Staff    | `staff@brightloop.local`  | `SEED_STAFF_PASSWORD`   |
| Customer | `customer@brightloop.local` | `SEED_CUSTOMER_PASSWORD` |

Never commit `.env` or real passwords. Seed refuses to run when `NODE_ENV=production`.

## 3-minute demo script

1. **Customer** — Log in → `/plans` → **Subscribe** on a plan → `/my-subscriptions` (ACTIVE) → optional **Cancel** (CLOSED).
2. **Admin or staff** — Log in → `/admin/invoices` → **Run billing** (note count) → run again (**0** new invoices for same period) → **Record payment** until invoice **PAID**.
3. **Dashboard** — `/admin/dashboard`: active subscriptions, outstanding (minor units), overdue count. Optionally `/admin/subscriptions` (search/filter) and `/admin/settings` (tax/discount rules).

## Known gaps vs a full quote-to-cash PDF spec

- No real payment gateway or emailed invoices (reset links log to console in dev only).
- No MFA for admin; in-memory rate limits (not Redis).
- Product catalog / variant UI not built; tax & discount are **settings + invoice math**, not merchandising workflows.
- `og:image`, Search Console, and production hardening (CSP tighten, audit) deferred.
- Windows: prefer a repo path **without spaces**; use webpack dev/build flags documented in `ROADMAP.md`.

## Scripts

| Command        | Purpose              |
|----------------|----------------------|
| `npm run dev`  | Dev server (webpack) |
| `npm run build`| Production build     |
| `npm run lint` | ESLint               |
| `npm run typecheck` | `tsc --noEmit`  |
| `npm run test` | Vitest               |
| `npm run db:*` | Prisma migrate/seed  |

See `ROADMAP.md` for plan history and detours.
