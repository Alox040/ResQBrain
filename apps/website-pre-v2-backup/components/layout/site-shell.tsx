import type { ReactNode } from "react";

import { Navbar } from "./navbar";
import { SiteFooter } from "./site-footer";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="site-shell flex min-h-screen flex-col">
      <Navbar />
      <div className="site-main flex flex-1 flex-col">{children}</div>
      <SiteFooter />
    </div>
  );
}
