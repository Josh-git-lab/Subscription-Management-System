import type { NextConfig } from "next";

import { buildSecurityHeaders } from "./src/lib/security/headers";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "bcryptjs", "jose"],
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: buildSecurityHeaders(isProduction),
      },
    ];
  },
};

export default nextConfig;
