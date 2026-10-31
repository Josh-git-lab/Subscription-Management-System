"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { runBillingAction } from "@/actions/billing";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function BillingRunButton() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<"success" | "destructive">("success");
  const [pending, startTransition] = useTransition();

  function run(catchUp: boolean) {
    setMessage("");
    startTransition(async () => {
      try {
        const data = await runBillingAction({ catchUp });
        setVariant("success");
        setMessage(
          data.created > 0
            ? `Billing run complete — created ${data.created} invoice(s). Nothing is billed twice for the same period.`
            : "Created 0 invoices. Nothing is billed twice for the same period.",
        );
        router.refresh();
      } catch {
        setVariant("destructive");
        setMessage("Billing run failed. Try again.");
      }
    });
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:max-w-md sm:items-end">
      <div className="flex flex-wrap gap-2 sm:justify-end">
        <Button
          type="button"
          disabled={pending}
          onClick={() => run(false)}
        >
          {pending ? "Running billing…" : "Run billing"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() => run(true)}
        >
          Simulate catch-up
        </Button>
      </div>
      {message ? (
        <Alert variant={variant} className="w-full sm:text-right">
          {message}
        </Alert>
      ) : null}
    </div>
  );
}
