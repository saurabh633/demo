# Lumi Nails

Premium, mobile-first website for **Lumi Nails** — nail extension & nail art studio.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
npm run lint
```

## Environment

Copy `.env.example` to `.env.local` if needed:

- `NEXT_PUBLIC_API_URL` — backend base URL; leave empty for mocks in `src/lib/api.ts`
- `NEXT_PUBLIC_SITE_URL` — absolute site URL for metadata / Open Graph

## Structure

- `src/app` — pages (Home, Gallery, Services, Booking, Reviews, Contact)
- `src/components/ui` — shared UI primitives
- `src/components/sections` — home marketing sections
- `src/components/layout` — navbar, footer, WhatsApp float
- `src/lib/api.ts` — sole network layer (+ mocks)
- `src/lib/types.ts` — Design, Service, Slot, Booking, Review, Inquiry
