"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore, useTransition } from "react";

import { recordPaymentAction } from "@/actions/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatInrFromMinor,
  rupeesToMinor,
} from "@/lib/money/format-inr";

export function RecordPaymentForm({
  invoiceId,
  maxMinor,
  currency = "INR",
}: {
  invoiceId: string;
  maxMinor: number;
  currency?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const today = useSyncExternalStore(
    () => () => {},
    () => new Date().toISOString().slice(0, 10),
    () => "",
  );
  const [paidOn, setPaidOn] = useState("");
  const maxRupees = maxMinor / 100;

  return (
    <form
      className="flex min-w-[10rem] flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        setError("");
        const fd = new FormData(e.currentTarget);
        const rupees = Number(fd.get("amountRupees"));
        if (!Number.isFinite(rupees) || rupees <= 0) {
          setError("Enter a valid amount.");
          return;
        }
        const amountMinor = rupeesToMinor(rupees);
        if (amountMinor > maxMinor) {
          setError(`Cannot exceed ${formatInrFromMinor(maxMinor, currency)}.`);
          return;
        }
        const method = String(fd.get("method") ?? "");
        const paidOnValue = String(fd.get("paidOn") ?? "") || today;
        const note = String(fd.get("note") ?? "");
        startTransition(async () => {
          const result = await recordPaymentAction({
            invoiceId,
            amountMinor,
            method,
            paidOn: paidOnValue,
            note: note || undefined,
          });
          if (result.error) {
            setError(result.error);
            return;
          }
          router.refresh();
        });
      }}
    >
      <Label htmlFor={`pay-${invoiceId}`} className="text-xs">
        Amount (max {formatInrFromMinor(maxMinor, currency)})
      </Label>
      <Label htmlFor={`method-${invoiceId}`} className="text-xs">
        Method
      </Label>
      <select
        id={`method-${invoiceId}`}
        name="method"
        defaultValue="UPI"
        className="border-input bg-background h-9 rounded-md border px-2 text-sm"
        required
      >
        <option value="UPI">UPI</option>
        <option value="CARD">Card</option>
        <option value="BANK">Bank transfer</option>
        <option value="CASH">Cash</option>
      </select>
      <Label htmlFor={`date-${invoiceId}`} className="text-xs">
        Payment date
      </Label>
      <Input
        id={`date-${invoiceId}`}
        name="paidOn"
        type="date"
        required
        value={paidOn || today}
        onChange={(event) => setPaidOn(event.target.value)}
      />
      <Label htmlFor={`note-${invoiceId}`} className="text-xs">
        Note
      </Label>
      <Input id={`note-${invoiceId}`} name="note" maxLength={200} />
      <div className="flex gap-2">
        <Input
          id={`pay-${invoiceId}`}
          name="amountRupees"
          type="number"
          min={0.01}
          max={maxRupees}
          step={0.01}
          defaultValue={maxRupees}
          required
          className="w-24"
          aria-describedby={error ? `pay-err-${invoiceId}` : undefined}
        />
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Record"}
        </Button>
      </div>
      {error ? (
        <p
          id={`pay-err-${invoiceId}`}
          className="text-destructive text-xs"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
