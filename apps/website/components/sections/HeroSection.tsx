import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { ButtonLink } from "@/components/ui/button-link";
import { routes } from "@/lib/routes";

type HeroSectionProps = {
  headline: string;
  subline: string;
  primaryLabel: string;
  secondaryLabel: string;
  statusBadge?: string;
  primaryHref?: string;
  secondaryHref?: string;
  secondaryExternal?: boolean;
  surveyBadge?: string;
  surveyDescription?: string;
  surveyDate?: string;
  hints?: readonly string[];
};

export function HeroSection({
  headline,
  subline,
  primaryLabel,
  secondaryLabel,
  statusBadge,
  primaryHref = routes.mitwirkung,
  secondaryHref = routes.home,
  secondaryExternal = false,
  surveyBadge,
  surveyDescription,
  surveyDate,
  hints,
}: HeroSectionProps) {
  const hasSurveyMeta = surveyBadge || surveyDescription || surveyDate;

  return (
    <Section
      background="none"
      className="section-frame--hero"
      containerWidth="hero"
    >
      <Stack gap="var(--space-7)">
        <Stack gap="var(--space-5)" className="hero-centered">
          {statusBadge ? <span className="badge badge--hero">{statusBadge}</span> : null}
          <h1 className="hero-title">{headline}</h1>
          <p className="body-text muted-text hero-subline">{subline}</p>
        </Stack>

        <div className="ui8-action-row hero-actions-centered">
          <ButtonLink href={primaryHref} size="lg">
            {primaryLabel}
          </ButtonLink>
          <ButtonLink href={secondaryHref} variant="secondary" size="lg" external={secondaryExternal}>
            {secondaryLabel}
          </ButtonLink>
        </div>

        {hints && hints.length > 0 && (
          <p className="eyebrow muted-text" style={{ textAlign: "center", margin: 0 }}>
            {hints.join(" · ")}
          </p>
        )}

        {hasSurveyMeta && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
            {surveyBadge && <span className="badge">{surveyBadge}</span>}
            {surveyDescription && <span className="eyebrow muted-text">{surveyDescription}</span>}
            {surveyDate && <span className="eyebrow muted-text">Stand: {surveyDate}</span>}
          </div>
        )}
      </Stack>
    </Section>
  );
}
