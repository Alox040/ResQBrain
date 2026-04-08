import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { SectionFrame } from "@/components/ui/section-frame";
import { kontaktPage } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Kontakt",
};

export default function KontaktPage() {
  return (
    <div className="page-shell">
      <Container>
        <PageHero
          eyebrow={kontaktPage.hero.eyebrow}
          title={kontaktPage.hero.title}
          text={kontaktPage.hero.text}
          metrics={kontaktPage.hero.metrics}
          actions={
            <ButtonLink href={kontaktPage.hero.primaryCta.href}>
              {kontaktPage.hero.primaryCta.label}
            </ButtonLink>
          }
          panelTitle={kontaktPage.hero.panelTitle}
          panelStats={kontaktPage.hero.panelStats}
        />
      </Container>

      <Container>
        <SectionFrame>
          <Section
            eyebrow={kontaktPage.touchpoints.eyebrow}
            title={kontaktPage.touchpoints.title}
            text={kontaktPage.touchpoints.text}
          >
            <div className="card-grid">
              {kontaktPage.touchpoints.cards.map((card, index) => (
                <Card
                  key={card.title}
                  eyebrow={card.eyebrow}
                  title={card.title}
                  text={card.text}
                  span={4}
                  tone={index === 0 ? "accent" : "default"}
                  actions={
                    <ButtonLink href={card.href} variant="secondary" external={card.external}>
                      {card.label}
                    </ButtonLink>
                  }
                />
              ))}
            </div>
          </Section>
        </SectionFrame>
      </Container>
    </div>
  );
}
