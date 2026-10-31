"use server";

import { SubscriptionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/session";
import { allocateSubscriptionNumber } from "@/lib/subscriptions/number";
import {
  advanceSubscriptionSchema,
  cancelSubscriptionSchema,
  subscribeSchema,
} from "@/lib/validation/subscribe";

export type ActionResult = { error?: string; ok?: boolean };

export async function subscribeAction(planId: unknown): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "CUSTOMER") {
    return { error: "Unauthorized" };
  }

  const parsed = subscribeSchema.safeParse({ planId });
  if (!parsed.success) {
    return { error: "Invalid plan" };
  }

  const plan = await prisma.plan.findFirst({
    where: { id: parsed.data.planId, active: true },
  });
  if (!plan) {
    return { error: "Plan not found" };
  }

  const existingActive = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      planId: plan.id,
      status: SubscriptionStatus.ACTIVE,
    },
  });
  if (existingActive) {
    return { error: "You already have an active subscription for this plan." };
  }

  const number = await allocateSubscriptionNumber();
  await prisma.subscription.create({
    data: {
      number,
      userId: session.user.id,
      planId: plan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date(),
    },
  });

  revalidatePath("/my-subscriptions");
  revalidatePath("/plans");
  return { ok: true };
}

export async function cancelSubscriptionAction(
  subscriptionId: unknown,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const parsed = cancelSubscriptionSchema.safeParse({ subscriptionId });
  if (!parsed.success) {
    return { error: "Invalid subscription" };
  }

  const sub = await prisma.subscription.findUnique({
    where: { id: parsed.data.subscriptionId },
  });
  if (!sub || sub.userId !== session.user.id) {
    return { error: "Subscription not found" };
  }
  if (sub.status !== SubscriptionStatus.ACTIVE) {
    return { error: "Only active subscriptions can be cancelled." };
  }

  await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      status: SubscriptionStatus.CLOSED,
      endDate: new Date(),
    },
  });

  revalidatePath("/my-subscriptions");
  return { ok: true };
}

const forwardStatus: Partial<
  Record<SubscriptionStatus, SubscriptionStatus>
> = {
  DRAFT: SubscriptionStatus.QUOTATION,
  QUOTATION: SubscriptionStatus.CONFIRMED,
  CONFIRMED: SubscriptionStatus.ACTIVE,
};

export async function advanceSubscriptionAction(
  subscriptionId: unknown,
): Promise<ActionResult> {
  await requireRole(["ADMIN", "STAFF"]);
  const parsed = advanceSubscriptionSchema.safeParse({ subscriptionId });
  if (!parsed.success) {
    return { error: "Invalid subscription" };
  }

  const sub = await prisma.subscription.findUnique({
    where: { id: parsed.data.subscriptionId },
  });
  if (!sub) {
    return { error: "Subscription not found" };
  }
  const next = forwardStatus[sub.status];
  if (!next) {
    return { error: "This subscription cannot be advanced." };
  }

  await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      status: next,
      ...(next === SubscriptionStatus.ACTIVE && !sub.startDate
        ? { startDate: new Date() }
        : {}),
    },
  });

  revalidatePath("/admin/subscriptions");
  revalidatePath("/admin/dashboard");
  return { ok: true };
}
