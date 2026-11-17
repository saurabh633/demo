# demo monorepo — Lumi Nails

| Path | Description |
|------|-------------|
| `apps/lumi-nails` | Next.js website + `/admin` panel |
| `apps/api` | Express REST API (public + admin), uploads, seed |
| `packages/shared` | Shared Zod schemas |
| `packages/db` | Postgres client + schema |
| `services/` | Earlier gRPC microservices + BFF (optional) |
| `infra/aws/` | API Gateway SAM docs |
| `demo.zip` | Preserved unrelated archive |

## Quick start

```bash
# 1) Install (npm workspaces; pnpm also works if you prefer)
npm install

# 2) Postgres
export DATABASE_URL=postgres://lumi:lumi@127.0.0.1:5432/lumi

# 3) API env
cp apps/api/.env.example apps/api/.env

# 4) Seed (idempotent)
npm run seed
# equivalent: pnpm --filter @lumi/api seed

# 5) API on :8080
npm run dev:api

# 6) Website
cd apps/lumi-nails
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8080
npm run dev
```

- Site: http://localhost:3000  
- API health: http://localhost:8080/health  
- Admin: http://localhost:3000/admin/login  
  - Default: `admin@luminails.studio` / `lumi-admin-2026` (override via `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

## API contract

Matches `apps/lumi-nails/src/lib/api.ts` (no mocks when `NEXT_PUBLIC_API_URL` is set):

`GET /designs`, `GET /designs/:id`, `GET /categories`, `GET /services`, `GET /slots?date=`, `POST /bookings`, `GET /bookings/:id`, `POST /inquiries`, `GET /reviews`, `POST /reviews`, plus `/admin/*`.

Uploads are served from `/uploads/designs/*`.
