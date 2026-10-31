"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import type { ActionResult } from "@/actions/subscriptions";
import { Button } from "@/components/ui/button";

export function CancelButton({
  subscriptionId,
  action,
}: {
  subscriptionId: string;
  action: (id: string) => Promise<ActionResult>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (
          !confirm(
            "Cancel this subscription? It will be marked closed and will no longer renew in this demo.",
          )
        ) {
          return;
        }
        startTransition(async () => {
          await action(subscriptionId);
          router.refresh();
        });
      }}
    >
      {pending ? "Cancelling…" : "Cancel subscription"}
    </Button>
  );
}
