import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

import { SiteShell } from "@/components/layout/site-shell";
import { siteTitle } from "@/lib/routes";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://resqbrain.example"),
  title: {
    default: siteTitle,
    template: `%s · ${siteTitle}`,
  },
  description: "ResQBrain UI8 — statisches Website-Gerüst (Platzhalter).",
  openGraph: {
    title: siteTitle,
    description: "ResQBrain UI8 — statisches Website-Gerüst (Platzhalter).",
    type: "website",
    locale: "de_DE",
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
