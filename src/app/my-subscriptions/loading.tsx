import { PageShell } from "@/components/page-shell";
import { TableListSkeleton } from "@/components/list-page-skeleton";

export default function MySubscriptionsLoading() {
  return (
    <PageShell title="My subscriptions" width="lg">
      <TableListSkeleton rows={4} />
    </PageShell>
  );
}
