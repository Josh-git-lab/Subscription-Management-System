import Link from "next/link";

import { CopyrightYear } from "@/components/copyright-year";

export function SiteFooter() {
  return (
    <footer className="border-border bg-background mt-auto border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-foreground font-semibold">Brightloop Software</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Unified subscription billing—replace spreadsheets with one console
            for plans, customers, and invoices.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
          aria-label="Footer"
        >
          <Link
            href="/plans"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm focus-visible:ring-3 focus-visible:outline-none"
          >
            Plans
          </Link>
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm focus-visible:ring-3 focus-visible:outline-none"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm focus-visible:ring-3 focus-visible:outline-none"
          >
            Register
          </Link>
        </nav>
      </div>
      <div className="border-border text-muted-foreground border-t px-4 py-4 text-center text-xs sm:px-6">
        © <CopyrightYear /> Brightloop Software. Demo application.
      </div>
    </footer>
  );
}
