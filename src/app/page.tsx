import type { Metadata } from "next";

import { LandingHome } from "@/components/landing/landing-home";
import { getSiteUrl } from "@/lib/site/url";

export const metadata: Metadata = {
  title: "Subscription billing without spreadsheets",
  description:
    "Brightloop Software helps teams sell plans, manage subscriptions, and run invoice billing from one console.",
  alternates: { canonical: "/" },
  openGraph: {
    url: getSiteUrl(),
    title: "Brightloop Software — Subscription billing",
    description:
      "Sell plans, manage subscriptions, and run invoice billing from one console.",
  },
};

export default function Home() {
  return <LandingHome />;
}
