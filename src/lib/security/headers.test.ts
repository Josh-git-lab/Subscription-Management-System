import { describe, expect, it } from "vitest";

import {
  buildSecurityHeaders,
  contentSecurityPolicy,
} from "@/lib/security/headers";

describe("buildSecurityHeaders", () => {
  it("includes baseline security headers", () => {
    const headers = buildSecurityHeaders(false);
    const map = Object.fromEntries(headers.map((h) => [h.key, h.value]));

    expect(map["X-Content-Type-Options"]).toBe("nosniff");
    expect(map["X-Frame-Options"]).toBe("DENY");
    expect(map["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(map["Content-Security-Policy"]).toContain("default-src 'self'");
    expect(map["Strict-Transport-Security"]).toBeUndefined();
  });

  it("adds HSTS in production", () => {
    const headers = buildSecurityHeaders(true);
    const map = Object.fromEntries(headers.map((h) => [h.key, h.value]));

    expect(map["Strict-Transport-Security"]).toContain("max-age=");
  });
});

describe("contentSecurityPolicy", () => {
  it("allows unsafe-eval in development only", () => {
    expect(contentSecurityPolicy({ isDev: true })).toContain("'unsafe-eval'");
    expect(contentSecurityPolicy({ isDev: false })).not.toContain(
      "'unsafe-eval'",
    );
  });
});
