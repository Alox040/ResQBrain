import { Container } from "@/components/layout/container";
import { contactPageContent } from "@/lib/site/contact-page";

export function KontaktHeroSection() {
  const { hero, description } = contactPageContent;

  return (
    <section
      id="kontakt-hero"
      className="bg-[var(--color-bg)] py-[var(--section-padding)] text-[var(--color-text-primary)]"
    >
      <Container>
        <div className="max-w-4xl space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
            {hero.subtitle}
          </p>

          <h1 className="text-5xl font-bold tracking-[-0.04em] md:text-7xl">
            {hero.title}
          </h1>

          <p className="max-w-2xl text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">
            {description}
          </p>
        </div>
      </Container>
    </section>
  );
}
