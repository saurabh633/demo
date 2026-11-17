# demo monorepo

This repository is organized as a lightweight monorepo.

| Path | Description |
|------|-------------|
| `apps/lumi-nails` | **Lumi Nails** — premium Next.js (App Router) marketing + booking site |
| `services/` | gRPC microservices + REST→gRPC BFF + Postgres SQL |
| `infra/aws/` | AWS SAM (API Gateway HTTP API → BFF Lambda) |
| `docker-compose.yml` | Local Postgres + all services + BFF on `:8080` |
| `demo.zip` | Existing unrelated Laravel archive (preserved) |

**Outside this monorepo:** `lumi-nails-local-proxy` — sibling project that exposes a **single local port (8080)** mimicking API Gateway. See that project’s README.

## Lumi Nails website

```bash
cd apps/lumi-nails
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Point at the real API (local)

```bash
# terminal A — outside monorepo proxy OR monorepo compose/BFF
# terminal B
cd apps/lumi-nails
echo 'NEXT_PUBLIC_API_URL=http://localhost:8080' > .env.local
npm run dev
```

Without `NEXT_PUBLIC_API_URL`, the site uses mocks in `src/lib/api.ts`.

## Backend (gRPC)

Five domain services + BFF. Details: [`services/README.md`](services/README.md).

```bash
export DATABASE_URL=postgres://lumi:lumi@127.0.0.1:5432/lumi
cd services && npm install && npm run seed && npm run dev:all
```

| Service | Port |
|---------|------|
| Designs gRPC | 50051 |
| Catalog gRPC | 50056 |
| Bookings gRPC | 50053 |
| Reviews gRPC | 50054 |
| Inquiries gRPC | 50055 |
| **BFF / public REST** | **8080** |

## AWS

Single public entry via API Gateway — [`infra/aws/README.md`](infra/aws/README.md).
