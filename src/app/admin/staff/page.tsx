import type { Metadata } from "next";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { CreateStaffForm } from "@/components/create-staff-form";
import { PageShell } from "@/components/page-shell";
import { prisma } from "@/lib/db/prisma";

export const instant = false;

export const metadata: Metadata = {
  title: "Staff",
  robots: { index: false },
};

export default async function AdminStaffPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }

  const staff = await prisma.user.findMany({
    where: { role: UserRole.STAFF },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return (
    <PageShell
      title="Staff accounts"
      description="Only administrators can create staff. Staff can run billing and record payments. They cannot create other staff or change billing rules."
      width="full"
    >
      <CreateStaffForm />
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 font-medium" scope="col">
                Name
              </th>
              <th className="p-3 font-medium" scope="col">
                Email
              </th>
              <th className="p-3 font-medium" scope="col">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 ? (
              <tr>
                <td className="text-muted-foreground p-6" colSpan={3}>
                  No staff accounts yet.
                </td>
              </tr>
            ) : (
              staff.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.createdAt.toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
