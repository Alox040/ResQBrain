"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Start", href: "/" },
  { label: "Mitwirkung", href: "/mitwirkung" },
  { label: "Links", href: "/links" },
  { label: "Kontakt", href: "/kontakt" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const baseLinkClass =
    "rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled
          ? "border-[var(--color-border)] bg-[rgba(13,17,23,0.95)] backdrop-blur"
          : "border-[rgba(30,45,61,0.6)] bg-[rgba(13,17,23,0.7)] backdrop-blur"
      }`}
    >
      <Container>
        <nav
          aria-label="Hauptnavigation"
          className="flex h-16 items-center justify-between"
        >
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]"
          >
            ResQBrain
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className={baseLinkClass}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link
              href="/mitwirken"
              className="inline-flex items-center rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-slate-950 transition-colors duration-200 hover:bg-[#33d6df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            >
              Mitwirken
            </Link>
          </div>

          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="inline-flex items-center justify-center rounded-md p-2 text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span className="sr-only">Menue oeffnen</span>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d={
                  mobileOpen
                    ? "M6 6L18 18M18 6L6 18"
                    : "M4 7H20M4 12H20M4 17H20"
                }
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </nav>

        {mobileOpen ? (
          <div id="mobile-menu" className="border-t border-[var(--color-border)] py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={baseLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/mitwirken"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-slate-950 transition-colors duration-200 hover:bg-[#33d6df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                onClick={() => setMobileOpen(false)}
              >
                Mitwirken
              </Link>
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
