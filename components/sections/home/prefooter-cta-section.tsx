import { Container } from "@/components/layout/container";
import { ButtonPrimary } from "@/components/ui/button-primary";

export function PrefooterCtaSection() {
  return (
    <section
      id="prefooter-cta"
      className="bg-[var(--color-bg)] py-[var(--section-padding)]"
    >
      <Container>
        <div className="rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface-highlight)] px-8 py-12 md:px-12 md:py-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                Contribution
              </p>
              <h2 className="text-3xl font-bold tracking-[-0.03em] text-[var(--color-text-primary)] md:text-4xl">
                Ready to contribute?
              </h2>
            </div>

            <ButtonPrimary href="#contribution">Get involved</ButtonPrimary>
          </div>
        </div>
      </Container>
    </section>
  );
}
