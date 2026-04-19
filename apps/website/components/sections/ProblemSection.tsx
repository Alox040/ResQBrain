import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";

type ProblemCard = {
  headline: string;
  text: string;
};

export type ProblemSectionProps = {
  title: string;
  cards: readonly ProblemCard[];
  conclusion?: string;
};

export function ProblemSection({ title, cards, conclusion }: ProblemSectionProps) {
  return (
    <SectionFrame compact>
      <Container>
        <Stack gap="md" className="problem-section">
          <SectionHeading title={title} />
          <div className="problem-scenarios">
            {cards.map((card) => (
              <ContentCard key={card.headline} className="problem-scenario">
                <Stack gap="sm">
                  <h2 className="card-heading">{card.headline}</h2>
                  <p className="body-text muted-text">{card.text}</p>
                </Stack>
              </ContentCard>
            ))}
          </div>
          {conclusion ? <p className="body-text muted-text section-intro problem-conclusion">{conclusion}</p> : null}
        </Stack>
      </Container>
    </SectionFrame>
  );
}
