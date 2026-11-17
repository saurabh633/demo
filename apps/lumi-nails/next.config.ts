import type { NextConfig } from "next";

/** Upstream Express API (server-side rewrite target). */
const INTERNAL_API_URL = (
  process.env.INTERNAL_API_URL || "http://127.0.0.1:8080"
).replace(/\/$/, "");

/**
 * Browser-facing API base. Prefer same-origin `/api-proxy` so DevTools Network
 * shows fetches and Try Live / remote browsers don't depend on localhost:8080.
 */
const publicApiUrl = (
  process.env.NEXT_PUBLIC_API_URL || "/api-proxy"
).replace(/\/$/, "");

let remotePatterns: NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
  {
    protocol: "http",
    hostname: "localhost",
    port: "8080",
    pathname: "/uploads/**",
  },
  {
    protocol: "http",
    hostname: "127.0.0.1",
    port: "8080",
    pathname: "/uploads/**",
  },
];

try {
  if (/^https?:\/\//.test(publicApiUrl)) {
    const u = new URL(publicApiUrl);
    remotePatterns.push({
      protocol: u.protocol.replace(":", "") as "http" | "https",
      hostname: u.hostname,
      ...(u.port ? { port: u.port } : {}),
      pathname: "/uploads/**",
    });
  }
} catch {
  // relative public API base — images go through same-origin proxy
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${INTERNAL_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
