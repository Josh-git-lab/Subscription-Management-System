import { beforeEach, describe, expect, it, vi } from "vitest";

const findManySubs = vi.fn();
const findFirstInvoice = vi.fn();
const findUniqueTax = vi.fn();
const findManyDiscounts = vi.fn();
const transaction = vi.fn();

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    subscription: { findMany: (...args: unknown[]) => findManySubs(...args) },
    invoice: { findFirst: (...args: unknown[]) => findFirstInvoice(...args) },
    taxSetting: { findUnique: (...args: unknown[]) => findUniqueTax(...args) },
    discount: { findMany: (...args: unknown[]) => findManyDiscounts(...args) },
    $transaction: (...args: unknown[]) => transaction(...args),
  },
}));

import { runBillingCycle } from "./run-billing";

const sub = {
  id: "sub_1",
  userId: "user_1",
  startDate: new Date("2026-01-01T00:00:00.000Z"),
  plan: { priceMinor: 49900, currency: "INR", interval: "MONTHLY" as const },
};

describe("runBillingCycle idempotency", () => {
  beforeEach(() => {
    findManySubs.mockReset();
    findFirstInvoice.mockReset();
    findUniqueTax.mockReset();
    findManyDiscounts.mockReset();
    transaction.mockReset();
    findManySubs.mockResolvedValue([sub]);
    findFirstInvoice.mockResolvedValue(null);
    findUniqueTax.mockResolvedValue(null);
    findManyDiscounts.mockResolvedValue([]);
  });

  it("creates one invoice then skips the same period", async () => {
    transaction.mockResolvedValueOnce(undefined);
    const first = await runBillingCycle(new Date("2026-01-15T00:00:00.000Z"));
    expect(first.created).toBe(1);

    transaction.mockRejectedValueOnce({ code: "P2002" });
    const second = await runBillingCycle(new Date("2026-01-15T00:00:00.000Z"));
    expect(second.created).toBe(0);
  });
});