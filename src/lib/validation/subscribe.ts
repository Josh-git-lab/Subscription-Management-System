import { z } from "zod";

export const subscribeSchema = z.object({
  planId: z.string().cuid(),
});

export const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().cuid(),
});

export const paymentMethods = ["UPI", "CARD", "BANK", "CASH"] as const;

export const recordPaymentSchema = z.object({
  invoiceId: z.string().cuid(),
  amountMinor: z.number().int().positive(),
  method: z.enum(paymentMethods),
  paidOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().trim().max(200).optional(),
});

export const advanceSubscriptionSchema = z.object({
  subscriptionId: z.string().cuid(),
});

export const taxRateSchema = z.object({
  ratePercent: z.number().int().min(0).max(100),
});

export const createDiscountSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    subscriptionId: z.string().cuid(),
    type: z.enum(["PERCENT", "FIXED"]),
    percent: z.number().int().min(1).max(100).optional(),
    amountMinor: z.number().int().positive().optional(),
    startsAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endsAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    usageLimit: z.number().int().min(1).max(1000),
  })
  .superRefine((value, ctx) => {
    if (value.type === "PERCENT" && value.percent == null) {
      ctx.addIssue({
        code: "custom",
        message: "Percent is required",
        path: ["percent"],
      });
    }
    if (value.type === "FIXED" && value.amountMinor == null) {
      ctx.addIssue({
        code: "custom",
        message: "Amount is required",
        path: ["amountMinor"],
      });
    }
  });
