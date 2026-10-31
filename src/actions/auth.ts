"use server";

import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { hashPassword } from "@/lib/auth/password";
import { isStaffOrAdmin } from "@/lib/auth/roles";
import { prisma } from "@/lib/db/prisma";
import { checkRateLimit } from "@/lib/rate-limit/memory-limiter";
import { createResetToken, hashResetToken } from "@/lib/auth/reset-token";
import {
  forgotPasswordSchema,
  loginFormSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth";

export type AuthActionState = { error?: string; ok?: boolean };

export async function registerAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const ip = "register";
  const limited = checkRateLimit(ip, 5, 60_000);
  if (!limited.ok) {
    return { error: "Too many attempts. Try again later." };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Invalid registration details." };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Unable to create account with those details." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.user.create({
    data: {
      email,
      name: parsed.data.name,
      passwordHash,
      role: UserRole.CUSTOMER,
    },
  });

  const signInResult = await signIn("credentials", {
    email,
    password: parsed.data.password,
    redirect: false,
  });
  if (signInResult?.error) {
    return { error: "Account created but sign-in failed. Try logging in." };
  }

  redirect("/plans");
}

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const limited = checkRateLimit("login", 10, 60_000);
  if (!limited.ok) {
    return { error: "Too many attempts. Try again later." };
  }

  const parsed = loginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Invalid email or password." };
  }

  const email = parsed.data.email.toLowerCase();

  const signInResult = await signIn("credentials", {
    email,
    password: parsed.data.password,
    redirect: false,
  });
  if (signInResult?.error) {
    return { error: "Invalid email or password." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user && isStaffOrAdmin(user.role)) {
    redirect("/admin/dashboard");
  }

  redirect("/plans");
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function forgotPasswordAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const limited = checkRateLimit("forgot-password", 5, 60_000);
  if (!limited.ok) {
    return { error: "Too many attempts. Try again later." };
  }

  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { ok: true };
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = createResetToken();
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    });
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: token.tokenHash,
        expiresAt: token.expiresAt,
      },
    });
    if (process.env.NODE_ENV !== "production") {
      const { getSiteUrl } = await import("@/lib/site/url");
      const link = `${getSiteUrl()}/reset-password?token=${token.raw}`;
      console.info(`[mail:log] Password reset for ${email}: ${link}`);
    }
  }

  return { error: undefined, ok: true };
}

export async function resetPasswordAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const limited = checkRateLimit("reset-password", 8, 60_000);
  if (!limited.ok) {
    return { error: "Too many attempts. Try again later." };
  }

  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Reset link is invalid or the password does not meet the rules." };
  }

  const tokenHash = hashResetToken(parsed.data.token);
  const row = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });
  if (!row || row.usedAt || row.expiresAt.getTime() < Date.now()) {
    return { error: "Reset link is invalid or expired." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: row.userId },
      data: {
        passwordHash,
        sessionVersion: { increment: 1 },
      },
    }),
    prisma.passwordResetToken.update({
      where: { id: row.id },
      data: { usedAt: new Date() },
    }),
  ]);

  redirect("/login");
}
