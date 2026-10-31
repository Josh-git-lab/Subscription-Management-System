"use client";

import { useActionState } from "react";

import { forgotPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="forgot-email">Email</Label>
        <Input id="forgot-email" name="email" type="email" required autoComplete="email" />
      </div>
      {state.ok ? (
        <p className="text-sm" role="status">
          If an account exists for that email, reset instructions were sent.
        </p>
      ) : null}
      {state.error ? (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Please wait…" : "Send reset link"}
      </Button>
    </form>
  );
}
