import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { TextLink } from "@/components/ui/text-link";

export type MitwirkungSectionProps = {
  title: string;
  subtitle: string;
  text: string;
  activeSurvey: {
    title: string;
    meta: readonly string[];
    href: string;
  };
  paths: readonly {
    label: string;
    description: string;
    href?: string;
  }[];
  primaryCta: {
    label: string;
    href: string;
    external?: boolean;
  };
  secondaryCta: {
    label: string;
    href: string;
    external?: boolean;
  };
};

export function MitwirkungSection({
  title,
  subtitle,
  text,
  activeSurvey,
  paths,
  primaryCta,
  secondaryCta,
}: MitwirkungSectionProps) {
  const surveyMetaText = activeSurvey.meta.join(" · ");

  return (
    <SectionFrame compact>
      <Container>
        <Stack gap="md" className="mitwirkung-layout">
          <Stack gap="sm">
            <SectionHeading title={title} />
            <p className="body-text muted-text section-intro">{subtitle}</p>
            <p className="body-text muted-text section-intro">{text}</p>
          </Stack>
          <div className="card card--cta-accent mitwirkung-survey-card">
            <Stack gap="sm">
              <span className="badge">{activeSurvey.title}</span>
              {surveyMetaText ? <p className="eyebrow muted-text">{surveyMetaText}</p> : null}
              <div className="cta-actions mitwirkung-primary-action">
                <ButtonLink href={primaryCta.href} size="lg" external={primaryCta.external}>
                  {primaryCta.label}
                </ButtonLink>
              </div>
            </Stack>
          </div>
          {paths.map((path) => (
            <p key={path.label} className="small-text muted-text mitwirkung-secondary-link">
              {path.label}{" "}
              {path.href ? (
                <TextLink href={path.href} external={false}>
                  {path.description}
                </TextLink>
              ) : secondaryCta.href ? (
                <TextLink href={secondaryCta.href} external={Boolean(secondaryCta.external)}>
                  {secondaryCta.label}
                </TextLink>
              ) : (
                path.description
              )}
            </p>
          ))}
        </Stack>
      </Container>
    </SectionFrame>
  );
}
