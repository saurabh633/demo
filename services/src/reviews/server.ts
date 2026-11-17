import { PORTS } from "../shared/config.js";
import { query } from "../shared/db.js";
import { reviewRowToGrpc } from "../shared/mappers.js";
import { grpc, loadPackage, startServer } from "../shared/grpc.js";

const pkg = loadPackage("lumi/v1/reviews.proto");
const service = pkg.lumi.v1.ReviewsService.service;

async function listReviews(_call: any, callback: any) {
  try {
    const { rows } = await query(
      `SELECT * FROM reviews ORDER BY created_at DESC`,
    );
    callback(null, { reviews: rows.map(reviewRowToGrpc) });
  } catch (err) {
    callback(err);
  }
}

async function createReview(call: any, callback: any) {
  try {
    const { name, rating, comment } = call.request;
    if (!name || !comment || !rating) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "name, rating, and comment are required",
      });
      return;
    }
    if (rating < 1 || rating > 5) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "rating must be 1-5",
      });
      return;
    }
    const id = `rv_${Date.now().toString(36)}`;
    const createdAt = new Date().toISOString();
    const { rows } = await query(
      `INSERT INTO reviews (id, name, rating, comment, created_at)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [id, name, rating, comment, createdAt],
    );
    callback(null, reviewRowToGrpc(rows[0]));
  } catch (err) {
    callback(err);
  }
}

startServer("reviews", PORTS.reviews, (server) => {
  server.addService(service, { listReviews, createReview });
});
