"use client";

import { useActionState } from "react";

import { resetPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reset-password">New password</Label>
        <Input
          id="reset-password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          minLength={12}
          aria-describedby="reset-password-hint"
        />
        <p id="reset-password-hint" className="text-muted-foreground text-xs">
          At least 12 characters with uppercase, lowercase, a number, and a special character.
        </p>
      </div>
      {state.error ? (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Please wait…" : "Update password"}
      </Button>
    </form>
  );
}
