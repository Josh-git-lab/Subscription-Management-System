import { describe, expect, it } from "vitest";

import { computeInvoiceTotalMinor } from "./invoice-total";

describe("computeInvoiceTotalMinor", () => {
  it("adds integer tax after a percent discount", () => {
    expect(
      computeInvoiceTotalMinor(
        10000,
        { type: "PERCENT", percent: 10, amountMinor: null },
        18,
      ),
    ).toBe(10620);
  });

  it("caps a fixed discount at the plan price", () => {
    expect(
      computeInvoiceTotalMinor(
        5000,
        { type: "FIXED", percent: null, amountMinor: 9000 },
        0,
      ),
    ).toBe(0);
  });
});
