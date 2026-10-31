import { afterEach, describe, expect, it, vi } from "vitest";

import { getSiteUrl } from "@/lib/site/url";

describe("getSiteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses SITE_URL without trailing slash", () => {
    vi.stubEnv("SITE_URL", "https://brightloop.example.com/");
    vi.stubEnv("NODE_ENV", "production");
    expect(getSiteUrl()).toBe("https://brightloop.example.com");
  });

  it("falls back to localhost in development", () => {
    vi.stubEnv("SITE_URL", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});
