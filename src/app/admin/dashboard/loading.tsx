import { PageShell } from "@/components/page-shell";
import { KpiSkeleton } from "@/components/list-page-skeleton";

export default function AdminDashboardLoading() {
  return (
    <PageShell title="Operations dashboard" width="full">
      <KpiSkeleton />
    </PageShell>
  );
}
