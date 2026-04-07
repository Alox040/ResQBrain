import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";

type ProjectGoalItem = {
  headline: string;
  sentence: string;
};

type ProjectGoalSectionProps = {
  title: string;
  items: [ProjectGoalItem, ProjectGoalItem, ProjectGoalItem];
};

export function ProjectGoalSection({ title, items }: ProjectGoalSectionProps) {
  return (
    <Section>
      <Stack gap="var(--space-7)">
        <div className="section-lead">
          <h2 className="section-title">{title}</h2>
        </div>

        <div className="cards-grid">
          {items.map((item) => (
            <article className="card card--interactive" key={item.headline}>
              <Stack gap="var(--space-3)">
                <h3 className="card-heading">{item.headline}</h3>
                <p className="small-text muted-text">{item.sentence}</p>
              </Stack>
            </article>
          ))}
        </div>
      </Stack>
    </Section>
  );
}
