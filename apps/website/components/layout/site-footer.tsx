import Link from "next/link";

import { Container } from "@/components/ui/container";
import { footerNav, siteTitle } from "@/lib/routes";
import { discordUrl, repositoryUrl, tiktokUrl } from "@/lib/site-content";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer mt-auto border-t border-[var(--color-border)]/85 bg-[var(--color-surface)]">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between sm:gap-10 sm:py-12">
        <div className="min-w-0 shrink">
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            © {year} {siteTitle}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
            Frühphase des Projekts — statische Website ohne Live-Produktdaten.
          </p>
          <p className="mt-3 text-sm">
            <a
              href={repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-muted)] underline-offset-4 transition-colors hover:text-[var(--color-foreground)] hover:underline"
            >
              Projekt auf GitHub
            </a>
          </p>
          <p className="mt-2 text-sm">
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-muted)] underline-offset-4 transition-colors hover:text-[var(--color-foreground)] hover:underline"
            >
              Discord
            </a>
          </p>
          <p className="mt-2 text-sm">
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-muted)] underline-offset-4 transition-colors hover:text-[var(--color-foreground)] hover:underline"
            >
              TikTok
            </a>
          </p>
        </div>
        <nav
          className="flex flex-col gap-1 sm:min-w-[12rem] sm:items-end sm:gap-2"
          aria-label="Fußnavigation"
        >
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-10 items-center text-sm text-[var(--color-muted)] underline-offset-4 transition-colors hover:text-[var(--color-foreground)] hover:underline sm:justify-end sm:py-0.5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
