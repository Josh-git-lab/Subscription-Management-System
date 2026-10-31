import Link from "next/link";

import { CopyrightYear } from "@/components/copyright-year";
import { GlassButton } from "@/components/marketing/glass-button";
import { LogoChip } from "@/components/marketing/logo-chip";
import { MarketingContainer } from "@/components/marketing/container";
import { PrimaryButton } from "@/components/marketing/primary-button";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Plans", href: "/plans" },
      { label: "My subscriptions", href: "/my-subscriptions" },
      { label: "My invoices", href: "/my-invoices" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "Forgot password", href: "/forgot-password" },
    ],
  },
  {
    title: "Admin",
    links: [{ label: "Console", href: "/admin/dashboard" }],
  },
] as const;

export function SiteFooter() {
  return (
    <footer id="site-footer" className="m-footer">
      <MarketingContainer>
        <div className="m-footer__grid">
          <div className="m-footer__brand">
            <LogoChip href="/" />
            <p className="m-footer__tagline">
              Unified subscription billing—replace spreadsheets with one console for
              plans, customers, and invoices.
            </p>
            <div className="m-footer__cta">
              <PrimaryButton href="/plans">Browse plans</PrimaryButton>
              <GlassButton href="/login">Log in</GlassButton>
            </div>
          </div>

          <div className="m-footer__links">
            {COLUMNS.map((col) => (
              <div key={col.title} className="m-footer__col">
                <h3 className="m-footer__col-title">{col.title}</h3>
                <ul className="m-footer__col-list">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="m-footer__meta">
          <p>
            © <CopyrightYear /> Brightloop Software
          </p>
          <p className="m-footer__meta-note">Demo application.</p>
        </div>
      </MarketingContainer>
    </footer>
  );
}
