import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PROTO_ROOT = path.resolve(__dirname, "../../protos");

export const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgres://lumi:lumi@127.0.0.1:5432/lumi";

export const PORTS = {
  designs: Number(process.env.DESIGNS_GRPC_PORT || 50051),
  // 50052 is reserved on some hosts; default to 50056
  catalog: Number(process.env.CATALOG_GRPC_PORT || 50056),
  bookings: Number(process.env.BOOKINGS_GRPC_PORT || 50053),
  reviews: Number(process.env.REVIEWS_GRPC_PORT || 50054),
  inquiries: Number(process.env.INQUIRIES_GRPC_PORT || 50055),
  bff: Number(process.env.BFF_PORT || process.env.PORT || 8080),
} as const;

export const GRPC_HOSTS = {
  designs: process.env.DESIGNS_GRPC_HOST || `127.0.0.1:${PORTS.designs}`,
  catalog: process.env.CATALOG_GRPC_HOST || `127.0.0.1:${PORTS.catalog}`,
  bookings: process.env.BOOKINGS_GRPC_HOST || `127.0.0.1:${PORTS.bookings}`,
  reviews: process.env.REVIEWS_GRPC_HOST || `127.0.0.1:${PORTS.reviews}`,
  inquiries: process.env.INQUIRIES_GRPC_HOST || `127.0.0.1:${PORTS.inquiries}`,
} as const;
