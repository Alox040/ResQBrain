import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionFrame } from "@/components/ui/section-frame";
import { Stack } from "@/components/ui/stack";
import { homeContent } from "@/lib/site";

export function HeroSection() {
  return (
    <SectionFrame id="hero">
      <Container maxWidth="wide">
        <div className="home-hero">
          <Stack gap="lg">
            <p className="eyebrow">ResQBrain</p>
            <h1 className="hero-title">{homeContent.hero.title}</h1>
            <p className="body-text muted-text home-lead">{homeContent.hero.subtitle}</p>
            <div className="home-actions">
              <ButtonLink href={homeContent.hero.ctaPrimary.href}>
                {homeContent.hero.ctaPrimary.label}
              </ButtonLink>
              <ButtonLink href={homeContent.hero.ctaSecondary.href} variant="secondary">
                {homeContent.hero.ctaSecondary.label}
              </ButtonLink>
            </div>
          </Stack>
        </div>
      </Container>
    </SectionFrame>
  );
}
