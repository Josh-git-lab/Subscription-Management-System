import type { Metadata } from "next";
import Link from "next/link";

import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Reset password</h1>
        <p className="text-muted-foreground text-sm">
          Choose a new password. This signs out other sessions for the account.
        </p>
      </div>
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="text-sm" role="alert">
          This reset link is missing a token. Request a new one.
        </p>
      )}
      <p className="text-sm">
        <Link href="/forgot-password" className="text-primary underline-offset-4 hover:underline">
          Request a new link
        </Link>
      </p>
    </main>
  );
}
