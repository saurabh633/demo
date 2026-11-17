import pg from "pg";
import { DATABASE_URL } from "./config.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return pool.query<T>(text, params);
}
