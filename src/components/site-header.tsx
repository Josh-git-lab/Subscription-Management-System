import { logoutAction } from "@/actions/auth";
import { auth } from "@/auth";
import { MainNavLink } from "@/components/main-nav-link";
import { GlassButton } from "@/components/marketing/glass-button";
import { LogoChip } from "@/components/marketing/logo-chip";
import { MarketingContainer } from "@/components/marketing/container";
import { PrimaryButton } from "@/components/marketing/primary-button";
import { isCustomer, isStaffOrAdmin } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

export async function SiteHeader() {
  const session = await auth();
  const staff = isStaffOrAdmin(session?.user?.role);
  const customer = isCustomer(session?.user?.role);

  return (
    <>
      <header className="m-header">
        <div className="m-header__fade" aria-hidden />
        <MarketingContainer className="m-header__bar">
          <div className="m-header__start">
            <LogoChip href="/" />
          </div>
          <nav
            className="m-header__center hidden min-w-0 flex-wrap items-center justify-center gap-1 md:flex"
            aria-label="Main"
          >
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
          <div className="m-header__actions">
            {session?.user ? (
              <>
                <span className="text-muted-foreground hidden max-w-[12rem] truncate text-sm lg:inline">
                  {session.user.email}
                </span>
                <span className="rf-type-meta bg-secondary text-muted-foreground rounded-md px-2 py-1">
                  {session.user.role}
                </span>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className={cn(
                      "btn-glass glass-control min-h-[44px] px-4",
                      "rf-type-ui cursor-pointer",
                    )}
                  >
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <GlassButton reflective href="/login" className="m-header__learn">
                  Log in
                </GlassButton>
                <PrimaryButton href="/register" className="m-header__download">
                  Register
                </PrimaryButton>
              </>
            )}
            {!session?.user ? (
              <GlassButton reflective href="/plans" className="m-header__menu md:hidden">
                <span className="m-header__menu-icon" aria-hidden>
                  <span />
                  <span />
                </span>
                Plans
              </GlassButton>
            ) : (
              <GlassButton reflective href="/plans" className="m-header__menu md:hidden">
                Menu
              </GlassButton>
            )}
          </div>
        </MarketingContainer>
      </header>
      <div className="m-header-spacer" aria-hidden />
    </>
  );
}
