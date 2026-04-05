import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";

type IdeaItem = {
  headline: string;
  sentence: string;
};

type IdeaSectionProps = {
  title: string;
  items: [IdeaItem, IdeaItem, IdeaItem];
};

export function IdeaSection({ title, items }: IdeaSectionProps) {
  return (
    <Section>
      <Stack gap="var(--space-7)">
        <div className="section-lead">
          <h2 className="section-title">{title}</h2>
        </div>

        <div className="idea-cards-grid">
          {items.map((item) => (
            <article className="idea-card" key={item.headline}>
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
