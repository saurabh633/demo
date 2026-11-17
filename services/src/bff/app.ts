import express from "express";
import cors from "cors";
import * as grpc from "@grpc/grpc-js";
import {
  bookingToJson,
  designToJson,
  reviewToJson,
  serviceToJson,
  slotToJson,
} from "../shared/mappers.js";
import { clients } from "./clients.js";

export function createBffApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  function grpcError(res: express.Response, err: any) {
    const code = err?.code;
    if (code === grpc.status.NOT_FOUND) {
      return res.status(404).json({ error: err.message || "Not found" });
    }
    if (code === grpc.status.INVALID_ARGUMENT) {
      return res.status(400).json({ error: err.message || "Bad request" });
    }
    console.error(err);
    return res.status(502).json({ error: err?.message || "Upstream error" });
  }

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "lumi-bff" });
  });

  app.get("/designs", async (req, res) => {
    try {
      const featuredParam = req.query.featured;
      const hasFeatured =
        featuredParam !== undefined && featuredParam !== "";
      const featured =
        featuredParam === "true" || featuredParam === "1";
      const result = await clients.listDesigns({
        category: String(req.query.category || ""),
        shape: String(req.query.shape || ""),
        color: String(req.query.color || ""),
        search: String(req.query.search || ""),
        featured,
        hasFeatured,
      });
      res.json((result.designs || []).map(designToJson));
    } catch (err) {
      grpcError(res, err);
    }
  });

  app.get("/designs/:id", async (req, res) => {
    try {
      const design = await clients.getDesign({ id: req.params.id });
      res.json(designToJson(design));
    } catch (err) {
      grpcError(res, err);
    }
  });

  app.get("/categories", async (_req, res) => {
    try {
      const result = await clients.listCategories({});
      res.json(result.categories || []);
    } catch (err) {
      grpcError(res, err);
    }
  });

  app.get("/services", async (_req, res) => {
    try {
      const result = await clients.listServices({});
      res.json((result.services || []).map(serviceToJson));
    } catch (err) {
      grpcError(res, err);
    }
  });

  app.get("/slots", async (req, res) => {
    try {
      const date = String(req.query.date || "");
      if (!date) {
        res.status(400).json({ error: "date query param is required" });
        return;
      }
      const result = await clients.listSlots({ date });
      res.json((result.slots || []).map(slotToJson));
    } catch (err) {
      grpcError(res, err);
    }
  });

  app.post("/bookings", async (req, res) => {
    try {
      const body = req.body || {};
      const booking = await clients.createBooking({
        serviceId: body.serviceId,
        designId: body.designId || "",
        date: body.date,
        time: body.time,
        name: body.name,
        phone: body.phone,
        notes: body.notes || "",
      });
      res.status(201).json(bookingToJson(booking));
    } catch (err) {
      grpcError(res, err);
    }
  });

  app.get("/bookings/:id", async (req, res) => {
    try {
      const booking = await clients.getBooking({ id: req.params.id });
      res.json(bookingToJson(booking));
    } catch (err) {
      grpcError(res, err);
    }
  });

  app.post("/inquiries", async (req, res) => {
    try {
      const body = req.body || {};
      const result = await clients.createInquiry({
        name: body.name,
        phone: body.phone,
        message: body.message,
      });
      res.status(201).json({ ok: Boolean(result.ok) });
    } catch (err) {
      grpcError(res, err);
    }
  });

  app.get("/reviews", async (_req, res) => {
    try {
      const result = await clients.listReviews({});
      res.json((result.reviews || []).map(reviewToJson));
    } catch (err) {
      grpcError(res, err);
    }
  });

  app.post("/reviews", async (req, res) => {
    try {
      const body = req.body || {};
      const review = await clients.createReview({
        name: body.name,
        rating: Number(body.rating),
        comment: body.comment,
      });
      res.status(201).json(reviewToJson(review));
    } catch (err) {
      grpcError(res, err);
    }
  });

  return app;
}
