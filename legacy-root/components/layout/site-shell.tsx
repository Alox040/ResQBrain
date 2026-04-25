import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Container } from "@/components/layout/container";

type SiteShellProps = {
  breadcrumbItems: Array<{
    label: string;
    href?: string;
  }>;
  title: string;
  intro?: string;
  children: ReactNode;
};

export function SiteShell({
  breadcrumbItems,
  title,
  intro,
  children,
}: SiteShellProps) {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] py-[var(--section-padding)] text-[var(--color-text-primary)]">
      <Container>
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="space-y-6">
            <Breadcrumb items={breadcrumbItems} />
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-[-0.04em] md:text-6xl">
                {title}
              </h1>
              {intro ? (
                <p className="max-w-3xl text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">
                  {intro}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-8">
            {children}
          </div>
        </div>
      </Container>
    </main>
  );
}
