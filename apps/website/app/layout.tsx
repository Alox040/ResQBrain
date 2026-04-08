import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Instrument_Sans } from "next/font/google";

import "./globals.css";

import { SiteShell } from "@/components/layout/site-shell";
import { siteContent } from "@/lib/site/site-content";

const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteContent.title,
    template: `%s | ${siteContent.name}`,
  },
  description: siteContent.description,
  applicationName: siteContent.name,
  openGraph: {
    title: siteContent.title,
    description: siteContent.description,
    siteName: siteContent.name,
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteContent.title,
    description: siteContent.description,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className={instrumentSans.variable} lang="de">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
