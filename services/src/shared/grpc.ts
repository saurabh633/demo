import path from "node:path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { PROTO_ROOT } from "./config.js";

const loaderOptions: protoLoader.Options = {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: [PROTO_ROOT],
};

export function loadPackage(protoRelativePath: string) {
  const def = protoLoader.loadSync(
    path.join(PROTO_ROOT, protoRelativePath),
    loaderOptions,
  );
  return grpc.loadPackageDefinition(def) as Record<string, any>;
}

export function startServer(
  name: string,
  port: number,
  register: (server: grpc.Server) => void,
) {
  const server = new grpc.Server();
  register(server);
  const bindAddress = `0.0.0.0:${port}`;
  server.bindAsync(
    bindAddress,
    grpc.ServerCredentials.createInsecure(),
    (err, boundPort) => {
      if (err) {
        console.error(`[${name}] failed to bind`, err);
        process.exit(1);
      }
      console.log(`[${name}] gRPC listening on ${boundPort}`);
    },
  );
  return server;
}

export { grpc };
