import Link from "next/link";

import { logoutAction } from "@/actions/auth";
import { auth } from "@/auth";
import { MainNavLink } from "@/components/main-nav-link";
import { Button } from "@/components/ui/button";
import { isCustomer, isStaffOrAdmin } from "@/lib/auth/roles";

export async function SiteHeader() {
  const session = await auth();
  const staff = isStaffOrAdmin(session?.user?.role);
  const customer = isCustomer(session?.user?.role);

  return (
    <header className="border-border bg-background/95 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
          <Link
            href="/"
            className="text-foreground mr-3 flex items-center gap-2 text-base font-semibold tracking-tight focus-visible:ring-ring focus-visible:ring-3 focus-visible:outline-none"
          >
            <span
              className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-xs font-bold"
              aria-hidden
            >
              B
            </span>
            Brightloop
          </Link>
          <nav className="flex flex-wrap items-center gap-1" aria-label="Main">
            <MainNavLink href="/plans">Plans</MainNavLink>
            {customer ? (
              <>
                <MainNavLink href="/my-subscriptions">My subscriptions</MainNavLink>
                <MainNavLink href="/my-invoices">My invoices</MainNavLink>
              </>
            ) : null}
            {staff ? (
              <MainNavLink href="/admin/dashboard">Console</MainNavLink>
            ) : null}
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {session?.user ? (
            <>
              <span className="text-muted-foreground hidden max-w-[12rem] truncate text-sm sm:inline">
                {session.user.email}
              </span>
              <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium">
                {session.user.role}
              </span>
              <form action={logoutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Log out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button type="button" variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button type="button" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
