/**
 * AWS Lambda entry for the REST → gRPC BFF.
 * Wired by infra/aws/template.yaml (API Gateway HTTP API → this function).
 */
import { createBffApp } from "./bff/app.js";
import serverlessHttp from "./serverless-shim.js";

const app = createBffApp();
export const handler = serverlessHttp(app);
