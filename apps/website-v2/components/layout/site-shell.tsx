import type { ReactNode } from "react";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="site-shell min-h-screen bg-[var(--color-background)]">
      <main className="site-main py-16 sm:py-20">{children}</main>
    </div>
  );
}
