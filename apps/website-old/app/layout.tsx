import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import Link from "next/link";

import "./globals.css";

import { Header } from "../components/layout/Header";
import { getLegalViewModel, getPublicProfileViewModel } from "../lib/site-selectors";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const publicProfile = getPublicProfileViewModel();
const legal = getLegalViewModel();

export const metadata: Metadata = {
  metadataBase: new URL(publicProfile.url),
  title: publicProfile.title,
  description: publicProfile.description,
  openGraph: {
    title: publicProfile.title,
    description: publicProfile.description,
    url: publicProfile.url,
    siteName: publicProfile.name,
    type: "website",
    locale: "de_DE",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="site-shell">
        <Header />
        <div className="site-main">{children}</div>
        <footer className="site-legal-footer">
          {legal.links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </footer>
      </body>
    </html>
  );
}
