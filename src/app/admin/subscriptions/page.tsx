import type { Metadata } from "next";
import Link from "next/link";
import { SubscriptionStatus } from "@prisma/client";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PageShell } from "@/components/page-shell";
import { AdvanceSubscriptionButton } from "@/components/advance-subscription-button";
import { SubscriptionStatusBadge } from "@/components/status-badge";
import { StatusStepper } from "@/components/status-stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isStaffOrAdmin } from "@/lib/auth/roles";
import { prisma } from "@/lib/db/prisma";

export const instant = false;

export const metadata: Metadata = {
  title: "All subscriptions",
  robots: { index: false },
};

const PAGE_SIZE = 15;

type Props = {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
};

export default async function AdminSubscriptionsPage({ searchParams }: Props) {
  const session = await auth();
  if (!isStaffOrAdmin(session?.user?.role)) {
    redirect("/login");
  }

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const q = params.q?.trim() ?? "";
  const statusParam = params.status?.trim() ?? "";

  const statusFilter =
    statusParam &&
    Object.values(SubscriptionStatus).includes(
      statusParam as SubscriptionStatus,
    )
      ? (statusParam as SubscriptionStatus)
      : undefined;

  const where = {
    AND: [
      q ? { user: { email: { contains: q } } } : {},
      statusFilter ? { status: statusFilter } : {},
    ],
  };

  const [total, rows] = await Promise.all([
    prisma.subscription.count({ where }),
    prisma.subscription.findMany({
      where,
      include: { user: true, plan: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <PageShell
      title="All subscriptions"
      description="Search and filter customer subscriptions across Brightloop."
      width="full"
    >
      <CardFilterForm q={q} statusFilter={statusFilter} />

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 font-medium" scope="col">
                Subscription
              </th>
              <th className="p-3 font-medium" scope="col">
                Plan
              </th>
              <th className="p-3 font-medium" scope="col">
                Status
              </th>
              <th className="p-3 font-medium" scope="col">
                Start
              </th>
              <th className="p-3 font-medium" scope="col">
                End
              </th>
              <th className="p-3 font-medium" scope="col">
                Lifecycle
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="text-muted-foreground p-8 text-center" colSpan={6}>
                  No subscriptions match your filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{row.number ?? "—"}</div>
                    <div className="font-medium">{row.user.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {row.user.email}
                    </div>
                  </td>
                  <td className="p-3">{row.plan.name}</td>
                  <td className="p-3">
                    <SubscriptionStatusBadge status={row.status} />
                  </td>
                  <td className="p-3">{row.startDate.toLocaleDateString()}</td>
                  <td className="p-3">
                    {row.endDate ? row.endDate.toLocaleDateString() : "—"}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-2">
                      <StatusStepper status={row.status} />
                      <AdvanceSubscriptionButton
                        subscriptionId={row.id}
                        status={row.status}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <nav
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        aria-label="Pagination"
      >
        <p className="text-muted-foreground text-sm">
          Page {page} of {totalPages} ({total} total)
        </p>
        <div className="flex gap-2">
          {page > 1 ? (
            <Link
              href={`?q=${encodeURIComponent(q)}&status=${statusFilter ?? ""}&page=${page - 1}`}
            >
              <Button type="button" variant="outline" size="sm">
                Previous
              </Button>
            </Link>
          ) : null}
          {page < totalPages ? (
            <Link
              href={`?q=${encodeURIComponent(q)}&status=${statusFilter ?? ""}&page=${page + 1}`}
            >
              <Button type="button" variant="outline" size="sm">
                Next
              </Button>
            </Link>
          ) : null}
        </div>
      </nav>
    </PageShell>
  );
}

function CardFilterForm({
  q,
  statusFilter,
}: {
  q: string;
  statusFilter?: SubscriptionStatus;
}) {
  return (
    <form
      className="bg-card flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:flex-wrap sm:items-end"
      method="get"
    >
      <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
        <Label htmlFor="sub-q">Customer email</Label>
        <Input
          id="sub-q"
          name="q"
          defaultValue={q}
          placeholder="Search by email"
          type="search"
        />
      </div>
      <div className="flex w-full flex-col gap-1.5 sm:w-48">
        <Label htmlFor="sub-status">Status</Label>
        <select
          id="sub-status"
          name="status"
          defaultValue={statusFilter ?? ""}
          className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-3"
        >
          <option value="">All statuses</option>
          {Object.values(SubscriptionStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit">Apply filters</Button>
    </form>
  );
}
