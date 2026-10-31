"use client";

import { useActionState } from "react";

import {
  createDiscountAction,
  setTaxRateAction,
} from "@/actions/billing-rules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BillingRulesForms({
  ratePercent,
  subscriptions,
}: {
  ratePercent: number;
  subscriptions: { id: string; label: string }[];
}) {
  const [taxState, taxAction, taxPending] = useActionState(setTaxRateAction, {});
  const [discountState, discountAction, discountPending] = useActionState(
    createDiscountAction,
    {},
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={taxAction} className="flex flex-col gap-3 rounded-xl border p-4">
        <h2 className="text-lg font-semibold">Tax rate</h2>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tax-rate">Percent</Label>
          <Input
            id="tax-rate"
            name="ratePercent"
            type="number"
            min={0}
            max={100}
            step={1}
            defaultValue={ratePercent}
            required
          />
        </div>
        {taxState.error ? (
          <p className="text-destructive text-sm" role="alert">
            {taxState.error}
          </p>
        ) : null}
        {taxState.ok ? (
          <p className="text-sm" role="status">
            Tax rate saved. It applies on the next billing run.
          </p>
        ) : null}
        <Button type="submit" disabled={taxPending}>
          {taxPending ? "Saving…" : "Save tax rate"}
        </Button>
      </form>

      <form action={discountAction} className="flex flex-col gap-3 rounded-xl border p-4">
        <h2 className="text-lg font-semibold">Discount</h2>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="discount-name">Name</Label>
          <Input id="discount-name" name="name" required maxLength={80} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="discount-sub">Subscription</Label>
          <select
            id="discount-sub"
            name="subscriptionId"
            required
            className="border-input bg-background h-9 rounded-md border px-2 text-sm"
            defaultValue=""
          >
            <option value="" disabled>
              Select a subscription
            </option>
            {subscriptions.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="discount-type">Type</Label>
          <select
            id="discount-type"
            name="type"
            defaultValue="PERCENT"
            className="border-input bg-background h-9 rounded-md border px-2 text-sm"
          >
            <option value="PERCENT">Percent</option>
            <option value="FIXED">Fixed rupees</option>
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="discount-percent">Percent</Label>
            <Input id="discount-percent" name="percent" type="number" min={1} max={100} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="discount-rupees">Fixed amount (₹)</Label>
            <Input id="discount-rupees" name="amountRupees" type="number" min={1} step={1} />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="discount-start">Starts</Label>
            <Input id="discount-start" name="startsAt" type="date" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="discount-end">Ends</Label>
            <Input id="discount-end" name="endsAt" type="date" required />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="discount-uses">Usage limit</Label>
          <Input
            id="discount-uses"
            name="usageLimit"
            type="number"
            min={1}
            max={1000}
            defaultValue={1}
            required
          />
        </div>
        {discountState.error ? (
          <p className="text-destructive text-sm" role="alert">
            {discountState.error}
          </p>
        ) : null}
        {discountState.ok ? (
          <p className="text-sm" role="status">
            Discount saved. It applies on the next invoice for that subscription.
          </p>
        ) : null}
        <Button type="submit" disabled={discountPending}>
          {discountPending ? "Saving…" : "Create discount"}
        </Button>
      </form>
    </div>
  );
}
