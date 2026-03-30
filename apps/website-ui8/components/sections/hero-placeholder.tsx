import Link from "next/link";

import { routes } from "@/lib/routes";
import { Container } from "@/components/ui/container";

export function HeroPlaceholder() {
  return (
    <section
      id="top"
      className="scroll-mt-20 border-b border-[var(--color-border)] bg-[var(--color-surface)] py-16 sm:py-24"
    >
      <Container>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">UI8 · Start</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
          Zuverlässige medizinische Orientierung für den Einsatz
        </h1>
        <p className="mt-5 max-w-2xl text-base text-[var(--color-muted)] sm:text-lg">
          Platzhalter-Heldensektion. Hier später Value Proposition, Prüfungen und Kennzahlen — ohne
          produktive Datenanbindung.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={`${routes.home}#kontakt-hinweis`}
            className="inline-flex items-center justify-center rounded-md bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-on-primary)] hover:bg-[var(--color-primary-hover)]"
          >
            Mehr erfahren
          </Link>
          <Link
            href={routes.kontakt}
            className="inline-flex items-center justify-center rounded-md border border-[var(--color-border)] bg-transparent px-5 py-2.5 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)]"
          >
            Kontakt
          </Link>
        </div>
      </Container>
    </section>
  );
}
