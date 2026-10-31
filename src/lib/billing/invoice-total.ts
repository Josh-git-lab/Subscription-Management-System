export type DiscountInput = {
  type: "PERCENT" | "FIXED";
  percent: number | null;
  amountMinor: number | null;
};

/** Plan price minus one discount, then integer tax percent. Never uses floats for storage. */
export function computeInvoiceTotalMinor(
  priceMinor: number,
  discount: DiscountInput | null,
  taxRatePercent: number,
): number {
  const discounted = applyDiscount(priceMinor, discount);
  const rate = clampPercent(taxRatePercent);
  const tax = Math.round((discounted * rate) / 100);
  return discounted + tax;
}

function applyDiscount(priceMinor: number, discount: DiscountInput | null): number {
  if (!discount || priceMinor <= 0) {
    return Math.max(0, priceMinor);
  }
  if (discount.type === "PERCENT") {
    const percent = clampPercent(discount.percent ?? 0);
    const off = Math.round((priceMinor * percent) / 100);
    return Math.max(0, priceMinor - off);
  }
  const off = Math.max(0, discount.amountMinor ?? 0);
  return Math.max(0, priceMinor - off);
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.trunc(value)));
}
