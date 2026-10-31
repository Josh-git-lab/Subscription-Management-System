import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { BillingRulesForms } from "@/components/billing-rules-forms";
import { PageShell } from "@/components/page-shell";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Billing rules",
  robots: { index: false },
};

export default async function AdminSettingsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }

  const [tax, subscriptions, discounts] = await Promise.all([
    prisma.taxSetting.findUnique({ where: { id: "default" } }),
    prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: true, plan: true },
    }),
    prisma.discount.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { subscription: { include: { plan: true, user: true } } },
    }),
  ]);

  return (
    <PageShell
      title="Billing rules"
      description="Tax applies to the next billing run. A discount auto-applies to the next invoice for one subscription until it expires or its usage limit is reached."
      width="full"
    >
      <BillingRulesForms
        ratePercent={tax?.ratePercent ?? 0}
        subscriptions={subscriptions.map((sub) => ({
          id: sub.id,
          label: `${sub.number ?? sub.id.slice(0, 6)} · ${sub.user.email} · ${sub.plan.name}`,
        }))}
      />
      <section className="space-y-2" aria-labelledby="discount-list">
        <h2 id="discount-list" className="text-xl font-semibold">
          Discounts
        </h2>
        {discounts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No discounts yet.</p>
        ) : (
          <ul className="divide-y rounded-xl border text-sm">
            {discounts.map((discount) => (
              <li key={discount.id} className="flex flex-col gap-1 p-3">
                <span className="font-medium">{discount.name}</span>
                <span className="text-muted-foreground">
                  {discount.subscription.number ?? "Subscription"} ·{" "}
                  {discount.subscription.user.email} · used {discount.usedCount}/
                  {discount.usageLimit}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
