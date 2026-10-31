import type { UserRole } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const isAdminRoute = pathname.startsWith("/admin");
      const isProtectedCustomer =
        pathname.startsWith("/my-subscriptions") ||
        pathname.startsWith("/my-invoices") ||
        pathname.startsWith("/subscribe");

      if (pathname.startsWith("/admin/staff") || pathname.startsWith("/admin/settings")) {
        return auth?.user?.role === "ADMIN";
      }

      if (isAdminRoute) {
        const role = auth?.user?.role;
        return role === "ADMIN" || role === "STAFF";
      }
      if (isProtectedCustomer) {
        return !!auth?.user;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
