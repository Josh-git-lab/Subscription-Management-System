"use server";

import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { hashPassword } from "@/lib/auth/password";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { checkRateLimit } from "@/lib/rate-limit/memory-limiter";
import { createStaffSchema } from "@/lib/validation/auth";

export type ActionResult = { error?: string; ok?: boolean };

export async function createStaffAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole(["ADMIN"]);

  const limited = checkRateLimit("create-staff", 10, 60_000);
  if (!limited.ok) {
    return { error: "Too many attempts. Try again later." };
  }

  const parsed = createStaffSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Invalid staff details. Use a strong password." };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Unable to create that staff account." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.user.create({
    data: {
      email,
      name: parsed.data.name,
      passwordHash,
      role: UserRole.STAFF,
    },
  });

  revalidatePath("/admin/staff");
  return { ok: true };
}
