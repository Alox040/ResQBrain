import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteShell } from "@/components/layout/site-shell";
import { siteMetadata } from "@/lib/site";

import "../styles/globals.css";

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang={siteMetadata.locale}>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
