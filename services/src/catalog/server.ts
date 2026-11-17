import { PORTS } from "../shared/config.js";
import { query } from "../shared/db.js";
import { serviceRowToGrpc } from "../shared/mappers.js";
import { loadPackage, startServer } from "../shared/grpc.js";

const pkg = loadPackage("lumi/v1/catalog.proto");
const service = pkg.lumi.v1.CatalogService.service;

async function listServices(_call: any, callback: any) {
  try {
    const { rows } = await query(
      `SELECT * FROM services ORDER BY name ASC`,
    );
    callback(null, { services: rows.map(serviceRowToGrpc) });
  } catch (err) {
    callback(err);
  }
}

startServer("catalog", PORTS.catalog, (server) => {
  server.addService(service, { listServices });
});
