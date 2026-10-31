import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { BillingRunButton } from "@/components/billing-run-button";
import { PageShell } from "@/components/page-shell";
import { RecordPaymentForm } from "@/components/record-payment-form";
import { InvoiceStatusBadge } from "@/components/status-badge";
import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isStaffOrAdmin } from "@/lib/auth/roles";
import { prisma } from "@/lib/db/prisma";
import { formatInrFromMinor } from "@/lib/money/format-inr";

export const metadata: Metadata = {
  title: "Invoices",
  robots: { index: false },
};

export default async function AdminInvoicesPage() {
  const session = await auth();
  if (!isStaffOrAdmin(session?.user?.role)) {
    redirect("/login");
  }

  const invoices = await prisma.invoice.findMany({
    include: {
      user: true,
      subscription: { include: { plan: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <PageShell
      title="Invoices & billing"
      description="Run billing for active subscriptions and record customer payments."
      width="full"
      actions={<BillingRunButton />}
    >
      <Alert>
        Nothing is billed twice. Each subscription period is unique, so running
        billing again for the same period creates 0 invoices. Simulate catch-up
        moves the clock forward about a month to issue the next period once.
      </Alert>
      {invoices.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No invoices yet</CardTitle>
            <CardDescription>
              Run billing to generate invoices from active subscriptions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BillingRunButton />
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 font-medium" scope="col">
                  Customer
                </th>
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
                <th className="p-3 font-medium" scope="col">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t align-top">
                  <td className="p-3">
                    <div className="font-medium">{inv.user.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {inv.user.email}
                    </div>
                  </td>
                  <td className="p-3">{inv.subscription.plan.name}</td>
                  <td className="p-3 text-xs whitespace-nowrap">
                    {inv.periodStart.toLocaleDateString()} –{" "}
                    {inv.periodEnd.toLocaleDateString()}
                  </td>
                  <td className="p-3 tabular-nums">
                    {formatInrFromMinor(inv.amountDueMinor, inv.currency)}
                  </td>
                  <td className="p-3 tabular-nums">
                    {formatInrFromMinor(inv.amountPaidMinor, inv.currency)}
                  </td>
                  <td className="p-3">
                    <InvoiceStatusBadge status={inv.status} />
                  </td>
                  <td className="p-3">
                    {inv.status !== "PAID" && inv.amountDueMinor > 0 ? (
                      <RecordPaymentForm
                        invoiceId={inv.id}
                        maxMinor={inv.amountDueMinor}
                        currency={inv.currency}
                      />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
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
