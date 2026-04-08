import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ResQBrain Website Lab",
    template: "%s | ResQBrain Website Lab",
  },
  description:
    "Isolierte Lab-App fuer die Figma-nahe Website-Studie von ResQBrain.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="de">
      <body>
        <div className="site-frame">
          <SiteHeader />
          <main className="site-main">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
