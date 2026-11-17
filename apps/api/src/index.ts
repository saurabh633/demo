import { createApp } from "./app.js";
import { PORT } from "./lib/config.js";
import { migrate } from "@lumi/db";

async function main() {
  await migrate();
  const app = createApp();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[api] listening on http://0.0.0.0:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
