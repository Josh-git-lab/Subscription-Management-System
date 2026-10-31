import type { Metadata } from "next";
import Link from "next/link";

import { registerAction } from "@/actions/auth";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Register",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-tight">
          Create account
        </h1>
        <p className="text-muted-foreground text-sm">
          New accounts are customers only. You can browse plans and subscribe
          after registering.
        </p>
      </div>
      <AuthForm action={registerAction} submitLabel="Create account" showName>
        <input type="hidden" name="mode" value="register" />
      </AuthForm>
      <p className="text-muted-foreground text-center text-sm sm:text-left">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </main>
  );
}
