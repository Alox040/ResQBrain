import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Instrument_Sans } from "next/font/google";

import "./globals.css";

import { SiteShell } from "@/components/layout/site-shell";
import { siteContent } from "@/lib/site/site-content";

const instrumentSans = Instrument_Sans({
  // Subsets from Google Fonts (next/font injects matching @font-face unicode-range):
  // - latin: Basic Latin + Latin-1 incl. ä ö ü ß (U+00DF, U+00E4, U+00F6, U+00FC, …)
  // - latin-ext: Latin Extended-A/B blocks for Central/European coverage
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: siteContent.title,
  description: siteContent.description,
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
};

export default function RootLayout({ children }: PropsWithChildren) {
  // Document character encoding: UTF-8. Next.js emits exactly one
  // <meta charSet="utf-8" /> in <head>; do not add another here (duplicate tags).
  return (
    <html className={instrumentSans.variable} lang="de">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
