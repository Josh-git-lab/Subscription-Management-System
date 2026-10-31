"use client";

import { useActionState } from "react";

import { createStaffAction } from "@/actions/staff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateStaffForm() {
  const [state, action, pending] = useActionState(createStaffAction, {});

  return (
    <form action={action} className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="staff-name">Name</Label>
        <Input id="staff-name" name="name" required autoComplete="name" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="staff-email">Email</Label>
        <Input id="staff-email" name="email" type="email" required autoComplete="off" />
      </div>
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="staff-password">Temporary password</Label>
        <Input
          id="staff-password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          minLength={12}
          aria-describedby="staff-password-hint"
        />
        <p id="staff-password-hint" className="text-muted-foreground text-xs">
          At least 12 characters with uppercase, lowercase, a number, and a special character.
        </p>
      </div>
      {state.ok ? (
        <p className="text-sm sm:col-span-2" role="status">
          Staff account created.
        </p>
      ) : null}
      {state.error ? (
        <p className="text-destructive text-sm sm:col-span-2" role="alert">
          {state.error}
        </p>
      ) : null}
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create staff"}
        </Button>
      </div>
    </form>
  );
}
