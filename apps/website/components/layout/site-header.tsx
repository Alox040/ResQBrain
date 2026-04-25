"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";
import { useState } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { routes } from "@/lib/routes";
import { mainNavigation } from "@/lib/site";

export interface NavItem {
  label: string;
  href: string;
}

function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function isActivePath(pathname: string, href: string) {
  return href === routes.home
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function HeartPulse(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M12 21s-6.716-4.352-9.193-8.2C1.395 10.611 2.07 7.5 4.5 6.04c2.21-1.326 4.64-.465 5.9 1.09C11.66 5.575 14.09 4.714 16.3 6.04c2.43 1.46 3.105 4.57 1.693 6.76C18.1 13.03 17.192 14.267 16 15.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
      <path
        d="M8 12h2.5l1.4-2.5 2.2 5 1.4-2.5H18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function Menu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function X(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems: readonly NavItem[] = mainNavigation;

  return (
    <>
      {isMobileMenuOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
        <PageContainer maxWidth="lg">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Branding */}
            <div className="shrink-0">
              <Link
                href={routes.home}
                className="group flex items-center gap-2.5 rounded-full px-1 py-1"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-red-400 transition-colors group-hover:border-red-900/60 group-hover:bg-red-950/30 group-hover:text-red-300">
                  <HeartPulse className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[15px] font-semibold tracking-tight text-zinc-100 transition-colors group-hover:text-zinc-50">
                  ResQBrain
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav aria-label="Hauptnavigation" className="hidden md:block">
              <ul className="flex items-center gap-1 rounded-full border border-zinc-800/80 bg-zinc-900/60 px-1.5 py-1.5">
                {navItems.map((item) => {
                  const isActive = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={joinClasses(
                          "inline-flex h-8 items-center rounded-full px-3.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-zinc-800 text-zinc-50 shadow-sm"
                            : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden">
              <button
                type="button"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              >
                <span className="sr-only">
                  {isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
                </span>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Panel */}
          {isMobileMenuOpen && (
            <nav
              id="mobile-navigation"
              aria-label="Mobile Navigation"
              className="border-t border-zinc-800/60 pb-4 pt-3 md:hidden"
            >
              <ul className="grid gap-1">
                {navItems.map((item) => {
                  const isActive = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={joinClasses(
                          "flex min-h-12 items-center rounded-xl px-4 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-zinc-800 text-zinc-50"
                            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </PageContainer>
      </header>
    </>
  );
}
