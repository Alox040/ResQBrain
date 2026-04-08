import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { CtaPanel } from "@/components/ui/cta-panel";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { SectionFrame } from "@/components/ui/section-frame";
import { mitwirkungPage } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Mitwirkung",
};

export default function MitwirkungPage() {
  return (
    <div className="page-shell">
      <Container>
        <PageHero
          eyebrow={mitwirkungPage.hero.eyebrow}
          title={mitwirkungPage.hero.title}
          text={mitwirkungPage.hero.text}
          metrics={mitwirkungPage.hero.metrics}
          actions={
            <>
              <ButtonLink href={mitwirkungPage.hero.primaryCta.href} external>
                {mitwirkungPage.hero.primaryCta.label}
              </ButtonLink>
              <ButtonLink href={mitwirkungPage.hero.secondaryCta.href} variant="secondary">
                {mitwirkungPage.hero.secondaryCta.label}
              </ButtonLink>
            </>
          }
          panelTitle={mitwirkungPage.hero.panelTitle}
          panelStats={mitwirkungPage.hero.panelStats}
        />
      </Container>

      <Container>
        <SectionFrame>
          <Section
            eyebrow={mitwirkungPage.channels.eyebrow}
            title={mitwirkungPage.channels.title}
            text={mitwirkungPage.channels.text}
          >
            <div className="card-grid">
              {mitwirkungPage.channels.cards.map((card, index) => (
                <Card
                  key={card.title}
                  eyebrow={card.eyebrow}
                  title={card.title}
                  text={card.text}
                  list={card.points}
                  span={4}
                  tone={index === 0 ? "accent" : "default"}
                />
              ))}
            </div>
          </Section>
        </SectionFrame>
      </Container>

      <Container>
        <SectionFrame tone="soft">
          <Section
            eyebrow={mitwirkungPage.process.eyebrow}
            title={mitwirkungPage.process.title}
            text={mitwirkungPage.process.text}
          >
            <div className="timeline">
              {mitwirkungPage.process.steps.map((step) => (
                <Card
                  key={step.title}
                  eyebrow={step.eyebrow}
                  title={step.title}
                  text={step.text}
                  span={4}
                  tone="soft"
                />
              ))}
            </div>
          </Section>
        </SectionFrame>
      </Container>

      <Container>
        <CtaPanel
          eyebrow="Naechster Schritt"
          title="Rueckmeldung soll schnell und belastbar bleiben."
          text="Die Lab-App vermeidet Demo-Rhetorik. Wer mitwirken will, soll direkt in Umfrage oder Kontakt gehen koennen, ohne erst durch lose Projektfloskeln zu navigieren."
          actions={
            <>
              <ButtonLink href={mitwirkungPage.hero.primaryCta.href} external>
                {mitwirkungPage.hero.primaryCta.label}
              </ButtonLink>
              <ButtonLink href={mitwirkungPage.hero.secondaryCta.href} variant="quiet">
                {mitwirkungPage.hero.secondaryCta.label}
              </ButtonLink>
            </>
          }
        />
      </Container>
    </div>
  );
}
