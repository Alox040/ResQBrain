import type { ReactNode } from "react";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-5xl px-6 py-12">{children}</main>
    </div>
  );
}
