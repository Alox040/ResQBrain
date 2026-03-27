import { Card } from "../ui/Card";
import { Container } from "../layout/Container";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

const pillars = [
  {
    title: "Ein Bestand",
    text: "Algorithmen, Medikamente, SOP in einer App. Zuordnung zur Organisation.",
  },
  {
    title: "Version",
    text: "Freigabestand ist kennzeichbar. Kein unklares Datei-Mixen.",
  },
  {
    title: "Zugriff",
    text: "Listen und Detail direkt. Schnell erfassbar. Ohne Netz, wenn der lokale Stand es erlaubt.",
  },
];

export function SolutionSection() {
  return (
    <Section id="solution">
      <Container>
        <SectionHeader
          title="Loesung"
          description="Gebundelte Inhalte auf dem Endgeraet. Technisch klar umrissen."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {pillars.map((p) => (
            <Card key={p.title} padding="comfortable">
              <h3 className="m-0 text-[1.05rem] font-semibold text-foreground">{p.title}</h3>
              <p className="mb-0 mt-3 text-sm leading-[1.55] text-muted md:text-[0.95rem]">{p.text}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
