/** Display-only feature lists for pricing cards (not stored in DB). */
export const planFeatureBullets: Record<string, string[]> = {
  basic: [
    "Single workspace for individuals",
    "Standard email support",
    "Monthly billing in one ledger",
  ],
  pro: [
    "Everything in Basic",
    "Team seats and shared billing",
    "Priority support queue",
  ],
  team: [
    "Everything in Pro",
    "Advanced collaboration",
    "Operations dashboard access",
  ],
};

export function featuresForPlanSlug(slug: string): string[] {
  return (
    planFeatureBullets[slug] ?? [
      "Recurring subscription billing",
      "Self-service customer portal",
      "Staff console for invoices",
    ]
  );
}
