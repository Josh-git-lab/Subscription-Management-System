import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteUrl } from "@/lib/site/url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Brightloop Software — Subscription plans",
    template: "%s | Brightloop Software",
  },
  description:
    "Browse subscription plans, manage your account, and subscribe with Brightloop Software.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Brightloop Software",
    title: "Brightloop Software — Subscription plans",
    description:
      "Browse subscription plans, manage your account, and subscribe with Brightloop Software.",
  },
};

function SiteHeaderFallback() {
  return (
    <header className="border-border bg-background/95 sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6">
        <span className="font-semibold tracking-tight">Brightloop</span>
      </div>
    </header>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-muted/30 flex min-h-full flex-col">
        <Suspense fallback={<SiteHeaderFallback />}>
          <SiteHeader />
        </Suspense>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
