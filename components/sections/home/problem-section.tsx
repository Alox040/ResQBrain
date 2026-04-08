import { ProblemCard } from "@/components/cards/problem-card";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";

const problemCards = [
  {
    title: "Problem Card 01",
    description:
      "Placeholder copy for the first problem card. Final content can be mapped from Figma in the next step.",
  },
  {
    title: "Problem Card 02",
    description:
      "Placeholder copy for the second problem card. Final content can be mapped from Figma in the next step.",
  },
  {
    title: "Problem Card 03",
    description:
      "Placeholder copy for the third problem card. Final content can be mapped from Figma in the next step.",
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="bg-[var(--color-bg)] py-[var(--section-padding)]">
      <Container>
        <div className="space-y-12">
          <SectionHeader
            eyebrow="Problem"
            title="Section Title"
            subtitle="Section subtitle placeholder for the problem overview."
          />

          <div className="grid grid-cols-1 gap-[var(--grid-gap)] md:grid-cols-3">
            {problemCards.map((card) => (
              <ProblemCard
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
