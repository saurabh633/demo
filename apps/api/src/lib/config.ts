import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PORT = Number(process.env.PORT || process.env.API_PORT || 8080);
export const WEB_ORIGIN =
  process.env.WEB_ORIGIN || "http://localhost:3000";
export const JWT_SECRET =
  process.env.JWT_SECRET || "lumi-dev-secret-change-me";
export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "admin@luminails.studio";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "lumi-admin-2026";
export const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");
export const DESIGNS_UPLOAD_DIR = path.join(UPLOADS_DIR, "designs");
