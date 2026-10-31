import { describe, expect, it } from "vitest";

import { addInterval } from "@/lib/billing/periods";

describe("addInterval", () => {
  it("advances monthly periods", () => {
    const start = new Date("2026-01-01T00:00:00.000Z");
    const next = addInterval(start, "MONTHLY");
    expect(next.getUTCMonth()).toBe(1);
  });
});
