import { AudienceCard } from "@/components/cards/audience-card";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";

const audienceCards = [
  {
    title: "Audience Card 01",
    description:
      "Placeholder copy for the first audience group. Final content can be mapped from the Figma source later.",
  },
  {
    title: "Audience Card 02",
    description:
      "Placeholder copy for the second audience group. Final content can be mapped from the Figma source later.",
  },
  {
    title: "Audience Card 03",
    description:
      "Placeholder copy for the third audience group. Final content can be mapped from the Figma source later.",
  },
];

export function AudienceSection() {
  return (
    <section id="audience" className="bg-[var(--color-bg)] py-[var(--section-padding)]">
      <Container>
        <div className="space-y-12">
          <SectionHeader
            eyebrow="Audience"
            title="Section Title"
            subtitle="Section subtitle placeholder for the audience overview."
          />

          <div className="grid grid-cols-1 gap-[var(--grid-gap)] md:grid-cols-3">
            {audienceCards.map((card) => (
              <AudienceCard
                key={card.title}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
