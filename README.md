# Brightloop Subscription Management (demo)

Fictional **Brightloop Software** console: plan catalog, customer subscriptions, idempotent invoice billing, and role-based admin/staff tools. Single Next.js app (App Router), Prisma + **PostgreSQL**, Auth.js credentials, Zod-validated server actions.

## Live demo (for interviews)

**App:** [https://brightloop-odoo-mumble.vercel.app](https://brightloop-odoo-mumble.vercel.app)  
**Log in:** [https://brightloop-odoo-mumble.vercel.app/login](https://brightloop-odoo-mumble.vercel.app/login)

These accounts are seeded in the **production** Postgres database (demo only — not for real users):

| Role | Email | Password | After login |
|------|--------|----------|-------------|
| **Admin** | `admin@gmail.com` | `admin1234` | `/admin/dashboard` (full console + billing rules) |
| **Staff** | `staff@brightloop.local` | `StaffTest!234` | `/admin/dashboard` (no Staff admin-only pages) |
| **Customer** | `customer@brightloop.local` | `CustomerTest!234` | `/plans` → subscribe, `/my-subscriptions`, `/my-invoices` |

Quick path for reviewers: log in as **Admin** → open **Console** → **Invoices** → **Run billing** → **Record payment** on an invoice. Plans are public at `/plans` (Basic, Pro, Team).

To re-seed production with the same passwords, set `SEED_ADMIN_PASSWORD=admin1234`, `SEED_STAFF_PASSWORD=StaffTest!234`, and `SEED_CUSTOMER_PASSWORD=CustomerTest!234` when running `npm run db:seed` locally against the production `DATABASE_URL`.

## Setup (local)

Use a Postgres database (Neon free tier, Supabase, or Docker Postgres).

```powershell
cd "e:\Projects\Subscription Management System"
copy .env.example .env
# Set: AUTH_SECRET, DATABASE_URL (postgresql://...), SITE_URL, SEED_* passwords
npm install --legacy-peer-deps
npm run db:migrate
npm run db:seed
npm run dev
```

Dev uses `next dev --webpack` (recommended on Windows paths with spaces).

`npm run build` runs `prisma generate`, then `next build --webpack`. `DATABASE_URL` must be set (Postgres connection string); generate does not open a connection.

### Docker Postgres (optional)

```powershell
docker run --name brightloop-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=brightloop -p 5432:5432 -d postgres:16
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/brightloop
```

## Seed accounts (local)

Use the same emails as production; passwords come from env when you run `npm run db:seed`:

| Role     | Email                     | Env var                 | Suggested demo value (matches production seed) |
|----------|---------------------------|-------------------------|-----------------------------------------------|
| Admin    | `admin@gmail.com`         | `SEED_ADMIN_PASSWORD`   | `admin1234`                                   |
| Staff    | `staff@brightloop.local`  | `SEED_STAFF_PASSWORD`   | `StaffTest!234`                               |
| Customer | `customer@brightloop.local` | `SEED_CUSTOMER_PASSWORD` | `CustomerTest!234`                          |

Never commit `.env`. Seed refuses to run when `NODE_ENV=production` (run seed from your machine against the production `DATABASE_URL` instead).

## Vercel production database

1. Create a Postgres database (Vercel Storage → Neon, or Supabase) and copy the **`postgresql://`** connection string.
2. In the Vercel project **Environment Variables** (Production + Preview), set:

   | Variable | Notes |
   |----------|--------|
   | `DATABASE_URL` | Postgres URL with `?sslmode=require` if your host requires TLS |
   | `SITE_URL` | `https://brightloop-odoo-mumble.vercel.app` |
   | `AUTH_SECRET` | Random secret (e.g. `openssl rand -base64 32`) |
   | `SEED_ADMIN_PASSWORD` | Only for one-time seed from your laptop (optional on Vercel) |
   | `SEED_STAFF_PASSWORD` | Same |
   | `SEED_CUSTOMER_PASSWORD` | Same |

3. From your machine (not on Vercel), apply schema and seed the **same** database:

```powershell
$env:DATABASE_URL = "postgresql://..."   # production Neon/Supabase URL
npm run db:migrate:deploy
$env:SEED_ADMIN_PASSWORD = "..."
$env:SEED_STAFF_PASSWORD = "..."
$env:SEED_CUSTOMER_PASSWORD = "..."
npm run db:seed
```

4. Redeploy or wait for the latest deployment. Open `/plans` — you should see **Basic**, **Pro**, and **Team**.

Do not store seed passwords in Vercel unless you need to re-seed from CI; prefer running seed locally with env vars set in the shell only.

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
| `npm run db:migrate` | Dev migrations (`migrate dev`) |
| `npm run db:migrate:deploy` | Apply migrations (production / CI) |
| `npm run db:seed` | Seed plans + demo users |

See `ROADMAP.md` for plan history and detours.
