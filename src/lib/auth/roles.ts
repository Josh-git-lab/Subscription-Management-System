import type { UserRole } from "@prisma/client";

export function isStaffOrAdmin(role: UserRole | undefined): boolean {
  return role === "ADMIN" || role === "STAFF";
}

export function isCustomer(role: UserRole | undefined): boolean {
  return role === "CUSTOMER";
}
