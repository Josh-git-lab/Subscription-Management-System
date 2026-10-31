import type { Metadata } from "next";
import Link from "next/link";

import { loginAction } from "@/actions/auth";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main className="rf-env-wash-flat mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="rf-type-h2">Log in</h1>
        <p className="text-muted-foreground text-sm">
          Customers go to plans after sign-in. Staff and admins go to the
          operations dashboard.
        </p>
      </div>
      <AuthForm action={loginAction} submitLabel="Log in">
        <input type="hidden" name="mode" value="login" />
      </AuthForm>
      <p className="text-sm">
        <Link
          href="/forgot-password"
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          Forgot password
        </Link>
      </p>
      <p className="text-muted-foreground text-center text-sm sm:text-left">
        No account?{" "}
        <Link
          href="/register"
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          Register as a customer
        </Link>
      </p>
    </main>
  );
}
