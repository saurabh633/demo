import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../lib/config.js";

export type AdminClaims = { role: "admin"; email: string };

declare global {
  namespace Express {
    interface Request {
      admin?: AdminClaims;
    }
  }
}

export function signAdminToken(email: string) {
  return jwt.sign({ role: "admin", email } satisfies AdminClaims, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token =
    req.cookies?.lumi_admin ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : undefined);

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AdminClaims;
    if (payload.role !== "admin") {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
