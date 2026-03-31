import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import "./globals.css";

import { SiteShell } from "@/components/layout/site-shell";
import { siteContent } from "@/lib/site/site-content";

export const metadata: Metadata = {
  title: siteContent.title,
  description: siteContent.description,
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="de">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
