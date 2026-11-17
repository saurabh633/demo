import { PORTS } from "../shared/config.js";
import { query } from "../shared/db.js";
import { grpc, loadPackage, startServer } from "../shared/grpc.js";

const pkg = loadPackage("lumi/v1/inquiries.proto");
const service = pkg.lumi.v1.InquiriesService.service;

async function createInquiry(call: any, callback: any) {
  try {
    const { name, phone, message } = call.request;
    if (!name || !phone || !message) {
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: "name, phone, and message are required",
      });
      return;
    }
    const id = `inq_${Date.now().toString(36)}`;
    await query(
      `INSERT INTO inquiries (id, name, phone, message) VALUES ($1,$2,$3,$4)`,
      [id, name, phone, message],
    );
    callback(null, { ok: true });
  } catch (err) {
    callback(err);
  }
}

startServer("inquiries", PORTS.inquiries, (server) => {
  server.addService(service, { createInquiry });
});
