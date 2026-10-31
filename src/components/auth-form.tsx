"use client";

import { useActionState } from "react";

import type { AuthActionState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  action: (
    prev: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
  submitLabel: string;
  showName?: boolean;
  children?: React.ReactNode;
};

export function AuthForm({ action, submitLabel, showName, children }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {showName ? "Account details" : "Sign in"}
        </CardTitle>
        <CardDescription>
          {showName
            ? "Customers register here. Staff accounts are seeded separately."
            : "Use your Brightloop email and password."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          {children}
          {showName ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="auth-name">Full name</Label>
              <Input
                id="auth-name"
                name="name"
                required
                autoComplete="name"
              />
            </div>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              name="password"
              type="password"
              required
              autoComplete={showName ? "new-password" : "current-password"}
              minLength={showName ? 12 : 8}
            />
            {showName ? (
              <p className="text-muted-foreground text-xs" id="password-hints">
                At least 12 characters with uppercase, lowercase, a number, and a special character.
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">
                Minimum 8 characters.
              </p>
            )}
          </div>
          {state.error ? (
            <p className="text-destructive text-sm" role="alert">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Please wait…" : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
