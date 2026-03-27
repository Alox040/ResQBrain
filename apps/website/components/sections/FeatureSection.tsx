import { Card } from "../ui/Card";
import { Container } from "../layout/Container";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

const features = [
  {
    title: "Medikamente",
    text: "Liste, Suche, Detail. Hinweise und Dosierung in der Ansicht.",
  },
  {
    title: "Algorithmen",
    text: "Schritte in Liste und Detail. Direkt ablesbar.",
  },
  {
    title: "Lokal / ohne Netz",
    text: "Daten liegen lokal. Lesen ohne Mobilfunk, sofern der gebaute Stand das abdeckt.",
  },
];

export function FeatureSection() {
  return (
    <Section id="features">
      <Container>
        <SectionHeader title="Funktionen" description="Stand der Software \u2014 ohne Ausblick auf spaetere Releases." />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {features.map((feature) => (
            <Card key={feature.title} padding="comfortable">
              <h3 className="m-0 text-[1.05rem] font-semibold text-foreground">{feature.title}</h3>
              <p className="mb-0 mt-3 text-sm leading-[1.55] text-muted md:text-[0.95rem]">{feature.text}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
