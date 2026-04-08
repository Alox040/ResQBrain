import { Container } from "@/components/layout/container";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { ButtonSecondary } from "@/components/ui/button-secondary";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="bg-[var(--color-bg)] py-[var(--section-padding)] text-[var(--color-text-primary)]"
    >
      <Container>
        <div className="max-w-4xl space-y-8">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Eyebrow
            </p>
            <h1 className="text-5xl font-bold tracking-[-0.04em] md:text-7xl">
              H1
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">
              Subtext
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <ButtonPrimary href="/concept">Read the Concept</ButtonPrimary>
            <ButtonSecondary href="/status">View Current Status</ButtonSecondary>
          </div>
        </div>
      </Container>
    </section>
  );
}
