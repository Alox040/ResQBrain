import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionFrame } from "@/components/ui/section-frame";
import { legalContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Impressum",
};

export default function ImpressumPage() {
  return (
    <div className="page-shell">
      <Container>
        <PageHero
          eyebrow={legalContent.impressum.hero.eyebrow}
          title={legalContent.impressum.hero.title}
          text={legalContent.impressum.hero.text}
          panelTitle={legalContent.impressum.hero.panelTitle}
          panelStats={legalContent.impressum.hero.panelStats}
        />
      </Container>

      <Container>
        <SectionFrame>
          <div className="legal-layout">
            <section className="legal-panel">
              <h2>Angaben gemaess Paragraph 5 TMG</h2>
              <p>Projekt: {legalContent.impressum.project}</p>
              <p>Verantwortlich: {legalContent.impressum.responsible}</p>
              <p>E-Mail: {legalContent.impressum.email}</p>
              <p>{legalContent.impressum.note}</p>
            </section>

            <section className="legal-panel">
              <h2>Redaktionelle Ausrichtung</h2>
              <p>{legalContent.impressum.editorial}</p>
            </section>

            <section className="legal-panel">
              <h2>Hinweis zum Projektstand</h2>
              <p>{legalContent.impressum.stage}</p>
            </section>
          </div>
        </SectionFrame>
      </Container>
    </div>
  );
}
