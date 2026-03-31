import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div>
      <SiteHeader />
      <main>
        <Container>{children}</Container>
      </main>
      <SiteFooter />
    </div>
  );
}
