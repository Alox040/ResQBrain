import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";
import { mitwirkungPageContent } from "@/lib/site/mitwirkung";

export function PartnersSection() {
  const { additional } = mitwirkungPageContent;

  return (
    <section
      id="partners"
      className="bg-[var(--color-bg)] py-[var(--section-padding)]"
    >
      <Container>
        <div className="space-y-12">
          <SectionHeader title={additional.title} />

          <div className="grid grid-cols-1 gap-[var(--grid-gap)] md:grid-cols-3">
            {additional.items.map((text) => (
              <article
                key={text}
                className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--card-padding)]"
              >
                <p className="text-sm leading-7 text-[var(--color-text-secondary)]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
