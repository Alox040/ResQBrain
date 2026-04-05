import Link from "next/link";

import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";

type ContactCtaSectionProps = {
  title: string;
  text: string;
  href: string;
  buttonLabel: string;
};

export function ContactCtaSection({
  title,
  text,
  href,
  buttonLabel,
}: ContactCtaSectionProps) {
  return (
    <Section>
      <article className="contact-cta-card contact-cta-card--emphasis">
        <Stack gap="var(--space-6)" className="contact-cta-content">
          <Stack gap="var(--space-4)">
            <h2 className="section-title">{title}</h2>
            <p className="body-text muted-text section-intro">{text}</p>
          </Stack>

          <div>
            <Link className="button-link button-link--lg" href={href}>
              {buttonLabel}
            </Link>
          </div>
        </Stack>
      </article>
    </Section>
  );
}
