import { Card } from "../ui/Card";
import { EmergencyProtocolCard } from "../ui/EmergencyProtocolCard";
import { Container } from "../layout/Container";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

const cases = [
  {
    title: "Einsatz",
    text: "Medikation und Algorithmus gleichzeitig. Wenig Tap, wenig Suche.",
  },
  {
    title: "Dienst",
    text: "Abgleich mit dem Freigabestand der eigenen Organisation.",
  },
  {
    title: "Ausbildung",
    text: "Gleicher Datenbestand wie unter Einsatzbedingungen — nur offline tauglich, wenn gebaut.",
  },
];

export function UseCasesSection() {
  return (
    <Section id="use-cases">
      <Container>
        <SectionHeader title="Einsatz" description="Drei feste Nutzungskontexte. Kein weiterer Anspruch." />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {cases.map((c) => (
            <Card key={c.title} padding="comfortable">
              <h3 className="m-0 text-[1.05rem] font-semibold text-foreground">{c.title}</h3>
              <p className="mb-0 mt-3 text-sm leading-[1.55] text-muted md:text-[0.95rem]">{c.text}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 md:mt-10">
          <div className="mx-auto max-w-3xl">
            <EmergencyProtocolCard
              title="Reanimation Erwachsene"
              category="Notfall"
              lastUpdated="Heute"
              priority="critical"
              steps={8}
              version="2.1"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
