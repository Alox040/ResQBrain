import Link from "next/link";

import { PrimaryLinkCard } from "@/components/cards/primary-link-card";
import { Container } from "@/components/layout/container";
import { linksPageContent } from "@/lib/site/links-page";

export default function LinksPage() {
  const { hero, description, primaryLinkCards, secondaryLinks } = linksPageContent;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] py-[var(--section-padding)] text-[var(--color-text-primary)]">
      <Container>
        <div className="mx-auto max-w-3xl space-y-12">
          <header className="space-y-4 text-center md:text-left">
            <div className="space-y-2">
              <Link
                href="/"
                className="inline-flex text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent)]"
              >
                ResQBrain
              </Link>
              <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                Die Wissensplattform für den Rettungsdienst.
              </p>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-[-0.03em] md:text-5xl">{hero.title}</h1>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                {hero.subtitle}
              </p>
              <p className="max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
                {description}
              </p>
            </div>
          </header>

          <section aria-labelledby="links-primary-heading" className="space-y-6">
            <h2 id="links-primary-heading" className="sr-only">
              Hauptzugänge
            </h2>
            <div className="grid grid-cols-1 gap-[var(--grid-gap)] md:grid-cols-3">
              {primaryLinkCards.map((card) => (
                <PrimaryLinkCard
                  key={card.title}
                  title={card.title}
                  description={card.description}
                  href={card.href}
                  actionLabel={card.actionLabel}
                  external={card.external}
                  date={"date" in card ? card.date : undefined}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="links-secondary-heading" className="space-y-4">
            <h2 id="links-secondary-heading" className="sr-only">
              GitHub, Projektbeschreibung, Kontakt
            </h2>
            <div className="flex flex-col gap-3">
              {secondaryLinks.map((item) =>
                item.external ? (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:w-auto md:self-start"
                  >
                    {item.title}
                  </a>
                ) : (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:w-auto md:self-start"
                  >
                    {item.title}
                  </Link>
                ),
              )}
            </div>
          </section>

          <p className="text-center text-xs text-[var(--color-text-secondary)] md:text-left">
            © ResQBrain
          </p>
        </div>
      </Container>
    </main>
  );
}
