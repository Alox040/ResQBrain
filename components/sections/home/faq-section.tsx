import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { SectionHeader } from "@/components/ui/section-header";
import { content } from "@/lib/site/content";

export function FaqSection() {
  const { faq } = content;

  return (
    <section id="faq" className="bg-[var(--color-bg)] py-[var(--section-padding)]">
      <Container>
        <div className="space-y-12">
          <SectionHeader title={faq.title} />

          <FaqAccordion items={faq.items} />
        </div>
      </Container>
    </section>
  );
}
