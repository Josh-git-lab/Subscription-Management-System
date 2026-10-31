import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { cancelSubscriptionAction } from "@/actions/subscriptions";
import { auth } from "@/auth";
import { CancelButton } from "@/components/cancel-button";
import { PageShell } from "@/components/page-shell";
import { SubscriptionStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatInrFromMinor } from "@/lib/money/format-inr";
import { prisma } from "@/lib/db/prisma";

export const instant = false;

export const metadata: Metadata = {
  title: "My subscriptions",
  robots: { index: false },
};

export default async function MySubscriptionsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  const activeCount = subscriptions.filter(
    (sub) => sub.status === "ACTIVE",
  ).length;

  return (
    <PageShell
      title="My subscriptions"
      description="View and manage your Brightloop plans."
      width="lg"
    >
      {subscriptions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No active plans</CardTitle>
            <CardDescription>
              You have not subscribed yet. Pick a plan to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/plans">
              <Button type="button">Browse plans</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {activeCount === 0 ? (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>No active plans</CardTitle>
                <CardDescription>
                  All subscriptions are closed. Past subscriptions are listed
                  below, or subscribe again from the catalog.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/plans">
                  <Button type="button">Browse plans</Button>
                </Link>
              </CardContent>
            </Card>
          ) : null}
          <div className="hidden overflow-x-auto rounded-xl border md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 font-medium" scope="col">
                    Plan
                  </th>
                  <th className="p-3 font-medium" scope="col">
                    Status
                  </th>
                  <th className="p-3 font-medium" scope="col">
                    Price
                  </th>
                  <th className="p-3 font-medium" scope="col">
                    Started
                  </th>
                  <th className="p-3 font-medium" scope="col">
                    Ended
                  </th>
                  <th className="p-3 font-medium" scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-t">
                    <td className="p-3 font-medium">{sub.plan.name}</td>
                    <td className="p-3">
                      <SubscriptionStatusBadge status={sub.status} />
                    </td>
                    <td className="p-3">
                      {formatInrFromMinor(
                        sub.plan.priceMinor,
                        sub.plan.currency,
                      )}
                    </td>
                    <td className="p-3">
                      {sub.startDate.toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {sub.endDate
                        ? sub.endDate.toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-3">
                      {sub.status === "ACTIVE" ? (
                        <CancelButton
                          subscriptionId={sub.id}
                          action={cancelSubscriptionAction}
                        />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="flex flex-col gap-4 md:hidden">
            {subscriptions.map((sub) => (
              <li key={sub.id}>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">
                        {sub.plan.name}
                      </CardTitle>
                      <SubscriptionStatusBadge status={sub.status} />
                    </div>
                    <CardDescription>
                      {formatInrFromMinor(
                        sub.plan.priceMinor,
                        sub.plan.currency,
                      )}{" "}
                      · Started {sub.startDate.toLocaleDateString()}
                      {sub.endDate
                        ? ` · Ended ${sub.endDate.toLocaleDateString()}`
                        : ""}
                    </CardDescription>
                  </CardHeader>
                  {sub.status === "ACTIVE" ? (
                    <CardContent className="pt-0">
                      <CancelButton
                        subscriptionId={sub.id}
                        action={cancelSubscriptionAction}
                      />
                    </CardContent>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </PageShell>
  );
}
