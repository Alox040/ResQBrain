import { Card } from "../ui/Card";
import { Container } from "../layout/Container";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

export function TrustSection() {
  return (
    <Section id="trust">
      <Container>
        <SectionHeader
          title="Verantwortung"
          description="Pflege und Freigabe der Inhalte: Organisation. Die App zeigt den zugeordneten Stand. Keine Therapie- oder Diagnosefunktion in der Software."
        />

        <Card variant="muted" padding="comfortable" className="max-w-2xl">
          <ul className="list-reset space-y-6 text-sm leading-[1.55] text-muted md:text-[0.95rem]">
            <li className="flex gap-2">
              <span aria-hidden="true">—</span>
              <span>Impressum und Datenschutz: Footer.</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true">—</span>
              <span>Pilot und Rueckmeldung: Abschnitt Kontakt.</span>
            </li>
          </ul>
        </Card>
      </Container>
    </Section>
  );
}
