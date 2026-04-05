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
      <div className="card status-block">
        <Stack gap="var(--space-5)" className="section-lead">
          <h2 className="section-title">{title}</h2>
          <p className="body-text muted-text section-intro section-intro--compact">{subtitle}</p>
        </Stack>

        <div className="status-cards-grid">
          {items.map((item) => (
            <article className="card card--nested" key={item}>
              <p className="small-text status-card-label">{item}</p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
