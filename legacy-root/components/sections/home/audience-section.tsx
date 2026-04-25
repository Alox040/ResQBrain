import { AudienceCard } from "@/components/cards/audience-card";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";
import { content } from "@/lib/site/content";

export function AudienceSection() {
  const { audience } = content;

  return (
    <section id="audience" className="bg-[var(--color-bg)] py-[var(--section-padding)]">
      <Container>
        <div className="space-y-12">
          <SectionHeader title={audience.title} subtitle={audience.intro} />

          <div className="grid grid-cols-1 gap-[var(--grid-gap)] md:grid-cols-3">
            {audience.cards.map((card) => (
              <AudienceCard
                key={card.title}
                title={card.title}
                description={card.text}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
