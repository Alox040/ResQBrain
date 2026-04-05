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
};

export function HeroSection({
  headline,
  subline,
  primaryLabel,
  secondaryLabel,
  statusBadge,
  primaryHref = routes.mitwirkung,
  secondaryHref = routes.home,
}: HeroSectionProps) {
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
          <ButtonLink href={secondaryHref} variant="secondary" size="lg">
            {secondaryLabel}
          </ButtonLink>
        </div>
      </Stack>
    </Section>
  );
}
