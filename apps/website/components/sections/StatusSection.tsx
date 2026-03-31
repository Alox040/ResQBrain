import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";

type StatusSectionProps = {
  title: string;
  subtitle: string;
  items: readonly string[];
};

export function StatusSection({ title, subtitle, items }: StatusSectionProps) {
  return (
    <Section>
      <div className="status-block">
        <Stack gap="var(--space-4)">
          <h2 className="section-title">{title}</h2>
          <p className="small-text muted-text">{subtitle}</p>
        </Stack>

        <div className="status-cards-grid">
          {items.map((item) => (
            <article className="status-card" key={item}>
              <p className="small-text">{item}</p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
