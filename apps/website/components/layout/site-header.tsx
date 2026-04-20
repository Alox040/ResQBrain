"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { routes } from "@/lib/routes";
import { mainNavigation } from "@/lib/site";
import { siteContent } from "@/lib/site/site-content";

const MobileNav = dynamic(
  () => import("@/components/layout/mobile-nav").then((module) => module.MobileNav),
  {
    loading: () => null,
  },
);

export interface NavItem {
  label: string;
  href: string;
}

function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function SiteHeader() {
  const pathname = usePathname();
  const navItems: readonly NavItem[] = mainNavigation;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900/60 bg-zinc-950/85 backdrop-blur">
      <PageContainer maxWidth="lg" className="py-4">
        <div className="hidden items-center justify-between gap-6 md:flex">
          <Link
            href={routes.home}
            className="text-base font-semibold tracking-[-0.03em] text-zinc-50"
          >
            {siteContent.name}
          </Link>

          <nav aria-label="Hauptnavigation">
            <ul className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={joinClasses(
                        "inline-flex min-h-10 items-center rounded-full px-4 text-sm transition-colors",
                        isActive
                          ? "bg-zinc-900 text-zinc-50"
                          : "text-zinc-400 hover:bg-zinc-900/70 hover:text-zinc-50",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Button href={routes.mitwirken} size="sm" variant="primary">
            Mitwirken
          </Button>
        </div>

        <div className="grid gap-4 md:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={routes.home}
              className="text-base font-semibold tracking-[-0.03em] text-zinc-50"
            >
              {siteContent.name}
            </Link>
            <Button href={routes.mitwirken} size="sm" variant="primary">
              Mitwirken
            </Button>
          </div>
          <MobileNav items={navItems} />
        </div>
      </PageContainer>
    </header>
  );
}
