import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { Header } from "../components/layout/Header";
import { siteConfig } from "../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "de_DE",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="site-shell">
        <Header />
        {children}
      </body>
    </html>
  );
}
