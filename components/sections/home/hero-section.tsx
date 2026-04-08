import { Container } from "@/components/layout/container";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { ButtonSecondary } from "@/components/ui/button-secondary";
import { content } from "@/lib/site/content";

export function HeroSection() {
  const { hero, status } = content;

  return (
    <section
      id="hero"
      className="bg-[var(--color-bg)] py-[var(--section-padding)] text-[var(--color-text-primary)]"
    >
      <Container>
        <div className="max-w-4xl space-y-8">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              {hero.badge}
            </p>
            <h1 className="text-5xl font-bold tracking-[-0.04em] md:text-7xl">
              {hero.headline}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">
              {hero.subline}
            </p>
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                {status.title}
              </p>
              <p className="text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">
                {status.intro}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <ButtonPrimary href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</ButtonPrimary>
            <ButtonSecondary
              href={hero.ctaSecondary.href}
              external={hero.ctaSecondary.external}
            >
              {hero.ctaSecondary.label}
            </ButtonSecondary>
          </div>

          <div className="flex flex-wrap gap-3">
            {hero.hints.map((hint) => (
              <span
                key={hint}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]"
              >
                {hint}
              </span>
            ))}
            {status.cards.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-highlight)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
