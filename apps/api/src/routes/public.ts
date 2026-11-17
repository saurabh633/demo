import { Router } from "express";
import { query } from "@lumi/db";
import {
  bookingInputSchema,
  inquiryInputSchema,
  reviewInputSchema,
} from "@lumi/shared";
import {
  bookingToJson,
  designToJson,
  newId,
  reviewToJson,
  serviceToJson,
} from "../lib/mappers.js";
import { validateBody } from "../lib/validate.js";

export const publicRouter = Router();

publicRouter.get("/health", (_req, res) => {
  res.json({ ok: true, service: "lumi-api" });
});

publicRouter.get("/designs", async (req, res, next) => {
  try {
    const clauses: string[] = [];
    const params: unknown[] = [];
    const { category, shape, color, search, featured } = req.query;

    if (category) {
      params.push(String(category));
      clauses.push(`category = $${params.length}`);
    }
    if (shape) {
      params.push(String(shape));
      clauses.push(`shape = $${params.length}`);
    }
    if (color) {
      params.push(String(color).toLowerCase());
      clauses.push(
        `EXISTS (SELECT 1 FROM unnest(colors) c WHERE lower(c) = $${params.length})`,
      );
    }
    if (search) {
      params.push(`%${String(search).toLowerCase()}%`);
      clauses.push(
        `(lower(title) LIKE $${params.length} OR lower(category) LIKE $${params.length} OR lower(shape) LIKE $${params.length} OR EXISTS (SELECT 1 FROM unnest(colors || tags) t WHERE lower(t) LIKE $${params.length}))`,
      );
    }
    if (featured === "true" || featured === "1") {
      clauses.push(`is_featured = TRUE`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const { rows } = await query(
      `SELECT * FROM designs ${where} ORDER BY title ASC`,
      params,
    );
    res.json(rows.map(designToJson));
  } catch (err) {
    next(err);
  }
});

publicRouter.get("/designs/:id", async (req, res, next) => {
  try {
    const { rows } = await query(`SELECT * FROM designs WHERE id = $1`, [
      req.params.id,
    ]);
    if (!rows[0]) {
      res.status(404).json({ error: "Design not found" });
      return;
    }
    res.json(designToJson(rows[0]));
  } catch (err) {
    next(err);
  }
});

publicRouter.get("/categories", async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT name FROM categories ORDER BY name ASC`,
    );
    // Frontend expects string[] of category names
    res.json(rows.map((r) => r.name));
  } catch (err) {
    next(err);
  }
});

publicRouter.get("/services", async (_req, res, next) => {
  try {
    const { rows } = await query(`SELECT * FROM services ORDER BY name ASC`);
    res.json(rows.map(serviceToJson));
  } catch (err) {
    next(err);
  }
});

publicRouter.get("/slots", async (req, res, next) => {
  try {
    const date = String(req.query.date || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: "date query param required (YYYY-MM-DD)" });
      return;
    }
    const hours = await query<{ time: string }>(
      `SELECT time FROM slot_hours ORDER BY time ASC`,
    );
    const booked = await query<{ time: string }>(
      `SELECT time FROM bookings WHERE date = $1 AND status <> 'cancelled'`,
      [date],
    );
    const taken = new Set(booked.rows.map((r) => r.time));
    res.json(
      hours.rows.map((h) => ({
        time: h.time,
        available: !taken.has(h.time),
      })),
    );
  } catch (err) {
    next(err);
  }
});

publicRouter.post(
  "/bookings",
  validateBody(bookingInputSchema),
  async (req, res, next) => {
    try {
      const body = req.body;
      const conflict = await query(
        `SELECT id FROM bookings WHERE date = $1 AND time = $2 AND status <> 'cancelled'`,
        [body.date, body.time],
      );
      if (conflict.rows[0]) {
        res.status(409).json({ error: "Slot already booked" });
        return;
      }
      const id = newId("bk");
      const { rows } = await query(
        `INSERT INTO bookings (id, service_id, design_id, date, time, name, phone, notes, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending')
         RETURNING *`,
        [
          id,
          body.serviceId,
          body.designId || null,
          body.date,
          body.time,
          body.name,
          body.phone,
          body.notes || "",
        ],
      );
      res.status(201).json(bookingToJson(rows[0]));
    } catch (err: any) {
      if (err?.code === "23505") {
        res.status(409).json({ error: "Slot already booked" });
        return;
      }
      next(err);
    }
  },
);

publicRouter.get("/bookings/:id", async (req, res, next) => {
  try {
    const { rows } = await query(`SELECT * FROM bookings WHERE id = $1`, [
      req.params.id,
    ]);
    if (!rows[0]) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    res.json(bookingToJson(rows[0]));
  } catch (err) {
    next(err);
  }
});

publicRouter.post(
  "/inquiries",
  validateBody(inquiryInputSchema),
  async (req, res, next) => {
    try {
      const body = req.body;
      await query(
        `INSERT INTO inquiries (id, name, phone, message) VALUES ($1,$2,$3,$4)`,
        [newId("inq"), body.name, body.phone, body.message],
      );
      res.status(201).json({ ok: true });
    } catch (err) {
      next(err);
    }
  },
);

publicRouter.get("/reviews", async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT * FROM reviews WHERE approved = TRUE ORDER BY created_at DESC`,
    );
    res.json(rows.map(reviewToJson));
  } catch (err) {
    next(err);
  }
});

publicRouter.post(
  "/reviews",
  validateBody(reviewInputSchema),
  async (req, res, next) => {
    try {
      const body = req.body;
      const id = newId("rv");
      const createdAt = new Date().toISOString();
      const { rows } = await query(
        `INSERT INTO reviews (id, name, rating, comment, approved, created_at)
         VALUES ($1,$2,$3,$4,FALSE,$5)
         RETURNING *`,
        [id, body.name, body.rating, body.comment, createdAt],
      );
      // Public create returns the review; site may show pending until approved
      res.status(201).json(reviewToJson(rows[0]));
    } catch (err) {
      next(err);
    }
  },
);
