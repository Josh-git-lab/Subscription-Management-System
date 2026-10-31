"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { advanceSubscriptionAction } from "@/actions/subscriptions";
import { Button } from "@/components/ui/button";

const labels: Record<string, string> = {
  DRAFT: "Mark quotation",
  QUOTATION: "Confirm",
  CONFIRMED: "Activate",
};

export function AdvanceSubscriptionButton({
  subscriptionId,
  status,
}: {
  subscriptionId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const label = labels[status];
  if (!label) return null;

  return (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => {
          setError("");
          startTransition(async () => {
            const result = await advanceSubscriptionAction(subscriptionId);
            if (result.error) {
              setError(result.error);
              return;
            }
            router.refresh();
          });
        }}
      >
        {pending ? "Saving…" : label}
      </Button>
      {error ? (
        <p className="text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
