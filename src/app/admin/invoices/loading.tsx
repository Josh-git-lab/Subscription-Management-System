import { PageShell } from "@/components/page-shell";
import { TableListSkeleton } from "@/components/list-page-skeleton";

export default function AdminInvoicesLoading() {
  return (
    <PageShell title="Invoices & billing" width="full">
      <TableListSkeleton rows={8} />
    </PageShell>
  );
}
