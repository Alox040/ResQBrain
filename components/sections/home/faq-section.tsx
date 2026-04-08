import { Container } from "@/components/layout/container";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { SectionHeader } from "@/components/ui/section-header";

const faqItems = [
  {
    question: "FAQ Item 01",
    answer:
      "Placeholder answer for the first FAQ item. Final copy can be mapped from the source design later.",
  },
  {
    question: "FAQ Item 02",
    answer:
      "Placeholder answer for the second FAQ item. Final copy can be mapped from the source design later.",
  },
  {
    question: "FAQ Item 03",
    answer:
      "Placeholder answer for the third FAQ item. Final copy can be mapped from the source design later.",
  },
  {
    question: "FAQ Item 04",
    answer:
      "Placeholder answer for the fourth FAQ item. Final copy can be mapped from the source design later.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="bg-[var(--color-bg)] py-[var(--section-padding)]">
      <Container>
        <div className="space-y-12">
          <SectionHeader
            eyebrow="FAQ"
            title="Section Title"
            subtitle="Section subtitle placeholder for the frequently asked questions block."
          />

          <FaqAccordion items={faqItems} />
        </div>
      </Container>
    </section>
  );
}
