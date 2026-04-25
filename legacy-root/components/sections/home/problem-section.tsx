import { ProblemCard } from "@/components/cards/problem-card";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/ui/section-header";
import { content } from "@/lib/site/content";

export function ProblemSection() {
  const { problem } = content;

  return (
    <section id="problem" className="bg-[var(--color-bg)] py-[var(--section-padding)]">
      <Container>
        <div className="space-y-12">
          <SectionHeader title={problem.title} subtitle={problem.intro} />

          <div className="grid grid-cols-1 gap-[var(--grid-gap)] md:grid-cols-3">
            {problem.cards.map((card) => (
              <ProblemCard
                key={card.headline}
                title={card.headline}
                description={card.text}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
