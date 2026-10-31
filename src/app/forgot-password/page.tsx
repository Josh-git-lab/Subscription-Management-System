import type { Metadata } from "next";
import Link from "next/link";

import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Forgot password</h1>
        <p className="text-muted-foreground text-sm">
          Enter the email on your Brightloop account. If it exists, reset
          instructions are issued. In local development the link is written to
          the server log.
        </p>
      </div>
      <ForgotPasswordForm />
      <p className="text-sm">
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          Back to log in
        </Link>
      </p>
    </main>
  );
}
