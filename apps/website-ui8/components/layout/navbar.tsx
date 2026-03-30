"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { mainNav, routes, siteTitle } from "@/lib/routes";
import { Container } from "@/components/ui/container";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="flex h-5 w-6 flex-col justify-center gap-1.5" aria-hidden>
      <span
        className={`h-0.5 rounded-full bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
      />
      <span className={`h-0.5 rounded-full bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
      <span
        className={`h-0.5 rounded-full bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
      />
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-sm">
      <Container className="flex h-14 items-center justify-between gap-4 sm:h-16">
        <Link
          href={routes.home}
          className="text-base font-semibold tracking-tight text-[var(--color-foreground)] sm:text-lg"
        >
          {siteTitle}
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Hauptnavigation">
          {mainNav.map((item) => {
            const active = item.href.split("#")[0] === pathname;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--color-surface-muted)] text-[var(--color-foreground)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="flex items-center justify-center rounded-md p-2 text-[var(--color-foreground)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setOpen((v) => !v)}
        >
          <MenuIcon open={open} />
        </button>
      </Container>

      <div
        id="mobile-nav"
        className={`border-t border-[var(--color-border)] bg-[var(--color-surface)] md:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <Container className="flex flex-col gap-1 py-3">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-3 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)]"
            >
              {item.label}
            </Link>
          ))}
        </Container>
      </div>
    </header>
  );
}
