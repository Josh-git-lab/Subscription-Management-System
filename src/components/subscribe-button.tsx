"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { subscribeAction } from "@/actions/subscriptions";
import { Button } from "@/components/ui/button";

export function SubscribeButton({ planId }: { planId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        type="button"
        className="w-full"
        disabled={pending}
        onClick={() => {
          setMessage("");
          startTransition(async () => {
            const result = await subscribeAction(planId);
            setMessage(result.error ?? (result.ok ? "Subscribed!" : ""));
            if (result.ok) {
              router.push("/my-subscriptions");
            }
          });
        }}
      >
        {pending ? "Subscribing…" : "Subscribe"}
      </Button>
      {message ? (
        <p className="text-center text-sm" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
