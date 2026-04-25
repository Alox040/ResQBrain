import { Container } from "@/components/layout/container";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { contactPageContent } from "@/lib/site/contact-page";

export function KontaktCtaSection() {
  const { mitwirkenCta } = contactPageContent;

  return (
    <section
      id="kontakt-cta"
      className="bg-[var(--color-bg)] py-[var(--section-padding)]"
    >
      <Container>
        <div className="rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface-highlight)] px-8 py-12 md:px-12 md:py-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-[-0.03em] text-[var(--color-text-primary)] md:text-4xl">
                {mitwirkenCta.title}
              </h2>
              <p className="max-w-xl text-base leading-7 text-[var(--color-text-secondary)]">
                {mitwirkenCta.text}
              </p>
            </div>

            <ButtonPrimary href={mitwirkenCta.href}>{mitwirkenCta.buttonLabel}</ButtonPrimary>
          </div>
        </div>
      </Container>
    </section>
  );
}
