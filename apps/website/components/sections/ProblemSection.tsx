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
      <Stack gap="var(--space-7)">
        <Stack gap="var(--space-4)" className="section-lead">
          <h2 className="section-title">{title}</h2>
          <p className="body-text muted-text section-intro">{intro}</p>
        </Stack>

        <div className="cards-grid">
          {cards.map((card) => (
            <article className="card card--interactive" key={card.title}>
              <Stack gap="var(--space-3)">
                <h3 className="card-heading">{card.title}</h3>
                <p className="small-text muted-text">{card.text}</p>
              </Stack>
            </article>
          ))}
        </div>
      </Stack>
    </Section>
  );
}
