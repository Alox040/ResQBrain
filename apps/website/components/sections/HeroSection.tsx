import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { Stack } from "@/components/ui/stack";

type HeroContent = {
  headline: string;
  subheadline: string;
  supportingCopy: string;
  statusIndicator: string;
  current: readonly string[];
  cta: {
    primary: { label: string; href: string; external?: boolean };
    secondary: { label: string; href: string; external?: boolean };
  };
};

type SurveySnippet = {
  title: string;
  meta: readonly string[];
  href: string;
};

type HeroSectionProps = {
  hero: HeroContent;
  survey: SurveySnippet;
};

export function HeroSection({ hero, survey }: HeroSectionProps) {
  return (
    <SectionFrame>
      <Container>
        <div className="layout-split">
          <Stack gap="md">
            <span className="badge badge--hero">{hero.statusIndicator}</span>
            <h1 className="hero-title">{hero.headline}</h1>
            <p className="body-text muted-text hero-subline">{hero.subheadline}</p>
            <p className="body-text muted-text section-intro">{hero.supportingCopy}</p>
            <div className="cta-actions">
              <ButtonLink href={hero.cta.primary.href} size="lg" external={hero.cta.primary.external}>
                {hero.cta.primary.label}
              </ButtonLink>
              <ButtonLink
                href={hero.cta.secondary.href}
                variant="secondary"
                size="lg"
                external={hero.cta.secondary.external}
              >
                {hero.cta.secondary.label}
              </ButtonLink>
            </div>
          </Stack>

          <ContentCard>
            <Stack gap="md">
              <span className="badge">{survey.title}</span>
              <div className="ui8-action-row">
                {survey.meta.slice(0, 2).map((item) => (
                  <span key={item} className="badge">
                    {item}
                  </span>
                ))}
              </div>
              {survey.meta.length > 2 ? <p className="small-text muted-text">{survey.meta.slice(2).join(" · ")}</p> : null}
              <div className="status-cards-grid">
                {hero.current.map((item) => (
                  <div key={item} className="card card--nested">
                    <p className="small-text status-card-label">{item}</p>
                  </div>
                ))}
              </div>
            </Stack>
          </ContentCard>
        </div>
      </Container>
    </SectionFrame>
  );
}
