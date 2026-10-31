"use server";

import { DiscountType } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import {
  createDiscountSchema,
  taxRateSchema,
} from "@/lib/validation/subscribe";

export type ActionResult = { error?: string; ok?: boolean };

export async function setTaxRateAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole(["ADMIN"]);
  const parsed = taxRateSchema.safeParse({
    ratePercent: Number(formData.get("ratePercent")),
  });
  if (!parsed.success) {
    return { error: "Tax rate must be a whole percent from 0 to 100." };
  }

  await prisma.taxSetting.upsert({
    where: { id: "default" },
    update: { ratePercent: parsed.data.ratePercent },
    create: { id: "default", ratePercent: parsed.data.ratePercent },
  });
  revalidatePath("/admin/settings");
  return { ok: true };
}

export async function createDiscountAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole(["ADMIN"]);
  const type = formData.get("type");
  const parsed = createDiscountSchema.safeParse({
    name: formData.get("name"),
    subscriptionId: formData.get("subscriptionId"),
    type,
    percent:
      type === "PERCENT" ? Number(formData.get("percent")) : undefined,
    amountMinor:
      type === "FIXED"
        ? Math.round(Number(formData.get("amountRupees")) * 100)
        : undefined,
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    usageLimit: Number(formData.get("usageLimit")),
  });
  if (!parsed.success) {
    return { error: "Invalid discount." };
  }

  const subscription = await prisma.subscription.findUnique({
    where: { id: parsed.data.subscriptionId },
  });
  if (!subscription) {
    return { error: "Subscription not found." };
  }

  const startsAt = new Date(`${parsed.data.startsAt}T00:00:00.000Z`);
  const endsAt = new Date(`${parsed.data.endsAt}T23:59:59.000Z`);
  if (endsAt < startsAt) {
    return { error: "End date must be on or after the start date." };
  }

  await prisma.discount.create({
    data: {
      name: parsed.data.name,
      subscriptionId: subscription.id,
      type: parsed.data.type === "PERCENT" ? DiscountType.PERCENT : DiscountType.FIXED,
      percent: parsed.data.percent,
      amountMinor: parsed.data.amountMinor,
      startsAt,
      endsAt,
      usageLimit: parsed.data.usageLimit,
    },
  });

  revalidatePath("/admin/settings");
  return { ok: true };
}
