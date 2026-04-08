import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { SectionFrame } from "@/components/ui/section-frame";
import { updatesPage } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Updates",
};

export default function UpdatesPage() {
  return (
    <div className="page-shell">
      <Container>
        <PageHero
          eyebrow={updatesPage.hero.eyebrow}
          title={updatesPage.hero.title}
          text={updatesPage.hero.text}
          metrics={updatesPage.hero.metrics}
          panelTitle={updatesPage.hero.panelTitle}
          panelStats={updatesPage.hero.panelStats}
        />
      </Container>

      <Container>
        <SectionFrame tone="soft">
          <Section
            eyebrow={updatesPage.timeline.eyebrow}
            title={updatesPage.timeline.title}
            text={updatesPage.timeline.text}
          >
            <div className="timeline">
              {updatesPage.timeline.entries.map((entry, index) => (
                <Card
                  key={entry.title}
                  eyebrow={entry.date}
                  title={entry.title}
                  text={entry.text}
                  list={entry.points}
                  span={4}
                  tone={index === 0 ? "accent" : "soft"}
                />
              ))}
            </div>
          </Section>
        </SectionFrame>
      </Container>
    </div>
  );
}
