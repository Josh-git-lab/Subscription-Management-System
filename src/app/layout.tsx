import type { Metadata } from "next";
import { IBM_Plex_Mono, Outfit } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteUrl } from "@/lib/site/url";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
    <>
      <header className="m-header">
        <div className="m-header__fade" aria-hidden />
        <div className="m-container m-header__bar">
          <span className="m-wordmark">brightloop</span>
        </div>
      </header>
      <div className="m-header-spacer" aria-hidden />
    </>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="rf-app-shell flex min-h-full flex-col">
        <Suspense fallback={<SiteHeaderFallback />}>
          <SiteHeader />
        </Suspense>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
