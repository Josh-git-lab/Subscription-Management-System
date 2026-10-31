import { PageShell } from "@/components/page-shell";
import { PricingGridSkeleton } from "@/components/list-page-skeleton";

export default function PlansLoading() {
  return (
    <PageShell
      title="Subscription plans"
      description="Loading available plans…"
      width="xl"
    >
      <PricingGridSkeleton />
    </PageShell>
  );
}
