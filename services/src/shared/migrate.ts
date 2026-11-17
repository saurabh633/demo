import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlDir = path.resolve(__dirname, "../../sql");

async function run() {
  const withSeed = process.argv.includes("--seed");
  const schema = fs.readFileSync(path.join(sqlDir, "schema.sql"), "utf8");
  await pool.query(schema);
  console.log("Applied schema.sql");

  if (withSeed) {
    const seed = fs.readFileSync(path.join(sqlDir, "seed.sql"), "utf8");
    await pool.query(seed);
    console.log("Applied seed.sql");
  }

  await pool.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
