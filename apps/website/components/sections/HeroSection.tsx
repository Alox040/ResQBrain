import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { Stack } from "@/components/ui/stack";
import type { LandingPageHero } from "@/lib/site/content";
import { surveys } from "@/lib/site/survey";

export type HeroSectionProps = {
  hero: LandingPageHero;
  survey: {
    title: string;
    meta: readonly string[];
  };
};

export function HeroSection({ hero, survey }: HeroSectionProps) {
  const surveyMetaText = survey.meta.join(" · ");

  return (
    <SectionFrame density="hero">
      <Container maxWidth="wide">
        <div className="layout-split">
          <Stack gap="md" className="hero-centered">
            <span className="badge badge--hero">{hero.statusIndicator}</span>
            <h1 className="hero-title">{hero.headline}</h1>
            <p className="hero-subline muted-text">{hero.subheadline}</p>
            {hero.current.length > 0 ? (
              <ul className="body-text muted-text">
                {hero.current.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            <div className="ui8-action-row hero-actions-centered">
              <Button href={hero.cta.primary.href} size="lg" variant="primary">
                {hero.cta.primary.label}
              </Button>
              <Button
                href={hero.cta.secondary.href}
                size="lg"
                variant="ghost"
                target={hero.cta.secondary.external ? "_blank" : undefined}
                rel={hero.cta.secondary.external ? "noopener noreferrer" : undefined}
              >
                {hero.cta.secondary.label}
              </Button>
            </div>
          </Stack>

          <ContentCard variant="accent">
            <Stack gap="sm">
              <span className="badge">{survey.title}</span>
              {surveyMetaText ? <p className="eyebrow muted-text">{surveyMetaText}</p> : null}
              <div className="cta-actions">
                <ButtonLink href={surveys.active.href} size="lg" external>
                  Zur Umfrage
                </ButtonLink>
              </div>
            </Stack>
          </ContentCard>
        </div>
      </Container>
    </SectionFrame>
  );
}
