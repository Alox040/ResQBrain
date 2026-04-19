"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavItem } from "@/components/layout/site-header";

export interface MobileNavProps {
  items: readonly NavItem[];
}

function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function MobileNav({ items }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <details className="rounded-2xl border border-zinc-800/70 bg-zinc-900/70 md:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-zinc-100">
        <span>Menue</span>
        <span aria-hidden="true" className="text-zinc-500">
          +
        </span>
      </summary>
      <nav aria-label="Mobile Navigation" className="border-t border-zinc-800/70 px-3 py-3">
        <ul className="grid gap-2">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={joinClasses(
                    "flex min-h-11 items-center rounded-xl px-3 text-sm transition-colors",
                    isActive
                      ? "bg-zinc-800 text-zinc-50"
                      : "text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </details>
  );
}
