import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteShell } from "@/components/layout/site-shell";
import { siteDescription, siteTitle } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
