import { PORTS } from "../shared/config.js";
import { query } from "../shared/db.js";
import { designRowToGrpc } from "../shared/mappers.js";
import { grpc, loadPackage, startServer } from "../shared/grpc.js";

const pkg = loadPackage("lumi/v1/designs.proto");
const service = pkg.lumi.v1.DesignsService.service;

async function listDesigns(call: any, callback: any) {
  try {
    const {
      category,
      shape,
      color,
      search,
      featured,
      hasFeatured,
    } = call.request;
    const clauses: string[] = [];
    const params: unknown[] = [];

    if (category) {
      params.push(category);
      clauses.push(`category = $${params.length}`);
    }
    if (shape) {
      params.push(shape);
      clauses.push(`shape = $${params.length}`);
    }
    if (color) {
      params.push(color.toLowerCase());
      clauses.push(
        `EXISTS (SELECT 1 FROM unnest(colors) c WHERE lower(c) = $${params.length})`,
      );
    }
    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      clauses.push(
        `(lower(title) LIKE $${params.length} OR lower(category) LIKE $${params.length} OR lower(shape) LIKE $${params.length} OR EXISTS (SELECT 1 FROM unnest(colors || tags) t WHERE lower(t) LIKE $${params.length}))`,
      );
    }
    if (hasFeatured && featured) {
      clauses.push(`is_featured = TRUE`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const { rows } = await query(
      `SELECT * FROM designs ${where} ORDER BY title ASC`,
      params,
    );
    callback(null, { designs: rows.map(designRowToGrpc) });
  } catch (err) {
    callback(err);
  }
}

async function getDesign(call: any, callback: any) {
  try {
    const { rows } = await query(`SELECT * FROM designs WHERE id = $1`, [
      call.request.id,
    ]);
    if (!rows[0]) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: `Design ${call.request.id} not found`,
      });
      return;
    }
    callback(null, designRowToGrpc(rows[0]));
  } catch (err) {
    callback(err);
  }
}

async function listCategories(_call: any, callback: any) {
  try {
    const { rows } = await query<{ category: string }>(
      `SELECT DISTINCT category FROM designs ORDER BY category ASC`,
    );
    callback(null, { categories: rows.map((r) => r.category) });
  } catch (err) {
    callback(err);
  }
}

startServer("designs", PORTS.designs, (server) => {
  server.addService(service, {
    listDesigns,
    getDesign,
    listCategories,
  });
});
