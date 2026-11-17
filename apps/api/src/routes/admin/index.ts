import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { query } from "@lumi/db";
import {
  adminLoginSchema,
  bookingInputSchema,
  bookingStatusUpdateSchema,
  categoryInputSchema,
  designInputSchema,
  serviceInputSchema,
} from "@lumi/shared";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  DESIGNS_UPLOAD_DIR,
} from "../../lib/config.js";
import {
  bookingToJson,
  categoryToJson,
  designToJson,
  inquiryToJson,
  newId,
  reviewToJson,
  serviceToJson,
} from "../../lib/mappers.js";
import { requireAdmin, signAdminToken } from "../../middleware/auth.js";
import { validateBody } from "../../lib/validate.js";

fs.mkdirSync(DESIGNS_UPLOAD_DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, DESIGNS_UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || ".jpg";
      cb(null, `${Date.now().toString(36)}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const adminRouter = Router();

adminRouter.post("/login", validateBody(adminLoginSchema), (req, res) => {
  const { email, password } = req.body;
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = signAdminToken(email);
  res.cookie("lumi_admin", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ ok: true, email });
});

adminRouter.post("/logout", (_req, res) => {
  res.clearCookie("lumi_admin");
  res.json({ ok: true });
});

adminRouter.get("/me", requireAdmin, (req, res) => {
  res.json({ email: req.admin!.email, role: "admin" });
});

adminRouter.use(requireAdmin);

adminRouter.get("/dashboard", async (_req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const [todayBookings, pending, inquiriesUnread, designsCount] =
      await Promise.all([
        query(`SELECT * FROM bookings WHERE date = $1 ORDER BY time ASC`, [
          today,
        ]),
        query(
          `SELECT COUNT(*)::int AS count FROM bookings WHERE status = 'pending'`,
        ),
        query(
          `SELECT COUNT(*)::int AS count FROM inquiries WHERE is_read = FALSE`,
        ),
        query(`SELECT COUNT(*)::int AS count FROM designs`),
      ]);
    res.json({
      today: todayBookings.rows.map(bookingToJson),
      pendingCount: pending.rows[0]?.count || 0,
      unreadInquiries: inquiriesUnread.rows[0]?.count || 0,
      designsCount: designsCount.rows[0]?.count || 0,
    });
  } catch (err) {
    next(err);
  }
});

// ---- Bookings ----
adminRouter.get("/bookings", async (req, res, next) => {
  try {
    const clauses: string[] = [];
    const params: unknown[] = [];
    if (req.query.status) {
      params.push(String(req.query.status));
      clauses.push(`status = $${params.length}`);
    }
    if (req.query.date) {
      params.push(String(req.query.date));
      clauses.push(`date = $${params.length}`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const offset = (page - 1) * limit;
    const total = await query<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM bookings ${where}`,
      params,
    );
    const { rows } = await query(
      `SELECT * FROM bookings ${where} ORDER BY date DESC, time DESC LIMIT $${
        params.length + 1
      } OFFSET $${params.length + 2}`,
      [...params, limit, offset],
    );
    res.json({
      items: rows.map(bookingToJson),
      page,
      limit,
      total: total.rows[0]?.count || 0,
    });
  } catch (err) {
    next(err);
  }
});

adminRouter.post(
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
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
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
          body.status || "confirmed",
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

adminRouter.patch(
  "/bookings/:id/status",
  validateBody(bookingStatusUpdateSchema),
  async (req, res, next) => {
    try {
      const { rows } = await query(
        `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
        [req.body.status, req.params.id],
      );
      if (!rows[0]) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }
      res.json(bookingToJson(rows[0]));
    } catch (err) {
      next(err);
    }
  },
);

// ---- Designs ----
adminRouter.get("/designs", async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const offset = (page - 1) * limit;
    const total = await query<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM designs`,
    );
    const { rows } = await query(
      `SELECT * FROM designs ORDER BY title ASC LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    res.json({
      items: rows.map(designToJson),
      page,
      limit,
      total: total.rows[0]?.count || 0,
    });
  } catch (err) {
    next(err);
  }
});

adminRouter.post(
  "/designs",
  upload.single("image"),
  async (req, res, next) => {
    try {
      const body = {
        ...req.body,
        colors: req.body.colors
          ? Array.isArray(req.body.colors)
            ? req.body.colors
            : String(req.body.colors)
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
          : [],
        tags: req.body.tags
          ? Array.isArray(req.body.tags)
            ? req.body.tags
            : String(req.body.tags)
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
          : [],
        isFeatured:
          req.body.isFeatured === true ||
          req.body.isFeatured === "true" ||
          req.body.isFeatured === "on",
      };
      const parsed = designInputSchema.safeParse(body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Validation failed",
          details: parsed.error.flatten(),
        });
        return;
      }
      const data = parsed.data;
      const imageUrl = req.file
        ? `/uploads/designs/${req.file.filename}`
        : data.imageUrl || "/uploads/designs/placeholder.jpg";
      let category = data.category || "";
      let categoryId = data.categoryId || null;
      if (categoryId) {
        const cat = await query(`SELECT * FROM categories WHERE id = $1`, [
          categoryId,
        ]);
        if (cat.rows[0]) category = cat.rows[0].name;
      } else if (category) {
        const cat = await query(`SELECT * FROM categories WHERE name = $1`, [
          category,
        ]);
        categoryId = cat.rows[0]?.id || null;
      }
      const id = newId("d");
      const { rows } = await query(
        `INSERT INTO designs (id, title, image_url, category_id, category, shape, colors, price, duration_min, tags, is_featured)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
        [
          id,
          data.title,
          imageUrl,
          categoryId,
          category,
          data.shape,
          data.colors,
          data.price,
          data.durationMin,
          data.tags,
          data.isFeatured,
        ],
      );
      res.status(201).json(designToJson(rows[0]));
    } catch (err) {
      next(err);
    }
  },
);

adminRouter.put(
  "/designs/:id",
  upload.single("image"),
  async (req, res, next) => {
    try {
      const existing = await query(`SELECT * FROM designs WHERE id = $1`, [
        req.params.id,
      ]);
      if (!existing.rows[0]) {
        res.status(404).json({ error: "Design not found" });
        return;
      }
      const body = {
        title: req.body.title ?? existing.rows[0].title,
        category: req.body.category ?? existing.rows[0].category,
        categoryId: req.body.categoryId ?? existing.rows[0].category_id,
        shape: req.body.shape ?? existing.rows[0].shape,
        colors: req.body.colors
          ? Array.isArray(req.body.colors)
            ? req.body.colors
            : String(req.body.colors)
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
          : existing.rows[0].colors,
        tags: req.body.tags
          ? Array.isArray(req.body.tags)
            ? req.body.tags
            : String(req.body.tags)
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
          : existing.rows[0].tags,
        price: req.body.price ?? existing.rows[0].price,
        durationMin: req.body.durationMin ?? existing.rows[0].duration_min,
        isFeatured:
          req.body.isFeatured !== undefined
            ? req.body.isFeatured === true ||
              req.body.isFeatured === "true" ||
              req.body.isFeatured === "on"
            : existing.rows[0].is_featured,
        imageUrl: existing.rows[0].image_url,
      };
      const parsed = designInputSchema.safeParse(body);
      if (!parsed.success) {
        res.status(400).json({
          error: "Validation failed",
          details: parsed.error.flatten(),
        });
        return;
      }
      const data = parsed.data;
      const imageUrl = req.file
        ? `/uploads/designs/${req.file.filename}`
        : data.imageUrl || existing.rows[0].image_url;
      let category = data.category || existing.rows[0].category;
      let categoryId = data.categoryId || existing.rows[0].category_id;
      if (data.categoryId) {
        const cat = await query(`SELECT * FROM categories WHERE id = $1`, [
          data.categoryId,
        ]);
        if (cat.rows[0]) {
          category = cat.rows[0].name;
          categoryId = cat.rows[0].id;
        }
      }
      const { rows } = await query(
        `UPDATE designs SET title=$1, image_url=$2, category_id=$3, category=$4, shape=$5, colors=$6, price=$7, duration_min=$8, tags=$9, is_featured=$10
         WHERE id=$11 RETURNING *`,
        [
          data.title,
          imageUrl,
          categoryId,
          category,
          data.shape,
          data.colors,
          data.price,
          data.durationMin,
          data.tags,
          data.isFeatured,
          req.params.id,
        ],
      );
      res.json(designToJson(rows[0]));
    } catch (err) {
      next(err);
    }
  },
);

adminRouter.delete("/designs/:id", async (req, res, next) => {
  try {
    const result = await query(`DELETE FROM designs WHERE id = $1`, [
      req.params.id,
    ]);
    if (!result.rowCount) {
      res.status(404).json({ error: "Design not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// ---- Services ----
adminRouter.get("/services", async (_req, res, next) => {
  try {
    const { rows } = await query(`SELECT * FROM services ORDER BY name ASC`);
    res.json(rows.map(serviceToJson));
  } catch (err) {
    next(err);
  }
});

adminRouter.post(
  "/services",
  validateBody(serviceInputSchema),
  async (req, res, next) => {
    try {
      const id = newId("s");
      const b = req.body;
      const { rows } = await query(
        `INSERT INTO services (id, name, description, price, duration_min)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [id, b.name, b.description, b.price, b.durationMin],
      );
      res.status(201).json(serviceToJson(rows[0]));
    } catch (err) {
      next(err);
    }
  },
);

adminRouter.put(
  "/services/:id",
  validateBody(serviceInputSchema),
  async (req, res, next) => {
    try {
      const b = req.body;
      const { rows } = await query(
        `UPDATE services SET name=$1, description=$2, price=$3, duration_min=$4 WHERE id=$5 RETURNING *`,
        [b.name, b.description, b.price, b.durationMin, req.params.id],
      );
      if (!rows[0]) {
        res.status(404).json({ error: "Service not found" });
        return;
      }
      res.json(serviceToJson(rows[0]));
    } catch (err) {
      next(err);
    }
  },
);

adminRouter.delete("/services/:id", async (req, res, next) => {
  try {
    const result = await query(`DELETE FROM services WHERE id = $1`, [
      req.params.id,
    ]);
    if (!result.rowCount) {
      res.status(404).json({ error: "Service not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// ---- Categories ----
adminRouter.get("/categories", async (_req, res, next) => {
  try {
    const { rows } = await query(`SELECT * FROM categories ORDER BY name ASC`);
    res.json(rows.map(categoryToJson));
  } catch (err) {
    next(err);
  }
});

adminRouter.post(
  "/categories",
  validateBody(categoryInputSchema),
  async (req, res, next) => {
    try {
      const name = req.body.name;
      const slug =
        req.body.slug ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      const id = newId("cat");
      const { rows } = await query(
        `INSERT INTO categories (id, name, slug) VALUES ($1,$2,$3) RETURNING *`,
        [id, name, slug],
      );
      res.status(201).json(categoryToJson(rows[0]));
    } catch (err: any) {
      if (err?.code === "23505") {
        res.status(409).json({ error: "Category already exists" });
        return;
      }
      next(err);
    }
  },
);

adminRouter.put(
  "/categories/:id",
  validateBody(categoryInputSchema),
  async (req, res, next) => {
    try {
      const name = req.body.name;
      const slug =
        req.body.slug ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      const { rows } = await query(
        `UPDATE categories SET name=$1, slug=$2 WHERE id=$3 RETURNING *`,
        [name, slug, req.params.id],
      );
      if (!rows[0]) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      await query(`UPDATE designs SET category=$1 WHERE category_id=$2`, [
        name,
        req.params.id,
      ]);
      res.json(categoryToJson(rows[0]));
    } catch (err) {
      next(err);
    }
  },
);

adminRouter.delete("/categories/:id", async (req, res, next) => {
  try {
    const result = await query(`DELETE FROM categories WHERE id = $1`, [
      req.params.id,
    ]);
    if (!result.rowCount) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// ---- Reviews ----
adminRouter.get("/reviews", async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT * FROM reviews ORDER BY created_at DESC`,
    );
    res.json(rows.map(reviewToJson));
  } catch (err) {
    next(err);
  }
});

adminRouter.patch("/reviews/:id/approve", async (req, res, next) => {
  try {
    const { rows } = await query(
      `UPDATE reviews SET approved = TRUE WHERE id = $1 RETURNING *`,
      [req.params.id],
    );
    if (!rows[0]) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    res.json(reviewToJson(rows[0]));
  } catch (err) {
    next(err);
  }
});

adminRouter.delete("/reviews/:id", async (req, res, next) => {
  try {
    const result = await query(`DELETE FROM reviews WHERE id = $1`, [
      req.params.id,
    ]);
    if (!result.rowCount) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// ---- Inquiries ----
adminRouter.get("/inquiries", async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT * FROM inquiries ORDER BY created_at DESC`,
    );
    res.json(rows.map(inquiryToJson));
  } catch (err) {
    next(err);
  }
});

adminRouter.patch("/inquiries/:id/read", async (req, res, next) => {
  try {
    const { rows } = await query(
      `UPDATE inquiries SET is_read = TRUE WHERE id = $1 RETURNING *`,
      [req.params.id],
    );
    if (!rows[0]) {
      res.status(404).json({ error: "Inquiry not found" });
      return;
    }
    res.json(inquiryToJson(rows[0]));
  } catch (err) {
    next(err);
  }
});
