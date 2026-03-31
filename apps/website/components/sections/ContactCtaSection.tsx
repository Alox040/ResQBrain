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
      <article className="contact-cta-card">
        <Stack gap="var(--space-5)" className="contact-cta-content">
          <Stack gap="var(--space-3)">
            <h2 className="section-title">{title}</h2>
            <p className="body-text muted-text">{text}</p>
          </Stack>

          <div>
            <Link className="button-link" href={href}>
              {buttonLabel}
            </Link>
          </div>
        </Stack>
      </article>
    </Section>
  );
}
