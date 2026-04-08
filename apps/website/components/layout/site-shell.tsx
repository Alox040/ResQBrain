"use client";

import type { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function SiteShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const hideSiteHeader = pathname === "/links";

  return (
    <>
      {hideSiteHeader ? null : <SiteHeader />}
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
