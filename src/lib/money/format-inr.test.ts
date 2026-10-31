import { describe, expect, it } from "vitest";

import { formatInrFromMinor, rupeesToMinor } from "./format-inr";

describe("formatInrFromMinor", () => {
  it("formats paise as rupees with INR symbol", () => {
    expect(formatInrFromMinor(49900)).toMatch(/499/);
    expect(formatInrFromMinor(49900)).toMatch(/₹|INR/);
  });
});

describe("rupeesToMinor", () => {
  it("converts rupees to paise", () => {
    expect(rupeesToMinor(499)).toBe(49900);
  });
});
