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
  return href === routes.home ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
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
    <header className="sticky top-0 z-50 border-b border-zinc-900/60 bg-zinc-950/85 backdrop-blur">
      <PageContainer maxWidth="lg">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link
              href={routes.home}
              className="flex items-center gap-2 text-zinc-50 transition-colors hover:text-zinc-300"
            >
              <HeartPulse className="h-6 w-6 text-zinc-500" />
              <span className="text-lg font-semibold tracking-tight">ResQBrain</span>
            </Link>
          </div>

          <nav aria-label="Hauptnavigation" className="hidden md:block">
            <ul className="flex space-x-8">
              {navItems.map((item) => {
                const isActive = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={joinClasses(
                        "text-sm font-medium transition-colors",
                        isActive ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-100",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex md:hidden">
            <button
              type="button"
              className="p-2 text-zinc-400 hover:text-zinc-100"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
            >
              <span className="sr-only">Menü öffnen</span>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen ? (
          <nav aria-label="Mobile Navigation" className="border-t border-zinc-900/60 py-4 md:hidden">
            <ul className="grid gap-3">
              {navItems.map((item) => {
                const isActive = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={joinClasses(
                        "block text-sm font-medium transition-colors",
                        isActive ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-100",
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
        ) : null}
      </PageContainer>
    </header>
  );
}
