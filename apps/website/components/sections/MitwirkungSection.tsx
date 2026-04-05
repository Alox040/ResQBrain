import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";
import { ButtonLink } from "@/components/ui/button-link";

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
      <article className="card card--cta-accent">
        <Stack gap="var(--space-6)">
          <Stack gap="var(--space-4)" className="section-lead">
            <h2 className="section-title">{title}</h2>
            <p className="body-text muted-text section-intro section-intro--compact">{text}</p>
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
