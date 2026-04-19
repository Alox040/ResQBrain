import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { siteContent } from "@/lib/site/site-content";

const footerLinks = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Kontakt", href: "/kontakt" },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <PageContainer maxWidth="lg" className="site-footer-layout">
        <div className="site-footer-inner">
          <div className="grid gap-3">
            <Link
              href="/"
              className="text-base font-semibold tracking-[-0.03em] text-zinc-50"
            >
              {siteContent.name}
            </Link>
            <p className="max-w-xl text-sm leading-6 text-zinc-500">
              MVP fuer strukturierte Wissensarbeit, nachvollziehbare Inhalte und
              praxisnahe Unterstuetzung im Rettungsdienst.
            </p>
          </div>

          <nav aria-label="Footer Navigation">
            <ul className="flex flex-wrap gap-2">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-10 items-center rounded-full px-4 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-50"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="site-disclaimer" aria-label="Rechtlicher Hinweis">
          <p className="site-disclaimer-kicker">Hinweis</p>
          <p className="site-disclaimer-text">{siteContent.disclaimer.long}</p>
        </div>
      </PageContainer>
    </footer>
  );
}
