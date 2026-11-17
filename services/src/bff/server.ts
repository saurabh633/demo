import { PORTS } from "../shared/config.js";
import { createBffApp } from "./app.js";

const app = createBffApp();

app.listen(PORTS.bff, "0.0.0.0", () => {
  console.log(`[bff] REST → gRPC listening on http://0.0.0.0:${PORTS.bff}`);
});
