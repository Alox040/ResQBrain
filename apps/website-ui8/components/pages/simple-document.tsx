import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";

export type SimpleDocumentProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function SimpleDocument({ title, description, children }: SimpleDocumentProps) {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-band)] py-12 sm:py-16">
      <Container className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-3xl">
          {title}
        </h1>
        {description ? <p className="mt-3 text-[var(--color-muted)]">{description}</p> : null}
        <div className="prose-rhythm mt-8 text-[var(--color-muted)]">{children}</div>
      </Container>
    </div>
  );
}
