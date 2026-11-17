import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
import { UPLOADS_DIR, WEB_ORIGIN } from "./lib/config.js";
import { publicRouter } from "./routes/public.js";
import { adminRouter } from "./routes/admin/index.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: [WEB_ORIGIN, "http://127.0.0.1:3000", "http://localhost:3000"],
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  app.use("/uploads", express.static(UPLOADS_DIR));

  app.use(publicRouter);
  app.use("/admin", adminRouter);

  app.use(
    (
      err: any,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error(err);
      res.status(500).json({ error: err?.message || "Internal server error" });
    },
  );

  // silence unused path import warning in some tooling
  void path;
  return app;
}
