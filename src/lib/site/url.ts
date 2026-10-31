/**
 * Canonical site origin for metadata (never use bare localhost in production).
 */
export function getSiteUrl(): string {
  const configured = process.env.SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  throw new Error("SITE_URL is required when NODE_ENV is not development");
}
