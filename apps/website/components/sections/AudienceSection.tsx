import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";

type AudienceItem = {
  title: string;
  text: string;
};

type AudienceSectionProps = {
  title: string;
  intro: string;
  items: readonly AudienceItem[];
};

export function AudienceSection({ title, intro, items }: AudienceSectionProps) {
  return (
    <Section>
      <Stack gap="var(--space-6)">
        <Stack gap="var(--space-3)">
          <h2 className="section-title">{title}</h2>
          <p className="body-text muted-text">{intro}</p>
        </Stack>

        <div className="audience-cards-grid">
          {items.map((item) => (
            <article className="audience-card" key={item.title}>
              <Stack gap="var(--space-2)">
                <h3 className="audience-card-title">{item.title}</h3>
                <p className="small-text muted-text">{item.text}</p>
              </Stack>
            </article>
          ))}
        </div>
      </Stack>
    </Section>
  );
}
