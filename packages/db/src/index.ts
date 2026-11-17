import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;

export const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://lumi:lumi@127.0.0.1:5432/lumi";

export const pool = new Pool({ connectionString: DATABASE_URL });

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return pool.query<T>(text, params);
}

export async function migrate() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await pool.query(sql);
  const extraPath = path.join(__dirname, "migrate-extra.sql");
  if (fs.existsSync(extraPath)) {
    await pool.query(fs.readFileSync(extraPath, "utf8"));
  }
}

export { pg };
