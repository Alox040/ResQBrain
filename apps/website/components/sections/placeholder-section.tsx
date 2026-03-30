import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";

export type PlaceholderSectionProps = {
  id?: string;
  title: string;
  eyebrow?: string;
  children?: ReactNode;
};

export function PlaceholderSection({ id, title, eyebrow, children }: PlaceholderSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-20 border-b border-[var(--color-border)] bg-[var(--color-band)] py-14 sm:py-20"
    >
      <Container>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{eyebrow}</p>
        ) : null}
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-2xl">
          {title}
        </h2>
        <div className="mt-5 max-w-3xl text-[var(--color-muted)]">
          {children ?? <p>Platzhalter — Inhalt folgt in einer späteren Ausbaustufe.</p>}
        </div>
      </Container>
    </section>
  );
}
