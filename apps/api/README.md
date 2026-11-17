# @lumi/api

Express REST API for Lumi Nails (public site + admin).

## Commands

```bash
# from monorepo root
npm run seed      # or: pnpm --filter @lumi/api seed
npm run dev:api
```

## Env

See `.env.example`:

- `PORT=8080`
- `DATABASE_URL`
- `WEB_ORIGIN` (CORS)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- `JWT_SECRET`

## Uploads

Static files under `uploads/` served at `/uploads/*`.  
Seed downloads Unsplash images into `uploads/designs/` (placeholders if download fails).  
Admin design create/update accepts multipart `image` via Multer.
