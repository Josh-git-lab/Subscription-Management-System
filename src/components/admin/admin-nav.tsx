"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", adminOnly: false },
  { href: "/admin/subscriptions", label: "Subscriptions", adminOnly: false },
  { href: "/admin/invoices", label: "Invoices", adminOnly: false },
  { href: "/admin/staff", label: "Staff", adminOnly: true },
  { href: "/admin/settings", label: "Billing rules", adminOnly: true },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav({ role }: { role?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin console"
      className="rf-admin-sidebar rf-glass-l2 flex flex-row gap-1 overflow-x-auto lg:w-56 lg:shrink-0 lg:flex-col lg:overflow-visible"
    >
      <p className="text-muted-foreground rf-type-meta mb-2 hidden tracking-wide uppercase lg:block">
        Console
      </p>
      {links
        .filter((link) => !link.adminOnly || role === "ADMIN")
        .map(({ href, label }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            data-active={active ? "true" : "false"}
            className={cn("rf-nav-pill whitespace-nowrap", active && "font-semibold")}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
