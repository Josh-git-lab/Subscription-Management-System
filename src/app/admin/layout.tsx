import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin/admin-nav";
import { auth } from "@/auth";
import { isStaffOrAdmin } from "@/lib/auth/roles";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id || !isStaffOrAdmin(session.user.role)) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:py-8">
      <AdminNav role={session.user.role} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
