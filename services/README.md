# Lumi Nails backend (gRPC microservices)

TypeScript / Node gRPC services backed by PostgreSQL, plus a REST → gRPC BFF that matches `apps/lumi-nails/src/lib/api.ts`.

## Services

| Service | Proto | Default port |
|---------|-------|--------------|
| Designs | `protos/lumi/v1/designs.proto` | `50051` |
| Catalog | `protos/lumi/v1/catalog.proto` | `50056` |
| Bookings | `protos/lumi/v1/bookings.proto` | `50053` |
| Reviews | `protos/lumi/v1/reviews.proto` | `50054` |
| Inquiries | `protos/lumi/v1/inquiries.proto` | `50055` |
| BFF (REST) | Express translator | `8080` |

## Quick start (without Docker)

```bash
# Postgres must be available
export DATABASE_URL=postgres://lumi:lumi@127.0.0.1:5432/lumi

cd services
npm install
npm run seed          # schema + seed data matching frontend mocks
npm run dev:all       # all gRPC services + BFF
```

Point the website at the BFF:

```bash
cd ../apps/lumi-nails
echo 'NEXT_PUBLIC_API_URL=http://localhost:8080' > .env.local
npm run dev
```

## Docker Compose (monorepo)

From repo root:

```bash
docker compose up --build
```

BFF: http://localhost:8080/health

For a **sibling** one-port local runner (recommended), see `lumi-nails-local-proxy` outside this monorepo.

## Environment

| Variable | Default |
|----------|---------|
| `DATABASE_URL` | `postgres://lumi:lumi@127.0.0.1:5432/lumi` |
| `DESIGNS_GRPC_PORT` | `50051` |
| `CATALOG_GRPC_PORT` | `50056` |
| `BOOKINGS_GRPC_PORT` | `50053` |
| `REVIEWS_GRPC_PORT` | `50054` |
| `INQUIRIES_GRPC_PORT` | `50055` |
| `BFF_PORT` / `PORT` | `8080` |
| `*_GRPC_HOST` | `127.0.0.1:<port>` (override in Docker/AWS) |
