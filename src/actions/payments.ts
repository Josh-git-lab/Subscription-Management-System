"use server";

import { InvoiceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { recordPaymentSchema } from "@/lib/validation/subscribe";

export type ActionResult = { error?: string; ok?: boolean };

export async function recordPaymentAction(
  input: unknown,
): Promise<ActionResult> {
  await requireRole(["ADMIN", "STAFF"]);

  const parsed = recordPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid payment" };
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: parsed.data.invoiceId },
  });
  if (!invoice) {
    return { error: "Invoice not found" };
  }
  if (invoice.status === InvoiceStatus.PAID) {
    return { error: "Invoice already paid" };
  }

  const paidOn = new Date(`${parsed.data.paidOn}T00:00:00.000Z`);
  if (Number.isNaN(paidOn.getTime())) {
    return { error: "Invalid payment date" };
  }

  const newPaid = invoice.amountPaidMinor + parsed.data.amountMinor;
  const newDue = invoice.amountDueMinor - parsed.data.amountMinor;

  if (newDue < 0) {
    return { error: "Payment exceeds amount due" };
  }

  await prisma.$transaction([
    prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amountMinor: parsed.data.amountMinor,
        currency: invoice.currency,
        method: parsed.data.method,
        note: parsed.data.note || null,
        paidOn,
      },
    }),
    prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        amountPaidMinor: newPaid,
        amountDueMinor: newDue,
        status:
          newDue === 0
            ? InvoiceStatus.PAID
            : newPaid > 0
              ? InvoiceStatus.PARTIAL
              : invoice.status,
      },
    }),
  ]);

  revalidatePath("/admin/invoices");
  revalidatePath("/admin/dashboard");
  revalidatePath("/my-invoices");
  return { ok: true };
}
