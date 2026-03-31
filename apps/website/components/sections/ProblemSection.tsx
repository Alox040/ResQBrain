import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";

type ProblemCard = {
  title: string;
  text: string;
};

type ProblemSectionProps = {
  title: string;
  intro: string;
  cards: [ProblemCard, ProblemCard, ProblemCard];
};

export function ProblemSection({ title, intro, cards }: ProblemSectionProps) {
  return (
    <Section>
      <Stack gap="var(--space-6)">
        <Stack gap="var(--space-3)">
          <h2 className="section-title">{title}</h2>
          <p className="body-text muted-text">{intro}</p>
        </Stack>

        <div className="problem-cards-grid">
          {cards.map((card) => (
            <article className="problem-card" key={card.title}>
              <Stack gap="var(--space-2)">
                <h3 className="problem-card-title">{card.title}</h3>
                <p className="small-text muted-text">{card.text}</p>
              </Stack>
            </article>
          ))}
        </div>
      </Stack>
    </Section>
  );
}
