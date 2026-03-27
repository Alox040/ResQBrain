import { Card } from "../ui/Card";
import { Container } from "../layout/Container";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

const problems = [
  "Inhalte verteilt: PDF, Share, Ordner.",
  "Listen und Algorithmen weichen je Träger oder Region.",
  "Neuer Stand — Einsatzkraefte sehen ihn oft zu spaet.",
];

export function ProblemSection() {
  return (
    <Section id="problem">
      <Container>
        <SectionHeader title="Problem" description="Kein gemeinsamer, gueltiger Stand auf dem Geraet." />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {problems.map((problem) => (
            <Card key={problem} padding="comfortable">
              <p className="m-0 text-sm leading-relaxed text-muted md:text-[0.98rem] md:leading-[1.6]">
                {problem}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
