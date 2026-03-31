"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/ui/container";
import { mainNav, routes, siteTitle } from "@/lib/routes";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="flex h-5 w-6 flex-col justify-center gap-1.5" aria-hidden>
      <span
        className={`h-0.5 rounded-full bg-current transition-transform duration-200 ${open ? "translate-y-2 rotate-45" : ""}`}
      />
      <span
        className={`h-0.5 rounded-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
      />
      <span
        className={`h-0.5 rounded-full bg-current transition-transform duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`}
      />
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur"
      style={{
        background: "color-mix(in srgb, white 85%, transparent)",
        borderBottom: "1px solid color-mix(in srgb, black 8%, transparent)",
        boxShadow: scrolled ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
        transition: "box-shadow 0.2s ease",
      }}
    >
      <Container className="flex min-h-14 items-center justify-between gap-3 py-2 sm:min-h-16 sm:gap-4 sm:py-0">
        <Link
          href={routes.home}
          className="min-h-10 min-w-0 shrink text-base font-semibold leading-tight tracking-tight text-[var(--color-foreground)] sm:text-lg"
        >
          {siteTitle}
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Hauptnavigation">
          {mainNav.map((item) => {
            const active = item.href.split("#")[0] === pathname;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-[var(--primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--primary)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)]/85 md:hidden"
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
        className={`border-t border-[var(--color-border)]/80 bg-[var(--color-surface)] md:hidden ${
          open ? "block shadow-[0_6px_16px_rgba(23,28,33,0.06)]" : "hidden"
        }`}
      >
        <Container className="max-h-[min(70vh,22rem)] overflow-y-auto overscroll-contain py-2">
          <div className="flex flex-col gap-0.5 pb-2">
            {mainNav.map((item) => {
              const active = item.href.split("#")[0] === pathname;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-[var(--radius-control)] px-3 py-3.5 text-[0.9375rem] font-medium transition-colors active:bg-[var(--color-surface-muted)] ${
                    active
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--primary)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </Container>
      </div>
    </header>
  );
}
