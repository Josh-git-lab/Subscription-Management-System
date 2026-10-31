import { createHash, randomBytes } from "node:crypto";

const RESET_TTL_MS = 30 * 60 * 1000;

export function createResetToken(): { raw: string; tokenHash: string; expiresAt: Date } {
  const raw = randomBytes(32).toString("hex");
  return {
    raw,
    tokenHash: hashResetToken(raw),
    expiresAt: new Date(Date.now() + RESET_TTL_MS),
  };
}

export function hashResetToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}
