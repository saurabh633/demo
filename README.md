# demo monorepo

This repository is organized as a lightweight monorepo.

| Path | Description |
|------|-------------|
| `apps/lumi-nails` | **Lumi Nails** — premium Next.js (App Router) marketing + booking site |
| `demo.zip` | Existing unrelated Laravel archive (preserved) |

## Lumi Nails

Soft, luxurious nail extension & art studio site.

**Stack:** Next.js App Router · TypeScript · Tailwind CSS · Framer Motion

### Run locally

```bash
cd apps/lumi-nails
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

From the repo root (npm workspaces):

```bash
npm install
npm run dev:lumi
```

### Build

```bash
cd apps/lumi-nails
npm run build
npm start
```

### API

All network calls live in `apps/lumi-nails/src/lib/api.ts` and use `NEXT_PUBLIC_API_URL`.

Until a backend exists, that file returns mock data with the same response shapes.

See `apps/lumi-nails/.env.example`.
