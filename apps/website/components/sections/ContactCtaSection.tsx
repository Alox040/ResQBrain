import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { ButtonLink } from "@/components/ui/button-link";

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
      <article className="card card--cta-accent">
        <Stack gap="var(--space-6)" className="contact-cta-content">
          <Stack gap="var(--space-4)">
            <h2 className="section-title">{title}</h2>
            <p className="body-text muted-text section-intro">{text}</p>
          </Stack>

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
