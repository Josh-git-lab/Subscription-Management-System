import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PageShell } from "@/components/page-shell";
import { InvoiceStatusBadge } from "@/components/status-badge";
import { prisma } from "@/lib/db/prisma";
import { formatInrFromMinor } from "@/lib/money/format-inr";

export const instant = false;

export const metadata: Metadata = {
  title: "My invoices",
  robots: { index: false },
};

export default async function MyInvoicesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    include: { subscription: { include: { plan: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <PageShell
      title="My invoices"
      description="Invoices for your subscriptions only."
      width="lg"
    >
      {invoices.length === 0 ? (
        <p className="text-muted-foreground text-sm">No invoices yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 font-medium" scope="col">
                  Plan
                </th>
                <th className="p-3 font-medium" scope="col">
                  Period
                </th>
                <th className="p-3 font-medium" scope="col">
                  Due
                </th>
                <th className="p-3 font-medium" scope="col">
                  Paid
                </th>
                <th className="p-3 font-medium" scope="col">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-t">
                  <td className="p-3">{invoice.subscription.plan.name}</td>
                  <td className="p-3 text-xs">
                    {invoice.periodStart.toLocaleDateString()} –{" "}
                    {invoice.periodEnd.toLocaleDateString()}
                  </td>
                  <td className="p-3 tabular-nums">
                    {formatInrFromMinor(invoice.amountDueMinor, invoice.currency)}
                  </td>
                  <td className="p-3 tabular-nums">
                    {formatInrFromMinor(invoice.amountPaidMinor, invoice.currency)}
                  </td>
                  <td className="p-3">
                    <InvoiceStatusBadge status={invoice.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}
