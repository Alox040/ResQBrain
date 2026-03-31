import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

import { SiteShell } from "@/components/layout/site-shell";
import { sitePublicUrl } from "@/lib/site-content";
import { siteTitle } from "@/lib/routes";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(sitePublicUrl),
  title: {
    default: siteTitle,
    template: `%s · ${siteTitle}`,
  },
  description:
    "ResQBrain: Plattform-Idee für versionierte medizinische und operative Inhalte im Rettungsdienst — in früher Phase, mit Einladung zu Feedback und Umfrage.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: siteTitle,
    description:
      "ResQBrain: Plattform-Idee für organisationssicheren Umgang mit einsatzrelevanten Inhalten — Projekt in früher Phase.",
    type: "website",
    locale: "de_DE",
    url: sitePublicUrl,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="min-h-screen antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
