import { InvoiceStatus, SubscriptionStatus } from "@prisma/client";
import { addDays } from "date-fns";

import { computeInvoiceTotalMinor } from "@/lib/billing/invoice-total";
import { addInterval } from "@/lib/billing/periods";
import { prisma } from "@/lib/db/prisma";

export function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}

export async function runBillingCycle(now = new Date()): Promise<{
  created: number;
}> {
  const activeSubs = await prisma.subscription.findMany({
    where: {
      status: SubscriptionStatus.ACTIVE,
      OR: [{ endDate: null }, { endDate: { gt: now } }],
    },
    include: { plan: true },
  });

  const tax = await prisma.taxSetting.findUnique({ where: { id: "default" } });
  const taxRatePercent = tax?.ratePercent ?? 0;

  let created = 0;

  for (const sub of activeSubs) {
    const lastInvoice = await prisma.invoice.findFirst({
      where: { subscriptionId: sub.id },
      orderBy: { periodStart: "desc" },
    });

    const periodStart = lastInvoice ? lastInvoice.periodEnd : sub.startDate;
    const periodEnd = addInterval(periodStart, sub.plan.interval);

    if (periodStart > now) {
      continue;
    }

    const discounts = await prisma.discount.findMany({
      where: {
        subscriptionId: sub.id,
        active: true,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      orderBy: { createdAt: "asc" },
    });
    const matchingDiscount =
      discounts.find((discount) => discount.usedCount < discount.usageLimit) ??
      null;

    const amountDueMinor = computeInvoiceTotalMinor(
      sub.plan.priceMinor,
      matchingDiscount
        ? {
            type: matchingDiscount.type,
            percent: matchingDiscount.percent,
            amountMinor: matchingDiscount.amountMinor,
          }
        : null,
      taxRatePercent,
    );

    try {
      await prisma.$transaction(async (tx) => {
        await tx.invoice.create({
          data: {
            userId: sub.userId,
            subscriptionId: sub.id,
            periodStart,
            periodEnd,
            amountDueMinor,
            amountPaidMinor: 0,
            currency: sub.plan.currency,
            dueDate: addDays(periodEnd, 7),
            status: InvoiceStatus.ISSUED,
          },
        });
        if (matchingDiscount) {
          await tx.discount.update({
            where: { id: matchingDiscount.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      });
      created += 1;
    } catch (error) {
      if (!isUniqueConstraintError(error)) {
        throw error;
      }
    }
  }

  return { created };
}
