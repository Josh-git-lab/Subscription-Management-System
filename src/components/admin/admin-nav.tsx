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
      className="flex flex-row gap-1 overflow-x-auto pb-2 lg:w-52 lg:shrink-0 lg:flex-col lg:overflow-visible lg:pb-0 lg:pr-4"
    >
      <p className="text-muted-foreground mb-2 hidden text-xs font-semibold tracking-wide uppercase lg:block">
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
            className={cn(
              "focus-visible:ring-ring rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:outline-none",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
