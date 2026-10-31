import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

import { auth } from "@/auth";
import { PageShell } from "@/components/page-shell";
import { SubscribeButton } from "@/components/subscribe-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { formatInrFromMinor } from "@/lib/money/format-inr";
import { featuresForPlanSlug } from "@/lib/plans/feature-bullets";
import { getSiteUrl } from "@/lib/site/url";

export const metadata: Metadata = {
  title: "Subscription plans",
  description:
    "Compare Brightloop Basic, Pro, and Team plans. Prices in INR; subscribe instantly in the demo.",
  alternates: { canonical: "/plans" },
  openGraph: {
    url: `${getSiteUrl()}/plans`,
    title: "Subscription plans | Brightloop Software",
  },
};

export default async function PlansPage() {
  const session = await auth();
  const plans = await prisma.plan.findMany({
    where: { active: true },
    orderBy: { priceMinor: "asc" },
  });

  return (
    <PageShell
      title="Subscription plans"
      description="Choose a monthly plan. Customers subscribe instantly in this demo—no payment popup."
      width="xl"
    >
      {plans.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No plans available</CardTitle>
            <CardDescription>
              Plans will appear here once an administrator seeds or publishes
              them.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const featured = plan.slug === "pro";
            const features = featuresForPlanSlug(plan.slug);
            return (
              <Card
                key={plan.id}
                className={
                  featured
                    ? "border-primary ring-primary/20 relative flex flex-col ring-2"
                    : "flex flex-col"
                }
              >
                {featured ? (
                  <p className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-medium">
                    Most popular
                  </p>
                ) : null}
                <CardHeader className="pt-8">
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <p className="text-3xl font-semibold tracking-tight">
                    {formatInrFromMinor(plan.priceMinor, plan.currency)}
                    <span className="text-muted-foreground text-base font-normal">
                      /{plan.interval.toLowerCase()}
                    </span>
                  </p>
                  <ul className="space-y-2 text-sm">
                    {features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <Check
                          className="text-primary mt-0.5 size-4 shrink-0"
                          aria-hidden
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto flex flex-col items-stretch gap-2 border-t pt-6">
                  {session?.user?.role === "CUSTOMER" ? (
                    <SubscribeButton planId={plan.id} />
                  ) : session ? (
                    <p className="text-muted-foreground text-center text-sm">
                      Staff and admin accounts cannot subscribe in this demo.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-muted-foreground text-center text-sm">
                        Log in as a customer to subscribe.
                      </p>
                      <Link href="/login" className="w-full">
                        <Button type="button" variant="outline" className="w-full">
                          Log in
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
