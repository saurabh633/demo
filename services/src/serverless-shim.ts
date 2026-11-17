import type { Express, Request } from "express";

type HttpApiEvent = {
  version?: string;
  routeKey?: string;
  rawPath?: string;
  rawQueryString?: string;
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined> | null;
  body?: string | null;
  isBase64Encoded?: boolean;
  requestContext?: {
    http?: { method?: string; path?: string };
  };
};

type LambdaResult = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
  isBase64Encoded?: boolean;
};

/**
 * Tiny API Gateway HTTP API (v2) → Express adapter (no extra runtime deps).
 */
export default function serverlessHttp(app: Express) {
  return async function handler(event: HttpApiEvent): Promise<LambdaResult> {
    const method =
      event.requestContext?.http?.method ||
      event.routeKey?.split(" ")[0] ||
      "GET";
    const path = event.rawPath || event.requestContext?.http?.path || "/";
    const query = event.rawQueryString ? `?${event.rawQueryString}` : "";

    const bodyBuffer = event.body
      ? Buffer.from(
          event.body,
          event.isBase64Encoded ? "base64" : "utf8",
        )
      : Buffer.alloc(0);

    return new Promise((resolve) => {
      const headers: Record<string, string> = {};
      for (const [k, v] of Object.entries(event.headers || {})) {
        if (v !== undefined) headers[k.toLowerCase()] = v;
      }

      let statusCode = 200;
      const responseHeaders: Record<string, string> = {};
      const chunks: Buffer[] = [];

      const req = {
        method,
        url: `${path}${query}`,
        headers,
        body: undefined,
      } as unknown as Request;

      // Use app.handle via a synthetic Node req/res pair
      const { Readable } = require("node:stream") as typeof import("node:stream");
      const incoming = new Readable({
        read() {
          this.push(bodyBuffer.length ? bodyBuffer : null);
          if (bodyBuffer.length) this.push(null);
        },
      }) as any;

      incoming.method = method;
      incoming.url = `${path}${query}`;
      incoming.headers = headers;
      incoming.httpVersion = "1.1";
      incoming.socket = { encrypted: true };

      const outgoing = {
        statusCode: 200,
        headersSent: false,
        setHeader(name: string, value: string | number | string[]) {
          responseHeaders[String(name).toLowerCase()] = String(value);
        },
        getHeader(name: string) {
          return responseHeaders[String(name).toLowerCase()];
        },
        removeHeader(name: string) {
          delete responseHeaders[String(name).toLowerCase()];
        },
        writeHead(code: number, maybeHeaders?: Record<string, string>) {
          statusCode = code;
          if (maybeHeaders) {
            for (const [k, v] of Object.entries(maybeHeaders)) {
              responseHeaders[k.toLowerCase()] = String(v);
            }
          }
          this.headersSent = true;
        },
        write(chunk: any, encoding?: any, cb?: any) {
          const buf = Buffer.isBuffer(chunk)
            ? chunk
            : Buffer.from(
                String(chunk),
                (typeof encoding === "string"
                  ? encoding
                  : "utf8") as BufferEncoding,
              );
          chunks.push(buf);
          if (typeof encoding === "function") encoding();
          if (typeof cb === "function") cb();
          return true;
        },
        end(chunk?: any, encoding?: any, cb?: any) {
          if (chunk && typeof chunk !== "function") {
            this.write(chunk, encoding);
          }
          const done = typeof chunk === "function" ? chunk : typeof encoding === "function" ? encoding : cb;
          resolve({
            statusCode,
            headers: responseHeaders,
            body: Buffer.concat(chunks).toString("utf8"),
          });
          if (typeof done === "function") done();
        },
        on() {
          return this;
        },
        once() {
          return this;
        },
        emit() {
          return false;
        },
      };

      void req;
      app(incoming, outgoing as any);
    });
  };
}
