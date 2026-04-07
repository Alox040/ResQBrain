import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { ButtonLink } from "@/components/ui/button-link";

type MitwirkungSectionProps = {
  title: string;
  text: string;
  href: string;
  buttonLabel: string;
  surveyBadge?: string;
  surveyDescription?: string;
  surveyDate?: string;
};

export function MitwirkungSection({
  title,
  text,
  href,
  buttonLabel,
  surveyBadge,
  surveyDescription,
  surveyDate,
}: MitwirkungSectionProps) {
  const hasMeta = surveyBadge || surveyDescription || surveyDate;

  return (
    <Section>
      <article className="card card--cta-accent">
        <Stack gap="var(--space-6)">
          <Stack gap="var(--space-4)" className="section-lead">
            <h2 className="section-title">{title}</h2>
            <p className="body-text muted-text section-intro section-intro--compact">{text}</p>
          </Stack>

          {hasMeta && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
              {surveyBadge && <span className="badge">{surveyBadge}</span>}
              {surveyDescription && <span className="eyebrow muted-text">{surveyDescription}</span>}
              {surveyDate && <span className="eyebrow muted-text">Stand: {surveyDate}</span>}
            </div>
          )}

          <div className="cta-actions">
            <ButtonLink href={href} size="lg">
              {buttonLabel}
            </ButtonLink>
          </div>
        </Stack>
      </article>
    </Section>
  );
}
