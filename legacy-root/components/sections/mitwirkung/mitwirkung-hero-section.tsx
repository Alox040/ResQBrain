import { Container } from "@/components/layout/container";
import { mitwirkungPageContent } from "@/lib/site/mitwirkung";

export function MitwirkungHeroSection() {
  const { hero, why } = mitwirkungPageContent;

  return (
    <section
      id="mitwirkung-hero"
      className="bg-[var(--color-bg)] py-[var(--section-padding)] text-[var(--color-text-primary)]"
    >
      <Container>
        <div className="max-w-4xl space-y-10">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              {hero.subtitle}
            </p>

            <h1 className="text-5xl font-bold tracking-[-0.04em] md:text-7xl">
              {hero.title}
            </h1>

            <p className="max-w-2xl text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">
              {hero.text}
            </p>
          </div>

          <div className="max-w-2xl space-y-3 border-t border-[var(--color-border)] pt-10">
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-text-primary)]">
              {why.title}
            </h2>
            <p className="text-base leading-7 text-[var(--color-text-secondary)]">{why.text}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
