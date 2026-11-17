import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
let apiHost = "localhost";
let apiProtocol: "http" | "https" = "http";
let apiPort: string | undefined = "8080";
try {
  const u = new URL(apiUrl);
  apiHost = u.hostname;
  apiProtocol = u.protocol.replace(":", "") as "http" | "https";
  apiPort = u.port || undefined;
} catch {
  // keep defaults
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: apiProtocol,
        hostname: apiHost,
        ...(apiPort ? { port: apiPort } : {}),
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8080",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
