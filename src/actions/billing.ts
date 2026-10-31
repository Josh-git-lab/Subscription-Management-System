"use server";

import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/session";
import { runBillingCycle } from "@/lib/billing/run-billing";

export async function runBillingAction(input?: {
  catchUp?: boolean;
}): Promise<{ created: number }> {
  await requireRole(["ADMIN", "STAFF"]);
  const catchUp = input?.catchUp === true;
  const now = catchUp ? addDays(new Date(), 35) : new Date();
  const result = await runBillingCycle(now);
  revalidatePath("/admin/invoices");
  revalidatePath("/admin/dashboard");
  revalidatePath("/my-invoices");
  return result;
}
