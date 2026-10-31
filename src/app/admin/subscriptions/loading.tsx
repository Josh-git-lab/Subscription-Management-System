import { PageShell } from "@/components/page-shell";
import { TableListSkeleton } from "@/components/list-page-skeleton";

export default function AdminSubscriptionsLoading() {
  return (
    <PageShell title="All subscriptions" width="full">
      <TableListSkeleton rows={8} />
    </PageShell>
  );
}
