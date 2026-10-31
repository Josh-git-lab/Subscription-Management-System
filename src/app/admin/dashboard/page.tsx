import type { Metadata } from "next";
import Link from "next/link";
import { InvoiceStatus, PaymentStatus, SubscriptionStatus } from "@prisma/client";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
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

export const instant = false;

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!isStaffOrAdmin(session?.user?.role)) {
    redirect("/login");
  }

  const now = new Date();

  const [activeSubs, outstandingAgg, overdueCount, collectedAgg, overdueInvoices] =
    await Promise.all([
    prisma.subscription.count({
      where: { status: SubscriptionStatus.ACTIVE },
    }),
    prisma.invoice.aggregate({
      where: {
        amountDueMinor: { gt: 0 },
        status: { notIn: [InvoiceStatus.PAID, InvoiceStatus.VOID] },
      },
      _sum: { amountDueMinor: true },
    }),
    prisma.invoice.count({
      where: {
        amountDueMinor: { gt: 0 },
        dueDate: { lt: now },
        status: { notIn: [InvoiceStatus.PAID, InvoiceStatus.VOID] },
      },
    }),
    prisma.payment.aggregate({
      where: { status: PaymentStatus.COMPLETED },
      _sum: { amountMinor: true },
    }),
    prisma.invoice.findMany({
      where: {
        amountDueMinor: { gt: 0 },
        dueDate: { lt: now },
        status: { notIn: [InvoiceStatus.PAID, InvoiceStatus.VOID] },
      },
      include: { user: true, subscription: { include: { plan: true } } },
      orderBy: { dueDate: "asc" },
      take: 20,
    }),
  ]);

  const outstanding = outstandingAgg._sum.amountDueMinor ?? 0;
  const collected = collectedAgg._sum.amountMinor ?? 0;

  return (
    <PageShell
      title="Operations dashboard"
      description="Live metrics for subscriptions and billing."
      width="full"
    >
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">How to demo (2 minutes)</CardTitle>
          <CardDescription>
            Follow these steps in order when presenting Brightloop.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="text-muted-foreground list-decimal space-y-1 pl-5 text-sm">
            <li>Customer: register → Plans → Subscribe → My subscriptions.</li>
            <li>Staff: Invoices → Run billing, then run it again (created 0).</li>
            <li>Record payment with method and note. Customer opens My invoices. Dashboard collected and outstanding move.</li>
          </ol>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active subscriptions</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{activeSubs}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/subscriptions?status=ACTIVE">
              <Button type="button" variant="outline" size="sm">
                View subscriptions
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Outstanding balance</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {formatInrFromMinor(outstanding)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/invoices">
              <Button type="button" variant="outline" size="sm">
                View invoices
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Collected</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {formatInrFromMinor(collected)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Completed payments recorded in Brightloop.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue invoices</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{overdueCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/invoices">
              <Button type="button" variant="outline" size="sm">
                Record payments
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-3" aria-labelledby="overdue-heading">
        <h2 id="overdue-heading" className="text-xl font-semibold">
          Overdue invoices
        </h2>
        {overdueInvoices.length === 0 ? (
          <p className="text-muted-foreground text-sm">No overdue invoices.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 font-medium" scope="col">
                    Customer
                  </th>
                  <th className="p-3 font-medium" scope="col">
                    Plan
                  </th>
                  <th className="p-3 font-medium" scope="col">
                    Due date
                  </th>
                  <th className="p-3 font-medium" scope="col">
                    Amount due
                  </th>
                </tr>
              </thead>
              <tbody>
                {overdueInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t">
                    <td className="p-3">{invoice.user.email}</td>
                    <td className="p-3">{invoice.subscription.plan.name}</td>
                    <td className="p-3">{invoice.dueDate.toLocaleDateString()}</td>
                    <td className="p-3 tabular-nums">
                      {formatInrFromMinor(invoice.amountDueMinor, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PageShell>
  );
}
