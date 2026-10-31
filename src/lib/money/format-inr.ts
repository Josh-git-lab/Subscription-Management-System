/** Format integer minor units (paise) as INR for display. Never show raw minor units in UI. */
export function formatInrFromMinor(
  minor: number,
  currency = "INR",
): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(minor / 100);
}

/** Convert rupee input (e.g. 499) to minor units for server actions. */
export function rupeesToMinor(rupees: number): number {
  return Math.round(rupees * 100);
}
