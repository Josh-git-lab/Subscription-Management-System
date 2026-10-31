import Link from "next/link";
import { LayoutGrid, Receipt, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-border bg-background border-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:gap-12">
          <div className="flex max-w-xl flex-1 flex-col gap-6">
            <p className="text-primary text-sm font-semibold tracking-wide uppercase">
              Brightloop Software
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Stop running subscriptions in spreadsheets
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Brightloop unifies plan catalog, customer subscriptions, and
              invoice billing in one SaaS console—built for teams who outgrew
              manual renewals and disconnected ledgers.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/plans">
                <Button type="button" size="lg">
                  Browse plans
                </Button>
              </Link>
              <Link href="/login">
                <Button type="button" variant="outline" size="lg">
                  Log in
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-card border-border flex flex-1 flex-col gap-4 rounded-2xl border p-6 shadow-sm lg:max-w-md">
            <p className="text-muted-foreground text-sm font-medium">
              What replaces the spreadsheet
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <LayoutGrid className="text-primary mt-0.5 size-5 shrink-0" aria-hidden />
                <span>
                  <strong className="font-medium">Plans</strong> — publish
                  pricing once; customers subscribe in-app.
                </span>
              </li>
              <li className="flex gap-3">
                <Users className="text-primary mt-0.5 size-5 shrink-0" aria-hidden />
                <span>
                  <strong className="font-medium">Subscriptions</strong> —
                  every customer, status, and start date in one list.
                </span>
              </li>
              <li className="flex gap-3">
                <Receipt className="text-primary mt-0.5 size-5 shrink-0" aria-hidden />
                <span>
                  <strong className="font-medium">Billing</strong> — run
                  billing, issue invoices, record payments with audit-friendly
                  totals.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6"
        aria-labelledby="value-props"
      >
        <h2 id="value-props" className="mb-8 text-2xl font-semibold tracking-tight">
          Why teams switch from spreadsheets
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">One source of truth</CardTitle>
              <CardDescription>
                Plans, active subscriptions, and open invoices live in the same
                product—no copy-paste between tabs.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Role-based access</CardTitle>
              <CardDescription>
                Customers manage their plans; staff run billing and record
                payments with server-enforced permissions.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Demo-ready today</CardTitle>
              <CardDescription>
                Subscribe without a payment gateway, run billing, and close the
                loop on invoices—then iterate on the UI you see here.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link
                href="/register"
                className="text-primary text-sm font-medium underline-offset-4 hover:underline"
              >
                Create a customer account →
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
