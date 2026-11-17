import * as grpc from "@grpc/grpc-js";
import { GRPC_HOSTS } from "../shared/config.js";
import { loadPackage } from "../shared/grpc.js";

function promisifyUnary<Req, Res>(
  client: any,
  method: string,
): (req: Req, metadata?: grpc.Metadata) => Promise<Res> {
  return (req, metadata = new grpc.Metadata()) =>
    new Promise((resolve, reject) => {
      client[method](req, metadata, (err: Error | null, res: Res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
}

const designsPkg = loadPackage("lumi/v1/designs.proto");
const catalogPkg = loadPackage("lumi/v1/catalog.proto");
const bookingsPkg = loadPackage("lumi/v1/bookings.proto");
const reviewsPkg = loadPackage("lumi/v1/reviews.proto");
const inquiriesPkg = loadPackage("lumi/v1/inquiries.proto");

const designsClient = new designsPkg.lumi.v1.DesignsService(
  GRPC_HOSTS.designs,
  grpc.credentials.createInsecure(),
);
const catalogClient = new catalogPkg.lumi.v1.CatalogService(
  GRPC_HOSTS.catalog,
  grpc.credentials.createInsecure(),
);
const bookingsClient = new bookingsPkg.lumi.v1.BookingsService(
  GRPC_HOSTS.bookings,
  grpc.credentials.createInsecure(),
);
const reviewsClient = new reviewsPkg.lumi.v1.ReviewsService(
  GRPC_HOSTS.reviews,
  grpc.credentials.createInsecure(),
);
const inquiriesClient = new inquiriesPkg.lumi.v1.InquiriesService(
  GRPC_HOSTS.inquiries,
  grpc.credentials.createInsecure(),
);

export const clients = {
  listDesigns: promisifyUnary<any, any>(designsClient, "listDesigns"),
  getDesign: promisifyUnary<any, any>(designsClient, "getDesign"),
  listCategories: promisifyUnary<any, any>(designsClient, "listCategories"),
  listServices: promisifyUnary<any, any>(catalogClient, "listServices"),
  listSlots: promisifyUnary<any, any>(bookingsClient, "listSlots"),
  createBooking: promisifyUnary<any, any>(bookingsClient, "createBooking"),
  getBooking: promisifyUnary<any, any>(bookingsClient, "getBooking"),
  listReviews: promisifyUnary<any, any>(reviewsClient, "listReviews"),
  createReview: promisifyUnary<any, any>(reviewsClient, "createReview"),
  createInquiry: promisifyUnary<any, any>(inquiriesClient, "createInquiry"),
};
