import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { SectionFrame } from "@/components/ui/section-frame";
import { linksPage } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Links",
};

export default function LinksPage() {
  return (
    <div className="page-shell">
      <Container>
        <PageHero
          eyebrow={linksPage.hero.eyebrow}
          title={linksPage.hero.title}
          text={linksPage.hero.text}
          metrics={linksPage.hero.metrics}
          panelTitle={linksPage.hero.panelTitle}
          panelStats={linksPage.hero.panelStats}
        />
      </Container>

      <Container>
        <SectionFrame>
          <Section
            eyebrow={linksPage.groups.eyebrow}
            title={linksPage.groups.title}
            text={linksPage.groups.text}
          >
            <div className="card-grid">
              {linksPage.groups.cards.map((card, index) => (
                <Card
                  key={card.title}
                  eyebrow={card.eyebrow}
                  title={card.title}
                  text={card.text}
                  span={4}
                  tone={index === 1 ? "accent" : "default"}
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

      <Container>
        <SectionFrame tone="soft">
          <Section
            eyebrow={linksPage.internal.eyebrow}
            title={linksPage.internal.title}
            text={linksPage.internal.text}
          >
            <div className="card-grid">
              {linksPage.internal.cards.map((card) => (
                <Card
                  key={card.title}
                  eyebrow={card.eyebrow}
                  title={card.title}
                  text={card.text}
                  span={6}
                  tone="soft"
                  actions={<ButtonLink href={card.href}>{card.label}</ButtonLink>}
                />
              ))}
            </div>
          </Section>
        </SectionFrame>
      </Container>
    </div>
  );
}
