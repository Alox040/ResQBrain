import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { CtaPanel } from "@/components/ui/cta-panel";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { SectionFrame } from "@/components/ui/section-frame";
import { homePage } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Start",
};

export default function HomePage() {
  return (
    <div className="page-shell">
      <Container>
        <PageHero
          eyebrow={homePage.hero.eyebrow}
          title={homePage.hero.title}
          text={homePage.hero.text}
          metrics={homePage.hero.metrics}
          actions={
            <>
              <ButtonLink href={homePage.hero.primaryCta.href}>
                {homePage.hero.primaryCta.label}
              </ButtonLink>
              <ButtonLink href={homePage.hero.secondaryCta.href} variant="secondary" external>
                {homePage.hero.secondaryCta.label}
              </ButtonLink>
            </>
          }
          panelTitle={homePage.hero.panelTitle}
          panelStats={homePage.hero.panelStats}
        />
      </Container>

      <Container>
        <SectionFrame>
          <Section
            eyebrow={homePage.story.eyebrow}
            title={homePage.story.title}
            text={homePage.story.text}
          >
            <div className="card-grid">
              {homePage.story.cards.map((card) => (
                <Card
                  key={card.title}
                  eyebrow={card.eyebrow}
                  title={card.title}
                  text={card.text}
                  span={4}
                  tone="soft"
                />
              ))}
            </div>
          </Section>
        </SectionFrame>
      </Container>

      <Container>
        <SectionFrame tone="soft">
          <Section
            eyebrow={homePage.system.eyebrow}
            title={homePage.system.title}
            text={homePage.system.text}
          >
            <div className="split-grid">
              <Card
                eyebrow={homePage.system.foundation.eyebrow}
                title={homePage.system.foundation.title}
                text={homePage.system.foundation.text}
                list={homePage.system.foundation.points}
                span={7}
                tone="accent"
              />
              <Card
                eyebrow={homePage.system.delivery.eyebrow}
                title={homePage.system.delivery.title}
                text={homePage.system.delivery.text}
                list={homePage.system.delivery.points}
                span={5}
              />
            </div>
          </Section>
        </SectionFrame>
      </Container>

      <Container>
        <SectionFrame>
          <Section
            eyebrow={homePage.audience.eyebrow}
            title={homePage.audience.title}
            text={homePage.audience.text}
          >
            <div className="card-grid">
              {homePage.audience.cards.map((card) => (
                <Card
                  key={card.title}
                  eyebrow={card.eyebrow}
                  title={card.title}
                  text={card.text}
                  span={4}
                  meta={["Einsatz", "Ausbildung", "Organisation"]}
                />
              ))}
            </div>
          </Section>
        </SectionFrame>
      </Container>

      <Container>
        <CtaPanel
          eyebrow={homePage.cta.eyebrow}
          title={homePage.cta.title}
          text={homePage.cta.text}
          actions={
            <>
              <ButtonLink href={homePage.cta.primary.href}>
                {homePage.cta.primary.label}
              </ButtonLink>
              <ButtonLink href={homePage.cta.secondary.href} variant="secondary" external>
                {homePage.cta.secondary.label}
              </ButtonLink>
            </>
          }
          aside={
            <div className="cta-panel__stack">
              <Card
                eyebrow="Mitwirkung"
                title={homePage.cta.primary.title}
                text={homePage.cta.primary.text}
                span={8}
                tone="soft"
              />
              <Card
                eyebrow="Projektzugang"
                title={homePage.cta.secondary.title}
                text={homePage.cta.secondary.text}
                span={8}
              />
            </div>
          }
        />
      </Container>
    </div>
  );
}
