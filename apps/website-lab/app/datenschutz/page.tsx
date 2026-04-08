import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionFrame } from "@/components/ui/section-frame";
import { legalContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Datenschutz",
};

export default function DatenschutzPage() {
  return (
    <div className="page-shell">
      <Container>
        <PageHero
          eyebrow={legalContent.datenschutz.hero.eyebrow}
          title={legalContent.datenschutz.hero.title}
          text={legalContent.datenschutz.hero.text}
          panelTitle={legalContent.datenschutz.hero.panelTitle}
          panelStats={legalContent.datenschutz.hero.panelStats}
        />
      </Container>

      <Container>
        <SectionFrame tone="soft">
          <div className="legal-layout">
            {legalContent.datenschutz.sections.map((section) => (
              <section className="legal-panel" key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {"list" in section && section.list ? (
                  <ul>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </SectionFrame>
      </Container>
    </div>
  );
}
