import Link from "next/link";

import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
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
    <Section background="none" containerMaxWidth={760}>
      <Stack gap="var(--space-6)">
        <Stack gap="var(--space-4)" className="hero-centered">
          {statusBadge ? <span className="badge">{statusBadge}</span> : null}
          <h1 className="hero-title">{headline}</h1>
          <p className="body-text muted-text">{subline}</p>
        </Stack>

        <div className="ui8-action-row hero-actions-centered">
          <Link className="button-link" href={primaryHref}>
            {primaryLabel}
          </Link>
          <Link className="button-link button-link--secondary" href={secondaryHref}>
            {secondaryLabel}
          </Link>
        </div>
      </Stack>
    </Section>
  );
}
