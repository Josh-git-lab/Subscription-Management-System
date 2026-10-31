import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site/url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/plans"],
      disallow: [
        "/admin/",
        "/api/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/my-subscriptions",
        "/my-invoices",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
