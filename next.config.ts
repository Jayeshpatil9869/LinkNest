import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // On Vercel, /api/* is served by api/index.js (Fastify serverless).
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      return [];
    }
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:4000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
