import Link from "next/link";

import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";

type MitwirkungSectionProps = {
  title: string;
  text: string;
  href: string;
  buttonLabel: string;
};

export function MitwirkungSection({
  title,
  text,
  href,
  buttonLabel,
}: MitwirkungSectionProps) {
  return (
    <Section>
      <article className="mitwirkung-card mitwirkung-card--accent">
        <Stack gap="var(--space-6)">
          <Stack gap="var(--space-4)" className="section-lead">
            <h2 className="section-title">{title}</h2>
            <p className="body-text muted-text section-intro section-intro--compact">{text}</p>
          </Stack>

          <div className="mitwirkung-actions">
            <Link className="button-link button-link--lg" href={href}>
              {buttonLabel}
            </Link>
          </div>
        </Stack>
      </article>
    </Section>
  );
}
