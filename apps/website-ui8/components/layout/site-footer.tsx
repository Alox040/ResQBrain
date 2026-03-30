import Link from "next/link";

import { footerNav, siteTitle } from "@/lib/routes";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-muted)]">
          © {year} {siteTitle}
          <span className="mt-1 block text-xs">Statisches Gerüst (UI8) — Platzhalter.</span>
        </p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Fußnavigation">
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--color-muted)] underline-offset-4 hover:text-[var(--color-foreground)] hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
