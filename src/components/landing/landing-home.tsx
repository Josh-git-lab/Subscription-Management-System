import {
  ChartLineUp,
  Receipt,
  Table,
} from "@phosphor-icons/react/dist/ssr";

import { AmbientBackground } from "@/components/landing/ambient-background";
import { GlassButton } from "@/components/marketing/glass-button";
import { MarketingContainer } from "@/components/marketing/container";
import { PrimaryButton } from "@/components/marketing/primary-button";

export function LandingHome() {
  return (
    <div className="m-landing-shell">
      <AmbientBackground />
      <main className="m-main">
        <section className="m-hero rf-env-atmosphere" id="top">
          <div className="m-hero__sky" aria-hidden />
          <MarketingContainer>
            <p className="m-hero__chip">Brightloop Software</p>
            <h1 id="hero-heading" className="m-hero__title rf-type-display">
              From spreadsheet chaos to subscription billing you can trust.
            </h1>
            <p className="m-hero__lead">
              Publish plans once, let customers subscribe in-app, and run invoice
              billing from one console—without copy-pasting renewals between tabs.
            </p>
            <div className="m-hero__actions">
              <PrimaryButton href="/plans">Browse plans</PrimaryButton>
              <GlassButton reflective href="/login">
                Log in
              </GlassButton>
            </div>
            <div className="m-hero__stage">
              <div className="rf-glass-hero rf-glass-elevated p-6 sm:p-8">
                <p className="rf-type-ui text-muted-foreground mb-4">
                  What replaces the spreadsheet
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-left">
                    <Table
                      className="text-primary mt-0.5 size-5 shrink-0"
                      weight="regular"
                      aria-hidden
                    />
                    <span className="rf-type-body">
                      <strong className="font-semibold text-foreground">Plans</strong>
                      {" — "}
                      publish pricing once; customers subscribe in-app.
                    </span>
                  </li>
                  <li className="flex gap-3 text-left">
                    <ChartLineUp
                      className="text-primary mt-0.5 size-5 shrink-0"
                      weight="regular"
                      aria-hidden
                    />
                    <span className="rf-type-body">
                      <strong className="font-semibold text-foreground">
                        Subscriptions
                      </strong>
                      {" — "}
                      every customer, status, and start date in one list.
                    </span>
                  </li>
                  <li className="flex gap-3 text-left">
                    <Receipt
                      className="text-primary mt-0.5 size-5 shrink-0"
                      weight="regular"
                      aria-hidden
                    />
                    <span className="rf-type-body">
                      <strong className="font-semibold text-foreground">Billing</strong>
                      {" — "}
                      run billing, issue invoices, record payments with audit-friendly
                      totals.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </MarketingContainer>
        </section>

        <section
          className="rf-land-section rf-env-wash-flat py-16 sm:py-24"
          aria-labelledby="value-props"
          id="how-it-works"
        >
          <div className="rf-land-section-inner px-6">
            <h2 id="value-props" className="rf-land-section-title rf-type-h2 mb-10">
              Why teams switch from spreadsheets
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <article className="rf-content-card p-6">
                <h3 className="rf-type-h4 mb-2">One source of truth</h3>
                <p className="rf-type-body text-muted-foreground">
                  Plans, active subscriptions, and open invoices live in the same
                  product—no copy-paste between tabs.
                </p>
              </article>
              <article className="rf-content-card p-6">
                <h3 className="rf-type-h4 mb-2">Role-based access</h3>
                <p className="rf-type-body text-muted-foreground">
                  Customers manage their plans; staff run billing and record
                  payments with server-enforced permissions.
                </p>
              </article>
              <article className="rf-content-card p-6">
                <h3 className="rf-type-h4 mb-2">Demo-ready today</h3>
                <p className="rf-type-body text-muted-foreground mb-4">
                  Subscribe without a payment gateway, run billing, and close the
                  loop on invoices.
                </p>
                <PrimaryButton href="/register" className="!min-h-[44px]">
                  Create a customer account
                </PrimaryButton>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
